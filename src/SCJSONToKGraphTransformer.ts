import constants from './constants';
import events from './events';
import IdGenerator from './IdGenerator';
import _ = require('underscore');
import {SCState} from './SCJSON';
import GraphRoot from './index'
import {KGraphNode, KGraphEdge, KGraphLabel} from './KGraph';

export default class SCJSONToKGraphTransformer {

  _idGenerator : IdGenerator; 
  _stateToKlayNodeMap : Map<SCState,KGraphNode>;
  _svgRenderer : GraphRoot;

  constructor(idGenerator: IdGenerator, svgRenderer : GraphRoot){
    this._idGenerator = idGenerator;
    this._svgRenderer = svgRenderer;
    this._stateToKlayNodeMap = new Map<SCState,KGraphNode>();
  }

  transform(scjson){
    this._normalizeStateIds(scjson);
    var idMap = this._getIdMap(scjson);
    var transformedScjsonCopy1 = this._normalizeScjsonInitialStates(scjson);
    var transformedScjsonCopy2 = this._transformScjsonVirtualCollapsedStates(transformedScjsonCopy1);
    var rootNode = this._scjsonStateToKlayNode(idMap, transformedScjsonCopy2, transformedScjsonCopy2, transformedScjsonCopy2);
    return rootNode;
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

  _normalizeScjsonInitialStates(scjson){
    //0. copy
    var newScjson = JSON.parse(JSON.stringify(scjson));
    traverse.call(this, newScjson);
    return newScjson;

    function traverse(state){
      if(!(state.$meta && state.$meta.isCollapsed)){   //skip generating an initial state if he is collapsed
        var fakeInitialState;
        if(state.initial){
          //initial attribute - create a fake <initial> scjson node 
          var transition = {
            target : state.initial
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
          state.states = state.states || [];
          state.states.push(fakeInitialState);
        }
      }

      if(state.states){
        state.states.forEach(traverse.bind(this));
      }
    }
  }

  _transformScjsonVirtualCollapsedStates(scjson){
    //0. copy
    var newScjson = JSON.parse(JSON.stringify(scjson));
    var stateIdMap = new Map<string,SCState>();
    var stateToVirtualAncestorMap = new Map<SCState,SCState>();

    //initialize state id map
    this._getDescendants('states',newScjson).forEach( d => {stateIdMap.set(d.id, d);});
 
    //1. initialize virtual states
    function walkInitVirtualStates(state){
      if(state.$meta && state.$meta.isCollapsed && 
          (
            (state.states && state.states.length) ||
            (state.datamodel && state.datamodel.declarations && state.datamodel.declarations.length) ||
            (state.onEntry && state.onEntry.length) ||
            (state.onExit && state.onExit.length)
          )){
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

    function walkRemoveActionsFromCollapsedStates(state){
      
      if(state.$meta && state.$meta.isCollapsed){
        ['datamodel','onEntry','onExit'].forEach( prop => delete state[prop] );
      }

      if(state.states){
        state.states.forEach(walkRemoveActionsFromCollapsedStates.bind(this));
      }
    }

    walkInitVirtualStates.call(this,newScjson);
    walkUpdateTransitionGraphToRemoveTransitionsThatOriginateInAndTargetDescendantOfVirtualState.call(this,newScjson);
    walkUpdateTransitionGraphToOriginalteFromVirtualStates.call(this,newScjson);
    walkUpdateTransitionGraphToTargetVirtualStates.call(this,newScjson);
    walkRemoveDescendantsFromVirtualStates.call(this,newScjson);
    walkRemoveActionsFromCollapsedStates.call(this,newScjson);

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

  _scjsonStateToKlayNode(idMap, rootState, parentState, state){
    let stateKlayNode : KGraphNode;

    const ACTIONPROPS = { "borderSpacing": 4, "spacing": 0, direction: "RIGHT" };
    const TRANSITION_CONTAINER_PROPS = { "borderSpacing": 0, "spacing": 0, direction: "RIGHT" };
    const parentKlayNode = this._stateToKlayNodeMap.get(parentState);

    const recursiveMakeActions = (klayContainer, scjsonActionList) => {
      klayContainer.children = 
        scjsonActionList.
          map((action, i) => {
            const klayAction = {
              "id" : `${klayContainer.id}:${i}`,
              "labels" : [{text : this._actionToLabel(action)}],
              "$type" : "action",
              "properties": ACTIONPROPS,
            };

            if(action.actions && action.actions.length){
              recursiveMakeActions(klayAction, action.actions);
            }
            return klayAction;
          })
      return klayContainer;
    }

    const genTransitionLabel = (transition) => {

      var event = transition.event;
      var condExpr;
      if (typeof transition.cond === 'object' && typeof transition.cond.expr === 'string'){
        condExpr = transition.cond.expr;
      } 
      if(event || condExpr){
        return `${event || ''}${condExpr ? `[${condExpr}]` : ''}${transition.onTransition && transition.onTransition.length ? '/' : ''}`
      } else {
        return null;
      }
    }

    if(state.$type === 'initial' || state.$type === 'final'){
      stateKlayNode = {
        "id" : state.id,
        "labels" : [{text : `\u25C9 ${state.id}`}],
        "edges" : [],
      };
    }else{
      var label = state.$type === 'virtual' ? '...' : 
        ( !state.$type || state.$type === 'parallel' || state.$type === 'state' ? state.id : '')
      stateKlayNode = {
        "id" : state.id,
        "labels" : [ { text : label || '' } ],
        "edges" : []
      };
    }

    stateKlayNode.$type = state.$type;  //copy in type information
    this._stateToKlayNodeMap.set(state, stateKlayNode);
    
    if(state.transitions){
      var newEdges = 
        state.transitions
          .map(function(transition, idx){
            if(!transition.target) return null;   //TODO: also render targetless transitions 
            var klayEdge = new KGraphEdge();
            _.extend(klayEdge, {
              id : `${state.id}:transition:${idx}`,
              source : state.id,
              target : transition.target,
              labels : []
            });

            const label = genTransitionLabel(transition);
            if(label){
              var klayLabel = new KGraphLabel();
              _.extend(klayLabel, { 
                text : label              
              });
              klayEdge.labels.push(klayLabel);
            }
            if(transition.onTransition && transition.onTransition.length){
              parentKlayNode.children = parentKlayNode.children || [];
              const klayActionContainer = {
                "id" : `${state.id}:transition:${idx}:onTransition`,
                "$type" : "transitionActionContainer",
                "labels" : [{text : ''}],
                "properties": TRANSITION_CONTAINER_PROPS 
              };

              parentKlayNode.children.push(recursiveMakeActions(klayActionContainer, transition.onTransition));
            }
            if(transition.type){
              klayEdge.$type = transition.type;
            }
            return klayEdge;
          }.bind(this))
          .filter(function(klayEdge){return klayEdge}); //filter out the null edges

      parentKlayNode.edges.push.apply(parentKlayNode.edges, newEdges);
    }
    if(state.states){
      stateKlayNode.children = stateKlayNode.children || [];
      stateKlayNode.children.push.apply(stateKlayNode.children, 
        state.states.map(this._scjsonStateToKlayNode.bind(this, idMap, rootState, parentState)));
    }
    //targetless transitions
    if(state.transitions && state.transitions.filter((transition) =>  !transition.target ).length){
      stateKlayNode.children = stateKlayNode.children || [];
      const klayActionContainer = {
        "id" : `${state.id}:targetlessTransition`,
        "$type" : "actionContainer",
        "labels" : [{text : 'targetless transitions'}],   //Or use harel syntax "SR" for static reaction?
        "properties": ACTIONPROPS,
        "children" : []
      };
      stateKlayNode.children.push(klayActionContainer);

      state.transitions
        .forEach(function(transition, idx){
          if(transition.target) return;

          const label = genTransitionLabel(transition);
          const klayTargetlessTransitionActionContainer = {
            "id" : `${klayActionContainer.id}:${idx}:onTransition`,
            "$type" : "actionContainer",
            "labels" : [{text : label}],
            "properties": ACTIONPROPS,
            "children" : []
          };
          if(transition.onTransition && transition.onTransition.length){
            klayActionContainer.children = klayActionContainer.children || [];
            klayActionContainer.children.push(recursiveMakeActions(klayTargetlessTransitionActionContainer, transition.onTransition));
          }
        });
    }
    ['onEntry', 'onExit', 'datamodel'].forEach( (prop) => {
      var subprop;
      if(prop === 'datamodel'){
        subprop = 'declarations';
      }
      if(state[prop]){
        const list = subprop ? state[prop][subprop] : state[prop];
        if(list.length){
          stateKlayNode.children = stateKlayNode.children || [];

          const klayActionContainer = {
            "id" : `${state.id}:${prop}`,
            "$type" : "actionContainer",
            "labels" : [{text : prop.toLowerCase()}],
            "properties": ACTIONPROPS
          };
          
          stateKlayNode.children.push(recursiveMakeActions(klayActionContainer, list.reduce(function(a, b){ return a.concat(b); }, [])));
        }
      }
    })
    if(state.invokes && state.invokes.length){
      stateKlayNode.children = stateKlayNode.children || [];
      const o = {
        "id" : `${state.id}:invokes`,
        "$type" : "actionContainer",
        "labels" : [{text : 'invokes'}],
        "properties": ACTIONPROPS,
        "children" : state.invokes.
          map((invoke, i) => {
            const invokeLabelPrefix = `\u26A1${invoke.id ? ` ${invoke.id} ` : ''}`;
            const invokeKlay = 
              {
                "id" : `${state.id}:invokes:${i}`,
                "labels" : [{text : `${invokeLabelPrefix}`}],
                "$type" : "invoke",
                "properties": ACTIONPROPS,
                "children" : []
              };
            if(invoke.src){
              invokeKlay.children.push({
                "id" : `${state.id}:invokes:src`,
                "labels" : [{text : `src: ${invoke.src}`}],
                "$type" : "action",
                "properties": ACTIONPROPS
              }); 
            }else if(invoke.content && invoke.content.rootState){
              invokeKlay.children.push(this.transform(invoke.content.rootState))
            }else if(invoke.content && invoke.content.expr){
              invokeKlay.children.push({
                "id" : `${state.id}:invokes:src`,
                "labels" : [{text : `content/@expr: ${invoke.content.expr.expr}`}],
                "$type" : "action",
                "properties": ACTIONPROPS
              }); 
              
            }else if(invoke.srcexpr){
              invokeKlay.children.push({
                "id" : `${state.id}:invokes:src`,
                "labels" : [{text : `srcexpr: ${invoke.srcexpr.expr}`}],
                "$type" : "action",
                "properties": ACTIONPROPS
              }); 
            }else{
              throw new Error();
            }

            //handle params
            if(invoke.params && invoke.params.length){

              const klayParams = {
                "id" : `${invokeKlay.id}:params`,
                "labels" : [{text : 'params'}],
                "$type" : "actionContainer",
                "properties": ACTIONPROPS,
                "children" : []
              };

              invokeKlay.children = invokeKlay.children || [];
              invokeKlay.children.push(klayParams);

              klayParams.children =  
                invoke.params.map( (param, i) => {
                  return {
                    "id" : `${klayParams.id}:${i}`,
                    "labels" : [{text : `${param.name} \u21DA ${param.expr ? param.expr.expr : (param.location ? param.location.expr : '')}` }],
                    "$type" : "action",
                    "properties": ACTIONPROPS
                  };
                });
            }
            return invokeKlay;
          })
      };
      stateKlayNode.children.push(o);
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

  _actionToLabel(action){
    //console.log('action',action);
    switch(action.$type){
      case 'script':
        return `\u2615 ${action.src ? `src : ${action.src}` : action.content.trim() }`;
      case 'assign':
        return `${action.location.expr} \u21D0 ${action.content ? JSON.stringify(action.content.content) : (action.expr ? action.expr.expr : '')}`; //TODO: we probably want to truncate content
      case 'data':
        return `${action.id}${action.expr && action.expr.expr ? ` \u21D0 ${action.expr.expr}` : ''}`;
      case 'raise':
        return `\u261D${action.event}`; //☝
      case 'send':
        return `\u2709 ${
          [
            action.event	 ? `event	: ${ action.event}`	 : '',
            action.eventexp ? `eventexpr : ${action.eventexpr.expr }`: '',
            action.target	 ? `target	  : ${action.target	 }`: '',
            action.targetexpr ? `targetexpr : ${action.targetexpr.expr }`: '',
            //action.type ? `type	  : ${action.type	 }`: '',
            //action.typeexpr	 ? `typeexpr : ${action.typeexpr.expr	 }`: '',
            action.id	? `id	  : ${action.id	 }`: '',
            action.idlocation	 ? `idlocation : ${action.idlocation.expr	 }`: '',
            action.delay? `delay	  : ${action.delay	 }`: '',
            action.delayexpr ? `delayexpr : ${action.delayexpr.expr	 }`: '',
            action.namelist ? `namelist  : ${action.namelist.expr }`: ''
          ].filter( s => s).join(', ') }`
      case 'if':
        return `if ${action.cond.expr}`;
      case 'elseif':
        return `elseif ${action.cond.expr}`;
      case 'else':
        return `else`;
      case 'foreach':
        return `\u27F3 ${action.item}${action.index ? `, ${action.index}` : ''} in ${action.array.expr}`;
      case 'log':
        return `\u33D2 ${
            [
              action.label ? `label : ${action.label}` : '',
              action.expr ? `expr : ${action.expr.expr}` : ''
            ].filter( s => s ).join(', ')
          }`;
      case 'cancel':
        return `\u2717 ${action.sendid ? action.sendid : ''}${action.sendidexpr ? `sendidexpr : ${action.sendidexpr.expr}` : ''}`;
      default:
        throw new Error('Unrecognized action');
    }
  }

}
