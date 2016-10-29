var constants = require('./constants'),
    EventEmitter = require('events'),
    events = require('./events'),
    _ = require('underscore');

class SCJSONToKGraphTransformer extends EventEmitter{

  constructor(idGeneratorFn, svg){
    super();
    this._svg = svg;
    this._generateStateId = idGeneratorFn;
    this._stateToKlayNodeMap = new Map();
  }

  transform(scjson){
    this._normalizeStateIds(scjson);
    scjson.id = 'root';
    var klayNodeToScjsonMap = new Map();
    return [klayNodeToScjsonMap, this._scjsonStateToKlayNode(klayNodeToScjsonMap, scjson, scjson)];
  }

  _scjsonStateToKlayNode(klayNodeToScjsonMap, parentState, state){

    var bbox = this._svg.measureTextDimensions(state.id);
    var stateKlayNode = Object.create(new EventEmitter());
    _.extend(stateKlayNode, {
      "id" : state.id,
      "labels" : [ { text : state.id || '' } ],
      "edges" : [],
      "width" : bbox.width + constants.LEAF_NODE_PADDING_W * 2,
      "height" : bbox.height + constants.LEAF_NODE_PADDING_H * 2
    });

    //TODO: add event emitters to edges as well
    events.node.forEach(function(eventName){
      stateKlayNode.on('node:' + eventName, function(domEvent){
        var scjsonNode = klayNodeToScjsonMap[stateKlayNode];
        this.emit('node:' + eventName, stateKlayNode, state);
      }.bind(this));
    }, this);
    stateKlayNode.$type = state.$type;  //copy in type information
    this._stateToKlayNodeMap.set(state, stateKlayNode);
    klayNodeToScjsonMap.set(stateKlayNode, state);
    
    if(state.transitions){
      var newEdges = 
        state.transitions
          .filter(function(transition){return transition.target;})   //TODO: also render targetless transitions 
          .map(function(transition){
            var klayEdge = Object.create(new EventEmitter());
            _.extend(klayEdge, {
              id : state.id + '_' + (Array.isArray(transition.target) ? transition.target.join('_') : transition.target ),
              source : state.id,
              target : transition.target,
              labels : []
            });
            klayNodeToScjsonMap.set(klayEdge, transition);

            var event = transition.event;
            if(event){
              var eventBBox = this._svg.measureTextDimensions(event); 
              var klayLabel = Object.create(new EventEmitter()); 
              _.extend(klayLabel, { 
                text : event, 
                width : eventBBox.width, 
                height : eventBBox.height 
              });
              klayEdge.labels.push(klayLabel);
              klayNodeToScjsonMap.set(klayEdge, transition);
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
      stateKlayNode.children = state.states.map(this._scjsonStateToKlayNode.bind(this, klayNodeToScjsonMap, parentState));
    }

    return stateKlayNode;
  }


  _normalizeStateIds(scjson){
    var walk = (function(node){
      node.id = node.id || this._generateStateId();
      if(node.states) node.states.forEach(walk.bind(this));
    }.bind(this));
    walk(scjson);
  }

}


module.exports = SCJSONToKGraphTransformer;

