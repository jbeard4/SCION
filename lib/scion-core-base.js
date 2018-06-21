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

/**
 * SCION-CORE global object
 * @namespace scion
 */

/**
 * An Array of strings representing the ids all of the basic states the
 * interpreter is in after a big-step completes.
 * @typedef {Array<string>} Configuration
 */

/**
 * A set of basic and composite state ids.
 * @typedef {Array<string>} FullConfiguration
 */

/**
 * A set of basic and composite state ids.
 * @typedef {Array<string>} FullConfiguration
 */

"use strict";

const EventEmitter = require('tiny-events').EventEmitter,
  util = require('util'),
  ArraySet = require('./ArraySet'),
  constants = require('./constants'),
  helpers = require('./helpers'),
  query = require('./query'),
  extend = helpers.extend,
  transitionWithTargets = helpers.transitionWithTargets,
  transitionComparator = helpers.transitionComparator,
  initializeModel = helpers.initializeModel,
  isEventPrefixMatch = helpers.isEventPrefixMatch,
  isTransitionMatch = helpers.isTransitionMatch,
  scxmlPrefixTransitionSelector = helpers.scxmlPrefixTransitionSelector,
  eventlessTransitionSelector = helpers.eventlessTransitionSelector,
  getTransitionWithHigherSourceChildPriority = helpers.getTransitionWithHigherSourceChildPriority,
  sortInEntryOrder = helpers.sortInEntryOrder,
  getStateWithHigherSourceChildPriority = helpers.getStateWithHigherSourceChildPriority,
  initializeModelGeneratorFn = helpers.initializeModelGeneratorFn,
  deserializeSerializedConfiguration = helpers.deserializeSerializedConfiguration,
  deserializeHistory = helpers.deserializeHistory,
  BASIC = constants.STATE_TYPES.BASIC,
  COMPOSITE = constants.STATE_TYPES.COMPOSITE,
  PARALLEL = constants.STATE_TYPES.PARALLEL,
  HISTORY = constants.STATE_TYPES.HISTORY,
  INITIAL = constants.STATE_TYPES.INITIAL,
  FINAL = constants.STATE_TYPES.FINAL,
  SCXML_IOPROCESSOR_TYPE  = constants.SCXML_IOPROCESSOR_TYPE;

const printTrace = typeof process !== 'undefined' && !!process.env.DEBUG;


/**
 * @interface EventEmitter
 */

/**
* @event scion.BaseInterpreter#onError
* @property {string} tagname The name of the element that produced the error. 
* @property {number} line The line in the source file in which the error occurred.
* @property {number} column The column in the source file in which the error occurred.
* @property {string} reason An informative error message. The text is platform-specific and subject to change.
*/


/**
 * @function
 * @name EventEmitter.prototype#on
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#once
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#off
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#emit
 * @param {string} type
 * @param {any} args
 */
/** 
 * @description The SCXML constructor creates an interpreter instance from a model object.
 * @abstract
 * @class BaseInterpreter
 * @memberof scion
 * @extends EventEmitter
 * @param {SCJSON | scxml.ModelFactory} modelOrModelFactory Either an SCJSON root state; or an scxml.ModelFactory, which is a function which returns an SCJSON object. 
 * @param opts
 * @param {string} [opts.sessionid] Used to populate SCXML _sessionid.
 * @param {function} [opts.generateSessionid] Factory used to generate sessionid if sessionid keyword is not specified
 * @param {Map<string, BaseInterpreter>} [opts.sessionRegistry] Map used to map sessionid strings to Statechart instances.
 * @param [opts.Set] Class to use as an ArraySet. Defaults to ES6 Set.
 * @param {object} [opts.params]  Used to pass params from invoke. Sets the datamodel when interpreter is instantiated.
 * @param {Snapshot} [opts.snapshot] State machine snapshot. Used to restore a serialized state machine.
 * @param {Statechart} [opts.parentSession]  Used to pass parent session during invoke.
 * @param {string }[opts.invokeid]  Support for id of invoke element at runtime.
 * @param {boolean} [opts.legacySemantics]
 * @param [opts.console]
 * @param [opts.transitionSelector]
 * @param [opts.customCancel]
 * @param [opts.customSend]
 * @param [opts.sendAsync]
 * @param [opts.doSend]
 * @param [opts.invokers]
 * @param [opts.xmlParser]
 * @param [opts.interpreterScriptingContext]
 */
