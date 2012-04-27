
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"scion": function(exports, require, module) {//this module provides a single point of access to all important user-facing modules in scion
module.exports = {
    annotator : require('./util/annotate-scxml-json'),
    json2model : require('./scxml/json2model'),
    scxml : require('./scxml/SCXML')
};
}, "scxml/SCXML": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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
        if (this.opts.printTrace) console.log("performing initial big step");
        this._configuration.add(this.model.root.initial);

        //eval top-level scripts
        //we treat these differently than other scripts. they get evaled in global scope, and without explicit scripting interface
        //this is necessary in order to, e.g., allow js function declarations that are visible to scxml script tags later.
        this.model.scripts.forEach(function(script){
            /*jsl:ignore*/
            with(this._datamodel){ this.opts.globalEval(script) };
            /*jsl:end*/
        },this);

        //initialize top-level datamodel expressions. simple eval
        for(var k in this._datamodel){
            var v = this._datamodel[k];
            if (typeof v === 'string') this._datamodel[k] = eval("(" + v + ")");
        }
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

        if (this.opts.printTrace) console.log("selecting transitions with eventSet: ", eventSet);

        var selectedTransitions = this._selectTransitions(eventSet, datamodelForNextStep);

        if (this.opts.printTrace) console.log("selected transitions: ", selectedTransitions);

        if (!selectedTransitions.isEmpty()) {

            if (this.opts.printTrace) console.log("sorted transitions: ", selectedTransitions);

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.TransitionSet(selectedTransitions.iter().filter(function(t){return t.targets;}));

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

            statesExited.forEach(function(state){

                if (this.opts.printTrace) console.log("exiting ", state);

                //invoke listeners
                this._listeners.forEach(function(l){
                   l.onExit(state.id); 
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

            if (this.opts.printTrace) console.log("executing transitition actions");


            sortedTransitions.forEach(function(transition){

                this._listeners.forEach(function(l){
                   l.onTransition(transition.source.id,transition.targets.map(function(target){return target.id;})); 
                });

                transition.actions.forEach(function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);
            },this);
 
            if (this.opts.printTrace) console.log("executing state enter actions");

            statesEntered.forEach(function(state){

                this._listeners.forEach(function(l){
                   l.onEntry(state.id); 
                });

                state.onentry.forEach(function(action){
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
        var _constructEventData = (function(){
            var data = {};

            if(action.content){
                //content
                data = action.content;
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
            return t.evaluateCondition.call(this.opts.evaluationContext, n.getData, n.setData, n.In, n.events, this._datamodel);
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
                    inconsistentTransitionsPairs.iter().map(function(t){return this.opts.priorityComparisonFn(t);},this));

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
        var t1LCA = t1.targets ? t1.lca : t1.source;
        var t2LCA = t2.targets ? t2.lca : t2.source;
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
        return this._listeners.splice(this._listeners.indexOf(listener),1);
    }

};


//TODO: figure out how to do the kind of simple object-orientation we need
function SimpleInterpreter(model, opts) {

    this._isStepping = false;

    this._send = opts.send || this._send;

    this._cancel = opts.cancel || this._cancel;

    SCXMLInterpreter.call(this,model,opts);     //call super constructor
}
SimpleInterpreter.prototype = Object.create(SCXMLInterpreter.prototype);

//extend. would be nice if we could do this using the second arg in Object.create, but this isn't portable, even with compatibility library
SimpleInterpreter.prototype.gen = function(e) {
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
};

SimpleInterpreter.prototype._send = function(event, options) {
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
};

SimpleInterpreter.prototype._cancel = function(sendid){
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
};

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
BrowserInterpreter.prototype = Object.create(SimpleInterpreter.prototype);

function NodeInterpreter(model, opts) {
    opts = opts || {};
    setupDefaultOpts(opts);
    opts.setTimeout = setTimeout;
    opts.clearTimeout = clearTimeout;

    SimpleInterpreter.call(this,model,opts);    //call super constructor
}
NodeInterpreter.prototype = Object.create(SimpleInterpreter.prototype);

module.exports = {
    SCXMLInterpreter: SCXMLInterpreter,
    SimpleInterpreter: SimpleInterpreter,
    BrowserInterpreter: BrowserInterpreter,
    NodeInterpreter: NodeInterpreter
};
}, "scxml/default-transition-selector": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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


module.exports = function(state,eventNames,evaluator){
    return state.transitions.filter(function(t){
        return !t.event || ( eventNames.indexOf(t.event) > -1 && (!t.cond || evaluator(t)) );
    });
};
}, "scxml/json2model": function(exports, require, module) {//     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
//
//     Licensed under the Apache License, Version 2.0 (the "License");
//     you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
//             http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.

function getDelayInMs(delayString){
    if (!delayString) {
        return 0;
    } else {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else {
            return parseFloat(delayString);
        }
    }
}

function makeEvaluationFn(s, isExpression) {
    return new Function(
        "getData", 
        "setData", 
        "In", 
        "_events", 
        "datamodel", 
        "var _event = _events[0]; with(datamodel){" + (isExpression ? "return" : "") + " " + s + "}");
}

module.exports = function(json) {

    function stateIdToReference(stateId){
        return idToStateMap[stateId];
    }

    var idToStateMap = {};
    json.states.forEach(function(state){
        idToStateMap[state.id] = state;
    });

    json.transitions.forEach(function(transition){
        transition.evaluateCondition = makeEvaluationFn(transition.cond,true);
    });

    json.states.forEach(function(state){
        state.transitions = state.transitions.map(function(transitionNum){ return json.transitions[transitionNum];});

        var actions = state.onentry.concat(state.onexit);

        state.transitions.forEach(function(transition){
            transition.actions.forEach(function(action){
                actions.push(action);
            });

            if(transition.lca){
                transition.lca = idToStateMap[transition.lca];
            }
        });

        actions.forEach(function(action){
            switch (action.type) {
                case "script":
                    action.evaluate = makeEvaluationFn(action.script);
                    break;
                case "assign":
                    action.evaluate = makeEvaluationFn(action.expr, true);
                    break;
                case "send":
                    ['contentexpr', 'eventexpr', 'targetexpr', 'typeexpr', 'delayexpr'].
                        filter(function(attributeName){return action[attributeName];}).
                        forEach(function(attributeName){
                            action[attributeName] = {
                                evaluate: makeEvaluationFn(action[attributeName], true)
                            };
                        });

                    action.params.forEach(function(param){
                        if (param.expr) {
                            param.expr = {
                                evaluate: makeEvaluationFn(param.expr, true)
                            };
                        }
                    });
                    break;
                case "log":
                    action.evaluate = makeEvaluationFn(action.expr, true);
                    break;
                default : break;
            }

            if (action.type === "send" && action.delay) {
                action.delay = getDelayInMs(action.delay);
            }
             
        });

        state.initial = idToStateMap[state.initial];
        state.history = idToStateMap[state.history];
        
        state.children = state.children.map(stateIdToReference);

        state.parent = idToStateMap[state.parent];

        if (state.ancestors) {
            state.ancestors = state.ancestors.map(stateIdToReference);
        }

        if (state.descendants) {
            state.descendants = state.descendants.map(stateIdToReference);
        }

        state.transitions.forEach(function(t){
            t.source = idToStateMap[t.source];
            t.targets = t.targets && t.targets.map(stateIdToReference);
        });
    });

    json.root = idToStateMap[json.root];

    return json;
};

}, "scxml/model": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

var stateKinds = require('./state-kinds-enum');

module.exports = {
    getAncestors: function(s, root) {
        var ancestors, index, state;
        index = s.ancestors.indexOf(root);
        if (index > -1) {
            return s.ancestors.slice(0, index);
        } else {
            return s.ancestors;
        }
    },
    getAncestorsOrSelf: function(s, root) {
        return [s].concat(this.getAncestors(s, root));
    },
    getDescendantsOrSelf: function(s) {
        return [s].concat(s.descendants);
    },
    isOrthogonalTo: function(s1, s2) {
        //Two control states are orthogonal if they are not ancestrally
        //related, and their smallest, mutual parent is a Concurrent-state.
        return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).kind === stateKinds.PARALLEL;
    },
    isAncestrallyRelatedTo: function(s1, s2) {
        //Two control states are ancestrally related if one is child/grandchild of another.
        return this.getAncestorsOrSelf(s2).indexOf(s1) > -1 || this.getAncestorsOrSelf(s1).indexOf(s2) > -1;
    },
    getLCA: function(s1, s2) {
        var commonAncestors = this.getAncestors(s1).filter(function(a){
            return a.descendants.indexOf(s2) > -1;
        },this);
        return commonAncestors[0];
    }
};

}, "scxml/scxml-dynamic-name-match-transition-selector": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

var eventNameReCache = {};

function eventNameToRe(name) {
    return new RegExp("^" + (name.replace(/\./g, "\\.")) + "(\\.[0-9a-zA-Z]+)*$");
}

function retrieveEventRe(name) {
    return eventNameReCache[name] ? eventNameReCache[name] : eventNameReCache[name] = eventNameToRe(name);
}

function nameMatch(t, eventNames) {
    var tEvents = t.events;
    var f = 
        tEvents.indexOf("*") > -1 ? 
            function() { return true; } : 
            function(name) {
                return tEvents.filter(function(tEvent){
                    return retrieveEventRe(tEvent).test(name);
                }).length;
            };
    return eventNames.filter(f).length;
}

module.exports = function(state, eventNames, evaluator) {
    return state.transitions.filter(function(t){
        return (!t.events || nameMatch(t,eventNames)) && (!t.cond || evaluator(t));
    });
};
}, "scxml/set/ArraySet": function(exports, require, module) {//     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
//
//     Licensed under the Apache License, Version 2.0 (the "License");
//     you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
//             http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.

module.exports = function(l) {
    l = l || [];
    this.o = [];
        
    l.forEach(function(x){
        this.add(x);
    },this);
};

module.exports.prototype = {

    add : function(x) {
        if (!this.contains(x)) return this.o.push(x);
    },

    remove : function(x) {
        var i = this.o.indexOf(x);
        if(i === -1){
            return false;
        }else{
            this.o.splice(i, 1);
        }
        return true;
    },

    union : function(l) {
        l = l.iter ? l.iter() : l;
        l.forEach(function(x){
            this.add(x);
        },this);
        return this;
    },

    difference : function(l) {
        l = l.iter ? l.iter() : l;

        l.forEach(function(x){
            this.remove(x);
        },this);
        return this;
    },

    contains : function(x) {
        return this.o.indexOf(x) > -1;
    },

    iter : function() {
        return this.o;
    },

    isEmpty : function() {
        return !this.o.length;
    },

    equals : function(s2) {
        var l2 = s2.iter();
        var l1 = this.o;

        return l1.every(function(x){
            return l2.indexOf(x) > -1;
        }) && l2.every(function(x){
            return l1.indexOf(x) > -1;
        });
    },

    toString : function() {
        return "Set(" + this.o.toString() + ")";
    }
};
}, "scxml/setup-default-opts": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

var selector = require('./scxml-dynamic-name-match-transition-selector'),
    ArraySet = require('./set/ArraySet'),
    m = require('./model');

module.exports = function(opts) {
    opts = opts || {};
    opts.TransitionSet = opts.TransitionSet || ArraySet;
    opts.StateSet = opts.StateSet || ArraySet;
    opts.BasicStateSet = opts.BasicStateSet || ArraySet;
    opts.transitionSelector = opts.transitionSelector || selector;
    opts.model = opts.model || m;
    return opts;
};

}, "scxml/state-kinds-enum": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

module.exports = {
    BASIC: 0,
    COMPOSITE: 1,
    PARALLEL: 2,
    HISTORY: 3,
    INITIAL: 4,
    FINAL: 5
};
}, "util/annotate-scxml-json": function(exports, require, module) {
/*
     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
*/

/*
This file transforms an SCXML document converted to JsonML so that it is easier for a JavaScript-based SCXML interpreter to parse and interpret.
*/

/*
Example SCXML document basic1.scxml stripped of whitespace and converted to JsonML.

[
        "scxml", 
        {
                "id": "root", 
                "profile": "ecmascript", 
                "version": "1.0"
        }, 
        [
                "initial", 
                {
                        "id": "intitial1"
                }, 
                [
                        "transition", 
                        {
                                "target": "a"
                        }
                ]
        ], 
        [
                "state", 
                {
                        "id": "a"
                }, 
                [
                        "transition", 
                        {
                                "event": "t", 
                                "target": "b"
                        }
                ]
        ], 
        [
                "state", 
                {
                        "id": "b"
                }
        ]
]
*/

var stateKinds = require("../scxml/state-kinds-enum");

var STATES_THAT_CAN_BE_CHILDREN = ["state", "parallel", "history", "final", "initial"],
    STATE_TAGS = STATES_THAT_CAN_BE_CHILDREN.concat("scxml");

var states, basicStates, uniqueEvents, transitions, idToStateMap, onFoundStateIdCallbacks, datamodel;

var transformAndSerialize = exports.transformAndSerialize = transformAndSerialize = function(root) {
    return JSON.stringify(transform(root));
};

var transform = exports.transform = function(root) {
    states = [];
    basicStates = [];
    uniqueEvents = {};
    transitions = [];
    idToStateMap = {};
    onFoundStateIdCallbacks = [];
    datamodel = {};

    var rootState = transformStateNode(root, []);

    var tuple = deconstructNode(root), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];

    states.forEach(function(state){
        state.ancestors.reverse();
    });

    states.forEach(function(state){
        state.descendants.reverse();
    });

    transitions.filter(function(t){return t.targets;}).forEach(function(transition){
        var source = idToStateMap[transition.source];
        var targets = transition.targets.map(function(target){return idToStateMap[target];});

        if (!source) {
            throw new Error("source missing");
        } else if (!targets.length) {
            throw new Error("target missing");
        }

        transition.lca = getLCA(source, targets[0]);
    });

    return {
        states: states,
        transitions: transitions,
        root: rootState.id,
        events: genEventsEnum(uniqueEvents),
        scripts: genRootScripts(children),
        profile: attributes.profile,
        version: attributes.version,
        datamodel: datamodel
    };
};

function genRootScripts(rootChildren) {
    var toReturn = [];
    rootChildren.forEach(function(child){

        var tuple = deconstructNode(child), 
            tagName = tuple[0], 
            attributes = tuple[1], 
            grandChildren = tuple[2];

        if (tagName === "script") {
            toReturn.push.apply(toReturn,
                grandChildren.filter(
                    function(scriptNode){return typeof scriptNode === "string";}));
        }
    });
    return toReturn;
}

function genEventsEnum(uniqueEvents) {
    var event, eventDocumentOrder, toReturn;
    eventDocumentOrder = 0;
    toReturn = {};
    for (event in uniqueEvents) {
        toReturn[event] = {
            name: event,
            documentOrder: eventDocumentOrder++
        };
    }
    return toReturn;
}

function deconstructNode(node, filterText) {
    var attributes, child, children, n1, tagName;
    tagName = node[0];
    n1 = node[1];
    if (n1 && typeof n1 === "object" && !(Array.isArray(n1) || typeof n1 === "string")) {
        attributes = n1;
        children = node.slice(2);
    } else {
        attributes = {};
        children = node.slice(1);
    }
    if (filterText) {
        children = children.filter(function(child){return typeof child !== "string";});
    }
    return [tagName, attributes, children];
}

var stripStarFromEventNameRe = /^((([_a-zA-Z0-9]+)\.)*([_a-zA-Z0-9]+))(\.\*)?$/;

function transformTransitionNode (transitionNode, parentState) {

    var tuple = deconstructNode(transitionNode, true), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];

    //wildcard "*" event will show up on transition.events, but will not show up in uniqueEvents
    //default transitions (those without events) will have events set to undefined (rather than empty array)
    if (attributes.event) {
        var events;

        if (attributes.event === "*") {
            events = [attributes.event];
        } else {
            events = attributes.event.trim().split(/\s+/).map(function(event){
                var m = event.match(stripStarFromEventNameRe);
                if (m) {
                    var normalizedEvent = m[1];
                    if (!(m && normalizedEvent)) {
                        throw new Error("Unable to parse event: " + event);
                    }else{
                        return normalizedEvent;
                    } 
                }
            });
        }

        events.
            filter(function(event){return event !== "*";}).
            forEach(function(event){uniqueEvents[event] = true;});

    }

    var transition = {
        documentOrder: transitions.length,
        id: transitions.length,
        source: parentState.id,
        cond: attributes.cond,
        events: events,
        actions: children.map(function(child){return transformActionNode(child);}),
        targets: attributes && attributes.target && attributes.target.trim().split(/\s+/)
    };
    transitions.push(transition);

    //set up LCA later
    
    return transition;
}

function processParam(param) {
    var tuple = deconstructNode(param), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];
    return {
        name: attributes.name,
        expr: attributes.expr,
        location: attributes.location
    };
}

