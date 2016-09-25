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
    window.$klay.layout({     //TODO: refactor to use CommonJS
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

          //Looking for transitions that: 
          // 1. originate from parent state, target substate, and @type != 'internal'
          // 2. !@target  (targetless transitions)
          // 3. are a hyperedge


          // 1. originate from parent state, target substate, and @type != 'internal'
          if(edge.type !== 'internal' //external
              && !Array.isArray(edge.target)
              && this.isSourceAncestorOfTarget(edge.source, edge.target) 

          ){
            /*
              For 1.: Create a pseudonode that is a sibling of the parent node.
              Create transitions from parent node to pseudonode, and from
              pseudonode to child nodes. 
            */

            console.log('edge.type', edge.type);
            //if he is a parallel state, then grab the parent
            var parentId = this._getParentKGraphNode(edge.source);
            var parentNode = this._getKgraphNodeById(parentId); 
            this._createPseudonodeAndSpliceEdge(
              parentNode, 
              edge);
          }

          // 2. !@target  (targetless transitions)
          else if(!edge.target){
            /*
            For 2.: Create a pseudonode that is a child of the parent node. Create
            transitions originating from parent node and targeting pseudonode; and
            originating from pseudonode, and targeting parent node. 
            */

            this._createPseudonodeAndSpliceEdge(state, edge);
          }

          // 3. he is a hyperedge
          else if(edge.target && Array.isArray(edge.target)){

            var pseudonode = this._createPseudonode(parentState);
            state.edges.push.apply(
              state.edges,
              edge.target.map(function(targetId, i){
                return {
                  id : pseudonode.id + '_' + targetId,
                  source: pseudonode.id,
                  target: targetId
                };
              })
            );

            //adjust transition target to target pseudonode
            edge.target = pseudonode.id; 
            edge.$type = 'hyperlink';
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
      foundTargetInSourceDescendants = currentNode.id === targetId;
      if(foundTargetInSourceDescendants) return;
      else if(currentNode.children) currentNode.children.forEach(walk);
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
