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

var _ = require('../util/underscore-wrapper');

var ArraySet = require('./set/ArraySet'),
    stateKinds = require('./state-kinds-enum'),
    setupDefaultOpts = require('./setup-default-opts'),
    scxmlPrefixTransitionSelector = require('./scxml-dynamic-name-match-transition-selector');

function create(o) {
    var F;
    if (Object.create) {
        return Object.create(o);
    } else {
        F = function() {};
        F.prototype = o;
        return new F();
    }
}

function getTransitionWithHigherSourceChildPriority(model) {
    return function(_arg) {
        var t1 = _arg[0], t2 = _arg[1];
        //compare transitions based first on depth, then based on document order
        if (model.getDepth(t1.source) < model.getDepth(t2.source)) {
            return t2;
        } else if (model.getDepth(t2.source) < model.getDepth(t1.source)) {
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
    if(model && opts){
        this.model = model;
        this.opts = opts;

        //this.opts.printTrace = true;

        this.opts.StateIdSet = this.opts.StateIdSet || ArraySet;
        this.opts.EventSet = this.opts.EventSet || ArraySet;
        this.opts.TransitionPairSet = this.opts.TransitionPairSet || ArraySet;
        this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority(this.opts.model);
        this.opts.globalEval = this.opts.globalEval || eval;

        this._configuration = new this.opts.BasicStateSet();
        this._historyValue = {};
        this._innerEventQueue = [];
        this._isInFinalState = false;
        this._datamodel = create(this.model.datamodel);
        this._timeoutMap = {};

        this._listeners = [];
    }
}

SCXMLInterpreter.prototype = {

    start : function() {
        //perform big step without events to take all default transitions and reach stable initial state
        if (this.opts.printTrace) console.log("performing initial big step");
        this._configuration.add(this.model.root.initial);

        //eval top-level scripts
        //we treat these differently than other scripts. they get evaled in global scope, and without explicit scripting interface
        //this is necessary in order to, e.g., allow js function declarations that are visible to scxml script tags later.
        _(this.model.scripts).each(function(script){
            /*jsl:ignore*/
            with(this._datamodel){ this.opts.globalEval.call(null,script) };
            /*jsl:end*/
        },this);

        //initialize top-level datamodel expressions. simple eval
        for(var k in this._datamodel){
            var v = this._datamodel[k];
            if (v) this._datamodel[k] = eval(v);
        }
        this._performBigStep();
        return this.getConfiguration();
    },

    getConfiguration : function() {
        return new _.map(this._configuration.iter(),function(s){return s.id;});
    },

    getFullConfiguration : function() {
        return _.chain(this._configuration.iter()).
                map(function(s){ return [s].concat(this.opts.model.getAncestors(s));},this).
                flatten().
                map(function(s){return s.id;}).
                uniq().
                value();
    },

    isIn : function(stateName) {
        return _.contains(this.getFullConfiguration(),stateName);
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
        this._isInFinalState = _.every(this._configuration.iter(),function(s){ return s.kind === stateKinds.FINAL; });
    },

    _performSmallStep : function(eventSet, datamodelForNextStep) {

        if (this.opts.printTrace) console.log("selecting transitions with eventSet: ", eventSet);

        var selectedTransitions = this._selectTransitions(eventSet, datamodelForNextStep);

        if (this.opts.printTrace) console.log("selected transitions: ", selectedTransitions);

        if (!selectedTransitions.isEmpty()) {

            if (this.opts.printTrace) console.log("sorted transitions: ", selectedTransitions);

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.TransitionSet(_.filter(selectedTransitions.iter(),function(t){return t.targets;}));

            var exitedTuple = this._getStatesExited(selectedTransitionsWithTargets), 
                basicStatesExited = exitedTuple[0], 
                statesExited = exitedTuple[1];

            var enteredTuple = this._getStatesEntered(selectedTransitionsWithTargets), 
                basicStatesEntered = enteredTuple[0], 
                statesEntered = enteredTuple[1];

            if (this.opts.printTrace) console.log("basicStatesExited ", basicStatesExited);
            if (this.opts.printTrace) console.log("basicStatesEntered ", basicStatesEntered);
            if (this.opts.printTrace) console.log("statesExited ", statesExited);
            if (this.opts.printTrace) console.log("statesEntered ", statesEntered);

            var eventsToAddToInnerQueue = new this.opts.EventSet();

            //update history states
            if (this.opts.printTrace) console.log("executing state exit actions");

            _.each(statesExited,function(state){

                if (this.opts.printTrace) console.log("exiting ", state);

                //invoke listeners
                _.each(this._listeners,function(l){
                   l.onExit(state.id); 
                });

                _.each(state.onexit,function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);

                var f;
                if (state.history) {
                    if (state.history.isDeep) {
                        f = _.bind(function(s0) {
                            return s0.kind === stateKinds.BASIC && _.contains(this.opts.model.getDescendants(state), s0);
                        },this);
                    } else {
                        f = function(s0) {
                            return s0.parent === state;
                        };
                    }
                    //update history
                    this._historyValue[state.history.id] = _.filter(statesExited,f);
                }
            },this);


            // -> Concurrency: Number of transitions: Multiple
            // -> Concurrency: Order of transitions: Explicitly defined
            var sortedTransitions = selectedTransitions.iter().sort(function(t1, t2) {
                return t1.documentOrder - t2.documentOrder;
            });

            if (this.opts.printTrace) console.log("executing transitition actions");


            _.each(sortedTransitions,function(transition){

                _.each(this._listeners,function(l){
                   l.onTransition(transition.source.id,_.map(transition.targets,function(target){return target.id;})); 
                });

                _.each(transition.actions,function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);
            },this);
 
            if (this.opts.printTrace) console.log("executing state enter actions");

            _.each(statesEntered,function(state){

                _.each(this._listeners,function(l){
                   l.onEntry(state.id); 
                });

                _.each(state.onentry,function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);
            },this);

            if (this.opts.printTrace) console.log("updating configuration ");
            if (this.opts.printTrace) console.log("old configuration ", this._configuration);

            //update configuration by removing basic states exited, and adding basic states entered
            this._configuration.difference(basicStatesExited);
            this._configuration.union(basicStatesEntered);

            if (this.opts.printTrace) console.log("new configuration ", this._configuration);
            
            //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
            if (!eventsToAddToInnerQueue.isEmpty()) {
                if (this.opts.printTrace) console.log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                this._innerEventQueue.push(eventsToAddToInnerQueue);
            }

            if (this.opts.printTrace) console.log("updating datamodel for next small step :");
            
            //update the datamodel
            for (var key in datamodelForNextStep) {
                if (this.opts.printTrace) console.log("key ", key);

                if (key in this._datamodel) {
                    if (this.opts.printTrace) console.log("old value ", this._datamodel[key]);
                } else {
                    if (this.opts.printTrace) console.log("old value is null");
                }
                if (this.opts.printTrace) console.log("new value ", datamodelForNextStep[key]);
                this._datamodel[key] = datamodelForNextStep[key];
            }
        }

        //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
        return selectedTransitions;
    },

    _evaluateAction : function(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue) {
        var _constructEventData = _.bind(function(){
            var data = {};

            if(action.content){
                //content
                data = action.content;
            }else{
                //namelist
                if (action.namelist) {
                    _.each(action.namelist,function(name){
                        data[name] = this._datamodel[name];
                    },this);
                }

                //params
                _.each(action.params,function(param){
                    if(param.expr){
                        data[param.name] = this._eval(param.expr, datamodelForNextStep, eventSet);
                    }else if(param.location){
                        data[param.name] = this._datamodel[param.location];
                    }
                },this);
            }

            return data;
        },this);

        switch (action.type) {
            case "raise":
                if (this.opts.printTrace) console.log("sending event", action.event, "with content", action.contentexpr);
                
                eventsToAddToInnerQueue.add({ name: action.event });
                break;
            case "assign":
                this._datamodel[action.location] = this._eval(action, datamodelForNextStep, eventSet);
                break;
            case "script":
                this._eval(action, datamodelForNextStep, eventSet, true);
                break;
            case "log":
                console.log(this._eval(action, datamodelForNextStep, eventSet));
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
        return action.evaluate.call(this.opts.evaluationContext, n.getData, n.setData, n.In, n.events, this._datamodel);
    },

    _getScriptingInterface : function(datamodelForNextStep, eventSet, allowWrite) {
        return {
            setData: allowWrite ? function(name, value) {
                return datamodelForNextStep[name] = value;
            } : function() {},
            getData: _.bind(function(name) {
                return this._datamodel[name];
            },this),
            In: _.bind(function(s) {
                return this.isIn(s);
            },this),
            events: eventSet.iter()
        };
    },

    _getStatesExited : function(transitions) {
        var statesExited = new this.opts.StateSet();
        var basicStatesExited = new this.opts.BasicStateSet();

        _.each(transitions.iter(),function(transition){
            var lca = this.opts.model.getLCA(transition);
            var desc = this.opts.model.getDescendants(lca);

            _.each(this._configuration.iter(),function(state){
                if(_.contains(desc,state)){
                    basicStatesExited.add(state);
                    statesExited.add(state);
                    _.each(this.opts.model.getAncestors(state, lca),function(anc){
                        statesExited.add(anc);
                    });
                }
            },this);
        },this);

        var sortedStatesExited = statesExited.iter().sort(_.bind(function(s1, s2) {
            return this.opts.model.getDepth(s2) - this.opts.model.getDepth(s1);
        },this));
        return [basicStatesExited, sortedStatesExited];
    },

    _getStatesEntered : function(transitions) {
        var statesToRecursivelyAdd = 
            _.chain(transitions.iter()).
                map(function(transition){
                    return transition.targets;
                }).
                flatten().
                value();

        if (this.opts.printTrace) console.log("statesToRecursivelyAdd :", statesToRecursivelyAdd);

        var statesToEnter = new this.opts.StateSet();
        var basicStatesToEnter = new this.opts.BasicStateSet();

        //recursively add states to enter
        while (statesToRecursivelyAdd.length) {
            _.each(statesToRecursivelyAdd,function(state){
                this._recursiveAddStatesToEnter(state, statesToEnter, basicStatesToEnter);
            },this);

            //add children of parallel states that are not already in statesToEnter to statesToRecursivelyAdd 
            var childrenOfParallelStatesInStatesToEnter = 
                _.chain(statesToEnter.iter()).
                    filter(function(s){return s.kind === stateKinds.PARALLEL;}).
                    map(function(s){return s.children;}).
                    flatten().
                    value();

            statesToRecursivelyAdd = _.filter(childrenOfParallelStatesInStatesToEnter,function(s){
                return s.kind !== stateKinds.HISTORY && !statesToEnter.contains(s);
            });
        }

        //recursiveStatesToEnter will not add ancestors of basic state targets, so we add them here
        //add ancestors of targets up to LCA, 
        //as this is not handled by _recursiveAddStatesToEnter
        _.each(transitions.iter(),function(transition){
            _.each(transition.targets,function(target){
                var lca = this.opts.model.getLCA(transition.source,target);
                _.each(this.opts.model.getAncestors(target,lca),function(anc){
                    statesToEnter.add(anc);
                });
            },this);
        },this);


        var sortedStatesEntered = statesToEnter.iter().sort(_.bind(function(s1, s2) {
            return this.opts.model.getDepth(s1) - this.opts.model.getDepth(s2);
        },this));

        return [basicStatesToEnter, sortedStatesEntered];
    },

    _recursiveAddStatesToEnter : function(s, statesToEnter, basicStatesToEnter) {
        if (s.kind === stateKinds.HISTORY) {
            if (s.id in this._historyValue) {
                _.each(this._historyValue[s.id],function(historyState){
                    this._recursiveAddStatesToEnter(historyState, statesToEnter, basicStatesToEnter);
                },this);
            } else {
                statesToEnter.add(s);
                basicStatesToEnter.add(s);
            }
        } else {
            statesToEnter.add(s);

            if (s.kind === stateKinds.PARALLEL) {
                _.each(s.children,function(child){
                    if(child.kind !== stateKinds.HISTORY){      //don't enter history by default
                        this._recursiveAddStatesToEnter(child, statesToEnter, basicStatesToEnter);
                    }
                },this);
            } else if (s.kind === stateKinds.COMPOSITE) {
                this._recursiveAddStatesToEnter(s.initial, statesToEnter, basicStatesToEnter);
            } else if (s.kind === stateKinds.INITIAL || s.kind === stateKinds.BASIC || s.kind === stateKinds.FINAL) {
                basicStatesToEnter.add(s);
            }
        }
    },

    _selectTransitions : function(eventSet, datamodelForNextStep) {
        if (this.opts.onlySelectFromBasicStates) {
            var states = this._configuration.iter();
        } else {
            var statesAndParents = new this.opts.StateSet;

            //get full configuration, unordered
            //this means we may select transitions from parents before children
            
            _.each(this._configuration.iter(),function(basicState){
                statesAndParents.add(basicState);
                _.each(this.opts.model.getAncestors(basicState),function(ancestor){
                    statesAndParents.add(ancestor);
                });
            },this);

            states = statesAndParents.iter();
        }
        var n = this._getScriptingInterface(datamodelForNextStep, eventSet);
        var e = _.bind(function(t) {
            return t.evaluateCondition.call(this.opts.evaluationContext, n.getData, n.setData, n.In, n.events, this._datamodel);
        },this);

        var eventNames = _.map(eventSet.iter(),function(event){return event.name;});

        var usePrefixMatchingAlgorithm = _(eventNames).filter(function(name){return name.search(".");}).length;

        var transitionSelector = usePrefixMatchingAlgorithm ? scxmlPrefixTransitionSelector : this.opts.transitionSelector;
        var enabledTransitions = new this.opts.TransitionSet();

        _.each(states,function(state){
            _.each(transitionSelector(state,eventNames,e),function(t){
                enabledTransitions.add(t);
            });
        });

        var priorityEnabledTransitions = this._selectPriorityEnabledTransitions(enabledTransitions);

        if (this.opts.printTrace) console.log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        return priorityEnabledTransitions;
    },

    _selectPriorityEnabledTransitions : function(enabledTransitions) {
        var priorityEnabledTransitions = new this.opts.TransitionSet();

        var tuple = this._getInconsistentTransitions(enabledTransitions), 
            consistentTransitions = tuple[0], 
            inconsistentTransitionsPairs = tuple[1];

        priorityEnabledTransitions.union(consistentTransitions);

        if (this.opts.printTrace) console.log("enabledTransitions", enabledTransitions);
        if (this.opts.printTrace) console.log("consistentTransitions", consistentTransitions);
        if (this.opts.printTrace) console.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
        if (this.opts.printTrace) console.log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        while (!inconsistentTransitionsPairs.isEmpty()) {
            enabledTransitions = new this.opts.TransitionSet(
                _.map(
                    inconsistentTransitionsPairs.iter(),
                    function(t){return this.opts.priorityComparisonFn(t);},this));

            tuple = this._getInconsistentTransitions(enabledTransitions);
            consistentTransitions = tuple[0]; 
            inconsistentTransitionsPairs = tuple[1];

            priorityEnabledTransitions.union(consistentTransitions);

            if (this.opts.printTrace) console.log("enabledTransitions", enabledTransitions);
            if (this.opts.printTrace) console.log("consistentTransitions", consistentTransitions);
            if (this.opts.printTrace) console.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
            if (this.opts.printTrace) console.log("priorityEnabledTransitions", priorityEnabledTransitions);
            
        }
        return priorityEnabledTransitions;
    },

    _getInconsistentTransitions : function(transitions) {
        var allInconsistentTransitions = new this.opts.TransitionSet();
        var inconsistentTransitionsPairs = new this.opts.TransitionPairSet();
        var transitionList = transitions.iter();

        if (this.opts.printTrace) console.log("transitions", transitionList);

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
        var t1LCA = t1.targets ? this.opts.model.getLCA(t1) : t1.source;
        var t2LCA = t2.targets ? this.opts.model.getLCA(t2) : t2.source;
        var isOrthogonal = this.opts.model.isOrthogonalTo(t1LCA, t2LCA);

        if (this.opts.printTrace) {
            console.log("transition LCAs", t1LCA.id, t2LCA.id);
            console.log("transition LCAs are orthogonal?", isOrthogonal);
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
        return this._listeners = _.without(this._listeners,listener);
    }

};


//TODO: figure out how to do the kind of simple object-orientation we need
function SimpleInterpreter(model, opts) {

    if(model && opts){

        this._isStepping = false;

        this._send = opts.send || this._send;

        this._cancel = opts.cancel || this._cancel;

        SCXMLInterpreter.call(this,model,opts);     //call super constructor
    }
}
SimpleInterpreter.prototype = new SCXMLInterpreter();

_.extend(SimpleInterpreter.prototype,{

    gen : function(e) {
        if (e === undefined) {
            throw new Error("gen must be passed an event object.");
        }
        if (this._isStepping) {
            throw new Error("gen called before previous call to gen could complete. if executed in single-threaded environment, this means it was called recursively, which is illegal, as it would break SCION step semantics.");
        }
        this._isStepping = true;
        this._performBigStep(e);
        this._isStepping = false;
        return this.getConfiguration();
    },

    _send : function(event, options) {
        var callback, timeoutId,
            _this = this;
        if (this.opts.setTimeout) {
            if (this.opts.printTrace) {
                console.log("sending event", event.name, "with content", event.data, "after delay", options.delay);
            }
            callback = function() {
                return _this.gen(event);
            };
            timeoutId = this.opts.setTimeout(callback, options.delay);
            if (options.sendid) return this._timeoutMap[options.sendid] = timeoutId;
        } else {
            throw new Error("setTimeout function not set");
        }
    },

    _cancel : function(sendid){
        if (this.opts.clearTimeout) {
            if (sendid in this._timeoutMap) {
                if (this.opts.printTrace) {
                    console.log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
                }
                return this.opts.clearTimeout(this._timeoutMap[sendid]);
            }
        } else {
            throw new Error("clearTimeout function not set");
        }
    }

});

function BrowserInterpreter(model, opts) {
    opts = opts || {};
    setupDefaultOpts(opts);
    if (!opts.setTimeout) {
        opts.setTimeout = function(callback, timeout) {
            return window.setTimeout(callback, timeout);
        };
    }
    if (!opts.clearTimeout) {
        opts.clearTimeout = function(timeoutId) {
            return window.clearTimeout(timeoutId);
        };
    }

    SimpleInterpreter.call(this,model,opts);    //call super constructor
}
BrowserInterpreter.prototype = new SimpleInterpreter();

function NodeInterpreter(model, opts) {
    opts = opts || {};
    setupDefaultOpts(opts);
    opts.setTimeout = setTimeout;
    opts.clearTimeout = clearTimeout;

    SimpleInterpreter.call(this,model,opts);    //call super constructor
}
NodeInterpreter.prototype = new SimpleInterpreter();

module.exports = {
    SCXMLInterpreter: SCXMLInterpreter,
    SimpleInterpreter: SimpleInterpreter,
    BrowserInterpreter: BrowserInterpreter,
    NodeInterpreter: NodeInterpreter
};
