var constants = require('./constants');

function SCJSONToKGraphTransformer(idGeneratorFn, svg){
  this._svg = svg;
  this._generateStateId = idGeneratorFn;
}

SCJSONToKGraphTransformer.prototype = {

  transform : function(scjson){
    this._normalizeStateIds(scjson);
    scjson.id = 'root';
    return this._scjsonStateToKlayNode(scjson,scjson);
  },

  _scjsonStateToKlayNode : function (parentState, state){

    var bbox = this._svg.measureTextDimensions(state.id);
    state._klayNode = {     //TODO: put him in the map
      "id" : state.id,
      "labels" : [ { text : state.id || '' } ],
      "edges" : [],
      "width" : bbox.width + constants.LEAF_NODE_PADDING_W * 2,
      "height" : bbox.height + constants.LEAF_NODE_PADDING_H * 2
    };
    if(state.$type){
      state._klayNode.$type = state.$type;  //copy in type information
    }
    if(state.transitions){
      parentState._klayNode.edges.push.apply(parentState._klayNode.edges, 
        state.transitions.filter(function(transition){return transition.target;})
          .map(function(transition){
            var klayTransition = {
              id : state.id + '_' + (Array.isArray(transition.target) ? transition.target.join('_') : transition.target ),
              source : state.id,
              target : transition.target,
              labels : []
            };

            var event = transition.event;
            if(event){
              var eventBBox = this._svg.measureTextDimensions(event); 
              klayTransition.labels.push({ text : event, width : eventBBox.width, height : eventBBox.height });
            }
            return klayTransition;
          }.bind(this)));
    }
    if(state.states){
      state._klayNode.children = state.states.map(this._scjsonStateToKlayNode.bind(this,parentState));
    }

    return state._klayNode;
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