function transformActionNode(node) {
    var tuple = deconstructNode(node), tagName = tuple[0], attributes = tuple[1], children = tuple[2];

    switch (tagName) {
        case "if":
            return {
                "type": "if",
                "cond": attributes.cond,
                "actions": children.map(function(child){return transformActionNode(child);})
            };
        case "elseif":
            return {
                "type": "elseif",
                "cond": attributes.cond,
                "actions": children.map(function(child){return transformActionNode(child);})
            };
        case "else":
            return {
                "type": "else",
                "actions": children.map(function(child){return transformActionNode(child);})
            };
        case "log":
            return {
                "type": "log",
                "expr": attributes.expr,
                "label": attributes.label
            };
        case "script":
            return {
                "type": "script",
                "script": children.join("\n")
            };
        case "send":
            return {
                "type": "send",
                "sendType": attributes.type,
                "delay": attributes.delay,
                "id": attributes.id,
                "event": attributes.event,
                "target": attributes.target,
                "idlocation": attributes.idlocation,
                //data
                "namelist": attributes && attributes.namelist && attributes.namelist.trim().split(/ +/),
                "params": children.filter(function(child){return child[0] === 'param';}).map(function(child){return processParam(child);}),
                "content": children.filter(function(child){return child[0] === 'content';}).map(function(child){return deconstructNode(child)[2][0];})[0],
                //exprs
                "eventexpr": attributes.eventexpr,
                "targetexpr": attributes.targetexpr,
                "typeexpr": attributes.typeexpr,
                "delayexpr": attributes.delayexpr
            };
        case "cancel":
            return {
                "type": "cancel",
                "sendid": attributes.sendid
            };
        case "assign":
            return {
                "type": "assign",
                "location": attributes.location,
                "expr": attributes.expr
            };
        case "raise":
            return {
                "type": "raise",
                "event": attributes.event
            };
        case "invoke":
            throw new Error("Element " + tagName + " not yet supported");
            return null;
        case "finalize":
            throw new Error("Element " + tagName + " not yet supported");
            return null;
        default : 
            return null;
    }
}

