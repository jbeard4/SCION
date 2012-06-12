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

var ArraySet = require('./set/ArraySet'),
    stateKinds = require('./state-kinds-enum'),
    setupDefaultOpts = require('./setup-default-opts'),
    scxmlPrefixTransitionSelector = require('./scxml-dynamic-name-match-transition-selector');

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

function SCXMLInterpreter(model, opts){
    this.model = model;
    this.opts = opts;

    //this.opts.printTrace = true;
    this.opts.log = this.opts.log || this._log;   //rely on global console if this console is undefined
    this.opts.StateIdSet = this.opts.StateIdSet || ArraySet;
    this.opts.EventSet = this.opts.EventSet || ArraySet;
    this.opts.TransitionPairSet = this.opts.TransitionPairSet || ArraySet;
    this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority(this.opts.model);
    this.opts.globalEval = this.opts.globalEval || eval;

    this._configuration = new this.opts.BasicStateSet();
    this._historyValue = {};
    this._innerEventQueue = [];
    this._isInFinalState = false;
    this._datamodel = Object.create(this.model.datamodel);
    this._timeoutMap = {};

    this._listeners = [];
}

SCXMLInterpreter.prototype = {

    start : function() {
        //perform big step without events to take all default transitions and reach stable initial state
        if (this.opts.printTrace) this._log("performing initial big step");
        this._configuration.add(this.model.root.initial);

        //initialize top-level datamodel expressions. simple eval
        for(var k in this._datamodel){
            var v = this._datamodel[k];
            if (typeof v === 'string') this._datamodel[k] = eval("(" + v + ")");
        }

        //set up the big list of actions
        this._actions = this.model.actionFactory(this._datamodel); 

        this._performBigStep();
        return this.getConfiguration();
    },

    getConfiguration : function() {
        return this._configuration.iter().map(function(s){return s.id;});
    },

    getFullConfiguration : function() {
        return this._configuration.iter().
                map(function(s){ return [s].concat(this.opts.model.getAncestors(s));},this).
                reduce(function(a,b){return a.concat(b);},[]).    //flatten
                map(function(s){return s.id;}).
                reduce(function(a,b){return a.indexOf(b) > -1 ? a : a.concat(b);},[]); //uniq
    },

    isIn : function(stateName) {
        return this.getFullConfiguration().indexOf(stateName) > -1;
    },

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

    _performSmallStep : function(eventSet, datamodelForNextStep) {

        if (this.opts.printTrace) this._log("selecting transitions with eventSet: ", eventSet);

        var selectedTransitions = this._selectTransitions(eventSet, datamodelForNextStep);

        if (this.opts.printTrace) this._log("selected transitions: ", selectedTransitions);

        if (!selectedTransitions.isEmpty()) {

            if (this.opts.printTrace) this._log("sorted transitions: ", selectedTransitions);

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.TransitionSet(selectedTransitions.iter().filter(function(t){return t.targets;}));

            var exitedTuple = this._getStatesExited(selectedTransitionsWithTargets), 
                basicStatesExited = exitedTuple[0], 
                statesExited = exitedTuple[1];

            var enteredTuple = this._getStatesEntered(selectedTransitionsWithTargets), 
                basicStatesEntered = enteredTuple[0], 
                statesEntered = enteredTuple[1];

            if (this.opts.printTrace) this._log("basicStatesExited ", basicStatesExited);
            if (this.opts.printTrace) this._log("basicStatesEntered ", basicStatesEntered);
            if (this.opts.printTrace) this._log("statesExited ", statesExited);
            if (this.opts.printTrace) this._log("statesEntered ", statesEntered);

            var eventsToAddToInnerQueue = new this.opts.EventSet();

            //update history states
            if (this.opts.printTrace) this._log("executing state exit actions");

            statesExited.forEach(function(state){

                if (this.opts.printTrace) this._log("exiting ", state);

                //invoke listeners
                this._listeners.forEach(function(l){
                   if(l.onExit) l.onExit(state.id); 
                });

                state.onexit.forEach(function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);

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

            if (this.opts.printTrace) this._log("executing transitition actions");


            sortedTransitions.forEach(function(transition){

                var targetIds = transition.targets && transition.targets.map(function(target){return target.id;});

                this._listeners.forEach(function(l){
                   if(l.onTransition) l.onTransition(transition.source.id,targetIds); 
                });

                transition.actions.forEach(function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);
            },this);
 
            if (this.opts.printTrace) this._log("executing state enter actions");

            statesEntered.forEach(function(state){

                this._listeners.forEach(function(l){
                   if(l.onEntry) l.onEntry(state.id); 
                });

                state.onentry.forEach(function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);
            },this);

            if (this.opts.printTrace) this._log("updating configuration ");
            if (this.opts.printTrace) this._log("old configuration ", this._configuration);

            //update configuration by removing basic states exited, and adding basic states entered
            this._configuration.difference(basicStatesExited);
            this._configuration.union(basicStatesEntered);

            if (this.opts.printTrace) this._log("new configuration ", this._configuration);
            
            //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
            if (!eventsToAddToInnerQueue.isEmpty()) {
                if (this.opts.printTrace) this._log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                this._innerEventQueue.push(eventsToAddToInnerQueue);
            }

            if (this.opts.printTrace) this._log("updating datamodel for next small step :");
            
            //update the datamodel
            for (var key in datamodelForNextStep) {
                if (this.opts.printTrace) this._log("key ", key);

                if (key in this._datamodel) {
                    if (this.opts.printTrace) this._log("old value ", this._datamodel[key]);
                } else {
                    if (this.opts.printTrace) this._log("old value is null");
                }
                if (this.opts.printTrace) this._log("new value ", datamodelForNextStep[key]);
                this._datamodel[key] = datamodelForNextStep[key];
            }
        }

        //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
        return selectedTransitions;
    },

    _evaluateAction : function(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue) {
        var _constructEventData = (function(){
            var data = {};

            if(action.content){
                //content
                data = action.content;
            }else if(action.contentexpr){
                data = this._eval(action.contentexpr, datamodelForNextStep, eventSet);
            }else{
                //namelist
                if (action.namelist) {
                    action.namelist.forEach(function(name){
                        data[name] = this._datamodel[name];
                    },this);
                }

                //params
                action.params.forEach(function(param){
                    if(param.expr){
                        data[param.name] = this._eval(param.expr, datamodelForNextStep, eventSet);
                    }else if(param.location){
                        data[param.name] = this._datamodel[param.location];
                    }
                },this);
            }

            return data;
        }).bind(this);

        switch (action.type) {
            case "raise":
                eventsToAddToInnerQueue.add({ name: action.event });
                break;
            case "assign":
                this._datamodel[action.location] = this._eval(action, datamodelForNextStep, eventSet);
                break;
            case "script":
                this._eval(action, datamodelForNextStep, eventSet, true);
                break;
            case "log":
                this.opts.log(this._eval(action, datamodelForNextStep, eventSet));
                break;
            case "send":
                if (this._send) {
                    this._send({
                        target: action.targetexpr ? this._eval(action.targetexpr, datamodelForNextStep, eventSet) : action.target,
                        name: action.eventexpr ? this._eval(action.eventexpr, datamodelForNextStep, eventSet) : action.event,
                        data: _constructEventData(),
                        origin: this.opts.origin,
                        type: action.typeexpr ? this._eval(action.typeexpr, datamodelForNextStep, eventSet) : action.sendType
                    }, {
                        delay: action.delayexpr ? this._eval(action.delayexpr, datamodelForNextStep, eventSet) : action.delay,
                        sendId: action.idlocation ? this._datamodel[action.idlocation] : action.id
                    });
                }
                break;
            case "cancel":
                if (this._cancel) this._cancel(action.sendid);
                break;
            default : break;
        }
    },

    _eval : function(action, datamodelForNextStep, eventSet, allowWrite) {
        var n = this._getScriptingInterface(datamodelForNextStep, eventSet, allowWrite);
        return this._actions[action.actionRef].call(this.opts.evaluationContext, n.getData, n.setData, n.In, n.events);
    },

    _getScriptingInterface : function(datamodelForNextStep, eventSet, allowWrite) {
        return {
            setData: allowWrite ? function(name, value) {
                return datamodelForNextStep[name] = value;
            } : function() {},
            getData: (function(name) {
                return this._datamodel[name];
            }).bind(this),
            In: (function(s) {
                return this.isIn(s);
            }).bind(this),
            events: eventSet.iter()
        };
    },

    _getStatesExited : function(transitions) {
        var statesExited = new this.opts.StateSet();
        var basicStatesExited = new this.opts.BasicStateSet();

        transitions.iter().forEach(function(transition){
            var lca = transition.lca;
            var desc = lca.descendants;

            this._configuration.iter().forEach(function(state){
                if(desc.indexOf(state) > -1){
                    basicStatesExited.add(state);
                    statesExited.add(state);
                    this.opts.model.getAncestors(state,lca).forEach(function(anc){
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

    _getStatesEntered : function(transitions) {

        var statesToEnter = new this.opts.StateSet();
        var basicStatesToEnter = new this.opts.BasicStateSet();
        var statesProcessed  = new this.opts.StateSet();
        var statesToProcess = [];

        var processTransitionSourceAndTarget = (function(source,target){
            //process each target
            processState(target);

            //and process ancestors of targets up to LCA, but according to special rules
            var lca = this.opts.model.getLCA(source,target);
            this.opts.model.getAncestors(target,lca).forEach(function(s){
                if (s.kind === stateKinds.COMPOSITE) {
                    //just add him to statesToEnter, and declare him processed
                    //this is to prevent adding his initial state later on
                    statesToEnter.add(s);

                    statesProcessed.add(s);
                }else{
                    //everything else can just be passed through as normal
                    processState(s);
                } 
            });
        }).bind(this);

        var processState = (function(s){

            if(statesProcessed.contains(s)) return;

            if (s.kind === stateKinds.HISTORY) {
                if (s.id in this._historyValue) {
                    this._historyValue[s.id].forEach(function(stateFromHistory){
                        processTransitionSourceAndTarget(s,stateFromHistory);
                    });
                } else {
                    statesToEnter.add(s);
                    basicStatesToEnter.add(s);
                }
            } else {
                statesToEnter.add(s);

                if (s.kind === stateKinds.PARALLEL) {
                    statesToProcess.push.apply(statesToProcess,
                        s.children.filter(function(s){return s.kind !== stateKinds.HISTORY;}));
                } else if (s.kind === stateKinds.COMPOSITE) {
                    statesToProcess.push(s.initial); 
                } else if (s.kind === stateKinds.INITIAL || s.kind === stateKinds.BASIC || s.kind === stateKinds.FINAL) {
                    basicStatesToEnter.add(s);
                }
            }

            statesProcessed.add(s); 

        }).bind(this);

        //do the initial setup
        transitions.iter().forEach(function(transition){
            transition.targets.forEach(function(target){
                processTransitionSourceAndTarget(transition.source,target);
            });
        });

        //loop and add states until there are no more to add (we reach a stable state)
        var s;
        /*jsl:ignore*/
        while(s = statesToProcess.pop()){
            /*jsl:end*/
            processState(s);
        }

        //sort based on depth
        var sortedStatesEntered = statesToEnter.iter().sort(function(s1, s2) {
            return s1.depth - s2.depth;
        });

        return [basicStatesToEnter, sortedStatesEntered];
    },

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
            return this._actions[t.conditionActionRef].call(this.opts.evaluationContext, n.getData, n.setData, n.In, n.events, this._datamodel);
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

        if (this.opts.printTrace) this._log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        return priorityEnabledTransitions;
    },

    _selectPriorityEnabledTransitions : function(enabledTransitions) {
        var priorityEnabledTransitions = new this.opts.TransitionSet();

        var tuple = this._getInconsistentTransitions(enabledTransitions), 
            consistentTransitions = tuple[0], 
            inconsistentTransitionsPairs = tuple[1];

        priorityEnabledTransitions.union(consistentTransitions);

        if (this.opts.printTrace) this._log("enabledTransitions", enabledTransitions);
        if (this.opts.printTrace) this._log("consistentTransitions", consistentTransitions);
        if (this.opts.printTrace) this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
        if (this.opts.printTrace) this._log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        while (!inconsistentTransitionsPairs.isEmpty()) {
            enabledTransitions = new this.opts.TransitionSet(
                    inconsistentTransitionsPairs.iter().map(function(t){return this.opts.priorityComparisonFn(t);},this));

            tuple = this._getInconsistentTransitions(enabledTransitions);
            consistentTransitions = tuple[0]; 
            inconsistentTransitionsPairs = tuple[1];

            priorityEnabledTransitions.union(consistentTransitions);

            if (this.opts.printTrace) this._log("enabledTransitions", enabledTransitions);
            if (this.opts.printTrace) this._log("consistentTransitions", consistentTransitions);
            if (this.opts.printTrace) this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
            if (this.opts.printTrace) this._log("priorityEnabledTransitions", priorityEnabledTransitions);
            
        }
        return priorityEnabledTransitions;
    },

    _getInconsistentTransitions : function(transitions) {
        var allInconsistentTransitions = new this.opts.TransitionSet();
        var inconsistentTransitionsPairs = new this.opts.TransitionPairSet();
        var transitionList = transitions.iter();

        if (this.opts.printTrace) this._log("transitions", transitionList);

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

    _conflicts : function(t1, t2) {
        return !this._isArenaOrthogonal(t1, t2);
    },

    _isArenaOrthogonal : function(t1, t2) {
        var t1LCA = t1.targets ? t1.lca : t1.source;
        var t2LCA = t2.targets ? t2.lca : t2.source;
        var isOrthogonal = this.opts.model.isOrthogonalTo(t1LCA, t2LCA);

        if (this.opts.printTrace) {
            this._log("transition LCAs", t1LCA.id, t2LCA.id);
            this._log("transition LCAs are orthogonal?", isOrthogonal);
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
    registerListener : function(listener){
        return this._listeners.push(listener);
    },

    unregisterListener : function(listener){
        return this._listeners.splice(this._listeners.indexOf(listener),1);
    }

};


//TODO: figure out how to do the kind of simple object-orientation we need
function SimpleInterpreter(model, opts) {
    opts = opts || {};
    setupDefaultOpts(opts);

    this._isStepping = false;

    this._send = opts.send || this._send;

    this._cancel = opts.cancel || this._cancel;

    SCXMLInterpreter.call(this,model,opts);     //call super constructor
}
SimpleInterpreter.prototype = Object.create(SCXMLInterpreter.prototype);

//extend. would be nice if we could do this using the second arg in Object.create, but this isn't portable, even with compatibility library
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

SimpleInterpreter.prototype._send = function(event, options) {
    var callback, timeoutId,
        _this = this;
    if (this._setTimeout) {
        if (this.opts.printTrace) {
            this._log("sending event", event.name, "with content", event.data, "after delay", options.delay);
        }
        callback = function() {
            return _this.gen(event);
        };
        timeoutId = this._setTimeout(callback, options.delay);
        if (options.sendid) return this._timeoutMap[options.sendid] = timeoutId;
    } else {
        throw new Error("setTimeout function not set");
    }
};

SimpleInterpreter.prototype._cancel = function(sendid){
    if (this._clearTimeout) {
        if (sendid in this._timeoutMap) {
            if (this.opts.printTrace) {
                this._log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
            }
            return this._clearTimeout(this._timeoutMap[sendid]);
        }
    } else {
        throw new Error("clearTimeout function not set");
    }
};

module.exports = {
    SCXMLInterpreter: SCXMLInterpreter,
    SimpleInterpreter: SimpleInterpreter
};
