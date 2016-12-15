var constants = require('./constants'),
    EventEmitter = require('events'),
    events = require('./events'),
    DefaultInteractiveBehavior = require('./interactivity'),
    _ = require('underscore');

class SCJSONToKGraphTransformer extends EventEmitter{

  constructor(idGeneratorFn, svg){
    super();
    this._svg = svg;
    this._generateStateId = idGeneratorFn;
    this._stateToKlayNodeMap = new Map();
    this._behavior = new DefaultInteractiveBehavior();
  }

  transform(scjson){
    this._normalizeStateIds(scjson);
    scjson.id = 'root';
    var klayNodeToScjsonMap = new Map();
    var rootNode = this._scjsonStateToKlayNode(klayNodeToScjsonMap, scjson, scjson, scjson);
    this._behavior.attachListeners(rootNode);   //initialize default behavior
    return [klayNodeToScjsonMap, rootNode];
  }

  _scjsonStateToKlayNode(klayNodeToScjsonMap, rootState, parentState, state){

    var stateKlayNode = Object.create(new EventEmitter());
    if(state.$type === 'initial' || state.$type === 'final'){
      _.extend(stateKlayNode, {
        "id" : state.id,
        "labels" : [],
        "edges" : [],
        "width" : constants.INITIAL_RADIUS,
        "height" : constants.INITIAL_RADIUS
      });
    }else{
      var bbox = this._svg.measureTextDimensions(state.id);
      _.extend(stateKlayNode, {
        "id" : state.id,
        "labels" : [ { text : state.id || '' } ],
        "edges" : [],
        "width" : bbox.width + constants.LEAF_NODE_PADDING_W * 2,
        "height" : bbox.height + constants.LEAF_NODE_PADDING_H * 2
      });
    }

    //TODO: add event emitters to edges as well
    events.node.forEach(function(eventName){
      stateKlayNode.on('node:' + eventName, function(domEvent){
        if(rootState === state) return;
        var scjsonNode = klayNodeToScjsonMap.get(stateKlayNode);
        var rootKlayNode = this._stateToKlayNodeMap.get(rootState);
        rootKlayNode.emit('node:' + eventName, state, stateKlayNode, domEvent);
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
      stateKlayNode.children = state.states.map(this._scjsonStateToKlayNode.bind(this, klayNodeToScjsonMap, rootState, parentState));
    }
    var fakeInitialState;
    if(state.initial){
      //initial attribute - create a fake <initial> scjson node 
      var transition = {
        target : state.initial.trim().split(/\s+/)
      };
      if(transition.target.length === 1){
        transition.target = transition.target[0];
      }
      fakeInitialState = {
        id : this._generateStateId(),
        $type : 'initial',
        transitions : [transition] 
      };
    }else{
      if(state.states){
        //take the first child that has initial type, or first child
        var initialChildren = state.states.filter(function(child){
          return child.$type === 'initial';
        });

        if(!initialChildren.length && state.$type !== 'parallel'){
          fakeInitialState = {
            id : this._generateStateId(),
            $type : 'initial',
            transitions : [{
              target : state.states[0].id
            }] 
          }
        } 
      }
    } 
    if(fakeInitialState){
      stateKlayNode.children = stateKlayNode.children || [];
      stateKlayNode.children.push(this._scjsonStateToKlayNode(klayNodeToScjsonMap, rootState, parentState, fakeInitialState));
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

