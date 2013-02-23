
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
                _.each(transition.actions,function(action){
                    this._evaluateAction(action, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
                },this);
            },this);
 
            if (this.opts.printTrace) console.log("executing state enter actions");

            _.each(statesEntered,function(state){
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

var _ = require('../util/underscore-wrapper');

module.exports = function(state,eventNames,evaluator){
    return _.filter(state.transitions,function(t){
        return !t.event || ( _.contains(eventNames,t.event) && (!t.cond || evaluator(t)) );
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

var _ = require('../util/underscore-wrapper');

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
    _.forEach(json.states,function(state){
        idToStateMap[state.id] = state;
    });

    _.forEach(json.transitions,function(transition){
        transition.evaluateCondition = makeEvaluationFn(transition.cond,true);
    });

    _.forEach(json.states,function(state){
        state.transitions = _.map(state.transitions,function(transitionNum){ return json.transitions[transitionNum];});

        var actions = state.onentry.concat(state.onexit);

        _.forEach(state.transitions,function(transition){
            _.forEach(transition.actions,function(action){
                actions.push(action);
            });

            if(transition.lca){
                transition.lca = idToStateMap[transition.lca];
            }
        });

        _.forEach(actions,function(action){
            switch (action.type) {
                case "script":
                    action.evaluate = makeEvaluationFn(action.script);
                    break;
                case "assign":
                    action.evaluate = makeEvaluationFn(action.expr, true);
                    break;
                case "send":
                    _.forEach(['contentexpr', 'eventexpr', 'targetexpr', 'typeexpr', 'delayexpr'],function(attributeName){
                        if (action[attributeName]) {
                            action[attributeName] = {
                                evaluate: makeEvaluationFn(action[attributeName], true)
                            };
                        }
                    });

                    _.forEach(action.params,function(param){
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
        
        state.children = _.map(state.children,stateIdToReference);

        state.parent = idToStateMap[state.parent];

        if (state.ancestors) {
            state.ancestors = _.map(state.ancestors,stateIdToReference);
        }

        if (state.descendants) {
            state.descendants = _.map(state.descendants,stateIdToReference);
        }

        _.forEach(state.transitions,function(t){
            t.source = idToStateMap[t.source];
            t.targets = t.targets && _.map(t.targets,stateIdToReference);
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

var _ = require('../util/underscore-wrapper');

var stateKinds = require('./state-kinds-enum');

module.exports = {
    getDepth: function(s) {
        var count, state;
        if (s.depth !== undefined) {
            return s.depth;
        } else {
            count = 0;
            state = s.parent;
            while (state) {
                count = count + 1;
                state = state.parent;
            }
            return count;
        }
    },
    getAncestors: function(s, root) {
        var ancestors, index, state;
        if (s.ancestors) {
            if (_.contains(s.ancestors,root)) {
                return s.ancestors.slice(0, index);
            } else {
                return s.ancestors;
            }
        } else {
            ancestors = [];
            state = s.parent;
            while (state && !(state === root)) {
                ancestors.push(state);
                state = state.parent;
            }
            return ancestors;
        }
    },
    getAncestorsOrSelf: function(s, root) {
        return [s].concat(this.getAncestors(s, root));
    },
    getDescendants: function(s) {
        var child, descendants, queue, state, _i, _len, _ref;
        if (s.descendants) {
            return s.descendants;
        } else {
            descendants = [];
            queue = s.children.slice();
            while (queue.length) {
                state = queue.shift();
                descendants.push(state);
                queue.push.apply(queue,state.children);
            }
            return descendants;
        }
    },
    getDescendantsOrSelf: function(s) {
        return [s].concat(this.getDescendants(s));
    },
    isOrthogonalTo: function(s1, s2) {
        //Two control states are orthogonal if they are not ancestrally
        //related, and their smallest, mutual parent is a Concurrent-state.
        return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).kind === stateKinds.PARALLEL;
    },
    isAncestrallyRelatedTo: function(s1, s2) {
        //Two control states are ancestrally related if one is child/grandchild of another.
        return _.contains(this.getAncestorsOrSelf(s2), s1) || _.contains(this.getAncestorsOrSelf(s1), s2);
    },
    getLCA: function(tOrS1, s2) {
        if (tOrS1.lca) {
            return tOrS1.lca;
        } else {
            //can take one or two arguments: either 1 transition, or two states
            if (arguments.length === 1) {
                var transition = tOrS1;
                return this.getLCA(transition.source, transition.targets[0]);
            } else {
                var s1 = tOrS1;
                var commonAncestors = _.filter(this.getAncestors(s1),_.bind(function(a){
                    return _.contains(this.getDescendants(a),s2);
                },this));
                return commonAncestors[0];
            }
        }
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

var _ = require('../util/underscore-wrapper');

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
        _.contains(tEvents, "*") ? 
            function() { return true; } : 
            function(name) {
                return _(tEvents).filter(function(tEvent){
                    return retrieveEventRe(tEvent).test(name);
                }).length;
            };
    return _(eventNames).filter(f).length;
}

module.exports = function(state, eventNames, evaluator) {
    return _(state.transitions).filter(function(t){
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

var _ = require('../../util/underscore-wrapper');

module.exports = function(l) {
    l = l || [];
    this.o = [];
        
    _.each(l,function(x){
        this.add(x);
    },this);
};

//TODO: delegate to underscore's union and difference
module.exports.prototype = {

    add : function(x) {
        if (!this.contains(x)) return this.o.push(x);
    },

    remove : function(x) {
        var i = _.indexOf(this.o,x);
        if(i === -1){
            return false;
        }else{
            this.o.splice(i, 1);
        }
        return true;
    },

    union : function(l) {
        l = l.iter ? l.iter() : l;
        _.each(l,function(x){
            this.add(x);
        },this);
        return this;
    },

    difference : function(l) {
        l = l.iter ? l.iter() : l;

        _.each(l,function(x){
            this.remove(x);
        },this);
        return this;
    },

    contains : function(x) {
        return _.indexOf(this.o, x) >= 0;
    },

    iter : function() {
        return this.o;
    },

    isEmpty : function() {
        return !this.o.length;
    },

    equals : function(s2) {
        var l2 = s2.iter();

        return _.difference(this.o,l2).length === 0;
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

var _ = require('./underscore-wrapper');

var stateKinds = require("../scxml/state-kinds-enum");

var STATES_THAT_CAN_BE_CHILDREN = ["state", "parallel", "history", "final", "initial"],
    STATE_TAGS = STATES_THAT_CAN_BE_CHILDREN.concat("scxml");

var states, basicStates, uniqueEvents, transitions, idToStateMap, onFoundStateIdCallbacks, datamodel;

var transformAndSerialize = exports.transformAndSerialize = transformAndSerialize = function(root, genDepth, genAncestors, genDescendants, genLCA) {
    return JSON.stringify(transform(root, genDepth, genAncestors, genDescendants, genLCA));
};

var transform = exports.transform = function(root, genDepth, genAncestors, genDescendants, genLCA) {
    states = [];
    basicStates = [];
    uniqueEvents = {};
    transitions = [];
    idToStateMap = {};
    onFoundStateIdCallbacks = [];
    datamodel = {};

    var rootState = transformStateNode(root, [], genDepth, genAncestors, genDescendants, genLCA);

    var tuple = deconstructNode(root), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];

    if (genAncestors || genLCA) {
        _.forEach(states,function(state){
            state.ancestors.reverse();
        });
    }
    if (genDescendants || genLCA) {
        _.forEach(states,function(state){
            state.descendants.reverse();
        });
    }
    if (genLCA) {
        _.chain(transitions).filter(function(t){return t.targets;}).forEach(function(transition){
            var source = idToStateMap[transition.source];
            var targets = _(transition.targets).map(function(target){return idToStateMap[target];});

            if (!source) {
                throw new Error("source missing");
            } else if (!targets.length) {
                throw new Error("target missing");
            }

            transition.lca = getLCA(source, targets[0]);
        });
    }

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
    _(rootChildren).forEach(function(child){

        var tuple = deconstructNode(child), 
            tagName = tuple[0], 
            attributes = tuple[1], 
            grandChildren = tuple[2];

        if (tagName === "script") {
            _.chain(grandChildren).
                filter(function(scriptNode){return typeof scriptNode === "string";}).
                forEach(function(scriptNode){
                    toReturn.push(scriptNode);
                });
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
    if (n1 && typeof n1 === "object" && !(_.isArray(n1) || typeof n1 === "string")) {
        attributes = n1;
        children = node.slice(2);
    } else {
        attributes = {};
        children = node.slice(1);
    }
    if (filterText) {
        children = _(children).filter(function(child){return typeof child !== "string";});
    }
    return [tagName, attributes, children];
}

var stripStarFromEventNameRe = /^((([_a-zA-Z0-9]+)\.)*([_a-zA-Z0-9]+))(\.\*)?$/;

function transformTransitionNode (transitionNode, parentState, genDepth, genAncestors, genDescendants, genLCA) {

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
            events = _(attributes.event.trim().split(/\s+/)).map(function(event){
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

        _.chain(events).
            filter(function(event){return event !== "*";}).
            forEach(function(event){uniqueEvents[event] = true;});

    }

    var transition = {
        documentOrder: transitions.length,
        id: transitions.length,
        source: parentState.id,
        cond: attributes.cond,
        events: events,
        actions: _(children).map(function(child){return transformActionNode(child);}),
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
                "actions": _(children).map(function(child){return transformActionNode(child);})
            };
        case "elseif":
            return {
                "type": "elseif",
                "cond": attributes.cond,
                "actions": _(children).map(function(child){return transformActionNode(child);})
            };
        case "else":
            return {
                "type": "else",
                "actions": _(children).map(function(child){return transformActionNode(child);})
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
                "params": _.chain(children).filter(function(child){return child[0] === 'param';}).map(function(child){return processParam(child);}).value(),
                "content": _.chain(children).filter(function(child){return child[0] === 'content';}).map(function(child){return deconstructNode(child)[2][0];}).first().value(),
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

function transformDatamodel(node, ancestors, genDepth, genAncestors, genDescendants, genLCA) {
    var tuple = deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];

    _.chain(children).filter(function(child){return child[0] === 'data';}).forEach(function(child){
        var tuple = deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        if (childAttributes.id) {
            datamodel[childAttributes.id] = childAttributes.expr || null;
        }
    });
}

function transformStateNode(node, ancestors, genDepth, genAncestors, genDescendants, genLCA) {
    var tuple = deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];
    var id = (attributes && attributes.id) || genId(tagName);
    var kind; 

    switch (tagName) {
        case "state":
            if( _.chain(children).filter(function(child){return _.contains(STATE_TAGS,child[0]);}).isEmpty().value()){
                kind = stateKinds.BASIC;
            } else {
                kind = stateKinds.COMPOSITE;
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
    if (genDepth) state.depth = ancestors.length;
    if (genAncestors || genLCA) state.ancestors = ancestors.slice();
    if (genDescendants || genLCA) {
        //walk back up ancestors and add this state to lists of descendants
        _(ancestors).forEach(function(anc){
            idToStateMap[anc].descendants.push(state.id);
        });
    }

    //need to do some work on his children
    var onExitChildren = [];
    var onEntryChildren = [];
    var transitionChildren = [];
    var stateChildren = [];

    var nextAncestors = ancestors.concat(state.id);

    var processedInitial = false;
    var firstStateChild = null;

    var processInitialState = function(initialState) {
        var child = transformStateNode(initialState, nextAncestors, genDepth, genAncestors, genDescendants, genLCA);
        state.initial = child.id;
        stateChildren.push(child);
        return processedInitial = true;
    };

    _(children).filter(function(child){return _.isArray(child);}).forEach(function(child){

        var tuple = deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        switch (childTagName) {
            case "transition":
                transitionChildren.push(transformTransitionNode(child, state));
                break;
            case "onentry":
                _(childChildren).forEach(function(actionNode){
                    onEntryChildren.push(transformActionNode(actionNode));
                });
                break;
            case "onexit":
                _(childChildren).forEach(function(actionNode){
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
                var c = transformStateNode(child, nextAncestors, genDepth, genAncestors, genDescendants, genLCA);
                state.history = c.id;
                stateChildren.push(c);
                break;
            case "datamodel":
                transformDatamodel(child, nextAncestors, genDepth, genAncestors, genDescendants, genLCA);
                break;
            default:
                if(_.contains(STATES_THAT_CAN_BE_CHILDREN,childTagName)){
                    var transformedStateNode = transformStateNode(child, nextAncestors, genDepth, genAncestors, genDescendants, genLCA);
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
    state.transitions = _(transitionChildren).map(function(transition){return transition.documentOrder;});
    state.children = _(stateChildren).map(function(child){return child.id;});

    return state;
}

var idRoot = "$generated";

var idCounter = {};

function genId(tagName) {
    idCounter[tagName] = idCounter[tagName] || 0;
    return "" + idRoot + "-" + tagName + "-" + (idCounter[tagName]++);
}

function getLCA(s1, s2) {
    /*
            process.stdout.setEncoding 'utf-8'
            process.stdout.write "\ngetLCA\n"
            process.stdout.write "\ns1\n"
            process.stdout.write inspect(s1)
            process.stdout.write "\ns2\n"
            process.stdout.write inspect(s2)
    */
    var a, anc, commonAncestors, _i, _len, _ref, _ref2;
    commonAncestors = [];
    _(s1.ancestors).forEach(function(a){
        anc = idToStateMap[a];
        if(_.contains(anc.descendants,s2.id)){
            commonAncestors.push(a);
        }
    });
    if(_.isEmpty(commonAncestors)) throw new Error("Could not find LCA for states.");
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
}, "util/browser/parsePage": function(exports, require, module) {/*

This module exists to parse the SCXML from an HTML/SVG page once it's loaded.

A statechart is initialized from an XML document as follows:
1. Get the SCXML document.
2. Convert the XML to JsonML using XSLT or DOM, and parse the JSON to
    an SCXML-JSON document.
3. Annotate and transform the SCXML-JSON document so that it is in a
    form more congenial to interpretation, creating an annotated SCXML-JSON
    document
4. Convert the SCXML-JSON document to a statechart object model. This
    step essentially converts id labels to object references, parses JavaScript
    scripts and expressions embedded in the SCXML as js functions, and does some
    validation for correctness. 
5. Use the statechart object model to instantiate an instance of the
    statechart interpreter. Optionally, we can pass to the construct an object to
    be used as the context object (the 'this' object) in script evaluation. Lots of
    other parameters are available.
6. Connect relevant event listeners to the statechart instance.
7. Call the start method on the new intrepreter instance to start
    execution of the statechart.

Also note that steps 1-3 can be done ahead-of-time. The annotated
    SCXML-JSON object can be serialized as JSON and sent across the wire before
    being converted to a statechart object model in step 4. 
*/


var scion = require('../../scion'),
    _ = require('../underscore-wrapper');

module.exports = function(){

    var scxmlElements = document.getElementsByTagName("scxml");

    _(scxmlElements).forEach(function(scxml){
        console.log("scxml",scxml);

        //step 1 - get the scxml document
        var domNodeToHookUp = scxml.parentNode;
        console.log("domNodeToHookUp",domNodeToHookUp);

        //prep scxml document to transform by pulling the scxml node into its own document
        var scxmlns = "http://www.w3.org/2005/07/scxml";
        var scxmlToTransform = document.implementation.createDocument(scxmlns,"scxml",null);
        var newNode = scxmlToTransform.importNode(scxml.cloneNode(true),true);
        scxmlToTransform.replaceChild(newNode,scxmlToTransform.documentElement);
        console.log("newNode",newNode);

        //step 2 - transform scxmlToTransform to JSON
        var scxmlJson = JsonML.parseDOM(scxmlToTransform)[1];
        console.log("scxmlJson",scxmlJson);

        //step 3 - transform the parsed JSON model so it is friendlier to interpretation
        var annotatedScxmlJson = scion.annotator.transform(scxmlJson,true,true,true,true);
        console.log("annotatedScxmlJson",annotatedScxmlJson);

        //step 4 - initialize sc object model
        var model = scion.json2model(annotatedScxmlJson);
        console.log("model",model);
        
        //step 5 - instantiate statechart
        var interpreter = new scion.scxml.BrowserInterpreter(model,{evaluationContext : domNodeToHookUp});
        console.log("interpreter",interpreter);

        //step 6 - connect all relevant event listeners - maybe encoded in DOM?
        //we use DOM to allow this to be set up declaratively
        
        var scionNS ="https://github.com/jbeard4/SCION"

        if(scxml.hasAttributeNS(scionNS,"domEventsToConnect")){
            var eventsString = scxml.getAttributeNS(scionNS,"domEventsToConnect");
            var eventsToConnect = eventsString.split(/\s*,\s*/);

            _(eventsToConnect).forEach(function(eventName){
                domNodeToHookUp.addEventListener(
                    eventName,
                    function(e){
                        e.preventDefault();
                        interpreter.gen({name : eventName,data:e});
                    },
                    false);
            });
        }

        //step 7 - start statechart
        interpreter.start()
    });
};
}, "util/underscore-wrapper": function(exports, require, module) {//tiny wrapper module so that we can use underscore from CDN (better for caching)
module.exports = this._ || require('underscore');
}});
