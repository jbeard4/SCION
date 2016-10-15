var $klay = require('klayjs');

function KGraph(idGeneratorFn){
  this._generateStateId = idGeneratorFn;
}

KGraph.prototype = {
  updateKgraph : function(kgraph, options, cb){
    this._populateIdMap(kgraph);
    this._populateChildToParentMap(kgraph);

    this._normalizeKgraphTransitionTargets(kgraph);
    this._applyInitialCoordinates(kgraph);
    console.log('kgraph',JSON.stringify(kgraph,4,4));
    $klay.layout({     //TODO: refactor to use CommonJS
      graph : kgraph,
      options : options,
      success : function(g){ 
        console.log('render kgraph',JSON.stringify(kgraph,4,4));
        cb(null, g);
      }.bind(this)
    });
    return kgraph;
  },

  _normalizeKgraphTransitionTargets : function(kgraph){

    //walk through states
    walk.call(this, kgraph, kgraph);

    function walk(parentState, state){
      //look for state.transitions.targets
      if(state.edges){
        state.edges.forEach(function(edge){

          //Tranistion types: 
          // 0. A -> B
          // 1. A1 -> A, internal = false
          // 2. A1 -> A, internal = true
          // 3. A -> A1, internal = false
          // 4. A -> A1, internal = true
          // 5. A -> A, internal = false
          // 6. A -> A, internal = true
          // 7. A (targetless transition)
          // 8. A -> [ A1, A2 ]
          // 9. A -> [ B1, B2 ]

          var isSelfLoop = edge.source === edge.target,
              isTargetless = !edge.target,
              sourceIsAncestorOfTarget = this.isSourceAncestorOfTarget(edge.source, edge.target),
              targetIsAncestorOfSource = this.isSourceAncestorOfTarget(edge.target, edge.source),
              isOrthogonal = !sourceIsAncestorOfTarget && !targetIsAncestorOfSource && !isSelfLoop,
              isInternal = edge.$type === 'internal';
              
          if(isOrthogonal){
            // 0. A -> B
            if(isInternal){
              throw new Error('Unexpected internal transition');
            }

            // pass. do nothing
            if(edge.$type === 'hyperlink') delete edge.$type;
          } else if (targetIsAncestorOfSource) {
            if(!isInternal){
              // 1. A1 -> A, internal = false
              
              //add an entry port and an exit port
              var sourceState = this._idMap[edge.source],
                  targetState = this._idMap[edge.target];

              sourceState.ports = sourceState.ports || [];
              var portCount = sourceState.ports.length / 2,
                  stateEnterId = edge.target + '_enter' + portCount,
                  stateExitId = edge.target + '_exit' + portCount;

              //add ports to parent state
              targetState.ports = targetState.ports || [];
              var 
                entryPort = {
                  id: stateEnterId, 
                  //properties: {
                  //  'de.cau.cs.kieler.portSide' : 'NORTH'
                  //}
                },
                exitPort = {
                  id: stateExitId,
                  //properties: {
                  //  'de.cau.cs.kieler.portSide' : 'EAST'
                  //}
                };
              targetState.ports.push( entryPort, exitPort);

              edge.targetPort = stateExitId;    //change the edge to target the exit port
              edge.$type = 'hyperlink';

              //add a self-loop, from exit port to entry port
              targetState.edges = targetState.edges || [];
              targetState.edges.push({
                id : stateExitId + '_' + stateEnterId,
                source : edge.target,
                target : edge.target,
                sourcePort : stateExitId,
                targetPort : stateEnterId,
                labels : []
              });

            } else {
              // 2. A1 -> A, internal = true

              //pass
              if(edge.$type === 'hyperlink') delete edge.$type;
            }
          } else if (sourceIsAncestorOfTarget) {
            if(!isInternal){
              // 3. A -> A1, internal = false
              
              //add an entry port and an exit port
              var sourceState = this._idMap[edge.source],
                  targetState = this._idMap[edge.target];

              sourceState.ports = sourceState.ports || [];
              var portCount = sourceState.ports.length / 2,
                  stateEnterId = edge.source + '_enter' + portCount,
                  stateExitId = edge.source + '_exit' + portCount;

              //add ports to parent state
              sourceState.ports = sourceState.ports || [];
              var 
                entryPort = {
                  id: stateEnterId, 
                  //properties: {
                  //  'de.cau.cs.kieler.portSide' : 'NORTH'
                  //}
                },
                exitPort = {
                  id: stateExitId,
                  //properties: {
                  //  'de.cau.cs.kieler.portSide' : 'EAST'
                  //}
                };
              sourceState.ports.push( entryPort, exitPort);

              //set up target enter port
              var targetEnterPort = {id : "target_enter0"};
              targetState.ports = [ targetEnterPort ];

              //teleport edge
              edge.sourcePort = stateEnterId;    //change the edge to target the exit port
              edge.targetPort = targetEnterPort.id; 

              //add a self-loop, from exit port to entry port
              parentState.edges = parentState.edges || [];

              var loopHyperlink = {
                id : stateExitId + '_' + stateEnterId,
                source : edge.source,
                target : edge.source,
                sourcePort : stateExitId,
                targetPort : stateEnterId,
                $type : 'hyperlink',
                labels : []
              };
              parentState.edges.push(loopHyperlink);

            } else {
              // 4. A -> A1, internal = true
            }
          }
        }, this);
      }

      //recurse
      if(state.children){
        state.children.forEach(walk.bind(this, state));
      }
    }
  },

  _clearBendpoints : function(parent) {
    if (parent.edges) {
      parent.edges.forEach(function(e) {
        e.sourcePoint = {x:0, y:0};
        e.targetPoint = {x:0, y:0};
        e.bendPoints = [];
      });
    }
    if (parent.children) {
      parent.children.forEach(function(c) {
        this._clearBendpoints(c);
      }.bind(this));
    }
  },

  _applyInitialCoordinates : function(parent) {
    if (parent.children) {
      parent.children.forEach(function(c) {
     
        if (c.properties && c.properties["de.cau.cs.kieler.position"]) {
          var position = c.properties["de.cau.cs.kieler.position"].split(",");
          c.x = parseInt(position[0],10);
          c.y = parseInt(position[1],10);
        } else {
          c.x = 0;
          c.y = 0;
        }
     
        this._applyInitialCoordinates(c);
      }.bind(this));
    }
  },

  _getKgraphNodeById : function(kgraphNodeId){
    return this._idMap[kgraphNodeId];
  },

  _populateIdMap : function(graphRoot){

    this._idMap = {};
    var walk = (function(graphNode){
      this._idMap[graphNode.id] = graphNode;
      if(graphNode.children) graphNode.children.forEach(walk);
    }.bind(this));

    walk(graphRoot);
    
  },

  _populateChildToParentMap : function(graphRoot){

    this._childToParentMap = {};
    var walk = (function(parentGraphNode, graphNode){
      if(parentGraphNode) this._childToParentMap[graphNode.id] = parentGraphNode.id;
      if(graphNode.children) graphNode.children.forEach(walk.bind(this,graphNode));
    }.bind(this));

    walk(null, graphRoot);
  },

  _createPseudonodeAndSpliceEdge : function(parentState, edge){
    console.log('_createPseudonodeAndSpliceEdge', 'parentState', parentState.id);
    if(!parentState.children) parentState.children = [];

    var pseudonode = this._createPseudonode(parentState);

    var grandparentNode = this._getKgraphNodeById(this._getParentKGraphNode(parentState.id));
    if(!grandparentNode) grandparentNode = parentState;

    grandparentNode.edges.push(
      {
        id : pseudonode.id + '_' + edge.target,
        source: pseudonode.id,
        target: edge.target
      }
    );

    //adjust transition target to target pseudonode
    edge.target = pseudonode.id; 
    edge.$type = 'hyperlink';
  },

  isSourceAncestorOfTarget : function(sourceId, targetId){
    var foundTargetInSourceDescendants = false;
    function walk(currentNode){
      if(foundTargetInSourceDescendants) return;
      foundTargetInSourceDescendants = currentNode.id === targetId;
      if(currentNode.children) currentNode.children.forEach(walk);
    }

    var sourceNode = this._idMap[sourceId];
    if(sourceNode.children) sourceNode.children.forEach(walk);
    return foundTargetInSourceDescendants; 
  },

  _createPseudonode : function(parentNode){
    var pseudoNodeStateId = this._generateStateId();

    //create a pseudonode with an edge originating for each hyperedge target
    var pseudonode = {
      id :  pseudoNodeStateId,
      $type: "pseudonode",
      width : 0,
      height : 0,
      edges : []
    };

    parentNode.children.push(pseudonode);

    this._idMap[pseudonode.id] = pseudonode;
    this._childToParentMap[pseudonode.id] = parentNode.id;

    return pseudonode;
  },

  _getParentKGraphNode : function(nodeId){
    return this._childToParentMap[nodeId];
  }
};

module.exports = KGraph;
