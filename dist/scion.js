(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.scion = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
        return this.o.delete(x);
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
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
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

                this.o.delete(v);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
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
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
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

module.exports = ArraySet;

},{}],2:[function(require,module,exports){
'use strict';

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
var RX_TRAILING_WILDCARD = /\.\*$/;

module.exports = {
    STATE_TYPES: STATE_TYPES,
    SCXML_IOPROCESSOR_TYPE: SCXML_IOPROCESSOR_TYPE,
    HTTP_IOPROCESSOR_TYPE: HTTP_IOPROCESSOR_TYPE,
    RX_TRAILING_WILDCARD: RX_TRAILING_WILDCARD
};

},{}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var constants = require('./constants'),
    STATE_TYPES = constants.STATE_TYPES,
    RX_TRAILING_WILDCARD = constants.RX_TRAILING_WILDCARD;

var printTrace = false;

module.exports = {
    extend: extend,
    transitionWithTargets: transitionWithTargets,
    transitionComparator: transitionComparator,
    initializeModel: initializeModel,
    isEventPrefixMatch: isEventPrefixMatch,
    isTransitionMatch: isTransitionMatch,
    scxmlPrefixTransitionSelector: scxmlPrefixTransitionSelector,
    eventlessTransitionSelector: eventlessTransitionSelector,
    getTransitionWithHigherSourceChildPriority: getTransitionWithHigherSourceChildPriority,
    sortInEntryOrder: sortInEntryOrder,
    getStateWithHigherSourceChildPriority: getStateWithHigherSourceChildPriority,
    initializeModelGeneratorFn: initializeModelGeneratorFn,
    deserializeSerializedConfiguration: deserializeSerializedConfiguration,
    deserializeHistory: deserializeHistory
};

function extend(to, from) {
    Object.keys(from).forEach(function (k) {
        to[k] = from[k];
    });
    return to;
};

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

        do {
            var count = idCount[type]++;
            var id = '$generated-' + type + '-' + count;
        } while (idToStateMap.has(id));

        return id;
    }

    function wrapInFakeRootState(state) {
        return {
            $deserializeDatamodel: state.$deserializeDatamodel || function () {},
            $serializeDatamodel: state.$serializeDatamodel || function () {
                return null;
            },
            $idToStateMap: idToStateMap, //keep this for handy deserialization of serialized configuration
            docUrl: state.docUrl,
            states: [{
                $type: 'initial',
                transitions: [{
                    target: state
                }]
            }, state]
        };
    }

    var statesWithInitialAttributes = [];

    /**
      @this {SCTransition}
    */
    function transitionToString(sourceState) {
        return sourceState + ' -- ' + (this.events ? '(' + this.events.join(',') + ')' : null) + (this.cond ? '[' + this.cond.name + ']' : '') + ' --> ' + (this.targets ? this.targets.join(',') : null);
    }

    /**
      @this {SCState}
    */
    function stateToString() {
        return this.id;
    }

    function populateStateIdMap(state) {
        //populate state id map
        if (state.id) {
            idToStateMap.set(state.id, state);
        }

        if (state.states) {
            for (var j = 0, len = state.states.length; j < len; j++) {
                populateStateIdMap(state.states[j]);
            }
        }
    }

    function traverse(ancestors, state) {

        if (printTrace) state.toString = stateToString;

        //add to global transition and state id caches
        if (state.transitions) transitions.push.apply(transitions, state.transitions);

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
            if ((anc.typeEnum === STATE_TYPES.COMPOSITE || anc.typeEnum === STATE_TYPES.PARALLEL) && anc.descendants.indexOf(s2) > -1) {
                commonAncestors.push(anc);
            }
        };
        if (!commonAncestors.length) throw new Error("Could not find LCA for states.");
        return commonAncestors[0];
    }

    //main execution starts here
    //FIXME: only wrap in root state if it's not a compound state
    populateStateIdMap(rootState);
    var fakeRootState = wrapInFakeRootState(rootState); //I wish we had pointer semantics and could make this a C-style "out argument". Instead we return him
    traverse([], fakeRootState);
    connectTransitionGraph();
    connectIntialAttributes();

    return fakeRootState;
}

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

},{"./constants":2}],4:[function(require,module,exports){
"use strict";

//model accessor functions
var query = {
    isDescendant: function isDescendant(s1, s2) {
        //Returns 'true' if state1 is a descendant of state2 (a child, or a child of a child, or a child of a child of a child, etc.) Otherwise returns 'false'.
        return s2.descendants.indexOf(s1) > -1;
    },
    getAncestors: function getAncestors(s, root) {
        var ancestors, index, state;
        index = s.ancestors.indexOf(root);
        if (index > -1) {
            return s.ancestors.slice(0, index);
        } else {
            return s.ancestors;
        }
    },
    getAncestorsOrSelf: function getAncestorsOrSelf(s, root) {
        return [s].concat(query.getAncestors(s, root));
    },
    getDescendantsOrSelf: function getDescendantsOrSelf(s) {
        return [s].concat(s.descendants);
    }
};

module.exports = query;

},{}],5:[function(require,module,exports){
(function (process){
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

/**
 * SCION-CORE global object
 * @namespace scion
 */

/**
 * An Array of strings representing the ids all of the basic states the
 * interpreter is in after a big-step completes.
 * @typedef {Array<string>} Configuration
 */

/**
 * A set of basic and composite state ids.
 * @typedef {Array<string>} FullConfiguration
 */

/**
 * A set of basic and composite state ids.
 * @typedef {Array<string>} FullConfiguration
 */

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var EventEmitter = require('tiny-events').EventEmitter,
    util = require('util'),
    ArraySet = require('./ArraySet'),
    constants = require('./constants'),
    helpers = require('./helpers'),
    query = require('./query'),
    extend = helpers.extend,
    transitionWithTargets = helpers.transitionWithTargets,
    transitionComparator = helpers.transitionComparator,
    initializeModel = helpers.initializeModel,
    isEventPrefixMatch = helpers.isEventPrefixMatch,
    isTransitionMatch = helpers.isTransitionMatch,
    scxmlPrefixTransitionSelector = helpers.scxmlPrefixTransitionSelector,
    eventlessTransitionSelector = helpers.eventlessTransitionSelector,
    getTransitionWithHigherSourceChildPriority = helpers.getTransitionWithHigherSourceChildPriority,
    sortInEntryOrder = helpers.sortInEntryOrder,
    getStateWithHigherSourceChildPriority = helpers.getStateWithHigherSourceChildPriority,
    initializeModelGeneratorFn = helpers.initializeModelGeneratorFn,
    deserializeSerializedConfiguration = helpers.deserializeSerializedConfiguration,
    deserializeHistory = helpers.deserializeHistory,
    BASIC = constants.STATE_TYPES.BASIC,
    COMPOSITE = constants.STATE_TYPES.COMPOSITE,
    PARALLEL = constants.STATE_TYPES.PARALLEL,
    HISTORY = constants.STATE_TYPES.HISTORY,
    INITIAL = constants.STATE_TYPES.INITIAL,
    FINAL = constants.STATE_TYPES.FINAL,
    SCXML_IOPROCESSOR_TYPE = constants.SCXML_IOPROCESSOR_TYPE;

var printTrace = typeof process !== 'undefined' && !!process.env.DEBUG;

BaseInterpreter.EVENTS = ['onEntry', 'onExit', 'onTransition', 'onDefaultEntry', 'onError', 'onBigStepBegin', 'onBigStepEnd', 'onBigStepSuspend', 'onBigStepResume', 'onSmallStepBegin', 'onSmallStepEnd', 'onBigStepEnd', 'onExitInterpreter'];

/** 
 * @description The SCXML constructor creates an interpreter instance from a model object.
 * @abstract
 * @class BaseInterpreter
 * @memberof scion
 * @extends EventEmitter
 * @param {SCJSON | scxml.ModelFactory} modelOrModelFactory Either an SCJSON root state; or an scxml.ModelFactory, which is a function which returns an SCJSON object. 
 * @param opts
 * @param {string} [opts.sessionid] Used to populate SCXML _sessionid.
 * @param {function} [opts.generateSessionid] Factory used to generate sessionid if sessionid keyword is not specified
 * @param {Map<string, BaseInterpreter>} [opts.sessionRegistry] Map used to map sessionid strings to Statechart instances.
 * @param [opts.Set] Class to use as an ArraySet. Defaults to ES6 Set.
 * @param {object} [opts.params]  Used to pass params from invoke. Sets the datamodel when interpreter is instantiated.
 * @param {Snapshot} [opts.snapshot] State machine snapshot. Used to restore a serialized state machine.
 * @param {Statechart} [opts.parentSession]  Used to pass parent session during invoke.
 * @param {string }[opts.invokeid]  Support for id of invoke element at runtime.
 * @param [opts.console]
 * @param [opts.transitionSelector]
 * @param [opts.customCancel]
 * @param [opts.customSend]
 * @param [opts.sendAsync]
 * @param [opts.doSend]
 * @param [opts.invokers]
 * @param [opts.xmlParser]
 * @param [opts.interpreterScriptingContext]
 */
function BaseInterpreter(modelOrModelFactory, opts) {

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
    if (typeof modelOrModelFactory === 'function') {
        model = initializeModelGeneratorFn(modelOrModelFactory, opts, this);
    } else if ((typeof modelOrModelFactory === 'undefined' ? 'undefined' : _typeof(modelOrModelFactory)) === 'object') {
        model = JSON.parse(JSON.stringify(modelOrModelFactory)); //assume object
    } else {
        throw new Error('Unexpected model type. Expected model factory function, or scjson object.');
    }

    this._model = initializeModel(model);

    this.opts.console = opts.console || (typeof console === 'undefined' ? { log: function log() {} } : console); //rely on global console if this console is undefined
    this.opts.Set = this.opts.Set || ArraySet;
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
        this._internalEventQueue = opts.snapshot[4];
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

/**
 * @interface EventEmitter
 */

/**
* @event scion.BaseInterpreter#onError
* @property {string} tagname The name of the element that produced the error. 
* @property {number} line The line in the source file in which the error occurred.
* @property {number} column The column in the source file in which the error occurred.
* @property {string} reason An informative error message. The text is platform-specific and subject to change.
*/

/**
 * @function
 * @name EventEmitter.prototype#on
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#once
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#off
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#emit
 * @param {string} type
 * @param {any} args
 */

BaseInterpreter.prototype = extend(beget(EventEmitter.prototype), {

    /** 
    * Cancels the session. This clears all timers; puts the interpreter in a
    * final state; and runs all exit actions on current states.
    * @memberof BaseInterpreter.prototype
    */
    cancel: function cancel() {
        delete this.opts.parentSession;
        if (this._isInFinalState) return;
        this._isInFinalState = true;
        this._log('session cancelled ' + this.opts.invokeid);
        this._exitInterpreter(null);
    },

    _exitInterpreter: function _exitInterpreter(event) {
        var _this = this;

        //TODO: cancel invoked sessions
        //cancel all delayed sends when we enter into a final state.
        this._cancelAllDelayedSends();

        var statesToExit = this._getFullConfiguration().sort(getStateWithHigherSourceChildPriority);

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
            if (stateExited.$type === 'final' && stateExited.parent.$type === 'scxml') {

                if (this.opts.parentSession) {
                    this._scriptingContext.send({
                        target: '#_parent',
                        name: 'done.invoke.' + this.opts.invokeid,
                        data: stateExited.donedata && stateExited.donedata.call(this._scriptingContext, event)
                    });
                }

                this.opts.sessionRegistry.delete(this.opts.sessionid);
                this.emit('onExitInterpreter', event);
            }
        }
    },

    /** 
     * Starts the interpreter. Should only be called once, and should be called
     * before Statechart.prototype#gen is called for the first time.  Returns a
     * Configuration.
     * @return {Configuration}
     * @memberof BaseInterpreter.prototype
     * @emits scion.BaseInterpreter#onEntry
     * @emits scion.BaseInterpreter#onExit
     * @emits scion.BaseInterpreter#onTransition
     * @emits scion.BaseInterpreter#onDefaultEntry
     * @emits scion.BaseInterpreter#onError
     * @emits scion.BaseInterpreter#onBigStepBegin
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onBigStepSuspend
     * @emits scion.BaseInterpreter#onBigStepResume
     * @emits scion.BaseInterpreter#onSmallStepBegin
     * @emits scion.BaseInterpreter#onSmallStepEnd
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onExitInterpreter
     */
    start: function start() {
        this._initStart();
        this._performBigStep();
        return this.getConfiguration();
    },

    /**
     * This callback is displayed as a global member.
     * @callback genCallback
     * @param {Error} err
     * @param {Configuration} configuration
     */

    /**
     * Starts the interpreter asynchronously
     * @param  {genCallback} cb Callback invoked with an error or the interpreter's stable configuration
     * @memberof BaseInterpreter.prototype 
     * @emits scion.BaseInterpreter#onEntry
     * @emits scion.BaseInterpreter#onExit
     * @emits scion.BaseInterpreter#onTransition
     * @emits scion.BaseInterpreter#onDefaultEntry
     * @emits scion.BaseInterpreter#onError
     * @emits scion.BaseInterpreter#onBigStepBegin
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onBigStepSuspend
     * @emits scion.BaseInterpreter#onBigStepResume
     * @emits scion.BaseInterpreter#onSmallStepBegin
     * @emits scion.BaseInterpreter#onSmallStepEnd
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onExitInterpreter
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

    /** 
    * Returns state machine {@link Configuration}.
    * @return {Configuration}
    * @memberof BaseInterpreter.prototype 
    */
    getConfiguration: function getConfiguration() {
        return this._configuration.iter().map(function (s) {
            return s.id;
        });
    },

    _getFullConfiguration: function _getFullConfiguration() {
        return this._configuration.iter().map(function (s) {
            return [s].concat(query.getAncestors(s));
        }, this).reduce(function (a, b) {
            return a.concat(b);
        }, []). //flatten
        reduce(function (a, b) {
            return a.indexOf(b) > -1 ? a : a.concat(b);
        }, []); //uniq
    },

    /** 
    * @return {FullConfiguration}
    * @memberof BaseInterpreter.prototype 
    */
    getFullConfiguration: function getFullConfiguration() {
        return this._getFullConfiguration().map(function (s) {
            return s.id;
        });
    },

    /** 
    * @return {boolean}
    * @memberof BaseInterpreter.prototype 
    * @param {string} stateName
    */
    isIn: function isIn(stateName) {
        return this.getFullConfiguration().indexOf(stateName) > -1;
    },

    /** 
    * Is the state machine in a final state?
    * @return {boolean}
    * @memberof BaseInterpreter.prototype 
    */
    isFinal: function isFinal() {
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

        this._finishBigStep(currentEvent, allStatesEntered, allStatesExited);
    },

    _selectTransitionsAndPerformSmallStep: function _selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited) {
        //first select with null event
        var selectedTransitions = this._selectTransitions(currentEvent, true);
        if (selectedTransitions.isEmpty()) {
            var ev = this._internalEventQueue.shift();
            if (ev) {
                currentEvent = ev;
                selectedTransitions = this._selectTransitions(currentEvent, false);
            }
        }

        if (!selectedTransitions.isEmpty()) {
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
        }
        var keepGoing = !selectedTransitions.isEmpty() || this._internalEventQueue.length;
        return [currentEvent, keepGoing];
    },

    _startBigStep: function _startBigStep(e) {
        var _this3 = this;

        this.emit('onBigStepBegin', e);

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
        var currentEvent = e;
        return [allStatesEntered, allStatesExited, keepGoing, currentEvent];
    },

    _finishBigStep: function _finishBigStep(e, allStatesEntered, allStatesExited, cb) {
        var _this4 = this;

        var statesToInvoke = Array.from(new Set([].concat(_toConsumableArray(allStatesEntered)).filter(function (s) {
            return s.invokes && !allStatesExited.has(s);
        }))).sort(sortInEntryOrder);

        // Here we invoke whatever needs to be invoked. The implementation of 'invoke' is platform-specific
        statesToInvoke.forEach(function (s) {
            s.invokes.forEach(function (f) {
                return _this4._evaluateAction(e, f);
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
            return s.typeEnum === FINAL;
        });
        if (this._isInFinalState) {
            this._exitInterpreter(e);
        }
        this.emit('onBigStepEnd');
        if (cb) cb(undefined, this.getConfiguration());
    },

    _cancelAllDelayedSends: function _cancelAllDelayedSends() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this._scriptingContext._timeouts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var timeoutOptions = _step.value;

                if (!timeoutOptions.sendOptions.delay) continue;
                this._log('cancelling delayed send', timeoutOptions);
                clearTimeout(timeoutOptions.timeoutHandle);
                this._scriptingContext._timeouts.delete(timeoutOptions);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
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
                this._finishBigStep(currentEvent, allStatesEntered, allStatesExited, cb);
            }
        }
        nextStep.call(this, 'onBigStepBegin');
    },

    /** @private */
    _performSmallStep: function _performSmallStep(currentEvent, selectedTransitions) {

        this._log("selecting transitions with currentEvent", currentEvent);

        this._log("selected transitions", selectedTransitions);

        var statesExited = void 0,
            statesEntered = void 0;

        if (!selectedTransitions.isEmpty()) {

            //we only want to enter and exit states from transitions with targets
            //filter out targetless transitions here - we will only use these to execute transition actions
            var selectedTransitionsWithTargets = new this.opts.Set(selectedTransitions.iter().filter(transitionWithTargets));

            statesExited = this._exitStates(currentEvent, selectedTransitionsWithTargets);
            this._executeTransitions(currentEvent, selectedTransitions);
            statesEntered = this._enterStates(currentEvent, selectedTransitionsWithTargets);

            this._log("new configuration ", this._configuration);
        }

        return [statesExited, statesEntered];
    },

    _exitStates: function _exitStates(currentEvent, selectedTransitionsWithTargets) {
        var basicStatesExited = void 0,
            statesExited = void 0;

        var _getStatesExited = this._getStatesExited(selectedTransitionsWithTargets);

        var _getStatesExited2 = _slicedToArray(_getStatesExited, 2);

        basicStatesExited = _getStatesExited2[0];
        statesExited = _getStatesExited2[1];


        this._log('exiting states');
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
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = stateExited.historyRef[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var historyRef = _step2.value;

                        if (historyRef.isDeep) {
                            f = function f(s0) {
                                return s0.typeEnum === BASIC && stateExited.descendants.indexOf(s0) > -1;
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
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        }

        return statesExited;
    },

    _executeTransitions: function _executeTransitions(currentEvent, selectedTransitions) {
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
                    var actionRef = transition.onTransition[txIdx];
                    try {
                        actionRef.call(this._scriptingContext, currentEvent);
                    } catch (e) {
                        this._handleError(e, actionRef);
                        break;
                    }
                }
            }
        }
    },

    _enterStates: function _enterStates(currentEvent, selectedTransitionsWithTargets) {
        var _this5 = this;

        this._log("entering states");

        var statesEntered = new Set();
        var statesForDefaultEntry = new Set();
        // initialize the temporary table for default content in history states
        var defaultHistoryContent = {};
        this._computeEntrySet(selectedTransitionsWithTargets, statesEntered, statesForDefaultEntry, defaultHistoryContent);
        statesEntered = [].concat(_toConsumableArray(statesEntered)).sort(sortInEntryOrder);

        this._log("statesEntered ", statesEntered);

        for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
            var stateEntered = statesEntered[enterIdx];

            if (stateEntered.isAtomic) this._configuration.add(stateEntered);

            this._log("entering", stateEntered.id);

            this.emit('onEntry', stateEntered.id);

            if (stateEntered.onEntry !== undefined) {
                for (var entryIdx = 0, entryLen = stateEntered.onEntry.length; entryIdx < entryLen; entryIdx++) {
                    var block = stateEntered.onEntry[entryIdx];
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

            if (statesForDefaultEntry.has(stateEntered)) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = stateEntered.initialRef[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var initialState = _step3.value;

                        this.emit('onDefaultEntry', initialState.id);
                        if (initialState.typeEnum === INITIAL) {
                            var transition = initialState.transitions[0];
                            if (transition.onTransition !== undefined) {
                                this._log('executing initial transition content for initial state of parent state', stateEntered.id);
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
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }

            if (defaultHistoryContent[stateEntered.id]) {
                var _transition = defaultHistoryContent[stateEntered.id];
                if (_transition.onTransition !== undefined) {
                    this._log('executing history transition content for history state of parent state', stateEntered.id);
                    for (var txIdx = 0, txLen = _transition.onTransition.length; txIdx < txLen; txIdx++) {
                        var _actionRef2 = _transition.onTransition[txIdx];
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
            if (stateEntered.typeEnum === FINAL) {
                var parent = stateEntered.parent;
                var grandparent = parent.parent;
                this._internalEventQueue.push({ name: "done.state." + parent.id, data: stateEntered.donedata && stateEntered.donedata.call(this._scriptingContext, currentEvent) });
                if (grandparent && grandparent.typeEnum === PARALLEL) {
                    if (grandparent.states.every(function (s) {
                        return _this5.isInFinalState(s);
                    })) {
                        this._internalEventQueue.push({ name: "done.state." + grandparent.id });
                    }
                }
            }
        }

        return statesEntered;
    },

    isInFinalState: function isInFinalState(s) {
        var _this6 = this;

        if (s.typeEnum === COMPOSITE) {
            return s.states.some(function (s) {
                return s.typeEnum === FINAL && _this6._configuration.contains(s);
            });
        } else if (s.typeEnum === PARALLEL) {
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
        var event = e instanceof Error || typeof e.__proto__.name === 'string' && e.__proto__.name.match(/^.*Error$/) ? //we can't just do 'e instanceof Error', because the Error object in the sandbox is from a different context, and instanceof will return false
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

    _computeEntrySet: function _computeEntrySet(transitions, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = transitions.iter()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var t = _step4.value;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = t.targets[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var s = _step5.value;

                        this._addDescendantStatesToEnter(s, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                var ancestor = t.scope;
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this._getEffectiveTargetStates(t)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _s = _step6.value;

                        this._addAncestorStatesToEnter(_s, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    },

    _getEffectiveTargetStates: function _getEffectiveTargetStates(transition) {
        var targets = new Set();
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = transition.targets[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var s = _step7.value;

                if (s.typeEnum === HISTORY) {
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
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }

        return targets;
    },

    _addDescendantStatesToEnter: function _addDescendantStatesToEnter(state, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
        var _this7 = this;

        if (state.typeEnum === HISTORY) {
            if (this._historyValue[state.id]) {
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this._historyValue[state.id][Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var s = _step8.value;

                        this._addDescendantStatesToEnter(s, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }

                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = this._historyValue[state.id][Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var _s2 = _step9.value;

                        this._addAncestorStatesToEnter(_s2, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }
            } else {
                defaultHistoryContent[state.parent.id] = state.transitions[0];
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = state.transitions[0].targets[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var _s3 = _step10.value;

                        this._addDescendantStatesToEnter(_s3, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
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
                    for (var _iterator11 = state.transitions[0].targets[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var _s4 = _step11.value;

                        this._addAncestorStatesToEnter(_s4, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }
            }
        } else {
            statesToEnter.add(state);
            if (state.typeEnum === COMPOSITE) {
                statesForDefaultEntry.add(state);
                //for each state in initialRef, if it is an initial state, then add ancestors and descendants.
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                    for (var _iterator12 = state.initialRef[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                        var _s5 = _step12.value;

                        var targets = _s5.typeEnum === INITIAL ? _s5.transitions[0].targets : [_s5];
                        var _iteratorNormalCompletion14 = true;
                        var _didIteratorError14 = false;
                        var _iteratorError14 = undefined;

                        try {
                            for (var _iterator14 = targets[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                                var targetState = _step14.value;

                                this._addDescendantStatesToEnter(targetState, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                            }
                        } catch (err) {
                            _didIteratorError14 = true;
                            _iteratorError14 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                    _iterator14.return();
                                }
                            } finally {
                                if (_didIteratorError14) {
                                    throw _iteratorError14;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                            _iterator12.return();
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
                        var _s6 = _step13.value;

                        var _targets = _s6.typeEnum === INITIAL ? _s6.transitions[0].targets : [_s6];
                        var _iteratorNormalCompletion15 = true;
                        var _didIteratorError15 = false;
                        var _iteratorError15 = undefined;

                        try {
                            for (var _iterator15 = _targets[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                                var _targetState = _step15.value;

                                this._addAncestorStatesToEnter(_targetState, state, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                            }
                        } catch (err) {
                            _didIteratorError15 = true;
                            _iteratorError15 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion15 && _iterator15.return) {
                                    _iterator15.return();
                                }
                            } finally {
                                if (_didIteratorError15) {
                                    throw _iteratorError15;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError13 = true;
                    _iteratorError13 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion13 && _iterator13.return) {
                            _iterator13.return();
                        }
                    } finally {
                        if (_didIteratorError13) {
                            throw _iteratorError13;
                        }
                    }
                }
            } else {
                if (state.typeEnum === PARALLEL) {
                    var _iteratorNormalCompletion16 = true;
                    var _didIteratorError16 = false;
                    var _iteratorError16 = undefined;

                    try {
                        var _loop = function _loop() {
                            var child = _step16.value;

                            if (![].concat(_toConsumableArray(statesToEnter)).some(function (s) {
                                return query.isDescendant(s, child);
                            })) {
                                _this7._addDescendantStatesToEnter(child, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                            }
                        };

                        for (var _iterator16 = state.states[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                            _loop();
                        }
                    } catch (err) {
                        _didIteratorError16 = true;
                        _iteratorError16 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion16 && _iterator16.return) {
                                _iterator16.return();
                            }
                        } finally {
                            if (_didIteratorError16) {
                                throw _iteratorError16;
                            }
                        }
                    }
                }
            }
        }
    },

    _addAncestorStatesToEnter: function _addAncestorStatesToEnter(state, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
        var _this8 = this;

        var traverse = function traverse(anc) {
            if (anc.typeEnum === PARALLEL) {
                var _iteratorNormalCompletion17 = true;
                var _didIteratorError17 = false;
                var _iteratorError17 = undefined;

                try {
                    var _loop2 = function _loop2() {
                        var child = _step17.value;

                        if (child.typeEnum !== HISTORY && ![].concat(_toConsumableArray(statesToEnter)).some(function (s) {
                            return query.isDescendant(s, child);
                        })) {
                            _this8._addDescendantStatesToEnter(child, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                        }
                    };

                    for (var _iterator17 = anc.states[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                        _loop2();
                    }
                } catch (err) {
                    _didIteratorError17 = true;
                    _iteratorError17 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion17 && _iterator17.return) {
                            _iterator17.return();
                        }
                    } finally {
                        if (_didIteratorError17) {
                            throw _iteratorError17;
                        }
                    }
                }
            }
        };
        var _iteratorNormalCompletion18 = true;
        var _didIteratorError18 = false;
        var _iteratorError18 = undefined;

        try {
            for (var _iterator18 = query.getAncestors(state, ancestor)[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                var anc = _step18.value;

                statesToEnter.add(anc);
                traverse(anc);
            }
        } catch (err) {
            _didIteratorError18 = true;
            _iteratorError18 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion18 && _iterator18.return) {
                    _iterator18.return();
                }
            } finally {
                if (_didIteratorError18) {
                    throw _iteratorError18;
                }
            }
        }

        traverse(ancestor);
    },

    /** @private */
    _selectTransitions: function _selectTransitions(currentEvent, selectEventlessTransitions) {
        var transitionSelector = this.opts.transitionSelector;
        var enabledTransitions = new this.opts.Set();

        var e = this._evaluateAction.bind(this, currentEvent);

        var atomicStates = this._configuration.iter().sort(transitionComparator);
        var _iteratorNormalCompletion19 = true;
        var _didIteratorError19 = false;
        var _iteratorError19 = undefined;

        try {
            for (var _iterator19 = atomicStates[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                var state = _step19.value;
                var _iteratorNormalCompletion20 = true;
                var _didIteratorError20 = false;
                var _iteratorError20 = undefined;

                try {
                    loop: for (var _iterator20 = [state].concat(query.getAncestors(state))[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                        var s = _step20.value;
                        var _iteratorNormalCompletion21 = true;
                        var _didIteratorError21 = false;
                        var _iteratorError21 = undefined;

                        try {
                            for (var _iterator21 = s.transitions[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                                var t = _step21.value;

                                if (transitionSelector(t, currentEvent, e, selectEventlessTransitions)) {
                                    enabledTransitions.add(t);
                                    break loop;
                                }
                            }
                        } catch (err) {
                            _didIteratorError21 = true;
                            _iteratorError21 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion21 && _iterator21.return) {
                                    _iterator21.return();
                                }
                            } finally {
                                if (_didIteratorError21) {
                                    throw _iteratorError21;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError20 = true;
                    _iteratorError20 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion20 && _iterator20.return) {
                            _iterator20.return();
                        }
                    } finally {
                        if (_didIteratorError20) {
                            throw _iteratorError20;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError19 = true;
            _iteratorError19 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion19 && _iterator19.return) {
                    _iterator19.return();
                }
            } finally {
                if (_didIteratorError19) {
                    throw _iteratorError19;
                }
            }
        }

        var priorityEnabledTransitions = this._removeConflictingTransition(enabledTransitions);

        this._log("priorityEnabledTransitions", priorityEnabledTransitions);

        return priorityEnabledTransitions;
    },

    _computeExitSet: function _computeExitSet(transitions) {
        var statesToExit = new Set();
        var _iteratorNormalCompletion22 = true;
        var _didIteratorError22 = false;
        var _iteratorError22 = undefined;

        try {
            for (var _iterator22 = transitions[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                var t = _step22.value;

                if (t.targets) {
                    var scope = t.scope;
                    var _iteratorNormalCompletion23 = true;
                    var _didIteratorError23 = false;
                    var _iteratorError23 = undefined;

                    try {
                        for (var _iterator23 = this._getFullConfiguration()[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                            var s = _step23.value;

                            if (query.isDescendant(s, scope)) statesToExit.add(s);
                        }
                    } catch (err) {
                        _didIteratorError23 = true;
                        _iteratorError23 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion23 && _iterator23.return) {
                                _iterator23.return();
                            }
                        } finally {
                            if (_didIteratorError23) {
                                throw _iteratorError23;
                            }
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError22 = true;
            _iteratorError22 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion22 && _iterator22.return) {
                    _iterator22.return();
                }
            } finally {
                if (_didIteratorError22) {
                    throw _iteratorError22;
                }
            }
        }

        return statesToExit;
    },

    /** @private */
    _removeConflictingTransition: function _removeConflictingTransition(enabledTransitions) {
        var _this9 = this;

        var filteredTransitions = new this.opts.Set();
        //toList sorts the transitions in the order of the states that selected them
        var _iteratorNormalCompletion24 = true;
        var _didIteratorError24 = false;
        var _iteratorError24 = undefined;

        try {
            for (var _iterator24 = enabledTransitions.iter()[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
                var t1 = _step24.value;

                var t1Preempted = false;
                var transitionsToRemove = new Set();
                var _iteratorNormalCompletion25 = true;
                var _didIteratorError25 = false;
                var _iteratorError25 = undefined;

                try {
                    var _loop3 = function _loop3() {
                        var t2 = _step25.value;

                        //TODO: can we compute this statically? for example, by checking if the transition scopes are arena orthogonal?
                        var t1ExitSet = _this9._computeExitSet([t1]);
                        var t2ExitSet = _this9._computeExitSet([t2]);
                        var hasIntersection = [].concat(_toConsumableArray(t1ExitSet)).some(function (s) {
                            return t2ExitSet.has(s);
                        }) || [].concat(_toConsumableArray(t2ExitSet)).some(function (s) {
                            return t1ExitSet.has(s);
                        });
                        _this9._log('t1ExitSet', t1.source.id, [].concat(_toConsumableArray(t1ExitSet)).map(function (s) {
                            return s.id;
                        }));
                        _this9._log('t2ExitSet', t2.source.id, [].concat(_toConsumableArray(t2ExitSet)).map(function (s) {
                            return s.id;
                        }));
                        _this9._log('hasIntersection', hasIntersection);
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

                    for (var _iterator25 = filteredTransitions.iter()[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
                        var _ret3 = _loop3();

                        if (_ret3 === 'break') break;
                    }
                } catch (err) {
                    _didIteratorError25 = true;
                    _iteratorError25 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion25 && _iterator25.return) {
                            _iterator25.return();
                        }
                    } finally {
                        if (_didIteratorError25) {
                            throw _iteratorError25;
                        }
                    }
                }

                if (!t1Preempted) {
                    var _iteratorNormalCompletion26 = true;
                    var _didIteratorError26 = false;
                    var _iteratorError26 = undefined;

                    try {
                        for (var _iterator26 = transitionsToRemove[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
                            var t3 = _step26.value;

                            filteredTransitions.remove(t3);
                        }
                    } catch (err) {
                        _didIteratorError26 = true;
                        _iteratorError26 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion26 && _iterator26.return) {
                                _iterator26.return();
                            }
                        } finally {
                            if (_didIteratorError26) {
                                throw _iteratorError26;
                            }
                        }
                    }

                    filteredTransitions.add(t1);
                }
            }
        } catch (err) {
            _didIteratorError24 = true;
            _iteratorError24 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion24 && _iterator24.return) {
                    _iterator24.return();
                }
            } finally {
                if (_didIteratorError24) {
                    throw _iteratorError24;
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

    /**
    * @interface Listener
    */

    /**
    * @function
    * @name Listener#onEntry 
    * @param {string} stateId
    */

    /**
    * @function
    * @name Listener#onExit 
    * @param {string} stateId
    */

    /**
    * @function
    * @name Listener#onTransition 
    * @param {string} sourceStateId Id of the source state
    * @param {Array<string>} targetStatesIds Ids of the target states
    * @param {number} transitionIndex Index of the transition relative to other transitions originating from source state.
    */

    /**
    * @function
    * @name Listener#onError
    * @param {Error} errorInfo
    */

    /**
    * @function
    * @name Listener#onBigStepBegin
    */

    /**
    * @function
    * @name Listener#onBigStepResume
    */

    /**
    * @function
    * @name Listener#onBigStepSuspend
    */

    /**
    * @function
    * @name Listener#onBigStepEnd
    */

    /**
    * @function
    * @name Listener#onSmallStepBegin
    * @param {string} event
    */

    /**
    * @function
    * @name Listener#onSmallStepEnd
    */

    /** 
    * Provides a generic mechanism to subscribe to state change and runtime
    * error notifications.  Can be used for logging and debugging. For example,
    * can attach a logger that simply logs the state changes.  Or can attach a
    * network debugging client that sends state change notifications to a
    * debugging server.
    * This is an alternative interface to {@link EventEmitter.prototype#on}.
    * @memberof BaseInterpreter.prototype 
    * @param {Listener} listener
    */
    registerListener: function registerListener(listener) {
        BaseInterpreter.EVENTS.forEach(function (event) {
            if (listener[event]) this.on(event, listener[event]);
        }, this);
    },

    /** 
    * Unregister a Listener
    * @memberof BaseInterpreter.prototype 
    * @param {Listener} listener
    */
    unregisterListener: function unregisterListener(listener) {
        BaseInterpreter.EVENTS.forEach(function (event) {
            if (listener[event]) this.off(event, listener[event]);
        }, this);
    },

    /** 
    * Query the model to get all transition events.
    * @return {Array<string>} Transition events.
    * @memberof BaseInterpreter.prototype 
    */
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

    /**
    * Three things capture the current snapshot of a running SCION interpreter:
    *
    *      <ul>
    *      <li> basic configuration (the set of basic states the state machine is in)</li>
    *      <li> history state values (the states the state machine was in last time it was in the parent of a history state)</li>
    *      <li> the datamodel</li>
    *      </ul>
    *      
    * The snapshot object can be serialized as JSON and saved to a database. It can
    * later be passed to the SCXML constructor to restore the state machine
    * using the snapshot argument.
    *
    * @return {Snapshot} 
    * @memberof BaseInterpreter.prototype 
    */
    getSnapshot: function getSnapshot() {
        return [this.getConfiguration(), this._serializeHistory(), this._isInFinalState, this._model.$serializeDatamodel(), this._internalEventQueue.slice()];
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
 * @class
 * @extends BaseInterpreter
 * @memberof scion
 */
function Statechart(model, opts) {
    opts = opts || {};

    opts.InterpreterScriptingContext = opts.InterpreterScriptingContext || InterpreterScriptingContext;

    this._isStepping = false;

    BaseInterpreter.call(this, model, opts); //call super constructor

    module.exports.emit('new', this);
}

function beget(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

// Do nothing

function nop() {}

//Statechart.prototype = Object.create(BaseInterpreter.prototype);
//would like to use Object.create here, but not portable, but it's too complicated to use portably
Statechart.prototype = beget(BaseInterpreter.prototype);

/**
 * @interface Event
 */

/** 
* @member name
* @memberof Event.prototype 
* @type string
* @description The name of the event
*/

/** 
* @member data
* @memberof Event.prototype 
* @type any
* @description The event data
*/

/** 
* An SCXML interpreter takes SCXML events as input, where an SCXML event is an
* object with "name" and "data" properties. These can be passed to method `gen`
* as two positional arguments, or as a single object.
* @function gen
* @memberof Statechart.prototype 
* @param {string|Event} evtObjOrName
* @param {any=} optionalData
* @emits scion.BaseInterpreter#onEntry
* @emits scion.BaseInterpreter#onExit
* @emits scion.BaseInterpreter#onTransition
* @emits scion.BaseInterpreter#onDefaultEntry
* @emits scion.BaseInterpreter#onError
* @emits scion.BaseInterpreter#onBigStepBegin
* @emits scion.BaseInterpreter#onBigStepEnd
* @emits scion.BaseInterpreter#onBigStepSuspend
* @emits scion.BaseInterpreter#onBigStepResume
* @emits scion.BaseInterpreter#onSmallStepBegin
* @emits scion.BaseInterpreter#onSmallStepEnd
* @emits scion.BaseInterpreter#onBigStepEnd
* @emits scion.BaseInterpreter#onExitInterpreter
*/
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
* @function genAsync
* @memberof Statechart.prototype 
* @param {Event}  currentEvent The event to inject
* @param {genCallback} cb Callback invoked with an error or the interpreter's stable configuration
* @emits scion.BaseInterpreter#onEntry
* @emits scion.BaseInterpreter#onExit
* @emits scion.BaseInterpreter#onTransition
* @emits scion.BaseInterpreter#onDefaultEntry
* @emits scion.BaseInterpreter#onError
* @emits scion.BaseInterpreter#onBigStepBegin
* @emits scion.BaseInterpreter#onBigStepEnd
* @emits scion.BaseInterpreter#onBigStepSuspend
* @emits scion.BaseInterpreter#onBigStepResume
* @emits scion.BaseInterpreter#onSmallStepBegin
* @emits scion.BaseInterpreter#onSmallStepEnd
* @emits scion.BaseInterpreter#onBigStepEnd
* @emits scion.BaseInterpreter#onExitInterpreter
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
        var _this10 = this;

        //look up invoker by type. assume invokers are passed in as an option to constructor
        this._invokeMap[invokeObj.id] = new Promise(function (resolve, reject) {
            (_this10._interpreter.opts.invokers || InterpreterScriptingContext.invokers)[invokeObj.type](_this10._interpreter, invokeObj, function (err, session) {
                if (err) return reject(err);

                _this10._interpreter.emit('onInvokedSessionInitialized', session);
                resolve(session);
            });
        });
    },
    cancelInvoke: function cancelInvoke(invokeid) {
        var _this11 = this;

        //TODO: on cancel invoke clean up this._invokeMap
        var sessionPromise = this._invokeMap[invokeid];
        this._interpreter._log('cancelling session with invokeid ' + invokeid);
        if (sessionPromise) {
            this._interpreter._log('sessionPromise found');
            sessionPromise.then(function (session) {
                _this11._interpreter._log('resolved session ' + invokeid + '. cancelling... ');
                session.cancel();
                //clean up
                delete _this11._invokeMap[invokeid];
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
            if (typeof event[prop] === 'undefined') {
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
            var _this12 = this;

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
                        doSend.call(_this12, session);
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
                    this._timeouts.delete(timeoutOptions);
                    if (this._interpreter.opts.doSend) {
                        this._interpreter.opts.doSend(session, event);
                    } else {
                        session[this._interpreter.opts.sendAsync ? 'genAsync' : 'gen'](event);
                    }
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

module.exports = extend(new EventEmitter(), {
    BaseInterpreter: BaseInterpreter,
    Statechart: Statechart,
    ArraySet: ArraySet,
    STATE_TYPES: constants.STATE_TYPES,
    initializeModel: initializeModel,
    InterpreterScriptingContext: InterpreterScriptingContext
});

}).call(this,require('_process'))

},{"./ArraySet":1,"./constants":2,"./helpers":3,"./query":4,"_process":6,"tiny-events":7,"util":10}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
function EventEmitter() {
    this._listeners = {};
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
    if (!Array.isArray(this._listeners[type])) {
        return this;
    }

    for (var args = [], i = 1; i < arguments.length; i += 1) {
        args[i - 1] = arguments[i];
    }

    this._listeners[type].forEach(function __emit(listener) {
        listener.apply(this, args);
    }, this);

    return this;
};

module.exports.EventEmitter = EventEmitter;

},{}],8:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],9:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],10:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":9,"_process":6,"inherits":8}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQXJyYXlTZXQuanMiLCJsaWIvY29uc3RhbnRzLmpzIiwibGliL2hlbHBlcnMuanMiLCJsaWIvcXVlcnkuanMiLCJsaWIvc2Npb24uanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbnktZXZlbnRzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNqQixRQUFJLEtBQUssRUFBVDtBQUNBLFNBQUssQ0FBTCxHQUFTLElBQUksR0FBSixDQUFRLENBQVIsQ0FBVDtBQUNIOztBQUVELFNBQVMsU0FBVCxHQUFxQjs7QUFFakIsU0FBTSxhQUFTLENBQVQsRUFBWTtBQUNkLGFBQUssQ0FBTCxDQUFPLEdBQVAsQ0FBVyxDQUFYO0FBQ0gsS0FKZ0I7O0FBTWpCLFlBQVMsZ0JBQVMsQ0FBVCxFQUFZO0FBQ2pCLGVBQU8sS0FBSyxDQUFMLENBQU8sTUFBUCxDQUFjLENBQWQsQ0FBUDtBQUNILEtBUmdCOztBQVVqQixXQUFRLGVBQVMsQ0FBVCxFQUFZO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ2hCLGlDQUFjLEVBQUUsQ0FBaEIsOEhBQW1CO0FBQUEsb0JBQVYsQ0FBVTs7QUFDZixxQkFBSyxDQUFMLENBQU8sR0FBUCxDQUFXLENBQVg7QUFDSDtBQUhlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSWhCLGVB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogYmVnaW4gQXJyYXlTZXQgKi9cblxuLyoqIEBjb25zdHJ1Y3RvciAqL1xuZnVuY3Rpb24gQXJyYXlTZXQobCkge1xuICAgIGwgPSBsIHx8IFtdO1xuICAgIHRoaXMubyA9IG5ldyBTZXQobCk7ICAgICAgICBcbn1cblxuQXJyYXlTZXQucHJvdG90eXBlID0ge1xuXG4gICAgYWRkIDogZnVuY3Rpb24oeCkge1xuICAgICAgICB0aGlzLm8uYWRkKHgpO1xuICAgIH0sXG5cbiAgICByZW1vdmUgOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm8uZGVsZXRlKHgpO1xuICAgIH0sXG5cbiAgICB1bmlvbiA6IGZ1bmN0aW9uKGwpIHtcbiAgICAgICAgZm9yICh2YXIgdiBvZiBsLm8pIHtcbiAgICAgICAgICAgIHRoaXMuby5hZGQodik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGRpZmZlcmVuY2UgOiBmdW5jdGlvbihsKSB7XG4gICAgICAgIGZvciAodmFyIHYgb2YgbC5vKSB7XG4gICAgICAgICAgICB0aGlzLm8uZGVsZXRlKHYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBjb250YWlucyA6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5oYXMoeCk7XG4gICAgfSxcblxuICAgIGl0ZXIgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5vKTtcbiAgICB9LFxuXG4gICAgaXNFbXB0eSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuby5zaXplO1xuICAgIH0sXG5cbiAgICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5zaXplO1xuICAgIH0sXG5cbiAgICBlcXVhbHMgOiBmdW5jdGlvbihzMikge1xuICAgICAgICBpZiAodGhpcy5vLnNpemUgIT09IHMyLnNpemUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgdiBvZiB0aGlzLm8pIHtcbiAgICAgICAgICAgIGlmICghczIuY29udGFpbnModikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5zaXplID09PSAwID8gJzxlbXB0eT4nIDogQXJyYXkuZnJvbSh0aGlzLm8pLmpvaW4oJyxcXG4nKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5U2V0O1xuIiwidmFyIFNUQVRFX1RZUEVTID0ge1xuICAgIEJBU0lDOiAwLFxuICAgIENPTVBPU0lURTogMSxcbiAgICBQQVJBTExFTDogMixcbiAgICBISVNUT1JZOiAzLFxuICAgIElOSVRJQUw6IDQsXG4gICAgRklOQUw6IDVcbn07XG5cbmNvbnN0IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUgPSAnaHR0cDovL3d3dy53My5vcmcvVFIvc2N4bWwvI1NDWE1MRXZlbnRQcm9jZXNzb3InXG5jb25zdCBIVFRQX0lPUFJPQ0VTU09SX1RZUEUgPSAnaHR0cDovL3d3dy53My5vcmcvVFIvc2N4bWwvI0Jhc2ljSFRUUEV2ZW50UHJvY2Vzc29yJ1xuY29uc3QgUlhfVFJBSUxJTkdfV0lMRENBUkQgPSAvXFwuXFwqJC87XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTVEFURV9UWVBFUyA6IFNUQVRFX1RZUEVTLFxuICBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFICA6IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUsXG4gIEhUVFBfSU9QUk9DRVNTT1JfVFlQRSAgOiBIVFRQX0lPUFJPQ0VTU09SX1RZUEUsIFxuICBSWF9UUkFJTElOR19XSUxEQ0FSRCAgOiBSWF9UUkFJTElOR19XSUxEQ0FSRCBcbn07XG4iLCJjb25zdCBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpLFxuICAgICAgU1RBVEVfVFlQRVMgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMsXG4gICAgICBSWF9UUkFJTElOR19XSUxEQ0FSRCA9IGNvbnN0YW50cy5SWF9UUkFJTElOR19XSUxEQ0FSRDtcblxuY29uc3QgcHJpbnRUcmFjZSA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXh0ZW5kIDogZXh0ZW5kLFxuICB0cmFuc2l0aW9uV2l0aFRhcmdldHMgOiB0cmFuc2l0aW9uV2l0aFRhcmdldHMsXG4gIHRyYW5zaXRpb25Db21wYXJhdG9yIDogdHJhbnNpdGlvbkNvbXBhcmF0b3IsXG4gIGluaXRpYWxpemVNb2RlbCA6IGluaXRpYWxpemVNb2RlbCxcbiAgaXNFdmVudFByZWZpeE1hdGNoIDogaXNFdmVudFByZWZpeE1hdGNoLFxuICBpc1RyYW5zaXRpb25NYXRjaCA6IGlzVHJhbnNpdGlvbk1hdGNoLFxuICBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvciA6IHNjeG1sUHJlZml4VHJhbnNpdGlvblNlbGVjdG9yLFxuICBldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3IgOiBldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA6IGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgc29ydEluRW50cnlPcmRlciA6IHNvcnRJbkVudHJ5T3JkZXIsXG4gIGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkgOiBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5LFxuICBpbml0aWFsaXplTW9kZWxHZW5lcmF0b3JGbiA6IGluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuLFxuICBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uIDogZGVzZXJpYWxpemVTZXJpYWxpemVkQ29uZmlndXJhdGlvbixcbiAgZGVzZXJpYWxpemVIaXN0b3J5IDogZGVzZXJpYWxpemVIaXN0b3J5XG59O1xuXG5mdW5jdGlvbiBleHRlbmQgKHRvLCBmcm9tKXtcbiAgT2JqZWN0LmtleXMoZnJvbSkuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICB0b1trXSA9IGZyb21ba107IFxuICB9KTtcbiAgcmV0dXJuIHRvO1xufTtcblxuZnVuY3Rpb24gdHJhbnNpdGlvbldpdGhUYXJnZXRzKHQpe1xuICAgIHJldHVybiB0LnRhcmdldHM7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25Db21wYXJhdG9yKHQxLCB0Mikge1xuICAgIHJldHVybiB0MS5kb2N1bWVudE9yZGVyIC0gdDIuZG9jdW1lbnRPcmRlcjtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZU1vZGVsKHJvb3RTdGF0ZSl7XG4gICAgdmFyIHRyYW5zaXRpb25zID0gW10sIGlkVG9TdGF0ZU1hcCA9IG5ldyBNYXAoKSwgZG9jdW1lbnRPcmRlciA9IDA7XG5cblxuICAgIC8vVE9ETzogbmVlZCB0byBhZGQgZmFrZSBpZHMgdG8gYW55b25lIHRoYXQgZG9lc24ndCBoYXZlIHRoZW1cbiAgICAvL0ZJWE1FOiBtYWtlIHRoaXMgc2FmZXIgLSBicmVhayBpbnRvIG11bHRpcGxlIHBhc3Nlc1xuICAgIHZhciBpZENvdW50ID0ge307XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUlkKHR5cGUpe1xuICAgICAgICBpZihpZENvdW50W3R5cGVdID09PSB1bmRlZmluZWQpIGlkQ291bnRbdHlwZV0gPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICB2YXIgY291bnQgPSBpZENvdW50W3R5cGVdKys7XG4gICAgICAgICAgdmFyIGlkID0gJyRnZW5lcmF0ZWQtJyArIHR5cGUgKyAnLScgKyBjb3VudDsgXG4gICAgICAgIH0gd2hpbGUgKGlkVG9TdGF0ZU1hcC5oYXMoaWQpKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyYXBJbkZha2VSb290U3RhdGUoc3RhdGUpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGRlc2VyaWFsaXplRGF0YW1vZGVsIDogc3RhdGUuJGRlc2VyaWFsaXplRGF0YW1vZGVsIHx8IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgICAgICRzZXJpYWxpemVEYXRhbW9kZWwgOiBzdGF0ZS4kc2VyaWFsaXplRGF0YW1vZGVsIHx8IGZ1bmN0aW9uKCl7IHJldHVybiBudWxsO30sXG4gICAgICAgICAgICAkaWRUb1N0YXRlTWFwIDogaWRUb1N0YXRlTWFwLCAgIC8va2VlcCB0aGlzIGZvciBoYW5keSBkZXNlcmlhbGl6YXRpb24gb2Ygc2VyaWFsaXplZCBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICBkb2NVcmwgOiBzdGF0ZS5kb2NVcmwsXG4gICAgICAgICAgICBzdGF0ZXMgOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkdHlwZSA6ICdpbml0aWFsJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbnMgOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0IDogc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0YXRlXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlc1dpdGhJbml0aWFsQXR0cmlidXRlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICBAdGhpcyB7U0NUcmFuc2l0aW9ufVxuICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvblRvU3RyaW5nKHNvdXJjZVN0YXRlKXtcbiAgICAgIHJldHVybiBgJHtzb3VyY2VTdGF0ZX0gLS0gJHt0aGlzLmV2ZW50cyA/ICcoJyArIHRoaXMuZXZlbnRzLmpvaW4oJywnKSArICcpJyA6IG51bGx9JHt0aGlzLmNvbmQgPyAnWycgKyB0aGlzLmNvbmQubmFtZSArICddJyA6ICcnfSAtLT4gJHt0aGlzLnRhcmdldHMgPyB0aGlzLnRhcmdldHMuam9pbignLCcpIDogbnVsbH1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAgQHRoaXMge1NDU3RhdGV9XG4gICAgKi9cbiAgICBmdW5jdGlvbiBzdGF0ZVRvU3RyaW5nKCl7XG4gICAgICByZXR1cm4gdGhpcy5pZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZVN0YXRlSWRNYXAoc3RhdGUpe1xuICAgICAgLy9wb3B1bGF0ZSBzdGF0ZSBpZCBtYXBcbiAgICAgIGlmKHN0YXRlLmlkKXtcbiAgICAgICAgICBpZFRvU3RhdGVNYXAuc2V0KHN0YXRlLmlkLCBzdGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZS5zdGF0ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgcG9wdWxhdGVTdGF0ZUlkTWFwKHN0YXRlLnN0YXRlc1tqXSk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYXZlcnNlKGFuY2VzdG9ycyxzdGF0ZSl7XG5cbiAgICAgICAgaWYocHJpbnRUcmFjZSkgc3RhdGUudG9TdHJpbmcgPSBzdGF0ZVRvU3RyaW5nO1xuXG4gICAgICAgIC8vYWRkIHRvIGdsb2JhbCB0cmFuc2l0aW9uIGFuZCBzdGF0ZSBpZCBjYWNoZXNcbiAgICAgICAgaWYoc3RhdGUudHJhbnNpdGlvbnMpIHRyYW5zaXRpb25zLnB1c2guYXBwbHkodHJhbnNpdGlvbnMsc3RhdGUudHJhbnNpdGlvbnMpO1xuXG4gICAgICAgIC8vY3JlYXRlIGEgZGVmYXVsdCB0eXBlLCBqdXN0IHRvIG5vcm1hbGl6ZSB0aGluZ3NcbiAgICAgICAgLy90aGlzIHdheSB3ZSBjYW4gY2hlY2sgZm9yIHVuc3VwcG9ydGVkIHR5cGVzIGJlbG93XG4gICAgICAgIHN0YXRlLiR0eXBlID0gc3RhdGUuJHR5cGUgfHwgJ3N0YXRlJztcblxuICAgICAgICAvL2FkZCBhbmNlc3RvcnMgYW5kIGRlcHRoIHByb3BlcnRpZXNcbiAgICAgICAgc3RhdGUuYW5jZXN0b3JzID0gYW5jZXN0b3JzO1xuICAgICAgICBzdGF0ZS5kZXB0aCA9IGFuY2VzdG9ycy5sZW5ndGg7XG4gICAgICAgIHN0YXRlLnBhcmVudCA9IGFuY2VzdG9yc1swXTtcbiAgICAgICAgc3RhdGUuZG9jdW1lbnRPcmRlciA9IGRvY3VtZW50T3JkZXIrKzsgXG5cbiAgICAgICAgLy9hZGQgc29tZSBpbmZvcm1hdGlvbiB0byB0cmFuc2l0aW9uc1xuICAgICAgICBzdGF0ZS50cmFuc2l0aW9ucyA9IHN0YXRlLnRyYW5zaXRpb25zIHx8IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gc3RhdGUudHJhbnNpdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gc3RhdGUudHJhbnNpdGlvbnNbal07XG4gICAgICAgICAgICB0cmFuc2l0aW9uLmRvY3VtZW50T3JkZXIgPSBkb2N1bWVudE9yZGVyKys7IFxuICAgICAgICAgICAgdHJhbnNpdGlvbi5zb3VyY2UgPSBzdGF0ZTtcbiAgICAgICAgICAgIGlmKHByaW50VHJhY2UpIHRyYW5zaXRpb24udG9TdHJpbmcgPSB0cmFuc2l0aW9uVG9TdHJpbmcuYmluZCh0cmFuc2l0aW9uLCBzdGF0ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9yZWN1cnNpdmUgc3RlcFxuICAgICAgICBpZihzdGF0ZS5zdGF0ZXMpIHtcbiAgICAgICAgICAgIHZhciBhbmNzID0gW3N0YXRlXS5jb25jYXQoYW5jZXN0b3JzKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZS5zdGF0ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0cmF2ZXJzZShhbmNzLCBzdGF0ZS5zdGF0ZXNbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9zZXR1cCBmYXN0IHN0YXRlIHR5cGVcbiAgICAgICAgc3dpdGNoKHN0YXRlLiR0eXBlKXtcbiAgICAgICAgICAgIGNhc2UgJ3BhcmFsbGVsJzpcbiAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9IFNUQVRFX1RZUEVTLlBBUkFMTEVMO1xuICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbml0aWFsJyA6IFxuICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuSU5JVElBTDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5pc0F0b21pYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdoaXN0b3J5JyA6XG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5ISVNUT1JZO1xuICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZpbmFsJyA6IFxuICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuRklOQUw7XG4gICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RhdGUnIDogXG4gICAgICAgICAgICBjYXNlICdzY3htbCcgOlxuICAgICAgICAgICAgICAgIGlmKHN0YXRlLnN0YXRlcyAmJiBzdGF0ZS5zdGF0ZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5DT01QT1NJVEU7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuQkFTSUM7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gc3RhdGUgdHlwZTogJyArIHN0YXRlLiR0eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGVzY2VuZGFudHMgcHJvcGVydHkgb24gc3RhdGVzIHdpbGwgbm93IGJlIHBvcHVsYXRlZC4gYWRkIGRlc2NlbmRhbnRzIHRvIHRoaXMgc3RhdGVcbiAgICAgICAgaWYoc3RhdGUuc3RhdGVzKXtcbiAgICAgICAgICAgIHN0YXRlLmRlc2NlbmRhbnRzID0gc3RhdGUuc3RhdGVzLmNvbmNhdChzdGF0ZS5zdGF0ZXMubWFwKGZ1bmN0aW9uKHMpe3JldHVybiBzLmRlc2NlbmRhbnRzO30pLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhLmNvbmNhdChiKTt9LFtdKSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgc3RhdGUuZGVzY2VuZGFudHMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbml0aWFsQ2hpbGRyZW47XG4gICAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBTVEFURV9UWVBFUy5DT01QT1NJVEUpe1xuICAgICAgICAgICAgLy9zZXQgdXAgaW5pdGlhbCBzdGF0ZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KHN0YXRlLmluaXRpYWwpIHx8IHR5cGVvZiBzdGF0ZS5pbml0aWFsID09PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICAgICAgc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzLnB1c2goc3RhdGUpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgLy90YWtlIHRoZSBmaXJzdCBjaGlsZCB0aGF0IGhhcyBpbml0aWFsIHR5cGUsIG9yIGZpcnN0IGNoaWxkXG4gICAgICAgICAgICAgICAgaW5pdGlhbENoaWxkcmVuID0gc3RhdGUuc3RhdGVzLmZpbHRlcihmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC4kdHlwZSA9PT0gJ2luaXRpYWwnO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5pdGlhbFJlZiA9IFtpbml0aWFsQ2hpbGRyZW4ubGVuZ3RoID8gaW5pdGlhbENoaWxkcmVuWzBdIDogc3RhdGUuc3RhdGVzWzBdXTtcbiAgICAgICAgICAgICAgICBjaGVja0luaXRpYWxSZWYoc3RhdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvL2hvb2sgdXAgaGlzdG9yeVxuICAgICAgICBpZihzdGF0ZS50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuQ09NUE9TSVRFIHx8XG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLlBBUkFMTEVMKXtcblxuICAgICAgICAgICAgdmFyIGhpc3RvcnlDaGlsZHJlbiA9IHN0YXRlLnN0YXRlcy5maWx0ZXIoZnVuY3Rpb24ocyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMuJHR5cGUgPT09ICdoaXN0b3J5JztcbiAgICAgICAgICAgIH0pOyBcblxuICAgICAgICAgICBzdGF0ZS5oaXN0b3J5UmVmID0gaGlzdG9yeUNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9ub3cgaXQncyBzYWZlIHRvIGZpbGwgaW4gZmFrZSBzdGF0ZSBpZHNcbiAgICAgICAgaWYoIXN0YXRlLmlkKXtcbiAgICAgICAgICAgIHN0YXRlLmlkID0gZ2VuZXJhdGVJZChzdGF0ZS4kdHlwZSk7XG4gICAgICAgICAgICBpZFRvU3RhdGVNYXAuc2V0KHN0YXRlLmlkLCBzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL25vcm1hbGl6ZSBvbkVudHJ5L29uRXhpdCwgd2hpY2ggY2FuIGJlIHNpbmdsZSBmbiBvciBhcnJheSwgb3IgYXJyYXkgb2YgYXJyYXlzIChibG9ja3MpXG4gICAgICAgIFsnb25FbnRyeScsJ29uRXhpdCddLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7XG4gICAgICAgICAgaWYgKHN0YXRlW3Byb3BdKSB7XG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShzdGF0ZVtwcm9wXSkpe1xuICAgICAgICAgICAgICBzdGF0ZVtwcm9wXSA9IFtzdGF0ZVtwcm9wXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighc3RhdGVbcHJvcF0uZXZlcnkoZnVuY3Rpb24oaGFuZGxlcil7IHJldHVybiBBcnJheS5pc0FycmF5KGhhbmRsZXIpOyB9KSl7XG4gICAgICAgICAgICAgIHN0YXRlW3Byb3BdID0gW3N0YXRlW3Byb3BdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdGF0ZS5pbnZva2VzICYmICFBcnJheS5pc0FycmF5KHN0YXRlLmludm9rZXMpKSB7XG4gICAgICAgICAgICBzdGF0ZS5pbnZva2VzID0gW3N0YXRlLmludm9rZXNdO1xuICAgICAgICAgICAgc3RhdGUuaW52b2tlcy5mb3JFYWNoKCBpbnZva2UgPT4ge1xuICAgICAgICAgICAgICBpZiAoaW52b2tlLmZpbmFsaXplICYmICFBcnJheS5pc0FycmF5KGludm9rZS5maW5hbGl6ZSkpIHtcbiAgICAgICAgICAgICAgICBpbnZva2UuZmluYWxpemUgPSBbaW52b2tlLmZpbmFsaXplXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vVE9ETzogY29udmVydCBldmVudHMgdG8gcmVndWxhciBleHByZXNzaW9ucyBpbiBhZHZhbmNlXG5cbiAgICBmdW5jdGlvbiBjaGVja0luaXRpYWxSZWYoc3RhdGUpe1xuICAgICAgaWYoIXN0YXRlLmluaXRpYWxSZWYpIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBpbml0aWFsIHN0YXRlIGZvciBjb21wb3NpdGUgc3RhdGU6ICcgKyBzdGF0ZS5pZCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbm5lY3RJbnRpYWxBdHRyaWJ1dGVzKCl7XG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHZhciBzID0gc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzW2pdO1xuXG4gICAgICAgIHZhciBpbml0aWFsU3RhdGVzID0gQXJyYXkuaXNBcnJheShzLmluaXRpYWwpID8gcy5pbml0aWFsIDogW3MuaW5pdGlhbF07XG4gICAgICAgIHMuaW5pdGlhbFJlZiA9IGluaXRpYWxTdGF0ZXMubWFwKGZ1bmN0aW9uKGluaXRpYWxTdGF0ZSl7IHJldHVybiBpZFRvU3RhdGVNYXAuZ2V0KGluaXRpYWxTdGF0ZSk7IH0pO1xuICAgICAgICBjaGVja0luaXRpYWxSZWYocyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFJYX1dISVRFU1BBQ0UgPSAvXFxzKy87XG5cbiAgICBmdW5jdGlvbiBjb25uZWN0VHJhbnNpdGlvbkdyYXBoKCl7XG4gICAgICAgIC8vbm9ybWFsaXplIGFzIHdpdGggb25FbnRyeS9vbkV4aXRcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRyYW5zaXRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRyYW5zaXRpb25zW2ldO1xuICAgICAgICAgICAgaWYgKHQub25UcmFuc2l0aW9uICYmICFBcnJheS5pc0FycmF5KHQub25UcmFuc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHQub25UcmFuc2l0aW9uID0gW3Qub25UcmFuc2l0aW9uXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9ub3JtYWxpemUgXCJldmVudFwiIGF0dHJpYnV0ZSBpbnRvIFwiZXZlbnRzXCIgYXR0cmlidXRlXG4gICAgICAgICAgICBpZiAodHlwZW9mIHQuZXZlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdC5ldmVudHMgPSB0LmV2ZW50LnRyaW0oKS5zcGxpdChSWF9XSElURVNQQUNFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSB0LmV2ZW50O1xuXG4gICAgICAgICAgICBpZih0LnRhcmdldHMgfHwgKHR5cGVvZiB0LnRhcmdldCA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgLy90YXJnZXRzIGhhdmUgYWxyZWFkeSBiZWVuIHNldCB1cFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSAgIFxuXG4gICAgICAgICAgICBpZih0eXBlb2YgdC50YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gaWRUb1N0YXRlTWFwLmdldCh0LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYoIXRhcmdldCkgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCB0YXJnZXQgc3RhdGUgd2l0aCBpZCAnICsgdC50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHQudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIHQudGFyZ2V0cyA9IFt0LnRhcmdldF07XG4gICAgICAgICAgICB9ZWxzZSBpZihBcnJheS5pc0FycmF5KHQudGFyZ2V0KSl7XG4gICAgICAgICAgICAgICAgdC50YXJnZXRzID0gdC50YXJnZXQubWFwKGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGlkVG9TdGF0ZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0YXJnZXQpIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgdGFyZ2V0IHN0YXRlIHdpdGggaWQgJyArIHQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgdC50YXJnZXQgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgICAgICB0LnRhcmdldHMgPSBbdC50YXJnZXRdO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2l0aW9uIHRhcmdldCBoYXMgdW5rbm93biB0eXBlOiAnICsgdC50YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9ob29rIHVwIExDQSAtIG9wdGltaXphdGlvblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdHJhbnNpdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ID0gdHJhbnNpdGlvbnNbaV07XG4gICAgICAgICAgICBpZih0LnRhcmdldHMpIHQubGNjYSA9IGdldExDQ0EodC5zb3VyY2UsdC50YXJnZXRzWzBdKTsgICAgLy9GSVhNRTogd2UgdGVjaG5pY2FsbHkgZG8gbm90IG5lZWQgdG8gaGFuZyBvbnRvIHRoZSBsY2NhLiBvbmx5IHRoZSBzY29wZSBpcyB1c2VkIGJ5IHRoZSBhbGdvcml0aG1cblxuICAgICAgICAgICAgdC5zY29wZSA9IGdldFNjb3BlKHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2NvcGUodHJhbnNpdGlvbil7XG4gICAgICAgIC8vVHJhbnNpdGlvbiBzY29wZSBpcyBub3JtYWxseSB0aGUgbGVhc3QgY29tbW9uIGNvbXBvdW5kIGFuY2VzdG9yIChsY2NhKS5cbiAgICAgICAgLy9JbnRlcm5hbCB0cmFuc2l0aW9ucyBoYXZlIGEgc2NvcGUgZXF1YWwgdG8gdGhlIHNvdXJjZSBzdGF0ZS5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25Jc1JlYWxseUludGVybmFsID0gXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi50eXBlID09PSAnaW50ZXJuYWwnICYmXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnNvdXJjZS50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuQ09NUE9TSVRFICYmICAgLy9pcyB0cmFuc2l0aW9uIHNvdXJjZSBhIGNvbXBvc2l0ZSBzdGF0ZVxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5zb3VyY2UucGFyZW50ICYmICAgIC8vcm9vdCBzdGF0ZSB3b24ndCBoYXZlIHBhcmVudFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi50YXJnZXRzICYmIC8vZG9lcyBpdCB0YXJnZXQgaXRzIGRlc2NlbmRhbnRzXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnRhcmdldHMuZXZlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odGFyZ2V0KXsgcmV0dXJuIHRyYW5zaXRpb24uc291cmNlLmRlc2NlbmRhbnRzLmluZGV4T2YodGFyZ2V0KSA+IC0xO30pO1xuXG4gICAgICAgIGlmKCF0cmFuc2l0aW9uLnRhcmdldHMpe1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1lbHNlIGlmKHRyYW5zaXRpb25Jc1JlYWxseUludGVybmFsKXtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2l0aW9uLnNvdXJjZTsgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24ubGNjYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExDQ0EoczEsIHMyKSB7XG4gICAgICAgIHZhciBjb21tb25BbmNlc3RvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHMxLmFuY2VzdG9ycy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmFyIGFuYyA9IHMxLmFuY2VzdG9yc1tqXTtcbiAgICAgICAgICAgIGlmKChhbmMudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLkNPTVBPU0lURSB8fCBhbmMudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLlBBUkFMTEVMKSAmJlxuICAgICAgICAgICAgICAgIGFuYy5kZXNjZW5kYW50cy5pbmRleE9mKHMyKSA+IC0xKXtcbiAgICAgICAgICAgICAgICBjb21tb25BbmNlc3RvcnMucHVzaChhbmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZighY29tbW9uQW5jZXN0b3JzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGZpbmQgTENBIGZvciBzdGF0ZXMuXCIpO1xuICAgICAgICByZXR1cm4gY29tbW9uQW5jZXN0b3JzWzBdO1xuICAgIH1cblxuICAgIC8vbWFpbiBleGVjdXRpb24gc3RhcnRzIGhlcmVcbiAgICAvL0ZJWE1FOiBvbmx5IHdyYXAgaW4gcm9vdCBzdGF0ZSBpZiBpdCdzIG5vdCBhIGNvbXBvdW5kIHN0YXRlXG4gICAgcG9wdWxhdGVTdGF0ZUlkTWFwKHJvb3RTdGF0ZSk7XG4gICAgdmFyIGZha2VSb290U3RhdGUgPSB3cmFwSW5GYWtlUm9vdFN0YXRlKHJvb3RTdGF0ZSk7ICAvL0kgd2lzaCB3ZSBoYWQgcG9pbnRlciBzZW1hbnRpY3MgYW5kIGNvdWxkIG1ha2UgdGhpcyBhIEMtc3R5bGUgXCJvdXQgYXJndW1lbnRcIi4gSW5zdGVhZCB3ZSByZXR1cm4gaGltXG4gICAgdHJhdmVyc2UoW10sZmFrZVJvb3RTdGF0ZSk7XG4gICAgY29ubmVjdFRyYW5zaXRpb25HcmFwaCgpO1xuICAgIGNvbm5lY3RJbnRpYWxBdHRyaWJ1dGVzKCk7XG5cbiAgICByZXR1cm4gZmFrZVJvb3RTdGF0ZTtcbn1cblxuXG5mdW5jdGlvbiBpc0V2ZW50UHJlZml4TWF0Y2gocHJlZml4LCBmdWxsTmFtZSkge1xuICAgIHByZWZpeCA9IHByZWZpeC5yZXBsYWNlKFJYX1RSQUlMSU5HX1dJTERDQVJELCAnJyk7XG5cbiAgICBpZiAocHJlZml4ID09PSBmdWxsTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4Lmxlbmd0aCA+IGZ1bGxOYW1lLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGZ1bGxOYW1lLmNoYXJBdChwcmVmaXgubGVuZ3RoKSAhPT0gJy4nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGZ1bGxOYW1lLmluZGV4T2YocHJlZml4KSA9PT0gMCk7XG59XG5cbmZ1bmN0aW9uIGlzVHJhbnNpdGlvbk1hdGNoKHQsIGV2ZW50TmFtZSkge1xuICAgIHJldHVybiB0LmV2ZW50cy5zb21lKCh0RXZlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRFdmVudCA9PT0gJyonIHx8IGlzRXZlbnRQcmVmaXhNYXRjaCh0RXZlbnQsIGV2ZW50TmFtZSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNjeG1sUHJlZml4VHJhbnNpdGlvblNlbGVjdG9yKHQsIGV2ZW50LCBldmFsdWF0b3IsIHNlbGVjdEV2ZW50bGVzc1RyYW5zaXRpb25zKSB7XG4gICAgcmV0dXJuICggXG4gICAgICBzZWxlY3RFdmVudGxlc3NUcmFuc2l0aW9ucyA/IFxuICAgICAgICAhdC5ldmVudHMgOlxuICAgICAgICAodC5ldmVudHMgJiYgZXZlbnQgJiYgZXZlbnQubmFtZSAmJiBpc1RyYW5zaXRpb25NYXRjaCh0LCBldmVudC5uYW1lKSlcbiAgICAgIClcbiAgICAgICYmICghdC5jb25kIHx8IGV2YWx1YXRvcih0LmNvbmQpKTtcbn1cblxuZnVuY3Rpb24gZXZlbnRsZXNzVHJhbnNpdGlvblNlbGVjdG9yKHN0YXRlKXtcbiAgcmV0dXJuIHN0YXRlLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbih0cmFuc2l0aW9uKXsgcmV0dXJuICF0cmFuc2l0aW9uLmV2ZW50cyB8fCAoIHRyYW5zaXRpb24uZXZlbnRzICYmIHRyYW5zaXRpb24uZXZlbnRzLmxlbmd0aCA9PT0gMCApOyB9KTtcbn1cblxuLy9wcmlvcml0eSBjb21wYXJpc29uIGZ1bmN0aW9uc1xuZnVuY3Rpb24gZ2V0VHJhbnNpdGlvbldpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KF9hcmdzKSB7XG4gICAgbGV0IHQxID0gX2FyZ3NbMF0sIHQyID0gX2FyZ3NbMV07XG4gICAgdmFyIHIgPSBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KHQxLnNvdXJjZSwgdDIuc291cmNlKTtcbiAgICAvL2NvbXBhcmUgdHJhbnNpdGlvbnMgYmFzZWQgZmlyc3Qgb24gZGVwdGgsIHRoZW4gYmFzZWQgb24gZG9jdW1lbnQgb3JkZXJcbiAgICBpZiAodDEuc291cmNlLmRlcHRoIDwgdDIuc291cmNlLmRlcHRoKSB7XG4gICAgICAgIHJldHVybiB0MjtcbiAgICB9IGVsc2UgaWYgKHQyLnNvdXJjZS5kZXB0aCA8IHQxLnNvdXJjZS5kZXB0aCkge1xuICAgICAgICByZXR1cm4gdDE7XG4gICAgfSBlbHNlIHtcbiAgICAgICBpZiAodDEuZG9jdW1lbnRPcmRlciA8IHQyLmRvY3VtZW50T3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0MTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0MjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc29ydEluRW50cnlPcmRlcihzMSwgczIpe1xuICByZXR1cm4gZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eShzMSwgczIpICogLTFcbn1cblxuZnVuY3Rpb24gZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eShzMSwgczIpIHtcbiAgICAvL2NvbXBhcmUgc3RhdGVzIGJhc2VkIGZpcnN0IG9uIGRlcHRoLCB0aGVuIGJhc2VkIG9uIGRvY3VtZW50IG9yZGVyXG4gICAgaWYgKHMxLmRlcHRoID4gczIuZGVwdGgpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH0gZWxzZSBpZiAoczEuZGVwdGggPCBzMi5kZXB0aCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL0VxdWFsaXR5XG4gICAgICAgIGlmIChzMS5kb2N1bWVudE9yZGVyIDwgczIuZG9jdW1lbnRPcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAoczEuZG9jdW1lbnRPcmRlciA+IHMyLmRvY3VtZW50T3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuKG1vZGVsRm4sIG9wdHMsIGludGVycHJldGVyKXtcbiAgICByZXR1cm4gbW9kZWxGbi5jYWxsKGludGVycHJldGVyLFxuICAgICAgICBvcHRzLl94LFxuICAgICAgICBvcHRzLl94Ll9zZXNzaW9uaWQsXG4gICAgICAgIG9wdHMuX3guX2lvcHJvY2Vzc29ycyxcbiAgICAgICAgaW50ZXJwcmV0ZXIuaXNJbi5iaW5kKGludGVycHJldGVyKSk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplU2VyaWFsaXplZENvbmZpZ3VyYXRpb24oc2VyaWFsaXplZENvbmZpZ3VyYXRpb24saWRUb1N0YXRlTWFwKXtcbiAgcmV0dXJuIHNlcmlhbGl6ZWRDb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbihpZCl7XG4gICAgdmFyIHN0YXRlID0gaWRUb1N0YXRlTWFwLmdldChpZCk7XG4gICAgaWYoIXN0YXRlKSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGxvYWRpbmcgc2VyaWFsaXplZCBjb25maWd1cmF0aW9uLiBVbmFibGUgdG8gbG9jYXRlIHN0YXRlIHdpdGggaWQgJyArIGlkKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUhpc3Rvcnkoc2VyaWFsaXplZEhpc3RvcnksaWRUb1N0YXRlTWFwKXtcbiAgdmFyIG8gPSB7fTtcbiAgT2JqZWN0LmtleXMoc2VyaWFsaXplZEhpc3RvcnkpLmZvckVhY2goZnVuY3Rpb24oc2lkKXtcbiAgICBvW3NpZF0gPSBzZXJpYWxpemVkSGlzdG9yeVtzaWRdLm1hcChmdW5jdGlvbihpZCl7XG4gICAgICB2YXIgc3RhdGUgPSBpZFRvU3RhdGVNYXAuZ2V0KGlkKTtcbiAgICAgIGlmKCFzdGF0ZSkgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBsb2FkaW5nIHNlcmlhbGl6ZWQgaGlzdG9yeS4gVW5hYmxlIHRvIGxvY2F0ZSBzdGF0ZSB3aXRoIGlkICcgKyBpZCk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gbztcbn1cblxuIiwiLy9tb2RlbCBhY2Nlc3NvciBmdW5jdGlvbnNcbmNvbnN0IHF1ZXJ5ID0ge1xuICAgIGlzRGVzY2VuZGFudCA6IGZ1bmN0aW9uKHMxLCBzMil7XG4gICAgICAvL1JldHVybnMgJ3RydWUnIGlmIHN0YXRlMSBpcyBhIGRlc2NlbmRhbnQgb2Ygc3RhdGUyIChhIGNoaWxkLCBvciBhIGNoaWxkIG9mIGEgY2hpbGQsIG9yIGEgY2hpbGQgb2YgYSBjaGlsZCBvZiBhIGNoaWxkLCBldGMuKSBPdGhlcndpc2UgcmV0dXJucyAnZmFsc2UnLlxuICAgICAgcmV0dXJuIHMyLmRlc2NlbmRhbnRzLmluZGV4T2YoczEpID4gLTE7XG4gICAgfSxcbiAgICBnZXRBbmNlc3RvcnM6IGZ1bmN0aW9uKHMsIHJvb3QpIHtcbiAgICAgICAgdmFyIGFuY2VzdG9ycywgaW5kZXgsIHN0YXRlO1xuICAgICAgICBpbmRleCA9IHMuYW5jZXN0b3JzLmluZGV4T2Yocm9vdCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5hbmNlc3RvcnMuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHMuYW5jZXN0b3JzO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRBbmNlc3RvcnNPclNlbGY6IGZ1bmN0aW9uKHMsIHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIFtzXS5jb25jYXQocXVlcnkuZ2V0QW5jZXN0b3JzKHMsIHJvb3QpKTtcbiAgICB9LFxuICAgIGdldERlc2NlbmRhbnRzT3JTZWxmOiBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBbc10uY29uY2F0KHMuZGVzY2VuZGFudHMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcXVlcnk7XG4iLCIvLyAgIENvcHlyaWdodCAyMDEyLTIwMTIgSmFjb2IgQmVhcmQsIElORklDT04sIGFuZCBvdGhlciBTQ0lPTiBjb250cmlidXRvcnNcbi8vXG4vLyAgIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vICAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyAgIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vICAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyAgIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vICAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8qKlxuICogU0NJT04tQ09SRSBnbG9iYWwgb2JqZWN0XG4gKiBAbmFtZXNwYWNlIHNjaW9uXG4gKi9cblxuLyoqXG4gKiBBbiBBcnJheSBvZiBzdHJpbmdzIHJlcHJlc2VudGluZyB0aGUgaWRzIGFsbCBvZiB0aGUgYmFzaWMgc3RhdGVzIHRoZVxuICogaW50ZXJwcmV0ZXIgaXMgaW4gYWZ0ZXIgYSBiaWctc3RlcCBjb21wbGV0ZXMuXG4gKiBAdHlwZWRlZiB7QXJyYXk8c3RyaW5nPn0gQ29uZmlndXJhdGlvblxuICovXG5cbi8qKlxuICogQSBzZXQgb2YgYmFzaWMgYW5kIGNvbXBvc2l0ZSBzdGF0ZSBpZHMuXG4gKiBAdHlwZWRlZiB7QXJyYXk8c3RyaW5nPn0gRnVsbENvbmZpZ3VyYXRpb25cbiAqL1xuXG4vKipcbiAqIEEgc2V0IG9mIGJhc2ljIGFuZCBjb21wb3NpdGUgc3RhdGUgaWRzLlxuICogQHR5cGVkZWYge0FycmF5PHN0cmluZz59IEZ1bGxDb25maWd1cmF0aW9uXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZXZlbnRzJykuRXZlbnRFbWl0dGVyLFxuICB1dGlsID0gcmVxdWlyZSgndXRpbCcpLFxuICBBcnJheVNldCA9IHJlcXVpcmUoJy4vQXJyYXlTZXQnKSxcbiAgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKSxcbiAgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpLFxuICBxdWVyeSA9IHJlcXVpcmUoJy4vcXVlcnknKSxcbiAgZXh0ZW5kID0gaGVscGVycy5leHRlbmQsXG4gIHRyYW5zaXRpb25XaXRoVGFyZ2V0cyA9IGhlbHBlcnMudHJhbnNpdGlvbldpdGhUYXJnZXRzLFxuICB0cmFuc2l0aW9uQ29tcGFyYXRvciA9IGhlbHBlcnMudHJhbnNpdGlvbkNvbXBhcmF0b3IsXG4gIGluaXRpYWxpemVNb2RlbCA9IGhlbHBlcnMuaW5pdGlhbGl6ZU1vZGVsLFxuICBpc0V2ZW50UHJlZml4TWF0Y2ggPSBoZWxwZXJzLmlzRXZlbnRQcmVmaXhNYXRjaCxcbiAgaXNUcmFuc2l0aW9uTWF0Y2ggPSBoZWxwZXJzLmlzVHJhbnNpdGlvbk1hdGNoLFxuICBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvciA9IGhlbHBlcnMuc2N4bWxQcmVmaXhUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGV2ZW50bGVzc1RyYW5zaXRpb25TZWxlY3RvciA9IGhlbHBlcnMuZXZlbnRsZXNzVHJhbnNpdGlvblNlbGVjdG9yLFxuICBnZXRUcmFuc2l0aW9uV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkgPSBoZWxwZXJzLmdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgc29ydEluRW50cnlPcmRlciA9IGhlbHBlcnMuc29ydEluRW50cnlPcmRlcixcbiAgZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA9IGhlbHBlcnMuZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4gPSBoZWxwZXJzLmluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuLFxuICBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uID0gaGVscGVycy5kZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uLFxuICBkZXNlcmlhbGl6ZUhpc3RvcnkgPSBoZWxwZXJzLmRlc2VyaWFsaXplSGlzdG9yeSxcbiAgQkFTSUMgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuQkFTSUMsXG4gIENPTVBPU0lURSA9IGNvbnN0YW50cy5TVEFURV9UWVBFUy5DT01QT1NJVEUsXG4gIFBBUkFMTEVMID0gY29uc3RhbnRzLlNUQVRFX1RZUEVTLlBBUkFMTEVMLFxuICBISVNUT1JZID0gY29uc3RhbnRzLlNUQVRFX1RZUEVTLkhJU1RPUlksXG4gIElOSVRJQUwgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuSU5JVElBTCxcbiAgRklOQUwgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuRklOQUwsXG4gIFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUgID0gY29uc3RhbnRzLlNDWE1MX0lPUFJPQ0VTU09SX1RZUEU7XG5cbmNvbnN0IHByaW50VHJhY2UgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgISFwcm9jZXNzLmVudi5ERUJVRztcblxuQmFzZUludGVycHJldGVyLkVWRU5UUyA9IFtcbiAgJ29uRW50cnknLFxuICAnb25FeGl0JyxcbiAgJ29uVHJhbnNpdGlvbicsXG4gICdvbkRlZmF1bHRFbnRyeScsXG4gICdvbkVycm9yJyxcbiAgJ29uQmlnU3RlcEJlZ2luJyxcbiAgJ29uQmlnU3RlcEVuZCcsXG4gICdvbkJpZ1N0ZXBTdXNwZW5kJyxcbiAgJ29uQmlnU3RlcFJlc3VtZScsXG4gICdvblNtYWxsU3RlcEJlZ2luJyxcbiAgJ29uU21hbGxTdGVwRW5kJyxcbiAgJ29uQmlnU3RlcEVuZCcsXG4gICdvbkV4aXRJbnRlcnByZXRlcidcbl07XG5cbi8qKiBcbiAqIEBkZXNjcmlwdGlvbiBUaGUgU0NYTUwgY29uc3RydWN0b3IgY3JlYXRlcyBhbiBpbnRlcnByZXRlciBpbnN0YW5jZSBmcm9tIGEgbW9kZWwgb2JqZWN0LlxuICogQGFic3RyYWN0XG4gKiBAY2xhc3MgQmFzZUludGVycHJldGVyXG4gKiBAbWVtYmVyb2Ygc2Npb25cbiAqIEBleHRlbmRzIEV2ZW50RW1pdHRlclxuICogQHBhcmFtIHtTQ0pTT04gfCBzY3htbC5Nb2RlbEZhY3Rvcnl9IG1vZGVsT3JNb2RlbEZhY3RvcnkgRWl0aGVyIGFuIFNDSlNPTiByb290IHN0YXRlOyBvciBhbiBzY3htbC5Nb2RlbEZhY3RvcnksIHdoaWNoIGlzIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBTQ0pTT04gb2JqZWN0LiBcbiAqIEBwYXJhbSBvcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdHMuc2Vzc2lvbmlkXSBVc2VkIHRvIHBvcHVsYXRlIFNDWE1MIF9zZXNzaW9uaWQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0cy5nZW5lcmF0ZVNlc3Npb25pZF0gRmFjdG9yeSB1c2VkIHRvIGdlbmVyYXRlIHNlc3Npb25pZCBpZiBzZXNzaW9uaWQga2V5d29yZCBpcyBub3Qgc3BlY2lmaWVkXG4gKiBAcGFyYW0ge01hcDxzdHJpbmcsIEJhc2VJbnRlcnByZXRlcj59IFtvcHRzLnNlc3Npb25SZWdpc3RyeV0gTWFwIHVzZWQgdG8gbWFwIHNlc3Npb25pZCBzdHJpbmdzIHRvIFN0YXRlY2hhcnQgaW5zdGFuY2VzLlxuICogQHBhcmFtIFtvcHRzLlNldF0gQ2xhc3MgdG8gdXNlIGFzIGFuIEFycmF5U2V0LiBEZWZhdWx0cyB0byBFUzYgU2V0LlxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRzLnBhcmFtc10gIFVzZWQgdG8gcGFzcyBwYXJhbXMgZnJvbSBpbnZva2UuIFNldHMgdGhlIGRhdGFtb2RlbCB3aGVuIGludGVycHJldGVyIGlzIGluc3RhbnRpYXRlZC5cbiAqIEBwYXJhbSB7U25hcHNob3R9IFtvcHRzLnNuYXBzaG90XSBTdGF0ZSBtYWNoaW5lIHNuYXBzaG90LiBVc2VkIHRvIHJlc3RvcmUgYSBzZXJpYWxpemVkIHN0YXRlIG1hY2hpbmUuXG4gKiBAcGFyYW0ge1N0YXRlY2hhcnR9IFtvcHRzLnBhcmVudFNlc3Npb25dICBVc2VkIHRvIHBhc3MgcGFyZW50IHNlc3Npb24gZHVyaW5nIGludm9rZS5cbiAqIEBwYXJhbSB7c3RyaW5nIH1bb3B0cy5pbnZva2VpZF0gIFN1cHBvcnQgZm9yIGlkIG9mIGludm9rZSBlbGVtZW50IGF0IHJ1bnRpbWUuXG4gKiBAcGFyYW0gW29wdHMuY29uc29sZV1cbiAqIEBwYXJhbSBbb3B0cy50cmFuc2l0aW9uU2VsZWN0b3JdXG4gKiBAcGFyYW0gW29wdHMuY3VzdG9tQ2FuY2VsXVxuICogQHBhcmFtIFtvcHRzLmN1c3RvbVNlbmRdXG4gKiBAcGFyYW0gW29wdHMuc2VuZEFzeW5jXVxuICogQHBhcmFtIFtvcHRzLmRvU2VuZF1cbiAqIEBwYXJhbSBbb3B0cy5pbnZva2Vyc11cbiAqIEBwYXJhbSBbb3B0cy54bWxQYXJzZXJdXG4gKiBAcGFyYW0gW29wdHMuaW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0XVxuICovXG5mdW5jdGlvbiBCYXNlSW50ZXJwcmV0ZXIobW9kZWxPck1vZGVsRmFjdG9yeSwgb3B0cyl7XG5cbiAgICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQgPSBvcHRzLmludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCB8fCAob3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgPyBuZXcgb3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQodGhpcykgOiB7fSk7IFxuXG5cbiAgICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgdGhpcy5vcHRzLmdlbmVyYXRlU2Vzc2lvbmlkID0gdGhpcy5vcHRzLmdlbmVyYXRlU2Vzc2lvbmlkIHx8IEJhc2VJbnRlcnByZXRlci5nZW5lcmF0ZVNlc3Npb25pZDtcbiAgICB0aGlzLm9wdHMuc2Vzc2lvbmlkID0gdGhpcy5vcHRzLnNlc3Npb25pZCB8fCB0aGlzLm9wdHMuZ2VuZXJhdGVTZXNzaW9uaWQoKTtcbiAgICB0aGlzLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5ID0gdGhpcy5vcHRzLnNlc3Npb25SZWdpc3RyeSB8fCBCYXNlSW50ZXJwcmV0ZXIuc2Vzc2lvblJlZ2lzdHJ5OyAgLy9UT0RPOiBkZWZpbmUgYSBiZXR0ZXIgaW50ZXJmYWNlLiBGb3Igbm93LCBhc3N1bWUgYSBNYXA8c2Vzc2lvbmlkLCBzZXNzaW9uPlxuXG5cbiAgICBsZXQgX2lvcHJvY2Vzc29ycyA9IHt9O1xuICAgIF9pb3Byb2Nlc3NvcnNbU0NYTUxfSU9QUk9DRVNTT1JfVFlQRV0gPSB7XG4gICAgICBsb2NhdGlvbiA6IGAjX3NjeG1sXyR7dGhpcy5vcHRzLnNlc3Npb25pZH1gXG4gICAgfVxuICAgIF9pb3Byb2Nlc3NvcnMuc2N4bWwgPSBfaW9wcm9jZXNzb3JzW1NDWE1MX0lPUFJPQ0VTU09SX1RZUEVdOyAgICAvL2FsaWFzXG5cbiAgICAvL1NDWE1MIHN5c3RlbSB2YXJpYWJsZXM6XG4gICAgb3B0cy5feCA9IHtcbiAgICAgICAgX3Nlc3Npb25pZCA6IG9wdHMuc2Vzc2lvbmlkLFxuICAgICAgICBfaW9wcm9jZXNzb3JzIDogX2lvcHJvY2Vzc29yc1xuICAgIH07XG5cblxuICAgIHZhciBtb2RlbDtcbiAgICBpZih0eXBlb2YgbW9kZWxPck1vZGVsRmFjdG9yeSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIG1vZGVsID0gaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4obW9kZWxPck1vZGVsRmFjdG9yeSwgb3B0cywgdGhpcyk7XG4gICAgfWVsc2UgaWYodHlwZW9mIG1vZGVsT3JNb2RlbEZhY3RvcnkgPT09ICdvYmplY3QnKXtcbiAgICAgICAgbW9kZWwgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1vZGVsT3JNb2RlbEZhY3RvcnkpKTsgLy9hc3N1bWUgb2JqZWN0XG4gICAgfWVsc2V7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBtb2RlbCB0eXBlLiBFeHBlY3RlZCBtb2RlbCBmYWN0b3J5IGZ1bmN0aW9uLCBvciBzY2pzb24gb2JqZWN0LicpO1xuICAgIH1cblxuICAgIHRoaXMuX21vZGVsID0gaW5pdGlhbGl6ZU1vZGVsKG1vZGVsKTtcblxuICAgIHRoaXMub3B0cy5jb25zb2xlID0gb3B0cy5jb25zb2xlIHx8ICh0eXBlb2YgY29uc29sZSA9PT0gJ3VuZGVmaW5lZCcgPyB7bG9nIDogZnVuY3Rpb24oKXt9fSA6IGNvbnNvbGUpOyAgIC8vcmVseSBvbiBnbG9iYWwgY29uc29sZSBpZiB0aGlzIGNvbnNvbGUgaXMgdW5kZWZpbmVkXG4gICAgdGhpcy5vcHRzLlNldCA9IHRoaXMub3B0cy5TZXQgfHwgQXJyYXlTZXQ7XG4gICAgdGhpcy5vcHRzLnRyYW5zaXRpb25TZWxlY3RvciA9IHRoaXMub3B0cy50cmFuc2l0aW9uU2VsZWN0b3IgfHwgc2N4bWxQcmVmaXhUcmFuc2l0aW9uU2VsZWN0b3I7XG5cbiAgICB0aGlzLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5LnNldChTdHJpbmcodGhpcy5vcHRzLnNlc3Npb25pZCksIHRoaXMpO1xuXG4gICAgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5sb2cgPSB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LmxvZyB8fCAoZnVuY3Rpb24gbG9nKCl7IFxuICAgICAgaWYodGhpcy5vcHRzLmNvbnNvbGUubG9nLmFwcGx5KXtcbiAgICAgICAgdGhpcy5vcHRzLmNvbnNvbGUubG9nLmFwcGx5KHRoaXMub3B0cy5jb25zb2xlLCBhcmd1bWVudHMpOyBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2cgb24gb2xkZXIgSUUgZG9lcyBub3Qgc3VwcG9ydCBGdW5jdGlvbi5hcHBseSwgc28ganVzdCBwYXNzIGhpbSB0aGUgZmlyc3QgYXJndW1lbnQuIEJlc3Qgd2UgY2FuIGRvIGZvciBub3cuXG4gICAgICAgIHRoaXMub3B0cy5jb25zb2xlLmxvZyhBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKS5qb2luKCcsJykpOyBcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpOyAgIC8vc2V0IHVwIGRlZmF1bHQgc2NyaXB0aW5nIGNvbnRleHQgbG9nIGZ1bmN0aW9uXG5cbiAgICB0aGlzLl9leHRlcm5hbEV2ZW50UXVldWUgPSBbXTtcbiAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUgPSBbXTtcblxuICAgIGlmKG9wdHMucGFyYW1zKXtcbiAgICAgIHRoaXMuX21vZGVsLiRkZXNlcmlhbGl6ZURhdGFtb2RlbChvcHRzLnBhcmFtcyk7ICAgLy9sb2FkIHVwIHRoZSBkYXRhbW9kZWxcbiAgICB9XG5cbiAgICAvL2NoZWNrIGlmIHdlJ3JlIGxvYWRpbmcgZnJvbSBhIHByZXZpb3VzIHNuYXBzaG90XG4gICAgaWYob3B0cy5zbmFwc2hvdCl7XG4gICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gbmV3IHRoaXMub3B0cy5TZXQoZGVzZXJpYWxpemVTZXJpYWxpemVkQ29uZmlndXJhdGlvbihvcHRzLnNuYXBzaG90WzBdLCB0aGlzLl9tb2RlbC4kaWRUb1N0YXRlTWFwKSk7XG4gICAgICB0aGlzLl9oaXN0b3J5VmFsdWUgPSBkZXNlcmlhbGl6ZUhpc3Rvcnkob3B0cy5zbmFwc2hvdFsxXSwgdGhpcy5fbW9kZWwuJGlkVG9TdGF0ZU1hcCk7IFxuICAgICAgdGhpcy5faXNJbkZpbmFsU3RhdGUgPSBvcHRzLnNuYXBzaG90WzJdO1xuICAgICAgdGhpcy5fbW9kZWwuJGRlc2VyaWFsaXplRGF0YW1vZGVsKG9wdHMuc25hcHNob3RbM10pOyAgIC8vbG9hZCB1cCB0aGUgZGF0YW1vZGVsXG4gICAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUgPSBvcHRzLnNuYXBzaG90WzRdO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IG5ldyB0aGlzLm9wdHMuU2V0KCk7XG4gICAgICB0aGlzLl9oaXN0b3J5VmFsdWUgPSB7fTtcbiAgICAgIHRoaXMuX2lzSW5GaW5hbFN0YXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9hZGQgZGVidWcgbG9nZ2luZ1xuICAgIEJhc2VJbnRlcnByZXRlci5FVkVOVFMuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XG4gICAgICB0aGlzLm9uKGV2ZW50LCB0aGlzLl9sb2cuYmluZCh0aGlzLGV2ZW50KSk7XG4gICAgfSwgdGhpcyk7XG59XG5cbi8vc29tZSBnbG9iYWwgc2luZ2xldG9ucyB0byB1c2UgdG8gZ2VuZXJhdGUgaW4tbWVtb3J5IHNlc3Npb24gaWRzLCBpbiBjYXNlIHRoZSB1c2VyIGRvZXMgbm90IHNwZWNpZnkgdGhlc2UgZGF0YSBzdHJ1Y3R1cmVzXG5CYXNlSW50ZXJwcmV0ZXIuc2Vzc2lvbklkQ291bnRlciA9IDE7XG5CYXNlSW50ZXJwcmV0ZXIuZ2VuZXJhdGVTZXNzaW9uaWQgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gQmFzZUludGVycHJldGVyLnNlc3Npb25JZENvdW50ZXIrKztcbn1cbkJhc2VJbnRlcnByZXRlci5zZXNzaW9uUmVnaXN0cnkgPSBuZXcgTWFwKCk7XG5cbi8qKlxuICogQGludGVyZmFjZSBFdmVudEVtaXR0ZXJcbiAqL1xuXG4vKipcbiogQGV2ZW50IHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkVycm9yXG4qIEBwcm9wZXJ0eSB7c3RyaW5nfSB0YWduYW1lIFRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgcHJvZHVjZWQgdGhlIGVycm9yLiBcbiogQHByb3BlcnR5IHtudW1iZXJ9IGxpbmUgVGhlIGxpbmUgaW4gdGhlIHNvdXJjZSBmaWxlIGluIHdoaWNoIHRoZSBlcnJvciBvY2N1cnJlZC5cbiogQHByb3BlcnR5IHtudW1iZXJ9IGNvbHVtbiBUaGUgY29sdW1uIGluIHRoZSBzb3VyY2UgZmlsZSBpbiB3aGljaCB0aGUgZXJyb3Igb2NjdXJyZWQuXG4qIEBwcm9wZXJ0eSB7c3RyaW5nfSByZWFzb24gQW4gaW5mb3JtYXRpdmUgZXJyb3IgbWVzc2FnZS4gVGhlIHRleHQgaXMgcGxhdGZvcm0tc3BlY2lmaWMgYW5kIHN1YmplY3QgdG8gY2hhbmdlLlxuKi9cblxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSNvblxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGxpc3RlbmVyXG4gKi9cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEV2ZW50RW1pdHRlci5wcm90b3R5cGUjb25jZVxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGxpc3RlbmVyXG4gKi9cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEV2ZW50RW1pdHRlci5wcm90b3R5cGUjb2ZmXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtjYWxsYmFja30gbGlzdGVuZXJcbiAqL1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSNlbWl0XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHthbnl9IGFyZ3NcbiAqL1xuXG5CYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlID0gZXh0ZW5kKGJlZ2V0KEV2ZW50RW1pdHRlci5wcm90b3R5cGUpLHtcbiAgXG4gICAgLyoqIFxuICAgICogQ2FuY2VscyB0aGUgc2Vzc2lvbi4gVGhpcyBjbGVhcnMgYWxsIHRpbWVyczsgcHV0cyB0aGUgaW50ZXJwcmV0ZXIgaW4gYVxuICAgICogZmluYWwgc3RhdGU7IGFuZCBydW5zIGFsbCBleGl0IGFjdGlvbnMgb24gY3VycmVudCBzdGF0ZXMuXG4gICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZVxuICAgICovXG4gICAgY2FuY2VsIDogZnVuY3Rpb24oKXtcbiAgICAgIGRlbGV0ZSB0aGlzLm9wdHMucGFyZW50U2Vzc2lvbjtcbiAgICAgIGlmKHRoaXMuX2lzSW5GaW5hbFN0YXRlKSByZXR1cm47XG4gICAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSA9IHRydWU7XG4gICAgICB0aGlzLl9sb2coYHNlc3Npb24gY2FuY2VsbGVkICR7dGhpcy5vcHRzLmludm9rZWlkfWApO1xuICAgICAgdGhpcy5fZXhpdEludGVycHJldGVyKG51bGwpO1xuICAgIH0sXG5cbiAgICBfZXhpdEludGVycHJldGVyIDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgLy9UT0RPOiBjYW5jZWwgaW52b2tlZCBzZXNzaW9uc1xuICAgICAgLy9jYW5jZWwgYWxsIGRlbGF5ZWQgc2VuZHMgd2hlbiB3ZSBlbnRlciBpbnRvIGEgZmluYWwgc3RhdGUuXG4gICAgICB0aGlzLl9jYW5jZWxBbGxEZWxheWVkU2VuZHMoKTtcblxuICAgICAgbGV0IHN0YXRlc1RvRXhpdCA9IHRoaXMuX2dldEZ1bGxDb25maWd1cmF0aW9uKCkuc29ydChnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KTtcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlc1RvRXhpdC5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIHZhciBzdGF0ZUV4aXRlZCA9IHN0YXRlc1RvRXhpdFtqXTtcblxuICAgICAgICAgIGlmKHN0YXRlRXhpdGVkLm9uRXhpdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGV4aXRJZHggPSAwLCBleGl0TGVuID0gc3RhdGVFeGl0ZWQub25FeGl0Lmxlbmd0aDsgZXhpdElkeCA8IGV4aXRMZW47IGV4aXRJZHgrKykge1xuICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gc3RhdGVFeGl0ZWQub25FeGl0W2V4aXRJZHhdO1xuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYmxvY2tJZHggPSAwLCBibG9ja0xlbiA9IGJsb2NrLmxlbmd0aDsgYmxvY2tJZHggPCBibG9ja0xlbjsgYmxvY2tJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSBibG9ja1tibG9ja0lkeF07XG4gICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vY2FuY2VsIGludm9rZWQgc2Vzc2lvblxuICAgICAgICAgIGlmKHN0YXRlRXhpdGVkLmludm9rZXMpIHN0YXRlRXhpdGVkLmludm9rZXMuZm9yRWFjaCggaW52b2tlID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuY2FuY2VsSW52b2tlKGludm9rZS5pZCk7XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC8vaWYgaGUgaXMgYSB0b3AtbGV2ZWwgPGZpbmFsPiBzdGF0ZSwgdGhlbiByZXR1cm4gdGhlIGRvbmUgZXZlbnRcbiAgICAgICAgICBpZiggc3RhdGVFeGl0ZWQuJHR5cGUgPT09ICdmaW5hbCcgJiZcbiAgICAgICAgICAgICAgc3RhdGVFeGl0ZWQucGFyZW50LiR0eXBlID09PSAnc2N4bWwnKXtcblxuICAgICAgICAgICAgaWYodGhpcy5vcHRzLnBhcmVudFNlc3Npb24pe1xuICAgICAgICAgICAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LnNlbmQoe1xuICAgICAgICAgICAgICAgIHRhcmdldDogJyNfcGFyZW50JywgXG4gICAgICAgICAgICAgICAgbmFtZTogJ2RvbmUuaW52b2tlLicgKyB0aGlzLm9wdHMuaW52b2tlaWQsXG4gICAgICAgICAgICAgICAgZGF0YSA6IHN0YXRlRXhpdGVkLmRvbmVkYXRhICYmIHN0YXRlRXhpdGVkLmRvbmVkYXRhLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgZXZlbnQpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5LmRlbGV0ZSh0aGlzLm9wdHMuc2Vzc2lvbmlkKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25FeGl0SW50ZXJwcmV0ZXInLCBldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKiBcbiAgICAgKiBTdGFydHMgdGhlIGludGVycHJldGVyLiBTaG91bGQgb25seSBiZSBjYWxsZWQgb25jZSwgYW5kIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgKiBiZWZvcmUgU3RhdGVjaGFydC5wcm90b3R5cGUjZ2VuIGlzIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUuICBSZXR1cm5zIGFcbiAgICAgKiBDb25maWd1cmF0aW9uLlxuICAgICAqIEByZXR1cm4ge0NvbmZpZ3VyYXRpb259XG4gICAgICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGVcbiAgICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRW50cnlcbiAgICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25UcmFuc2l0aW9uXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkRlZmF1bHRFbnRyeVxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FcnJvclxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwQmVnaW5cbiAgICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwU3VzcGVuZFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwUmVzdW1lXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEJlZ2luXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEVuZFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkV4aXRJbnRlcnByZXRlclxuICAgICAqL1xuICAgIHN0YXJ0IDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2luaXRTdGFydCgpO1xuICAgICAgICB0aGlzLl9wZXJmb3JtQmlnU3RlcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDb25maWd1cmF0aW9uKCk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogVGhpcyBjYWxsYmFjayBpcyBkaXNwbGF5ZWQgYXMgYSBnbG9iYWwgbWVtYmVyLlxuICAgICAqIEBjYWxsYmFjayBnZW5DYWxsYmFja1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICAgICAqIEBwYXJhbSB7Q29uZmlndXJhdGlvbn0gY29uZmlndXJhdGlvblxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIHRoZSBpbnRlcnByZXRlciBhc3luY2hyb25vdXNseVxuICAgICAqIEBwYXJhbSAge2dlbkNhbGxiYWNrfSBjYiBDYWxsYmFjayBpbnZva2VkIHdpdGggYW4gZXJyb3Igb3IgdGhlIGludGVycHJldGVyJ3Mgc3RhYmxlIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRW50cnlcbiAgICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25UcmFuc2l0aW9uXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkRlZmF1bHRFbnRyeVxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FcnJvclxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwQmVnaW5cbiAgICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwU3VzcGVuZFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwUmVzdW1lXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEJlZ2luXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEVuZFxuICAgICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4gICAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkV4aXRJbnRlcnByZXRlclxuICAgICAqL1xuICAgIHN0YXJ0QXN5bmMgOiBmdW5jdGlvbihjYikge1xuICAgICAgICBjYiA9IHRoaXMuX2luaXRTdGFydChjYik7XG4gICAgICAgIHRoaXMuZ2VuQXN5bmMobnVsbCwgY2IpO1xuICAgIH0sXG5cbiAgICBfaW5pdFN0YXJ0IDogZnVuY3Rpb24oY2Ipe1xuICAgICAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYiA9IG5vcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZyhcInBlcmZvcm1pbmcgaW5pdGlhbCBiaWcgc3RlcFwiKTtcblxuICAgICAgICAvL1dlIGVmZmVjdGl2ZWx5IG5lZWQgdG8gZmlndXJlIG91dCBzdGF0ZXMgdG8gZW50ZXIgaGVyZSB0byBwb3B1bGF0ZSBpbml0aWFsIGNvbmZpZy4gYXNzdW1pbmcgcm9vdCBpcyBjb21wb3VuZCBzdGF0ZSBtYWtlcyB0aGlzIHNpbXBsZS5cbiAgICAgICAgLy9idXQgaWYgd2Ugd2FudCBpdCB0byBiZSBwYXJhbGxlbCwgdGhlbiB0aGlzIGJlY29tZXMgbW9yZSBjb21wbGV4LiBzbyB3aGVuIGluaXRpYWxpemluZyB0aGUgbW9kZWwsIHdlIGFkZCBhICdmYWtlJyByb290IHN0YXRlLCB3aGljaFxuICAgICAgICAvL21ha2VzIHRoZSBmb2xsb3dpbmcgb3BlcmF0aW9uIHNhZmUuXG4gICAgICAgIHRoaXMuX21vZGVsLmluaXRpYWxSZWYuZm9yRWFjaCggcyA9PiB0aGlzLl9jb25maWd1cmF0aW9uLmFkZChzKSApO1xuXG4gICAgICAgIHJldHVybiBjYjtcbiAgICB9LFxuXG4gICAgLyoqIFxuICAgICogUmV0dXJucyBzdGF0ZSBtYWNoaW5lIHtAbGluayBDb25maWd1cmF0aW9ufS5cbiAgICAqIEByZXR1cm4ge0NvbmZpZ3VyYXRpb259XG4gICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgICAqL1xuICAgIGdldENvbmZpZ3VyYXRpb24gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpLm1hcChmdW5jdGlvbihzKXtyZXR1cm4gcy5pZDt9KTtcbiAgICB9LFxuXG4gICAgX2dldEZ1bGxDb25maWd1cmF0aW9uIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpLlxuICAgICAgICAgICAgICAgIG1hcChmdW5jdGlvbihzKXsgcmV0dXJuIFtzXS5jb25jYXQocXVlcnkuZ2V0QW5jZXN0b3JzKHMpKTt9LHRoaXMpLlxuICAgICAgICAgICAgICAgIHJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhLmNvbmNhdChiKTt9LFtdKS4gICAgLy9mbGF0dGVuXG4gICAgICAgICAgICAgICAgcmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaW5kZXhPZihiKSA+IC0xID8gYSA6IGEuY29uY2F0KGIpO30sW10pOyAvL3VuaXFcbiAgICB9LFxuXG5cbiAgICAvKiogXG4gICAgKiBAcmV0dXJuIHtGdWxsQ29uZmlndXJhdGlvbn1cbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICovXG4gICAgZ2V0RnVsbENvbmZpZ3VyYXRpb24gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldEZ1bGxDb25maWd1cmF0aW9uKCkubWFwKGZ1bmN0aW9uKHMpe3JldHVybiBzLmlkO30pO1xuICAgIH0sXG5cblxuICAgIC8qKiBcbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZU5hbWVcbiAgICAqL1xuICAgIGlzSW4gOiBmdW5jdGlvbihzdGF0ZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnVsbENvbmZpZ3VyYXRpb24oKS5pbmRleE9mKHN0YXRlTmFtZSkgPiAtMTtcbiAgICB9LFxuXG4gICAgLyoqIFxuICAgICogSXMgdGhlIHN0YXRlIG1hY2hpbmUgaW4gYSBmaW5hbCBzdGF0ZT9cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgICAqL1xuICAgIGlzRmluYWwgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzSW5GaW5hbFN0YXRlO1xuICAgIH0sXG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICBfcGVyZm9ybUJpZ1N0ZXAgOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCBjdXJyZW50RXZlbnQsIGtlZXBHb2luZywgYWxsU3RhdGVzRXhpdGVkLCBhbGxTdGF0ZXNFbnRlcmVkO1xuICAgICAgICBbYWxsU3RhdGVzRXhpdGVkLCBhbGxTdGF0ZXNFbnRlcmVkLCBrZWVwR29pbmcsIGN1cnJlbnRFdmVudF0gPSB0aGlzLl9zdGFydEJpZ1N0ZXAoZSk7XG5cbiAgICAgICAgd2hpbGUgKGtlZXBHb2luZykge1xuICAgICAgICAgIFtjdXJyZW50RXZlbnQsIGtlZXBHb2luZ10gPSB0aGlzLl9zZWxlY3RUcmFuc2l0aW9uc0FuZFBlcmZvcm1TbWFsbFN0ZXAoY3VycmVudEV2ZW50LCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZmluaXNoQmlnU3RlcChjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCk7XG4gICAgfSxcblxuICAgIF9zZWxlY3RUcmFuc2l0aW9uc0FuZFBlcmZvcm1TbWFsbFN0ZXAgOiBmdW5jdGlvbihjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCl7XG4gICAgICAgIC8vZmlyc3Qgc2VsZWN0IHdpdGggbnVsbCBldmVudFxuICAgICAgICB2YXIgc2VsZWN0ZWRUcmFuc2l0aW9ucyAgPSB0aGlzLl9zZWxlY3RUcmFuc2l0aW9ucyhjdXJyZW50RXZlbnQsIHRydWUpO1xuICAgICAgICBpZihzZWxlY3RlZFRyYW5zaXRpb25zLmlzRW1wdHkoKSl7XG4gICAgICAgICAgbGV0IGV2ID0gdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgaWYoZXYpeyBcbiAgICAgICAgICAgIGN1cnJlbnRFdmVudCA9IGV2O1xuICAgICAgICAgICAgc2VsZWN0ZWRUcmFuc2l0aW9ucyA9IHRoaXMuX3NlbGVjdFRyYW5zaXRpb25zKGN1cnJlbnRFdmVudCwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFzZWxlY3RlZFRyYW5zaXRpb25zLmlzRW1wdHkoKSl7XG4gICAgICAgICAgdGhpcy5lbWl0KCdvblNtYWxsU3RlcEJlZ2luJywgY3VycmVudEV2ZW50KTtcbiAgICAgICAgICBsZXQgc3RhdGVzRXhpdGVkLCBzdGF0ZXNFbnRlcmVkO1xuICAgICAgICAgIFtzdGF0ZXNFeGl0ZWQsIHN0YXRlc0VudGVyZWRdID0gdGhpcy5fcGVyZm9ybVNtYWxsU3RlcChjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnMpO1xuICAgICAgICAgIGlmKHN0YXRlc0V4aXRlZCkgc3RhdGVzRXhpdGVkLmZvckVhY2goIHMgPT4gYWxsU3RhdGVzRXhpdGVkLmFkZChzKSApO1xuICAgICAgICAgIGlmKHN0YXRlc0VudGVyZWQpIHN0YXRlc0VudGVyZWQuZm9yRWFjaCggcyA9PiBhbGxTdGF0ZXNFbnRlcmVkLmFkZChzKSApO1xuICAgICAgICAgIHRoaXMuZW1pdCgnb25TbWFsbFN0ZXBFbmQnLCBjdXJyZW50RXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBrZWVwR29pbmcgPSAhc2VsZWN0ZWRUcmFuc2l0aW9ucy5pc0VtcHR5KCkgfHwgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIFtjdXJyZW50RXZlbnQsIGtlZXBHb2luZ107XG4gICAgfSxcblxuICAgIF9zdGFydEJpZ1N0ZXAgOiBmdW5jdGlvbihlKXtcbiAgICAgICAgdGhpcy5lbWl0KCdvbkJpZ1N0ZXBCZWdpbicsIGUpO1xuXG4gICAgICAgIC8vZG8gYXBwbHlGaW5hbGl6ZSBhbmQgYXV0b2ZvcndhcmRcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuZm9yRWFjaChzdGF0ZSA9PiB7XG4gICAgICAgICAgaWYoc3RhdGUuaW52b2tlcykgc3RhdGUuaW52b2tlcy5mb3JFYWNoKCBpbnZva2UgPT4gIHtcbiAgICAgICAgICAgIGlmKGludm9rZS5hdXRvZm9yd2FyZCl7XG4gICAgICAgICAgICAgIC8vYXV0b2ZvcndhcmRcbiAgICAgICAgICAgICAgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5zZW5kKHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGAjXyR7aW52b2tlLmlkfWAsIFxuICAgICAgICAgICAgICAgIG5hbWU6IGUubmFtZSxcbiAgICAgICAgICAgICAgICBkYXRhIDogZS5kYXRhXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoaW52b2tlLmlkID09PSBlLmludm9rZWlkKXtcbiAgICAgICAgICAgICAgLy9hcHBseUZpbmFsaXplXG4gICAgICAgICAgICAgIGlmKGludm9rZS5maW5hbGl6ZSkgaW52b2tlLmZpbmFsaXplLmZvckVhY2goIGFjdGlvbiA9PiAgdGhpcy5fZXZhbHVhdGVBY3Rpb24oZSwgYWN0aW9uKSk7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pOyBcblxuICAgICAgICBpZiAoZSkgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLnB1c2goZSk7XG5cbiAgICAgICAgbGV0IGFsbFN0YXRlc0V4aXRlZCA9IG5ldyBTZXQoKSwgYWxsU3RhdGVzRW50ZXJlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IGtlZXBHb2luZyA9IHRydWU7XG4gICAgICAgIGxldCBjdXJyZW50RXZlbnQgPSBlO1xuICAgICAgICByZXR1cm4gW2FsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCwga2VlcEdvaW5nLCBjdXJyZW50RXZlbnRdO1xuICAgIH0sXG5cbiAgICBfZmluaXNoQmlnU3RlcCA6IGZ1bmN0aW9uKGUsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCwgY2Ipe1xuICAgICAgICBsZXQgc3RhdGVzVG9JbnZva2UgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLmFsbFN0YXRlc0VudGVyZWRdLmZpbHRlcihzID0+IHMuaW52b2tlcyAmJiAhYWxsU3RhdGVzRXhpdGVkLmhhcyhzKSkpKS5zb3J0KHNvcnRJbkVudHJ5T3JkZXIpO1xuXG4gICAgICAgIC8vIEhlcmUgd2UgaW52b2tlIHdoYXRldmVyIG5lZWRzIHRvIGJlIGludm9rZWQuIFRoZSBpbXBsZW1lbnRhdGlvbiBvZiAnaW52b2tlJyBpcyBwbGF0Zm9ybS1zcGVjaWZpY1xuICAgICAgICBzdGF0ZXNUb0ludm9rZS5mb3JFYWNoKCBzID0+IHtcbiAgICAgICAgICAgIHMuaW52b2tlcy5mb3JFYWNoKCBmID0+ICB0aGlzLl9ldmFsdWF0ZUFjdGlvbihlLGYpIClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY2FuY2VsIGludm9rZSBmb3IgYWxsU3RhdGVzRXhpdGVkXG4gICAgICAgIGFsbFN0YXRlc0V4aXRlZC5mb3JFYWNoKCBzID0+IHtcbiAgICAgICAgICBpZihzLmludm9rZXMpIHMuaW52b2tlcy5mb3JFYWNoKCBpbnZva2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5jYW5jZWxJbnZva2UoaW52b2tlLmlkKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUT0RPOiBJbnZva2luZyBtYXkgaGF2ZSByYWlzZWQgaW50ZXJuYWwgZXJyb3IgZXZlbnRzIGFuZCB3ZSBpdGVyYXRlIHRvIGhhbmRsZSB0aGVtICAgICAgICBcbiAgICAgICAgLy9pZiBub3QgaW50ZXJuYWxRdWV1ZS5pc0VtcHR5KCk6XG4gICAgICAgIC8vICAgIGNvbnRpbnVlXG5cbiAgICAgICAgdGhpcy5faXNJbkZpbmFsU3RhdGUgPSB0aGlzLl9jb25maWd1cmF0aW9uLml0ZXIoKS5ldmVyeShmdW5jdGlvbihzKXsgcmV0dXJuIHMudHlwZUVudW0gPT09IEZJTkFMOyB9KTtcbiAgICAgICAgaWYodGhpcy5faXNJbkZpbmFsU3RhdGUpe1xuICAgICAgICAgIHRoaXMuX2V4aXRJbnRlcnByZXRlcihlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoJ29uQmlnU3RlcEVuZCcpO1xuICAgICAgICBpZihjYikgY2IodW5kZWZpbmVkLCB0aGlzLmdldENvbmZpZ3VyYXRpb24oKSk7XG4gICAgfSxcblxuICAgIF9jYW5jZWxBbGxEZWxheWVkU2VuZHMgOiBmdW5jdGlvbigpe1xuICAgICAgZm9yKCBsZXQgdGltZW91dE9wdGlvbnMgb2YgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5fdGltZW91dHMpe1xuICAgICAgICBpZighdGltZW91dE9wdGlvbnMuc2VuZE9wdGlvbnMuZGVsYXkpIGNvbnRpbnVlO1xuICAgICAgICB0aGlzLl9sb2coJ2NhbmNlbGxpbmcgZGVsYXllZCBzZW5kJywgdGltZW91dE9wdGlvbnMpO1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dE9wdGlvbnMudGltZW91dEhhbmRsZSk7XG4gICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuX3RpbWVvdXRzLmRlbGV0ZSh0aW1lb3V0T3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY3JpcHRpbmdDb250ZXh0Ll90aW1lb3V0TWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zY3JpcHRpbmdDb250ZXh0Ll90aW1lb3V0TWFwW2tleV07XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3BlcmZvcm1CaWdTdGVwQXN5bmMgOiBmdW5jdGlvbihlLCBjYikge1xuICAgICAgICBsZXQgY3VycmVudEV2ZW50LCBrZWVwR29pbmcsIGFsbFN0YXRlc0V4aXRlZCwgYWxsU3RhdGVzRW50ZXJlZDtcbiAgICAgICAgW2FsbFN0YXRlc0V4aXRlZCwgYWxsU3RhdGVzRW50ZXJlZCwga2VlcEdvaW5nLCBjdXJyZW50RXZlbnRdID0gdGhpcy5fc3RhcnRCaWdTdGVwKGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIG5leHRTdGVwKGVtaXQpe1xuICAgICAgICAgIHRoaXMuZW1pdChlbWl0KTtcbiAgICAgICAgICBbY3VycmVudEV2ZW50LCBrZWVwR29pbmddID0gdGhpcy5fc2VsZWN0VHJhbnNpdGlvbnNBbmRQZXJmb3JtU21hbGxTdGVwKGN1cnJlbnRFdmVudCwgYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkKTtcblxuICAgICAgICAgIGlmKGtlZXBHb2luZyl7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ29uQmlnU3RlcFN1c3BlbmQnKTtcbiAgICAgICAgICAgIHNldEltbWVkaWF0ZShuZXh0U3RlcC5iaW5kKHRoaXMpLCdvbkJpZ1N0ZXBSZXN1bWUnKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaEJpZ1N0ZXAoY3VycmVudEV2ZW50LCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQsIGNiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmV4dFN0ZXAuY2FsbCh0aGlzLCdvbkJpZ1N0ZXBCZWdpbicpO1xuICAgIH0sXG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICBfcGVyZm9ybVNtYWxsU3RlcCA6IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9ucykge1xuXG4gICAgICAgIHRoaXMuX2xvZyhcInNlbGVjdGluZyB0cmFuc2l0aW9ucyB3aXRoIGN1cnJlbnRFdmVudFwiLCBjdXJyZW50RXZlbnQpO1xuXG4gICAgICAgIHRoaXMuX2xvZyhcInNlbGVjdGVkIHRyYW5zaXRpb25zXCIsIHNlbGVjdGVkVHJhbnNpdGlvbnMpO1xuXG4gICAgICAgIGxldCBzdGF0ZXNFeGl0ZWQsXG4gICAgICAgICAgICBzdGF0ZXNFbnRlcmVkO1xuXG4gICAgICAgIGlmICghc2VsZWN0ZWRUcmFuc2l0aW9ucy5pc0VtcHR5KCkpIHtcblxuICAgICAgICAgICAgLy93ZSBvbmx5IHdhbnQgdG8gZW50ZXIgYW5kIGV4aXQgc3RhdGVzIGZyb20gdHJhbnNpdGlvbnMgd2l0aCB0YXJnZXRzXG4gICAgICAgICAgICAvL2ZpbHRlciBvdXQgdGFyZ2V0bGVzcyB0cmFuc2l0aW9ucyBoZXJlIC0gd2Ugd2lsbCBvbmx5IHVzZSB0aGVzZSB0byBleGVjdXRlIHRyYW5zaXRpb24gYWN0aW9uc1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cyA9IG5ldyB0aGlzLm9wdHMuU2V0KHNlbGVjdGVkVHJhbnNpdGlvbnMuaXRlcigpLmZpbHRlcih0cmFuc2l0aW9uV2l0aFRhcmdldHMpKTtcblxuICAgICAgICAgICAgc3RhdGVzRXhpdGVkID0gdGhpcy5fZXhpdFN0YXRlcyhjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cylcbiAgICAgICAgICAgIHRoaXMuX2V4ZWN1dGVUcmFuc2l0aW9ucyhjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnMpO1xuICAgICAgICAgICAgc3RhdGVzRW50ZXJlZCA9IHRoaXMuX2VudGVyU3RhdGVzKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJuZXcgY29uZmlndXJhdGlvbiBcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW3N0YXRlc0V4aXRlZCwgc3RhdGVzRW50ZXJlZF07XG4gICAgfSxcblxuICAgIF9leGl0U3RhdGVzIDogZnVuY3Rpb24oY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMpe1xuICAgICAgICBsZXQgYmFzaWNTdGF0ZXNFeGl0ZWQsIHN0YXRlc0V4aXRlZDtcbiAgICAgICAgW2Jhc2ljU3RhdGVzRXhpdGVkLCBzdGF0ZXNFeGl0ZWRdID0gdGhpcy5fZ2V0U3RhdGVzRXhpdGVkKHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cyk7IFxuXG4gICAgICAgIHRoaXMuX2xvZygnZXhpdGluZyBzdGF0ZXMnKVxuICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gc3RhdGVzRXhpdGVkLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGVFeGl0ZWQgPSBzdGF0ZXNFeGl0ZWRbal07XG5cbiAgICAgICAgICAgIGlmKHN0YXRlRXhpdGVkLmlzQXRvbWljKSB0aGlzLl9jb25maWd1cmF0aW9uLnJlbW92ZShzdGF0ZUV4aXRlZCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImV4aXRpbmcgXCIsIHN0YXRlRXhpdGVkLmlkKTtcblxuICAgICAgICAgICAgLy9pbnZva2UgbGlzdGVuZXJzXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ29uRXhpdCcsc3RhdGVFeGl0ZWQuaWQpXG5cbiAgICAgICAgICAgIGlmKHN0YXRlRXhpdGVkLm9uRXhpdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZXhpdElkeCA9IDAsIGV4aXRMZW4gPSBzdGF0ZUV4aXRlZC5vbkV4aXQubGVuZ3RoOyBleGl0SWR4IDwgZXhpdExlbjsgZXhpdElkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHN0YXRlRXhpdGVkLm9uRXhpdFtleGl0SWR4XTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYmxvY2tJZHggPSAwLCBibG9ja0xlbiA9IGJsb2NrLmxlbmd0aDsgYmxvY2tJZHggPCBibG9ja0xlbjsgYmxvY2tJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGlvblJlZiA9IGJsb2NrW2Jsb2NrSWR4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmO1xuICAgICAgICAgICAgaWYgKHN0YXRlRXhpdGVkLmhpc3RvcnlSZWYpIHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGhpc3RvcnlSZWYgb2Ygc3RhdGVFeGl0ZWQuaGlzdG9yeVJlZil7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoaXN0b3J5UmVmLmlzRGVlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKHMwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMwLnR5cGVFbnVtID09PSBCQVNJQyAmJiBzdGF0ZUV4aXRlZC5kZXNjZW5kYW50cy5pbmRleE9mKHMwKSA+IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmdW5jdGlvbihzMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzMC5wYXJlbnQgPT09IHN0YXRlRXhpdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZSBoaXN0b3J5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnlWYWx1ZVtoaXN0b3J5UmVmLmlkXSA9IHN0YXRlc0V4aXRlZC5maWx0ZXIoZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlc0V4aXRlZDtcbiAgICB9LFxuXG4gICAgX2V4ZWN1dGVUcmFuc2l0aW9ucyA6IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9ucyl7XG4gICAgICAgIHZhciBzb3J0ZWRUcmFuc2l0aW9ucyA9IHNlbGVjdGVkVHJhbnNpdGlvbnMuaXRlcigpLnNvcnQodHJhbnNpdGlvbkNvbXBhcmF0b3IpO1xuXG4gICAgICAgIHRoaXMuX2xvZyhcImV4ZWN1dGluZyB0cmFuc2l0aXRpb24gYWN0aW9uc1wiKTtcbiAgICAgICAgZm9yICh2YXIgc3R4SWR4ID0gMCwgbGVuID0gc29ydGVkVHJhbnNpdGlvbnMubGVuZ3RoOyBzdHhJZHggPCBsZW47IHN0eElkeCsrKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHNvcnRlZFRyYW5zaXRpb25zW3N0eElkeF07XG5cbiAgICAgICAgICAgIHZhciB0YXJnZXRJZHMgPSB0cmFuc2l0aW9uLnRhcmdldHMgJiYgdHJhbnNpdGlvbi50YXJnZXRzLm1hcChmdW5jdGlvbih0YXJnZXQpe3JldHVybiB0YXJnZXQuaWQ7fSk7XG5cbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25UcmFuc2l0aW9uJyx0cmFuc2l0aW9uLnNvdXJjZS5pZCx0YXJnZXRJZHMsIHRyYW5zaXRpb24uc291cmNlLnRyYW5zaXRpb25zLmluZGV4T2YodHJhbnNpdGlvbikpO1xuXG4gICAgICAgICAgICBpZih0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCB0eExlbiA9IHRyYW5zaXRpb24ub25UcmFuc2l0aW9uLmxlbmd0aDsgdHhJZHggPCB0eExlbjsgdHhJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uUmVmID0gdHJhbnNpdGlvbi5vblRyYW5zaXRpb25bdHhJZHhdO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgfSxcblxuICAgIF9lbnRlclN0YXRlcyA6IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKXtcbiAgICAgICAgdGhpcy5fbG9nKFwiZW50ZXJpbmcgc3RhdGVzXCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZXNFbnRlcmVkID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgc3RhdGVzRm9yRGVmYXVsdEVudHJ5ID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSB0ZW1wb3JhcnkgdGFibGUgZm9yIGRlZmF1bHQgY29udGVudCBpbiBoaXN0b3J5IHN0YXRlc1xuICAgICAgICBsZXQgZGVmYXVsdEhpc3RvcnlDb250ZW50ID0ge307XG4gICAgICAgIHRoaXMuX2NvbXB1dGVFbnRyeVNldChzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMsIHN0YXRlc0VudGVyZWQsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KTsgXG4gICAgICAgIHN0YXRlc0VudGVyZWQgPSBbLi4uc3RhdGVzRW50ZXJlZF0uc29ydChzb3J0SW5FbnRyeU9yZGVyKTsgXG5cbiAgICAgICAgdGhpcy5fbG9nKFwic3RhdGVzRW50ZXJlZCBcIiwgc3RhdGVzRW50ZXJlZCk7XG5cbiAgICAgICAgZm9yICh2YXIgZW50ZXJJZHggPSAwLCBlbnRlckxlbiA9IHN0YXRlc0VudGVyZWQubGVuZ3RoOyBlbnRlcklkeCA8IGVudGVyTGVuOyBlbnRlcklkeCsrKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGVFbnRlcmVkID0gc3RhdGVzRW50ZXJlZFtlbnRlcklkeF07XG5cbiAgICAgICAgICAgIGlmKHN0YXRlRW50ZXJlZC5pc0F0b21pYykgdGhpcy5fY29uZmlndXJhdGlvbi5hZGQoc3RhdGVFbnRlcmVkKTtcblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiZW50ZXJpbmdcIiwgc3RhdGVFbnRlcmVkLmlkKTtcblxuICAgICAgICAgICAgdGhpcy5lbWl0KCdvbkVudHJ5JyxzdGF0ZUVudGVyZWQuaWQpO1xuXG4gICAgICAgICAgICBpZihzdGF0ZUVudGVyZWQub25FbnRyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZW50cnlJZHggPSAwLCBlbnRyeUxlbiA9IHN0YXRlRW50ZXJlZC5vbkVudHJ5Lmxlbmd0aDsgZW50cnlJZHggPCBlbnRyeUxlbjsgZW50cnlJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBzdGF0ZUVudGVyZWQub25FbnRyeVtlbnRyeUlkeF07XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGJsb2NrSWR4ID0gMCwgYmxvY2tMZW4gPSBibG9jay5sZW5ndGg7IGJsb2NrSWR4IDwgYmxvY2tMZW47IGJsb2NrSWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSBibG9ja1tibG9ja0lkeF07XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihzdGF0ZXNGb3JEZWZhdWx0RW50cnkuaGFzKHN0YXRlRW50ZXJlZCkpe1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaW5pdGlhbFN0YXRlIG9mIHN0YXRlRW50ZXJlZC5pbml0aWFsUmVmKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdvbkRlZmF1bHRFbnRyeScsIGluaXRpYWxTdGF0ZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGluaXRpYWxTdGF0ZS50eXBlRW51bSA9PT0gSU5JVElBTCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNpdGlvbiA9IGluaXRpYWxTdGF0ZS50cmFuc2l0aW9uc1swXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHJhbnNpdGlvbi5vblRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZygnZXhlY3V0aW5nIGluaXRpYWwgdHJhbnNpdGlvbiBjb250ZW50IGZvciBpbml0aWFsIHN0YXRlIG9mIHBhcmVudCBzdGF0ZScsc3RhdGVFbnRlcmVkLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB0eElkeCA9IDAsIHR4TGVuID0gdHJhbnNpdGlvbi5vblRyYW5zaXRpb24ubGVuZ3RoOyB0eElkeCA8IHR4TGVuOyB0eElkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvblt0eElkeF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgY3VycmVudEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZihkZWZhdWx0SGlzdG9yeUNvbnRlbnRbc3RhdGVFbnRlcmVkLmlkXSl7XG4gICAgICAgICAgICAgICAgbGV0IHRyYW5zaXRpb24gPSBkZWZhdWx0SGlzdG9yeUNvbnRlbnRbc3RhdGVFbnRlcmVkLmlkXVxuICAgICAgICAgICAgICAgIGlmKHRyYW5zaXRpb24ub25UcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nKCdleGVjdXRpbmcgaGlzdG9yeSB0cmFuc2l0aW9uIGNvbnRlbnQgZm9yIGhpc3Rvcnkgc3RhdGUgb2YgcGFyZW50IHN0YXRlJyxzdGF0ZUVudGVyZWQuaWQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB0eElkeCA9IDAsIHR4TGVuID0gdHJhbnNpdGlvbi5vblRyYW5zaXRpb24ubGVuZ3RoOyB0eElkeCA8IHR4TGVuOyB0eElkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uUmVmID0gdHJhbnNpdGlvbi5vblRyYW5zaXRpb25bdHhJZHhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgY3VycmVudEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGVudGVySWR4ID0gMCwgZW50ZXJMZW4gPSBzdGF0ZXNFbnRlcmVkLmxlbmd0aDsgZW50ZXJJZHggPCBlbnRlckxlbjsgZW50ZXJJZHgrKykge1xuICAgICAgICAgICAgdmFyIHN0YXRlRW50ZXJlZCA9IHN0YXRlc0VudGVyZWRbZW50ZXJJZHhdO1xuICAgICAgICAgICAgaWYoc3RhdGVFbnRlcmVkLnR5cGVFbnVtID09PSBGSU5BTCl7XG4gICAgICAgICAgICAgIGxldCBwYXJlbnQgPSBzdGF0ZUVudGVyZWQucGFyZW50O1xuICAgICAgICAgICAgICBsZXQgZ3JhbmRwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICAgICAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUucHVzaCh7bmFtZSA6IFwiZG9uZS5zdGF0ZS5cIiArIHBhcmVudC5pZCwgZGF0YSA6IHN0YXRlRW50ZXJlZC5kb25lZGF0YSAmJiBzdGF0ZUVudGVyZWQuZG9uZWRhdGEuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpfSk7XG4gICAgICAgICAgICAgIGlmKGdyYW5kcGFyZW50ICYmIGdyYW5kcGFyZW50LnR5cGVFbnVtID09PSBQQVJBTExFTCl7XG4gICAgICAgICAgICAgICAgICBpZihncmFuZHBhcmVudC5zdGF0ZXMuZXZlcnkocyA9PiB0aGlzLmlzSW5GaW5hbFN0YXRlKHMpICkpe1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKHtuYW1lIDogXCJkb25lLnN0YXRlLlwiICsgZ3JhbmRwYXJlbnQuaWR9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlc0VudGVyZWQ7XG4gICAgfSxcblxuICAgIGlzSW5GaW5hbFN0YXRlIDogZnVuY3Rpb24ocyl7XG4gICAgICAgIGlmKHMudHlwZUVudW0gPT09IENPTVBPU0lURSl7XG4gICAgICAgICAgICByZXR1cm4gcy5zdGF0ZXMuc29tZShzID0+IHMudHlwZUVudW0gPT09IEZJTkFMICYmIHRoaXMuX2NvbmZpZ3VyYXRpb24uY29udGFpbnMocykpO1xuICAgICAgICB9ZWxzZSBpZihzLnR5cGVFbnVtID09PSBQQVJBTExFTCl7XG4gICAgICAgICAgICByZXR1cm4gcy5zdGF0ZXMuZXZlcnkodGhpcy5pc0luRmluYWxTdGF0ZS5iaW5kKHRoaXMpKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIF9ldmFsdWF0ZUFjdGlvbiA6IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgYWN0aW9uUmVmKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7ICAgICAvL1NDWE1MIHN5c3RlbSB2YXJpYWJsZXNcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRXJyb3IgOiBmdW5jdGlvbihlLCBhY3Rpb25SZWYpe1xuICAgICAgbGV0IGV2ZW50ID0gXG4gICAgICAgIGUgaW5zdGFuY2VvZiBFcnJvciB8fCAodHlwZW9mIGUuX19wcm90b19fLm5hbWUgPT09ICdzdHJpbmcnICYmIGUuX19wcm90b19fLm5hbWUubWF0Y2goL14uKkVycm9yJC8pKSA/ICAvL3dlIGNhbid0IGp1c3QgZG8gJ2UgaW5zdGFuY2VvZiBFcnJvcicsIGJlY2F1c2UgdGhlIEVycm9yIG9iamVjdCBpbiB0aGUgc2FuZGJveCBpcyBmcm9tIGEgZGlmZmVyZW50IGNvbnRleHQsIGFuZCBpbnN0YW5jZW9mIHdpbGwgcmV0dXJuIGZhbHNlXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTonZXJyb3IuZXhlY3V0aW9uJyxcbiAgICAgICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICAgIHRhZ25hbWU6IGFjdGlvblJlZi50YWduYW1lLCBcbiAgICAgICAgICAgICAgbGluZTogYWN0aW9uUmVmLmxpbmUsIFxuICAgICAgICAgICAgICBjb2x1bW46IGFjdGlvblJlZi5jb2x1bW4sXG4gICAgICAgICAgICAgIHJlYXNvbjogZS5tZXNzYWdlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZSA6ICdwbGF0Zm9ybSdcbiAgICAgICAgICB9IDogXG4gICAgICAgICAgKGUubmFtZSA/IFxuICAgICAgICAgICAgZSA6IFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOidlcnJvci5leGVjdXRpb24nLFxuICAgICAgICAgICAgICBkYXRhOmUsXG4gICAgICAgICAgICAgIHR5cGUgOiAncGxhdGZvcm0nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKGV2ZW50KTtcbiAgICAgIHRoaXMuZW1pdCgnb25FcnJvcicsIGV2ZW50KTtcbiAgICB9LFxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgX2dldFN0YXRlc0V4aXRlZCA6IGZ1bmN0aW9uKHRyYW5zaXRpb25zKSB7XG4gICAgICAgIHZhciBzdGF0ZXNFeGl0ZWQgPSBuZXcgdGhpcy5vcHRzLlNldCgpO1xuICAgICAgICB2YXIgYmFzaWNTdGF0ZXNFeGl0ZWQgPSBuZXcgdGhpcy5vcHRzLlNldCgpO1xuXG4gICAgICAgIC8vU3RhdGVzIGV4aXRlZCBhcmUgZGVmaW5lZCB0byBiZSBhY3RpdmUgc3RhdGVzIHRoYXQgYXJlXG4gICAgICAgIC8vZGVzY2VuZGFudHMgb2YgdGhlIHNjb3BlIG9mIGVhY2ggcHJpb3JpdHktZW5hYmxlZCB0cmFuc2l0aW9uLlxuICAgICAgICAvL0hlcmUsIHdlIGl0ZXJhdGUgdGhyb3VnaCB0aGUgdHJhbnNpdGlvbnMsIGFuZCBjb2xsZWN0IHN0YXRlc1xuICAgICAgICAvL3RoYXQgbWF0Y2ggdGhpcyBjb25kaXRpb24uIFxuICAgICAgICB2YXIgdHJhbnNpdGlvbkxpc3QgPSB0cmFuc2l0aW9ucy5pdGVyKCk7XG4gICAgICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSB0cmFuc2l0aW9uTGlzdC5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbkxpc3RbdHhJZHhdO1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdHJhbnNpdGlvbi5zY29wZSxcbiAgICAgICAgICAgICAgICBkZXNjID0gc2NvcGUuZGVzY2VuZGFudHM7XG5cbiAgICAgICAgICAgIC8vRm9yIGVhY2ggc3RhdGUgaW4gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgIC8vaXMgdGhhdCBzdGF0ZSBhIGRlc2NlbmRhbnQgb2YgdGhlIHRyYW5zaXRpb24gc2NvcGU/XG4gICAgICAgICAgICAvL1N0b3JlIGFuY2VzdG9ycyBvZiB0aGF0IHN0YXRlIHVwIHRvIGJ1dCBub3QgaW5jbHVkaW5nIHRoZSBzY29wZS5cbiAgICAgICAgICAgIHZhciBjb25maWdMaXN0ID0gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBjZmdJZHggPSAwLCBjZmdMZW4gPSBjb25maWdMaXN0Lmxlbmd0aDsgY2ZnSWR4IDwgY2ZnTGVuOyBjZmdJZHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGNvbmZpZ0xpc3RbY2ZnSWR4XTtcbiAgICAgICAgICAgICAgICBpZihkZXNjLmluZGV4T2Yoc3RhdGUpID4gLTEpe1xuICAgICAgICAgICAgICAgICAgICBiYXNpY1N0YXRlc0V4aXRlZC5hZGQoc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZXNFeGl0ZWQuYWRkKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuY2VzdG9ycyA9IHF1ZXJ5LmdldEFuY2VzdG9ycyhzdGF0ZSxzY29wZSk7IFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBhbmNJZHggPSAwLCBhbmNMZW4gPSBhbmNlc3RvcnMubGVuZ3RoOyBhbmNJZHggPCBhbmNMZW47IGFuY0lkeCsrKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVzRXhpdGVkLmFkZChhbmNlc3RvcnNbYW5jSWR4XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc29ydGVkU3RhdGVzRXhpdGVkID0gc3RhdGVzRXhpdGVkLml0ZXIoKS5zb3J0KGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkpO1xuICAgICAgICByZXR1cm4gW2Jhc2ljU3RhdGVzRXhpdGVkLCBzb3J0ZWRTdGF0ZXNFeGl0ZWRdO1xuICAgIH0sXG5cbiAgICBfY29tcHV0ZUVudHJ5U2V0IDogZnVuY3Rpb24odHJhbnNpdGlvbnMsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KXtcbiAgICAgIGZvcihsZXQgdCBvZiB0cmFuc2l0aW9ucy5pdGVyKCkpe1xuICAgICAgICAgIGZvcihsZXQgcyBvZiB0LnRhcmdldHMpe1xuICAgICAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcihzLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KSBcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGFuY2VzdG9yID0gdC5zY29wZTtcbiAgICAgICAgICBmb3IobGV0IHMgb2YgdGhpcy5fZ2V0RWZmZWN0aXZlVGFyZ2V0U3RhdGVzKHQpKXtcbiAgICAgICAgICAgICAgdGhpcy5fYWRkQW5jZXN0b3JTdGF0ZXNUb0VudGVyKHMsIGFuY2VzdG9yLCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRFZmZlY3RpdmVUYXJnZXRTdGF0ZXMgOiBmdW5jdGlvbih0cmFuc2l0aW9uKXtcbiAgICAgIGxldCB0YXJnZXRzID0gbmV3IFNldCgpO1xuICAgICAgZm9yKGxldCBzIG9mIHRyYW5zaXRpb24udGFyZ2V0cyl7XG4gICAgICAgICAgaWYocy50eXBlRW51bSA9PT0gSElTVE9SWSl7XG4gICAgICAgICAgICAgIGlmKHMuaWQgaW4gdGhpcy5faGlzdG9yeVZhbHVlKVxuICAgICAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeVZhbHVlW3MuaWRdLmZvckVhY2goIHN0YXRlID0+IHRhcmdldHMuYWRkKHN0YXRlKSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgWy4uLnRoaXMuX2dldEVmZmVjdGl2ZVRhcmdldFN0YXRlcyhzLnRyYW5zaXRpb25zWzBdKV0uZm9yRWFjaCggc3RhdGUgPT4gdGFyZ2V0cy5hZGQoc3RhdGUpKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldHMuYWRkKHMpXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldHNcbiAgICB9LFxuXG4gICAgX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyIDogZnVuY3Rpb24oc3RhdGUsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpe1xuICAgICAgaWYoc3RhdGUudHlwZUVudW0gPT09IEhJU1RPUlkpe1xuICAgICAgICAgIGlmKHRoaXMuX2hpc3RvcnlWYWx1ZVtzdGF0ZS5pZF0pe1xuICAgICAgICAgICAgICBmb3IobGV0IHMgb2YgdGhpcy5faGlzdG9yeVZhbHVlW3N0YXRlLmlkXSlcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyKHMsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBmb3IobGV0IHMgb2YgdGhpcy5faGlzdG9yeVZhbHVlW3N0YXRlLmlkXSlcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlcihzLCBzdGF0ZS5wYXJlbnQsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZhdWx0SGlzdG9yeUNvbnRlbnRbc3RhdGUucGFyZW50LmlkXSA9IHN0YXRlLnRyYW5zaXRpb25zWzBdXG4gICAgICAgICAgICBmb3IobGV0IHMgb2Ygc3RhdGUudHJhbnNpdGlvbnNbMF0udGFyZ2V0cylcbiAgICAgICAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcihzLHN0YXRlc1RvRW50ZXIsc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvcihsZXQgcyBvZiBzdGF0ZS50cmFuc2l0aW9uc1swXS50YXJnZXRzKVxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlcihzLCBzdGF0ZS5wYXJlbnQsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0ZXNUb0VudGVyLmFkZChzdGF0ZSlcbiAgICAgICAgICBpZihzdGF0ZS50eXBlRW51bSA9PT0gQ09NUE9TSVRFKXtcbiAgICAgICAgICAgICAgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LmFkZChzdGF0ZSlcbiAgICAgICAgICAgICAgLy9mb3IgZWFjaCBzdGF0ZSBpbiBpbml0aWFsUmVmLCBpZiBpdCBpcyBhbiBpbml0aWFsIHN0YXRlLCB0aGVuIGFkZCBhbmNlc3RvcnMgYW5kIGRlc2NlbmRhbnRzLlxuICAgICAgICAgICAgICBmb3IobGV0IHMgb2Ygc3RhdGUuaW5pdGlhbFJlZil7XG4gICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0cyA9IHMudHlwZUVudW0gPT09IElOSVRJQUwgPyBzLnRyYW5zaXRpb25zWzBdLnRhcmdldHMgOiBbc107IFxuICAgICAgICAgICAgICAgICAgZm9yKGxldCB0YXJnZXRTdGF0ZSBvZiB0YXJnZXRzKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIodGFyZ2V0U3RhdGUsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9yKGxldCBzIG9mIHN0YXRlLmluaXRpYWxSZWYpe1xuICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldHMgPSBzLnR5cGVFbnVtID09PSBJTklUSUFMID8gcy50cmFuc2l0aW9uc1swXS50YXJnZXRzIDogW3NdOyBcbiAgICAgICAgICAgICAgICAgIGZvcihsZXQgdGFyZ2V0U3RhdGUgb2YgdGFyZ2V0cyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlcih0YXJnZXRTdGF0ZSwgc3RhdGUsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBQQVJBTExFTCl7XG4gICAgICAgICAgICAgICAgICBmb3IobGV0IGNoaWxkIG9mIHN0YXRlLnN0YXRlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgaWYoIVsuLi5zdGF0ZXNUb0VudGVyXS5zb21lKHMgPT4gcXVlcnkuaXNEZXNjZW5kYW50KHMsIGNoaWxkKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcihjaGlsZCxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCkgXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfYWRkQW5jZXN0b3JTdGF0ZXNUb0VudGVyIDogZnVuY3Rpb24oc3RhdGUsIGFuY2VzdG9yLCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCl7XG4gICAgICBsZXQgdHJhdmVyc2UgPSAoYW5jKSA9PiB7XG4gICAgICAgICAgaWYoYW5jLnR5cGVFbnVtID09PSBQQVJBTExFTCl7XG4gICAgICAgICAgICAgIGZvcihsZXQgY2hpbGQgb2YgYW5jLnN0YXRlcyl7XG4gICAgICAgICAgICAgICAgICBpZihjaGlsZC50eXBlRW51bSAhPT0gSElTVE9SWSAmJiAhWy4uLnN0YXRlc1RvRW50ZXJdLnNvbWUocyA9PiBxdWVyeS5pc0Rlc2NlbmRhbnQocywgY2hpbGQpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIoY2hpbGQsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpIFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGZvcihsZXQgYW5jIG9mIHF1ZXJ5LmdldEFuY2VzdG9ycyhzdGF0ZSxhbmNlc3Rvcikpe1xuICAgICAgICAgIHN0YXRlc1RvRW50ZXIuYWRkKGFuYylcbiAgICAgICAgICB0cmF2ZXJzZShhbmMpXG4gICAgICB9XG4gICAgICB0cmF2ZXJzZShhbmNlc3RvcilcbiAgICB9LFxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgX3NlbGVjdFRyYW5zaXRpb25zIDogZnVuY3Rpb24oY3VycmVudEV2ZW50LCBzZWxlY3RFdmVudGxlc3NUcmFuc2l0aW9ucykge1xuICAgICAgICB2YXIgdHJhbnNpdGlvblNlbGVjdG9yID0gdGhpcy5vcHRzLnRyYW5zaXRpb25TZWxlY3RvcjtcbiAgICAgICAgdmFyIGVuYWJsZWRUcmFuc2l0aW9ucyA9IG5ldyB0aGlzLm9wdHMuU2V0KCk7XG5cbiAgICAgICAgdmFyIGUgPSB0aGlzLl9ldmFsdWF0ZUFjdGlvbi5iaW5kKHRoaXMsY3VycmVudEV2ZW50KTtcblxuICAgICAgICBsZXQgYXRvbWljU3RhdGVzID0gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuc29ydCh0cmFuc2l0aW9uQ29tcGFyYXRvcik7XG4gICAgICAgIGZvcihsZXQgc3RhdGUgb2YgYXRvbWljU3RhdGVzKXtcbiAgICAgICAgICAgIGxvb3A6IGZvcihsZXQgcyBvZiBbc3RhdGVdLmNvbmNhdChxdWVyeS5nZXRBbmNlc3RvcnMoc3RhdGUpKSl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCB0IG9mIHMudHJhbnNpdGlvbnMpe1xuICAgICAgICAgICAgICAgICAgICBpZih0cmFuc2l0aW9uU2VsZWN0b3IodCwgY3VycmVudEV2ZW50LCBlLCBzZWxlY3RFdmVudGxlc3NUcmFuc2l0aW9ucykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZFRyYW5zaXRpb25zLmFkZCh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHJpb3JpdHlFbmFibGVkVHJhbnNpdGlvbnMgPSB0aGlzLl9yZW1vdmVDb25mbGljdGluZ1RyYW5zaXRpb24oZW5hYmxlZFRyYW5zaXRpb25zKTtcblxuICAgICAgICB0aGlzLl9sb2coXCJwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9uc1wiLCBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcHJpb3JpdHlFbmFibGVkVHJhbnNpdGlvbnM7XG4gICAgfSxcblxuICAgIFxuICAgIF9jb21wdXRlRXhpdFNldCA6IGZ1bmN0aW9uKHRyYW5zaXRpb25zKSB7XG4gICAgICBsZXQgc3RhdGVzVG9FeGl0ID0gbmV3IFNldCgpO1xuICAgICAgZm9yKGxldCB0IG9mIHRyYW5zaXRpb25zKXtcbiAgICAgICAgICBpZih0LnRhcmdldHMpe1xuICAgICAgICAgICAgICBsZXQgc2NvcGUgPSB0LnNjb3BlO1xuICAgICAgICAgICAgICBmb3IobGV0IHMgb2YgdGhpcy5fZ2V0RnVsbENvbmZpZ3VyYXRpb24oKSl7XG4gICAgICAgICAgICAgICAgICBpZihxdWVyeS5pc0Rlc2NlbmRhbnQocyxzY29wZSkpIHN0YXRlc1RvRXhpdC5hZGQocyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdGVzVG9FeGl0OyBcbiAgICB9LFxuICAgXG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICBfcmVtb3ZlQ29uZmxpY3RpbmdUcmFuc2l0aW9uIDogZnVuY3Rpb24oZW5hYmxlZFRyYW5zaXRpb25zKSB7XG4gICAgICBsZXQgZmlsdGVyZWRUcmFuc2l0aW9ucyA9IG5ldyB0aGlzLm9wdHMuU2V0KClcbiAgICAgIC8vdG9MaXN0IHNvcnRzIHRoZSB0cmFuc2l0aW9ucyBpbiB0aGUgb3JkZXIgb2YgdGhlIHN0YXRlcyB0aGF0IHNlbGVjdGVkIHRoZW1cbiAgICAgIGZvciggbGV0IHQxIG9mIGVuYWJsZWRUcmFuc2l0aW9ucy5pdGVyKCkpe1xuICAgICAgICAgIGxldCB0MVByZWVtcHRlZCA9IGZhbHNlO1xuICAgICAgICAgIGxldCB0cmFuc2l0aW9uc1RvUmVtb3ZlID0gbmV3IFNldCgpXG4gICAgICAgICAgZm9yIChsZXQgdDIgb2YgZmlsdGVyZWRUcmFuc2l0aW9ucy5pdGVyKCkpe1xuICAgICAgICAgICAgICAvL1RPRE86IGNhbiB3ZSBjb21wdXRlIHRoaXMgc3RhdGljYWxseT8gZm9yIGV4YW1wbGUsIGJ5IGNoZWNraW5nIGlmIHRoZSB0cmFuc2l0aW9uIHNjb3BlcyBhcmUgYXJlbmEgb3J0aG9nb25hbD9cbiAgICAgICAgICAgICAgbGV0IHQxRXhpdFNldCA9IHRoaXMuX2NvbXB1dGVFeGl0U2V0KFt0MV0pO1xuICAgICAgICAgICAgICBsZXQgdDJFeGl0U2V0ID0gdGhpcy5fY29tcHV0ZUV4aXRTZXQoW3QyXSk7XG4gICAgICAgICAgICAgIGxldCBoYXNJbnRlcnNlY3Rpb24gPSBbLi4udDFFeGl0U2V0XS5zb21lKCBzID0+IHQyRXhpdFNldC5oYXMocykgKSAgfHwgWy4uLnQyRXhpdFNldF0uc29tZSggcyA9PiB0MUV4aXRTZXQuaGFzKHMpKTtcbiAgICAgICAgICAgICAgdGhpcy5fbG9nKCd0MUV4aXRTZXQnLHQxLnNvdXJjZS5pZCxbLi4udDFFeGl0U2V0XS5tYXAoIHMgPT4gcy5pZCApKVxuICAgICAgICAgICAgICB0aGlzLl9sb2coJ3QyRXhpdFNldCcsdDIuc291cmNlLmlkLFsuLi50MkV4aXRTZXRdLm1hcCggcyA9PiBzLmlkICkpXG4gICAgICAgICAgICAgIHRoaXMuX2xvZygnaGFzSW50ZXJzZWN0aW9uJyxoYXNJbnRlcnNlY3Rpb24pXG4gICAgICAgICAgICAgIGlmKGhhc0ludGVyc2VjdGlvbil7XG4gICAgICAgICAgICAgICAgICBpZih0Mi5zb3VyY2UuZGVzY2VuZGFudHMuaW5kZXhPZih0MS5zb3VyY2UpID4gLTEpeyAgICAvL2lzIHRoaXMgdGhlIHNhbWUgYXMgYmVpbmcgYW5jZXN0cmFsbHkgcmVsYXRlZD9cbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uc1RvUmVtb3ZlLmFkZCh0MilcbiAgICAgICAgICAgICAgICAgIH1lbHNleyBcbiAgICAgICAgICAgICAgICAgICAgICB0MVByZWVtcHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZighdDFQcmVlbXB0ZWQpe1xuICAgICAgICAgICAgICBmb3IobGV0IHQzIG9mIHRyYW5zaXRpb25zVG9SZW1vdmUpe1xuICAgICAgICAgICAgICAgICAgZmlsdGVyZWRUcmFuc2l0aW9ucy5yZW1vdmUodDMpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZmlsdGVyZWRUcmFuc2l0aW9ucy5hZGQodDEpXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgICAgICAgIFxuICAgICAgcmV0dXJuIGZpbHRlcmVkVHJhbnNpdGlvbnM7XG4gICAgfSxcblxuICAgIF9sb2cgOiBmdW5jdGlvbigpe1xuICAgICAgaWYocHJpbnRUcmFjZSl7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLm9wdHMuY29uc29sZS5sb2coIFxuICAgICAgICAgIGAke2FyZ3NbMF19OiAke1xuICAgICAgICAgICAgYXJncy5zbGljZSgxKS5tYXAoZnVuY3Rpb24oYXJnKXtcbiAgICAgICAgICAgICAgcmV0dXJuIGFyZyA9PT0gbnVsbCA/ICdudWxsJyA6IFxuICAgICAgICAgICAgICAgICggYXJnID09PSB1bmRlZmluZWQgPyAndW5kZWZpbmVkJyA6IFxuICAgICAgICAgICAgICAgICAgKCB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyA/IGFyZyA6IFxuICAgICAgICAgICAgICAgICAgICAoIGFyZy50b1N0cmluZygpID09PSAnW29iamVjdCBPYmplY3RdJyA/IHV0aWwuaW5zcGVjdChhcmcpIDogYXJnLnRvU3RyaW5nKCkpKSk7XG5cbiAgICAgICAgICAgIH0pLmpvaW4oJywgJylcbiAgICAgICAgICB9XFxuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAqIEBpbnRlcmZhY2UgTGlzdGVuZXJcbiAgICAqL1xuXG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb25cbiAgICAqIEBuYW1lIExpc3RlbmVyI29uRW50cnkgXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVJZFxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25FeGl0IFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlSWRcbiAgICAqL1xuXG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb25cbiAgICAqIEBuYW1lIExpc3RlbmVyI29uVHJhbnNpdGlvbiBcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VTdGF0ZUlkIElkIG9mIHRoZSBzb3VyY2Ugc3RhdGVcbiAgICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gdGFyZ2V0U3RhdGVzSWRzIElkcyBvZiB0aGUgdGFyZ2V0IHN0YXRlc1xuICAgICogQHBhcmFtIHtudW1iZXJ9IHRyYW5zaXRpb25JbmRleCBJbmRleCBvZiB0aGUgdHJhbnNpdGlvbiByZWxhdGl2ZSB0byBvdGhlciB0cmFuc2l0aW9ucyBvcmlnaW5hdGluZyBmcm9tIHNvdXJjZSBzdGF0ZS5cbiAgICAqL1xuXG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb25cbiAgICAqIEBuYW1lIExpc3RlbmVyI29uRXJyb3JcbiAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9ySW5mb1xuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25CaWdTdGVwQmVnaW5cbiAgICAqL1xuXG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb25cbiAgICAqIEBuYW1lIExpc3RlbmVyI29uQmlnU3RlcFJlc3VtZVxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25CaWdTdGVwU3VzcGVuZFxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25CaWdTdGVwRW5kXG4gICAgKi9cblxuICAgIC8qKlxuICAgICogQGZ1bmN0aW9uXG4gICAgKiBAbmFtZSBMaXN0ZW5lciNvblNtYWxsU3RlcEJlZ2luXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICAqL1xuXG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb25cbiAgICAqIEBuYW1lIExpc3RlbmVyI29uU21hbGxTdGVwRW5kXG4gICAgKi9cblxuXG4gICAgLyoqIFxuICAgICogUHJvdmlkZXMgYSBnZW5lcmljIG1lY2hhbmlzbSB0byBzdWJzY3JpYmUgdG8gc3RhdGUgY2hhbmdlIGFuZCBydW50aW1lXG4gICAgKiBlcnJvciBub3RpZmljYXRpb25zLiAgQ2FuIGJlIHVzZWQgZm9yIGxvZ2dpbmcgYW5kIGRlYnVnZ2luZy4gRm9yIGV4YW1wbGUsXG4gICAgKiBjYW4gYXR0YWNoIGEgbG9nZ2VyIHRoYXQgc2ltcGx5IGxvZ3MgdGhlIHN0YXRlIGNoYW5nZXMuICBPciBjYW4gYXR0YWNoIGFcbiAgICAqIG5ldHdvcmsgZGVidWdnaW5nIGNsaWVudCB0aGF0IHNlbmRzIHN0YXRlIGNoYW5nZSBub3RpZmljYXRpb25zIHRvIGFcbiAgICAqIGRlYnVnZ2luZyBzZXJ2ZXIuXG4gICAgKiBUaGlzIGlzIGFuIGFsdGVybmF0aXZlIGludGVyZmFjZSB0byB7QGxpbmsgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSNvbn0uXG4gICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyXG4gICAgKi9cbiAgICByZWdpc3Rlckxpc3RlbmVyIDogZnVuY3Rpb24obGlzdGVuZXIpe1xuICAgICAgICBCYXNlSW50ZXJwcmV0ZXIuRVZFTlRTLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgIGlmKGxpc3RlbmVyW2V2ZW50XSkgdGhpcy5vbihldmVudCxsaXN0ZW5lcltldmVudF0pO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqIFxuICAgICogVW5yZWdpc3RlciBhIExpc3RlbmVyXG4gICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyXG4gICAgKi9cbiAgICB1bnJlZ2lzdGVyTGlzdGVuZXIgOiBmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgICAgIEJhc2VJbnRlcnByZXRlci5FVkVOVFMuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgaWYobGlzdGVuZXJbZXZlbnRdKSB0aGlzLm9mZihldmVudCxsaXN0ZW5lcltldmVudF0pO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqIFxuICAgICogUXVlcnkgdGhlIG1vZGVsIHRvIGdldCBhbGwgdHJhbnNpdGlvbiBldmVudHMuXG4gICAgKiBAcmV0dXJuIHtBcnJheTxzdHJpbmc+fSBUcmFuc2l0aW9uIGV2ZW50cy5cbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICovXG4gICAgZ2V0QWxsVHJhbnNpdGlvbkV2ZW50cyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBldmVudHMgPSB7fTtcbiAgICAgICAgZnVuY3Rpb24gZ2V0RXZlbnRzKHN0YXRlKXtcblxuICAgICAgICAgICAgaWYoc3RhdGUudHJhbnNpdGlvbnMpe1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSBzdGF0ZS50cmFuc2l0aW9ucy5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzW3N0YXRlLnRyYW5zaXRpb25zW3R4SWR4XS5ldmVudF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoc3RhdGUuc3RhdGVzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdGVJZHggPSAwLCBzdGF0ZUxlbiA9IHN0YXRlLnN0YXRlcy5sZW5ndGg7IHN0YXRlSWR4IDwgc3RhdGVMZW47IHN0YXRlSWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0RXZlbnRzKHN0YXRlLnN0YXRlc1tzdGF0ZUlkeF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldEV2ZW50cyh0aGlzLl9tb2RlbCk7XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGV2ZW50cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICogVGhyZWUgdGhpbmdzIGNhcHR1cmUgdGhlIGN1cnJlbnQgc25hcHNob3Qgb2YgYSBydW5uaW5nIFNDSU9OIGludGVycHJldGVyOlxuICAgICpcbiAgICAqICAgICAgPHVsPlxuICAgICogICAgICA8bGk+IGJhc2ljIGNvbmZpZ3VyYXRpb24gKHRoZSBzZXQgb2YgYmFzaWMgc3RhdGVzIHRoZSBzdGF0ZSBtYWNoaW5lIGlzIGluKTwvbGk+XG4gICAgKiAgICAgIDxsaT4gaGlzdG9yeSBzdGF0ZSB2YWx1ZXMgKHRoZSBzdGF0ZXMgdGhlIHN0YXRlIG1hY2hpbmUgd2FzIGluIGxhc3QgdGltZSBpdCB3YXMgaW4gdGhlIHBhcmVudCBvZiBhIGhpc3Rvcnkgc3RhdGUpPC9saT5cbiAgICAqICAgICAgPGxpPiB0aGUgZGF0YW1vZGVsPC9saT5cbiAgICAqICAgICAgPC91bD5cbiAgICAqICAgICAgXG4gICAgKiBUaGUgc25hcHNob3Qgb2JqZWN0IGNhbiBiZSBzZXJpYWxpemVkIGFzIEpTT04gYW5kIHNhdmVkIHRvIGEgZGF0YWJhc2UuIEl0IGNhblxuICAgICogbGF0ZXIgYmUgcGFzc2VkIHRvIHRoZSBTQ1hNTCBjb25zdHJ1Y3RvciB0byByZXN0b3JlIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAgKiB1c2luZyB0aGUgc25hcHNob3QgYXJndW1lbnQuXG4gICAgKlxuICAgICogQHJldHVybiB7U25hcHNob3R9IFxuICAgICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgXG4gICAgKi9cbiAgICBnZXRTbmFwc2hvdCA6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmdldENvbmZpZ3VyYXRpb24oKSxcbiAgICAgICAgdGhpcy5fc2VyaWFsaXplSGlzdG9yeSgpLFxuICAgICAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSxcbiAgICAgICAgdGhpcy5fbW9kZWwuJHNlcmlhbGl6ZURhdGFtb2RlbCgpLFxuICAgICAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUuc2xpY2UoKVxuICAgICAgXTtcbiAgICB9LFxuXG4gICAgX3NlcmlhbGl6ZUhpc3RvcnkgOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIG8gPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2hpc3RvcnlWYWx1ZSkuZm9yRWFjaChmdW5jdGlvbihzaWQpe1xuICAgICAgICBvW3NpZF0gPSB0aGlzLl9oaXN0b3J5VmFsdWVbc2lkXS5tYXAoZnVuY3Rpb24oc3RhdGUpe3JldHVybiBzdGF0ZS5pZH0pO1xuICAgICAgfSx0aGlzKTtcbiAgICAgIHJldHVybiBvO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGV4dGVuZHMgQmFzZUludGVycHJldGVyXG4gKiBAbWVtYmVyb2Ygc2Npb25cbiAqL1xuZnVuY3Rpb24gU3RhdGVjaGFydChtb2RlbCwgb3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgb3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgPSBvcHRzLkludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCB8fCBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQ7XG5cbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gZmFsc2U7XG5cbiAgICBCYXNlSW50ZXJwcmV0ZXIuY2FsbCh0aGlzLG1vZGVsLG9wdHMpOyAgICAgLy9jYWxsIHN1cGVyIGNvbnN0cnVjdG9yXG5cbiAgICBtb2R1bGUuZXhwb3J0cy5lbWl0KCduZXcnLHRoaXMpO1xufVxuXG5mdW5jdGlvbiBiZWdldChvKXtcbiAgICBmdW5jdGlvbiBGKCl7fVxuICAgIEYucHJvdG90eXBlID0gbztcbiAgICByZXR1cm4gbmV3IEYoKTtcbn1cblxuLy8gRG8gbm90aGluZ1xuXG5mdW5jdGlvbiBub3AoKSB7fVxuXG4vL1N0YXRlY2hhcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlKTtcbi8vd291bGQgbGlrZSB0byB1c2UgT2JqZWN0LmNyZWF0ZSBoZXJlLCBidXQgbm90IHBvcnRhYmxlLCBidXQgaXQncyB0b28gY29tcGxpY2F0ZWQgdG8gdXNlIHBvcnRhYmx5XG5TdGF0ZWNoYXJ0LnByb3RvdHlwZSA9IGJlZ2V0KEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUpOyAgICBcblxuLyoqXG4gKiBAaW50ZXJmYWNlIEV2ZW50XG4gKi9cblxuLyoqIFxuKiBAbWVtYmVyIG5hbWVcbiogQG1lbWJlcm9mIEV2ZW50LnByb3RvdHlwZSBcbiogQHR5cGUgc3RyaW5nXG4qIEBkZXNjcmlwdGlvbiBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcbiovXG5cbi8qKiBcbiogQG1lbWJlciBkYXRhXG4qIEBtZW1iZXJvZiBFdmVudC5wcm90b3R5cGUgXG4qIEB0eXBlIGFueVxuKiBAZGVzY3JpcHRpb24gVGhlIGV2ZW50IGRhdGFcbiovXG5cbi8qKiBcbiogQW4gU0NYTUwgaW50ZXJwcmV0ZXIgdGFrZXMgU0NYTUwgZXZlbnRzIGFzIGlucHV0LCB3aGVyZSBhbiBTQ1hNTCBldmVudCBpcyBhblxuKiBvYmplY3Qgd2l0aCBcIm5hbWVcIiBhbmQgXCJkYXRhXCIgcHJvcGVydGllcy4gVGhlc2UgY2FuIGJlIHBhc3NlZCB0byBtZXRob2QgYGdlbmBcbiogYXMgdHdvIHBvc2l0aW9uYWwgYXJndW1lbnRzLCBvciBhcyBhIHNpbmdsZSBvYmplY3QuXG4qIEBmdW5jdGlvbiBnZW5cbiogQG1lbWJlcm9mIFN0YXRlY2hhcnQucHJvdG90eXBlIFxuKiBAcGFyYW0ge3N0cmluZ3xFdmVudH0gZXZ0T2JqT3JOYW1lXG4qIEBwYXJhbSB7YW55PX0gb3B0aW9uYWxEYXRhXG4qIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FbnRyeVxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdFxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uVHJhbnNpdGlvblxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRGVmYXVsdEVudHJ5XG4qIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FcnJvclxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEJlZ2luXG4qIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4qIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwU3VzcGVuZFxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcFJlc3VtZVxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwQmVnaW5cbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEVuZFxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdEludGVycHJldGVyXG4qL1xuU3RhdGVjaGFydC5wcm90b3R5cGUuZ2VuID0gZnVuY3Rpb24oZXZ0T2JqT3JOYW1lLG9wdGlvbmFsRGF0YSkge1xuXG4gICAgdmFyIGN1cnJlbnRFdmVudDtcbiAgICBzd2l0Y2godHlwZW9mIGV2dE9iak9yTmFtZSl7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjdXJyZW50RXZlbnQgPSB7bmFtZSA6IGV2dE9iak9yTmFtZSwgZGF0YSA6IG9wdGlvbmFsRGF0YX07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgIGlmKHR5cGVvZiBldnRPYmpPck5hbWUubmFtZSA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRFdmVudCA9IGV2dE9iak9yTmFtZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgb2JqZWN0IG11c3QgaGF2ZSBcIm5hbWVcIiBwcm9wZXJ0eSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBnZW4gbXVzdCBiZSBhIHN0cmluZyBvciBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgaWYodGhpcy5faXNTdGVwcGluZykgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBnZW4gZHVyaW5nIGEgYmlnLXN0ZXAnKTtcblxuICAgIC8vb3RoZXJ3aXNlLCBraWNrIGhpbSBvZmZcbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gdHJ1ZTtcblxuICAgIHRoaXMuX3BlcmZvcm1CaWdTdGVwKGN1cnJlbnRFdmVudCk7XG5cbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpO1xufTtcblxuLyoqXG4qIEluamVjdHMgYW4gZXh0ZXJuYWwgZXZlbnQgaW50byB0aGUgaW50ZXJwcmV0ZXIgYXN5bmNocm9ub3VzbHlcbiogQGZ1bmN0aW9uIGdlbkFzeW5jXG4qIEBtZW1iZXJvZiBTdGF0ZWNoYXJ0LnByb3RvdHlwZSBcbiogQHBhcmFtIHtFdmVudH0gIGN1cnJlbnRFdmVudCBUaGUgZXZlbnQgdG8gaW5qZWN0XG4qIEBwYXJhbSB7Z2VuQ2FsbGJhY2t9IGNiIENhbGxiYWNrIGludm9rZWQgd2l0aCBhbiBlcnJvciBvciB0aGUgaW50ZXJwcmV0ZXIncyBzdGFibGUgY29uZmlndXJhdGlvblxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRW50cnlcbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkV4aXRcbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblRyYW5zaXRpb25cbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkRlZmF1bHRFbnRyeVxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXJyb3JcbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBCZWdpblxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcFN1c3BlbmRcbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBSZXN1bWVcbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEJlZ2luXG4qIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25TbWFsbFN0ZXBFbmRcbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBFbmRcbiogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkV4aXRJbnRlcnByZXRlclxuKi9cblN0YXRlY2hhcnQucHJvdG90eXBlLmdlbkFzeW5jID0gZnVuY3Rpb24oY3VycmVudEV2ZW50LCBjYikge1xuICAgIGlmIChjdXJyZW50RXZlbnQgIT09IG51bGwgJiYgKHR5cGVvZiBjdXJyZW50RXZlbnQgIT09ICdvYmplY3QnIHx8ICFjdXJyZW50RXZlbnQgfHwgdHlwZW9mIGN1cnJlbnRFdmVudC5uYW1lICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBjdXJyZW50RXZlbnQgdG8gYmUgbnVsbCBvciBhbiBPYmplY3Qgd2l0aCBhIG5hbWUnKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYiA9IG5vcDtcbiAgICB9XG5cbiAgICB0aGlzLl9leHRlcm5hbEV2ZW50UXVldWUucHVzaChbY3VycmVudEV2ZW50LCBjYl0pO1xuXG4gICAgLy90aGUgc2VtYW50aWNzIHdlIHdhbnQgYXJlIHRvIHJldHVybiB0byB0aGUgY2IgdGhlIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyB0aGF0IHBhcnRpY3VsYXIgZXZlbnQuXG4gICAgZnVuY3Rpb24gbmV4dFN0ZXAoZSwgYyl7XG4gICAgICB0aGlzLl9wZXJmb3JtQmlnU3RlcEFzeW5jKGUsIGZ1bmN0aW9uKGVyciwgY29uZmlnKSB7XG4gICAgICAgICAgYyhlcnIsIGNvbmZpZyk7XG5cbiAgICAgICAgICBpZih0aGlzLl9leHRlcm5hbEV2ZW50UXVldWUubGVuZ3RoKXtcbiAgICAgICAgICAgIG5leHRTdGVwLmFwcGx5KHRoaXMsdGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLnNoaWZ0KCkpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5faXNTdGVwcGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmKCF0aGlzLl9pc1N0ZXBwaW5nKXsgXG4gICAgICB0aGlzLl9pc1N0ZXBwaW5nID0gdHJ1ZTtcbiAgICAgIG5leHRTdGVwLmFwcGx5KHRoaXMsdGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLnNoaWZ0KCkpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIEludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dChpbnRlcnByZXRlcikge1xuICAgIHRoaXMuX2ludGVycHJldGVyID0gaW50ZXJwcmV0ZXI7XG4gICAgdGhpcy5fdGltZW91dE1hcCA9IHt9O1xuICAgIHRoaXMuX2ludm9rZU1hcCA9IHt9O1xuICAgIHRoaXMuX3RpbWVvdXRzID0gbmV3IFNldCgpXG59XG5cbi8vUmVnZXggZnJvbTpcbi8vICBodHRwOi8vZGFyaW5nZmlyZWJhbGwubmV0LzIwMTAvMDcvaW1wcm92ZWRfcmVnZXhfZm9yX21hdGNoaW5nX3VybHNcbi8vICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82OTI3ODc4XG52YXIgdmFsaWRhdGVVcmlSZWdleCA9IC8oI18uKil8XFxiKCg/OlthLXpdW1xcdy1dKzooPzpcXC97MSwzfXxbYS16MC05JV0pfHd3d1xcZHswLDN9Wy5dfFthLXowLTkuXFwtXStbLl1bYS16XXsyLDR9XFwvKSg/OlteXFxzKCk8Pl0rfFxcKChbXlxccygpPD5dK3woXFwoW15cXHMoKTw+XStcXCkpKSpcXCkpKyg/OlxcKChbXlxccygpPD5dK3woXFwoW15cXHMoKTw+XStcXCkpKSpcXCl8W15cXHNgISgpXFxbXFxde307OidcIi4sPD4/wqvCu+KAnOKAneKAmOKAmV0pKS9pO1xuXG4vL1RPRE86IGNvbnNpZGVyIHdoZXRoZXIgdGhpcyBpcyB0aGUgQVBJIHdlIHdvdWxkIGxpa2UgdG8gZXhwb3NlXG5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGludm9rZVNlbmRUYXJnZXRSZWdleCAgOiAvXiNfKC4qKSQvLFxuICAgIHNjeG1sU2VuZFRhcmdldFJlZ2V4ICA6IC9eI19zY3htbF8oLiopJC8sXG4gICAgcmFpc2UgOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRoaXMuX2luc3RhbGxEZWZhdWx0UHJvcHNPbkV2ZW50KGV2ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKGV2ZW50KTsgXG4gICAgfSxcbiAgICBwYXJzZVhtbFN0cmluZ0FzRE9NIDogZnVuY3Rpb24oeG1sU3RyaW5nKXtcbiAgICAgIHJldHVybiAodGhpcy5faW50ZXJwcmV0ZXIub3B0cy54bWxQYXJzZXIgfHwgSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0LnhtbFBhcnNlcikucGFyc2UoeG1sU3RyaW5nKTtcbiAgICB9LFxuICAgIGludm9rZSA6IGZ1bmN0aW9uKGludm9rZU9iail7XG4gICAgICAvL2xvb2sgdXAgaW52b2tlciBieSB0eXBlLiBhc3N1bWUgaW52b2tlcnMgYXJlIHBhc3NlZCBpbiBhcyBhbiBvcHRpb24gdG8gY29uc3RydWN0b3JcbiAgICAgIHRoaXMuX2ludm9rZU1hcFtpbnZva2VPYmouaWRdID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAodGhpcy5faW50ZXJwcmV0ZXIub3B0cy5pbnZva2VycyB8fCBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQuaW52b2tlcnMpW2ludm9rZU9iai50eXBlXSh0aGlzLl9pbnRlcnByZXRlciwgaW52b2tlT2JqLCAoZXJyLCBzZXNzaW9uKSA9PiB7XG4gICAgICAgICAgaWYoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG5cbiAgICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5lbWl0KCdvbkludm9rZWRTZXNzaW9uSW5pdGlhbGl6ZWQnLCBzZXNzaW9uKTtcbiAgICAgICAgICByZXNvbHZlKHNlc3Npb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY2FuY2VsSW52b2tlIDogZnVuY3Rpb24oaW52b2tlaWQpe1xuICAgICAgLy9UT0RPOiBvbiBjYW5jZWwgaW52b2tlIGNsZWFuIHVwIHRoaXMuX2ludm9rZU1hcFxuICAgICAgbGV0IHNlc3Npb25Qcm9taXNlID0gdGhpcy5faW52b2tlTWFwW2ludm9rZWlkXTtcbiAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coYGNhbmNlbGxpbmcgc2Vzc2lvbiB3aXRoIGludm9rZWlkICR7aW52b2tlaWR9YCk7XG4gICAgICBpZihzZXNzaW9uUHJvbWlzZSl7XG4gICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coYHNlc3Npb25Qcm9taXNlIGZvdW5kYCk7XG4gICAgICAgIHNlc3Npb25Qcm9taXNlLnRoZW4oIFxuICAgICAgICAgICgoc2Vzc2lvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZyhgcmVzb2x2ZWQgc2Vzc2lvbiAke2ludm9rZWlkfS4gY2FuY2VsbGluZy4uLiBgKTtcbiAgICAgICAgICAgIHNlc3Npb24uY2FuY2VsKCk7IFxuICAgICAgICAgICAgLy9jbGVhbiB1cFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2ludm9rZU1hcFtpbnZva2VpZF07XG4gICAgICAgICAgfSksIFxuICAgICAgICAgICggKGVycikgPT4ge1xuICAgICAgICAgICAgLy9UT0RPOiBkaXNwYXRjaCBlcnJvciBiYWNrIGludG8gdGhlIHN0YXRlIG1hY2hpbmUgYXMgZXJyb3IuY29tbXVuaWNhdGlvblxuICAgICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9pbnN0YWxsRGVmYXVsdFByb3BzT25FdmVudCA6IGZ1bmN0aW9uKGV2ZW50LGlzSW50ZXJuYWwpe1xuICAgICAgaWYoIWlzSW50ZXJuYWwpeyBcbiAgICAgICAgZXZlbnQub3JpZ2luID0gdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5feC5faW9wcm9jZXNzb3JzLnNjeG1sLmxvY2F0aW9uOyAgICAgLy9UT0RPOiBwcmVzZXJ2ZSBvcmlnaW5hbCBvcmlnaW4gd2hlbiB3ZSBhdXRvZm9yd2FyZD8gXG4gICAgICAgIGV2ZW50Lm9yaWdpbnR5cGUgPSBldmVudC50eXBlIHx8IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEU7XG4gICAgICB9XG4gICAgICBpZih0eXBlb2YgZXZlbnQudHlwZSA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICBldmVudC50eXBlID0gaXNJbnRlcm5hbCA/ICdpbnRlcm5hbCcgOiAnZXh0ZXJuYWwnO1xuICAgICAgfVxuICAgICAgW1xuICAgICAgICAnbmFtZScsXG4gICAgICAgICdzZW5kaWQnLFxuICAgICAgICAnaW52b2tlaWQnLFxuICAgICAgICAnZGF0YScsXG4gICAgICAgICdvcmlnaW4nLFxuICAgICAgICAnb3JpZ2ludHlwZSdcbiAgICAgIF0uZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgaWYodHlwZW9mIGV2ZW50W3Byb3BdID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgZXZlbnRbcHJvcF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc2VuZCA6IGZ1bmN0aW9uKGV2ZW50LCBvcHRpb25zKXtcbiAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZygnc2VuZCBldmVudCcsIGV2ZW50LCBvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBzZW5kVHlwZSA9IG9wdGlvbnMudHlwZSB8fCBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFO1xuICAgICAgICAvL1RPRE86IG1vdmUgdGhlc2Ugb3V0XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlU2VuZChldmVudCwgb3B0aW9ucywgc2VuZEFjdGlvbil7XG4gICAgICAgICAgaWYoZXZlbnQudGFyZ2V0KXtcbiAgICAgICAgICAgIHZhciB0YXJnZXRJc1ZhbGlkVXJpID0gdmFsaWRhdGVVcmlSZWdleC50ZXN0KGV2ZW50LnRhcmdldClcbiAgICAgICAgICAgIGlmKCF0YXJnZXRJc1ZhbGlkVXJpKXtcbiAgICAgICAgICAgICAgdGhyb3cgeyBuYW1lIDogXCJlcnJvci5leGVjdXRpb25cIiwgZGF0YTogJ1RhcmdldCBpcyBub3QgdmFsaWQgVVJJJywgc2VuZGlkOiBldmVudC5zZW5kaWQsIHR5cGUgOiAncGxhdGZvcm0nIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCBzZW5kVHlwZSAhPT0gU0NYTUxfSU9QUk9DRVNTT1JfVFlQRSkgeyAgLy9UT0RPOiBleHRlbmQgdGhpcyB0byBzdXBwb3J0IEhUVFAsIGFuZCBvdGhlciBJTyBwcm9jZXNzb3JzXG4gICAgICAgICAgICAgIHRocm93IHsgbmFtZSA6IFwiZXJyb3IuZXhlY3V0aW9uXCIsIGRhdGE6ICdVbnN1cHBvcnRlZCBldmVudCBwcm9jZXNzb3IgdHlwZScsIHNlbmRpZDogZXZlbnQuc2VuZGlkLCB0eXBlIDogJ3BsYXRmb3JtJyB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlbmRBY3Rpb24uY2FsbCh0aGlzLCBldmVudCwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWZhdWx0U2VuZEFjdGlvbiAoZXZlbnQsIG9wdGlvbnMpIHtcblxuICAgICAgICAgIGlmKCB0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ3VuZGVmaW5lZCcgKSB0aHJvdyBuZXcgRXJyb3IoJ0RlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgU3RhdGVjaGFydC5wcm90b3R5cGUuc2VuZCB3aWxsIG5vdCB3b3JrIHVubGVzcyBzZXRUaW1lb3V0IGlzIGRlZmluZWQgZ2xvYmFsbHkuJyk7XG5cbiAgICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgICAgaWYoZXZlbnQudGFyZ2V0ID09PSAnI19pbnRlcm5hbCcpe1xuICAgICAgICAgICAgdGhpcy5yYWlzZShldmVudCk7XG4gICAgICAgICAgfWVsc2V7IFxuICAgICAgICAgICAgdGhpcy5faW5zdGFsbERlZmF1bHRQcm9wc09uRXZlbnQoZXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIGV2ZW50Lm9yaWdpbnR5cGUgPSBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFOyAgICAgIC8vVE9ETzogZXh0ZW5kIHRoaXMgdG8gc3VwcG9ydCBIVFRQLCBhbmQgb3RoZXIgSU8gcHJvY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPIDogcGFyYW10ZXJpemUgdGhpcyBiYXNlZCBvbiBzZW5kL0B0eXBlP1xuICAgICAgICAgICAgaWYoIWV2ZW50LnRhcmdldCl7XG4gICAgICAgICAgICAgIGRvU2VuZC5jYWxsKHRoaXMsIHRoaXMuX2ludGVycHJldGVyKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKGV2ZW50LnRhcmdldCA9PT0gJyNfcGFyZW50Jyl7XG4gICAgICAgICAgICAgIGlmKHRoaXMuX2ludGVycHJldGVyLm9wdHMucGFyZW50U2Vzc2lvbil7XG4gICAgICAgICAgICAgICAgZXZlbnQuaW52b2tlaWQgPSB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmludm9rZWlkO1xuICAgICAgICAgICAgICAgIGRvU2VuZC5jYWxsKHRoaXMsIHRoaXMuX2ludGVycHJldGVyLm9wdHMucGFyZW50U2Vzc2lvbik7XG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IHsgbmFtZSA6IFwiZXJyb3IuY29tbXVuaWNhdGlvblwiLCBkYXRhOiAnUGFyZW50IHNlc3Npb24gbm90IHNwZWNpZmllZCcsIHNlbmRpZDogZXZlbnQuc2VuZGlkLCB0eXBlIDogJ3BsYXRmb3JtJyB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYobWF0Y2ggPSBldmVudC50YXJnZXQubWF0Y2godGhpcy5zY3htbFNlbmRUYXJnZXRSZWdleCkpe1xuICAgICAgICAgICAgICBsZXQgdGFyZ2V0U2Vzc2lvbklkID0gbWF0Y2hbMV07XG4gICAgICAgICAgICAgIGxldCBzZXNzaW9uID0gdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5zZXNzaW9uUmVnaXN0cnkuZ2V0KHRhcmdldFNlc3Npb25JZClcbiAgICAgICAgICAgICAgaWYoc2Vzc2lvbil7XG4gICAgICAgICAgICAgICAgZG9TZW5kLmNhbGwodGhpcyxzZXNzaW9uKTtcbiAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IHtuYW1lIDogJ2Vycm9yLmNvbW11bmljYXRpb24nLCBzZW5kaWQ6IGV2ZW50LnNlbmRpZCwgdHlwZSA6ICdwbGF0Zm9ybSd9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSBpZihtYXRjaCA9IGV2ZW50LnRhcmdldC5tYXRjaCh0aGlzLmludm9rZVNlbmRUYXJnZXRSZWdleCkpe1xuICAgICAgICAgICAgICAvL1RPRE86IHRlc3QgdGhpcyBjb2RlIHBhdGguXG4gICAgICAgICAgICAgIHZhciBpbnZva2VJZCA9IG1hdGNoWzFdXG4gICAgICAgICAgICAgIHRoaXMuX2ludm9rZU1hcFtpbnZva2VJZF0udGhlbiggKHNlc3Npb24pID0+IHtcbiAgICAgICAgICAgICAgICBkb1NlbmQuY2FsbCh0aGlzLHNlc3Npb24pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnJlY29nbml6ZWQgc2VuZCB0YXJnZXQuJyk7IC8vVE9ETzogZGlzcGF0Y2ggZXJyb3IgYmFjayBpbnRvIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnVuY3Rpb24gZG9TZW5kKHNlc3Npb24pe1xuICAgICAgICAgICAgLy9UT0RPOiB3ZSBwcm9iYWJseSBub3cgbmVlZCB0byByZWZhY3RvciBkYXRhIHN0cnVjdHVyZXM6XG4gICAgICAgICAgICAvLyAgICB0aGlzLl90aW1lb3V0c1xuICAgICAgICAgICAgLy8gICAgdGhpcy5fdGltZW91dE1hcFxuICAgICAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGlmIChldmVudC5zZW5kaWQpIGRlbGV0ZSB0aGlzLl90aW1lb3V0TWFwW2V2ZW50LnNlbmRpZF07XG4gICAgICAgICAgICAgIHRoaXMuX3RpbWVvdXRzLmRlbGV0ZSh0aW1lb3V0T3B0aW9ucyk7XG4gICAgICAgICAgICAgIGlmKHRoaXMuX2ludGVycHJldGVyLm9wdHMuZG9TZW5kKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmRvU2VuZChzZXNzaW9uLCBldmVudCk7XG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNlc3Npb25bdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5zZW5kQXN5bmMgPyAnZ2VuQXN5bmMnIDogJ2dlbiddKGV2ZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBvcHRpb25zLmRlbGF5IHx8IDApO1xuXG4gICAgICAgICAgICB2YXIgdGltZW91dE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIHNlbmRPcHRpb25zIDogb3B0aW9ucyxcbiAgICAgICAgICAgICAgdGltZW91dEhhbmRsZSA6IHRpbWVvdXRIYW5kbGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoZXZlbnQuc2VuZGlkKSB0aGlzLl90aW1lb3V0TWFwW2V2ZW50LnNlbmRpZF0gPSB0aW1lb3V0SGFuZGxlO1xuICAgICAgICAgICAgdGhpcy5fdGltZW91dHMuYWRkKHRpbWVvdXRPcHRpb25zKTsgXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHVibGlzaCgpe1xuICAgICAgICAgIHRoaXMuX2ludGVycHJldGVyLmVtaXQoZXZlbnQubmFtZSxldmVudC5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY2hvb3NlIHNlbmQgZnVuY3Rpb25cbiAgICAgICAgLy9UT0RPOiByZXRoaW5rIGhvdyB0aGlzIGN1c3RvbSBzZW5kIHdvcmtzXG4gICAgICAgIHZhciBzZW5kRm47ICAgICAgICAgXG4gICAgICAgIGlmKGV2ZW50LnR5cGUgPT09ICdodHRwczovL2dpdGh1Yi5jb20vamJlYXJkNC9TQ0lPTiNwdWJsaXNoJyl7XG4gICAgICAgICAgc2VuZEZuID0gcHVibGlzaDtcbiAgICAgICAgfWVsc2UgaWYodGhpcy5faW50ZXJwcmV0ZXIub3B0cy5jdXN0b21TZW5kKXtcbiAgICAgICAgICBzZW5kRm4gPSB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmN1c3RvbVNlbmQ7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHNlbmRGbiA9IGRlZmF1bHRTZW5kQWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucz1vcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coXCJzZW5kaW5nIGV2ZW50XCIsIGV2ZW50Lm5hbWUsIFwid2l0aCBjb250ZW50XCIsIGV2ZW50LmRhdGEsIFwiYWZ0ZXIgZGVsYXlcIiwgb3B0aW9ucy5kZWxheSk7XG5cbiAgICAgICAgdmFsaWRhdGVTZW5kLmNhbGwodGhpcywgZXZlbnQsIG9wdGlvbnMsIHNlbmRGbik7XG4gICAgfSxcbiAgICBjYW5jZWwgOiBmdW5jdGlvbihzZW5kaWQpe1xuICAgICAgICBpZih0aGlzLl9pbnRlcnByZXRlci5vcHRzLmN1c3RvbUNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVycHJldGVyLm9wdHMuY3VzdG9tQ2FuY2VsLmFwcGx5KHRoaXMsIFtzZW5kaWRdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAndW5kZWZpbmVkJyApIHRocm93IG5ldyBFcnJvcignRGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBTdGF0ZWNoYXJ0LnByb3RvdHlwZS5jYW5jZWwgd2lsbCBub3Qgd29yayB1bmxlc3Mgc2V0VGltZW91dCBpcyBkZWZpbmVkIGdsb2JhbGx5LicpO1xuXG4gICAgICAgIGlmIChzZW5kaWQgaW4gdGhpcy5fdGltZW91dE1hcCkge1xuICAgICAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZyhcImNhbmNlbGxpbmcgXCIsIHNlbmRpZCwgXCIgd2l0aCB0aW1lb3V0IGlkIFwiLCB0aGlzLl90aW1lb3V0TWFwW3NlbmRpZF0pO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRNYXBbc2VuZGlkXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChuZXcgRXZlbnRFbWl0dGVyLHtcbiAgICBCYXNlSW50ZXJwcmV0ZXI6IEJhc2VJbnRlcnByZXRlcixcbiAgICBTdGF0ZWNoYXJ0OiBTdGF0ZWNoYXJ0LFxuICAgIEFycmF5U2V0IDogQXJyYXlTZXQsXG4gICAgU1RBVEVfVFlQRVMgOiBjb25zdGFudHMuU1RBVEVfVFlQRVMsXG4gICAgaW5pdGlhbGl6ZU1vZGVsIDogaW5pdGlhbGl6ZU1vZGVsLFxuICAgIEludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCA6IEludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dFxufSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gX29uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX2xpc3RlbmVyc1t0eXBlXSkpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gX29uY2UodHlwZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBfX29uY2UoKSB7XG4gICAgICAgIGZvciAodmFyIGFyZ3MgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLm9mZih0eXBlLCBfX29uY2UpO1xuICAgICAgICBsaXN0ZW5lci5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG5cbiAgICBfX29uY2UubGlzdGVuZXIgPSBsaXN0ZW5lcjtcblxuICAgIHJldHVybiB0aGlzLm9uKHR5cGUsIF9fb25jZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIF9vZmYodHlwZSwgbGlzdGVuZXIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5fbGlzdGVuZXJzW3R5cGVdKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyc1t0eXBlXVtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIF9lbWl0KHR5cGUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5fbGlzdGVuZXJzW3R5cGVdKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBhcmdzID0gW10sIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5mb3JFYWNoKGZ1bmN0aW9uIF9fZW1pdChsaXN0ZW5lcikge1xuICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIl19
