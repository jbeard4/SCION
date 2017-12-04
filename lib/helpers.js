const constants = require('./constants'),
      STATE_TYPES = constants.STATE_TYPES,
      RX_TRAILING_WILDCARD = constants.RX_TRAILING_WILDCARD;

const printTrace = false;

module.exports = {
  extend : extend,
  transitionWithTargets : transitionWithTargets,
  transitionComparator : transitionComparator,
  initializeModel : initializeModel,
  isEventPrefixMatch : isEventPrefixMatch,
  isTransitionMatch : isTransitionMatch,
  scxmlPrefixTransitionSelector : scxmlPrefixTransitionSelector,
  eventlessTransitionSelector : eventlessTransitionSelector,
  getTransitionWithHigherSourceChildPriority : getTransitionWithHigherSourceChildPriority,
  sortInEntryOrder : sortInEntryOrder,
  getStateWithHigherSourceChildPriority : getStateWithHigherSourceChildPriority,
  initializeModelGeneratorFn : initializeModelGeneratorFn,
  deserializeSerializedConfiguration : deserializeSerializedConfiguration,
  deserializeHistory : deserializeHistory
};

function extend (to, from){
  Object.keys(from).forEach(function(k){
    to[k] = from[k]; 
  });
  return to;
};

function transitionWithTargets(t){
    return t.targets;
}

function transitionComparator(t1, t2) {
    return t1.documentOrder - t2.documentOrder;
}

