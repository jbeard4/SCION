//   Copyright 2012-2012 Jacob Beard, INFICON, and other SCION contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

"use strict";

var util = require('util');

var extend = Object.assign || 
    function (to, from){
      Object.keys(from).forEach(function(k){
        to[k] = from[k]; 
      });
      return to;
    };

var STATE_TYPES = {
    BASIC: 0,
    COMPOSITE: 1,
    PARALLEL: 2,
    HISTORY: 3,
    INITIAL: 4,
    FINAL: 5
};

const SCXML_IOPROCESSOR_TYPE = 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor'
const HTTP_IOPROCESSOR_TYPE = 'http://www.w3.org/TR/scxml/#BasicHTTPEventProcessor'

function transitionWithTargets(t){
    return t.targets;
}

function transitionComparator(t1, t2) {
    return t1.documentOrder - t2.documentOrder;
}

function initializeModel(rootState){
    var transitions = [], idToStateMap = new Map(), documentOrder = 0;


    //TODO: need to add fake ids to anyone that doesn't have them
    //FIXME: make this safer - break into multiple passes
    var idCount = {};

    function generateId(type){
        if(idCount[type] === undefined) idCount[type] = 0;

        var count = idCount[type]++;
        return '$generated-' + type + '-' + count; 
    }

    function wrapInFakeRootState(state){
        return {
            $deserializeDatamodel : state.$deserializeDatamodel || function(){},
            $serializeDatamodel : state.$serializeDatamodel || function(){ return null;},
            $idToStateMap : idToStateMap,   //keep this for handy deserialization of serialized configuration
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

    function transitionToString(sourceState){
      return `${sourceState} -- ${this.events ? '(' + this.events.join(',') + ')' : null}${this.cond ? '[' + this.cond.name + ']' : ''} --> ${this.targets ? this.targets.join(',') : null}`;
    }

    function stateToString(){
      return this.id;
    }

    function traverse(ancestors,state){

        if(printTrace) state.toString = stateToString;

        //add to global transition and state id caches
        if(state.transitions) transitions.push.apply(transitions,state.transitions);

        //populate state id map
        if(state.id){
            if(idToStateMap.has(state.id)) throw new Error('Redefinition of state id ' + state.id);

            idToStateMap.set(state.id, state);
        }

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
            if((anc.typeEnum === STATE_TYPES.COMPOSITE || anc.typeEnum === STATE_TYPES.PARALLEL) &&
                anc.descendants.indexOf(s2) > -1){
                commonAncestors.push(anc);
            }
        };
        if(!commonAncestors.length) throw new Error("Could not find LCA for states.");
        return commonAncestors[0];
    }

    //main execution starts here
    //FIXME: only wrap in root state if it's not a compound state
    var fakeRootState = wrapInFakeRootState(rootState);  //I wish we had pointer semantics and could make this a C-style "out argument". Instead we return him
    traverse([],fakeRootState);
    connectTransitionGraph();
    connectIntialAttributes();

    return fakeRootState;
}

/* begin tiny-events: https://github.com/ZauberNerd/tiny-events */
function EventEmitter() {
    this._listeners = {};
    this._listeners['*'] = [];
}

EventEmitter.prototype.on = function _on(type, listener) {
    if (!Array.isArray(this._listeners[type])) {
        this._listeners[type] = [];
    }

    if (this._listeners[type].indexOf(listener) === -1) {
        this._listeners[type].push(listener);
    }

    return this;
};

EventEmitter.prototype.once = function _once(type, listener) {
    var self = this;

    function __once() {
        for (var args = [], i = 0; i < arguments.length; i += 1) {
            args[i] = arguments[i];
        }

        self.off(type, __once);
        listener.apply(self, args);
    }

    __once.listener = listener;

    return this.on(type, __once);
};

EventEmitter.prototype.off = function _off(type, listener) {
    if (!Array.isArray(this._listeners[type])) {
        return this;
    }

    if (typeof listener === 'undefined') {
        this._listeners[type] = [];
        return this;
    }

    var index = this._listeners[type].indexOf(listener);

    if (index === -1) {
        for (var i = 0; i < this._listeners[type].length; i += 1) {
            if (this._listeners[type][i].listener === listener) {
                index = i;
                break;
            }
        }
    }

    this._listeners[type].splice(index, 1);
    return this;
};

EventEmitter.prototype.emit = function _emit(type) {

    var args = Array.prototype.slice.call(arguments);
    var modifiedArgs = args.slice(1);

    var listeners = this._listeners[type];
    var j, len;
    if (Array.isArray(listeners)) {
      for (j = 0, len = listeners.length; j < len; j++) {
        listeners[j].apply(this, modifiedArgs);
      }
    }

    //special '*' event
    listeners = this._listeners['*'];
    for (j = 0, len = listeners.length; j < len; j++) {
        listeners[j].apply(this, args);
    }

    return this;
};

/* end tiny-events */

/* begin ArraySet */

/** @constructor */
function ArraySet(l) {
    l = l || [];
    this.o = new Set(l);        
}

ArraySet.prototype = {

    add : function(x) {
        this.o.add(x);
    },

    remove : function(x) {
        return this.o.delete(x);
    },

    union : function(l) {
        for (var v of l.o) {
            this.o.add(v);
        }
        return this;
    },

    difference : function(l) {
        for (var v of l.o) {
            this.o.delete(v);
        }
        return this;
    },

    contains : function(x) {
        return this.o.has(x);
    },

    iter : function() {
        return Array.from(this.o);
    },

    isEmpty : function() {
        return !this.o.size;
    },

    size: function() {
        return this.o.size;
    },

    equals : function(s2) {
        if (this.o.size !== s2.size()) {
            return false;
        }

        for (var v of this.o) {
            if (!s2.contains(v)) {
                return false;
            }
        }

        return true;
    },

    toString : function() {
        return this.o.size === 0 ? '<empty>' : Array.from(this.o).join(',\n');
    }
};

const RX_TRAILING_WILDCARD = /\.\*$/;

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

//model accessor functions
var query = {
    isDescendant : function(s1, s2){
      //Returns 'true' if state1 is a descendant of state2 (a child, or a child of a child, or a child of a child of a child, etc.) Otherwise returns 'false'.
      return s2.descendants.indexOf(s1) > -1;
    },
    getAncestors: function(s, root) {
        var ancestors, index, state;
        index = s.ancestors.indexOf(root);
        if (index > -1) {
            return s.ancestors.slice(0, index);
        } else {
            return s.ancestors;
        }
    },
    /** @this {model} */
    getAncestorsOrSelf: function(s, root) {
        return [s].concat(this.getAncestors(s, root));
    },
    getDescendantsOrSelf: function(s) {
        return [s].concat(s.descendants);
    }
};

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

const printTrace = !!process.env.DEBUG;

BaseInterpreter.EVENTS = [
  'onEntry',
  'onExit',
  'onTransition',
  'onError',
  'onBigStepBegin',
  'onBigStepSuspend',
  'onBigStepResume',
  'onSmallStepBegin',
  'onSmallStepEnd',
  'onBigStepEnd'
];

/** @constructor */
function BaseInterpreter(modelOrFnGenerator, opts){

    EventEmitter.call(this);

    this._scriptingContext = opts.interpreterScriptingContext || (opts.InterpreterScriptingContext ? new opts.InterpreterScriptingContext(this) : {}); 


    this.opts = opts || {};

    this.opts.generateSessionid = this.opts.generateSessionid || BaseInterpreter.generateSessionid;
    this.opts.sessionid = this.opts.sessionid || this.opts.generateSessionid();
    this.opts.sessionRegistry = this.opts.sessionRegistry || BaseInterpreter.sessionRegistry;  //TODO: define a better interface. For now, assume a Map<sessionid, session>


    let _ioprocessors = {};
    _ioprocessors[SCXML_IOPROCESSOR_TYPE] = {
      location : `#_scxml_${this.opts.sessionid}`
    }
    _ioprocessors.scxml = _ioprocessors[SCXML_IOPROCESSOR_TYPE];    //alias

    //SCXML system variables:
    opts._x = {
        _sessionid : opts.sessionid,
        _ioprocessors : _ioprocessors
    };


    var model;
    if(typeof modelOrFnGenerator === 'function'){
        model = initializeModelGeneratorFn(modelOrFnGenerator, opts, this);
    }else if(typeof modelOrFnGenerator === 'object'){
        model = JSON.parse(JSON.stringify(modelOrFnGenerator)); //assume object
    }else{
        throw new Error('Unexpected model type. Expected model factory function, or scjson object.');
    }

    this._model = initializeModel(model);

    this.opts.console = opts.console || (typeof console === 'undefined' ? {log : function(){}} : console);   //rely on global console if this console is undefined
    this.opts.Set = this.opts.Set || ArraySet;
    this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority;
    this.opts.transitionSelector = this.opts.transitionSelector || scxmlPrefixTransitionSelector;

    this.opts.sessionRegistry.set(String(this.opts.sessionid), this);

    this._scriptingContext.log = this._scriptingContext.log || (function log(){ 
      if(this.opts.console.log.apply){
        this.opts.console.log.apply(this.opts.console, arguments); 
      } else {
        //console.log on older IE does not support Function.apply, so just pass him the first argument. Best we can do for now.
        this.opts.console.log(Array.prototype.slice.apply(arguments).join(',')); 
      }
    }.bind(this));   //set up default scripting context log function

    this._externalEventQueue = [];
    this._internalEventQueue = [];

    if(opts.params){
      this._model.$deserializeDatamodel(opts.params);   //load up the datamodel
    }

    //check if we're loading from a previous snapshot
    if(opts.snapshot){
      this._configuration = new this.opts.Set(deserializeSerializedConfiguration(opts.snapshot[0], this._model.$idToStateMap));
      this._historyValue = deserializeHistory(opts.snapshot[1], this._model.$idToStateMap); 
      this._isInFinalState = opts.snapshot[2];
      this._model.$deserializeDatamodel(opts.snapshot[3]);   //load up the datamodel
    }else{
      this._configuration = new this.opts.Set();
      this._historyValue = {};
      this._isInFinalState = false;
    }

    //add debug logging
    BaseInterpreter.EVENTS.forEach(function(event){
      this.on(event, this._log.bind(this,event));
    }, this);
}

//some global singletons to use to generate in-memory session ids, in case the user does not specify these data structures
BaseInterpreter.sessionIdCounter = 1;
BaseInterpreter.generateSessionid = function(){
  return BaseInterpreter.sessionIdCounter++;
}
BaseInterpreter.sessionRegistry = new Map();

BaseInterpreter.prototype = extend(beget(EventEmitter.prototype),{
  
    /** @expose */
    //cancel an invoked session
    cancel : function(){
      delete this.opts.parentSession;
      if(this._isInFinalState) return;
      this._isInFinalState = true;
      this._log(`session cancelled ${this.opts.invokeid}`);
      this._exitInterpreter();
    },

    _exitInterpreter : function(){
      //TODO: cancel invoked sessions
      //cancel all delayed sends when we enter into a final state.
      this._cancelAllDelayedSends();

      let statesToExit = this._getFullConfiguration().sort(getStateWithHigherSourceChildPriority);

      for (var j = 0, len = statesToExit.length; j < len; j++) {
          var stateExited = statesToExit[j];

          if(stateExited.onExit !== undefined) {
              for (var exitIdx = 0, exitLen = stateExited.onExit.length; exitIdx < exitLen; exitIdx++) {
                  let block = stateExited.onExit[exitIdx];
                  for (let blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
                      let actionRef = block[blockIdx];
                      try {
                        actionRef.call(this._scriptingContext, null);
                      } catch (e){
                        this._handleError(e, actionRef);
                        break;
                      }
                  }
              }
          }

          //cancel invoked session
          if(stateExited.invokes) stateExited.invokes.forEach( invoke => {
            this._scriptingContext.cancelInvoke(invoke.id);
          })

          //if he is a top-level <final> state, then return the done event
          if(this.opts.parentSession &&
              stateExited.$type === 'final' &&
              stateExited.parent.$type === 'scxml'){

            this._scriptingContext.send({
              target: '#_parent', 
              name: 'done.invoke.' + this.opts.invokeid
            });

            this.opts.sessionRegistry.delete(this.opts.sessionid);
          }
      }

    },

    /** @expose */
    start : function() {
        this._initStart();
        this._performBigStep();
        return this.getConfiguration();
    },

    /**
     * Starts the interpreter asynchronously
     * @param  {Function} cb Callback invoked with an error or the interpreter's stable configuration
     * @expose
     */
    startAsync : function(cb) {
        cb = this._initStart(cb);
        this.genAsync(null, cb);
    },

    _initStart : function(cb){
        if (typeof cb !== 'function') {
            cb = nop;
        }

        this._log("performing initial big step");

        //We effectively need to figure out states to enter here to populate initial config. assuming root is compound state makes this simple.
        //but if we want it to be parallel, then this becomes more complex. so when initializing the model, we add a 'fake' root state, which
        //makes the following operation safe.
        this._model.initialRef.forEach( s => this._configuration.add(s) );

        return cb;
    },

    /** @expose */
    getConfiguration : function() {
        return this._configuration.iter().map(function(s){return s.id;});
    },

    _getFullConfiguration : function(){
        return this._configuration.iter().
                map(function(s){ return [s].concat(query.getAncestors(s));},this).
                reduce(function(a,b){return a.concat(b);},[]).    //flatten
                reduce(function(a,b){return a.indexOf(b) > -1 ? a : a.concat(b);},[]); //uniq
    },


    /** @expose */
    getFullConfiguration : function() {
        return this._getFullConfiguration().map(function(s){return s.id;});
    },


    /** @expose */
    isIn : function(stateName) {
        return this.getFullConfiguration().indexOf(stateName) > -1;
    },

    /** @expose */
    isFinal : function(stateName) {
        return this._isInFinalState;
    },

    /** @private */
    _performBigStep : function(e) {
        let currentEvent, keepGoing, allStatesExited, allStatesEntered;
        [allStatesExited, allStatesEntered, keepGoing, currentEvent] = this._startBigStep(e);

        while (keepGoing) {
          [currentEvent, keepGoing] = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);
        }

        this._finishBigStep(allStatesEntered, allStatesExited);
    },

    _selectTransitionsAndPerformSmallStep : function(currentEvent, allStatesEntered, allStatesExited){
        var selectedTransitions  = this._selectTransitions(currentEvent, true);
        if(selectedTransitions.isEmpty()){
          currentEvent = this._internalEventQueue.shift() || null;
          selectedTransitions = this._selectTransitions(currentEvent, false);
        }

        this.emit('onSmallStepBegin', currentEvent);
        let statesExited, statesEntered;
        [statesExited, statesEntered] = this._performSmallStep(currentEvent, selectedTransitions);
        if(statesExited) statesExited.forEach( s => allStatesExited.add(s) );
        if(statesEntered) statesEntered.forEach( s => allStatesEntered.add(s) );
        this.emit('onSmallStepEnd', currentEvent);
        let keepGoing = !selectedTransitions.isEmpty() || this._internalEventQueue.length;
        return [currentEvent, keepGoing];
    },

    _startBigStep : function(e){
        this.emit('onBigStepBegin');

        //do applyFinalize and autoforward
        this._configuration.iter().forEach(state => {
          if(state.invokes) state.invokes.forEach( invoke =>  {
            if(invoke.autoforward){
              //autoforward
              this._scriptingContext.send({
                target: `#_${invoke.id}`, 
                name: e.name,
                data : e.data
              });
            }
            if(invoke.id === e.invokeid){
              //applyFinalize
              if(invoke.finalize) invoke.finalize.forEach( action =>  this._evaluateAction(e, action));
            } 
          })
        }); 

        if (e) this._internalEventQueue.push(e);

        let allStatesExited = new Set(), allStatesEntered = new Set();
        let keepGoing = true;
        let currentEvent = null;
        return [allStatesEntered, allStatesExited, keepGoing, currentEvent];
    },

    _finishBigStep : function(allStatesEntered, allStatesExited, cb){
        let statesToInvoke = Array.from(new Set([...allStatesEntered].filter(s => s.invokes && !allStatesExited.has(s)))).sort(sortInEntryOrder);

        // Here we invoke whatever needs to be invoked. The implementation of 'invoke' is platform-specific
        statesToInvoke.forEach( s => {
            s.invokes.forEach( f =>  this._evaluateAction(null,f) )
        });

        // cancel invoke for allStatesExited
        allStatesExited.forEach( s => {
          if(s.invokes) s.invokes.forEach( invoke => {
            this._scriptingContext.cancelInvoke(invoke.id);
          })
        });

        // TODO: Invoking may have raised internal error events and we iterate to handle them        
        //if not internalQueue.isEmpty():
        //    continue

        this._isInFinalState = this._configuration.iter().every(function(s){ return s.typeEnum === STATE_TYPES.FINAL; });
        if(this._isInFinalState){
          this._exitInterpreter();
        }
        this.emit('onBigStepEnd');
        if(cb) cb(undefined, this.getConfiguration());
    },

    _cancelAllDelayedSends : function(){
      for( let timeoutOptions of this._scriptingContext._timeouts){
        if(!timeoutOptions.sendOptions.delay) continue;
        this._log('cancelling delayed send', timeoutOptions);
        clearTimeout(timeoutOptions.timeoutHandle);
        this._scriptingContext._timeouts.delete(timeoutOptions);
      }
      Object.keys(this._scriptingContext._timeoutMap).forEach(function(key){
        delete this._scriptingContext._timeoutMap[key];
      }, this);
    },

    _performBigStepAsync : function(e, cb) {
        let currentEvent, keepGoing, allStatesExited, allStatesEntered;
        [allStatesExited, allStatesEntered, keepGoing, currentEvent] = this._startBigStep(e);

        function nextStep(emit){
          this.emit(emit);
          [currentEvent, keepGoing] = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);

          if(keepGoing){
            this.emit('onBigStepSuspend');
            setImmediate(nextStep.bind(this),'onBigStepResume');
          }else{
            this._finishBigStep(allStatesEntered, allStatesExited, cb);
          }
        }
        nextStep.call(this,'onBigStepBegin');
    },

    /** @private */
    _performSmallStep : function(currentEvent, selectedTransitions) {

        this._log("selecting transitions with currentEvent", currentEvent);

        this._log("selected transitions", selectedTransitions);

        let basicStatesExited, 
            statesExited,
            statesEntered;

        if (!selectedTransitions.isEmpty()) {

            this._log("sorted transitions", selectedTransitions);

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.Set(selectedTransitions.iter().filter(transitionWithTargets));

            [basicStatesExited, statesExited] = this._getStatesExited(selectedTransitionsWithTargets), 

            statesEntered = new Set();
            let statesForDefaultEntry = new Set();
            // initialize the temporary table for default content in history states
            let defaultHistoryContent = {};
            this._computeEntrySet(selectedTransitionsWithTargets, statesEntered, statesForDefaultEntry, defaultHistoryContent); 
            statesEntered = [...statesEntered].sort(sortInEntryOrder); 

            this._log("basicStatesExited ", basicStatesExited);
            this._log("statesExited ", statesExited);
            this._log("statesEntered ", statesEntered);

            var eventsToAddToInnerQueue = new this.opts.Set();

            //update history states
            this._log("executing state exit actions");

            for (var j = 0, len = statesExited.length; j < len; j++) {
                var stateExited = statesExited[j];

                if(stateExited.isAtomic) this._configuration.remove(stateExited);

                this._log("exiting ", stateExited.id);

                //invoke listeners
                this.emit('onExit',stateExited.id)

                if(stateExited.onExit !== undefined) {
                    for (var exitIdx = 0, exitLen = stateExited.onExit.length; exitIdx < exitLen; exitIdx++) {
                        let block = stateExited.onExit[exitIdx];
                        for (let blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
                            let actionRef = block[blockIdx];
                            try {
                              actionRef.call(this._scriptingContext, currentEvent);
                            } catch (e){
                              this._handleError(e, actionRef);
                              break;
                            }
                        }
                    }
                }

                var f;
                if (stateExited.historyRef) {
                    for(let historyRef of stateExited.historyRef){
                        if (historyRef.isDeep) {
                            f = function(s0) {
                                return s0.typeEnum === STATE_TYPES.BASIC && stateExited.descendants.indexOf(s0) > -1;
                            };
                        } else {
                            f = function(s0) {
                                return s0.parent === stateExited;
                            };
                        }
                        //update history
                        this._historyValue[historyRef.id] = statesExited.filter(f);
                    }
                }
            }

            // -> Concurrency: Number of transitions: Multiple
            // -> Concurrency: Order of transitions: Explicitly defined
            var sortedTransitions = selectedTransitions.iter().sort(transitionComparator);

            this._log("executing transitition actions");


            for (var stxIdx = 0, len = sortedTransitions.length; stxIdx < len; stxIdx++) {
                var transition = sortedTransitions[stxIdx];

                var targetIds = transition.targets && transition.targets.map(function(target){return target.id;});

                this.emit('onTransition',transition.source.id,targetIds, transition.source.transitions.indexOf(transition));

                if(transition.onTransition !== undefined) {
                    for (var txIdx = 0, txLen = transition.onTransition.length; txIdx < txLen; txIdx++) {
                        let actionRef = transition.onTransition[txIdx];
                        try {
                          actionRef.call(this._scriptingContext, currentEvent);
                        } catch (e){
                          this._handleError(e, actionRef);
                          break;
                        }
                    }
                }
            }
 
            this._log("executing state enter actions");

            for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
                var stateEntered = statesEntered[enterIdx];

                if(stateEntered.isAtomic) this._configuration.add(stateEntered);

                this._log("entering", stateEntered.id);

                this.emit('onEntry',stateEntered.id);

                if(stateEntered.onEntry !== undefined) {
                    for (var entryIdx = 0, entryLen = stateEntered.onEntry.length; entryIdx < entryLen; entryIdx++) {
                        let block = stateEntered.onEntry[entryIdx];
                        for (let blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
                            let actionRef = block[blockIdx];
                            try {
                              actionRef.call(this._scriptingContext, currentEvent);
                            } catch (e){
                              this._handleError(e, actionRef);
                              break;
                            }
                        }
                    }
                }

                if(defaultHistoryContent[stateEntered.id]){
                    let transition = defaultHistoryContent[stateEntered.id]
                    if(transition.onTransition !== undefined) {
                        for (var txIdx = 0, txLen = transition.onTransition.length; txIdx < txLen; txIdx++) {
                            let actionRef = transition.onTransition[txIdx];
                            try {
                              actionRef.call(this._scriptingContext, currentEvent);
                            } catch (e){
                              this._handleError(e, actionRef);
                              break;
                            }
                        }
                    }
                }
            }

            for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
                var stateEntered = statesEntered[enterIdx];
                if(stateEntered.typeEnum === STATE_TYPES.FINAL){
                  let parent = stateEntered.parent;
                  let grandparent = parent.parent;
                  this._internalEventQueue.push({name : "done.state." + parent.id, data : stateEntered.donedata});    //TODO: implement donedata
                  if(grandparent && grandparent.typeEnum === STATE_TYPES.PARALLEL){
                      if(grandparent.states.every(s => this.isInFinalState(s) )){
                          this._internalEventQueue.push({name : "done.state." + grandparent.id});
                      }
                  }
                }
            }



            this._log("new configuration ", this._configuration);
            
            //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
            if (!eventsToAddToInnerQueue.isEmpty()) {
                this._log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                this._internalEventQueue.push(eventsToAddToInnerQueue);
            }

        }

        //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
        return [statesExited, statesEntered];
    },


    isInFinalState : function(s){
        if(s.typeEnum === STATE_TYPES.COMPOSITE){
            return s.states.some(s => s.typeEnum === STATE_TYPES.FINAL && this._configuration.contains(s));
        }else if(s.typeEnum === STATE_TYPES.PARALLEL){
            return s.states.every(this.isInFinalState.bind(this))
        }else{
            return false
        }
    },

    /** @private */
    _evaluateAction : function(currentEvent, actionRef) {
        try {
          return actionRef.call(this._scriptingContext, currentEvent);     //SCXML system variables
        } catch (e){
          this._handleError(e, actionRef);
        }
    },

    _handleError : function(e, actionRef){
      let event = 
        e instanceof Error || e.__proto__.name === 'Error' ?  //we can't just do 'e instanceof Error', because the Error object in the sandbox is from a different context, and instanceof will return false
          {
            name:'error.execution',
            data : {
              tagname: actionRef.tagname, 
              line: actionRef.line, 
              column: actionRef.column,
              reason: e.message
            },
            type : 'platform'
          } : 
          (e.name ? 
            e : 
            {
              name:'error.execution',
              data:e,
              type : 'platform'
            }
          );
      this._internalEventQueue.push(event);
      this.emit('onError', event);
    },

    /** @private */
    _getStatesExited : function(transitions) {
        var statesExited = new this.opts.Set();
        var basicStatesExited = new this.opts.Set();

        //States exited are defined to be active states that are
        //descendants of the scope of each priority-enabled transition.
        //Here, we iterate through the transitions, and collect states
        //that match this condition. 
        var transitionList = transitions.iter();
        for (var txIdx = 0, txLen = transitionList.length; txIdx < txLen; txIdx++) {
            var transition = transitionList[txIdx];
            var scope = transition.scope,
                desc = scope.descendants;

            //For each state in the configuration
            //is that state a descendant of the transition scope?
            //Store ancestors of that state up to but not including the scope.
            var configList = this._configuration.iter();
            for (var cfgIdx = 0, cfgLen = configList.length; cfgIdx < cfgLen; cfgIdx++) {
                var state = configList[cfgIdx];
                if(desc.indexOf(state) > -1){
                    basicStatesExited.add(state);
                    statesExited.add(state);
                    var ancestors = query.getAncestors(state,scope); 
                    for (var ancIdx = 0, ancLen = ancestors.length; ancIdx < ancLen; ancIdx++) { 
                        statesExited.add(ancestors[ancIdx]);
                    }
                }
            }
        }

        var sortedStatesExited = statesExited.iter().sort(getStateWithHigherSourceChildPriority);
        return [basicStatesExited, sortedStatesExited];
    },

    _computeEntrySet : function(transitions, statesToEnter, statesForDefaultEntry, defaultHistoryContent){
      for(let t of transitions.iter()){
          for(let s of t.targets){
              this._addDescendantStatesToEnter(s,statesToEnter, statesForDefaultEntry, defaultHistoryContent) 
          }
          let ancestor = t.scope;
          for(let s of this._getEffectiveTargetStates(t)){
              this._addAncestorStatesToEnter(s, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent)
          }
      }
    },

    _getEffectiveTargetStates : function(transition){
      let targets = new Set();
      for(let s of transition.targets){
          if(s.typeEnum === STATE_TYPES.HISTORY){
              if(s.id in this._historyValue)
                  this._historyValue[s.id].forEach( state => targets.add(state))
              else
                  [...this._getEffectiveTargetStates(s.transitions[0])].forEach( state => targets.add(state))
          } else {
              targets.add(s)
          }
      }
      return targets
    },

    _addDescendantStatesToEnter : function(state,statesToEnter, statesForDefaultEntry, defaultHistoryContent){
      if(state.typeEnum === STATE_TYPES.HISTORY){
          if(this._historyValue[state.id]){
              for(let s of this._historyValue[state.id])
                  this._addDescendantStatesToEnter(s,statesToEnter, statesForDefaultEntry, defaultHistoryContent)
              
              for(let s of this._historyValue[state.id])
                  this._addAncestorStatesToEnter(s, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent)
          } else {
            defaultHistoryContent[state.parent.id] = state.transitions[0]
            for(let s of state.transitions[0].targets)
                this._addDescendantStatesToEnter(s,statesToEnter,statesForDefaultEntry, defaultHistoryContent)
            
            for(let s of state.transitions[0].targets)
                this._addAncestorStatesToEnter(s, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent)
            
          }
      } else {
          statesToEnter.add(state)
          if(state.typeEnum === STATE_TYPES.COMPOSITE){
              for(let s of state.initialRef)
                  this._addDescendantStatesToEnter(s,statesToEnter)
              for(let s of state.initialRef)
                  this._addAncestorStatesToEnter(s, state, statesToEnter)
          }else{
              if(state.typeEnum === STATE_TYPES.PARALLEL){
                  for(let child of state.states){
                      if(![...statesToEnter].some(s => query.isDescendant(s, child))){
                          this._addDescendantStatesToEnter(child,statesToEnter) 
                      }
                  }
              }
          }
      }
    },

    _addAncestorStatesToEnter : function(state, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent){
      let traverse = (anc) => {
          if(anc.typeEnum === STATE_TYPES.PARALLEL){
              for(let child of anc.states){
                  if(![...statesToEnter].some(s => query.isDescendant(s, child))){
                      this._addDescendantStatesToEnter(child,statesToEnter, statesForDefaultEntry, defaultHistoryContent) 
                  }
              }
          }
      };
      for(let anc of query.getAncestors(state,ancestor)){
          statesToEnter.add(anc)
          traverse(anc)
      }
      traverse(ancestor)
    },

    /** @private */
    _selectTransitions : function(currentEvent, selectEventlessTransitions) {
        var transitionSelector = this.opts.transitionSelector;
        var enabledTransitions = new this.opts.Set();

        var e = this._evaluateAction.bind(this,currentEvent);

        let atomicStates = this._configuration.iter().sort(transitionComparator);
        for(let state of atomicStates){
            loop: for(let s of [state].concat(query.getAncestors(state))){
                for(let t of s.transitions){
                    if(transitionSelector(t, currentEvent, e, selectEventlessTransitions)){
                        enabledTransitions.add(t);
                        break loop;
                    }
                }
            }
        }

        var priorityEnabledTransitions = this._removeConflictingTransition(enabledTransitions);

        this._log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        return priorityEnabledTransitions;
    },

    
    _computeExitSet : function(transitions) {
      let statesToExit = new Set();
      for(let t of transitions){
          if(t.targets){
              let scope = t.scope;
              for(let s of this._getFullConfiguration()){
                  if(query.isDescendant(s,scope)) statesToExit.add(s);
              }
          }
      }
      return statesToExit; 
    },
   

    /** @private */
    _removeConflictingTransition : function(enabledTransitions) {
      let filteredTransitions = new this.opts.Set()
      //toList sorts the transitions in the order of the states that selected them
      for( let t1 of enabledTransitions.iter()){
          let t1Preempted = false;
          let transitionsToRemove = new Set()
          for (let t2 of filteredTransitions.iter()){
              //TODO: can we compute this statically? for example, by checking if the transition scopes are arena orthogonal?
              let t1ExitSet = this._computeExitSet([t1]);
              let t2ExitSet = this._computeExitSet([t2]);
              let hasIntersection = [...t1ExitSet].some( s => t2ExitSet.has(s) )  || [...t2ExitSet].some( s => t1ExitSet.has(s));
              this._log('t1ExitSet',t1.source.id,[...t1ExitSet].map( s => s.id ))
              this._log('t2ExitSet',t2.source.id,[...t2ExitSet].map( s => s.id ))
              this._log('hasIntersection',hasIntersection)
              if(hasIntersection){
                  if(t2.source.descendants.indexOf(t1.source) > -1){    //is this the same as being ancestrally related?
                      transitionsToRemove.add(t2)
                  }else{ 
                      t1Preempted = true;
                      break
                  }
              }
          }
          if(!t1Preempted){
              for(let t3 of transitionsToRemove){
                  filteredTransitions.remove(t3)
              }
              filteredTransitions.add(t1)
          }
      }
             
      return filteredTransitions;
    },

    _log : function(){
      if(printTrace){
        var args = Array.from(arguments);
        this.opts.console.log( 
          `${args[0]}: ${
            args.slice(1).map(function(arg){
              return arg === null ? 'null' : 
                ( arg === undefined ? 'undefined' : 
                  ( typeof arg === 'string' ? arg : 
                    ( arg.toString() === '[object Object]' ? util.inspect(arg) : arg.toString())));

            }).join(', ')
          }\n`
        );
      }
    },

    /*
        registerListener provides a generic mechanism to subscribe to state change and runtime error notifications.
        Can be used for logging and debugging. For example, can attach a logger that simply logs the state changes.
        Or can attach a network debugging client that sends state change notifications to a debugging server.
    
        listener is of the form:
        {
          onEntry : function(stateId){},
          onExit : function(stateId){},
          onTransition : function(sourceStateId,targetStatesIds[]){},
          onError: function(errorInfo){},
          onBigStepBegin: function(){},
          onBigStepResume: function(){},
          onBigStepSuspend: function(){},
          onBigStepEnd: function(){}
          onSmallStepBegin: function(event){},
          onSmallStepEnd: function(){}
        }
    */
    //TODO: refactor this to be event emitter? 

    /** @expose */
    registerListener : function(listener){
        BaseInterpreter.EVENTS.forEach(function(event){
          if(listener[event]) this.on(event,listener[event]);
        }, this);
    },

    /** @expose */
    unregisterListener : function(listener){
        BaseInterpreter.EVENTS.forEach(function(event){
          if(listener[event]) this.off(event,listener[event]);
        }, this);
    },

    /** @expose */
    getAllTransitionEvents : function(){
        var events = {};
        function getEvents(state){

            if(state.transitions){
                for (var txIdx = 0, txLen = state.transitions.length; txIdx < txLen; txIdx++) {
                    events[state.transitions[txIdx].event] = true;
                }
            }

            if(state.states) {
                for (var stateIdx = 0, stateLen = state.states.length; stateIdx < stateLen; stateIdx++) {
                    getEvents(state.states[stateIdx]);
                }
            }
        }

        getEvents(this._model);

        return Object.keys(events);
    },

    
    /** @expose */
    /**
      Three things capture the current snapshot of a running SCION interpreter:

      * basic configuration (the set of basic states the state machine is in)
      * history state values (the states the state machine was in last time it was in the parent of a history state)
      * the datamodel
      
      Note that this assumes that the method to serialize a scion.SCXML
      instance is not called when the interpreter is executing a big-step (e.g. after
      scion.SCXML.prototype.gen is called, and before the call to gen returns). If
      the serialization method is called during the execution of a big-step, then the
      inner event queue must also be saved. I do not expect this to be a common
      requirement however, and therefore I believe it would be better to only support
      serialization when the interpreter is not executing a big-step.
    */
    getSnapshot : function(){
      if(this._isStepping) throw new Error('getSnapshot cannot be called while interpreter is executing a big-step');


      return [
        this.getConfiguration(),
        this._serializeHistory(),
        this._isInFinalState,
        this._model.$serializeDatamodel()
      ];
    },

    _serializeHistory : function(){
      var o = {};
      Object.keys(this._historyValue).forEach(function(sid){
        o[sid] = this._historyValue[sid].map(function(state){return state.id});
      },this);
      return o;
    }
});

