var $klay = require('klayjs'),
    EventEmitter = require('events'),
    SCJSONToKGraphTransformer = require('./SCJSONToKGraphTransformer'),
    jsondiffpatch = require('jsondiffpatch');
    _ = require('underscore');

class KGraph extends SCJSONToKGraphTransformer {

  constructor(idGeneratorFn, svg, scjson){
    super(idGeneratorFn, svg);
    this._generateStateId = idGeneratorFn;

    var newKlayToScjsonMap, newKgraphRoot; 
    [newKlayToScjsonMap, newKgraphRoot] = super.transform(scjson);
    newKgraphRoot.on('update', function(){
      this.emit('update');
    }.bind(this));
    this._klayToScjsonMap = newKlayToScjsonMap; 
    this._kgraphRoot = newKgraphRoot;
    this._normalize(this._kgraphRoot);
  }

  get root (){
    return this._kgraphRoot;
  } 

  patch(newKgraph, cb){
    var patch = jsondiffpatch.diff(this._kgraphRoot, newKgraph.root);
    jsondiffpatch.patch(this._kgraphRoot, patch);   
    return this._updateKgraph(this._kgraphRoot, this._options, cb);
  }

  _normalize(kgraph){
    this._populateIdMap(kgraph);
    this._populateChildToParentMap(kgraph);

    this._normalizeKgraphTransitionTargets(kgraph);
  }

  update(options, cb){
    this._options = options;
    return this._updateKgraph(this._kgraphRoot, options, cb);
  }

  _updateKgraph(kgraph, options, cb){
    this._populateIdMap(kgraph);
    this._populateChildToParentMap(kgraph);

    this._applyInitialCoordinates(kgraph);
    console.log('kgraph',JSON.stringify(kgraph,4,4));
    try {
      $klay.layout({
        graph : kgraph,
        options : options,
        success : function(g){ 
          try {
            this._svg.render(this);   //TODO: move this back out?
            cb(null, kgraph);
          } catch(e){
            cb(e); 
          }
        }.bind(this)
      });
    } catch(e){
      cb(e); 
    }
    return kgraph;
  }