function initializeModel(rootState, opts){
    var transitions = [], idToStateMap = new Map(), documentOrder = 0;


    //TODO: need to add fake ids to anyone that doesn't have them
    //FIXME: make this safer - break into multiple passes
    var idCount = {};

    function generateId(type){
        if(idCount[type] === undefined) idCount[type] = 0;

        do {
          var count = idCount[type]++;
          var id = '$generated-' + type + '-' + count; 
        } while (idToStateMap.has(id))
        
        return id;
    }

    function wrapInFakeRootState(state){
        return {
            $deserializeDatamodel : state.$deserializeDatamodel || function(){},
            $serializeDatamodel : state.$serializeDatamodel || function(){ return null;},
            $idToStateMap : idToStateMap,   //keep this for handy deserialization of serialized configuration
            docUrl : state.docUrl,
            name : state.name,
            states : [
                {
                    $type : 'initial',
                    transitions : [{
                        target : state
                    }]
                },
                state
            ]
        };
    }

    var statesWithInitialAttributes = [];

    /**
      @this {SCTransition}
    */
    function transitionToString(sourceState){
      return `${sourceState} -- ${this.events ? '(' + this.events.join(',') + ')' : null}${this.cond ? '[' + this.cond.name + ']' : ''} --> ${this.targets ? this.targets.join(',') : null}`;
    }

    /**
      @this {SCState}
    */
    function stateToString(){
      return this.id;
    }

    function populateStateIdMap(state){
      //populate state id map
      if(state.id){
          idToStateMap.set(state.id, state);
      }

      if(state.states) {
          for (var j = 0, len = state.states.length; j < len; j++) {
              populateStateIdMap(state.states[j]);
          }
      }
    }

    function traverse(ancestors,state){

        if(printTrace) state.toString = stateToString;

        //add to global transition and state id caches
        if(state.transitions) transitions.push.apply(transitions,state.transitions);

        //create a default type, just to normalize things
        //this way we can check for unsupported types below
        state.$type = state.$type || 'state';

        //add ancestors and depth properties
        state.ancestors = ancestors;
        state.depth = ancestors.length;
        state.parent = ancestors[0];
        state.documentOrder = documentOrder++; 

        //add some information to transitions
        state.transitions = state.transitions || [];
        for (var j = 0, len = state.transitions.length; j < len; j++) {
            var transition = state.transitions[j];
            transition.documentOrder = documentOrder++; 
            transition.source = state;
            if(printTrace) transition.toString = transitionToString.bind(transition, state);
        };

        //recursive step
        if(state.states) {
            var ancs = [state].concat(ancestors);
            for (var j = 0, len = state.states.length; j < len; j++) {
                traverse(ancs, state.states[j]);
            }
        }

        //setup fast state type
        switch(state.$type){
            case 'parallel':
                state.typeEnum = STATE_TYPES.PARALLEL;
                state.isAtomic = false;
                break;
            case 'initial' : 
                state.typeEnum = STATE_TYPES.INITIAL;
                state.isAtomic = true;
                break;
            case 'history' :
                state.typeEnum = STATE_TYPES.HISTORY;
                state.isAtomic = true;
                break;
            case 'final' : 
                state.typeEnum = STATE_TYPES.FINAL;
                state.isAtomic = true;
                break;
            case 'state' : 
            case 'scxml' :
                if(state.states && state.states.length){
                    state.typeEnum = STATE_TYPES.COMPOSITE;
                    state.isAtomic = false;
                }else{
                    state.typeEnum = STATE_TYPES.BASIC;
                    state.isAtomic = true;
                }
                break;
            default :
                throw new Error('Unknown state type: ' + state.$type);
        }

        //descendants property on states will now be populated. add descendants to this state
        if(state.states){
            state.descendants = state.states.concat(state.states.map(function(s){return s.descendants;}).reduce(function(a,b){return a.concat(b);},[]));
        }else{
            state.descendants = [];
        }

        var initialChildren;
        if(state.typeEnum === STATE_TYPES.COMPOSITE){
            //set up initial state
            
            if(Array.isArray(state.initial) || typeof state.initial === 'string'){
                statesWithInitialAttributes.push(state);
            }else{
                //take the first child that has initial type, or first child
                initialChildren = state.states.filter(function(child){
                    return child.$type === 'initial';
                });

                state.initialRef = [initialChildren.length ? initialChildren[0] : state.states[0]];
                checkInitialRef(state);
            }

        }

        //hook up history
        if(state.typeEnum === STATE_TYPES.COMPOSITE ||
                state.typeEnum === STATE_TYPES.PARALLEL){

            var historyChildren = state.states.filter(function(s){
                return s.$type === 'history';
            }); 

           state.historyRef = historyChildren;
        }

        //now it's safe to fill in fake state ids
        if(!state.id){
            state.id = generateId(state.$type);
            idToStateMap.set(state.id, state);
        }

        //normalize onEntry/onExit, which can be single fn or array, or array of arrays (blocks)
        ['onEntry','onExit'].forEach(function(prop){
          if (state[prop]) {
            if(!Array.isArray(state[prop])){
              state[prop] = [state[prop]];
            }
            if(!state[prop].every(function(handler){ return Array.isArray(handler); })){
              state[prop] = [state[prop]];
            }
          }
        });

        if (state.invokes && !Array.isArray(state.invokes)) {
            state.invokes = [state.invokes];
            state.invokes.forEach( invoke => {
              if (invoke.finalize && !Array.isArray(invoke.finalize)) {
                invoke.finalize = [invoke.finalize];
              }
            })
        }
    }

    //TODO: convert events to regular expressions in advance

    function checkInitialRef(state){
      if(!state.initialRef) throw new Error('Unable to locate initial state for composite state: ' + state.id);
    }
    function connectIntialAttributes(){
      for (var j = 0, len = statesWithInitialAttributes.length; j < len; j++) {
        var s = statesWithInitialAttributes[j];

        var initialStates = Array.isArray(s.initial) ? s.initial : [s.initial];
        s.initialRef = initialStates.map(function(initialState){ return idToStateMap.get(initialState); });
        checkInitialRef(s);
      }
    }

    var RX_WHITESPACE = /\s+/;

    function connectTransitionGraph(){
        //normalize as with onEntry/onExit
        for (var i = 0, len = transitions.length; i < len; i++) {
            var t = transitions[i];
            if (t.onTransition && !Array.isArray(t.onTransition)) {
                t.onTransition = [t.onTransition];
            }

            //normalize "event" attribute into "events" attribute
            if (typeof t.event === 'string') {
                t.events = t.event.trim().split(RX_WHITESPACE);
            }
            delete t.event;

            if(t.targets || (typeof t.target === 'undefined')) {
                //targets have already been set up
                continue;
            }   

            if(typeof t.target === 'string'){
                var target = idToStateMap.get(t.target);
                if(!target) throw new Error('Unable to find target state with id ' + t.target);
                t.target = target;
                t.targets = [t.target];
            }else if(Array.isArray(t.target)){
                t.targets = t.target.map(function(target){
                    if(typeof target === 'string'){
                        target = idToStateMap.get(target);
                        if(!target) throw new Error('Unable to find target state with id ' + t.target);
                        return target;
                    }else{
                        return target;
                    } 
                }); 
            }else if(typeof t.target === 'object'){
                t.targets = [t.target];
            }else{
                throw new Error('Transition target has unknown type: ' + t.target);
            }
        }

        //hook up LCA - optimization
        for (var i = 0, len = transitions.length; i < len; i++) {
            var t = transitions[i];
            if(t.targets) t.lcca = getLCCA(t.source,t.targets[0]);    //FIXME: we technically do not need to hang onto the lcca. only the scope is used by the algorithm

            t.scope = getScope(t);
        }
    }

    function getScope(transition){
        //Transition scope is normally the least common compound ancestor (lcca).
        //Internal transitions have a scope equal to the source state.
        var transitionIsReallyInternal = 
                transition.type === 'internal' &&
                  transition.source.typeEnum === STATE_TYPES.COMPOSITE &&   //is transition source a composite state
                  transition.source.parent &&    //root state won't have parent
                  transition.targets && //does it target its descendants
                  transition.targets.every(
                      function(target){ return transition.source.descendants.indexOf(target) > -1;});

        if(!transition.targets){
            return null;
        }else if(transitionIsReallyInternal){
            return transition.source; 
        }else{
            return transition.lcca;
        }
    }

    function getLCCA(s1, s2) {
        var commonAncestors = [];
        for (var j = 0, len = s1.ancestors.length; j < len; j++) {
            var anc = s1.ancestors[j];
            if(
                (
                  opts && opts.legacySemantics ? 
                    anc.typeEnum === STATE_TYPES.COMPOSITE :
                    (anc.typeEnum === STATE_TYPES.COMPOSITE || anc.typeEnum === STATE_TYPES.PARALLEL) 
                ) &&
                anc.descendants.indexOf(s2) > -1){

                commonAncestors.push(anc);
            }
        };
        if(!commonAncestors.length) throw new Error("Could not find LCA for states.");
        return commonAncestors[0];
    }

    //main execution starts here
    //FIXME: only wrap in root state if it's not a compound state
    populateStateIdMap(rootState);
    var fakeRootState = wrapInFakeRootState(rootState);  //I wish we had pointer semantics and could make this a C-style "out argument". Instead we return him
    traverse([],fakeRootState);
    connectTransitionGraph();
    connectIntialAttributes();

    return fakeRootState;
}


