
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
}).call(this)({"browser/SCXML": function(exports, require, module) {//TODO: default send implementation
//TODO: default script
//TODO: anything else platform dependent in the interpreter

//construct can take path, url, doc, or model

var scxml = require('../core/scxml/SCXML'),
    JsonML = require('../external/jsonml/jsonml-dom'),
    annotator = require('../core/util/annotate-scxml-json'),
    json2model = require('../core/scxml/json2model');

function urlToModel(url,cb){
    window.jQuery.get(url,function(doc){
        cb(null,documentToModel(doc));
    },"xml").error(function(e){
        cb(e);
    });
}

function parseDocumentString(s){
    return (new window.DOMParser()).parseFromString(s,"application/xml");
}

function documentStringToModel(s){
    return documentToModel(parseDocumentString(s));
}

function documentToModel(doc){
    var arr = JsonML.parseDOM(doc);
    var scxmlJson = arr[1];

    var annotatedScxmlJson = annotator.transform(scxmlJson);

    var model = json2model(annotatedScxmlJson); 

    return model;
}

//setup environment
scxml.SimpleInterpreter.prototype._setTimeout = function(callback, timeout) {
    return window.setTimeout(callback, timeout);
};

scxml.SimpleInterpreter.prototype._clearTimeout = function(timeoutId) {
    return window.clearTimeout(timeoutId);
};

scxml.SimpleInterpreter.prototype._log = window.console.log || function(){};

module.exports = {
    pathToModel : urlToModel,   //alias pathToModule to urlToModel for browser
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter
};
}, "browser/browser-listener-client": function(exports, require, module) {//TODO: this will be like node-listener-client.js, except will use jquery/AJAX for its remoting
}, "browser/build/stitch": function(exports, require, module) {var stitch  = require('stitch');
var fs      = require('fs');

var pkg = stitch.createPackage({
    paths: ['lib/'],
    excludes : ['lib/node','lib/rhino','lib/browser/build']
});

pkg.compile(function (err, source){
    fs.writeFile('scion.js', source, function (err) {
        if (err) throw err;
        console.log('Compiled scion.js');
    });
});
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
                if (this.opts.printTrace) this._log("sending event", action.event, "with content", action.contentexpr);
                
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

var stripStarFromEventNameRe = /^((([^.]+)\.)*([^.]+))(\.\*)?$/;

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
}, "core/util/easy": function(exports, require, module) {exports.browser.interpreterFromUrl = function(ajax,documentUrl,cb){
    ajax.get(documentUrl,function(doc){
        var instance = exports.browser.interpreterFromXMLDoc(doc);
        cb(instance);
    });
}

exports.browser.interpreterFromXMLDoc = function(xmldoc){
    //step 2 - transform the scxml document to JSON
    var arr = JsonML.parseDOM(scxmlToTransform);
    var scxmlJson = arr[1];

    //step 3 - transform the parsed JSON model so it is friendlier to interpretation
    var annotatedScxmlJson = scion.annotator.transform(scxmlJson);

    //step 4 - initialize sc object model
    var model = scion.json2model(annotatedScxmlJson);

    //step 5 - instantiate statechart
    var interpreter = new scion.scxml.BrowserInterpreter(model);

    interpreter.start();
    interpreter.gen({name:"init",data:rect});

    function handleEvent(e){
        e.preventDefault();
        interpreter.gen({name : e.type,data: e});
    }

    //step 6 - connect all relevant event listeners
    $(rect).mousedown(handleEvent);
    $(document.documentElement).bind("mouseup mousemove",handleEvent);
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

    //small compatibility layer for rhino
    var isRhino = typeof Packages !== "undefined";

    var item = isRhino ? 
        function(nodeList,index){
            return nodeList.item(index);
        } : 
        function(nodeList,index){
            return nodeList[index];
        };

	/*JsonML*/ JsonML.parseDOM = function(/*DOM*/ elem, /*function*/ filter) {
		if (!elem || !elem.nodeType) {
			// free references
			return (elem = null);
		}

		function addChildren(/*DOM*/ elem, /*function*/ filter, /*JsonML*/ jml) {
			if (elem.hasChildNodes()) {
				for (var i=0; i<elem.childNodes.length; i++) {
					var child = item(elem.childNodes,i);
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
				jml = [elem.tagName||''];

				var attr = elem.attributes,
					props = {},
					hasAttrib = false;

				for (i=0; attr && i<attr.length; i++) {
					if (item(attr,i).specified) {
						if (item(attr,i).name === 'style') {
							props.style = elem.style.cssText || item(attr,i).value;
						} else if ('string' === typeof item(attr,i).value ||
                            (isRhino && (attr.item(i).value instanceof Packages.java.lang.String))) {
							props[item(attr,i).name] = item(attr,i).value;
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
}, "external/jsonml/jsonml-jbst": function(exports, require, module) {/*
	jsonml-jbst.js
	JsonML + Browser-Side Templating (JBST)

	Created: 2008-07-28-2337
	Modified: 2010-09-13-1952

	Copyright (c)2006-2010 Stephen M. McKamey
	Distributed under The MIT License: http://jsonml.org/license

	This file creates a JsonML.BST type containing these methods:

		// JBST + JSON => DOM
		var dom = JsonML.BST(jbst).bind(data);

		// JBST + JSON => JsonML
		var jsonml = JsonML.BST(jbst).dataBind(data);

		// implement filter to intercept and perform custom filtering of resulting DOM elements
		JsonML.BST.filter = function(elem) {
			if (condition) {
				// this will prevent insertion into resulting DOM tree
				return null;
			}
			return elem;
		};

		// implement onerror event to handle any runtime errors while binding
		JsonML.BST.onerror = function(ex) {
			// access the current context via this.data, this.index, etc.
			// display custom inline error messages
			return '['+ex+']';
		};

		// implement onbound event to perform custom processing of elements after binding
		JsonML.BST.onbound = function(node) {
			// access the current context via this.data, this.index, etc.
			// watch elements as they are constructed
			if (window.console) {
				console.log(JSON.stringify(output));
			}
		};

		// implement onappend event to perform custom processing of children before being appended
		JsonML.BST.onappend = function(parent, child) {
			// access the current context via this.data, this.index, etc.
			// watch elements as they are added
			if (window.console) {
				console.log(JsonML.getTagName(parent)+' > '+JsonML.getTagName(child));
			}
		};
*/

/* namespace JsonML */
var JsonML = JsonML || {};

JsonML.BST = (function(){
	'use strict';

	var SHOW = 'jbst:visible',
		INIT = 'jbst:oninit',
		LOAD = 'jbst:onload';

	// ensures attribute key contains method or is removed
	// attr: attribute object
	// key: method name
	/*function*/ function ensureMethod(/*object*/ attr, /*string*/ key) {
		var method = attr[key] || null;
		if (method) {
			// ensure is method
			if ('function' !== typeof method) {
				try {
					/*jslint evil:true */
					method = new Function(String(method));
					/*jslint evil:false */
				} catch (ex) {
					// filter
					method = null;
				}
			}
			if (method) {
				// IE doesn't like colon in property names
				attr[key.split(':').join('$')] = method;
			}
			delete attr[key];
		}
		return method;
	}

	// default onerror handler, override JsonML.BST.onerror to change
	/*JsonML*/ function onError(/*Error*/ ex) {
		return '['+ex+']';
	}

	// retrieve and remove method
	/*function*/ function popMethod(/*DOM*/ elem, /*string*/ key) {
		// IE doesn't like colon in property names
		key = key.split(':').join('$');

		var method = elem[key];
		if (method) {
			try {
				delete elem[key];
			} catch (ex) {
				// sometimes IE doesn't like deleting from DOM
				elem[key] = undefined;
			}
		}
		return method;
	}

	// JsonML Filter
	/*DOM*/ function filter(/*DOM*/ elem) {

		// execute and remove jbst:oninit method
		var method = popMethod(elem, INIT);
		if ('function' === typeof method) {
			// execute in context of element
			method.call(elem);
		}

		// execute and remove jbst:onload method
		method = popMethod(elem, LOAD);
		if ('function' === typeof method) {
			// queue up to execute after insertion into parentNode
			setTimeout(function() {
				// execute in context of element
				method.call(elem);
				method = elem = null;
			}, 0);
		}

		if (JsonML.BST.filter) {
			return JsonML.BST.filter(elem);
		}

		return elem;
	}

	/*object*/ function callContext(
		/*object*/ self,
		/*object*/ data,
		/*int*/ index,
		/*int*/ count,
		/*object*/ args,
		/*function*/ method,
		/*Array*/ methodArgs) {

		try {
			// setup context for code block
			self.data = ('undefined' !== typeof data) ? data : null;
			self.index = isFinite(index) ? Number(index) : NaN;
			self.count = isFinite(count) ? Number(count) : NaN;
			self.args = ('undefined' !== typeof args) ? args : null;

			// execute node in the context of self as 'this', passing in any parameters
			return method.apply(self, methodArgs || []);

		} finally {
			// cleanup contextual members
			delete self.count;
			delete self.index;
			delete self.data;
			delete self.args;
		}
	}

	/* ctor */
	function JBST(/*JsonML*/ jbst) {
		if ('undefined' === typeof jbst) {
			throw new Error('JBST tree is undefined');
		}

		var self = this,
			appendChild = JsonML.appendChild;

		// recursively applies dataBind to all nodes of the template graph
		// NOTE: it is very important to replace each node with a copy,
		// otherwise it destroys the original template.
		// node: current template node being data bound
		// data: current data item being bound
		// index: index of current data item
		// count: count of current set of data items
		// args: state object
		// returns: JsonML nodes
		/*object*/ function dataBind(/*JsonML*/ node, /*object*/ data, /*int*/ index, /*int*/ count, /*object*/ args) {
			try {
				// recursively process each node
				if (node) {
					var output;

					if ('function' === typeof node) {
						output = callContext(self, data, index, count, args, node);

						if (output instanceof JBST) {
							// allow returned JBSTs to recursively bind
							// useful for creating 'switcher' template methods
							return output.dataBind(data, index, count, args);
						}

						// function result
						return output;
					}

					if (node instanceof Array) {
						var onBound = ('function' === typeof JsonML.BST.onbound) && JsonML.BST.onbound,
							onAppend = ('function' === typeof JsonML.BST.onappend) && JsonML.BST.onappend,
							appendCB = onAppend && function(parent, child) {
								callContext(self, data, index, count, args, onAppend, [parent, child]);
							};

						// JsonML output
						output = [];
						for (var i=0; i<node.length; i++) {
							var child = dataBind(node[i], data, index, count, args);
							appendChild(output, child, appendCB);

							if (!i && !output[0]) {
								onAppend = appendCB = null;
							}
						}

						if (output[0] && onBound) {
							callContext(self, data, index, count, args, onBound, [output]);
						}

						// if output has attributes, check for JBST commands
						if (JsonML.hasAttributes(output)) {
							// visibility JBST command
							var visible = output[1][SHOW];
							if ('undefined' !== typeof visible) {
								// cull any false-y values
								if (!visible) {
									// suppress rendering of entire subtree
									return '';
								}
								// remove attribute
								delete output[1][SHOW];
							}

							// jbst:oninit
							ensureMethod(output[1], INIT);

							// jbst:onload
							ensureMethod(output[1], LOAD);
						}

						// JsonML element
						return output;
					}

					if ('object' === typeof node) {
						output = {};
						// process each property in template node
						for (var property in node) {
							if (node.hasOwnProperty(property)) {
								// evaluate property's value
								var value = dataBind(node[property], data, index, count, args);
								if ('undefined' !== typeof value && value !== null) {
									output[property] = value;
								}
							}
						}
						// attributes object
						return output;
					}
				}

				// rest are simple value types, so return node directly
				return node;
			} catch (ex) {
				try {
					// handle error with complete context
					var err = ('function' === typeof JsonML.BST.onerror) ? JsonML.BST.onerror : onError;
					return callContext(self, data, index, count, args, err, [ex]);
				} catch (ex2) {
					return '['+ex2+']';
				}
			}
		}

		/*JsonML*/ function iterate(/*JsonML*/ node, /*object*/ data, /*int*/ index, /*int*/ count, /*object*/ args) {
			if (data instanceof Array) {
				// create a document fragment to hold list
				var output = [''];

				count = data.length;
				for (var i=0; i<count; i++) {
					// apply template to each item in array
					appendChild(output, dataBind(jbst, data[i], i, count, args));
				}
				// document fragment
				return output;
			} else {
				// data is singular so apply template once
				return dataBind(jbst, data, index, count, args);
			}
		}

		// the publicly exposed instance methods

		// combines JBST and JSON to produce JsonML
		/*JsonML*/ self.dataBind = function(/*object*/ data, /*int*/ index, /*int*/ count, /*object*/ args) {
			// data is singular so apply template once
			return iterate(jbst, data, index, count, args);
		};

		/* JBST + JSON => JsonML => DOM */
		/*DOM*/ self.bind = function(/*object*/ data, /*int*/ index, /*int*/ count, /*object*/ args) {

			// databind JSON data to a JBST template, resulting in a JsonML representation
			var jml = iterate(jbst, data, index, count, args);

			// hydrate the resulting JsonML, executing callbacks, and user-filter
			return JsonML.parse(jml, filter);
		};

		// replaces a DOM element with result from binding
		/*void*/ self.replace = function(/*DOM*/ elem, /*object*/ data, /*int*/ index, /*int*/ count, /*object*/ args) {
			if ('string' === typeof elem) {
				elem = document.getElementById(elem);
			}

			if (elem && elem.parentNode) {
				var jml = self.bind(data, index, count, args);
				if (jml) {
					elem.parentNode.replaceChild(jml, elem);
				}
			}
		};

		// displace a DOM element with result from binding JsonML+BST node bound within this context
		/*void*/ self.displace = function(/*DOM*/ elem, /*JsonML*/ node, /*object*/ data, /*int*/ index, /*int*/ count, /*object*/ args) {
			if ('string' === typeof elem) {
				elem = document.getElementById(elem);
			}

			if (elem && elem.parentNode) {
				// databind JSON data to a JBST template, resulting in a JsonML representation
				var jml = iterate(node, data, index, count, args);

				// hydrate the resulting JsonML, executing callbacks, and user-filter
				jml = JsonML.parse(jml, filter);
				if (jml) {
					elem.parentNode.replaceChild(jml, elem);
				}
			}
		};

		// patches a DOM element with JsonML+BST node bound within this context
		/*void*/ self.patch = function(/*DOM*/ elem, /*JsonML*/ node, /*object*/ data, /*int*/ index, /*int*/ count, /*object*/ args) {
			if ('string' === typeof elem) {
				elem = document.getElementById(elem);
			}

			if (elem) {
				var jml = [''];
				appendChild(jml, dataBind(node, data, index, count, args));
				JsonML.patch(elem, jml, filter);
			}
		};
	}

	/* factory method */
	return function(/*JBST*/ jbst) {
		return (jbst instanceof JBST) ? jbst : new JBST(jbst);
	};
})();

/* override to perform default filtering of the resulting DOM tree */
/*function*/ JsonML.BST.filter = null;

/* override to perform custom error handling during binding */
/*function*/ JsonML.BST.onerror = null;

/* override to perform custom processing of each element after adding to parent */
/*function*/ JsonML.BST.onappend = null;

/* override to perform custom processing of each element after binding */
/*function*/ JsonML.BST.onbound = null;
}, "external/jsonml/jsonml2": function(exports, require, module) {/*global JSON */
/*
	jsonml2.js
	JsonML builder

	Created: 2006-11-09-0116
	Modified: 2010-09-13-1952

	Copyright (c)2006-2010 Stephen M. McKamey
	Distributed under The MIT License: http://jsonml.org/license

	This file creates a global JsonML object containing these methods:

		JsonML.parse(string|array, filter)

			This method produces a tree of DOM elements from a JsonML tree. The
			array must not contain any cyclical references.

			The optional filter parameter is a function which can filter and
			transform the results. It receives each of the DOM nodes, and
			its return value is used instead of the original value. If it
			returns what it received, then structure is not modified. If it
			returns undefined then the member is deleted.

			This is useful for binding unobtrusive JavaScript to the generated
			DOM elements.

			Example:

			// Parses the structure. If an element has a specific CSS value then
			// takes appropriate action: Remove from results, add special event
			// handlers, or bind to a custom component.

			var myUI = JsonML.parse(myUITemplate, function (elem) {
				if (elem.className.indexOf('Remove-Me') >= 0) {
					// this will remove from resulting DOM tree
					return null;
				}

				if (elem.tagName && elem.tagName.toLowerCase() === 'a' &&
					elem.className.indexOf('External-Link') >= 0) {
					// this is the equivalent of target='_blank'
					elem.onclick = function(evt) {
						window.open(elem.href); return false;
					};

				} else if (elem.className.indexOf('Fancy-Widgit') >= 0) {
					// bind to a custom component
					FancyWidgit.bindDOM(elem);
				}
				return elem;
			});

			// Implement onerror to handle any runtime errors while binding:
			JsonML.onerror = function (ex, jml, filter) {
				// display inline error message
				return document.createTextNode('['+ex+']');
			};

		Utility methods for manipulating JsonML elements:

			// tests if a given object is a valid JsonML element
			bool JsonML.isElement(jml);

			// gets the name of a JsonML element
			string JsonML.getTagName(jml);

			// tests if a given object is a JsonML attributes collection
			bool JsonML.isAttributes(jml);

			// tests if a JsonML element has a JsonML attributes collection
			bool JsonML.hasAttributes(jml);

			// gets the attributes collection for a JsonML element
			object JsonML.getAttributes(jml);

			// sets multiple attributes for a JsonML element
			void JsonML.addAttributes(jml, attr);

			// gets a single attribute for a JsonML element
			object JsonML.getAttribute(jml, key);

			// sets a single attribute for a JsonML element
			void JsonML.setAttribute(jml, key, value);

			// appends a JsonML child node to a parent JsonML element
			void JsonML.appendChild(parent, child);

			// gets an array of the child nodes of a JsonML element
			array JsonML.getChildren(jml);
*/

var JsonML = JsonML || {};

(function(JsonML) {
	'use strict';

	//attribute name mapping
	var ATTRMAP = {
			rowspan : 'rowSpan',
			colspan : 'colSpan',
			cellpadding : 'cellPadding',
			cellspacing : 'cellSpacing',
			tabindex : 'tabIndex',
			accesskey : 'accessKey',
			hidefocus : 'hideFocus',
			usemap : 'useMap',
			maxlength : 'maxLength',
			readonly : 'readOnly',
			contenteditable : 'contentEditable'
			// can add more attributes here as needed
		},

		// attribute duplicates
		ATTRDUP = {
			enctype : 'encoding',
			onscroll : 'DOMMouseScroll'
			// can add more attributes here as needed
		},

		// event names
		EVTS = (function(/*string[]*/ names) {
			var evts = {};
			while (names.length) {
				var evt = names.shift();
				evts['on'+evt.toLowerCase()] = evt;
			}
			return evts;
		})('blur,change,click,dblclick,error,focus,keydown,keypress,keyup,load,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit,unload'.split(','));

	/*void*/ function addHandler(/*DOM*/ elem, /*string*/ name, /*function*/ handler) {
		if ('string' === typeof handler) {
			/*jslint evil:true */
			handler = new Function('event', handler);
			/*jslint evil:false */
		}

		if ('function' !== typeof handler) {
			return;
		}

		elem[name] = handler;
	}

	/*DOM*/ function addAttributes(/*DOM*/ elem, /*object*/ attr) {
		if (attr.name && document.attachEvent) {
			try {
				// IE fix for not being able to programatically change the name attribute
				var alt = document.createElement('<'+elem.tagName+' name="'+attr.name+'">');
				// fix for Opera 8.5 and Netscape 7.1 creating malformed elements
				if (elem.tagName === alt.tagName) {
					elem = alt;
				}
			} catch (ex) { }
		}

		// for each attributeName
		for (var name in attr) {
			if (attr.hasOwnProperty(name)) {
				// attributeValue
				var value = attr[name];
				if (name && value !== null && 'undefined' !== typeof value) {
					name = ATTRMAP[name.toLowerCase()] || name;
					if (name === 'style') {
						if ('undefined' !== typeof elem.style.cssText) {
							elem.style.cssText = value;
						} else {
							elem.style = value;
						}
					} else if (name === 'class') {
						elem.className = value;
					} else if (EVTS[name]) {
						addHandler(elem, name, value);

						// also set duplicated events
						if (ATTRDUP[name]) {
							addHandler(elem, ATTRDUP[name], value);
						}
					} else if ('string' === typeof value || 'number' === typeof value || 'boolean' === typeof value) {
						elem.setAttribute(name, value);

						// also set duplicated attributes
						if (ATTRDUP[name]) {
							elem.setAttribute(ATTRDUP[name], value);
						}
					} else {

						// allow direct setting of complex properties
						elem[name] = value;

						// also set duplicated attributes
						if (ATTRDUP[name]) {
							elem[ATTRDUP[name]] = value;
						}
					}
				}
			}
		}
		return elem;
	}

	/*void*/ function appendChild(/*DOM*/ elem, /*DOM*/ child) {
		if (child) {
			if (elem.tagName && elem.tagName.toLowerCase() === 'table' && elem.tBodies) {
				if (!child.tagName) {
					// must unwrap documentFragment for tables
					if (child.nodeType === 11) {
						while (child.firstChild) {
							appendChild(elem, child.removeChild(child.firstChild));
						}
					}
					return;
				}
				// in IE must explicitly nest TRs in TBODY
				var childTag = child.tagName.toLowerCase();// child tagName
				if (childTag && childTag !== 'tbody' && childTag !== 'thead') {
					// insert in last tbody
					var tBody = elem.tBodies.length > 0 ? elem.tBodies[elem.tBodies.length-1] : null;
					if (!tBody) {
						tBody = document.createElement(childTag === 'th' ? 'thead' : 'tbody');
						elem.appendChild(tBody);
					}
					tBody.appendChild(child);
				} else if (elem.canHaveChildren !== false) {
					elem.appendChild(child);
				}
			} else if (elem.tagName && elem.tagName.toLowerCase() === 'style' && document.createStyleSheet) {
				// IE requires this interface for styles
				elem.cssText = child;
			} else if (elem.canHaveChildren !== false) {
				elem.appendChild(child);
			} else if (elem.tagName && elem.tagName.toLowerCase() === 'object' &&
				child.tagName && child.tagName.toLowerCase() === 'param') {
					// IE-only path
					try {
						elem.appendChild(child);
					} catch (ex1) {}
					try {
						if (elem.object) {
							elem.object[child.name] = child.value;
						}
					} catch (ex2) {}
			}
		}
	}

	/*bool*/ function isWhitespace(/*DOM*/ node) {
		return node && (node.nodeType === 3) && (!node.nodeValue || !/\S/.exec(node.nodeValue));
	}

	/*void*/ function trimWhitespace(/*DOM*/ elem) {
		if (elem) {
			while (isWhitespace(elem.firstChild)) {
				// trim leading whitespace text nodes
				elem.removeChild(elem.firstChild);
			}
			while (isWhitespace(elem.lastChild)) {
				// trim trailing whitespace text nodes
				elem.removeChild(elem.lastChild);
			}
		}
	}

	/*DOM*/ function hydrate(/*string*/ value) {
		var wrapper = document.createElement('div');
		wrapper.innerHTML = value;

		// trim extraneous whitespace
		trimWhitespace(wrapper);

		// eliminate wrapper for single nodes
		if (wrapper.childNodes.length === 1) {
			return wrapper.firstChild;
		}

		// create a document fragment to hold elements
		var frag = document.createDocumentFragment ?
			document.createDocumentFragment() :
			document.createElement('');

		while (wrapper.firstChild) {
			frag.appendChild(wrapper.firstChild);
		}
		return frag;
	}

	function Unparsed(/*string*/ value) {
		this.value = value;
	}

	JsonML.raw = function(/*string*/ value) {
		return new Unparsed(value);
	};

	// default error handler
	/*DOM*/ function onError(/*Error*/ ex, /*JsonML*/ jml, /*function*/ filter) {
		return document.createTextNode('['+ex+']');
	}

	/* override this to perform custom error handling during binding */
	JsonML.onerror = null;

	/*DOM*/ function patch(/*DOM*/ elem, /*JsonML*/ jml, /*function*/ filter) {

		for (var i=1; i<jml.length; i++) {
			if (jml[i] instanceof Array || 'string' === typeof jml[i]) {
				// append children
				appendChild(elem, JsonML.parse(jml[i], filter));
			} else if (jml[i] instanceof Unparsed) {
				appendChild(elem, hydrate(jml[i].value));
			} else if ('object' === typeof jml[i] && jml[i] !== null && elem.nodeType === 1) {
				// add attributes
				elem = addAttributes(elem, jml[i]);
			}
		}

		return elem;
	}

	/*DOM*/ JsonML.parse = function(/*JsonML*/ jml, /*function*/ filter) {
		try {
			if (!jml) {
				return null;
			}
			if ('string' === typeof jml) {
				return document.createTextNode(jml);
			}
			if (jml instanceof Unparsed) {
				return hydrate(jml.value);
			}
			if (!JsonML.isElement(jml)) {
				throw new SyntaxError('invalid JsonML');
			}

			var tagName = jml[0]; // tagName
			if (!tagName) {
				// correctly handle a list of JsonML trees
				// create a document fragment to hold elements
				var frag = document.createDocumentFragment ?
					document.createDocumentFragment() :
					document.createElement('');
				for (var i=1; i<jml.length; i++) {
					appendChild(frag, JsonML.parse(jml[i], filter));
				}

				// trim extraneous whitespace
				trimWhitespace(frag);

				// eliminate wrapper for single nodes
				if (frag.childNodes.length === 1) {
					return frag.firstChild;
				}
				return frag;
			}

			if (tagName.toLowerCase() === 'style' && document.createStyleSheet) {
				// IE requires this interface for styles
				JsonML.patch(document.createStyleSheet(), jml, filter);
				// in IE styles are effective immediately
				return null;
			}

			var elem = patch(document.createElement(tagName), jml, filter);

			// trim extraneous whitespace
			trimWhitespace(elem);
			return (elem && 'function' === typeof filter) ? filter(elem) : elem;
		} catch (ex) {
			try {
				// handle error with complete context
				var err = ('function' === typeof JsonML.onerror) ? JsonML.onerror : onError;
				return err(ex, jml, filter);
			} catch (ex2) {
				return document.createTextNode('['+ex2+']');
			}
		}
	};

	// interface for internal JsonML.BST use
	JsonML.patch = function(/*DOM*/ elem, /*JsonML*/ jml, /*function*/ filter) {
		return patch(elem, jml, filter);
	};

	/* Utility Methods -------------------------*/

	/*bool*/ JsonML.isElement = function(/*JsonML*/ jml) {
		return (jml instanceof Array) && ('string' === typeof jml[0]);
	};

	/*bool*/ JsonML.isFragment = function(/*JsonML*/ jml) {
		return (jml instanceof Array) && (jml[0] === '');
	};

	/*string*/ JsonML.getTagName = function(/*JsonML*/ jml) {
		return jml[0] || '';
	};

	/*bool*/ JsonML.isAttributes = function(/*JsonML*/ jml) {
		return !!jml && ('object' === typeof jml) && !(jml instanceof Array);
	};

	/*bool*/ JsonML.hasAttributes = function(/*JsonML*/ jml) {
		if (!JsonML.isElement(jml)) {
			throw new SyntaxError('invalid JsonML');
		}

		return JsonML.isAttributes(jml[1]);
	};

	/*object*/ JsonML.getAttributes = function(/*JsonML*/ jml, /*bool*/ addIfMissing) {
		if (JsonML.hasAttributes(jml)) {
			return jml[1];
		}

		if (!addIfMissing) {
			return undefined;
		}

		// need to add an attribute object
		var name = jml.shift();
		var attr = {};
		jml.unshift(attr);
		jml.unshift(name||'');
		return attr;
	};

	/*void*/ JsonML.addAttributes = function(/*JsonML*/ jml, /*object*/ attr) {
		if (!JsonML.isElement(jml) || !JsonML.isAttributes(attr)) {
			throw new SyntaxError('invalid JsonML');
		}

		if (!JsonML.isAttributes(jml[1])) {
			// just insert attributes
			var name = jml.shift();
			jml.unshift(attr);
			jml.unshift(name||'');
			return;
		}

		// merge attribute objects
		var old = jml[1];
		for (var key in attr) {
			if (attr.hasOwnProperty(key)) {
				old[key] = attr[key];
			}
		}
	};

	/*string|number|bool*/ JsonML.getAttribute = function(/*JsonML*/ jml, /*string*/ key) {
		if (!JsonML.hasAttributes(jml)) {
			return undefined;
		}
		return jml[1][key];
	};

	/*void*/ JsonML.setAttribute = function(/*JsonML*/ jml, /*string*/ key, /*string|number|bool*/ value) {
		JsonML.getAttributes(jml, true)[key] = value;
	};

	/*void*/ JsonML.appendChild = function(/*JsonML*/ parent, /*array|object|string*/ child) {
		if (child instanceof Array && child[0] === '') {
			// result was multiple JsonML sub-trees (i.e. documentFragment)
			child.shift();// remove fragment ident

			// directly append children
			while (child.length) {
				JsonML.appendChild(parent, child.shift(), arguments[2]);
			}
		} else if (child && 'object' === typeof child) {
			if (child instanceof Array) {
				if (!JsonML.isElement(parent) || !JsonML.isElement(child)) {
					throw new SyntaxError('invalid JsonML');
				}

				if ('function' === typeof arguments[2]) {
					// onAppend callback for JBST use
					arguments[2](parent, child);
				}

				// result was a JsonML node
				parent.push(child);
			} else if (child instanceof Unparsed) {
				if (!JsonML.isElement(parent)) {
					throw new SyntaxError('invalid JsonML');
				}

				// result was a JsonML node
				parent.push(child);
			} else {
				// result was JsonML attributes
				JsonML.addAttributes(parent, child);
			}
		} else if ('undefined' !== typeof child && child !== null) {
			if (!(parent instanceof Array)) {
				throw new SyntaxError('invalid JsonML');
			}

			// must convert to string or JsonML will discard
			child = String(child);

			// skip processing empty string literals
			if (child && parent.length > 1 && 'string' === typeof parent[parent.length-1]) {
				// combine strings
				parent[parent.length-1] += child;
			} else if (child || !parent.length) {
				// append
				parent.push(child);
			}
		}
	};

	/*array*/ JsonML.getChildren = function(/*JsonML*/ jml) {
		if (JsonML.hasAttributes(jml)) {
			jml.slice(2);
		}

		jml.slice(1);
	};

})(JsonML);
}, "node/SCXML": function(exports, require, module) {var scxml = require('../core/scxml/SCXML'),
    JsonML = require('../external/jsonml/jsonml-dom'),
    annotator = require('../core/util/annotate-scxml-json'),
    json2model = require('../core/scxml/json2model');

//import node modules
var http = require('http'),
    urlM = require('url'),
    fs = require('fs'),
    xmldom = require('xmldom');

function urlToModel(url,cb){
    var options = urlM.parse(url); 

    http.get(options, function(res) {
        var s = "";
        res.on('data',function(d){
            s += d;
        });
        res.on('end',function(){
            var doc = documentStringToModel(s);
            cb(null,doc);
        });
    }).on('error', function(e) {
        cb(e);
    });
}

function pathToModel(path,cb){
    fs.readFile(path,function(err,s){
        if(err){
            cb(err);
        }else{
            var doc = documentStringToModel(s);
            cb(null,doc);
        }
    },'utf8');
}

function parseDocumentString(s){
    return (new xmldom.DOMParser()).parseFromString(s);
}

function documentStringToModel(s){
    return documentToModel(parseDocumentString(s));
}

//TODO: move this out, as it is shared code
function documentToModel(doc){
    var arr = JsonML.parseDOM(doc);
    var scxmlJson = arr[1];

    var annotatedScxmlJson = annotator.transform(scxmlJson);

    var model = json2model(annotatedScxmlJson); 

    return model;
}

//setup environment
scxml.SimpleInterpreter.prototype._setTimeout = setTimeout;
scxml.SimpleInterpreter.prototype._clearTimeout = clearTimeout;
scxml.SimpleInterpreter.prototype._log = console.log;

module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter
};
}, "node/browser-atom3-proxy": function(exports, require, module) {var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var static = require('node-static');
var file = new static.Server('.');

httpProxy.createServer(function (req, res, proxy) {
  //
  // Put your custom server logic here
  //
  //
    if(req.url === "/command"){
        //proxy him
        proxy.proxyRequest(req, res, {
            host: 'localhost',
            port: 12345
        });
    }else{
        //serve as static file
        req.addListener('end', function () {
            //
            // Serve files!
            //
            file.serve(req,res);
        });
    }
    
}).listen(8000);
}, "node/node-listener-client": function(exports, require, module) {var http = require('http');

function HTTPClientListener(options){
    this.options = options;

    var agent = new http.Agent();
    agent.maxSockets = 1;     //serialize all requests

    this.defaultOptions = {
        host : "localhost",
        port : "1337",
        agent : agent 
    };

}

function extend(o){
    for(var i = 1; i < arguments.length; i++){
        for(var k in arguments[i]){
            var v = arguments[i][k];
            o[k] = v;
        }
    }
}

HTTPClientListener.prototype = {
    onEntry : function(id){
        http.get(extend(
            { path : "/onEntry?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                //ignore the result
            });
    },
    onExit : function(id){
        http.get(extend(
            { path : "/onExit?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                //ignore the result
            });
    },
    onTransition : function(sourceId,targetIds){
        //TODO
    }
};

module.exports = HTTPClientListener;
}, "node/node-scxml-gui-http-proxy-server": function(exports, require, module) {/*
 * This utility exists to provide a nice HTTP front-end to send state change
 * events from the node-listener-client or browser-listener-client to the
 * scxmlgui tcp server. this allows nice debugging in a graphical environment
 * of SCXML executing in SCION.
 */

var http = require('http'),
    url = require('url'),
    net = require('net');

var args = process.argv.slice(2);

//server port
var httpServerPort = args[0] || 1337;

//scxmlgui listener port
var scxmlGuiTCPHost = args[1] || "localhost";
var scxmlGuiTCPPort = parseInt(args[2],10) || 9999;


//start up listener
var serviceSocket = new net.Socket();

serviceSocket.connect(scxmlGuiTCPPort, scxmlGuiTCPHost, function() {
    //TODO: something goes here
});

serviceSocket.on("error", function (e) {
    console.log("Could not connect to service at host " + scxmlGuiTCPHost + ', port ' + scxmlGuiTCPPort );
    if(httpServer) httpServer.close();
});

serviceSocket.on("data", function(data) {
    //the communications protocol is one-way, so we don't expect or do anything with this
    console.log("received data from scxmlGUI socket",data);
});

serviceSocket.on("close", function(had_error) {
    console.log("scxmlGUI socket closed unexpectedly");
    if(httpServer) httpServer.close();
});


var httpServer = http.createServer(function (req, res) {
    //expect url of the form:
        //onEntry?id=<id>
        //onExit?id=<id>
        //onTransition?source=<id>&targets=<id1>,<id2>,...

    var parsedUrl = url.parse(req.url, true);

    switch(parsedUrl.pathname){
        case "/onEntry":
            serviceSocket.write("1 " + parsedUrl.query.id + "\n");
            break;
        case "/onExit":
            serviceSocket.write("0 " + parsedUrl.query.id + "\n");
            break;
        case "/onTransition":
            //TODO: this
            //parsedUrl.query.targets = parsedUrl.query.targets.split(",");
            break;
        default : 
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Unable to understand request\n');
            return;
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Request processed\n');
}).listen(httpServerPort);
}, "rhino/SCXML": function(exports, require, module) {var scxml = require('../core/scxml/SCXML'),
    JsonML = require('../external/jsonml/jsonml-dom'),
    annotator = require('../core/util/annotate-scxml-json'),
    json2model = require('../core/scxml/json2model');

function recursiveConvertJavaStringsToJsStrings(o){
    for(var k in o){
        if(o.hasOwnProperty(k)){
            var v = o[k];
            if(v instanceof Packages.java.lang.String){
                o[k] = String(v);   
            }else if(typeof v === 'object'){
                recursiveConvertJavaStringsToJsStrings(v);
            }
        }
    }
}

function getDb(){
    return Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance().newDocumentBuilder();
}

function urlToModel(url,cb){
    try {
        var doc = getDb().parse(url);
        cb(null,documentToModel(doc));
    }catch(e){
        cb(e);
    }
}

function parseDocumentString(s){
    var db = getDb();
    var is = new Packages.org.xml.sax.InputSource();
    is.setCharacterStream(new Packages.java.io.StringReader(s));

    return db.parse(is);
}

function documentStringToModel(s){
    return documentToModel(parseDocumentString(s));
}

//TODO: move this out, as it is shared code
function documentToModel(doc){
    var arr = JsonML.parseDOM(doc);

    recursiveConvertJavaStringsToJsStrings(arr);

    var scxmlJson = arr[1];

    var annotatedScxmlJson = annotator.transform(scxmlJson);

    var model = json2model(annotatedScxmlJson); 

    return model;
}

//setup environment
(function(){
    var timer = new Packages.java.util.Timer();
    var counter = 1; 
    var ids = {};

    scxml.SimpleInterpreter.prototype._setTimeout = function (fn,delay) {
        var id = counter++;
        ids[id] = new Packages.java.util.TimerTask({run: fn});
        timer.schedule(ids[id],delay);
        return id;
    };

    scxml.SimpleInterpreter.prototype._clearTimeout = function (id) {
        ids[id].cancel();
        timer.purge();
        delete ids[id];
    };
})();

scxml.SimpleInterpreter.prototype._log = function(){
    for(var i=0; i < arguments.length; i++){
        Packages.java.lang.System.out.println(arguments[i]);
    }
};

module.exports = {
    pathToModel : urlToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter
};
}, "scion": function(exports, require, module) {//this module provides a single point of access to all important user-facing modules in scion,
//and detects the environment, exposing an environment-specific module.

//FIXME: this might be a good candidate to apply inversion of control, 
//to facilitate extension by the user without patching this file.

function isRhino(){
    return typeof Packages !== "undefined";
}

function isNode(){
    return typeof process !== "undefined" && typeof module !== "undefined";
}

function isBrowser(){
    return typeof window !== "undefined" && typeof document !== "undefined";
}

if(isRhino()){
    module.exports = require('./rhino/SCXML');
}else if(isNode()){
    module.exports = require('./node/SCXML');
}else if(isBrowser()){
    module.exports = require('./browser/SCXML');
}else{
    //something else, perhaps a spartan shell environment
    module.exports = {
        annotator : require('./util/annotate-scxml-json'),
        json2model : require('./scxml/json2model'),
        scxml : require('./scxml/SCXML')
    };
}
}});
