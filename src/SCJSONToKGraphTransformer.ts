import constants from './constants';
import events from './events';
import IdGenerator from './IdGenerator';
import EventEmitter = require('events');
import _ = require('underscore');
import {SCState} from './SCJSON';
import {IKGraphRenderBackend} from './renderers/IKGraphRenderBackend';
import {KGraphNode, KGraphEdge, KGraphLabel} from './KGraph';

export default class SCJSONToKGraphTransformer extends EventEmitter{

  _idGenerator : IdGenerator; 
  _stateToKlayNodeMap : Map<SCState,KGraphNode>;
  _svgRenderer : IKGraphRenderBackend;

  constructor(idGenerator: IdGenerator, svgRenderer : IKGraphRenderBackend){
    super();
    this._idGenerator = idGenerator;
    this._svgRenderer = svgRenderer;
    this._stateToKlayNodeMap = new Map<SCState,KGraphNode>();
  }

  transform(scjson){
    this._normalizeStateIds(scjson);
    scjson.id = 'root';
    var klayNodeToScjsonMap = new Map();
    var idMap = this._getIdMap(scjson);
    var transformedScjsonCopy = this._transformScjsonVirtualCollapsedStates(scjson, scjson);
    var rootNode = this._scjsonStateToKlayNode(klayNodeToScjsonMap, idMap, transformedScjsonCopy, transformedScjsonCopy, transformedScjsonCopy);
    return [klayNodeToScjsonMap, rootNode];
  }

  _getIdMap(scjson){
    var idMap = new Map();
    function walk(s){
      if(s.id) idMap.set(s.id,s);
      if(s.states){
        s.states.forEach(walk);
      }
    }
    walk(scjson);

    return idMap;
  }

  _getTransitionTargets(transition){
    if(!transition.target) return [];
    return Array.isArray(transition.target) ? transition.target : transition.target.split(' +');
  }

  _transformScjsonVirtualCollapsedStates(rootState, scjson){
    //0. copy
    var newScjson = JSON.parse(JSON.stringify(scjson));
    var stateIdMap = new Map<string,SCState>();
    var stateToVirtualAncestorMap = new Map<SCState,SCState>();

    //initialize state id map
    this._getDescendants('states',newScjson).forEach( d => {stateIdMap.set(d.id, d);});
 
    //1. initialize virtual states
    function walkInitVirtualStates(state){
      if(state.$meta && state.$meta.isCollapsed && state.states && state.states.length){
        var substates = state.states;
        var virtualState = {
          id : this._idGenerator.generateId(),    //FIXME: add support back in for virtual states
          states : substates,
          $type : 'virtual'
        };
        stateIdMap.set(virtualState.id, virtualState);
        state.states = [virtualState];

        var descendants = this._getDescendants('states',state);
        descendants.forEach( d => stateToVirtualAncestorMap.set(d, virtualState) );
      }

      if(!virtualState &&   //don't traverse if we created a virtual state
          state.states){
        state.states.forEach(walkInitVirtualStates.bind(this));
      }
    }

    function walkUpdateTransitionGraphToRemoveTransitionsThatOriginateInAndTargetDescendantOfVirtualState(state){

      if(state.$type === 'virtual'){
        var descendants = this._getDescendants('states',state);
        state.transitions = state.transitions || [];
        var descendantIds = new Set(descendants.map( d => d.id ));
        descendants.forEach(function(d){
            if(!d.transitions) return;
            d.transitions = d.transitions.filter( transition => {
              var targets = this._getTransitionTargets(transition);
              return targets.some(targetId => !descendantIds.has(targetId));
          }, this);
        }, this); 
      }
      
      if(state.states){
        state.states.forEach(walkUpdateTransitionGraphToRemoveTransitionsThatOriginateInAndTargetDescendantOfVirtualState.bind(this));
      }
    }

    //2. reparent transitions of collapsed nodes so that they originate from the collapsed node
    function walkUpdateTransitionGraphToOriginalteFromVirtualStates(state){
      if(stateToVirtualAncestorMap.has(state) && state.transitions){
        var virtualState = stateToVirtualAncestorMap.get(state);
        virtualState.transitions = virtualState.transitions || [];
        virtualState.transitions.push.apply(virtualState.transitions, state.transitions);
      }
      
      if(state.states){
        state.states.forEach(walkUpdateTransitionGraphToOriginalteFromVirtualStates.bind(this));
      }
    }

    //3. transitions that target this state will be update to target the generated state id
    function walkUpdateTransitionGraphToTargetVirtualStates(state){

      if(state.transitions){
        state.transitions.forEach(function(transition){
          if(transition.target){
            var targets = this._getTransitionTargets(transition);
            var newTargets = targets.map(function(targetId){
              var targetState = stateIdMap.get(targetId);
              if( stateToVirtualAncestorMap.has(targetState) ){
                var virtualAncestor = stateToVirtualAncestorMap.get(targetState);
                return virtualAncestor.id;
              } else {
                return targetId;
              }
            });
            transition.target = newTargets.length === 1 ? newTargets[0] : newTargets;
          }
        }, this);
      }

      if(state.states){
        state.states.forEach(walkUpdateTransitionGraphToTargetVirtualStates.bind(this));
      }
    }

    //4. clean up - remove all descendant substates from virtual states
    // this is safe to do because their substates will no longer be the target of any transition (after transform in 3.)
    function walkRemoveDescendantsFromVirtualStates(state){
      
      if(state.$type === 'virtual'){
        delete state.states;
      }

      if(state.states){
        state.states.forEach(walkRemoveDescendantsFromVirtualStates.bind(this));
      }
    }

    walkInitVirtualStates.call(this,newScjson);
    walkUpdateTransitionGraphToRemoveTransitionsThatOriginateInAndTargetDescendantOfVirtualState.call(this,newScjson);
    walkUpdateTransitionGraphToOriginalteFromVirtualStates.call(this,newScjson);
    walkUpdateTransitionGraphToTargetVirtualStates.call(this,newScjson);
    walkRemoveDescendantsFromVirtualStates.call(this,newScjson);

    return newScjson; 
  }