/**
 * @constructor
 * @extends BaseInterpreter
 */
function Statechart(model, opts) {
    opts = opts || {};

    opts.InterpreterScriptingContext = opts.InterpreterScriptingContext || InterpreterScriptingContext;

    this._isStepping = false;

    BaseInterpreter.call(this,model,opts);     //call super constructor
}

function beget(o){
    function F(){}
    F.prototype = o;
    return new F();
}

/**
 * Do nothing
 */
function nop() {}

//Statechart.prototype = Object.create(BaseInterpreter.prototype);
//would like to use Object.create here, but not portable, but it's too complicated to use portably
Statechart.prototype = beget(BaseInterpreter.prototype);    

/** @expose */
Statechart.prototype.gen = function(evtObjOrName,optionalData) {

    var currentEvent;
    switch(typeof evtObjOrName){
        case 'string':
            currentEvent = {name : evtObjOrName, data : optionalData};
            break;
        case 'object':
            if(typeof evtObjOrName.name === 'string'){
                currentEvent = evtObjOrName;
            }else{
                throw new Error('Event object must have "name" property of type string.');
            }
            break;
        default:
            throw new Error('First argument to gen must be a string or object.');
    }

    if(this._isStepping) throw new Error('Cannot call gen during a big-step');

    //otherwise, kick him off
    this._isStepping = true;

    this._performBigStep(currentEvent);

    this._isStepping = false;
    return this.getConfiguration();
};

