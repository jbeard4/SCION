
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
    /** @expose */
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
}, "browser/dom": function(exports, require, module) {/*
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

"use strict";

var baseDom = require('../embedded/dom');

function getItem(nodeList,index){
    return "item" in nodeList ? nodeList.item(index) : nodeList[index];
} 

var dom = Object.create(baseDom);

dom.hasAttribute = function(node,attribute){
    return node.hasAttribute ? node.hasAttribute(attribute) : node.getAttribute(attribute);
};

dom.localName = function(node){
    return node.localName || node.tagName;
};

dom.createElementNS = function(doc,ns,localName){
    return doc.createElementNS ? doc.createElementNS(ns,localName) : doc.createElement(localName);
};

dom.getChildren = function(node){
    var toReturn = [];
    for(var i = 0; i < node.childNodes.length; i++){
        toReturn.push(getItem(node.childNodes,i));
    }
    return toReturn;
};

module.exports = dom;
}, "browser/platform": function(exports, require, module) {/*
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

"use strict";

var util = require('../core/util/util'),
    basePlatform = require('../embedded/platform').platform;

//browser mostly just inherits path from basePlatform
exports.platform = util.merge(Object.create(basePlatform),{

    /** @expose */
    ajax : window.jQuery,   //this can be overridden

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
    },

    url : require('./url'),
    dom : require('./dom')

});

}, "browser/url": function(exports, require, module) {/*
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

"use strict";

//this url parsing technique is derived from http://james.padolsey.com/javascript/parsing-urls-with-the-dom/

function createAnchor(url){
    var a =  document.createElement('a');
    a.href = url;
    return a;
}

module.exports = {
    getPathFromUrl : function(url){
        var a = createAnchor(url);
        return a.pathname;
    },

    changeUrlPath : function(url,newPath){
        var a = createAnchor(url);
        return a.protocol + "//" + a.hostname + ":" + a.port + newPath;
    }
};


}, "core/constants": function(exports, require, module) {/*
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

"use strict";

module.exports = {
    SCXML_NS : "http://www.w3.org/2005/07/scxml"
};
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
                (module.parent && module.parent.parent && module.parent.parent.require) || 
                (require.main && require.main.require) ||
                require;

        //set up scope for action code embedded in the document
        var tmp = this.model.actionFactory(
            this.opts.log,
            this._cancel.bind(this),
            this._send.bind(this),
            this.opts.origin,
            this.isIn.bind(this),
            actionCodeRequire);
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

        if (printTrace) pm.platform.log("selecting transitions with eventSet: ", eventSet);

        var selectedTransitions = this._selectTransitions(eventSet, datamodelForNextStep);

        if (printTrace) pm.platform.log("selected transitions: ", selectedTransitions);

        if (!selectedTransitions.isEmpty()) {

            if (printTrace) pm.platform.log("sorted transitions: ", selectedTransitions);

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

                if (printTrace) pm.platform.log("exiting ", state);

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
        var t1LCA = t1.targets ? t1.lca : t1.source;
        var t2LCA = t2.targets ? t2.lca : t2.source;
        var isOrthogonal = this.opts.model.isOrthogonalTo(t1LCA, t2LCA);

        if (printTrace) {
            pm.platform.log("transition LCAs", t1LCA.id, t2LCA.id);
            pm.platform.log("transition LCAs are orthogonal?", isOrthogonal);
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

"use strict";

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

"use strict";

var pm = require('../../platform'),
    cg = require('../util/code-gen');

function linkReferencesAndGenerateActionFactory(json){

    function makeEvaluationFn(action,isExpression){
        return actionStrings.push(cg.gen.util.wrapFunctionBodyInDeclaration(action,isExpression)) - 1;
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

    var actionFactoryString = cg.gen.util.makeActionFactory(json.scripts,actionStrings,json.datamodel); 

    return actionFactoryString;
}

function annotatedJsonToModel(json,documentUrl) {
    var actionFactoryString = linkReferencesAndGenerateActionFactory(json);
    json.actionFactory = pm.platform.eval(actionFactoryString,documentUrl); 
}

module.exports = function(json,documentUrl){
    annotatedJsonToModel(json,documentUrl);
    return json;
};

//TODO: get google closure to compile this out as dead code in the browser build
if(require.main === module){
    var fileName = process.argv[2];

    //this prints out the generated code from a json file which is the output of annotate-scxml-json
    var done = function(err,annotatedJsonStr){
        if(err) throw err;
        process.stdout.write(linkReferencesAndGenerateActionFactory(JSON.parse(annotatedJsonStr)));
    };

    if(fileName === "-"){
        //read from stdin
        var s = "";
        process.stdin.resume();
        process.stdin.on("data",function(data){
            s += data;
        });
        process.stdin.on("end",function(data){
            done(null,s); 
        });
    }else{
        //read from fs
        var fs = require('fs');  
        fs.readFile(fileName,'utf8',done);
    }

}
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

"use strict";

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

"use strict";

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

"use strict";

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

"use strict";

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

"use strict";

module.exports = {
    BASIC: 0,
    COMPOSITE: 1,
    PARALLEL: 2,
    HISTORY: 3,
    INITIAL: 4,
    FINAL: 5
};
}, "core/util/annotate-scxml-json": function(exports, require, module) {/*
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
This module transforms an SCXML document to a proprietary JSON-based intermediate representation.
*/


"use strict";

var codeGen = require('./code-gen'),
    constants = require('../constants'),
    pm = require('../../platform');

var stateKinds = require("../scxml/state-kinds-enum");

var STATES_THAT_CAN_BE_CHILDREN = ["state", "parallel", "history", "final", "initial"],
    STATE_TAGS = STATES_THAT_CAN_BE_CHILDREN.concat("scxml");


var states, basicStates, uniqueEvents, transitions, idToStateMap, onFoundStateIdCallbacks, datamodel, doc;

var transformAndSerialize = exports.transformAndSerialize = transformAndSerialize = function(root) {
    return JSON.stringify(transform(root));
};

var transform = exports.transform = function(scxmlDoc) {

    doc = scxmlDoc;

    var root = doc.documentElement;

    states = [];
    basicStates = [];
    uniqueEvents = {};
    transitions = [];
    idToStateMap = {};
    onFoundStateIdCallbacks = [];
    datamodel = {};

    var rootState = transformStateNode(root, []);

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
        scripts: genRootScripts(root),
        profile: pm.platform.dom.getAttribute(root,"profile"),
        version: pm.platform.dom.getAttribute(root,"version"),
        datamodel: datamodel
    };
};

