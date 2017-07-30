(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'util'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('util'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.util);
        global.scion = mod.exports;
    }
})(this, function (module, util) {
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

    "use strict";

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var extend = Object.assign || function (to, from) {
        Object.keys(from).forEach(function (k) {
            to[k] = from[k];
        });
        return to;
    };

    var STATE_TYPES = {
        BASIC: 0,
        COMPOSITE: 1,
        PARALLEL: 2,
        HISTORY: 3,
        INITIAL: 4,
        FINAL: 5
    };

    var SCXML_IOPROCESSOR_TYPE = 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor';
    var HTTP_IOPROCESSOR_TYPE = 'http://www.w3.org/TR/scxml/#BasicHTTPEventProcessor';

    function transitionWithTargets(t) {
        return t.targets;
    }

    function transitionComparator(t1, t2) {
        return t1.documentOrder - t2.documentOrder;
    }

    function initializeModel(rootState) {
        var transitions = [],
            idToStateMap = new Map(),
            documentOrder = 0;

        //TODO: need to add fake ids to anyone that doesn't have them
        //FIXME: make this safer - break into multiple passes
        var idCount = {};

        function generateId(type) {
            if (idCount[type] === undefined) idCount[type] = 0;

            var count = idCount[type]++;
            return '$generated-' + type + '-' + count;
        }

        function wrapInFakeRootState(state) {
            return {
                $deserializeDatamodel: state.$deserializeDatamodel || function () {},
                $serializeDatamodel: state.$serializeDatamodel || function () {
                    return null;
                },
                $idToStateMap: idToStateMap, //keep this for handy deserialization of serialized configuration
                states: [{
                    $type: 'initial',
                    transitions: [{
                        target: state
                    }]
                }, state]
            };
        }

        var statesWithInitialAttributes = [];

        function transitionToString(sourceState) {
            return sourceState + ' -- ' + (this.events ? '(' + this.events.join(',') + ')' : null) + (this.cond ? '[' + this.cond.name + ']' : '') + ' --> ' + (this.targets ? this.targets.join(',') : null);
        }

        function stateToString() {
            return this.id;
        }

        function traverse(ancestors, state) {

            if (printTrace) state.toString = stateToString;

            //add to global transition and state id caches
            if (state.transitions) transitions.push.apply(transitions, state.transitions);

            //populate state id map
            if (state.id) {
                if (idToStateMap.has(state.id)) throw new Error('Redefinition of state id ' + state.id);

                idToStateMap.set(state.id, state);
            }

            //create a default type, just to normalize things
            //this way we can check for unsupported types below
            state.$type = state.$type || 'state';

            //add ancestors and depth properties
            state.ancestors = ancestors;
            state.depth = ancestors.length;
            state.parent = ancestors[0];
            state.documentOrder = documentOrder++;

            //add some information to transitions
            state.transitions = state.transitions || [];
            for (var j = 0, len = state.transitions.length; j < len; j++) {
                var transition = state.transitions[j];
                transition.documentOrder = documentOrder++;
                transition.source = state;
                if (printTrace) transition.toString = transitionToString.bind(transition, state);
            };

            //recursive step
            if (state.states) {
                var ancs = [state].concat(ancestors);
                for (var j = 0, len = state.states.length; j < len; j++) {
                    traverse(ancs, state.states[j]);
                }
            }

            //setup fast state type
            switch (state.$type) {
                case 'parallel':
                    state.typeEnum = STATE_TYPES.PARALLEL;
                    state.isAtomic = false;
                    break;
                case 'initial':
                    state.typeEnum = STATE_TYPES.INITIAL;
                    state.isAtomic = true;
                    break;
                case 'history':
                    state.typeEnum = STATE_TYPES.HISTORY;
                    state.isAtomic = true;
                    break;
                case 'final':
                    state.typeEnum = STATE_TYPES.FINAL;
                    state.isAtomic = true;
                    break;
                case 'state':
                case 'scxml':
                    if (state.states && state.states.length) {
                        state.typeEnum = STATE_TYPES.COMPOSITE;
                        state.isAtomic = false;
                    } else {
                        state.typeEnum = STATE_TYPES.BASIC;
                        state.isAtomic = true;
                    }
                    break;
                default:
                    throw new Error('Unknown state type: ' + state.$type);
            }

            //descendants property on states will now be populated. add descendants to this state
            if (state.states) {
                state.descendants = state.states.concat(state.states.map(function (s) {
                    return s.descendants;
                }).reduce(function (a, b) {
                    return a.concat(b);
                }, []));
            } else {
                state.descendants = [];
            }

            var initialChildren;
            if (state.typeEnum === STATE_TYPES.COMPOSITE) {
                //set up initial state

                if (Array.isArray(state.initial) || typeof state.initial === 'string') {
                    statesWithInitialAttributes.push(state);
                } else {
                    //take the first child that has initial type, or first child
                    initialChildren = state.states.filter(function (child) {
                        return child.$type === 'initial';
                    });

                    state.initialRef = [initialChildren.length ? initialChildren[0] : state.states[0]];
                    checkInitialRef(state);
                }
            }

            //hook up history
            if (state.typeEnum === STATE_TYPES.COMPOSITE || state.typeEnum === STATE_TYPES.PARALLEL) {

                var historyChildren = state.states.filter(function (s) {
                    return s.$type === 'history';
                });

                state.historyRef = historyChildren;
            }

            //now it's safe to fill in fake state ids
            if (!state.id) {
                state.id = generateId(state.$type);
                idToStateMap.set(state.id, state);
            }

            //normalize onEntry/onExit, which can be single fn or array, or array of arrays (blocks)
            ['onEntry', 'onExit'].forEach(function (prop) {
                if (state[prop]) {
                    if (!Array.isArray(state[prop])) {
                        state[prop] = [state[prop]];
                    }
                    if (!state[prop].every(function (handler) {
                        return Array.isArray(handler);
                    })) {
                        state[prop] = [state[prop]];
                    }
                }
            });

            if (state.invokes && !Array.isArray(state.invokes)) {
                state.invokes = [state.invokes];
                state.invokes.forEach(function (invoke) {
                    if (invoke.finalize && !Array.isArray(invoke.finalize)) {
                        invoke.finalize = [invoke.finalize];
                    }
                });
            }
        }

        //TODO: convert events to regular expressions in advance

        function checkInitialRef(state) {
            if (!state.initialRef) throw new Error('Unable to locate initial state for composite state: ' + state.id);
        }
        function connectIntialAttributes() {
            for (var j = 0, len = statesWithInitialAttributes.length; j < len; j++) {
                var s = statesWithInitialAttributes[j];

                var initialStates = Array.isArray(s.initial) ? s.initial : [s.initial];
                s.initialRef = initialStates.map(function (initialState) {
                    return idToStateMap.get(initialState);
                });
                checkInitialRef(s);
            }
        }

        var RX_WHITESPACE = /\s+/;

        function connectTransitionGraph() {
            //normalize as with onEntry/onExit
            for (var i = 0, len = transitions.length; i < len; i++) {
                var t = transitions[i];
                if (t.onTransition && !Array.isArray(t.onTransition)) {
                    t.onTransition = [t.onTransition];
                }

                //normalize "event" attribute into "events" attribute
                if (typeof t.event === 'string') {
                    t.events = t.event.trim().split(RX_WHITESPACE);
                }
                delete t.event;

                if (t.targets || typeof t.target === 'undefined') {
                    //targets have already been set up
                    continue;
                }

                if (typeof t.target === 'string') {
                    var target = idToStateMap.get(t.target);
                    if (!target) throw new Error('Unable to find target state with id ' + t.target);
                    t.target = target;
                    t.targets = [t.target];
                } else if (Array.isArray(t.target)) {
                    t.targets = t.target.map(function (target) {
                        if (typeof target === 'string') {
                            target = idToStateMap.get(target);
                            if (!target) throw new Error('Unable to find target state with id ' + t.target);
                            return target;
                        } else {
                            return target;
                        }
                    });
                } else if (_typeof(t.target) === 'object') {
                    t.targets = [t.target];
                } else {
                    throw new Error('Transition target has unknown type: ' + t.target);
                }
            }

            //hook up LCA - optimization
            for (var i = 0, len = transitions.length; i < len; i++) {
                var t = transitions[i];
                if (t.targets) t.lcca = getLCCA(t.source, t.targets[0]); //FIXME: we technically do not need to hang onto the lcca. only the scope is used by the algorithm

                t.scope = getScope(t);
            }
        }

        function getScope(transition) {
            //Transition scope is normally the least common compound ancestor (lcca).
            //Internal transitions have a scope equal to the source state.
            var transitionIsReallyInternal = transition.type === 'internal' && transition.source.typeEnum === STATE_TYPES.COMPOSITE && //is transition source a composite state
            transition.source.parent && //root state won't have parent
            transition.targets && //does it target its descendants
            transition.targets.every(function (target) {
                return transition.source.descendants.indexOf(target) > -1;
            });

            if (!transition.targets) {
                return null;
            } else if (transitionIsReallyInternal) {
                return transition.source;
            } else {
                return transition.lcca;
            }
        }

        function getLCCA(s1, s2) {
            var commonAncestors = [];
            for (var j = 0, len = s1.ancestors.length; j < len; j++) {
                var anc = s1.ancestors[j];
                if (anc.typeEnum === STATE_TYPES.COMPOSITE && anc.descendants.indexOf(s2) > -1) {
                    commonAncestors.push(anc);
                }
            };
            if (!commonAncestors.length) throw new Error("Could not find LCA for states.");
            return commonAncestors[0];
        }

        //main execution starts here
        //FIXME: only wrap in root state if it's not a compound state
        var fakeRootState = wrapInFakeRootState(rootState); //I wish we had pointer semantics and could make this a C-style "out argument". Instead we return him
        traverse([], fakeRootState);
        connectTransitionGraph();
        connectIntialAttributes();

        return fakeRootState;
    }

    /* begin tiny-events: https://github.com/ZauberNerd/tiny-events */
    function EventEmitter() {
        this._listeners = {};
        this._listeners['*'] = [];
    }

    EventEmitter.prototype.on = function _on(type, listener) {
        if (!Array.isArray(this._listeners[type])) {
            this._listeners[type] = [];
        }

        if (this._listeners[type].indexOf(listener) === -1) {
            this._listeners[type].push(listener);
        }

        return this;
    };

    EventEmitter.prototype.once = function _once(type, listener) {
        var self = this;

        function __once() {
            for (var args = [], i = 0; i < arguments.length; i += 1) {
                args[i] = arguments[i];
            }

            self.off(type, __once);
            listener.apply(self, args);
        }

        __once.listener = listener;

        return this.on(type, __once);
    };

    EventEmitter.prototype.off = function _off(type, listener) {
        if (!Array.isArray(this._listeners[type])) {
            return this;
        }

        if (typeof listener === 'undefined') {
            this._listeners[type] = [];
            return this;
        }

        var index = this._listeners[type].indexOf(listener);

        if (index === -1) {
            for (var i = 0; i < this._listeners[type].length; i += 1) {
                if (this._listeners[type][i].listener === listener) {
                    index = i;
                    break;
                }
            }
        }

        this._listeners[type].splice(index, 1);
        return this;
    };

    EventEmitter.prototype.emit = function _emit(type) {

        var args = Array.prototype.slice.call(arguments);
        var modifiedArgs = args.slice(1);

        var listeners = this._listeners[type];
        var j, len;
        if (Array.isArray(listeners)) {
            for (j = 0, len = listeners.length; j < len; j++) {
                listeners[j].apply(this, modifiedArgs);
            }
        }

        //special '*' event
        listeners = this._listeners['*'];
        for (j = 0, len = listeners.length; j < len; j++) {
            listeners[j].apply(this, args);
        }

        return this;
    };

    /* end tiny-events */

    /* begin ArraySet */

    /** @constructor */
    function ArraySet(l) {
        l = l || [];
        this.o = new Set(l);
    }

    ArraySet.prototype = {

        add: function add(x) {
            this.o.add(x);
        },

        remove: function remove(x) {
            return this.o["delete"](x);
        },

        union: function union(l) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = l.o[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    this.o.add(v);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return this;
        },

        difference: function difference(l) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = l.o[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var v = _step2.value;

                    this.o["delete"](v);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this;
        },

        contains: function contains(x) {
            return this.o.has(x);
        },

        iter: function iter() {
            return Array.from(this.o);
        },

        isEmpty: function isEmpty() {
            return !this.o.size;
        },

        size: function size() {
            return this.o.size;
        },

        equals: function equals(s2) {
            if (this.o.size !== s2.size()) {
                return false;
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.o[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var v = _step3.value;

                    if (!s2.contains(v)) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                        _iterator3["return"]();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return true;
        },

        toString: function toString() {
            return this.o.size === 0 ? '<empty>' : Array.from(this.o).join(',\n');
        }
    };

    var RX_TRAILING_WILDCARD = /\.\*$/;

    function isEventPrefixMatch(prefix, fullName) {
        prefix = prefix.replace(RX_TRAILING_WILDCARD, '');

        if (prefix === fullName) {
            return true;
        }

        if (prefix.length > fullName.length) {
            return false;
        }

        if (fullName.charAt(prefix.length) !== '.') {
            return false;
        }

        return fullName.indexOf(prefix) === 0;
    }

    function isTransitionMatch(t, eventName) {
        return t.events.some(function (tEvent) {
            return tEvent === '*' || isEventPrefixMatch(tEvent, eventName);
        });
    }

    function scxmlPrefixTransitionSelector(t, event, evaluator, selectEventlessTransitions) {
        return (selectEventlessTransitions ? !t.events : t.events && event && event.name && isTransitionMatch(t, event.name)) && (!t.cond || evaluator(t.cond));
    }

    function eventlessTransitionSelector(state) {
        return state.transitions.filter(function (transition) {
            return !transition.events || transition.events && transition.events.length === 0;
        });
    }

    //model accessor functions
    var query = {
        isDescendant: function isDescendant(s1, s2) {
            //Returns 'true' if state1 is a descendant of state2 (a child, or a child of a child, or a child of a child of a child, etc.) Otherwise returns 'false'.
            return s2.descendants.indexOf(s1) > -1;
        },
        getAncestors: function getAncestors(s, root) {
            var ancestors, index, state;
            if (root === null) return [];
            index = s.ancestors.indexOf(root);
            if (index > -1) {
                return s.ancestors.slice(0, index);
            } else {
                return s.ancestors;
            }
        },
        /** @this {model} */
        getAncestorsOrSelf: function getAncestorsOrSelf(s, root) {
            return [s].concat(this.getAncestors(s, root));
        },
        getDescendantsOrSelf: function getDescendantsOrSelf(s) {
            return [s].concat(s.descendants);
        },
        /** @this {model} */
        isOrthogonalTo: function isOrthogonalTo(s1, s2) {
            //Two control states are orthogonal if they are not ancestrally
            //related, and their smallest, mutual parent is a Concurrent-state.
            if (s1 === null || s2 === null) return true;
            return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).typeEnum === STATE_TYPES.PARALLEL;
        },
        /** @this {model} */
        isAncestrallyRelatedTo: function isAncestrallyRelatedTo(s1, s2) {
            //Two control states are ancestrally related if one is child/grandchild of another.
            return this.getAncestorsOrSelf(s2).indexOf(s1) > -1 || this.getAncestorsOrSelf(s1).indexOf(s2) > -1;
        },
        /** @this {model} */
        getLCA: function getLCA(s1, s2) {
            var commonAncestors = this.getAncestors(s1).filter(function (a) {
                return a.descendants.indexOf(s2) > -1;
            }, this);
            return commonAncestors[0];
        }
    };

    //priority comparison functions
    function getTransitionWithHigherSourceChildPriority(_args) {
        var t1 = _args[0],
            t2 = _args[1];
        var r = getStateWithHigherSourceChildPriority(t1.source, t2.source);
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

    function sortInEntryOrder(s1, s2) {
        return getStateWithHigherSourceChildPriority(s1, s2) * -1;
    }

    function getStateWithHigherSourceChildPriority(s1, s2) {
        //compare states based first on depth, then based on document order
        if (s1.depth > s2.depth) {
            return -1;
        } else if (s1.depth < s2.depth) {
            return 1;
        } else {
            //Equality
            if (s1.documentOrder < s2.documentOrder) {
                return 1;
            } else if (s1.documentOrder > s2.documentOrder) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    function initializeModelGeneratorFn(modelFn, opts, interpreter) {
        return modelFn.call(interpreter, opts._x, opts._x._sessionid, opts._x._ioprocessors, interpreter.isIn.bind(interpreter));
    }

    function deserializeSerializedConfiguration(serializedConfiguration, idToStateMap) {
        return serializedConfiguration.map(function (id) {
            var state = idToStateMap.get(id);
            if (!state) throw new Error('Error loading serialized configuration. Unable to locate state with id ' + id);
            return state;
        });
    }

    function deserializeHistory(serializedHistory, idToStateMap) {
        var o = {};
        Object.keys(serializedHistory).forEach(function (sid) {
            o[sid] = serializedHistory[sid].map(function (id) {
                var state = idToStateMap.get(id);
                if (!state) throw new Error('Error loading serialized history. Unable to locate state with id ' + id);
                return state;
            });
        });
        return o;
    }

    var printTrace = !!process.env.DEBUG;

    BaseInterpreter.EVENTS = ['onEntry', 'onExit', 'onTransition', 'onError', 'onBigStepBegin', 'onBigStepSuspend', 'onBigStepResume', 'onSmallStepBegin', 'onSmallStepEnd', 'onBigStepEnd'];

    /** @constructor */
    function BaseInterpreter(modelOrFnGenerator, opts) {

        EventEmitter.call(this);

        this._scriptingContext = opts.interpreterScriptingContext || (opts.InterpreterScriptingContext ? new opts.InterpreterScriptingContext(this) : {});

        this.opts = opts || {};

        this.opts.generateSessionid = this.opts.generateSessionid || BaseInterpreter.generateSessionid;
        this.opts.sessionid = this.opts.sessionid || this.opts.generateSessionid();
        this.opts.sessionRegistry = this.opts.sessionRegistry || BaseInterpreter.sessionRegistry; //TODO: define a better interface. For now, assume a Map<sessionid, session>


        var _ioprocessors = {};
        _ioprocessors[SCXML_IOPROCESSOR_TYPE] = {
            location: '#_scxml_' + this.opts.sessionid
        };
        _ioprocessors.scxml = _ioprocessors[SCXML_IOPROCESSOR_TYPE]; //alias

        //SCXML system variables:
        opts._x = {
            _sessionid: opts.sessionid,
            _ioprocessors: _ioprocessors
        };

        var model;
        if (typeof modelOrFnGenerator === 'function') {
            model = initializeModelGeneratorFn(modelOrFnGenerator, opts, this);
        } else if ((typeof modelOrFnGenerator === 'undefined' ? 'undefined' : _typeof(modelOrFnGenerator)) === 'object') {
            model = JSON.parse(JSON.stringify(modelOrFnGenerator)); //assume object
        } else {
            throw new Error('Unexpected model type. Expected model factory function, or scjson object.');
        }

        this._model = initializeModel(model);

        this.opts.console = opts.console || (typeof console === 'undefined' ? { log: function log() {} } : console); //rely on global console if this console is undefined
        this.opts.Set = this.opts.Set || ArraySet;
        this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority;
        this.opts.transitionSelector = this.opts.transitionSelector || scxmlPrefixTransitionSelector;

        this.opts.sessionRegistry.set(String(this.opts.sessionid), this);

        this._scriptingContext.log = this._scriptingContext.log || function log() {
            if (this.opts.console.log.apply) {
                this.opts.console.log.apply(this.opts.console, arguments);
            } else {
                //console.log on older IE does not support Function.apply, so just pass him the first argument. Best we can do for now.
                this.opts.console.log(Array.prototype.slice.apply(arguments).join(','));
            }
        }.bind(this); //set up default scripting context log function

        this._externalEventQueue = [];
        this._internalEventQueue = [];

        if (opts.params) {
            this._model.$deserializeDatamodel(opts.params); //load up the datamodel
        }

        //check if we're loading from a previous snapshot
        if (opts.snapshot) {
            this._configuration = new this.opts.Set(deserializeSerializedConfiguration(opts.snapshot[0], this._model.$idToStateMap));
            this._historyValue = deserializeHistory(opts.snapshot[1], this._model.$idToStateMap);
            this._isInFinalState = opts.snapshot[2];
            this._model.$deserializeDatamodel(opts.snapshot[3]); //load up the datamodel
        } else {
            this._configuration = new this.opts.Set();
            this._historyValue = {};
            this._isInFinalState = false;
        }

        //add debug logging
        BaseInterpreter.EVENTS.forEach(function (event) {
            this.on(event, this._log.bind(this, event));
        }, this);
    }

    //some global singletons to use to generate in-memory session ids, in case the user does not specify these data structures
    BaseInterpreter.sessionIdCounter = 1;
    BaseInterpreter.generateSessionid = function () {
        return BaseInterpreter.sessionIdCounter++;
    };
    BaseInterpreter.sessionRegistry = new Map();

    BaseInterpreter.prototype = extend(beget(EventEmitter.prototype), {

        /** @expose */
        //cancel an invoked session
        cancel: function cancel() {
            delete this.opts.parentSession;
            if (this._isInFinalState) return;
            this._isInFinalState = true;
            this._log('session cancelled ' + this.opts.invokeid);
            this._exitInterpreter();
        },

        _exitInterpreter: function _exitInterpreter() {
            var _this = this;

            //TODO: cancel invoked sessions
            //cancel all delayed sends when we enter into a final state.
            this._cancelAllDelayedSends();

            var statesToExit = this._configuration.iter().map(function (s) {
                return [s].concat(query.getAncestors(s));
            }, this).reduce(function (a, b) {
                return a.concat(b);
            }, []). //flatten
            reduce(function (a, b) {
                return a.indexOf(b) > -1 ? a : a.concat(b);
            }, []).sort(getStateWithHigherSourceChildPriority);

            for (var j = 0, len = statesToExit.length; j < len; j++) {
                var stateExited = statesToExit[j];

                if (stateExited.onExit !== undefined) {
                    for (var exitIdx = 0, exitLen = stateExited.onExit.length; exitIdx < exitLen; exitIdx++) {
                        var block = stateExited.onExit[exitIdx];
                        for (var blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
                            var actionRef = block[blockIdx];
                            try {
                                actionRef.call(this._scriptingContext, null);
                            } catch (e) {
                                this._handleError(e, actionRef);
                                break;
                            }
                        }
                    }
                }

                //cancel invoked session
                if (stateExited.invokes) stateExited.invokes.forEach(function (invoke) {
                    _this._scriptingContext.cancelInvoke(invoke.id);
                });

                //if he is a top-level <final> state, then return the done event
                if (this.opts.parentSession && stateExited.$type === 'final' && stateExited.parent.$type === 'scxml') {

                    this._scriptingContext.send({
                        target: '#_parent',
                        name: 'done.invoke.' + this.opts.invokeid
                    });

                    this.opts.sessionRegistry["delete"](this.opts.sessionid);
                }
            }
        },

        /** @expose */
        start: function start() {
            this._initStart();
            this._performBigStep();
            return this.getConfiguration();
        },

        /**
         * Starts the interpreter asynchronously
         * @param  {Function} cb Callback invoked with an error or the interpreter's stable configuration
         * @expose
         */
        startAsync: function startAsync(cb) {
            cb = this._initStart(cb);
            this.genAsync(null, cb);
        },

        _initStart: function _initStart(cb) {
            var _this2 = this;

            if (typeof cb !== 'function') {
                cb = nop;
            }

            this._log("performing initial big step");

            //We effectively need to figure out states to enter here to populate initial config. assuming root is compound state makes this simple.
            //but if we want it to be parallel, then this becomes more complex. so when initializing the model, we add a 'fake' root state, which
            //makes the following operation safe.
            this._model.initialRef.forEach(function (s) {
                return _this2._configuration.add(s);
            });

            return cb;
        },

        /** @expose */
        getConfiguration: function getConfiguration() {
            return this._configuration.iter().map(function (s) {
                return s.id;
            });
        },

        /** @expose */
        getFullConfiguration: function getFullConfiguration() {
            return this._configuration.iter().map(function (s) {
                return [s].concat(query.getAncestors(s));
            }, this).reduce(function (a, b) {
                return a.concat(b);
            }, []). //flatten
            map(function (s) {
                return s.id;
            }).reduce(function (a, b) {
                return a.indexOf(b) > -1 ? a : a.concat(b);
            }, []); //uniq
        },

        /** @expose */
        isIn: function isIn(stateName) {
            return this.getFullConfiguration().indexOf(stateName) > -1;
        },

        /** @expose */
        isFinal: function isFinal(stateName) {
            return this._isInFinalState;
        },

        /** @private */
        _performBigStep: function _performBigStep(e) {
            var currentEvent = void 0,
                keepGoing = void 0,
                allStatesExited = void 0,
                allStatesEntered = void 0;

            var _startBigStep = this._startBigStep(e);

            var _startBigStep2 = _slicedToArray(_startBigStep, 4);

            allStatesExited = _startBigStep2[0];
            allStatesEntered = _startBigStep2[1];
            keepGoing = _startBigStep2[2];
            currentEvent = _startBigStep2[3];


            while (keepGoing) {
                var _selectTransitionsAnd = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);

                var _selectTransitionsAnd2 = _slicedToArray(_selectTransitionsAnd, 2);

                currentEvent = _selectTransitionsAnd2[0];
                keepGoing = _selectTransitionsAnd2[1];
            }

            this._finishBigStep(allStatesEntered, allStatesExited);
        },

        _selectTransitionsAndPerformSmallStep: function _selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited) {
            var selectedTransitions = this._selectTransitions(currentEvent, true);
            if (selectedTransitions.isEmpty()) {
                currentEvent = this._internalEventQueue.shift() || null;
                selectedTransitions = this._selectTransitions(currentEvent, false);
            }

            this.emit('onSmallStepBegin', currentEvent);
            var statesExited = void 0,
                statesEntered = void 0;

            var _performSmallStep = this._performSmallStep(currentEvent, selectedTransitions);

            var _performSmallStep2 = _slicedToArray(_performSmallStep, 2);

            statesExited = _performSmallStep2[0];
            statesEntered = _performSmallStep2[1];

            if (statesExited) statesExited.forEach(function (s) {
                return allStatesExited.add(s);
            });
            if (statesEntered) statesEntered.forEach(function (s) {
                return allStatesEntered.add(s);
            });
            this.emit('onSmallStepEnd', currentEvent);
            var keepGoing = !selectedTransitions.isEmpty() || this._internalEventQueue.length;
            return [currentEvent, keepGoing];
        },

        _startBigStep: function _startBigStep(e) {
            var _this3 = this;

            this.emit('onBigStepBegin');

            //do applyFinalize and autoforward
            this._configuration.iter().forEach(function (state) {
                if (state.invokes) state.invokes.forEach(function (invoke) {
                    if (invoke.autoforward) {
                        //autoforward
                        _this3._scriptingContext.send({
                            target: '#_' + invoke.id,
                            name: e.name,
                            data: e.data
                        });
                    }
                    if (invoke.id === e.invokeid) {
                        //applyFinalize
                        if (invoke.finalize) invoke.finalize.forEach(function (action) {
                            return _this3._evaluateAction(e, action);
                        });
                    }
                });
            });

            if (e) this._internalEventQueue.push(e);

            var allStatesExited = new Set(),
                allStatesEntered = new Set();
            var keepGoing = true;
            var currentEvent = null;
            return [allStatesEntered, allStatesExited, keepGoing, currentEvent];
        },

        _finishBigStep: function _finishBigStep(allStatesEntered, allStatesExited, cb) {
            var _this4 = this;

            var statesToInvoke = Array.from(new Set([].concat(_toConsumableArray(allStatesEntered)).filter(function (s) {
                return s.invokes && !allStatesExited.has(s);
            }))).sort(sortInEntryOrder);

            // Here we invoke whatever needs to be invoked. The implementation of 'invoke' is platform-specific
            statesToInvoke.forEach(function (s) {
                s.invokes.forEach(function (f) {
                    return _this4._evaluateAction(null, f);
                });
            });

            // cancel invoke for allStatesExited
            allStatesExited.forEach(function (s) {
                if (s.invokes) s.invokes.forEach(function (invoke) {
                    _this4._scriptingContext.cancelInvoke(invoke.id);
                });
            });

            // TODO: Invoking may have raised internal error events and we iterate to handle them        
            //if not internalQueue.isEmpty():
            //    continue

            this._isInFinalState = this._configuration.iter().every(function (s) {
                return s.typeEnum === STATE_TYPES.FINAL;
            });
            if (this._isInFinalState) {
                this._exitInterpreter();
            }
            this.emit('onBigStepEnd');
            if (cb) cb(undefined, this.getConfiguration());
        },

        _cancelAllDelayedSends: function _cancelAllDelayedSends() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._scriptingContext._timeouts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var timeoutOptions = _step4.value;

                    if (!timeoutOptions.sendOptions.delay) continue;
                    this._log('cancelling delayed send', timeoutOptions);
                    clearTimeout(timeoutOptions.timeoutHandle);
                    this._scriptingContext._timeouts["delete"](timeoutOptions);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                        _iterator4["return"]();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            Object.keys(this._scriptingContext._timeoutMap).forEach(function (key) {
                delete this._scriptingContext._timeoutMap[key];
            }, this);
        },

        _performBigStepAsync: function _performBigStepAsync(e, cb) {
            var currentEvent = void 0,
                keepGoing = void 0,
                allStatesExited = void 0,
                allStatesEntered = void 0;

            var _startBigStep3 = this._startBigStep(e);

            var _startBigStep4 = _slicedToArray(_startBigStep3, 4);

            allStatesExited = _startBigStep4[0];
            allStatesEntered = _startBigStep4[1];
            keepGoing = _startBigStep4[2];
            currentEvent = _startBigStep4[3];


            function nextStep(emit) {
                this.emit(emit);

                var _selectTransitionsAnd3 = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);

                var _selectTransitionsAnd4 = _slicedToArray(_selectTransitionsAnd3, 2);

                currentEvent = _selectTransitionsAnd4[0];
                keepGoing = _selectTransitionsAnd4[1];


                if (keepGoing) {
                    this.emit('onBigStepSuspend');
                    setImmediate(nextStep.bind(this), 'onBigStepResume');
                } else {
                    this._finishBigStep(allStatesEntered, allStatesExited, cb);
                }
            }
            nextStep.call(this, 'onBigStepBegin');
        },

        /** @private */
        _performSmallStep: function _performSmallStep(currentEvent, selectedTransitions) {
            var _this5 = this;

            this._log("selecting transitions with currentEvent", currentEvent);

            this._log("selected transitions", selectedTransitions);

            if (!selectedTransitions.isEmpty()) {

                this._log("sorted transitions", selectedTransitions);

                //we only want to enter and exit states from transitions with targets
                //filter out targetless transitions here - we will only use these to execute transition actions
                var selectedTransitionsWithTargets = new this.opts.Set(selectedTransitions.iter().filter(transitionWithTargets));

                var exitedTuple = this._getStatesExited(selectedTransitionsWithTargets),
                    basicStatesExited = exitedTuple[0],
                    statesExited = exitedTuple[1];

                var statesEntered = this._getStatesEntered(selectedTransitionsWithTargets);

                this._log("basicStatesExited ", basicStatesExited);
                this._log("statesExited ", statesExited);
                this._log("statesEntered ", statesEntered);

                var eventsToAddToInnerQueue = new this.opts.Set();

                //update history states
                this._log("executing state exit actions");

                for (var j = 0, len = statesExited.length; j < len; j++) {
                    var stateExited = statesExited[j];

                    if (stateExited.isAtomic) this._configuration.remove(stateExited);

                    this._log("exiting ", stateExited.id);

                    //invoke listeners
                    this.emit('onExit', stateExited.id);

                    if (stateExited.onExit !== undefined) {
                        for (var exitIdx = 0, exitLen = stateExited.onExit.length; exitIdx < exitLen; exitIdx++) {
                            var block = stateExited.onExit[exitIdx];
                            for (var blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
                                var actionRef = block[blockIdx];
                                try {
                                    actionRef.call(this._scriptingContext, currentEvent);
                                } catch (e) {
                                    this._handleError(e, actionRef);
                                    break;
                                }
                            }
                        }
                    }

                    var f;
                    if (stateExited.historyRef) {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = stateExited.historyRef[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var historyRef = _step5.value;

                                if (historyRef.isDeep) {
                                    f = function f(s0) {
                                        return s0.typeEnum === STATE_TYPES.BASIC && stateExited.descendants.indexOf(s0) > -1;
                                    };
                                } else {
                                    f = function f(s0) {
                                        return s0.parent === stateExited;
                                    };
                                }
                                //update history
                                this._historyValue[historyRef.id] = statesExited.filter(f);
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
                                    _iterator5["return"]();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }
                }

                // -> Concurrency: Number of transitions: Multiple
                // -> Concurrency: Order of transitions: Explicitly defined
                var sortedTransitions = selectedTransitions.iter().sort(transitionComparator);

                this._log("executing transitition actions");

                for (var stxIdx = 0, len = sortedTransitions.length; stxIdx < len; stxIdx++) {
                    var transition = sortedTransitions[stxIdx];

                    var targetIds = transition.targets && transition.targets.map(function (target) {
                        return target.id;
                    });

                    this.emit('onTransition', transition.source.id, targetIds, transition.source.transitions.indexOf(transition));

                    if (transition.onTransition !== undefined) {
                        for (var txIdx = 0, txLen = transition.onTransition.length; txIdx < txLen; txIdx++) {
                            var _actionRef = transition.onTransition[txIdx];
                            try {
                                _actionRef.call(this._scriptingContext, currentEvent);
                            } catch (e) {
                                this._handleError(e, _actionRef);
                                break;
                            }
                        }
                    }
                }

                this._log("executing state enter actions");

                for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
                    var stateEntered = statesEntered[enterIdx];

                    if (stateEntered.isAtomic) this._configuration.add(stateEntered);

                    this._log("entering", stateEntered.id);

                    this.emit('onEntry', stateEntered.id);

                    if (stateEntered.onEntry !== undefined) {
                        for (var entryIdx = 0, entryLen = stateEntered.onEntry.length; entryIdx < entryLen; entryIdx++) {
                            var _block = stateEntered.onEntry[entryIdx];
                            for (var _blockIdx = 0, _blockLen = _block.length; _blockIdx < _blockLen; _blockIdx++) {
                                var _actionRef2 = _block[_blockIdx];
                                try {
                                    _actionRef2.call(this._scriptingContext, currentEvent);
                                } catch (e) {
                                    this._handleError(e, _actionRef2);
                                    break;
                                }
                            }
                        }
                    }
                }

                for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
                    var stateEntered = statesEntered[enterIdx];
                    if (stateEntered.typeEnum === STATE_TYPES.FINAL) {
                        var parent = stateEntered.parent;
                        var grandparent = parent.parent;
                        this._internalEventQueue.push({ name: "done.state." + parent.id, data: stateEntered.donedata }); //TODO: implement donedata
                        if (grandparent && grandparent.typeEnum === STATE_TYPES.PARALLEL) {
                            if (grandparent.states.every(function (s) {
                                return _this5.isInFinalState(s);
                            })) {
                                this._internalEventQueue.push({ name: "done.state." + grandparent.id });
                            }
                        }
                    }
                }

                this._log("new configuration ", this._configuration);

                //add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
                if (!eventsToAddToInnerQueue.isEmpty()) {
                    this._log("adding triggered events to inner queue ", eventsToAddToInnerQueue);
                    this._internalEventQueue.push(eventsToAddToInnerQueue);
                }
            }

            //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
            return [statesExited, statesEntered];
        },

        isInFinalState: function isInFinalState(s) {
            var _this6 = this;

            if (s.typeEnum === STATE_TYPES.COMPOSITE) {
                return s.states.some(function (s) {
                    return s.typeEnum === STATE_TYPES.FINAL && _this6._configuration.contains(s);
                });
            } else if (s.typeEnum === STATE_TYPES.PARALLEL) {
                return s.states.every(this.isInFinalState.bind(this));
            } else {
                return false;
            }
        },

        /** @private */
        _evaluateAction: function _evaluateAction(currentEvent, actionRef) {
            try {
                return actionRef.call(this._scriptingContext, currentEvent); //SCXML system variables
            } catch (e) {
                this._handleError(e, actionRef);
            }
        },

        _handleError: function _handleError(e, actionRef) {
            var event = e instanceof Error || e.__proto__.name === 'Error' ? //we can't just do 'e instanceof Error', because the Error object in the sandbox is from a different context, and instanceof will return false
            {
                name: 'error.execution',
                data: {
                    tagname: actionRef.tagname,
                    line: actionRef.line,
                    column: actionRef.column,
                    reason: e.message
                },
                type: 'platform'
            } : e.name ? e : {
                name: 'error.execution',
                data: e,
                type: 'platform'
            };
            this._internalEventQueue.push(event);
            this.emit('onError', event);
        },

        /** @private */
        _getStatesExited: function _getStatesExited(transitions) {
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
                    if (desc.indexOf(state) > -1) {
                        basicStatesExited.add(state);
                        statesExited.add(state);
                        var ancestors = query.getAncestors(state, scope);
                        for (var ancIdx = 0, ancLen = ancestors.length; ancIdx < ancLen; ancIdx++) {
                            statesExited.add(ancestors[ancIdx]);
                        }
                    }
                }
            }

            var sortedStatesExited = statesExited.iter().sort(getStateWithHigherSourceChildPriority);
            return [basicStatesExited, sortedStatesExited];
        },

        _getStatesEntered: function _getStatesEntered(enabledTransitions) {
            var statesToEnter = new Set();
            // initialize the temporary table for default content in history states
            this._computeEntrySet(enabledTransitions, statesToEnter);
            return [].concat(_toConsumableArray(statesToEnter)).sort(sortInEntryOrder);
        },

        _computeEntrySet: function _computeEntrySet(transitions, statesToEnter) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = transitions.iter()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var t = _step6.value;
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = t.targets[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var s = _step7.value;

                            this._addDescendantStatesToEnter(s, statesToEnter);
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
                                _iterator7["return"]();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }

                    var ancestor = t.scope;
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = this._getEffectiveTargetStates(t)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var _s = _step8.value;

                            this._addAncestorStatesToEnter(_s, ancestor, statesToEnter);
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
                                _iterator8["return"]();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                        _iterator6["return"]();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        },

        _getEffectiveTargetStates: function _getEffectiveTargetStates(transition) {
            var targets = new Set();
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = transition.targets[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var s = _step9.value;

                    if (s.typeEnum === STATE_TYPES.HISTORY) {
                        if (s.id in this._historyValue) this._historyValue[s.id].forEach(function (state) {
                            return targets.add(state);
                        });else [].concat(_toConsumableArray(this._getEffectiveTargetStates(s.transitions[0]))).forEach(function (state) {
                            return targets.add(state);
                        });
                    } else {
                        targets.add(s);
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
                        _iterator9["return"]();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            return targets;
        },

        _addDescendantStatesToEnter: function _addDescendantStatesToEnter(state, statesToEnter) {
            var _this7 = this;

            if (state.typeEnum === STATE_TYPES.HISTORY) {
                if (this._historyValue[state.id]) {
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = this._historyValue[state.id][Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var s = _step10.value;

                            this._addDescendantStatesToEnter(s, statesToEnter);
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
                                _iterator10["return"]();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
                            }
                        }
                    }

                    var _iteratorNormalCompletion11 = true;
                    var _didIteratorError11 = false;
                    var _iteratorError11 = undefined;

                    try {
                        for (var _iterator11 = this._historyValue[state.id][Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                            var _s2 = _step11.value;

                            this._addAncestorStatesToEnter(_s2, state.parent, statesToEnter);
                        }
                    } catch (err) {
                        _didIteratorError11 = true;
                        _iteratorError11 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
                                _iterator11["return"]();
                            }
                        } finally {
                            if (_didIteratorError11) {
                                throw _iteratorError11;
                            }
                        }
                    }
                } else {
                    statesToEnter.add(state);
                }
            } else {
                statesToEnter.add(state);
                if (state.typeEnum === STATE_TYPES.COMPOSITE) {
                    var _iteratorNormalCompletion12 = true;
                    var _didIteratorError12 = false;
                    var _iteratorError12 = undefined;

                    try {
                        for (var _iterator12 = state.initialRef[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                            var _s3 = _step12.value;

                            this._addDescendantStatesToEnter(_s3, statesToEnter);
                        }
                    } catch (err) {
                        _didIteratorError12 = true;
                        _iteratorError12 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
                                _iterator12["return"]();
                            }
                        } finally {
                            if (_didIteratorError12) {
                                throw _iteratorError12;
                            }
                        }
                    }

                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {
                        for (var _iterator13 = state.initialRef[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                            var _s4 = _step13.value;

                            this._addAncestorStatesToEnter(_s4, state, statesToEnter);
                        }
                    } catch (err) {
                        _didIteratorError13 = true;
                        _iteratorError13 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion13 && _iterator13["return"]) {
                                _iterator13["return"]();
                            }
                        } finally {
                            if (_didIteratorError13) {
                                throw _iteratorError13;
                            }
                        }
                    }
                } else {
                    if (state.typeEnum === STATE_TYPES.PARALLEL) {
                        var _iteratorNormalCompletion14 = true;
                        var _didIteratorError14 = false;
                        var _iteratorError14 = undefined;

                        try {
                            var _loop = function _loop() {
                                var child = _step14.value;

                                if (![].concat(_toConsumableArray(statesToEnter)).some(function (s) {
                                    return query.isDescendant(s, child);
                                })) {
                                    _this7._addDescendantStatesToEnter(child, statesToEnter);
                                }
                            };

                            for (var _iterator14 = state.states[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                                _loop();
                            }
                        } catch (err) {
                            _didIteratorError14 = true;
                            _iteratorError14 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion14 && _iterator14["return"]) {
                                    _iterator14["return"]();
                                }
                            } finally {
                                if (_didIteratorError14) {
                                    throw _iteratorError14;
                                }
                            }
                        }
                    }
                }
            }
        },

        _addAncestorStatesToEnter: function _addAncestorStatesToEnter(state, ancestor, statesToEnter) {
            var _this8 = this;

            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
                for (var _iterator15 = query.getAncestors(state, ancestor)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var anc = _step15.value;

                    statesToEnter.add(anc);
                    if (anc.typeEnum === STATE_TYPES.PARALLEL) {
                        var _iteratorNormalCompletion16 = true;
                        var _didIteratorError16 = false;
                        var _iteratorError16 = undefined;

                        try {
                            var _loop2 = function _loop2() {
                                var child = _step16.value;

                                if (![].concat(_toConsumableArray(statesToEnter)).some(function (s) {
                                    return query.isDescendant(s, child);
                                })) {
                                    _this8._addDescendantStatesToEnter(child, statesToEnter);
                                }
                            };

                            for (var _iterator16 = anc.states[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                                _loop2();
                            }
                        } catch (err) {
                            _didIteratorError16 = true;
                            _iteratorError16 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion16 && _iterator16["return"]) {
                                    _iterator16["return"]();
                                }
                            } finally {
                                if (_didIteratorError16) {
                                    throw _iteratorError16;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError15 = true;
                _iteratorError15 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion15 && _iterator15["return"]) {
                        _iterator15["return"]();
                    }
                } finally {
                    if (_didIteratorError15) {
                        throw _iteratorError15;
                    }
                }
            }
        },

        /** @private */
        _selectTransitions: function _selectTransitions(currentEvent, selectEventlessTransitions) {
            var transitionSelector = this.opts.transitionSelector;
            var enabledTransitions = new this.opts.Set();

            var e = this._evaluateAction.bind(this, currentEvent);

            var atomicStates = this._configuration.iter().sort(transitionComparator);
            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
                for (var _iterator17 = atomicStates[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                    var state = _step17.value;
                    var _iteratorNormalCompletion18 = true;
                    var _didIteratorError18 = false;
                    var _iteratorError18 = undefined;

                    try {
                        loop: for (var _iterator18 = [state].concat(query.getAncestors(state))[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                            var s = _step18.value;
                            var _iteratorNormalCompletion19 = true;
                            var _didIteratorError19 = false;
                            var _iteratorError19 = undefined;

                            try {
                                for (var _iterator19 = s.transitions[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                                    var t = _step19.value;

                                    if (transitionSelector(t, currentEvent, e, selectEventlessTransitions)) {
                                        enabledTransitions.add(t);
                                        break loop;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError19 = true;
                                _iteratorError19 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion19 && _iterator19["return"]) {
                                        _iterator19["return"]();
                                    }
                                } finally {
                                    if (_didIteratorError19) {
                                        throw _iteratorError19;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError18 = true;
                        _iteratorError18 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion18 && _iterator18["return"]) {
                                _iterator18["return"]();
                            }
                        } finally {
                            if (_didIteratorError18) {
                                throw _iteratorError18;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError17 = true;
                _iteratorError17 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion17 && _iterator17["return"]) {
                        _iterator17["return"]();
                    }
                } finally {
                    if (_didIteratorError17) {
                        throw _iteratorError17;
                    }
                }
            }

            var priorityEnabledTransitions = this._removeConflictingTransition(enabledTransitions);

            this._log("priorityEnabledTransitions", priorityEnabledTransitions);

            return priorityEnabledTransitions;
        },

        /** @private */
        _removeConflictingTransition: function _removeConflictingTransition(enabledTransitions) {
            var filteredTransitions = new this.opts.Set();
            //toList sorts the transitions in the order of the states that selected them
            var _iteratorNormalCompletion20 = true;
            var _didIteratorError20 = false;
            var _iteratorError20 = undefined;

            try {
                for (var _iterator20 = enabledTransitions.iter()[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                    var t1 = _step20.value;

                    var t1Preempted = false;
                    var transitionsToRemove = new Set();
                    var _iteratorNormalCompletion21 = true;
                    var _didIteratorError21 = false;
                    var _iteratorError21 = undefined;

                    try {
                        var _loop3 = function _loop3() {
                            var t2 = _step21.value;

                            var t1ExitSet = query.getAncestors(t1.source, t1.scope); //t1 exit set
                            var t2ExitSet = query.getAncestors(t2.source, t2.scope); //t2 exit set
                            var hasIntersection = t1ExitSet.some(function (s) {
                                return t2ExitSet.indexOf(s) > -1;
                            }); //is this the same as arena orthogonal?
                            if (hasIntersection) {
                                if (t2.source.descendants.indexOf(t1.source) > -1) {
                                    //is this the same as being ancestrally related?
                                    transitionsToRemove.add(t2);
                                } else {
                                    t1Preempted = true;
                                    return 'break';
                                }
                            }
                        };

                        for (var _iterator21 = filteredTransitions.iter()[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                            var _ret3 = _loop3();

                            if (_ret3 === 'break') break;
                        }
                    } catch (err) {
                        _didIteratorError21 = true;
                        _iteratorError21 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion21 && _iterator21["return"]) {
                                _iterator21["return"]();
                            }
                        } finally {
                            if (_didIteratorError21) {
                                throw _iteratorError21;
                            }
                        }
                    }

                    if (!t1Preempted) {
                        var _iteratorNormalCompletion22 = true;
                        var _didIteratorError22 = false;
                        var _iteratorError22 = undefined;

                        try {
                            for (var _iterator22 = transitionsToRemove[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                                var t3 = _step22.value;

                                filteredTransitions.remove(t3);
                            }
                        } catch (err) {
                            _didIteratorError22 = true;
                            _iteratorError22 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion22 && _iterator22["return"]) {
                                    _iterator22["return"]();
                                }
                            } finally {
                                if (_didIteratorError22) {
                                    throw _iteratorError22;
                                }
                            }
                        }

                        filteredTransitions.add(t1);
                    }
                }
            } catch (err) {
                _didIteratorError20 = true;
                _iteratorError20 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion20 && _iterator20["return"]) {
                        _iterator20["return"]();
                    }
                } finally {
                    if (_didIteratorError20) {
                        throw _iteratorError20;
                    }
                }
            }

            return filteredTransitions;
        },

        _log: function _log() {
            if (printTrace) {
                var args = Array.from(arguments);
                this.opts.console.log(args[0] + ': ' + args.slice(1).map(function (arg) {
                    return arg === null ? 'null' : arg === undefined ? 'undefined' : typeof arg === 'string' ? arg : arg.toString() === '[object Object]' ? util.inspect(arg) : arg.toString();
                }).join(', ') + '\n');
            }
        },

        /*
            registerListener provides a generic mechanism to subscribe to state change and runtime error notifications.
            Can be used for logging and debugging. For example, can attach a logger that simply logs the state changes.
            Or can attach a network debugging client that sends state change notifications to a debugging server.
        
            listener is of the form:
            {
              onEntry : function(stateId){},
              onExit : function(stateId){},
              onTransition : function(sourceStateId,targetStatesIds[]){},
              onError: function(errorInfo){},
              onBigStepBegin: function(){},
              onBigStepResume: function(){},
              onBigStepSuspend: function(){},
              onBigStepEnd: function(){}
              onSmallStepBegin: function(event){},
              onSmallStepEnd: function(){}
            }
        */
        //TODO: refactor this to be event emitter? 

        /** @expose */
        registerListener: function registerListener(listener) {
            BaseInterpreter.EVENTS.forEach(function (event) {
                if (listener[event]) this.on(event, listener[event]);
            }, this);
        },

        /** @expose */
        unregisterListener: function unregisterListener(listener) {
            BaseInterpreter.EVENTS.forEach(function (event) {
                if (listener[event]) this.off(event, listener[event]);
            }, this);
        },

        /** @expose */
        getAllTransitionEvents: function getAllTransitionEvents() {
            var events = {};
            function getEvents(state) {

                if (state.transitions) {
                    for (var txIdx = 0, txLen = state.transitions.length; txIdx < txLen; txIdx++) {
                        events[state.transitions[txIdx].event] = true;
                    }
                }

                if (state.states) {
                    for (var stateIdx = 0, stateLen = state.states.length; stateIdx < stateLen; stateIdx++) {
                        getEvents(state.states[stateIdx]);
                    }
                }
            }

            getEvents(this._model);

            return Object.keys(events);
        },

        /** @expose */
        /**
          Three things capture the current snapshot of a running SCION interpreter:
           * basic configuration (the set of basic states the state machine is in)
          * history state values (the states the state machine was in last time it was in the parent of a history state)
          * the datamodel
          
          Note that this assumes that the method to serialize a scion.SCXML
          instance is not called when the interpreter is executing a big-step (e.g. after
          scion.SCXML.prototype.gen is called, and before the call to gen returns). If
          the serialization method is called during the execution of a big-step, then the
          inner event queue must also be saved. I do not expect this to be a common
          requirement however, and therefore I believe it would be better to only support
          serialization when the interpreter is not executing a big-step.
        */
        getSnapshot: function getSnapshot() {
            if (this._isStepping) throw new Error('getSnapshot cannot be called while interpreter is executing a big-step');

            return [this.getConfiguration(), this._serializeHistory(), this._isInFinalState, this._model.$serializeDatamodel()];
        },

        _serializeHistory: function _serializeHistory() {
            var o = {};
            Object.keys(this._historyValue).forEach(function (sid) {
                o[sid] = this._historyValue[sid].map(function (state) {
                    return state.id;
                });
            }, this);
            return o;
        }
    });

    /**
     * @constructor
     * @extends BaseInterpreter
     */
    function Statechart(model, opts) {
        opts = opts || {};

        opts.InterpreterScriptingContext = opts.InterpreterScriptingContext || InterpreterScriptingContext;

        this._isStepping = false;

        BaseInterpreter.call(this, model, opts); //call super constructor
    }

    function beget(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }

    /**
     * Do nothing
     */
    function nop() {}

    //Statechart.prototype = Object.create(BaseInterpreter.prototype);
    //would like to use Object.create here, but not portable, but it's too complicated to use portably
    Statechart.prototype = beget(BaseInterpreter.prototype);

    /** @expose */
    Statechart.prototype.gen = function (evtObjOrName, optionalData) {

        var currentEvent;
        switch (typeof evtObjOrName === 'undefined' ? 'undefined' : _typeof(evtObjOrName)) {
            case 'string':
                currentEvent = { name: evtObjOrName, data: optionalData };
                break;
            case 'object':
                if (typeof evtObjOrName.name === 'string') {
                    currentEvent = evtObjOrName;
                } else {
                    throw new Error('Event object must have "name" property of type string.');
                }
                break;
            default:
                throw new Error('First argument to gen must be a string or object.');
        }

        if (this._isStepping) throw new Error('Cannot call gen during a big-step');

        //otherwise, kick him off
        this._isStepping = true;

        this._performBigStep(currentEvent);

        this._isStepping = false;
        return this.getConfiguration();
    };

    /**
     * Injects an external event into the interpreter asynchronously
     * @param  {object}   currentEvent The event to inject
     * @param {string} currentEvent.name The name of the event
     * @param {string} [currentEvent.data] The event data
     * @param  {Function} cb Callback invoked with an error or the interpreter's stable configuration
     * @expose
     */
    Statechart.prototype.genAsync = function (currentEvent, cb) {
        if (currentEvent !== null && ((typeof currentEvent === 'undefined' ? 'undefined' : _typeof(currentEvent)) !== 'object' || !currentEvent || typeof currentEvent.name !== 'string')) {
            throw new Error('Expected currentEvent to be null or an Object with a name');
        }

        if (typeof cb !== 'function') {
            cb = nop;
        }

        this._externalEventQueue.push([currentEvent, cb]);

        //the semantics we want are to return to the cb the results of processing that particular event.
        function nextStep(e, c) {
            this._performBigStepAsync(e, function (err, config) {
                c(err, config);

                if (this._externalEventQueue.length) {
                    nextStep.apply(this, this._externalEventQueue.shift());
                } else {
                    this._isStepping = false;
                }
            }.bind(this));
        }
        if (!this._isStepping) {
            this._isStepping = true;
            nextStep.apply(this, this._externalEventQueue.shift());
        }
    };

    function InterpreterScriptingContext(interpreter) {
        this._interpreter = interpreter;
        this._timeoutMap = {};
        this._invokeMap = {};
        this._timeouts = new Set();
    }

    //Regex from:
    //  http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    //  http://stackoverflow.com/a/6927878
    var validateUriRegex = /(#_.*)|\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

    //TODO: consider whether this is the API we would like to expose
    InterpreterScriptingContext.prototype = {
        invokeSendTargetRegex: /^#_(.*)$/,
        scxmlSendTargetRegex: /^#_scxml_(.*)$/,
        raise: function raise(event) {
            this._installDefaultPropsOnEvent(event, true);
            this._interpreter._internalEventQueue.push(event);
        },
        parseXmlStringAsDOM: function parseXmlStringAsDOM(xmlString) {
            return (this._interpreter.opts.xmlParser || InterpreterScriptingContext.xmlParser).parse(xmlString);
        },
        invoke: function invoke(invokeObj) {
            var _this9 = this;

            //look up invoker by type. assume invokers are passed in as an option to constructor
            this._invokeMap[invokeObj.id] = new Promise(function (resolve, reject) {
                (_this9._interpreter.opts.invokers || InterpreterScriptingContext.invokers)[invokeObj.type](_this9._interpreter, invokeObj, function (err, session) {
                    if (err) return reject(err);

                    resolve(session);
                });
            });
        },
        cancelInvoke: function cancelInvoke(invokeid) {
            var _this10 = this;

            //TODO: on cancel invoke clean up this._invokeMap
            var sessionPromise = this._invokeMap[invokeid];
            this._interpreter._log('cancelling session with invokeid ' + invokeid);
            if (sessionPromise) {
                this._interpreter._log('sessionPromise found');
                sessionPromise.then(function (session) {
                    _this10._interpreter._log('resolved session ' + invokeid + '. cancelling... ');
                    session.cancel();
                    //clean up
                    delete _this10._invokeMap[invokeid];
                }, function (err) {
                    //TODO: dispatch error back into the state machine as error.communication
                });
            }
        },
        _installDefaultPropsOnEvent: function _installDefaultPropsOnEvent(event, isInternal) {
            if (!isInternal) {
                event.origin = this._interpreter.opts._x._ioprocessors.scxml.location; //TODO: preserve original origin when we autoforward? 
                event.origintype = event.type || SCXML_IOPROCESSOR_TYPE;
            }
            if (typeof event.type === 'undefined') {
                event.type = isInternal ? 'internal' : 'external';
            }
            ['name', 'sendid', 'invokeid', 'data', 'origin', 'origintype'].forEach(function (prop) {
                if (!event[prop]) {
                    event[prop] = undefined;
                }
            });
        },
        send: function send(event, options) {
            this._interpreter._log('send event', event, options);
            options = options || {};
            var sendType = options.type || SCXML_IOPROCESSOR_TYPE;
            //TODO: move these out
            function validateSend(event, options, sendAction) {
                if (event.target) {
                    var targetIsValidUri = validateUriRegex.test(event.target);
                    if (!targetIsValidUri) {
                        throw { name: "error.execution", data: 'Target is not valid URI', sendid: event.sendid, type: 'platform' };
                    }
                }
                if (sendType !== SCXML_IOPROCESSOR_TYPE) {
                    //TODO: extend this to support HTTP, and other IO processors
                    throw { name: "error.execution", data: 'Unsupported event processor type', sendid: event.sendid, type: 'platform' };
                }

                sendAction.call(this, event, options);
            }

            function defaultSendAction(event, options) {
                var _this11 = this;

                if (typeof setTimeout === 'undefined') throw new Error('Default implementation of Statechart.prototype.send will not work unless setTimeout is defined globally.');

                var match;
                if (event.target === '#_internal') {
                    this.raise(event);
                } else {
                    this._installDefaultPropsOnEvent(event, false);
                    event.origintype = SCXML_IOPROCESSOR_TYPE; //TODO: extend this to support HTTP, and other IO processors
                    //TODO : paramterize this based on send/@type?
                    if (!event.target) {
                        doSend.call(this, this._interpreter);
                    } else if (event.target === '#_parent') {
                        if (this._interpreter.opts.parentSession) {
                            event.invokeid = this._interpreter.opts.invokeid;
                            doSend.call(this, this._interpreter.opts.parentSession);
                        } else {
                            throw { name: "error.communication", data: 'Parent session not specified', sendid: event.sendid, type: 'platform' };
                        }
                    } else if (match = event.target.match(this.scxmlSendTargetRegex)) {
                        var targetSessionId = match[1];
                        var session = this._interpreter.opts.sessionRegistry.get(targetSessionId);
                        if (session) {
                            doSend.call(this, session);
                        } else {
                            throw { name: 'error.communication', sendid: event.sendid, type: 'platform' };
                        }
                    } else if (match = event.target.match(this.invokeSendTargetRegex)) {
                        //TODO: test this code path.
                        var invokeId = match[1];
                        this._invokeMap[invokeId].then(function (session) {
                            doSend.call(_this11, session);
                        });
                    } else {
                        throw new Error('Unrecognized send target.'); //TODO: dispatch error back into the state machine
                    }
                }

                function doSend(session) {
                    //TODO: we probably now need to refactor data structures:
                    //    this._timeouts
                    //    this._timeoutMap
                    var timeoutHandle = setTimeout(function () {
                        if (event.sendid) delete this._timeoutMap[event.sendid];
                        this._timeouts["delete"](timeoutOptions);
                        session[this._interpreter.opts.sendAsync ? 'genAsync' : 'gen'](event);
                    }.bind(this), options.delay || 0);

                    var timeoutOptions = {
                        sendOptions: options,
                        timeoutHandle: timeoutHandle
                    };
                    if (event.sendid) this._timeoutMap[event.sendid] = timeoutHandle;
                    this._timeouts.add(timeoutOptions);
                }
            }

            function publish() {
                this._interpreter.emit(event.name, event.data);
            }

            //choose send function
            //TODO: rethink how this custom send works
            var sendFn;
            if (event.type === 'https://github.com/jbeard4/SCION#publish') {
                sendFn = publish;
            } else if (this._interpreter.opts.customSend) {
                sendFn = this._interpreter.opts.customSend;
            } else {
                sendFn = defaultSendAction;
            }

            options = options || {};

            this._interpreter._log("sending event", event.name, "with content", event.data, "after delay", options.delay);

            validateSend.call(this, event, options, sendFn);
        },
        cancel: function cancel(sendid) {
            if (this._interpreter.opts.customCancel) {
                return this._interpreter.opts.customCancel.apply(this, [sendid]);
            }

            if (typeof clearTimeout === 'undefined') throw new Error('Default implementation of Statechart.prototype.cancel will not work unless setTimeout is defined globally.');

            if (sendid in this._timeoutMap) {
                this._interpreter._log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
                clearTimeout(this._timeoutMap[sendid]);
            }
        }
    };

    module.exports = {
        /** @expose */
        BaseInterpreter: BaseInterpreter,
        /** @expose */
        Statechart: Statechart,
        /** @expose */
        ArraySet: ArraySet,
        /** @expose */
        STATE_TYPES: STATE_TYPES,
        /** @expose */
        initializeModel: initializeModel,
        /** @expose */
        InterpreterScriptingContext: InterpreterScriptingContext
    };
});
//# sourceMappingURL=scion.js.map
