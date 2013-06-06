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

var ArraySet = require('./set/ArraySet'),
    stateKinds = require('./state-kinds-enum'),
    setupDefaultOpts = require('./setup-default-opts'),
    scxmlPrefixTransitionSelector = require('./scxml-dynamic-name-match-transition-selector'),
    pm = require('../../platform');

function getTransitionWithHigherSourceChildPriority(model) {
    return function(_arg) {
        var t1 = _arg[0], t2 = _arg[1];
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
    };
}

/** @const */
var printTrace = false;

/** @constructor */
function SCXMLInterpreter(model, opts){
    this.model = model;
    this.opts = opts;

    this.opts.log = this.opts.log || pm.platform.log;   //rely on global console if this console is undefined
    this.opts.StateIdSet = this.opts.StateIdSet || ArraySet;
    this.opts.EventSet = this.opts.EventSet || ArraySet;
    this.opts.TransitionPairSet = this.opts.TransitionPairSet || ArraySet;
    this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority(this.opts.model);

    this._sessionid = this.opts.sessionid || "";

    this._configuration = new this.opts.BasicStateSet();
    this._historyValue = {};
    this._innerEventQueue = [];
    this._isInFinalState = false;
    this._timeoutMap = {};

    this._listeners = [];
}

SCXMLInterpreter.prototype = {

    /** @expose */
    start : function() {
        //perform big step without events to take all default transitions and reach stable initial state
        if (printTrace) pm.platform.log("performing initial big step");
        this._configuration.add(this.model.root.initial);

        //figure out which require to use when evaluating action code, in the following order:
            //the one specified when instantiating the interpreter
            //the require of the module importing SCION
            //the require of the main module
            //this module's require
        var actionCodeRequire = 
            this.opts.require || 
                (module.parent && 
                    module.parent.parent && 
                    module.parent.parent.require &&
                    module.parent.parent.require.bind(module.parent.parent)) || 
                (require.main && 
                    require.main.require &&
                    require.main.require.bind(require.main)) ||
                require;

        //set up scope for action code embedded in the document
        var tmp = this.model.actionFactory(
            this.opts.log,
            this._cancel.bind(this),
            this._send.bind(this),
            this.opts.origin,
            this.isIn.bind(this),
            actionCodeRequire,
            pm.platform.parseDocumentFromString,
            this._sessionid);
        this._actions = tmp.actions;
        this._datamodel = tmp.datamodel;

        this._performBigStep();
        return this.getConfiguration();
    },

    _getOrSetData : function(fnName,name,value){
        var data = this._datamodel[name];
        if(!data) throw new Error("Variable " + name + " not declared in datamodel.");
        return data[fnName](value);
    },

    _getData : function(name){
        return this._getOrSetData("get",name);
    },

    _setData : function(name,value){
        return this._getOrSetData("set",name,value);
    },

    /** @expose */
    getConfiguration : function() {
        return this._configuration.iter().map(function(s){return s.id;});
    },

    /** @expose */
    getFullConfiguration : function() {
        return this._configuration.iter().
                map(function(s){ return [s].concat(this.opts.model.getAncestors(s));},this).
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
        if (e) this._innerEventQueue.push(new this.opts.EventSet([e]));
        var keepGoing = true;
        while (keepGoing) {
            var eventSet = this._innerEventQueue.length ? this._innerEventQueue.shift() : new this.opts.EventSet();

            //create new datamodel cache for the next small step
            var datamodelForNextStep = {};
            var selectedTransitions = this._performSmallStep(eventSet, datamodelForNextStep);
            keepGoing = !selectedTransitions.isEmpty();
        }
        this._isInFinalState = this._configuration.iter().every(function(s){ return s.kind === stateKinds.FINAL; });
    },

    /** @private */
    _performSmallStep : function(eventSet, datamodelForNextStep) {

        if (printTrace) pm.platform.log("selecting transitions with eventSet: ", eventSet);

        var selectedTransitions = this._selectTransitions(eventSet, datamodelForNextStep);

        if (printTrace) pm.platform.log("selected transitions: ", selectedTransitions);

        if (!selectedTransitions.isEmpty()) {

            if (printTrace) pm.platform.log("sorted transitions: ", console.log(selectedTransitions));

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.TransitionSet(selectedTransitions.iter().filter(function(t){return t.targets;}));

            var exitedTuple = this._getStatesExited(selectedTransitionsWithTargets), 
                basicStatesExited = exitedTuple[0], 
                statesExited = exitedTuple[1];

            var enteredTuple = this._getStatesEntered(selectedTransitionsWithTargets), 
                basicStatesEntered = enteredTuple[0], 
                statesEntered = enteredTuple[1];

            if (printTrace) pm.platform.log("basicStatesExited ", basicStatesExited);
            if (printTrace) pm.platform.log("basicStatesEntered ", basicStatesEntered);
            if (printTrace) pm.platform.log("statesExited ", statesExited);
            if (printTrace) pm.platform.log("statesEntered ", statesEntered);

            var eventsToAddToInnerQueue = new this.opts.EventSet();

            //update history states
            if (printTrace) pm.platform.log("executing state exit actions");

            statesExited.forEach(function(state){

                if (printTrace || this.opts.logStatesEnteredAndExited) pm.platform.log("exiting ", state.id);

                //invoke listeners
                this._listeners.forEach(function(l){
                   if(l.onExit) l.onExit(state.id); 
                });

                if(state.onexit !== undefined) this._evaluateAction(state.onexit,eventSet, datamodelForNextStep, eventsToAddToInnerQueue);

                var f;
                if (state.history) {
                    if (state.history.isDeep) {
                        f = function(s0) {
                            return s0.kind === stateKinds.BASIC && state.descendants.indexOf(s0) > -1;
                        };
                    } else {
                        f = function(s0) {
                            return s0.parent === state;
                        };
                    }
                    //update history
                    this._historyValue[state.history.id] = statesExited.filter(f);
                }
            },this);


            // -> Concurrency: Number of transitions: Multiple
            // -> Concurrency: Order of transitions: Explicitly defined
            var sortedTransitions = selectedTransitions.iter().sort(function(t1, t2) {
                return t1.documentOrder - t2.documentOrder;
            });

            if (printTrace) pm.platform.log("executing transitition actions");


            sortedTransitions.forEach(function(transition){

                var targetIds = transition.targets && transition.targets.map(function(target){return target.id;});

                this._listeners.forEach(function(l){
                   if(l.onTransition) l.onTransition(transition.source.id,targetIds); 
                });

                if(transition.actions !== undefined) this._evaluateAction(transition.actions,eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
            },this);
 
            if (printTrace) pm.platform.log("executing state enter actions");

            statesEntered.forEach(function(state){

                if (printTrace || this.opts.logStatesEnteredAndExited) pm.platform.log("entering", state.id);

                this._listeners.forEach(function(l){
                   if(l.onEntry) l.onEntry(state.id); 
                });

                if(state.onentry !== undefined) this._evaluateAction(state.onentry, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
            },this);

            if (printTrace) pm.platform.log("updating configuration ");
            if (printTrace) pm.platform.log("old configuration ", this._configuration);

            //update configuration by removing basic states exited, and adding basic states entered
            this._configuration.difference(basicStatesExited);
            this._configuration.union(basicStatesEntered);

            if (printTrace) pm.platform.log("new configuration ", this._configuration);
            
            //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
            if (!eventsToAddToInnerQueue.isEmpty()) {
                if (printTrace) pm.platform.log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                this._innerEventQueue.push(eventsToAddToInnerQueue);
            }

            if (printTrace) pm.platform.log("updating datamodel for next small step :");
            
            //update the datamodel
            for (var key in datamodelForNextStep) {
                this._setData(key,datamodelForNextStep[key]);
            }
        }

        //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
        return selectedTransitions;
    },

    /** @private */
    _evaluateAction : function(actionRef, eventSet, datamodelForNextStep, eventsToAddToInnerQueue) {
        function $raise(event){
            eventsToAddToInnerQueue.add(event);
        }

        var n = this._getScriptingInterface(datamodelForNextStep, eventSet, true);
        return this._actions[actionRef].call(this.opts.evaluationContext, n.getData, n.setData, n.events, $raise);
    },

    /** @private */
    _getScriptingInterface : function(datamodelForNextStep, eventSet, allowWrite) {
        return {
            setData: allowWrite ? function(name, value) {
                return datamodelForNextStep[name] = value;
            } : function() {},
            getData: this._getData.bind(this),
            events: eventSet.iter()
        };
    },

    /** @private */
    _getStatesExited : function(transitions) {
        var statesExited = new this.opts.StateSet();
        var basicStatesExited = new this.opts.BasicStateSet();

        //States exited are defined to be active states that are
        //descendants of the scope of each priority-enabled transition.
        //Here, we iterate through the transitions, and collect states
        //that match this condition. 
        transitions.iter().forEach(function(transition){
            var scope = transition.scope,
                desc = scope.descendants;

            //For each state in the configuration
            //is that state a descendant of the transition scope?
            //Store ancestors of that state up to but not including the scope.
            this._configuration.iter().forEach(function(state){
                if(desc.indexOf(state) > -1){
                    basicStatesExited.add(state);
                    statesExited.add(state);
                    this.opts.model.getAncestors(state,scope).forEach(function(anc){
                        statesExited.add(anc);
                    });
                }
            },this);
        },this);

        var sortedStatesExited = statesExited.iter().sort(function(s1, s2) {
            return s2.depth - s1.depth;
        });
        return [basicStatesExited, sortedStatesExited];
    },

    /** @private */
    _getStatesEntered : function(transitions) {

        var o = {
            statesToEnter : new this.opts.StateSet(),
            basicStatesToEnter : new this.opts.BasicStateSet(),
            statesProcessed  : new this.opts.StateSet(),
            statesToProcess : []
        };

        //do the initial setup
        transitions.iter().forEach(function(transition){
            transition.targets.forEach(function(target){
                this._addStateAndAncestors(target,transition.scope,o);
            },this);
        },this);

        //loop and add states until there are no more to add (we reach a stable state)
        var s;
        /*jsl:ignore*/
        while(s = o.statesToProcess.pop()){
            /*jsl:end*/
            this._addStateAndDescendants(s,o);
        }

        //sort based on depth
        var sortedStatesEntered = o.statesToEnter.iter().sort(function(s1, s2) {
            return s1.depth - s2.depth;
        });

        return [o.basicStatesToEnter, sortedStatesEntered];
    },

    /** @private */
    _addStateAndAncestors : function(target,scope,o){

        //process each target
        this._addStateAndDescendants(target,o);

        //and process ancestors of targets up to the scope, but according to special rules
        this.opts.model.getAncestors(target,scope).forEach(function(s){

            if (s.kind === stateKinds.COMPOSITE) {
                //just add him to statesToEnter, and declare him processed
                //this is to prevent adding his initial state later on
                o.statesToEnter.add(s);

                o.statesProcessed.add(s);
            }else{
                //everything else can just be passed through as normal
                this._addStateAndDescendants(s,o);
            } 
        },this);
    },

    /** @private */
    _addStateAndDescendants : function(s,o){

        if(o.statesProcessed.contains(s)) return;

        if (s.kind === stateKinds.HISTORY) {
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

            if (s.kind === stateKinds.PARALLEL) {
                o.statesToProcess.push.apply(o.statesToProcess,
                    s.children.filter(function(s){return s.kind !== stateKinds.HISTORY;}));
            } else if (s.kind === stateKinds.COMPOSITE) {
                o.statesToProcess.push(s.initial); 
            } else if (s.kind === stateKinds.INITIAL || s.kind === stateKinds.BASIC || s.kind === stateKinds.FINAL) {
                o.basicStatesToEnter.add(s);
            }
        }

        o.statesProcessed.add(s); 
    },

    /** @private */
    _selectTransitions : function(eventSet, datamodelForNextStep) {
        if (this.opts.onlySelectFromBasicStates) {
            var states = this._configuration.iter();
        } else {
            var statesAndParents = new this.opts.StateSet;

            //get full configuration, unordered
            //this means we may select transitions from parents before children
            
            this._configuration.iter().forEach(function(basicState){
                statesAndParents.add(basicState);
                this.opts.model.getAncestors(basicState).forEach(function(ancestor){
                    statesAndParents.add(ancestor);
                });
            },this);

            states = statesAndParents.iter();
        }
        var n = this._getScriptingInterface(datamodelForNextStep, eventSet);
        var e = (function(t) {
            return this._actions[t.conditionActionRef].call(this.opts.evaluationContext, n.getData, n.setData, n.events);
        }).bind(this);

        var eventNames = eventSet.iter().map(function(event){return event.name;});

        var usePrefixMatchingAlgorithm = eventNames.filter(function(name){return name.search(".");}).length;

        var transitionSelector = usePrefixMatchingAlgorithm ? scxmlPrefixTransitionSelector : this.opts.transitionSelector;
        var enabledTransitions = new this.opts.TransitionSet();

        states.forEach(function(state){
            transitionSelector(state,eventNames,e).forEach(function(t){
                enabledTransitions.add(t);
            });
        });

        var priorityEnabledTransitions = this._selectPriorityEnabledTransitions(enabledTransitions);

        if (printTrace) pm.platform.log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        return priorityEnabledTransitions;
    },

    /** @private */
    _selectPriorityEnabledTransitions : function(enabledTransitions) {
        var priorityEnabledTransitions = new this.opts.TransitionSet();

        var tuple = this._getInconsistentTransitions(enabledTransitions), 
            consistentTransitions = tuple[0], 
            inconsistentTransitionsPairs = tuple[1];

        priorityEnabledTransitions.union(consistentTransitions);

        if (printTrace) pm.platform.log("enabledTransitions", enabledTransitions);
        if (printTrace) pm.platform.log("consistentTransitions", consistentTransitions);
        if (printTrace) pm.platform.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
        if (printTrace) pm.platform.log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        while (!inconsistentTransitionsPairs.isEmpty()) {
            enabledTransitions = new this.opts.TransitionSet(
                    inconsistentTransitionsPairs.iter().map(function(t){return this.opts.priorityComparisonFn(t);},this));

            tuple = this._getInconsistentTransitions(enabledTransitions);
            consistentTransitions = tuple[0]; 
            inconsistentTransitionsPairs = tuple[1];

            priorityEnabledTransitions.union(consistentTransitions);

            if (printTrace) pm.platform.log("enabledTransitions", enabledTransitions);
            if (printTrace) pm.platform.log("consistentTransitions", consistentTransitions);
            if (printTrace) pm.platform.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
            if (printTrace) pm.platform.log("priorityEnabledTransitions", priorityEnabledTransitions);
            
        }
        return priorityEnabledTransitions;
    },

    /** @private */
    _getInconsistentTransitions : function(transitions) {
        var allInconsistentTransitions = new this.opts.TransitionSet();
        var inconsistentTransitionsPairs = new this.opts.TransitionPairSet();
        var transitionList = transitions.iter();

        if (printTrace) pm.platform.log("transitions", transitionList);

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

    /** @private */
    _conflicts : function(t1, t2) {
        return !this._isArenaOrthogonal(t1, t2);
    },

    /** @private */
    _isArenaOrthogonal : function(t1, t2) {
        var isOrthogonal = this.opts.model.isOrthogonalTo(t1.scope, t2.scope);

        if (printTrace) {
            pm.platform.log("transition scopes", t1.scope.id, t1.scope.id);
            pm.platform.log("transition scopes are orthogonal?", isOrthogonal);
        }

        return isOrthogonal;
    },


    /*
        registerListener provides a generic mechanism to subscribe to state change notifications.
        Can be used for logging and debugging. For example, can attache a logger that simply logs the state changes.
        Or can attach a network debugging client that sends state change notifications to a debugging server.
    
        listener is of the form:
        {
          onEntry : function(stateId){},
          onExit : function(stateId){},
          onTransition : function(sourceStateId,targetStatesIds[]){}
        }
    */

    /** @expose */
    registerListener : function(listener){
        return this._listeners.push(listener);
    },

    /** @expose */
    unregisterListener : function(listener){
        var retval;
        var index = this._listeners.indexOf(listener);
        if (index >= 0) {
          retval = this._listeners.splice(index,1);
        }

        return retval;
    }

};


/**
 * @constructor
 * @extends SCXMLInterpreter
 */
function SimpleInterpreter(model, opts) {
    opts = opts || {};
    setupDefaultOpts(opts);

    this._isStepping = false;

    this._send = opts.send || this._send;

    this._cancel = opts.cancel || this._cancel;

    SCXMLInterpreter.call(this,model,opts);     //call super constructor
}
SimpleInterpreter.prototype = Object.create(SCXMLInterpreter.prototype);

/** @expose */
SimpleInterpreter.prototype.gen = function(evtObjOrName,optionalData) {

    var e;
    switch(typeof evtObjOrName){
        case 'string':
            e = {name : evtObjOrName, data : optionalData};
            break;
        case 'object':
            if(typeof evtObjOrName.name === 'string'){
                e = evtObjOrName;
            }else{
                throw new Error('Event object must have "name" property of type string.');
            }
            break;
        default:
            throw new Error('First argument to gen must be a string or object.');
    }

    if (this._isStepping) {
        throw new Error("gen called before previous call to gen could complete. If executed in single-threaded environment, this means it was called recursively, which is illegal, as it would break SCION step semantics.");
    }

    this._isStepping = true;
    this._performBigStep(e);
    this._isStepping = false;
    return this.getConfiguration();
};

/** @private */
SimpleInterpreter.prototype._send = function(event, options) {
    var callback, timeoutId,
        _this = this;
    if (pm.platform.setTimeout) {
        if (printTrace) {
            pm.platform.log("sending event", event.name, "with content", event.data, "after delay", options.delay);
        }
        callback = function() {
            return _this.gen(event);
        };
        timeoutId = pm.platform.setTimeout(callback, options.delay);
        if (options.sendid) return this._timeoutMap[options.sendid] = timeoutId;
    } else {
        throw new Error("setTimeout function not set");
    }
};

/** @private */
SimpleInterpreter.prototype._cancel = function(sendid){
    if (pm.platform.clearTimeout) {
        if (sendid in this._timeoutMap) {
            if (printTrace) {
                pm.platform.log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
            }
            return pm.platform.clearTimeout(this._timeoutMap[sendid]);
        }
    } else {
        throw new Error("clearTimeout function not set");
    }
};

module.exports = {
    SCXMLInterpreter: SCXMLInterpreter,
    SimpleInterpreter: SimpleInterpreter
};
