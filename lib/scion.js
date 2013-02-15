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

//UMD boilerplate - https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.SCION = factory();
  }
}(this, function () {

    "use strict";

    var STATE_TYPES = {
        BASIC: 0,
        COMPOSITE: 1,
        PARALLEL: 2,
        HISTORY: 3,
        INITIAL: 4,
        FINAL: 5
    };

    function initializeModel(rootState){
        var transitions = [], idToStateMap = {}, documentOrder = 0;

        //TODO: need to add fake ids to anyone that doesn't have them
        //FIXME: make this safer - break into multiple passes
        var idCount = {};

        function generateId(type){
            var count = (idCount[type] && idCount[type]++) || (idCount[type] = 0);
            return '$generated-' + type + '-' + count; 
        }

        function wrapInFakeRootState(state){
            return {
                states : [
                    {
                        type : 'initial',
                        transitions : [{
                            target : state
                        }]
                    },
                    state
                ]
            };
        }

        function traverse(ancestors,state){

            //add to global transition and state id caches
            if(state.transitions) transitions.push.apply(transitions,state.transitions);

            //populate state id map
            if(state.id){
                if(idToStateMap[state.id]) throw new Error('Redefinition of state id ' + state.id);

                idToStateMap[state.id] = state;
            }

            //create a default type, just to normalize things
            //this way we can check for unsupported types below
            state.type = state.type || 'state';

            //add ancestors and depth properties
            state.ancestors = ancestors;
            state.depth = ancestors.length;

            //add some information to transitions
            state.transitions = state.transitions || [];
            state.transitions.forEach(function(transition){
                transition.documentOrder = documentOrder++; 
                transition.source = state;
            });

            var t2 = traverse.bind(null,ancestors.concat(state));

            //recursive step
            if(state.states) state.states.forEach(t2);

            //setup fast state type
            switch(state.type){
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
                    throw new Error('Unknown state type: ' + state.type);
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
                    //dereference him from his 
                    initialChildren = state.states.filter(function(child){
                        return child.id === state.initial;
                    });
                    if(initialChildren.length){
                        state.initialRef = initialChildren[0];
                    } 
                }else{
                    //take the first child that has initial type, or first child
                    initialChildren = state.states.filter(function(child){
                        return child.type === 'initial';
                    });

                    state.initialRef = initialChildren.length ? initialChildren[0] : state.states[0];
                }

                if(!state.initialRef) throw new Error('Unable to locate initial state for composite state: ' + state.id);
            }

            //now it's safe to fill in fake state ids
            if(!state.id){
                state.id = generateId(state.type);
                idToStateMap[state.id] = state;
            }
        }

        //TODO: convert events to regular expressions in advance

        function connectTransitionGraph(){
            transitions.forEach(function(t){
                //normalize "event" attribute into "events" attribute
                if(t.event){
                    t.events = t.event.trim().split(/ */);
                }
            });

            //hook up targets
            transitions.forEach(function(t){
                if(t.target){
                    if(typeof t.target === 'string'){
                        var target = idToStateMap[t.target];
                        if(!target) throw new Error('Unable to find target state with id ' + t.target);
                        t.target = target;
                    }

                    t.targets = [t.target]; //populate t.targets with results

                }else if(t.targets){
                    if(Array.isArray(t.targets)){
                        t.targets = t.targets.map(function(target){
                            if(typeof target === 'string'){
                                target = idToStateMap[target];
                                if(!target) throw new Error('Unable to find target state with id ' + t.target);
                                return target;
                            }else{
                                return target;
                            } 
                        }); 
                    }
                }
            });

            //hook up LCA - optimization
            transitions.forEach(function(t){
                if(t.targets){
                    t.lcca = getLCCA(t.source,t.targets[0]);    //FIXME: we technically do not need to hang onto the lcca. only the scope is used by the algorithm
                    t.scope = getScope(t);
                }
            });
        }

        function getScope(transition){
            //Transition scope is normally the least common compound ancestor (lcca).
            //Internal transitions have a scope equal to the source state.

            var source = idToStateMap[transition.source];

            var transitionIsReallyInternal = 
                    transition.internal &&
                        source.parent &&    //root state won't have parent
                            transition.targets && //does it target its descendants
                                transition.targets.map(function(targetId){return idToStateMap[targetId];}).every(
                                function(target){ return source.descendants.map(function(id){return idToStateMap[id];}).indexOf(target) > -1;});

            if(!transition.targets){
                return transition.source; 
            }else if(transitionIsReallyInternal){
                return transition.source; 
            }else{
                return transition.lcca;
            }
        }

        function getLCCA(s1, s2) {
            var commonAncestors = [];
            s1.ancestors.forEach(function(anc){
                if(anc.descendants.indexOf(s2) > -1){
                    commonAncestors.push(anc);
                }
            });
            if(!commonAncestors.length) throw new Error("Could not find LCA for states.");
            return commonAncestors[0];
        }

        //main execution starts here
        //FIXME: only wrap in root state if it's not a compound state
        var fakeRootState = wrapInFakeRootState(rootState);  //I wish we had pointer semantics and could make this a C-style "out argument". Instead we return him
        traverse([],fakeRootState);
        connectTransitionGraph();

        return fakeRootState;
    }


    /* begin ArraySet */

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

    var scxmlPrefixTransitionSelector = (function(){

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

        return function(state, eventNames, evaluator) {
            return state.transitions.filter(function(t){
                return (!t.events || nameMatch(t,eventNames)) && (!t.cond || evaluator(t));
            });
        };
    })();

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
    function getTransitionWithHigherSourceChildPriority(_arg) {
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
    }

    /** @const */
    var printTrace = true;

    /** @constructor */
    function BaseInterpreter(model, opts){
        this._model = initializeModel(model);
        console.log(require('util').inspect(this._model,false,4));
        this.opts = opts || {};

        this.opts.log = opts.log || (typeof console === 'undefined' ? {log : function(){}}: console.log);   //rely on global console if this console is undefined
        this.opts.Set = this.opts.Set || ArraySet;
        this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority;
        this.opts.transitionSelector = this.opts.transitionSelector || scxmlPrefixTransitionSelector;

        this._sessionid = this.opts.sessionid || "";

        this._configuration = new this.opts.Set();
        this._historyValue = {};
        this._innerEventQueue = [];
        this._isInFinalState = false;
        this._timeoutMap = {};

        this._listeners = [];
    }

    BaseInterpreter.prototype = {

        /** @expose */
        start : function() {
            //perform big step without events to take all default transitions and reach stable initial state
            if (printTrace) this.opts.log("performing initial big step");

            //We effectively need to figure out states to enter here to populate initial config. assuming root is compound state makes this simple.
            //but if we want it to be parallel, then this becomes more complex. so when initializing the model, we add a 'fake' root state, which
            //makes the following operation safe.
            this._configuration.add(this._model.initialRef);   

            this._performBigStep();
            return this.getConfiguration();
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
            if (e) this._innerEventQueue.push(new this.opts.Set([e]));
            var keepGoing = true;
            while (keepGoing) {
                var eventSet = this._innerEventQueue.length ? this._innerEventQueue.shift() : new this.opts.Set();

                var selectedTransitions = this._performSmallStep(eventSet);
                keepGoing = !selectedTransitions.isEmpty();
            }
            this._isInFinalState = this._configuration.iter().every(function(s){ return s.typeEnum === STATE_TYPES.FINAL; });
        },

        /** @private */
        _performSmallStep : function(eventSet) {

            if (printTrace) this.opts.log("selecting transitions with eventSet: ", eventSet);

            var selectedTransitions = this._selectTransitions(eventSet);

            if (printTrace) this.opts.log("selected transitions: ", selectedTransitions);

            if (!selectedTransitions.isEmpty()) {

                if (printTrace) this.opts.log("sorted transitions: ", selectedTransitions);

                //we only want to enter and exit states from transitions with targets
                //filter out targetless transitions here - we will only use these to execute transition actions
                var selectedTransitionsWithTargets = new this.opts.Set(selectedTransitions.iter().filter(function(t){return t.targets;}));

                var exitedTuple = this._getStatesExited(selectedTransitionsWithTargets), 
                    basicStatesExited = exitedTuple[0], 
                    statesExited = exitedTuple[1];

                var enteredTuple = this._getStatesEntered(selectedTransitionsWithTargets), 
                    basicStatesEntered = enteredTuple[0], 
                    statesEntered = enteredTuple[1];

                if (printTrace) this.opts.log("basicStatesExited ", basicStatesExited);
                if (printTrace) this.opts.log("basicStatesEntered ", basicStatesEntered);
                if (printTrace) this.opts.log("statesExited ", statesExited);
                if (printTrace) this.opts.log("statesEntered ", statesEntered);

                var eventsToAddToInnerQueue = new this.opts.Set();

                //update history states
                if (printTrace) this.opts.log("executing state exit actions");

                statesExited.forEach(function(state){

                    if (printTrace || this.opts.logStatesEnteredAndExited) this.opts.log("exiting ", state.id);

                    //invoke listeners
                    this._listeners.forEach(function(l){
                       if(l.onExit) l.onExit(state.id); 
                    });

                    if(state.onexit !== undefined) this._evaluateAction(state.onexit,eventSet, eventsToAddToInnerQueue);

                    var f;
                    if (state.history) {
                        if (state.history.isDeep) {
                            f = function(s0) {
                                return s0.typeEnum === STATE_TYPES.BASIC && state.descendants.indexOf(s0) > -1;
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

                if (printTrace) this.opts.log("executing transitition actions");


                sortedTransitions.forEach(function(transition){

                    var targetIds = transition.targets && transition.targets.map(function(target){return target.id;});

                    this._listeners.forEach(function(l){
                       if(l.onTransition) l.onTransition(transition.source.id,targetIds); 
                    });

                    if(transition.actions !== undefined) this._evaluateAction(transition.actions,eventSet, eventsToAddToInnerQueue);
                },this);
     
                if (printTrace) this.opts.log("executing state enter actions");

                statesEntered.forEach(function(state){

                    if (printTrace || this.opts.logStatesEnteredAndExited) this.opts.log("entering", state.id);

                    this._listeners.forEach(function(l){
                       if(l.onEntry) l.onEntry(state.id); 
                    });

                    if(state.onentry !== undefined) this._evaluateAction(state.onentry, eventSet, eventsToAddToInnerQueue);
                },this);

                if (printTrace) this.opts.log("updating configuration ");
                if (printTrace) this.opts.log("old configuration ", this._configuration);

                //update configuration by removing basic states exited, and adding basic states entered
                this._configuration.difference(basicStatesExited);
                this._configuration.union(basicStatesEntered);

                if (printTrace) this.opts.log("new configuration ", this._configuration);
                
                //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
                if (!eventsToAddToInnerQueue.isEmpty()) {
                    if (printTrace) this.opts.log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                    this._innerEventQueue.push(eventsToAddToInnerQueue);
                }

            }

            //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
            return selectedTransitions;
        },

        /** @private */
        _evaluateAction : function(actionRef, eventSet, eventsToAddToInnerQueue) {
            function $raise(event){
                eventsToAddToInnerQueue.add(event);
            }

            //FIXME: we may actually need to use call() here
            //think about how to expose _events/_event as global
            //FIXME: think about how we want to use *this*
            actionRef(eventSet.iter(), $raise);
        },

        /** @private */
        _getStatesExited : function(transitions) {
            var statesExited = new this.opts.Set();
            var basicStatesExited = new this.opts.Set();

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
                        query.getAncestors(state,scope).forEach(function(anc){
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
                statesToEnter : new this.opts.Set(),
                basicStatesToEnter : new this.opts.Set(),
                statesProcessed  : new this.opts.Set(),
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
            query.getAncestors(target,scope).forEach(function(s){

                if (s.typeEnum === STATE_TYPES.COMPOSITE) {
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
                        s.children.filter(function(s){return s.typeEnum !== STATE_TYPES.HISTORY;}));
                } else if (s.typeEnum === STATE_TYPES.COMPOSITE) {
                    o.statesToProcess.push(s.initialRef); 
                } else if (s.typeEnum === STATE_TYPES.INITIAL || s.typeEnum === STATE_TYPES.BASIC || s.typeEnum === STATE_TYPES.FINAL) {
                    o.basicStatesToEnter.add(s);
                }
            }

            o.statesProcessed.add(s); 
        },

        /** @private */
        _selectTransitions : function(eventSet) {
            if (this.opts.onlySelectFromBasicStates) {
                var states = this._configuration.iter();
            } else {
                var statesAndParents = new this.opts.Set;

                //get full configuration, unordered
                //this means we may select transitions from parents before children
                
                this._configuration.iter().forEach(function(basicState){
                    statesAndParents.add(basicState);
                    query.getAncestors(basicState).forEach(function(ancestor){
                        statesAndParents.add(ancestor);
                    });
                },this);

                states = statesAndParents.iter();
            }

            
            var e = function(t) { return t.conditionActionRef(eventSet.iter()); };
            var eventNames = eventSet.iter().map(function(event){return event.name;});

            var usePrefixMatchingAlgorithm = eventNames.filter(function(name){return name.search(".");}).length;

            var transitionSelector = usePrefixMatchingAlgorithm ? scxmlPrefixTransitionSelector : this.opts.transitionSelector;
            var enabledTransitions = new this.opts.Set();

            states.forEach(function(state){
                transitionSelector(state,eventNames,e).forEach(function(t){
                    enabledTransitions.add(t);
                });
            });

            var priorityEnabledTransitions = this._selectPriorityEnabledTransitions(enabledTransitions);

            if (printTrace) this.opts.log("priorityEnabledTransitions", priorityEnabledTransitions);
            
            return priorityEnabledTransitions;
        },

        /** @private */
        _selectPriorityEnabledTransitions : function(enabledTransitions) {
            var priorityEnabledTransitions = new this.opts.Set();

            var tuple = this._getInconsistentTransitions(enabledTransitions), 
                consistentTransitions = tuple[0], 
                inconsistentTransitionsPairs = tuple[1];

            priorityEnabledTransitions.union(consistentTransitions);

            if (printTrace) this.opts.log("enabledTransitions", enabledTransitions);
            if (printTrace) this.opts.log("consistentTransitions", consistentTransitions);
            if (printTrace) this.opts.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
            if (printTrace) this.opts.log("priorityEnabledTransitions", priorityEnabledTransitions);
            
            while (!inconsistentTransitionsPairs.isEmpty()) {
                enabledTransitions = new this.opts.Set(
                        inconsistentTransitionsPairs.iter().map(function(t){return this.opts.priorityComparisonFn(t);},this));

                tuple = this._getInconsistentTransitions(enabledTransitions);
                consistentTransitions = tuple[0]; 
                inconsistentTransitionsPairs = tuple[1];

                priorityEnabledTransitions.union(consistentTransitions);

                if (printTrace) this.opts.log("enabledTransitions", enabledTransitions);
                if (printTrace) this.opts.log("consistentTransitions", consistentTransitions);
                if (printTrace) this.opts.log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
                if (printTrace) this.opts.log("priorityEnabledTransitions", priorityEnabledTransitions);
                
            }
            return priorityEnabledTransitions;
        },

        /** @private */
        _getInconsistentTransitions : function(transitions) {
            var allInconsistentTransitions = new this.opts.Set();
            var inconsistentTransitionsPairs = new this.opts.Set();
            var transitionList = transitions.iter();

            if (printTrace) this.opts.log("transitions", transitionList);

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
            var isOrthogonal = query.isOrthogonalTo(t1.scope, t2.scope);

            if (printTrace) {
                this.opts.log("transition scopes", t1.scope.id, t1.scope.id);
                this.opts.log("transition scopes are orthogonal?", isOrthogonal);
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
     * @extends BaseInterpreter
     */
    function Statechart(model, opts) {
        opts = opts || {};

        this._isStepping = false;

        this.send = opts.send || this.send;

        this.cancel = opts.cancel || this.cancel;

        BaseInterpreter.call(this,model,opts);     //call super constructor
    }
    Statechart.prototype = Object.create(BaseInterpreter.prototype);

    /** @expose */
    Statechart.prototype.gen = function(evtObjOrName,optionalData) {

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

    /** @expose */
    //include default implementations of send and cancel, which should work in most supported environments
    Statechart.prototype.send = function(event, options) {

        if( typeof setTimeout === 'undefined' ) throw new Error('Default implementation of Statechart.prototype.send will not work unless setTimeout is defined globally.');


        if (printTrace) this.opts.log("sending event", event.name, "with content", event.data, "after delay", options.delay);

        var timeoutId = setTimeout(this.gen.bind(this,event), options.delay || 0);

        if (options.sendid) return this._timeoutMap[options.sendid] = timeoutId;
    };

    /** @expose */
    Statechart.prototype.cancel = function(sendid){

        if( typeof clearTimeout === 'undefined' ) throw new Error('Default implementation of Statechart.prototype.cancel will not work unless setTimeout is defined globally.');

        if (sendid in this._timeoutMap) {
            if (printTrace) this.opts.log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
            clearTimeout(this._timeoutMap[sendid]);
        }
    };

    return {
        /** @expose */
        BaseInterpreter: BaseInterpreter,
        /** @expose */
        Statechart: Statechart,
        /** @expose */
        ArraySet : ArraySet,
        /** @expose */
        STATE_TYPES : STATE_TYPES,
        /** @expose */
        initializeModel : initializeModel
    };
}));