class BaseInterpreter extends EventEmitter {

  constructor(modelOrModelFactory, opts){

    super();

    this.opts = opts;

    this.opts.InterpreterScriptingContext = this.opts.InterpreterScriptingContext || InterpreterScriptingContext;

    this._isStepping = false;

    this._scriptingContext = this.opts.interpreterScriptingContext || (this.opts.InterpreterScriptingContext ? new this.opts.InterpreterScriptingContext(this) : {}); 

    this.opts.generateSessionid = this.opts.generateSessionid || BaseInterpreter.generateSessionid;
    this.opts.sessionid = this.opts.sessionid || this.opts.generateSessionid();
    this.opts.sessionRegistry = this.opts.sessionRegistry || BaseInterpreter.sessionRegistry;  //TODO: define a better interface. For now, assume a Map<sessionid, session>


    let _ioprocessors = {};
    _ioprocessors[SCXML_IOPROCESSOR_TYPE] = {
      location : `#_scxml_${this.opts.sessionid}`
    }
    _ioprocessors.scxml = _ioprocessors[SCXML_IOPROCESSOR_TYPE];    //alias

    //SCXML system variables:
    this.opts._x = {
        _sessionid : this.opts.sessionid,
        _ioprocessors : _ioprocessors
    };


    var model;
    if(typeof modelOrModelFactory === 'function'){
        model = initializeModelGeneratorFn(modelOrModelFactory, this.opts, this);
    }else if(typeof modelOrModelFactory === 'object'){
        model = JSON.parse(JSON.stringify(modelOrModelFactory)); //assume object
    }else{
        throw new Error('Unexpected model type. Expected model factory function, or scjson object.');
    }

    this._model = initializeModel(model, this.opts);

    this.opts.console = this.opts.console || (typeof console === 'undefined' ? {log : function(){}} : console);   //rely on global console if this console is undefined
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

    if(this.opts.params){
      this._model.$deserializeDatamodel(this.opts.params);   //load up the datamodel
    }

    //check if we're loading from a previous snapshot
    if(this.opts.snapshot){
      this._configuration = new this.opts.Set(deserializeSerializedConfiguration(this.opts.snapshot[0], this._model.$idToStateMap));
      this._historyValue = deserializeHistory(this.opts.snapshot[1], this._model.$idToStateMap); 
      this._isInFinalState = this.opts.snapshot[2];
      this._model.$deserializeDatamodel(this.opts.snapshot[3]);   //load up the datamodel
      this._internalEventQueue = this.opts.snapshot[4];
    }else{
      this._configuration = new this.opts.Set();
      this._historyValue = {};
      this._isInFinalState = false;
    }

    //add debug logging
    BaseInterpreter.EVENTS.forEach(function(event){
      this.on(event, this._log.bind(this,event));
    }, this);

    module.exports.emit('new',this);
  }

  /** 
  * Cancels the session. This clears all timers; puts the interpreter in a
  * final state; and runs all exit actions on current states.
  * @memberof BaseInterpreter.prototype
  */
  cancel(){
    delete this.opts.parentSession;
    if(this._isInFinalState) return;
    this._isInFinalState = true;
    this._log(`session cancelled ${this.opts.invokeid}`);
    this._exitInterpreter(null);
  }