/**
 * Injects an external event into the interpreter asynchronously
 * @param  {object}   currentEvent The event to inject
 * @param {string} currentEvent.name The name of the event
 * @param {string} [currentEvent.data] The event data
 * @param  {Function} cb Callback invoked with an error or the interpreter's stable configuration
 * @expose
 */
Statechart.prototype.genAsync = function(currentEvent, cb) {
    if (currentEvent !== null && (typeof currentEvent !== 'object' || !currentEvent || typeof currentEvent.name !== 'string')) {
        throw new Error('Expected currentEvent to be null or an Object with a name');
    }
    
    if (typeof cb !== 'function') {
        cb = nop;
    }

    this._externalEventQueue.push([currentEvent, cb]);

    //the semantics we want are to return to the cb the results of processing that particular event.
    function nextStep(e, c){
      this._performBigStepAsync(e, function(err, config) {
          c(err, config);

          if(this._externalEventQueue.length){
            nextStep.apply(this,this._externalEventQueue.shift());
          }else{
            this._isStepping = false;
          }
      }.bind(this));
    }
    if(!this._isStepping){ 
      this._isStepping = true;
      nextStep.apply(this,this._externalEventQueue.shift());
    }
};

function InterpreterScriptingContext(interpreter) {
    this._interpreter = interpreter;
    this._timeoutMap = {};
    this._invokeMap = {};
    this._timeouts = new Set()
}