  _normalizeKgraphTransitionTargets(kgraph){

    //walk through states
    walk.call(this, kgraph, kgraph);

    function walk(parentState, state){
      //look for state.transitions.targets
      if(state.edges){
        state.edges.slice().forEach(function(edge){

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

          var isTargetless = !edge.target,
              isInternal = edge.$type === 'internal';
              
          if(!Array.isArray(edge.target)){

            var sourceIsAncestorOfTarget = this.isSourceAncestorOfTarget(edge.source, edge.target),
                targetIsAncestorOfSource = this.isSourceAncestorOfTarget(edge.target, edge.source),
                isSelfLoop = edge.source === edge.target,
                isOrthogonal = !sourceIsAncestorOfTarget && !targetIsAncestorOfSource && !isSelfLoop,
                sourceState = this._idMap[edge.source],
                targetState = this._idMap[edge.target];

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
                var ports = this._addPortsToState(targetState);
                this._edgeToHyperlinkAndTargetPort(edge, ports.exitPort.id);
                var selfLoopEdge = this._addSelfLoopToState(targetState, edge.target, ports, false);
                selfLoopEdge.$hyperlink = edge.id;
              } else {
                // 2. A1 -> A, internal = true
                this._resetEdgeType(edge);
              }
            } else if (sourceIsAncestorOfTarget) {
              if(!isInternal){
                // 3. A -> A1, internal = false
                
                var targetPorts = this._addPortsToState(targetState),
                    sourcePorts = this._addPortsToState(sourceState);

                edge.sourcePort = sourcePorts.entryPort.id ;
                edge.targetPort = targetPorts.entryPort.id; 

                //TODO: swap out parentState for grandparentNode, see below
                var selfLoopEdge = this._addSelfLoopToState(parentState, edge.source, sourcePorts, true);

                //swap labels
                var tmpLabels = selfLoopEdge.labels;
                selfLoopEdge.labels = edge.labels;
                edge.labels = tmpLabels;

                edge.$hyperlink = selfLoopEdge.id;
              } else {
                // 4. A -> A1, internal = true
              }
            } else if (isSelfLoop) {
              if(isInternal){
                // 5. A -> A, internal = false
                // default behavior is fine
              }else{
                // 6. A -> A, internal = true
                // FIXME: This case is not currently supported. How do we self loop inside with KlayJS? 
              }
            } else if (isTargetless){
              // 7. A (targetless transition)
            } else {
              throw new Error('Unexpected type');
            } 
          } else {
            // he is a hyperedge
            sourceIsAncestorOfTarget = edge.target.some(function(target){ return this.isSourceAncestorOfTarget(edge.source, target); }, this);
            targetIsAncestorOfSource = edge.target.some(function(target){ return this.isSourceAncestorOfTarget(target, edge.source); }, this);
            sourceState = this._idMap[edge.source];
            var targetStates = edge.target.map(function(target){return this._idMap[target];}, this);

            //we'll add our edges to the parent of the source state
            var grandparentNode = this._getKgraphNodeById(this._getParentKGraphNode(sourceState.id));
            if(!grandparentNode) grandparentNode = parentState;

            if(sourceIsAncestorOfTarget) {

              ports = this._addPortsToState(sourceState);
              if(!isInternal){
                // 8. A -> [ A1, A2 ], internal = false
                
                //create self loop on A.
                var selfLoop = this._addSelfLoopToState(grandparentNode, edge.source, ports, true);
                selfLoop.labels.push.apply(selfLoop.labels, edge.labels);
              } 

              // 9. A -> [ A1, A2 ], internal = true | false. default case

              //remove old edge 
              state.edges.splice(state.edges.indexOf(edge),1);

              // create two new edges 
              //  A.entry_port -> A1, A.entry_port -> A2
              //    sourceState.entryPort.id -> targets[0].entryPort
              //    sourceState.entryPort.id -> targets[1].entryPort
              targetStates.forEach(function(targetState){
                var targetPorts = this._addPortsToState(targetState);

                grandparentNode.edges = grandparentNode.edges || [];
                var innerEdge = {
                  id : edge.source + '_' + targetState.id,
                  source : edge.source,
                  target : targetState.id,
                  sourcePort : ports.entryPort.id,
                  targetPort : targetPorts.entryPort.id,
                  labels : []
                };
                if(selfLoop) innerEdge.$hyperlink = selfLoop.id;
                grandparentNode.edges.push(innerEdge);
                return innerEdge;

              }, this);

            } else {
              // 10. A -> [ B1, B2 ]

              // Becomes A -> P.entryPort, P.entryPort -> B1.entryPort, P.entryPort -> B2.entryPort

              var sourcePorts = this._addPortsToState(sourceState);

              //get their common parallel ancestor
              var commonParallelAncestor = this._getLCA(edge.target);
              console.log('commonParallelAncestor',commonParallelAncestor); 

              var lcaPorts = this._addPortsToState(commonParallelAncestor);

              //repurpose the old edge
              this._edgeToHyperlinkAndTargetPort(edge, lcaPorts.entryPort.id);
              edge.target = commonParallelAncestor.id; 
              edge.sourcePort = sourcePorts.exitPort.id;

              targetStates.forEach(function(targetState){
                var targetPorts = this._addPortsToState(targetState);

                grandparentNode.edges = grandparentNode.edges || [];
                var innerEdge = {
                  id : edge.source + '_' + targetState.id,
                  source : commonParallelAncestor.id,
                  target : targetState.id,
                  sourcePort : lcaPorts.entryPort.id,
                  targetPort : targetPorts.entryPort.id,
                  $hyperlink : edge.id,
                  labels : []
                };
                grandparentNode.edges.push(innerEdge);
                return innerEdge;
              }, this);
            }
          } 
        }, this);
      }