  _exitInterpreter(event){
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
        if( stateExited.$type === 'final' &&
            stateExited.parent.$type === 'scxml'){

          if(this.opts.parentSession){
            this._scriptingContext.send({
              target: '#_parent', 
              name: 'done.invoke.' + this.opts.invokeid,
              data : stateExited.donedata && stateExited.donedata.call(this._scriptingContext, event)
            });
          }

          this.opts.sessionRegistry.delete(this.opts.sessionid);
          this.emit('onExitInterpreter', event);
        }
    }

  }

  /** 
   * Starts the interpreter. Should only be called once, and should be called
   * before BaseInterpreter.prototype#gen is called for the first time.  Returns a
   * Configuration.
   * @return {Configuration}
   * @memberof BaseInterpreter.prototype
   * @emits scion.BaseInterpreter#onEntry
   * @emits scion.BaseInterpreter#onExit
   * @emits scion.BaseInterpreter#onTransition
   * @emits scion.BaseInterpreter#onDefaultEntry
   * @emits scion.BaseInterpreter#onError
   * @emits scion.BaseInterpreter#onBigStepBegin
   * @emits scion.BaseInterpreter#onBigStepEnd
   * @emits scion.BaseInterpreter#onBigStepSuspend
   * @emits scion.BaseInterpreter#onBigStepResume
   * @emits scion.BaseInterpreter#onSmallStepBegin
   * @emits scion.BaseInterpreter#onSmallStepEnd
   * @emits scion.BaseInterpreter#onBigStepEnd
   * @emits scion.BaseInterpreter#onExitInterpreter
   */
  start() {
      this._initStart();
      this._performBigStep();
      return this.getConfiguration();
  }


  /**
   * This callback is displayed as a global member.
   * @callback genCallback
   * @param {Error} err
   * @param {Configuration} configuration
   */

  /**
   * Starts the interpreter asynchronously
   * @param  {genCallback} cb Callback invoked with an error or the interpreter's stable configuration
   * @memberof BaseInterpreter.prototype 
   * @emits scion.BaseInterpreter#onEntry
   * @emits scion.BaseInterpreter#onExit
   * @emits scion.BaseInterpreter#onTransition
   * @emits scion.BaseInterpreter#onDefaultEntry
   * @emits scion.BaseInterpreter#onError
   * @emits scion.BaseInterpreter#onBigStepBegin
   * @emits scion.BaseInterpreter#onBigStepEnd
   * @emits scion.BaseInterpreter#onBigStepSuspend
   * @emits scion.BaseInterpreter#onBigStepResume
   * @emits scion.BaseInterpreter#onSmallStepBegin
   * @emits scion.BaseInterpreter#onSmallStepEnd
   * @emits scion.BaseInterpreter#onBigStepEnd
   * @emits scion.BaseInterpreter#onExitInterpreter
   */
  startAsync(cb) {
      cb = this._initStart(cb);
      this.genAsync(null, cb);
  }

  _initStart(cb){
      if (typeof cb !== 'function') {
          cb = nop;
      }

      this._log("performing initial big step");

      //We effectively need to figure out states to enter here to populate initial config. assuming root is compound state makes this simple.
      //but if we want it to be parallel, then this becomes more complex. so when initializing the model, we add a 'fake' root state, which
      //makes the following operation safe.
      this._model.initialRef.forEach( s => this._configuration.add(s) );

      return cb;
  }

  /** 
  * Returns state machine {@link Configuration}.
  * @return {Configuration}
  * @memberof BaseInterpreter.prototype 
  */
  getConfiguration() {
      return this._configuration.iter().map(function(s){return s.id;});
  }

  _getFullConfiguration(){
      return this._configuration.iter().
              map(function(s){ return [s].concat(query.getAncestors(s));},this).
              reduce(function(a,b){return a.concat(b);},[]).    //flatten
              reduce(function(a,b){return a.indexOf(b) > -1 ? a : a.concat(b);},[]); //uniq
  }


  /** 
  * @return {FullConfiguration}
  * @memberof BaseInterpreter.prototype 
  */
  getFullConfiguration() {
      return this._getFullConfiguration().map(function(s){return s.id;});
  }


  /** 
  * @return {boolean}
  * @memberof BaseInterpreter.prototype 
  * @param {string} stateName
  */
  isIn(stateName) {
      return this.getFullConfiguration().indexOf(stateName) > -1;
  }

  /** 
  * Is the state machine in a final state?
  * @return {boolean}
  * @memberof BaseInterpreter.prototype 
  */
  isFinal() {
      return this._isInFinalState;
  }

  /** @private */
  _performBigStep(e) {
      let currentEvent, keepGoing, allStatesExited, allStatesEntered;
      [allStatesExited, allStatesEntered, keepGoing, currentEvent] = this._startBigStep(e);

      while (keepGoing) {
        [currentEvent, keepGoing] = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);
      }

      this._finishBigStep(currentEvent, allStatesEntered, allStatesExited);
  }

  _selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited){
      //first select with null event
      var selectedTransitions  = this._selectTransitions(currentEvent, true);
      if(selectedTransitions.isEmpty()){
        let ev = this._internalEventQueue.shift();
        if(ev){ 
          currentEvent = ev;
          selectedTransitions = this._selectTransitions(currentEvent, false);
        }
      }

      if(!selectedTransitions.isEmpty()){
        this.emit('onSmallStepBegin', currentEvent);
        let statesExited, statesEntered;
        [statesExited, statesEntered] = this._performSmallStep(currentEvent, selectedTransitions);
        if(statesExited) statesExited.forEach( s => allStatesExited.add(s) );
        if(statesEntered) statesEntered.forEach( s => allStatesEntered.add(s) );
        this.emit('onSmallStepEnd', currentEvent);
      }
      let keepGoing = !selectedTransitions.isEmpty() || this._internalEventQueue.length;
      return [currentEvent, keepGoing];
  }

  _startBigStep(e){
      this.emit('onBigStepBegin', e);

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
      let currentEvent = e;
      return [allStatesEntered, allStatesExited, keepGoing, currentEvent];
  }

  _finishBigStep(e, allStatesEntered, allStatesExited, cb){
      let statesToInvoke = Array.from(new Set([...allStatesEntered].filter(s => s.invokes && !allStatesExited.has(s)))).sort(sortInEntryOrder);

      // Here we invoke whatever needs to be invoked. The implementation of 'invoke' is platform-specific
      statesToInvoke.forEach( s => {
          s.invokes.forEach( f =>  this._evaluateAction(e,f) )
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

      this._isInFinalState = this._configuration.iter().every(function(s){ return s.typeEnum === FINAL; });
      if(this._isInFinalState){
        this._exitInterpreter(e);
      }
      this.emit('onBigStepEnd', e);
      if(cb) cb(undefined, this.getConfiguration());
  }

  _cancelAllDelayedSends(){
    for( let timeoutOptions of this._scriptingContext._timeouts){
      if(!timeoutOptions.sendOptions.delay) continue;
      this._log('cancelling delayed send', timeoutOptions);
      clearTimeout(timeoutOptions.timeoutHandle);
      this._scriptingContext._timeouts.delete(timeoutOptions);
    }
    Object.keys(this._scriptingContext._timeoutMap).forEach(function(key){
      delete this._scriptingContext._timeoutMap[key];
    }, this);
  }

  _performBigStepAsync(e, cb) {
      let currentEvent, keepGoing, allStatesExited, allStatesEntered;
      [allStatesExited, allStatesEntered, keepGoing, currentEvent] = this._startBigStep(e);

      function nextStep(emit){
        this.emit(emit);
        [currentEvent, keepGoing] = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);

        if(keepGoing){
          this.emit('onBigStepSuspend');
          setImmediate(nextStep.bind(this,'onBigStepResume'));
        }else{
          this._finishBigStep(currentEvent, allStatesEntered, allStatesExited, cb);
        }
      }
      nextStep.call(this,'onBigStepBegin');
  }

  /** @private */
  _performSmallStep(currentEvent, selectedTransitions) {

      this._log("selecting transitions with currentEvent", currentEvent);

      this._log("selected transitions", selectedTransitions);

      let statesExited,
          statesEntered;

      if (!selectedTransitions.isEmpty()) {

          //we only want to enter and exit states from transitions with targets
          //filter out targetless transitions here - we will only use these to execute transition actions
          var selectedTransitionsWithTargets = new this.opts.Set(selectedTransitions.iter().filter(transitionWithTargets));

          statesExited = this._exitStates(currentEvent, selectedTransitionsWithTargets)
          this._executeTransitions(currentEvent, selectedTransitions);
          statesEntered = this._enterStates(currentEvent, selectedTransitionsWithTargets)

          this._log("new configuration ", this._configuration);
      }

      return [statesExited, statesEntered];
  }

  _exitStates(currentEvent, selectedTransitionsWithTargets){
      let basicStatesExited, statesExited;
      [basicStatesExited, statesExited] = this._getStatesExited(selectedTransitionsWithTargets); 

      this._log('exiting states')
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
                          return s0.typeEnum === BASIC && stateExited.descendants.indexOf(s0) > -1;
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

      return statesExited;
  }

  /** @private */
  _getStatesExited(transitions) {
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
  }

  _executeTransitions(currentEvent, selectedTransitions){
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
  }

  _enterStates(currentEvent, selectedTransitionsWithTargets){
      this._log("entering states");

      let statesEntered = new Set();
      let statesForDefaultEntry = new Set();
      // initialize the temporary table for default content in history states
      let defaultHistoryContent = {};
      this._computeEntrySet(selectedTransitionsWithTargets, statesEntered, statesForDefaultEntry, defaultHistoryContent); 
      statesEntered = [...statesEntered].sort(sortInEntryOrder); 

      this._log("statesEntered ", statesEntered);

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

          if(statesForDefaultEntry.has(stateEntered)){
              for(let initialState of stateEntered.initialRef){
                  this.emit('onDefaultEntry', initialState.id);
                  if(initialState.typeEnum === INITIAL){
                      let transition = initialState.transitions[0]
                      if(transition.onTransition !== undefined) {
                          this._log('executing initial transition content for initial state of parent state',stateEntered.id);
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
          }


          if(defaultHistoryContent[stateEntered.id]){
              let transition = defaultHistoryContent[stateEntered.id]
              if(transition.onTransition !== undefined) {
                  this._log('executing history transition content for history state of parent state',stateEntered.id);
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
          if(stateEntered.typeEnum === FINAL){
            let parent = stateEntered.parent;
            let grandparent = parent.parent;
            this._internalEventQueue.push({name : "done.state." + parent.id, data : stateEntered.donedata && stateEntered.donedata.call(this._scriptingContext, currentEvent)});
            if(grandparent && grandparent.typeEnum === PARALLEL){
                if(grandparent.states.every(s => this.isInFinalState(s) )){
                    this._internalEventQueue.push({name : "done.state." + grandparent.id});
                }
            }
          }
      }

      return statesEntered;
  }

  _getEffectiveTargetStates(transition){
    let targets = new Set();
    for(let s of transition.targets){
      if(s.typeEnum === HISTORY){
        if(s.id in this._historyValue)
          this._historyValue[s.id].forEach( state => targets.add(state))
        else
          [...this._getEffectiveTargetStates(s.transitions[0])].forEach( state => targets.add(state))
      } else {
        targets.add(s)
      }
    }
    return targets
  }

  _computeEntrySet(transitions, statesToEnter, statesForDefaultEntry, defaultHistoryContent){
    for(let t of transitions.iter()){
      for(let s of t.targets){
        this._addDescendantStatesToEnter(s,statesToEnter, statesForDefaultEntry, defaultHistoryContent) 
      }
      let ancestor = t.scope;
      for(let s of this._getEffectiveTargetStates(t)){
        this._addAncestorStatesToEnter(s, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent)
      }
    }
  }

  _computeExitSet(transitions) {
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
  }

  _addAncestorStatesToEnter(state, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent){
    let traverse = (anc) => {
      if(anc.typeEnum === PARALLEL){
        for(let child of anc.states){
          if(child.typeEnum !== HISTORY && ![...statesToEnter].some(s => query.isDescendant(s, child))){
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
  }


  _addDescendantStatesToEnter(state,statesToEnter, statesForDefaultEntry, defaultHistoryContent){
    if(state.typeEnum === HISTORY){
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
        if(state.typeEnum === COMPOSITE){
          statesForDefaultEntry.add(state)
          //for each state in initialRef, if it is an initial state, then add ancestors and descendants.
          for(let s of state.initialRef){
            let targets = s.typeEnum === INITIAL ? s.transitions[0].targets : [s]; 
            for(let targetState of targets){
              this._addDescendantStatesToEnter(targetState,statesToEnter, statesForDefaultEntry, defaultHistoryContent)
            }
          }
          for(let s of state.initialRef){
            let targets = s.typeEnum === INITIAL ? s.transitions[0].targets : [s]; 
            for(let targetState of targets){
              this._addAncestorStatesToEnter(targetState, state, statesToEnter, statesForDefaultEntry, defaultHistoryContent)
            }
          }
        }else{
          if(state.typeEnum === PARALLEL){
            for(let child of state.states){
              if(child.typeEnum !== HISTORY && ![...statesToEnter].some(s => query.isDescendant(s, child))){
                this._addDescendantStatesToEnter(child,statesToEnter, statesForDefaultEntry, defaultHistoryContent) 
              }
            }
          }
        }
    }
  }

  isInFinalState(s){
      if(s.typeEnum === COMPOSITE){
          return s.states.some(s => s.typeEnum === FINAL && this._configuration.contains(s));
      }else if(s.typeEnum === PARALLEL){
          return s.states.every(this.isInFinalState.bind(this))
      }else{
          return false
      }
  }

  /** @private */
  _evaluateAction(currentEvent, actionRef) {
      try {
        return actionRef.call(this._scriptingContext, currentEvent);     //SCXML system variables
      } catch (e){
        this._handleError(e, actionRef);
      }
  }

  _handleError(e, actionRef){
    let event = 
      e instanceof Error || (typeof e.__proto__.name === 'string' && e.__proto__.name.match(/^.*Error$/)) ?  //we can't just do 'e instanceof Error', because the Error object in the sandbox is from a different context, and instanceof will return false
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
  }

  _log(){
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
  }

  /**
  * @interface Listener
  */

  /**
  * @function
  * @name Listener#onEntry 
  * @param {string} stateId
  */

  /**
  * @function
  * @name Listener#onExit 
  * @param {string} stateId
  */

  /**
  * @function
  * @name Listener#onTransition 
  * @param {string} sourceStateId Id of the source state
  * @param {Array<string>} targetStatesIds Ids of the target states
  * @param {number} transitionIndex Index of the transition relative to other transitions originating from source state.
  */

  /**
  * @function
  * @name Listener#onError
  * @param {Error} errorInfo
  */

  /**
  * @function
  * @name Listener#onBigStepBegin
  */

  /**
  * @function
  * @name Listener#onBigStepResume
  */

  /**
  * @function
  * @name Listener#onBigStepSuspend
  */

  /**
  * @function
  * @name Listener#onBigStepEnd
  */

  /**
  * @function
  * @name Listener#onSmallStepBegin
  * @param {string} event
  */

  /**
  * @function
  * @name Listener#onSmallStepEnd
  */


  /** 
  * Provides a generic mechanism to subscribe to state change and runtime
  * error notifications.  Can be used for logging and debugging. For example,
  * can attach a logger that simply logs the state changes.  Or can attach a
  * network debugging client that sends state change notifications to a
  * debugging server.
  * This is an alternative interface to {@link EventEmitter.prototype#on}.
  * @memberof BaseInterpreter.prototype 
  * @param {Listener} listener
  */
  registerListener(listener){
      BaseInterpreter.EVENTS.forEach(function(event){
        if(listener[event]) this.on(event,listener[event]);
      }, this);
  }

  /** 
  * Unregister a Listener
  * @memberof BaseInterpreter.prototype 
  * @param {Listener} listener
  */
  unregisterListener(listener){
      BaseInterpreter.EVENTS.forEach(function(event){
        if(listener[event]) this.off(event,listener[event]);
      }, this);
  }

  /** 
  * Query the model to get all transition events.
  * @return {Array<string>} Transition events.
  * @memberof BaseInterpreter.prototype 
  */
  getAllTransitionEvents(){
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
  }

  /**
  * Three things capture the current snapshot of a running SCION interpreter:
  *
  *      <ul>
  *      <li> basic configuration (the set of basic states the state machine is in)</li>
  *      <li> history state values (the states the state machine was in last time it was in the parent of a history state)</li>
  *      <li> the datamodel</li>
  *      </ul>
  *      
  * The snapshot object can be serialized as JSON and saved to a database. It can
  * later be passed to the SCXML constructor to restore the state machine
  * using the snapshot argument.
  *
  * @return {Snapshot} 
  * @memberof BaseInterpreter.prototype 
  */
  getSnapshot(){
    return [
      this.getConfiguration(),
      this._serializeHistory(),
      this._isInFinalState,
      this._model.$serializeDatamodel(),
      this._internalEventQueue.slice()
    ];
  }

  _serializeHistory(){
    var o = {};
    Object.keys(this._historyValue).forEach(function(sid){
      o[sid] = this._historyValue[sid].map(function(state){return state.id});
    },this);
    return o;
  }


  /**
   * @interface Event
   */

  /** 
  * @member name
  * @memberof Event.prototype 
  * @type string
  * @description The name of the event
  */

  /** 
  * @member data
  * @memberof Event.prototype 
  * @type any
  * @description The event data
  */

  /** 
  * An SCXML interpreter takes SCXML events as input, where an SCXML event is an
  * object with "name" and "data" properties. These can be passed to method `gen`
  * as two positional arguments, or as a single object.
  * @param {string|Event} evtObjOrName
  * @param {any=} optionalData
  * @emits scion.BaseInterpreter#onEntry
  * @emits scion.BaseInterpreter#onExit
  * @emits scion.BaseInterpreter#onTransition
  * @emits scion.BaseInterpreter#onDefaultEntry
  * @emits scion.BaseInterpreter#onError
  * @emits scion.BaseInterpreter#onBigStepBegin
  * @emits scion.BaseInterpreter#onBigStepEnd
  * @emits scion.BaseInterpreter#onBigStepSuspend
  * @emits scion.BaseInterpreter#onBigStepResume
  * @emits scion.BaseInterpreter#onSmallStepBegin
  * @emits scion.BaseInterpreter#onSmallStepEnd
  * @emits scion.BaseInterpreter#onBigStepEnd
  * @emits scion.BaseInterpreter#onExitInterpreter
  */
  gen(evtObjOrName,optionalData) {
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
  }

  /**
  * Injects an external event into the interpreter asynchronously
  * @param {Event}  currentEvent The event to inject
  * @param {genCallback} cb Callback invoked with an error or the interpreter's stable configuration
  * @emits scion.BaseInterpreter#onEntry
  * @emits scion.BaseInterpreter#onExit
  * @emits scion.BaseInterpreter#onTransition
  * @emits scion.BaseInterpreter#onDefaultEntry
  * @emits scion.BaseInterpreter#onError
  * @emits scion.BaseInterpreter#onBigStepBegin
  * @emits scion.BaseInterpreter#onBigStepEnd
  * @emits scion.BaseInterpreter#onBigStepSuspend
  * @emits scion.BaseInterpreter#onBigStepResume
  * @emits scion.BaseInterpreter#onSmallStepBegin
  * @emits scion.BaseInterpreter#onSmallStepEnd
  * @emits scion.BaseInterpreter#onBigStepEnd
  * @emits scion.BaseInterpreter#onExitInterpreter
  */
  genAsync(currentEvent, cb) {
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
  }
}

BaseInterpreter.EVENTS = [
  'onEntry',
  'onExit',
  'onTransition',
  'onDefaultEntry',
  'onError',
  'onBigStepBegin',
  'onBigStepSuspend',
  'onBigStepResume',
  'onSmallStepBegin',
  'onSmallStepEnd',
  'onBigStepEnd',
  'onExitInterpreter'
];

//some global singletons to use to generate in-memory session ids, in case the user does not specify these data structures
BaseInterpreter.sessionIdCounter = 1;
BaseInterpreter.generateSessionid = function(){
  return BaseInterpreter.sessionIdCounter++;
}
BaseInterpreter.sessionRegistry = new Map();

// Do nothing

function nop() {}


class InterpreterScriptingContext{
  constructor(interpreter){ 
    this._interpreter = interpreter;
    this._timeoutMap = {};
    this._invokeMap = {};
    this._timeouts = new Set()

    //Regex from:
    //  http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    //  http://stackoverflow.com/a/6927878
    this.validateUriRegex = /(#_.*)|\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

    this.invokeSendTargetRegex = /^#_(.*)$/;
    this.scxmlSendTargetRegex = /^#_scxml_(.*)$/;
  }


  raise(event){
    this._installDefaultPropsOnEvent(event, true);
    this._interpreter._internalEventQueue.push(event); 
  }

  parseXmlStringAsDOM(xmlString){
    return (this._interpreter.opts.xmlParser || InterpreterScriptingContext.xmlParser).parse(xmlString);
  }

  invoke(invokeObj){
    //look up invoker by type. assume invokers are passed in as an option to constructor
    this._invokeMap[invokeObj.id] = new Promise((resolve, reject) => {
      (this._interpreter.opts.invokers || InterpreterScriptingContext.invokers)[invokeObj.type](this._interpreter, invokeObj, (err, session) => {
        if(err) return reject(err);

        this._interpreter.emit('onInvokedSessionInitialized', session);
        resolve(session);
      });
    });
  }

  cancelInvoke(invokeid){
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
  }

  _installDefaultPropsOnEvent(event,isInternal){
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
      if(typeof event[prop] === 'undefined'){
        event[prop] = undefined;
      }
    });
  }

  send(event, options){
    this._interpreter._log('send event', event, options);
    options = options || {};
    var sendType = options.type || SCXML_IOPROCESSOR_TYPE;
    //TODO: move these out
    function validateSend(event, options, sendAction){
      if(event.target){
        var targetIsValidUri = this.validateUriRegex.test(event.target)
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

      if( typeof setTimeout === 'undefined' ) throw new Error('Default implementation of BaseInterpreter.prototype.send will not work unless setTimeout is defined globally.');

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
          if(this._interpreter.opts.doSend){
            this._interpreter.opts.doSend(session, event);
          }else{
            session[this._interpreter.opts.sendAsync ? 'genAsync' : 'gen'](event);
          }
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
  }

  cancel(sendid){
    if(this._interpreter.opts.customCancel) {
      return this._interpreter.opts.customCancel.apply(this, [sendid]);
    }

    if( typeof clearTimeout === 'undefined' ) throw new Error('Default implementation of BaseInterpreter.prototype.cancel will not work unless setTimeout is defined globally.');

    if (sendid in this._timeoutMap) {
      this._interpreter._log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
      clearTimeout(this._timeoutMap[sendid]);
    }
  }
}

module.exports = extend(new EventEmitter, {
    BaseInterpreter: BaseInterpreter,
    ArraySet : ArraySet,
    STATE_TYPES : constants.STATE_TYPES,
    initializeModel : initializeModel,
    InterpreterScriptingContext : InterpreterScriptingContext,
    helpers: helpers,
    query: query
});