function genRootScripts(root) {
    return pm.platform.dom.getChildren(root).filter(function(c){return pm.platform.dom.localName(c) === "script";}).map(function(c){return c.textContent;});
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

    //wildcard "*" event will show up on transition.events, but will not show up in uniqueEvents
    //default transitions (those without events) will have events set to undefined (rather than empty array)
    if (pm.platform.dom.hasAttribute(transitionNode,'event')) {
        var events;

        var event = pm.platform.dom.getAttribute(transitionNode,'event');
        if (event === "*") {
            events = [event];
        } else {
            events = event.trim().split(/\s+/).map(function(event){
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
        cond: pm.platform.dom.getAttribute(transitionNode,"cond"),
        events: events,
        targets: pm.platform.dom.hasAttribute(transitionNode,"target") ? pm.platform.dom.getAttribute(transitionNode,"target").trim().split(/\s+/) : null
    };

    if(pm.platform.dom.getElementChildren(transitionNode).length) transition.actions = codeGen.gen.parentToFnBody(transitionNode);

    transitions.push(transition);

    //set up LCA later
    
    return transition;
}

function transformDatamodel(node, ancestors) {
    pm.platform.dom.getChildren(node).filter(function(child){return pm.platform.dom.localName(child) === 'data';}).forEach(function(child){
        if (pm.platform.dom.hasAttribute(child,"id")) {
            datamodel[pm.platform.dom.getAttribute(child,"id")] = pm.platform.dom.hasAttribute(child,"expr") ? pm.platform.dom.getAttribute(child,"expr") : null;
        }
    });
}

function transformStateNode(node, ancestors) {
    var id = pm.platform.dom.hasAttribute(node,"id") ? pm.platform.dom.getAttribute(node,"id") :  genId(pm.platform.dom.localName(node));
    var kind; 

    switch (pm.platform.dom.localName(node)) {
        case "state":
            if( pm.platform.dom.getChildren(node).filter(function(child){return STATE_TAGS.indexOf(pm.platform.dom.localName(child)) > -1;}).length){
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
        state.isDeep = pm.platform.dom.getAttribute(node,"type") === "deep" ? true : false;
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

    //process all sub-elements
    pm.platform.dom.getElementChildren(node).forEach(function(child){

        //var tuple = util.deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        switch (pm.platform.dom.localName(child)) {
            case "transition":
                transitionChildren.push(transformTransitionNode(child, state));
                break;
            case "onentry":
                onEntryChildren = codeGen.gen.parentToFnBody(child);
                break;
            case "onexit":
                onExitChildren = codeGen.gen.parentToFnBody(child);
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
                if(STATES_THAT_CAN_BE_CHILDREN.indexOf(pm.platform.dom.localName(child)) > -1){
                    var transformedStateNode = transformStateNode(child, nextAncestors);
                    //this is used to set default initial state, if initial state is not specified
                    if (firstStateChild === null) firstStateChild = transformedStateNode;
                    stateChildren.push(transformedStateNode);
                }
                break;
        }

    });

    if (!processedInitial && pm.platform.dom.localName(node) !== "parallel") {
        var hasInitialAttribute = pm.platform.dom.hasAttribute(node,"initial");

        //create a fake initial state and process him
        var generateFakeInitialState = function(targetId) {
            var initial = pm.platform.dom.createElementNS(doc,constants.SCXML_NS,"initial");
            var transition = pm.platform.dom.createElementNS(doc,constants.SCXML_NS,"transition");
            pm.platform.dom.setAttribute(transition,"target",targetId); 
            pm.platform.dom.appendChild(initial,transition);

            return processInitialState(initial);
        };

        if (hasInitialAttribute) {
            generateFakeInitialState(pm.platform.dom.getAttribute(node,"initial"));
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

//epic one-liner
//this script can be called as a main script to convert an xml file to annotated scxml.
//TODO: get google closure to compile this out as dead code in the browser build
if(require.main === module) console.log(JSON.stringify(transform((new (require('xmldom').DOMParser)).parseFromString(require('fs').readFileSync(process.argv[2],'utf8'))),4,4));
}, "core/util/code-gen": function(exports, require, module) {/*
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

//this model handles code generation for action code
//it should be possible to extend this to support custom actions

"use strict";

var pm = require('../../platform'),
    constants = require('../constants');

function parentToFnBody(action){
    return pm.platform.dom.getElementChildren(action).map(actionTagToFnBody).join("\n;;\n");
}

function actionTagToFnBody(action){

    var generator = actionTags[pm.platform.dom.namespaceURI(action)];
    var generatorFn = generator && generator[pm.platform.dom.localName(action)];

    if(!(generator && generatorFn)) throw new Error("Element " + pm.platform.dom.namespaceURI(action) + ':' + pm.platform.dom.localName(action) + " not yet supported");

    return generatorFn(action); 
}

var actionTags = {
    "" : {
        "script" : function(action){
            return pm.platform.dom.getChildren(action).map(function(c){return pm.platform.dom.textContent(c);}).join("\n;;\n");
        },

        "assign" : function(action){
            return pm.platform.dom.getAttribute(action,"location") + " = " + pm.platform.dom.getAttribute(action,"expr") + ";";
        },

        "if" : function(action){
            var s = "";
            s += "if(" + pm.platform.dom.getAttribute(action,"cond") + "){\n";

            var childNodes = pm.platform.dom.getElementChildren(action);

            for(var i = 0; i < childNodes.length; i++){
                var child = childNodes[i];

                if(pm.platform.dom.localName(child) === "elseif" || pm.platform.dom.localName(child) === "else"){ 
                    break;
                }else{
                    s += actionTagToFnBody(child) + "\n;;\n";
                }
            }

            //process if/else-if, and recurse
            for(; i < childNodes.length; i++){
                child = childNodes[i];

                if(pm.platform.dom.localName(child) === "elseif"){
                    s+= "}else if(" + pm.platform.dom.getAttribute(child,"cond") + "){\n";
                }else if(pm.platform.dom.localName(child) === "else"){
                    s += "}";
                    break;
                }else{
                    s+= actionTagToFnBody(child)  + "\n;;\n";
                }
            }

            for(; i < childNodes.length; i++){
                child = childNodes[i];

                //this should get encountered first
                if(pm.platform.dom.localName(child) === "else"){
                    s+= "else{\n";
                }else{
                    s+= actionTagToFnBody(child)  + "\n;;\n";
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

        "log" : function(action){
            var params = [];

            if(pm.platform.dom.hasAttribute(action,"label")) params.push( JSON.stringify(pm.platform.dom.getAttribute(action,"label")));
            if(pm.platform.dom.hasAttribute(action,"expr")) params.push( pm.platform.dom.getAttribute(action,"expr"));

            return "$log(" + params.join(",") + ");";
        },

        "raise" : function(action){
            return "$raise(" + JSON.stringify(pm.platform.dom.getAttribute(action,"event")) + ");";
        },

        "cancel" : function(action){
            return "$cancel(" + JSON.stringify(pm.platform.dom.getAttribute(action,"sendid")) + ");";
        },

        "send" : function(action){
            return "$send({\n" + 
                "target: " + (pm.platform.dom.hasAttribute(action,"targetexpr") ? pm.platform.dom.getAttribute(action,"targetexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"target"))) + ",\n" +
                "name: " + (pm.platform.dom.hasAttribute(action,"eventexpr") ? pm.platform.dom.getAttribute(action,"eventexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"event"))) + ",\n" + 
                "type: " + (pm.platform.dom.hasAttribute(action,"typeexpr") ? pm.platform.dom.getAttribute(action,"typeexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"type"))) + ",\n" +
                "data: " + constructSendEventData(action) + ",\n" +
                "origin: $origin\n" +
            "}, {\n" + 
                "delay: " + (pm.platform.dom.hasAttribute(action,"delayexpr") ? pm.platform.dom.getAttribute(action,"delayexpr") : getDelayInMs(pm.platform.dom.getAttribute(action,"delay"))) + ",\n" + 
                "sendId: " + (pm.platform.dom.hasAttribute(action,"idlocation") ? pm.platform.dom.getAttribute(action,"idlocation") : JSON.stringify(pm.platform.dom.getAttribute(action,"id"))) + "\n" + 
            "});";
        },

        "foreach" : function(action){
            var isIndexDefined = pm.platform.dom.hasAttribute(action,"index"),
                index = pm.platform.dom.getAttribute(action,"index") || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
                item = pm.platform.dom.getAttribute(action,"item"),
                arr = pm.platform.dom.getAttribute(action,"array");

            return "(function(){\n" + 
                "for(" + (isIndexDefined  ? "" : "var " + index + " = 0") + "; " + index + " < " + arr + ".length; " + index + "++){\n" + 
                    item + " = " + arr + "[" + index + "];\n" + 
                    pm.platform.dom.getElementChildren(action).map(actionTagToFnBody).join("\n;;\n") + 
                "\n}\n" + 
            "})();";
        }
    }
};

actionTags[constants.SCXML_NS] = actionTags[""];   //alias SCXML namespace to default namespace

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

//utility functions
//this creates the string which declares the datamodel in the document scope
function makeDatamodelDeclaration(datamodel){
    var s = "var ";
    var vars = [];
    for(var id in datamodel){
        var expr = datamodel[id];
        vars.push(expr ? id + " = " + expr : id);
    }
    return vars.length ? (s + vars.join(", ") + ";") : "";
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

function wrapFunctionBodyInDeclaration(action,isExpression){
    return "function(getData,setData,_events,$raise){var _event = _events[0];\n" +
        (isExpression ? "return" : "") + " " + action + 
    "\n}";
}


function makeTopLevelFunctionBody(datamodelDeclaration,topLevelScripts,datamodelClosures,actionStrings){
    return  datamodelDeclaration + 
            (topLevelScripts.length ? topLevelScripts.join("\n") : "") + 
            "return {\n" + 
                "datamodel:" + datamodelClosures + "," + 
                "actions:[\n" + actionStrings.join(",\n") + "\n]" +   //return all functions which get called during execution
            "\n};";
}

function wrapTopLevelFunctionBodyInDeclaration(fnBody){
    return "function($log,$cancel,$send,$origin,In,require){\n" + fnBody + "\n}";
}

//this function ensures that the code in each SCXML document will run in "document scope".
//SCXML embeds js code as strings in the document, hence the use of "eval" to dynamically evaluate things.
//This function ensures that eval() is only called once, when the model is parsed. It will not be called during execution of the statechart.
//However, each SCXML interpreter instance will have its own copies of the functions declared in the document. 
//This is similar to the way HTML works - each page has its own copies of evaluated scripts.
function makeActionFactory(topLevelScripts,actionStrings,datamodel){
    var datamodelDeclaration = makeDatamodelDeclaration(datamodel);
    var datamodelClosures = makeDatamodelClosures(datamodel);
    var topLevelFnBody = makeTopLevelFunctionBody(datamodelDeclaration,topLevelScripts,datamodelClosures,actionStrings);
    var fnStr = wrapTopLevelFunctionBodyInDeclaration(topLevelFnBody);
    return fnStr; 
}


function constructSendEventData(action){

    var namelist = pm.platform.dom.hasAttribute(action,"namelist") ? pm.platform.dom.getAttribute(action,"namelist").trim().split(/ +/) : null,
        params = pm.platform.dom.getChildren(action).filter(function(child){return pm.platform.dom.localName(child) === 'param';}),
        content = pm.platform.dom.getChildren(action).filter(function(child){return pm.platform.dom.localName(child) === 'content';});
        
    if(content.length){
        //TODO: instead of using textContent, serialize the XML
        return JSON.stringify(content.map(function(child){return pm.platform.dom.textContent(child);})[0]);
    }else if(pm.platform.dom.hasAttribute(action,"contentexpr")){
        return pm.platform.dom.getAttribute(action,"contentexpr");
    }else{
        var s = "{";
        //namelist
        if(namelist){
            namelist.forEach(function(name){
                s += '"' + name + '"' + ":" + name + ",\n";
            });
        }

        //params
        if(params.length){
            params.map(function(child){return processParam(child);}).forEach(function(param){
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
    return {
        name: pm.platform.dom.getAttribute(param,"name"),
        expr: pm.platform.dom.getAttribute(param,"expr"),
        location: pm.platform.dom.getAttribute(param,"location")
    };
}


module.exports = {
    gen : {
        parentToFnBody : parentToFnBody,
        actionTagToFnBody  : actionTagToFnBody,
        actionTags : actionTags,
        util : {
            makeDatamodelDeclaration : makeDatamodelDeclaration,
            makeDatamodelClosures : makeDatamodelClosures,
            wrapFunctionBodyInDeclaration : wrapFunctionBodyInDeclaration,
            makeTopLevelFunctionBody : makeTopLevelFunctionBody,
            wrapTopLevelFunctionBodyInDeclaration : wrapTopLevelFunctionBodyInDeclaration,
            makeActionFactory : makeActionFactory
        }
    }
};
}, "core/util/docToModel": function(exports, require, module) {/*
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

"use strict";

var annotator = require('./annotate-scxml-json'),
    json2model = require('../scxml/json2model'),
    pm = require('../../platform');

function documentToModel(url,doc,cb){
    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(pm.platform.getResourceFromUrl){
        inlineSrcs(url,doc,function(errors){
            if(errors){ 
                //I think we should probably just log any of these errors
                pm.platform.log("Errors downloading src attributes",errors);
            }
            docToModel(doc,url,cb);
        });
    }else{
        docToModel(doc,url,cb);
    }
}

function docToModel(doc,url,cb){
    try {
        var annotatedScxmlJson = annotator.transform(doc);
        var model = json2model(annotatedScxmlJson,url); 
        cb(null,model);
    }catch(e){
        cb(e);
    }
}

function inlineSrcs(url,doc,cb){
    //console.log('inlining scripts');
    
    var scriptActionsWithSrcAttributes = [], errors = [];

    traverse(doc.documentElement,scriptActionsWithSrcAttributes); 

    //async forEach
    function retrieveScripts(){
        var script = scriptActionsWithSrcAttributes.pop();
        if(script){
            //quick and dirty for now:
            //to be totally correct, what we need to do here is: 
            //parse the url, extract the pathname, call dirname on path, and join that with the path to the file
            var scriptUrl = pm.platform.dom.getAttribute(script,"src");
            if(url){
                var documentUrlPath = pm.platform.url.getPathFromUrl(url);
                var documentDir = pm.platform.path.dirname(documentUrlPath);
                var scriptPath = pm.platform.path.join(documentDir,scriptUrl);
                scriptUrl = pm.platform.url.changeUrlPath(url,scriptPath);
            }
            //platform.log('fetching script src',scriptUrl);
            pm.platform.getResourceFromUrl(scriptUrl,function(err,text){
                if(err){
                    //just capture the error, and continue on
                    errors.push(err); 
                }

                pm.platform.dom.textContent(script,text);
                retrieveScripts();
            });
        }else{
            cb(errors.length ? errors : null);
        }
    }
    retrieveScripts();  //kick him off
}

function traverse(node,nodeList){
    if((pm.platform.dom.localName(node) === 'script' || pm.platform.dom.localName(node) === 'data') && pm.platform.dom.hasAttribute(node,"src")){
        nodeList.push(node); 
    } 

    pm.platform.dom.getElementChildren(node).forEach(function(child){traverse(child,nodeList);});
}


module.exports = documentToModel;
}, "core/util/util": function(exports, require, module) {/*
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

"use strict";

module.exports = {
    merge : function(target){
        for(var i=1; i < arguments.length; i++){
            var from = arguments[i];
            for(var k in from){
                if(from.hasOwnProperty(k)){
                    target[k] = from[k];
                }
            }
        }
        return target;
    }
};
}, "embedded/dom": function(exports, require, module) {/*
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

"use strict";

//a small DOM helper/compatibility layer

module.exports = {

    getChildren : function(node){
        return Array.prototype.slice.call(node.childNodes);
    },

    localName : function(node){
        return node.localName;
    },

    getAttribute : function(node,attribute){
        return node.getAttribute(attribute);  
    },

    hasAttribute : function(node,attribute){
        return node.hasAttribute(attribute);
    },

    namespaceURI : function(node){
        return node.namespaceURI;
    },

    createElementNS : function(doc,ns,localName){
        return doc.createElementNS(ns,localName); 
    },

    setAttribute : function(node,name,value){
        return node.setAttribute(name,value);
    },

    appendChild : function(parent,child){
        return parent.appendChild(child);
    },

    textContent : function(node,txt){
        if(txt === undefined){
            if(node.nodeType === 1){
                //element
                return node.textContent;
            }else if(node.nodeType === 3){
                //textnode
                return node.data;
            }
            return "";
        }else{
            if(node.nodeType === 1){
                //element node
                return node.textContent = txt;
            }else if(node.nodeType === 3){
                //textnode
                return node.data = txt;
            }
        }
    },

    getElementChildren : function(node){
        return this.getChildren(node).filter(function(c){return c.nodeType === 1;});
    }

};
}, "embedded/path": function(exports, require, module) {/*
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

"use strict";

//these are quick-and-dirty implementations
//there may be missing edge cases
module.exports = {

    sep : "/",

    join : function(path1,path2){
        return path1 + "/" + path2;
    },

    dirname : function(path){
        path.split(this.sep).slice(0,-1).join(this.sep);
    },

    basename : function(path,ext){
        var name = path.split(this.sep).slice(-1);
        if(ext){
            var names = this.extname(name);
            if(names[1] === ext){
                name = names[1];
            }
        }

        return name;
    },

    extname : function(path){
        //http://stackoverflow.com/a/4546093/366856
        return path.split(/\\.(?=[^\\.]+$)/)[1];
    }
};
}, "embedded/platform": function(exports, require, module) {/*
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

"use strict";

//this provides an incomplete base platform implementation
//other platform implementations can optionally extend it. 

function parseDocumentFromString(str){
    var xmldom = require('../../external/xmldom/dom-parser');
    return (new xmldom.DOMParser()).parseFromString(str);
}

//most shells will also at least be able to implement: getDocumentFromFilesystem and log 

exports.platform = {
    parseDocumentFromString : parseDocumentFromString,

    eval : function(content,name){
        //JScript doesn't return functions from evaled function expression strings, 
        //so we wrap it here in a trivial self-executing function which gets eval'd
        return eval('(function(){\nreturn ' + content + ';})()');
    },

    path : require('./path'),

    url : require('./url'),

    dom : require('./dom')
    
};
}, "embedded/url": function(exports, require, module) {/*
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

"use strict";

//this base module could be used with jsuri [http://code.google.com/p/jsuri/], a portable, pure-js URI parser implemenation
//currently, none of the "blessed" environments use it, but it could simplify things for embedding
//assume global Uri object
//require('external/jsUri/dist/jsuri');   //this is just to load up a global Uri object

function parseUri(uri){
    /*jsl:ignore*/
    if(typeof Uri === undefined) throw new Error("URI parser not loaded");
    return new Uri(url);
    /*jsl:end*/
}

module.exports = {
    getPathFromUrl : function(url){
        return parseUri(url).path();
    },

    changeUrlPath : function(url,newPath){
        return parseUri(url).path(newPath).toString();
    }
};
}, "platform": function(exports, require, module) {/*
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

"use strict";

function isRhino(){
    return typeof Packages !== "undefined";
}

function isNode(){
    return typeof process !== "undefined" && typeof module !== "undefined";
}

function isBrowser(){
    return typeof window !== "undefined" && typeof document !== "undefined";
}

var platform;

if(isRhino()){
    module.exports = require('./rhino/platform');
}else if(isNode()){
    module.exports = require('./node/platform');
}else if(isBrowser()){
    module.exports = require('./browser/platform');
}else{
    module.exports = require('./embedded/platform');
}
}, "scion": function(exports, require, module) {/*
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

"use strict";

var pm = require('./platform'),
    scxml = require('./core/scxml/SCXML'),
    documentToModel = require('./core/util/docToModel');

function urlToModel(url,cb){
    if(!pm.platform.getDocumentFromUrl) throw new Error("Platform does not support getDocumentFromUrl");

    pm.platform.getDocumentFromUrl(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentToModel(url,doc,cb);
        }
    });
}

function pathToModel(url,cb){
    if(!pm.platform.getDocumentFromFilesystem) throw new Error("Platform does not support getDocumentFromFilesystem");

    pm.platform.getDocumentFromFilesystem(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentToModel(url,doc,cb);
        }
    });
}

function documentStringToModel(s,cb){
    if(!pm.platform.parseDocumentFromString) throw new Error("Platform does not support parseDocumentFromString");

    documentToModel(null,pm.platform.parseDocumentFromString(s),cb);
}

//export standard interface
var scion = module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    SCXML : scxml.SimpleInterpreter,
    ext : {
        platformModule : pm,
        actionCodeGeneratorModule : require('./core/util/code-gen')
    }
};
}});