      //recurse
      if(state.children){
        state.children.forEach(walk.bind(this, state));
      }
    }
  }


  _getAncestors(stateId){
    var ancestors = [];
    var p = stateId;
    while( p = this._getParentKGraphNode(p) ){
      ancestors.push(p); 
    }
    return ancestors; 
  }


  _getLCA(states){
    var stateAncestors = states.map(function(state){ return this._getAncestors(state); }, this);
    var lcaId = _.intersection.apply(_, stateAncestors)[0];
    return this._getKgraphNodeById(lcaId);
  }


  _resetEdgeType(edge){
    if(edge.$type === 'hyperlink') delete edge.$type;
  }

  _addSelfLoopToState(stateToWhichEdgeShouldBeAdded, stateToAddLoop, ports, isHyperlink){
    //add a self-loop, from exit port to entry port
    var stateExitId = ports.exitPort.id, 
        stateEnterId = ports.entryPort.id;
    stateToWhichEdgeShouldBeAdded.edges = stateToWhichEdgeShouldBeAdded.edges || [];
    var loopEdge = {
      id : stateExitId + '_' + stateEnterId,
      source : stateToAddLoop,
      target : stateToAddLoop,
      sourcePort : stateExitId,
      targetPort : stateEnterId,
      labels : []
    };
    stateToWhichEdgeShouldBeAdded.edges.push(loopEdge);
    if(isHyperlink) loopEdge.$type = 'hyperlink';
    return loopEdge;
  }


  _edgeToHyperlinkAndTargetPort(edge, stateExitId){

    edge.targetPort = stateExitId;
    edge.$type = 'hyperlink';

  }


  _addPortsToState(state){

    state.ports = state.ports || [];
    var portCount = state.ports.length / 2,
        stateEnterId = state.id + '_enter' + portCount,
        stateExitId = state.id + '_exit' + portCount;

    state.ports = state.ports || [];
    var entryPort = { id: stateEnterId },
        exitPort = { id: stateExitId };
    state.ports.push( entryPort, exitPort);

    return {
      entryPort : entryPort, 
      exitPort: exitPort
    };
  }


  _clearBendpoints(parent) {
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
  }


  _applyInitialCoordinates(parent) {
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
  }


  _getKgraphNodeById(kgraphNodeId){
    return this._idMap[kgraphNodeId];
  }


  _populateIdMap(graphRoot){

    this._idMap = {};
    var walk = (function(graphNode){
      this._idMap[graphNode.id] = graphNode;
      if(graphNode.children) graphNode.children.forEach(walk);
    }.bind(this));

    walk(graphRoot);
    
  }


  _populateChildToParentMap(graphRoot){

    this._childToParentMap = {};
    var walk = (function(parentGraphNode, graphNode){
      if(parentGraphNode) this._childToParentMap[graphNode.id] = parentGraphNode.id;
      if(graphNode.children) graphNode.children.forEach(walk.bind(this,graphNode));
    }.bind(this));

    walk(null, graphRoot);
  }


  _createPseudonodeAndSpliceEdge(parentState, edge){
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
  }


  isSourceAncestorOfTarget(sourceId, targetId){
    var foundTargetInSourceDescendants = false;
    function walk(currentNode){
      if(foundTargetInSourceDescendants) return;
      foundTargetInSourceDescendants = currentNode.id === targetId;
      if(currentNode.children) currentNode.children.forEach(walk);
    }

    var sourceNode = this._idMap[sourceId];
    if(sourceNode.children) sourceNode.children.forEach(walk);
    return foundTargetInSourceDescendants; 
  }


  _createPseudonode(parentNode){
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
  }


  _getParentKGraphNode(nodeId){
    return this._childToParentMap[nodeId];
  }

}


module.exports = KGraph;
