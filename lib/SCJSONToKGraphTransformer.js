var constants = require('./constants'),
    _ = require('underscore');

function SCJSONToKGraphTransformer(idGeneratorFn, svg){
  this._svg = svg;
  this._generateStateId = idGeneratorFn;
  this._stateToKlayNodeMap = new Map();
}

SCJSONToKGraphTransformer.prototype = {

  transform : function(scjson){
    this._normalizeStateIds(scjson);
    scjson.id = 'root';
    return this._scjsonStateToKlayNode(scjson,scjson);
  },

  _scjsonStateToKlayNode : function (parentState, state){

    var bbox = this._svg.measureTextDimensions(state.id);
    var stateKlayNode = {     //TODO: put him in the map
      "id" : state.id,
      "labels" : [ { text : state.id || '' } ],
      "edges" : [],
      "width" : bbox.width + constants.LEAF_NODE_PADDING_W * 2,
      "height" : bbox.height + constants.LEAF_NODE_PADDING_H * 2
    };
    stateKlayNode.$type = state.$type;  //copy in type information
    this._stateToKlayNodeMap.set(state, stateKlayNode);
    
    if(state.transitions){
      var newEdges = 
        state.transitions
          .filter(function(transition){return transition.target;})   //TODO: also render targetless transitions 
          .map(function(transition){
            var klayEdge = {
              id : state.id + '_' + (Array.isArray(transition.target) ? transition.target.join('_') : transition.target ),
              source : state.id,
              target : transition.target,
              labels : []
            };

            var event = transition.event;
            if(event){
              var eventBBox = this._svg.measureTextDimensions(event); 
              klayEdge.labels.push({ text : event, width : eventBBox.width, height : eventBBox.height });
            }
            if(transition.type){
              klayEdge.$type = transition.type;
            }
            transition._klayEdge = klayEdge;
            return klayEdge;
          }.bind(this));

      var parentKlayNode = this._stateToKlayNodeMap.get(parentState);
      parentKlayNode.edges.push.apply(parentKlayNode.edges, newEdges);
    }
    if(state.states){
      stateKlayNode.children = state.states.map(this._scjsonStateToKlayNode.bind(this,parentState));
    }

    return stateKlayNode;
  },

  _normalizeStateIds : function(scjson){
    var walk = (function(node){
      node.id = node.id || this._generateStateId();
      if(node.states) node.states.forEach(walk.bind(this));
    }.bind(this));
    walk(scjson);
  }
};

module.exports = SCJSONToKGraphTransformer;