function transformDatamodel(node, ancestors) {
    var tuple = deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];

    children.filter(function(child){return child[0] === 'data';}).forEach(function(child){
        var tuple = deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        if (childAttributes.id) {
            datamodel[childAttributes.id] = childAttributes.expr || null;
        }
    });
}

function transformStateNode(node, ancestors) {
    var tuple = deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];
    var id = (attributes && attributes.id) || genId(tagName);
    var kind; 

    switch (tagName) {
        case "state":
            if( children.filter(function(child){return STATE_TAGS.indexOf(child[0]) > -1;}).length){
                kind = stateKinds.COMPOSITE;
            } else {
                kind = stateKinds.BASIC;
            }
            break;
        case "scxml":
            kind = stateKinds.COMPOSITE;
            break;
        case "initial":
            kind = stateKinds.INITIAL;
            break;
        case "parallel":
            kind = stateKinds.PARALLEL;
            break;
        case "final":
            kind = stateKinds.FINAL;
            break;
        case "history":
            kind = stateKinds.HISTORY;
            break;
        default : break;
    }
    var state = {
        id: id,
        kind: kind,
        descendants: []
    };
    idToStateMap[id] = state;
    if (ancestors.length) state.parent = ancestors[ancestors.length - 1];
    if (kind === stateKinds.HISTORY) {
        state.isDeep = attributes.type === "deep" ? true : false;
    }
    state.documentOrder = states.length;
    states.push(state);
    if (kind === stateKinds.BASIC || kind === stateKinds.INITIAL || kind === stateKinds.HISTORY) {
        state.basicDocumentOrder = basicStates.length;
        basicStates.push(state);
    }
    state.depth = ancestors.length;
    state.ancestors = ancestors.slice();

    //walk back up ancestors and add this state to lists of descendants
    ancestors.forEach(function(anc){
        idToStateMap[anc].descendants.push(state.id);
    });

    //need to do some work on his children
    var onExitChildren = [];
    var onEntryChildren = [];
    var transitionChildren = [];
    var stateChildren = [];

    var nextAncestors = ancestors.concat(state.id);

    var processedInitial = false;
    var firstStateChild = null;

    var processInitialState = function(initialState) {
        var child = transformStateNode(initialState, nextAncestors);
        state.initial = child.id;
        stateChildren.push(child);
        return processedInitial = true;
    };

    children.filter(function(child){return Array.isArray(child);}).forEach(function(child){

        var tuple = deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        switch (childTagName) {
            case "transition":
                transitionChildren.push(transformTransitionNode(child, state));
                break;
            case "onentry":
                childChildren.forEach(function(actionNode){
                    onEntryChildren.push(transformActionNode(actionNode));
                });
                break;
            case "onexit":
                childChildren.forEach(function(actionNode){
                    onExitChildren.push(transformActionNode(actionNode));
                });
                break;
            case "initial":
                if (!processedInitial) {
                    processInitialState(child);
                } else {
                    throw new Error("Encountered duplicate initial states in state " + state.id);
                }
                break;
            case "history":
                var c = transformStateNode(child, nextAncestors);
                state.history = c.id;
                stateChildren.push(c);
                break;
            case "datamodel":
                transformDatamodel(child, nextAncestors);
                break;
            default:
                if(STATES_THAT_CAN_BE_CHILDREN.indexOf(childTagName) > -1){
                    var transformedStateNode = transformStateNode(child, nextAncestors);
                    //this is used to set default initial state, if initial state is not specified
                    if (firstStateChild === null) firstStateChild = transformedStateNode;
                    stateChildren.push(transformedStateNode);
                }
                break;
        }

    });

    if (!processedInitial && tagName !== "parallel") {
        var hasInitialAttribute = attributes && attributes.initial; 

        //create a fake initial state and process him
        function generateFakeInitialState(targetId) {
            var fakeInitialState;
            fakeInitialState = [
                "initial", [
                    "transition", {
                        target: targetId
                    }
                ]
            ];
            return processInitialState(fakeInitialState);
        }

        if (hasInitialAttribute) {
            generateFakeInitialState(attributes.initial);
        } else {
            if (firstStateChild) generateFakeInitialState(firstStateChild.id);
        }
    }

    state.onexit = onExitChildren;
    state.onentry = onEntryChildren;
    state.transitions = transitionChildren.map(function(transition){return transition.documentOrder;});
    state.children = stateChildren.map(function(child){return child.id;});

    return state;
}