//Regex from:
//  http://daringfireball.net/2010/07/improved_regex_for_matching_urls
//  http://stackoverflow.com/a/6927878
var validateUriRegex = /(#_.*)|\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

//TODO: consider whether this is the API we would like to expose
InterpreterScriptingContext.prototype = {
    invokeSendTargetRegex  : /^#_(.*)$/,
    scxmlSendTargetRegex  : /^#_scxml_(.*)$/,
    raise : function(event){
        this._installDefaultPropsOnEvent(event, true);
        this._interpreter._internalEventQueue.push(event); 
    },
    parseXmlStringAsDOM : function(xmlString){
      return (this._interpreter.opts.xmlParser || InterpreterScriptingContext.xmlParser).parse(xmlString);
    },
    invoke : function(invokeObj){
      //look up invoker by type. assume invokers are passed in as an option to constructor
      this._invokeMap[invokeObj.id] = new Promise((resolve, reject) => {
        (this._interpreter.opts.invokers || InterpreterScriptingContext.invokers)[invokeObj.type](this._interpreter, invokeObj, (err, session) => {
          if(err) return reject(err);
  
          resolve(session);
        });
      });
    },
    cancelInvoke : function(invokeid){
      //TODO: on cancel invoke clean up this._invokeMap
      let sessionPromise = this._invokeMap[invokeid];
      this._interpreter._log(`cancelling session with invokeid ${invokeid}`);
      if(sessionPromise){
        this._interpreter._log(`sessionPromise found`);
        sessionPromise.then( 
          ((session) => {
            this._interpreter._log(`resolved session ${invokeid}. cancelling... `);
            session.cancel(); 
            //clean up
            delete this._invokeMap[invokeid];
          }), 
          ( (err) => {
            //TODO: dispatch error back into the state machine as error.communication
          }));
      }
    },
    _installDefaultPropsOnEvent : function(event,isInternal){
      if(!isInternal){ 
        event.origin = this._interpreter.opts._x._ioprocessors.scxml.location;     //TODO: preserve original origin when we autoforward? 
        event.origintype = event.type || SCXML_IOPROCESSOR_TYPE;
      }
      if(typeof event.type === 'undefined'){
        event.type = isInternal ? 'internal' : 'external';
      }
      [
        'name',
        'sendid',
        'invokeid',
        'data',
        'origin',
        'origintype'
      ].forEach(prop => {
        if(!event[prop]){
          event[prop] = undefined;
        }
      });
    },
    send : function(event, options){
        this._interpreter._log('send event', event, options);
        options = options || {};
        var sendType = options.type || SCXML_IOPROCESSOR_TYPE;
        //TODO: move these out
        function validateSend(event, options, sendAction){
          if(event.target){
            var targetIsValidUri = validateUriRegex.test(event.target)
            if(!targetIsValidUri){
              throw { name : "error.execution", data: 'Target is not valid URI', sendid: event.sendid, type : 'platform' };
            }
          }
          if( sendType !== SCXML_IOPROCESSOR_TYPE) {  //TODO: extend this to support HTTP, and other IO processors
              throw { name : "error.execution", data: 'Unsupported event processor type', sendid: event.sendid, type : 'platform' };
          }

          sendAction.call(this, event, options);
        }

        function defaultSendAction (event, options) {

          if( typeof setTimeout === 'undefined' ) throw new Error('Default implementation of Statechart.prototype.send will not work unless setTimeout is defined globally.');

          var match;
          if(event.target === '#_internal'){
            this.raise(event);
          }else{ 
            this._installDefaultPropsOnEvent(event, false);
            event.origintype = SCXML_IOPROCESSOR_TYPE;      //TODO: extend this to support HTTP, and other IO processors
                                                            //TODO : paramterize this based on send/@type?
            if(!event.target){
              doSend.call(this, this._interpreter);
            }else if(event.target === '#_parent'){
              if(this._interpreter.opts.parentSession){
                event.invokeid = this._interpreter.opts.invokeid;
                doSend.call(this, this._interpreter.opts.parentSession);
              }else{
                throw { name : "error.communication", data: 'Parent session not specified', sendid: event.sendid, type : 'platform' };
              }
            } else if(match = event.target.match(this.scxmlSendTargetRegex)){
              let targetSessionId = match[1];
              let session = this._interpreter.opts.sessionRegistry.get(targetSessionId)
              if(session){
                doSend.call(this,session);
              }else {
                throw {name : 'error.communication', sendid: event.sendid, type : 'platform'};
              }
            }else if(match = event.target.match(this.invokeSendTargetRegex)){
              //TODO: test this code path.
              var invokeId = match[1]
              this._invokeMap[invokeId].then( (session) => {
                doSend.call(this,session);
              })
            } else {
              throw new Error('Unrecognized send target.'); //TODO: dispatch error back into the state machine
            }
          }

          function doSend(session){
            //TODO: we probably now need to refactor data structures:
            //    this._timeouts
            //    this._timeoutMap
            var timeoutHandle = setTimeout(function(){
              if (event.sendid) delete this._timeoutMap[event.sendid];
              this._timeouts.delete(timeoutOptions);
              session[this._interpreter.opts.sendAsync ? 'genAsync' : 'gen'](event);
            }.bind(this), options.delay || 0);

            var timeoutOptions = {
              sendOptions : options,
              timeoutHandle : timeoutHandle
            };
            if (event.sendid) this._timeoutMap[event.sendid] = timeoutHandle;
            this._timeouts.add(timeoutOptions); 
          }
        }

        function publish(){
          this._interpreter.emit(event.name,event.data);
        }

        //choose send function
        //TODO: rethink how this custom send works
        var sendFn;         
        if(event.type === 'https://github.com/jbeard4/SCION#publish'){
          sendFn = publish;
        }else if(this._interpreter.opts.customSend){
          sendFn = this._interpreter.opts.customSend;
        }else{
          sendFn = defaultSendAction;
        }

        options=options || {};

        this._interpreter._log("sending event", event.name, "with content", event.data, "after delay", options.delay);

        validateSend.call(this, event, options, sendFn);
    },
    cancel : function(sendid){
        if(this._interpreter.opts.customCancel) {
            return this._interpreter.opts.customCancel.apply(this, [sendid]);
        }

        if( typeof clearTimeout === 'undefined' ) throw new Error('Default implementation of Statechart.prototype.cancel will not work unless setTimeout is defined globally.');

        if (sendid in this._timeoutMap) {
            this._interpreter._log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
            clearTimeout(this._timeoutMap[sendid]);
        }
    }
};

module.exports = {
    /** @expose */
    BaseInterpreter: BaseInterpreter,
    /** @expose */
    Statechart: Statechart,
    /** @expose */
    ArraySet : ArraySet,
    /** @expose */
    STATE_TYPES : STATE_TYPES,
    /** @expose */
    initializeModel : initializeModel,
    /** @expose */
    InterpreterScriptingContext : InterpreterScriptingContext
};
