
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
}).call(this)({"browser/browser-listener-client": function(exports, require, module) {//TODO: this will be like node-listener-client.js, except will use jquery/AJAX for its remoting
}, "browser/platform": function(exports, require, module) {var platform = {

    /** @expose */
    ajax : jQuery,   //this can be overridden

    pathSeparator : "/",

    //used in parsing

    /** @this {platform} */
    getDocumentFromUrl : function(url,cb){
        this.ajax.get(url,function(r){
            cb(null,r);
        },"xml").error(function(e){
            cb(e);
        });
    },

    parseDocumentFromString : function(str){
        return (new window.DOMParser()).parseFromString(str,"application/xml");
    },

    /** @this {platform} */
    getDocumentFromFilesystem : function(url,cb){
        this.getDocumentFromUrl(url,cb); 
    },

    //TODO: the callback is duplicate code. move this out.
    /** @this {platform} */
    getResourceFromUrl : function(url,cb){
        this.ajax.get(url,function(r){
            cb(null,r);
        }).error(function(e){
            cb(e);
        });
    },

    //used at runtime
    /** @this {platform} */
    postDataToUrl : function(url,data,cb){
        //by default, assume jQuery loaded
        this.ajax.post(url,data,function(r){
            cb(null,r);
        }).error(function(e){
            cb(e);
        });
    },

    setTimeout : function(f,d){
        return window.setTimeout(f,d);
    },

    clearTimeout : function(timeoutId){
        window.clearTimeout(timeoutId);
    }

};

module.exports = platform;
}, "core/scxml/SCXML": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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
    scxmlPrefixTransitionSelector = require('./scxml-dynamic-name-match-transition-selector'),
    platform = require('../../platform');

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

    this.opts.log = this.opts.log || platform.log;   //rely on global console if this console is undefined
    this.opts.StateIdSet = this.opts.StateIdSet || ArraySet;
    this.opts.EventSet = this.opts.EventSet || ArraySet;
    this.opts.TransitionPairSet = this.opts.TransitionPairSet || ArraySet;
    this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority(this.opts.model);

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
        if (printTrace) platform.log("performing initial big step");
        this._configuration.add(this.model.root.initial);

        //set up scope for action code embedded in the document
        var tmp = this.model.actionFactory(
            this.opts.log,
            this._cancel.bind(this),
            this._send.bind(this),
            this.opts.origin,
            this.isIn.bind(this)); 
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

        if (printTrace) platform.log("selecting transitions with eventSet: ", eventSet);

        var selectedTransitions = this._selectTransitions(eventSet, datamodelForNextStep);

        if (printTrace) platform.log("selected transitions: ", selectedTransitions);

        if (!selectedTransitions.isEmpty()) {

            if (printTrace) platform.log("sorted transitions: ", selectedTransitions);

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.TransitionSet(selectedTransitions.iter().filter(function(t){return t.targets;}));

            var exitedTuple = this._getStatesExited(selectedTransitionsWithTargets), 
                basicStatesExited = exitedTuple[0], 
                statesExited = exitedTuple[1];

            var enteredTuple = this._getStatesEntered(selectedTransitionsWithTargets), 
                basicStatesEntered = enteredTuple[0], 
                statesEntered = enteredTuple[1];

            if (printTrace) platform.log("basicStatesExited ", basicStatesExited);
            if (printTrace) platform.log("basicStatesEntered ", basicStatesEntered);
            if (printTrace) platform.log("statesExited ", statesExited);
            if (printTrace) platform.log("statesEntered ", statesEntered);

            var eventsToAddToInnerQueue = new this.opts.EventSet();

            //update history states
            if (printTrace) platform.log("executing state exit actions");

            statesExited.forEach(function(state){

                if (printTrace) platform.log("exiting ", state);

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

            if (printTrace) platform.log("executing transitition actions");


            sortedTransitions.forEach(function(transition){

                var targetIds = transition.targets && transition.targets.map(function(target){return target.id;});

                this._listeners.forEach(function(l){
                   if(l.onTransition) l.onTransition(transition.source.id,targetIds); 
                });

                if(transition.actions !== undefined) this._evaluateAction(transition.actions,eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
            },this);
 
            if (printTrace) platform.log("executing state enter actions");

            statesEntered.forEach(function(state){

                this._listeners.forEach(function(l){
                   if(l.onEntry) l.onEntry(state.id); 
                });

                if(state.onentry !== undefined) this._evaluateAction(state.onentry, eventSet, datamodelForNextStep, eventsToAddToInnerQueue);
            },this);

            if (printTrace) platform.log("updating configuration ");
            if (printTrace) platform.log("old configuration ", this._configuration);

            //update configuration by removing basic states exited, and adding basic states entered
            this._configuration.difference(basicStatesExited);
            this._configuration.union(basicStatesEntered);

            if (printTrace) platform.log("new configuration ", this._configuration);
            
            //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
            if (!eventsToAddToInnerQueue.isEmpty()) {
                if (printTrace) platform.log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                this._innerEventQueue.push(eventsToAddToInnerQueue);
            }

            if (printTrace) platform.log("updating datamodel for next small step :");
            
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
            eventsToAddToInnerQueue.add({ name: event, data : {}});
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

    /** @private */
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

        if (printTrace) platform.log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        return priorityEnabledTransitions;
    },

    /** @private */
    _selectPriorityEnabledTransitions : function(enabledTransitions) {
        var priorityEnabledTransitions = new this.opts.TransitionSet();

        var tuple = this._getInconsistentTransitions(enabledTransitions), 
            consistentTransitions = tuple[0], 
            inconsistentTransitionsPairs = tuple[1];

        priorityEnabledTransitions.union(consistentTransitions);

        if (printTrace) platform.log("enabledTransitions", enabledTransitions);
        if (printTrace) platform.log("consistentTransitions", consistentTransitions);
        if (printTrace) platform.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
        if (printTrace) platform.log("priorityEnabledTransitions", priorityEnabledTransitions);
        
        while (!inconsistentTransitionsPairs.isEmpty()) {
            enabledTransitions = new this.opts.TransitionSet(
                    inconsistentTransitionsPairs.iter().map(function(t){return this.opts.priorityComparisonFn(t);},this));

            tuple = this._getInconsistentTransitions(enabledTransitions);
            consistentTransitions = tuple[0]; 
            inconsistentTransitionsPairs = tuple[1];

            priorityEnabledTransitions.union(consistentTransitions);

            if (printTrace) platform.log("enabledTransitions", enabledTransitions);
            if (printTrace) platform.log("consistentTransitions", consistentTransitions);
            if (printTrace) platform.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
            if (printTrace) platform.log("priorityEnabledTransitions", priorityEnabledTransitions);
            
        }
        return priorityEnabledTransitions;
    },

    /** @private */
    _getInconsistentTransitions : function(transitions) {
        var allInconsistentTransitions = new this.opts.TransitionSet();
        var inconsistentTransitionsPairs = new this.opts.TransitionPairSet();
        var transitionList = transitions.iter();

        if (printTrace) platform.log("transitions", transitionList);

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
        var t1LCA = t1.targets ? t1.lca : t1.source;
        var t2LCA = t2.targets ? t2.lca : t2.source;
        var isOrthogonal = this.opts.model.isOrthogonalTo(t1LCA, t2LCA);

        if (printTrace) {
            platform.log("transition LCAs", t1LCA.id, t2LCA.id);
            platform.log("transition LCAs are orthogonal?", isOrthogonal);
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
        return this._listeners.splice(this._listeners.indexOf(listener),1);
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
    if (platform.setTimeout) {
        if (printTrace) {
            platform.log("sending event", event.name, "with content", event.data, "after delay", options.delay);
        }
        callback = function() {
            return _this.gen(event);
        };
        timeoutId = platform.setTimeout(callback, options.delay);
        if (options.sendid) return this._timeoutMap[options.sendid] = timeoutId;
    } else {
        throw new Error("setTimeout function not set");
    }
};

/** @private */
SimpleInterpreter.prototype._cancel = function(sendid){
    if (platform.clearTimeout) {
        if (sendid in this._timeoutMap) {
            if (printTrace) {
                platform.log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
            }
            return platform.clearTimeout(this._timeoutMap[sendid]);
        }
    } else {
        throw new Error("clearTimeout function not set");
    }
};

module.exports = {
    SCXMLInterpreter: SCXMLInterpreter,
    SimpleInterpreter: SimpleInterpreter
};
}, "core/scxml/default-transition-selector": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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
}, "core/scxml/json2model": function(exports, require, module) {//     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

//this creates the string which declares the datamodel in the document scope
function makeDatamodelDeclaration(datamodel){
    var s = "var ";
    var vars = [];
    for(var id in datamodel){
        var expr = datamodel[id];
        vars.push(expr ? id + " = " + expr : id);
    }
    return vars.length ? s + vars.join(", ") + ";" : "";
}

//this exposes a getter and setter API on the datamodel in the document scope
function makeDatamodelClosures(datamodel){
    var vars = [];
    for(var id in datamodel){
        vars.push( '"' + id + '" : {\n' + 
            '"set" : function(v){ return ' + id + ' = v; },\n' + 
            '"get" : function(){ return ' + id + ';}' + 
        '\n}');
    }
    return '{\n' + vars.join(',\n') + '\n}';
}

//this function ensures that the code in each SCXML document will run in "document scope".
//SCXML embeds js code as strings in the document, hence the use of "eval" to dynamically evaluate things.
//This function ensures that eval() is only called once, when the model is parsed. It will not be called during execution of the statechart.
//However, each SCXML interpreter instance will have its own copies of the functions declared in the document. 
//This is similar to the way HTML works - each page has its own copies of evaluated scripts.
function makeActionFactory(topLevelScripts,actionStrings,datamodel){
    var fnBody = makeDatamodelDeclaration(datamodel) + 
                (topLevelScripts.length ? topLevelScripts.join("\n") : "") + 
                "return {\n" + 
                    "datamodel:" +  makeDatamodelClosures(datamodel) + "," + 
                    "actions:[\n" + actionStrings.join(",\n") + "\n]" +   //return all functions which get called during execution
                "\n};";

    //JScript doesn't return functions from evaled function expression strings, 
    //so we wrap it here in a trivial self-executing function which gets evaled
    var fnStr = "(function(){\nreturn function($log,$cancel,$send,$origin,In){\n" + fnBody + "\n};\n})()";
    //console.log(fnStr); 
    return eval(fnStr); 
}

module.exports = function(json) {

    function makeEvaluationFn(action,isExpression){
        return actionStrings.push( "function(getData,setData,_events,$raise){var _event = _events[0];\n" +
            (isExpression ? "return" : "") + " " + action + 
        "\n}" ) - 1;

    }

    function stateIdToReference(stateId){
        return idToStateMap[stateId];
    }

    var actionStrings = [];
    var idToStateMap = {};
    json.states.forEach(function(state){
        idToStateMap[state.id] = state;
    });

    json.transitions.forEach(function(transition){
        if(transition.cond) transition.conditionActionRef = makeEvaluationFn(transition.cond,true);
    });

    json.states.forEach(function(state){
        state.transitions = state.transitions.map(function(transitionNum){ return json.transitions[transitionNum];});

        var actions = [];

        if(state.onentry) state.onentry = makeEvaluationFn(state.onentry); 
        if(state.onexit) state.onexit = makeEvaluationFn(state.onexit);

        state.transitions.forEach(function(transition){
            if(transition.actions) transition.actions = makeEvaluationFn(transition.actions);

            if(transition.lca){
                transition.lca = idToStateMap[transition.lca];
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

    json.actionFactory = makeActionFactory(json.scripts,actionStrings,json.datamodel); 

    return json;
};

}, "core/scxml/model": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

var model = {
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
        return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).kind === stateKinds.PARALLEL;
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

module.exports = model;
}, "core/scxml/scxml-dynamic-name-match-transition-selector": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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
}, "core/scxml/set/ArraySet": function(exports, require, module) {//     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

/** @constructor */
function ArraySet(l) {
    l = l || [];
    this.o = [];
        
    l.forEach(function(x){
        this.add(x);
    },this);
}

ArraySet.prototype = {

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

module.exports = ArraySet;
}, "core/scxml/setup-default-opts": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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

}, "core/scxml/state-kinds-enum": function(exports, require, module) {//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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
}, "core/util/action-code-generator": function(exports, require, module) {//this model handles code generation for action code
//it should be possible to extend this to support custom actions

var util = require('./jsonml');

function generateCode(actions){
    return actions.map(_generateCode).join("\n;;\n");
}

function _generateCode(action){
    var tuple = util.deconstructNode(action), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];

    var generator = codeGenerators[tagName];

    if(!generator) throw new Error("Element " + tagName + " not yet supported");

    return generator(attributes,children); 
}

var codeGenerators = {
    "script" : function(attributes,children){
        return children.join("\n;;\n");
    },

    "assign" : function(attributes,children){
        return attributes.location + " = " + attributes.expr + ";";
    },

    "if" : function(attributes,children){
        var s = "";
        s += "if(" + attributes.cond + "){\n";

        for(var i = 0; i < children.length; i++){
            var child = children[i];

            if(child[0] === "elseif" || child[0] === "else"){ 
                break;
            }else if(Array.isArray(child)){
                s += _generateCode(child) + "\n;;\n";
            }
        }

        //process if/else-if, and recurse
        for(; i < children.length; i++){
            child = children[i];

            if(child[0] === "elseif"){
                s+= "}else if(" + child[1].cond + "){\n";
            }else if(child[0] === "else"){
                s += "}";
                break;
            }else if(Array.isArray(child)){
                s+= _generateCode(child)  + "\n;;\n";
            }
        }

        for(; i < children.length; i++){
            child = children[i];

            //this should get encountered first
            if(child[0] === "else"){
                s+= "else{\n";
            }else if(Array.isArray(child)){
                s+= _generateCode(child)  + "\n;;\n";
            }
        }
        s+= "}";

        return s;
    },

    "elseif" : function(){
        throw new Error("Encountered unexpected elseif tag.");
    },

    "else" : function(){
        throw new Error("Encountered unexpected else tag.");
    },

    "log" : function(attributes,children){
        var params = [];

        if(attributes.label) params.push( JSON.stringify(attributes.label));
        if(attributes.expr) params.push( attributes.expr);

        return "$log(" + params.join(",") + ");";
    },

    "raise" : function(attributes,children){
        return "$raise(" + JSON.stringify(attributes.event) + ");";
    },

    "cancel" : function(attributes,children){
        return "$cancel(" + JSON.stringify(attributes.sendid) + ");";
    },

    "send" : function(attributes,children){
        return "$send({\n" + 
            "target: " + (attributes.targetexpr ? attributes.targetexpr : JSON.stringify(attributes.target)) + ",\n" +
            "name: " + (attributes.eventexpr ? attributes.eventexpr : JSON.stringify(attributes.event)) + ",\n" + 
            "type: " + (attributes.typeexpr ? attributes.typeexpr : JSON.stringify(attributes.type)) + ",\n" +
            "data: " + constructSendEventData(attributes,children) + ",\n" +
            "origin: $origin\n" +
        "}, {\n" + 
            "delay: " + (attributes.delayexpr ? attributes.delayexpr : getDelayInMs(attributes.delay)) + ",\n" + 
            "sendId: " + (attributes.idlocation ? attributes.idlocation : JSON.stringify(attributes.id)) + "\n" + 
        "});";
    },

    "foreach" : function(attributes,children){
        var isIndexDefined = attributes.index,
            index = attributes.index || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
            item = attributes.item,
            arr = attributes.array;

        return "(function(){\n" + 
            "for(" + (isIndexDefined  ? "" : "var " + index + " = 0") + "; " + index + " < " + arr + ".length; " + index + "++){\n" + 
                item + " = " + arr + "[" + index + "];\n" + 
                children.filter(Array.isArray).map(_generateCode).join("\n;;\n") + 
            "\n}\n" + 
        "})();";
    }
};

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

function constructSendEventData(attributes,children){

    var namelist = attributes && attributes.namelist && attributes.namelist.trim().split(/ +/),
        params = children.filter(function(child){return child[0] === 'param';}).map(function(child){return processParam(child);}),
        content = children.filter(function(child){return child[0] === 'content';}).map(function(child){return util.deconstructNode(child)[2][0];})[0];

    if(content){
        return JSON.stringify(content);
    }else if(attributes.contentexpr){
        return attributes.contentexpr;
    }else{
        var s = "{";
        //namelist
        if(namelist){
            namelist.forEach(function(name){
                s += '"' + name + '"' + ":" + name + ",\n";
            });
        }

        //params
        if(params){
            params.forEach(function(param){
                if(param.expr){
                    s += '"' + param.name + '"' + ":" + param.expr + ",\n";
                }else if(param.location){
                    s += '"' + param.name + '"' + ":" + param.location + ",\n";
                }
            });
        }

        s += "}";
        return s;
    }
}

function processParam(param) {
    var tuple = util.deconstructNode(param), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];
    return {
        name: attributes.name,
        expr: attributes.expr,
        location: attributes.location
    };
}


module.exports = {
    generateCode : generateCode,
    codeGenerators : codeGenerators 
};
}, "core/util/annotate-scxml-json": function(exports, require, module) {
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

var util = require('./jsonml'),
    codeGen = require('./action-code-generator');

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

    var tuple = util.deconstructNode(root), 
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

        var tuple = util.deconstructNode(child), 
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


var stripStarFromEventNameRe = /^((([^.]+)\.)*([^.]+))(\.\*)?$/;

function transformTransitionNode (transitionNode, parentState) {

    var tuple = util.deconstructNode(transitionNode, true), 
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

        if(events.indexOf(undefined) > -1){
            throw new Error("Error parsing event attribute attributes.event");
        }
    }

    var transition = {
        documentOrder: transitions.length,
        id: transitions.length,
        source: parentState.id,
        cond: attributes.cond,
        events: events,
        targets: attributes && attributes.target && attributes.target.trim().split(/\s+/)
    };

    if(children.length) transition.actions = codeGen.generateCode(children);

    transitions.push(transition);

    //set up LCA later
    
    return transition;
}

function transformDatamodel(node, ancestors) {
    var tuple = util.deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];

    children.filter(function(child){return child[0] === 'data';}).forEach(function(child){
        var tuple = util.deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        if (childAttributes.id) {
            datamodel[childAttributes.id] = childAttributes.expr || null;
        }
    });
}

function transformStateNode(node, ancestors) {
    var tuple = util.deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];
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
    var onExitChildren,
        onEntryChildren;
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

        var tuple = util.deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        switch (childTagName) {
            case "transition":
                transitionChildren.push(transformTransitionNode(child, state));
                break;
            case "onentry":
                onEntryChildren = codeGen.generateCode(childChildren);
                break;
            case "onexit":
                onExitChildren = codeGen.generateCode(childChildren);
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
}, "core/util/docToModel": function(exports, require, module) {var JsonML = require('../../external/jsonml/jsonml-dom'),
    annotator = require('./annotate-scxml-json'),
    json2model = require('../scxml/json2model'),
    platform = require('../../platform'),
    util = require('./jsonml');

function documentToModel(url,doc,cb){
    var arr = JsonML.parseDOM(doc);
    var scxmlJson = arr[1];

    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(platform && platform.getResourceFromUrl){
        inlineSrcs(url,scxmlJson,function(errors){
            if(errors){ 
                //I think we should probably just log any of these errors
                platform.log("Errors downloading src attributes",errors);
            }
            scxmlJsonToModel(scxmlJson,cb);
        });
    }else{
        scxmlJsonToModel(scxmlJson,cb);
    }
}

function scxmlJsonToModel(scxmlJson,cb){
    try {
        var annotatedScxmlJson = annotator.transform(scxmlJson);
        var model = json2model(annotatedScxmlJson); 
        cb(null,model);
    }catch(e){
        cb(e);
    }
}

function inlineSrcs(url,jsonml,cb){
    //console.log('inlining scripts');
    
    var scriptActionsWithSrcAttributes = [], errors = [];

    traverse(jsonml,scriptActionsWithSrcAttributes); 

    //async forEach
    function retrieveScripts(){
        var script = scriptActionsWithSrcAttributes.pop();
        if(script){
            //quick and dirty for now:
            if(url){
                var root = url.split(platform.pathSeparator).slice(0,-1).join(platform.pathSeparator);
                var src = root  + platform.pathSeparator + script[1].src;
            }else{
                src = script[1].src;
            }
            //console.log('fetching script src',src);
            platform.getResourceFromUrl(src,function(err,text){
                if(err){
                    //just capture the error, and continue on
                    errors.push(err); 
                }

                script.push(text);  //this is how we append a text node
                retrieveScripts();
            });
        }else{
            cb(errors.length ? errors : null);
        }
    }
    retrieveScripts();  //kick him off
}

function traverse(node,nodeList){
    var tuple = util.deconstructNode(node, true), tagName = tuple[0], attrs = tuple[1], children = tuple[2];
    if((tagName === 'script' || tagName === 'data') && attrs && attrs.src){
        nodeList.push(node); 
    } 

    children.forEach(function(child){traverse(child,nodeList);});
}


module.exports = documentToModel;
}, "core/util/inline-src-attribute": function(exports, require, module) {}, "core/util/jsonml": function(exports, require, module) {/*
 * Some utilities functions for working with jsonml.
 * Right now, there's only one.
 */

module.exports = {
    deconstructNode : function(node, filterText) {
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
};

}, "external/jsonml/jsonml-dom": function(exports, require, module) {/*
    jsonml-dom.js
    DOM to JsonML utility

    Created: 2007-02-15-2235
    Modified: 2008-08-31-2206

    Copyright (c)2006-2010 Stephen M. McKamey
    Distributed under The MIT License: http://jsonml.org/license
*/

var JsonML = JsonML || {};

(function(JsonML){
    'use strict';

    function getItem(nodeList,index){
        //this works in IE, other browsers, Rhino, and nodejs xmldom library
        return "item" in nodeList ? nodeList.item(index) : nodeList[index];
    } 

    function getLocalName(node){
        return node.localName || node.tagName;
    }

    function toStr(s){
        if(s){
            return typeof s !== "string" ? String(s) : s;
        }
        else{
            return "";
        }
    }

    /*JsonML*/ JsonML.parseDOM = function(/*DOM*/ elem, /*function*/ filter) {
        if (!elem || !elem.nodeType) {
            // free references
            return (elem = null);
        }

        function addChildren(/*DOM*/ elem, /*function*/ filter, /*JsonML*/ jml) {
            if (elem.hasChildNodes()) {
                for (var i=0; i<elem.childNodes.length; i++) {
                    var child = getItem(elem.childNodes,i);
                    child = JsonML.parseDOM(child, filter);
                    if (child) {
                        jml.push(child);
                    }
                }
                return true;
            }
            return false;
        }

        var i, jml;
        switch (elem.nodeType) {
            case 1:  // element
            case 9:  // document
            case 11: // documentFragment
                jml = [toStr(getLocalName(elem))];

                var attr = elem.attributes,
                    props = {},
                    hasAttrib = false;

                for (i=0; attr && i<attr.length; i++) {
                    var a = getItem(attr,i);
                    if (a.specified) {
                        if (a.name === 'style') {
                            props.style = elem.style.cssText || a.value;
                        } else { 
                            //assume string
                            props[a.name] = toStr(a.value);
                        }
                        hasAttrib = true;
                    }
                }
                if (hasAttrib) {
                    jml.push(props);
                }

                var child;
                switch (jml[0].toLowerCase()) {
                    case 'frame':
                    case 'iframe':
                        try {
                            if ('undefined' !== typeof elem.contentDocument) {
                                // W3C
                                child = elem.contentDocument;
                            } else if ('undefined' !== typeof elem.contentWindow) {
                                // Microsoft
                                child = elem.contentWindow.document;
                            } else if ('undefined' !== typeof elem.document) {
                                // deprecated
                                child = elem.document;
                            }
    
                            child = JsonML.parseDOM(child, filter);
                            if (child) {
                                jml.push(child);
                            }
                        } catch (ex) {}
                        break;
                    case 'style':
                        child = elem.styleSheet && elem.styleSheet.cssText;
                        if (child && 'string' === typeof child) {
                            // unwrap comment blocks
                            child = child.replace('<!--', '').replace('-->', '');
                            jml.push(child);
                        } else if (elem.hasChildNodes()) {
                            for (i=0; i<elem.childNodes.length; i++) {
                                child = elem.childNodes[i];
                                child = JsonML.parseDOM(child, filter);
                                if (child && 'string' === typeof child) {
                                    // unwrap comment blocks
                                    child = child.replace('<!--', '').replace('-->', '');
                                    jml.push(child);
                                }
                            }
                        }
                        break;
                    case 'input':
                        addChildren(elem, filter, jml);
                        child = (elem.type !== 'password') && elem.value;
                        if (child) {
                            if (!hasAttrib) {
                                // need to add an attribute object
                                jml.shift();
                                props = {};
                                jml.unshift(props);
                                jml.unshift(elem.tagName||'');
                            }
                            props.value = child;
                        }
                        break;
                    case 'textarea':
                        if (!addChildren(elem, filter, jml)) {
                            child = elem.value || elem.innerHTML;
                            if (child && 'string' === typeof child) {
                                jml.push(child);
                            }
                        }
                        break;
                    default:
                        addChildren(elem, filter, jml);
                        break;
                }

                // filter result
                if ('function' === typeof filter) {
                    jml = filter(jml, elem);
                }

                // free references
                elem = null;
                return jml;
            case 3: // text node
            case 4: // CDATA node
                var str = String(elem.nodeValue);
                // free references
                elem = null;
                return str;
            case 10: // doctype
                jml = ['!'];

                var type = ['DOCTYPE', (elem.name || 'html').toLowerCase()];

                if (elem.publicId) {
                    type.push('PUBLIC', '"' + elem.publicId + '"');
                }

                if (elem.systemId) {
                    type.push('"' + elem.systemId + '"');
                }

                jml.push(type.join(' '));

                // filter result
                if ('function' === typeof filter) {
                    jml = filter(jml, elem);
                }

                // free references
                elem = null;
                return jml;
            case 8: // comment node
                if ((elem.nodeValue||'').indexOf('DOCTYPE') !== 0) {
                    // free references
                    elem = null;
                    return null;
                }

                jml = ['!',
                        elem.nodeValue];

                // filter result
                if ('function' === typeof filter) {
                    jml = filter(jml, elem);
                }

                // free references
                elem = null;
                return jml;
            default: // etc.
                // free references
                return (elem = null);
        }
    };

    /*JsonML*/ JsonML.parseHTML = function(/*string*/ html, /*function*/ filter) {
        var elem = document.createElement('div');
        elem.innerHTML = html;
        var jml = JsonML.parseDOM(elem, filter);

        // free references
        elem = null;

        if (jml.length === 2) {
            return jml[1];
        }

        // make wrapper a document fragment
        jml[0] = '';
        return jml;
    };

})(JsonML);

//commonjs supprt
if(typeof module !== undefined && module.exports){
    module.exports = JsonML;
}
}, "platform": function(exports, require, module) {function isRhino(){
    return typeof Packages !== "undefined";
}

function isNode(){
    return typeof process !== "undefined" && typeof module !== "undefined";
}

function isBrowser(){
    return typeof window !== "undefined" && typeof document !== "undefined";
}

if(isRhino()){
    module.exports = require('./rhino/platform');
}else if(isNode()){
    module.exports = require('./node/platform');
}else if(isBrowser()){
    module.exports = require('./browser/platform');
}else{
    module.exports = null;
}
}, "scion": function(exports, require, module) {var platform = require('./platform'),
    scxml = require('./core/scxml/SCXML'),
    documentToModel = require('./core/util/docToModel');

if(platform){

    function urlToModel(url,cb){
        platform.getDocumentFromUrl(url,function(err,doc){
            if(err){
                cb(err);
            }else{
                documentToModel(url,doc,cb);
            }
        });
    }

    function pathToModel(url,cb){
        platform.getDocumentFromFilesystem(url,function(err,doc){
            if(err){
                cb(err);
            }else{
                documentToModel(url,doc,cb);
            }
        });
    }

    function documentStringToModel(s,cb){
        documentToModel(null,platform.parseDocumentFromString(s),cb);
    }

    //export standard interface
    var scion = module.exports = {
        /** @expose */
        pathToModel : pathToModel,
        /** @expose */
        urlToModel : urlToModel, 
        /** @expose */
        documentStringToModel : documentStringToModel, 
        /** @expose */
        documentToModel : documentToModel,
        /** @expose */
        SCXML : scxml.SimpleInterpreter
    };
    
}else{
    //export interface for something else, perhaps a spartan shell environment
    module.exports = {
        /** @expose */
        annotator : require('./core/util/annotate-scxml-json'),
        /** @expose */
        json2model : require('./core/scxml/json2model'),
        /** @expose */
        scxml : require('./core/scxml/SCXML')
    };
}
}});