var idRoot = "$generated";

var idCounter = {};

function genId(tagName) {
    idCounter[tagName] = idCounter[tagName] || 0;
    return "" + idRoot + "-" + tagName + "-" + (idCounter[tagName]++);
}

function getLCA(s1, s2) {
    var a, anc, commonAncestors, _i, _len, _ref, _ref2;
    commonAncestors = [];
    s1.ancestors.forEach(function(a){
        anc = idToStateMap[a];
        if(anc.descendants.indexOf(s2.id) > -1){
            commonAncestors.push(a);
        }
    });
    if(!commonAncestors.length) throw new Error("Could not find LCA for states.");
    return commonAncestors[0];
}

if (require.main === module) {
    var inFile = process.argv[2];
    var outFile = process.argv[3];
    function go(jsonStr) {
        var fs, s, scxmlJson;
        scxmlJson = JSON.parse(jsonStr);
        s = transformAndSerialize(scxmlJson, true, true, true, true);
        if (outFile === "-") {
            return process.stdout.write(s);
        } else {
            fs = require('fs');
            return fs.writeFileSync(outFile, s, 'utf-8');
        }
    }
    if (!inFile || inFile === "-") {
        process.stdin.resume();
        process.stdin.setEncoding("utf-8");
        var json = "";
        process.stdin.on("data", function(data) {
            return json += data;
        });
        process.stdin.on("end", function() {
            return go(json);
        });
    } else {
        var fs = require('fs');
        var str = fs.readFileSync(inFile, 'utf-8');
        go(str);
    }
}
}});