  //TODO: optimize this, because it is expensive to walk the entire graph
  _isDescendantOfStateATransitionTarget(rootState, state){
    var descendants = this._getDescendants('states',state);
    var descendantIds = descendants.map(function(s){return s.id;});
    var toReturn = false;
    function walk(s){
      if(s.transitions && !toReturn){
        toReturn = s.transitions.some(function(transition){
          if(transition.target){
            var targets = transition.target.split(' +');
            return targets.some(function(target){
              return descendantIds.indexOf(target) > -1;
            });
          }
        });
      }
      step(s);
    } 
    function step(s){
      if(s.states && !toReturn){
        s.states.forEach(walk);
      }
    }
    step(rootState);

    return toReturn;
  }

  //TODO: move this out into an scjson utility class
  _getDescendants(property,state){
    var allDescendants = [];
    function walk(s){
      allDescendants.push(s);
      step(s);
    }
    function step(s){
      if(s[property]){
        s[property].forEach(walk);
      }
    }
    step(state);
    return allDescendants;
  }

  _getStateMinDimensions(labelText){
    var bbox = this._svgRenderer.measureTextDimensions(labelText);
    return [ bbox.width + constants.LEAF_NODE_PADDING_W * 2,
              bbox.height + constants.LEAF_NODE_PADDING_H * 2 ];
  }

  _scjsonStateToKlayNode(klayNodeToScjsonMap, idMap, rootState, parentState, state){
    var stateKlayNode = (<KGraphNode> Object.create(new EventEmitter()));
    if(state.$type === 'initial' || state.$type === 'final'){
      _.extend(stateKlayNode, {
        "id" : state.id,
        "labels" : [],
        "edges" : [],
        "width" : constants.INITIAL_RADIUS,
        "height" : constants.INITIAL_RADIUS
      });
    }else{
      var label = state.$type === 'virtual' ? '...' : state.id;
      var [width, height] =  this._getStateMinDimensions(label);
      _.extend(stateKlayNode, {
        "id" : state.id,
        "labels" : [ { text : label || '' } ],
        "edges" : [],
        "width" : width,
        "height" : height
      });
    }

    //TODO: add event emitters to edges as well
    events.node.forEach(function(eventName){
      stateKlayNode.on('node:' + eventName, function(domEvent){
        if(rootState === state) return;
        if(idMap.has(state.id)){
          var originalState = idMap.get(state.id);      //map back to the original state
          var scjsonNode = klayNodeToScjsonMap.get(stateKlayNode);
          var rootKlayNode = this._stateToKlayNodeMap.get(rootState);
          rootKlayNode.emit('node:' + eventName, originalState, stateKlayNode, domEvent);
        }
      }.bind(this));
    }, this);
    stateKlayNode.$type = state.$type;  //copy in type information
    this._stateToKlayNodeMap.set(state, stateKlayNode);
    klayNodeToScjsonMap.set(stateKlayNode, state);
    
    if(state.transitions){
      var newEdges = 
        state.transitions
          .filter(function(transition){return transition.target;})   //TODO: also render targetless transitions 
          .map(function(transition, idx){
            var klayEdge = new KGraphEdge();
            _.extend(klayEdge, {
              id : `${state.id}:${idx}`,
              source : state.id,
              target : transition.target,
              labels : []
            });
            klayNodeToScjsonMap.set(klayEdge, transition);

            var event = transition.event;
            if(event){
              var eventBBox = this._svgRenderer.measureTextDimensions(event); 
              var klayLabel = new KGraphLabel();
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
      stateKlayNode.children = state.states.map(this._scjsonStateToKlayNode.bind(this, klayNodeToScjsonMap, idMap, rootState, parentState));
    }
    if(!(state.$meta && state.$meta.isCollapsed)){   //skip generating an initial state if he is collapsed
      var fakeInitialState;
      if(state.initial){
        //initial attribute - create a fake <initial> scjson node 
        var transition = {
          target : state.initial.trim().split(/\s+/)
        };
        if(transition.target.length === 1){
          transition.target = transition.target[0];
        }
        let $type = 'initial';
        fakeInitialState = {
          id : this._idGenerator.generateId(state.id, $type),
          $type : $type,
          transitions : [transition] 
        };
      }else{
        if(state.states){
          //take the first child that has initial type, or first child
          var initialChildren = state.states.filter(function(child){
            return child.$type === 'initial';
          });

          if(!initialChildren.length && state.$type !== 'parallel'){
            let $type = 'initial';
            fakeInitialState = {
              id : this._idGenerator.generateId(state.id, $type),
              $type : $type,
              transitions : [{
                target : state.states[0].id
              }] 
            }
          } 
        }
      } 
      if(fakeInitialState){
        stateKlayNode.children = stateKlayNode.children || [];
        stateKlayNode.children.push(this._scjsonStateToKlayNode(klayNodeToScjsonMap, idMap, rootState, parentState, fakeInitialState));
      }
    }

    return stateKlayNode;
  }


  _normalizeStateIds(scjson){
    var walk = (function(parentNode, nodeIndex, node){
      if(node.$type !== 'scxml'){ 
        node.id = node.id || this._idGenerator.generateId(parentNode.id, node.$type || 'state', nodeIndex);
      }
      if(node.states) node.states.forEach((substate, i) => { walk(node, i, substate); });
    }.bind(this));
    walk(null, 0, scjson);
  }

}
