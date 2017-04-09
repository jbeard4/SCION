//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

var ioProcessorTypes = {
    'scxml': {
        location: 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor'
    },
    'basichttp': {
        location: 'http://www.w3.org/TR/scxml/#BasicHTTPEventProcessor'
    },
    'dom': {
        location: 'http://www.w3.org/TR/scxml/#DOMEventProcessor'
    },
    'publish': {
        location: 'https://github.com/jbeard4/SCION#publish'
    }
};

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
                break;
            case 'initial' : 
                state.typeEnum = STATE_TYPES.INITIAL;
                break;
            case 'history' :
                state.typeEnum = STATE_TYPES.HISTORY;
                break;
            case 'final' : 
                state.typeEnum = STATE_TYPES.FINAL;
                break;
            case 'state' : 
            case 'scxml' :
                if(state.states && state.states.length){
                    state.typeEnum = STATE_TYPES.COMPOSITE;
                }else{
                    state.typeEnum = STATE_TYPES.BASIC;
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
            
            if(typeof state.initial === 'string'){
                statesWithInitialAttributes.push(state);
            }else{
                //take the first child that has initial type, or first child
                initialChildren = state.states.filter(function(child){
                    return child.$type === 'initial';
                });

                state.initialRef = initialChildren.length ? initialChildren[0] : state.states[0];
                checkInitialRef(state);
            }

        }

        //hook up history
        if(state.typeEnum === STATE_TYPES.COMPOSITE ||
                state.typeEnum === STATE_TYPES.PARALLEL){

            var historyChildren = state.states.filter(function(s){
                return s.$type === 'history';
            }); 

           state.historyRef = historyChildren[0];
        }

        //now it's safe to fill in fake state ids
        if(!state.id){
            state.id = generateId(state.$type);
            idToStateMap.set(state.id, state);
        }

        //normalize onEntry/onExit, which can be single fn or array
        if (state.onEntry && !Array.isArray(state.onEntry)) {
            state.onEntry = [state.onEntry];
        }

        if (state.onExit && !Array.isArray(state.onExit)) {
            state.onExit = [state.onExit];
        }
    }

    //TODO: convert events to regular expressions in advance

    function checkInitialRef(state){
      if(!state.initialRef) throw new Error('Unable to locate initial state for composite state: ' + state.id);
    }
    function connectIntialAttributes(){
      for (var j = 0, len = statesWithInitialAttributes.length; j < len; j++) {
        var s = statesWithInitialAttributes[j];
        s.initialRef = idToStateMap.get(s.initial);
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
            //console.log('scope',t.source.id,t.scope.id,t.targets);
        }
    }

    function getScope(transition){
        //Transition scope is normally the least common compound ancestor (lcca).
        //Internal transitions have a scope equal to the source state.

        var transitionIsReallyInternal = 
                transition.type === 'internal' &&
                    transition.source.parent &&    //root state won't have parent
                        transition.targets && //does it target its descendants
                            transition.targets.every(
                                function(target){ return transition.source.descendants.indexOf(target) > -1;});

        if(!transition.targets){
            return transition.source; 
        }else if(transitionIsReallyInternal){
            return transition.source; 
        }else{
            return transition.lcca;
        }
    }

    function getLCCA(s1, s2) {
        //console.log('getLCCA',s1, s2);
        var commonAncestors = [];
        for (var j = 0, len = s1.ancestors.length; j < len; j++) {
            var anc = s1.ancestors[j];
            //console.log('s1.id',s1.id,'anc',anc.id,'anc.typeEnum',anc.typeEnum,'s2.id',s2.id);
            if(anc.typeEnum === STATE_TYPES.COMPOSITE &&
                anc.descendants.indexOf(s2) > -1){
                commonAncestors.push(anc);
            }
        };
        //console.log('commonAncestors',s1.id,s2.id,commonAncestors.map(function(s){return s.id;}));
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

function scxmlPrefixTransitionSelector(state, event, evaluator, selectEventlessTransitions) {
    return state.transitions.filter((t) => {
        return ( 
          selectEventlessTransitions ? 
            !t.events :
            (!t.events || (event && event.name && isTransitionMatch(t, event.name)))
          )
          && (!t.cond || evaluator(t.cond));
    });
}

function eventlessTransitionSelector(state){
  return state.transitions.filter(function(transition){ return !transition.events || ( transition.events && transition.events.length === 0 ); });
}

//model accessor functions
var query = {
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
    },
    /** @this {model} */
    isOrthogonalTo: function(s1, s2) {
        //Two control states are orthogonal if they are not ancestrally
        //related, and their smallest, mutual parent is a Concurrent-state.
        return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).typeEnum === STATE_TYPES.PARALLEL;
    },
    /** @this {model} */
    isAncestrallyRelatedTo: function(s1, s2) {
        //Two control states are ancestrally related if one is child/grandchild of another.
        return this.getAncestorsOrSelf(s2).indexOf(s1) > -1 || this.getAncestorsOrSelf(s1).indexOf(s2) > -1;
    },
    /** @this {model} */
    getLCA: function(s1, s2) {
        var commonAncestors = this.getAncestors(s1).filter(function(a){
            return a.descendants.indexOf(s2) > -1;
        },this);
        return commonAncestors[0];
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

     opts.x =  opts.x || {};

    return modelFn.call(interpreter,
        opts.x,
        opts.sessionid,
        opts.ioprocessors,
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

/** @const */
var printTrace = false;

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

    var model;
    if(typeof modelOrFnGenerator === 'function'){
        model = initializeModelGeneratorFn(modelOrFnGenerator, opts, this);
    }else if(typeof modelOrFnGenerator === 'string'){
        model = JSON.parse(modelOrFnGenerator);
    }else{
        model = modelOrFnGenerator;
    }

    this._model = initializeModel(model);

    //console.log(require('util').inspect(this._model,false,4));
   
    this.opts = opts || {};

    this.opts.console = opts.console || (typeof console === 'undefined' ? {log : function(){}} : console);   //rely on global console if this console is undefined
    this.opts.Set = this.opts.Set || ArraySet;
    this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority;
    this.opts.transitionSelector = this.opts.transitionSelector || scxmlPrefixTransitionSelector;

    this._scriptingContext.log = this._scriptingContext.log || (function log(){ 
      if(this.opts.console.log.apply){
        this.opts.console.log.apply(this.opts.console, arguments); 
      } else {
        //console.log on older IE does not support Function.apply, so just pass him the first argument. Best we can do for now.
        this.opts.console.log(Array.prototype.slice.apply(arguments).join(',')); 
      }
    }.bind(this));   //set up default scripting context log function

    this._internalEventQueue = [];

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

    //SCXML system variables:
    this._x = {
        _sessionId : opts.sessionId || null,
        _name : model.name || opts.name || null,
        _ioprocessors : opts.ioprocessors || null
    };

    //add debug logging
    BaseInterpreter.EVENTS.forEach(function(event){
      this.on(event, this._log.bind(this,event));
    }, this);
}

BaseInterpreter.prototype = extend(beget(EventEmitter.prototype),{

    /** @expose */
    start : function() {
        //perform big step without events to take all default transitions and reach stable initial state
        this._log("performing initial big step");

        //We effectively need to figure out states to enter here to populate initial config. assuming root is compound state makes this simple.
        //but if we want it to be parallel, then this becomes more complex. so when initializing the model, we add a 'fake' root state, which
        //makes the following operation safe.
        this._configuration.add(this._model.initialRef);   

        this._performBigStep();
        return this.getConfiguration();
    },

    /**
     * Starts the interpreter asynchronously
     * @param  {Function} cb Callback invoked with an error or the interpreter's stable configuration
     * @expose
     */
    startAsync : function(cb) {
        if (typeof cb !== 'function') {
            cb = nop;
        }

        this._log("performing initial big step");

        this._configuration.add(this._model.initialRef);

        this._performBigStepAsync(null, cb);
    },

    /** @expose */
    getConfiguration : function() {
        return this._configuration.iter().map(function(s){return s.id;});
    },

    /** @expose */
    getFullConfiguration : function() {
        return this._configuration.iter().
                map(function(s){ return [s].concat(query.getAncestors(s));},this).
                reduce(function(a,b){return a.concat(b);},[]).    //flatten
                map(function(s){return s.id;}).
                reduce(function(a,b){return a.indexOf(b) > -1 ? a : a.concat(b);},[]); //uniq
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
        this.emit('onBigStepBegin');
        if (e) this._internalEventQueue.push(e);
        var keepGoing = true;
        while (keepGoing) {
            var currentEvent = this._internalEventQueue.shift() || null;
            var selectedTransitions  = this._selectTransitions(currentEvent, true);
            if(selectedTransitions.isEmpty()){
              selectedTransitions = this._selectTransitions(currentEvent, false);
            }

            this.emit('onSmallStepBegin', currentEvent);
            this._performSmallStep(currentEvent, selectedTransitions);
            this.emit('onSmallStepEnd', currentEvent);
            keepGoing = !selectedTransitions.isEmpty();
        }
        this._isInFinalState = this._configuration.iter().every(function(s){ return s.typeEnum === STATE_TYPES.FINAL; });
        this.emit('onBigStepEnd');
    },

    _performBigStepAsync : function(event, cb) {
        if (event) {
            this._internalEventQueue.push(event);
        }

        var self = this;
        function doBigStep(eventToEmit) {
            var selectedTransitions;
            try {
                self.emit(eventToEmit);
                var currentEvent = self._internalEventQueue.shift() || null;
                var selectedTransitions  = self._selectTransitions(currentEvent, true);
                if(selectedTransitions.isEmpty()){
                  selectedTransitions = self._selectTransitions(currentEvent, false);
                }

                self.emit('onSmallStepBegin', currentEvent);
                self._performSmallStep(currentEvent, selectedTransitions);
                self.emit('onSmallStepEnd', currentEvent);
            } catch(err) {
                cb(err);
                return;
            }

            if (!selectedTransitions.isEmpty()) {
                // keep going, but be nice (yield) to the process
                // TODO: for compat with non-node, non-mozilla
                // allow the context to provide the defer task function
                self.emit('onBigStepSuspend');
                setImmediate(doBigStep, 'onBigStepResume');
            } else {
                self._isInFinalState =
                    self._configuration.iter().every(function(s) {
                        return s.typeEnum === STATE_TYPES.FINAL;
                    });
                self.emit('onBigStepEnd');
                cb(undefined, self.getConfiguration());
            }
        }

        doBigStep('onBigStepBegin');
    },

    /** @private */
    _performSmallStep : function(currentEvent, selectedTransitions) {

        this._log("selecting transitions with currentEvent", JSON.stringify(currentEvent));

        this._log("selected transitions", selectedTransitions);

        if (!selectedTransitions.isEmpty()) {

            this._log("sorted transitions", selectedTransitions);

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.Set(selectedTransitions.iter().filter(transitionWithTargets));

            var exitedTuple = this._getStatesExited(selectedTransitionsWithTargets), 
                basicStatesExited = exitedTuple[0], 
                statesExited = exitedTuple[1];

            var enteredTuple = this._getStatesEntered(selectedTransitionsWithTargets), 
                basicStatesEntered = enteredTuple[0], 
                statesEntered = enteredTuple[1];

            this._log("basicStatesExited ", basicStatesExited);
            this._log("basicStatesEntered ", basicStatesEntered);
            this._log("statesExited ", statesExited);
            this._log("statesEntered ", statesEntered);

            var eventsToAddToInnerQueue = new this.opts.Set();

            //update history states
            this._log("executing state exit actions");

            for (var j = 0, len = statesExited.length; j < len; j++) {
                var stateExited = statesExited[j];

                this._log("exiting ", stateExited.id);

                //invoke listeners
                this.emit('onExit',stateExited.id)

                if(stateExited.onExit !== undefined) {
                    for (var exitIdx = 0, exitLen = stateExited.onExit.length; exitIdx < exitLen; exitIdx++) {
                        this._evaluateAction(currentEvent, stateExited.onExit[exitIdx]);
                    }
                }

                var f;
                if (stateExited.historyRef) {
                    if (stateExited.historyRef.isDeep) {
                        f = function(s0) {
                            return s0.typeEnum === STATE_TYPES.BASIC && stateExited.descendants.indexOf(s0) > -1;
                        };
                    } else {
                        f = function(s0) {
                            return s0.parent === stateExited;
                        };
                    }
                    //update history
                    this._historyValue[stateExited.historyRef.id] = statesExited.filter(f);
                }
            }

            // -> Concurrency: Number of transitions: Multiple
            // -> Concurrency: Order of transitions: Explicitly defined
            var sortedTransitions = selectedTransitions.iter().sort(transitionComparator);

            this._log("executing transitition actions");


            for (var stxIdx = 0, len = sortedTransitions.length; stxIdx < len; stxIdx++) {
                var transition = sortedTransitions[stxIdx];

                var targetIds = transition.targets && transition.targets.map(function(target){return target.id;});

                this.emit('onTransition',transition.source.id,targetIds, stxIdx);

                if(transition.onTransition !== undefined) {
                    for (var txIdx = 0, txLen = transition.onTransition.length; txIdx < txLen; txIdx++) {
                        this._evaluateAction(currentEvent, transition.onTransition[txIdx]);
                    }
                }
            }
 
            this._log("executing state enter actions");

            for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
                var stateEntered = statesEntered[enterIdx];

                this._log("entering", stateEntered.id);

                this.emit('onEntry',stateEntered.id);

                if(stateEntered.onEntry !== undefined) {
                    for (var entryIdx = 0, entryLen = stateEntered.onEntry.length; entryIdx < entryLen; entryIdx++) {
                        this._evaluateAction(currentEvent, stateEntered.onEntry[entryIdx]);
                    }
                }
            }

            this._log("updating configuration ");
            this._log("old configuration ", this._configuration);

            //update configuration by removing basic states exited, and adding basic states entered
            this._configuration.difference(basicStatesExited);
            this._configuration.union(basicStatesEntered);


            this._log("new configuration ", this._configuration);
            
            //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
            if (!eventsToAddToInnerQueue.isEmpty()) {
                this._log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                this._internalEventQueue.push(eventsToAddToInnerQueue);
            }

        }

        //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
        return selectedTransitions;
    },

    /** @private */
    _evaluateAction : function(currentEvent, actionRef) {
        try {
          return actionRef.call(this._scriptingContext, currentEvent);     //SCXML system variables
        } catch (e){
          var err = {
            tagname: actionRef.tagname, 
            line: actionRef.line, 
            column: actionRef.column,
            reason: e.message
          }
          this._internalEventQueue.push({"name":"error.execution",data : err});
          this.emit('onError', err);
        }
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

    /** @private */
    _getStatesEntered : function(transitions) {

        var o = {
            statesToEnter : new this.opts.Set(),
            basicStatesToEnter : new this.opts.Set(),
            statesProcessed  : new this.opts.Set(),
            statesToProcess : []
        };

        //do the initial setup
        var transitionList = transitions.iter();
        for (var txIdx = 0, txLen = transitionList.length; txIdx < txLen; txIdx++) {
            var transition = transitionList[txIdx];
            for (var targetIdx = 0, targetLen = transition.targets.length; targetIdx < targetLen; targetIdx++) {
                this._addStateAndAncestors(transition.targets[targetIdx],transition.scope,o);
            }
        }

        //loop and add states until there are no more to add (we reach a stable state)
        var s;
        /*jsl:ignore*/
        while(s = o.statesToProcess.pop()){
            /*jsl:end*/
            this._addStateAndDescendants(s,o);
        }

        //sort based on depth
        var sortedStatesEntered = o.statesToEnter.iter().sort(
          function(s1, s2){
            return getStateWithHigherSourceChildPriority(s1, s2) * -1
          });

        return [o.basicStatesToEnter, sortedStatesEntered];
    },

    /** @private */
    _addStateAndAncestors : function(target,scope,o){

        //process each target
        this._addStateAndDescendants(target,o);

        //and process ancestors of targets up to the scope, but according to special rules
        var ancestors = query.getAncestors(target,scope);
        for (var ancIdx = 0, ancLen = ancestors.length; ancIdx < ancLen; ancIdx++) {
            var s = ancestors[ancIdx];
            if (s.typeEnum === STATE_TYPES.COMPOSITE) {
                //just add him to statesToEnter, and declare him processed
                //this is to prevent adding his initial state later on
                o.statesToEnter.add(s);

                o.statesProcessed.add(s);
            }else{
                //everything else can just be passed through as normal
                this._addStateAndDescendants(s,o);
            } 
        }
    },

    /** @private */
    _addStateAndDescendants : function(s,o){

        if(o.statesProcessed.contains(s)) return;

        if (s.typeEnum === STATE_TYPES.HISTORY) {
            if (s.id in this._historyValue) {
                this._historyValue[s.id].forEach(function(stateFromHistory){
                    this._addStateAndAncestors(stateFromHistory,s.parent,o);
                },this);
            } else {
                o.statesToEnter.add(s);
                o.basicStatesToEnter.add(s);
            }
        } else {
            o.statesToEnter.add(s);

            if (s.typeEnum === STATE_TYPES.PARALLEL) {
                o.statesToProcess.push.apply(o.statesToProcess,
                    s.states.filter(function(s){return s.typeEnum !== STATE_TYPES.HISTORY;}));
            } else if (s.typeEnum === STATE_TYPES.COMPOSITE) {
                o.statesToProcess.push(s.initialRef); 
            } else if (s.typeEnum === STATE_TYPES.INITIAL || s.typeEnum === STATE_TYPES.BASIC || s.typeEnum === STATE_TYPES.FINAL) {
                o.basicStatesToEnter.add(s);
            }
        }

        o.statesProcessed.add(s); 
    },

    /** @private */
    _selectTransitions : function(currentEvent, selectEventlessTransitions) {
        if (this.opts.onlySelectFromBasicStates) {
            var states = this._configuration.iter();
        } else {
            var statesAndParents = new this.opts.Set;

            //get full configuration, unordered
            //this means we may select transitions from parents before states
            var configList = this._configuration.iter();
            for (var idx = 0, len = configList.length; idx < len; idx++) {
                var basicState = configList[idx];
                statesAndParents.add(basicState);
                var ancestors = query.getAncestors(basicState);
                for (var ancIdx = 0, ancLen = ancestors.length; ancIdx < ancLen; ancIdx++) {
                    statesAndParents.add(ancestors[ancIdx]);
                }
            }

            states = statesAndParents.iter();
        }

        var transitionSelector = this.opts.transitionSelector;
        var enabledTransitions = new this.opts.Set();

        var e = this._evaluateAction.bind(this,currentEvent);

        for (var stateIdx = 0, stateLen = states.length; stateIdx < stateLen; stateIdx++) {
            var transitions = transitionSelector(states[stateIdx], currentEvent, e, selectEventlessTransitions);
            for (var txIdx = 0, len = transitions.length; txIdx < len; txIdx++) {
                enabledTransitions.add(transitions[txIdx]);
            }
        }

        var priorityEnabledTransitions = this._selectPriorityEnabledTransitions(enabledTransitions);

        this._log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        return priorityEnabledTransitions;
    },

    /** @private */
    _selectPriorityEnabledTransitions : function(enabledTransitions) {
        var priorityEnabledTransitions = new this.opts.Set();

        var tuple = this._getInconsistentTransitions(enabledTransitions), 
            consistentTransitions = tuple[0], 
            inconsistentTransitionsPairs = tuple[1];

        priorityEnabledTransitions.union(consistentTransitions);

        this._log("enabledTransitions", enabledTransitions);
        this._log("consistentTransitions", consistentTransitions);
        this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
        this._log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        while (!inconsistentTransitionsPairs.isEmpty()) {
            enabledTransitions = new this.opts.Set(
                    inconsistentTransitionsPairs.iter().map(function(t){return this.opts.priorityComparisonFn(t);},this));

            tuple = this._getInconsistentTransitions(enabledTransitions);
            consistentTransitions = tuple[0]; 
            inconsistentTransitionsPairs = tuple[1];

            priorityEnabledTransitions.union(consistentTransitions);

            this._log("enabledTransitions", enabledTransitions);
            this._log("consistentTransitions", consistentTransitions);
            this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
            this._log("priorityEnabledTransitions", priorityEnabledTransitions);
            
        }
        return priorityEnabledTransitions;
    },

    /** @private */
    _getInconsistentTransitions : function(transitions) {
        var allInconsistentTransitions = new this.opts.Set();
        var inconsistentTransitionsPairs = new this.opts.Set();
        var transitionList = transitions.iter();

        this._log("transitions", transitions);

        for(var i = 0; i < transitionList.length; i++){
            for(var j = i+1; j < transitionList.length; j++){
                var t1 = transitionList[i];
                var t2 = transitionList[j];
                if (this._conflicts(t1, t2)) {
                    allInconsistentTransitions.add(t1);
                    allInconsistentTransitions.add(t2);
                    inconsistentTransitionsPairs.add([t1, t2]);
                }
            }
        }

        var consistentTransitions = transitions.difference(allInconsistentTransitions);
        return [consistentTransitions, inconsistentTransitionsPairs];
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
                    ( arg.__proto__ === Object.prototype ? JSON.stringify(arg) : arg.toString())));

            }).join(', ')
          }\n`
        );
      }
    },

    /** @private */
    _conflicts : function(t1, t2) {
        return !this._isArenaOrthogonal(t1, t2);
    },

    /** @private */
    _isArenaOrthogonal : function(t1, t2) {

        this._log("transition scopes", t1.scope, t2.scope);

        var isOrthogonal = query.isOrthogonalTo(t1.scope, t2.scope);

        this._log("transition scopes are orthogonal?", isOrthogonal);

        return isOrthogonal;
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

    opts.ioprocessors = {};

    //Create all supported Event I/O processor nodes.
    //TODO fix location after implementing actual processors
    for (var processorType in ioProcessorTypes) {
        opts.ioprocessors[processorType] = ioProcessorTypes[processorType];
    }

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
    if (typeof currentEvent !== 'object' || !currentEvent || typeof currentEvent.name !== 'string') {
        throw new Error('expected currentEvent to be an Object with a name');
    }

    if(this._isStepping) {
        throw new Error('Cannot call gen during a big-step');
    }

    if (typeof cb !== 'function') {
        cb = nop;
    }

    this._isStepping = true;

    var self = this;
    this._performBigStepAsync(currentEvent, function(err, config) {
        self._isStepping = false;
        cb(err, config);
    });
};

function InterpreterScriptingContext(interpreter) {
    this._interpreter = interpreter;
    this._timeoutMap = {};
}

//Regex from:
//  http://daringfireball.net/2010/07/improved_regex_for_matching_urls
//  http://stackoverflow.com/a/6927878
var validateUriRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

//TODO: consider whether this is the API we would like to expose
InterpreterScriptingContext.prototype = {
    raise : function(event){
        this._interpreter._internalEventQueue.push(event); 
    },
    send : function(event, options){
        //TODO: move these out
        function validateSend(event, options, sendAction){
          if(event.target){
            var targetIsValidUri = validateUriRegex.test(event.target)
            if(!targetIsValidUri){
              return this.raise({ name : "error.execution", data: 'Target is not valid URI', sendid: options.sendid });
            }
          }

          var eventProcessorTypes = Object.keys(ioProcessorTypes).map(function(k){return ioProcessorTypes[k].location});
          if(eventProcessorTypes.indexOf(event.type) === -1) {
              return this.raise({ name : "error.execution", data: 'Unsupported event processor type', sendid: options.sendid });
          }

          sendAction.call(this, event, options);
        }

        function defaultSendAction (event, options) {

          if( typeof setTimeout === 'undefined' ) throw new Error('Default implementation of Statechart.prototype.send will not work unless setTimeout is defined globally.');

          var timeoutId = setTimeout(this._interpreter.gen.bind(this._interpreter, event), options.delay || 0);

          if (options.sendid) this._timeoutMap[options.sendid] = timeoutId;
        }

        function publish(){
          this._interpreter.emit(event.name,event.data);
        }

        event.type = event.type || ioProcessorTypes.scxml.location;

        //choose send function
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
    InterpreterScriptingContext : InterpreterScriptingContext,
    /** @expose */
    ioProcessorTypes  : ioProcessorTypes 
};