function isEventPrefixMatch(prefix, fullName) {
    prefix = prefix.replace(RX_TRAILING_WILDCARD, '');

    if (prefix === fullName) {
        return true;
    }

    if (prefix.length > fullName.length) {
        return false;
    }

    if (fullName.charAt(prefix.length) !== '.') {
        return false;
    }

    return (fullName.indexOf(prefix) === 0);
}

function isTransitionMatch(t, eventName) {
    return t.events.some((tEvent) => {
        return tEvent === '*' || isEventPrefixMatch(tEvent, eventName);
    });
}

function scxmlPrefixTransitionSelector(t, event, evaluator, selectEventlessTransitions) {
    return ( 
      selectEventlessTransitions ? 
        !t.events :
        (t.events && event && event.name && isTransitionMatch(t, event.name))
      )
      && (!t.cond || evaluator(t.cond));
}

function eventlessTransitionSelector(state){
  return state.transitions.filter(function(transition){ return !transition.events || ( transition.events && transition.events.length === 0 ); });
}

//priority comparison functions
function getTransitionWithHigherSourceChildPriority(_args) {
    let t1 = _args[0], t2 = _args[1];
    var r = getStateWithHigherSourceChildPriority(t1.source, t2.source);
    //compare transitions based first on depth, then based on document order
    if (t1.source.depth < t2.source.depth) {
        return t2;
    } else if (t2.source.depth < t1.source.depth) {
        return t1;
    } else {
       if (t1.documentOrder < t2.documentOrder) {
            return t1;
        } else {
            return t2;
        }
    }
}

function sortInEntryOrder(s1, s2){
  return getStateWithHigherSourceChildPriority(s1, s2) * -1
}

function getStateWithHigherSourceChildPriority(s1, s2) {
    //compare states based first on depth, then based on document order
    if (s1.depth > s2.depth) {
        return -1;
    } else if (s1.depth < s2.depth) {
        return 1;
    } else {
        //Equality
        if (s1.documentOrder < s2.documentOrder) {
            return 1;
        } else if (s1.documentOrder > s2.documentOrder) {
            return -1;
        } else{
            return 0;
        }
    }
}

function initializeModelGeneratorFn(modelFn, opts, interpreter){
    return modelFn.call(interpreter,
        opts._x,
        opts._x._sessionid,
        opts._x._ioprocessors,
        interpreter.isIn.bind(interpreter));
}

function deserializeSerializedConfiguration(serializedConfiguration,idToStateMap){
  return serializedConfiguration.map(function(id){
    var state = idToStateMap.get(id);
    if(!state) throw new Error('Error loading serialized configuration. Unable to locate state with id ' + id);
    return state;
  });
}

function deserializeHistory(serializedHistory,idToStateMap){
  var o = {};
  Object.keys(serializedHistory).forEach(function(sid){
    o[sid] = serializedHistory[sid].map(function(id){
      var state = idToStateMap.get(id);
      if(!state) throw new Error('Error loading serialized history. Unable to locate state with id ' + id);
      return state;
    });
  });
  return o;
}

