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
 * @typedef {function} FnModel
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
 * @class BaseInterpreter
 * @extends EventEmitter
 * @param {FnModel} modelOrFnGenerator
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
* @event BaseInterpreter#onError
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
     * @emits BaseInterpreter#onEntry
     * @emits BaseInterpreter#onExit
     * @emits BaseInterpreter#onTransition
     * @emits BaseInterpreter#onDefaultEntry
     * @emits BaseInterpreter#onError
     * @emits BaseInterpreter#onBigStepBegin
     * @emits BaseInterpreter#onBigStepEnd
     * @emits BaseInterpreter#onBigStepSuspend
     * @emits BaseInterpreter#onBigStepResume
     * @emits BaseInterpreter#onSmallStepBegin
     * @emits BaseInterpreter#onSmallStepEnd
     * @emits BaseInterpreter#onBigStepEnd
     * @emits BaseInterpreter#onExitInterpreter
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
     * @emits BaseInterpreter#onEntry
     * @emits BaseInterpreter#onExit
     * @emits BaseInterpreter#onTransition
     * @emits BaseInterpreter#onDefaultEntry
     * @emits BaseInterpreter#onError
     * @emits BaseInterpreter#onBigStepBegin
     * @emits BaseInterpreter#onBigStepEnd
     * @emits BaseInterpreter#onBigStepSuspend
     * @emits BaseInterpreter#onBigStepResume
     * @emits BaseInterpreter#onSmallStepBegin
     * @emits BaseInterpreter#onSmallStepEnd
     * @emits BaseInterpreter#onBigStepEnd
     * @emits BaseInterpreter#onExitInterpreter
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
* @emits BaseInterpreter#onEntry
* @emits BaseInterpreter#onExit
* @emits BaseInterpreter#onTransition
* @emits BaseInterpreter#onDefaultEntry
* @emits BaseInterpreter#onError
* @emits BaseInterpreter#onBigStepBegin
* @emits BaseInterpreter#onBigStepEnd
* @emits BaseInterpreter#onBigStepSuspend
* @emits BaseInterpreter#onBigStepResume
* @emits BaseInterpreter#onSmallStepBegin
* @emits BaseInterpreter#onSmallStepEnd
* @emits BaseInterpreter#onBigStepEnd
* @emits BaseInterpreter#onExitInterpreter
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
* @emits BaseInterpreter#onEntry
* @emits BaseInterpreter#onExit
* @emits BaseInterpreter#onTransition
* @emits BaseInterpreter#onDefaultEntry
* @emits BaseInterpreter#onError
* @emits BaseInterpreter#onBigStepBegin
* @emits BaseInterpreter#onBigStepEnd
* @emits BaseInterpreter#onBigStepSuspend
* @emits BaseInterpreter#onBigStepResume
* @emits BaseInterpreter#onSmallStepBegin
* @emits BaseInterpreter#onSmallStepEnd
* @emits BaseInterpreter#onBigStepEnd
* @emits BaseInterpreter#onExitInterpreter
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQXJyYXlTZXQuanMiLCJsaWIvY29uc3RhbnRzLmpzIiwibGliL2hlbHBlcnMuanMiLCJsaWIvcXVlcnkuanMiLCJsaWIvc2Npb24uanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbnktZXZlbnRzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNqQixRQUFJLEtBQUssRUFBVDtBQUNBLFNBQUssQ0FBTCxHQUFTLElBQUksR0FBSixDQUFRLENBQVIsQ0FBVDtBQUNIOztBQUVELFNBQVMsU0FBVCxHQUFxQjs7QUFFakIsU0FBTSxhQUFTLENBQVQsRUFBWTtBQUNkLGFBQUssQ0FBTCxDQUFPLEdBQVAsQ0FBVyxDQUFYO0FBQ0gsS0FKZ0I7O0FBTWpCLFlBQVMsZ0JBQVMsQ0FBVCxFQUFZO0FBQ2pCLGVBQU8sS0FBSyxDQUFMLENBQU8sTUFBUCxDQUFjLENBQWQsQ0FBUDtBQUNILEtBUmdCOztBQVVqQixXQUFRLGVBQVMsQ0FBVCxFQUFZO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ2hCLGlDQUFjLEVBQUUsQ0FBaEIsOEhBQW1CO0FBQUEsb0JBQVYsQ0FBVTs7QUFDZixxQkFBSyxDQUFMLENBQU8sR0FBUCxDQUFXLENBQVg7QUFDSDtBQUhlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSWhCLGVB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogYmVnaW4gQXJyYXlTZXQgKi9cblxuLyoqIEBjb25zdHJ1Y3RvciAqL1xuZnVuY3Rpb24gQXJyYXlTZXQobCkge1xuICAgIGwgPSBsIHx8IFtdO1xuICAgIHRoaXMubyA9IG5ldyBTZXQobCk7ICAgICAgICBcbn1cblxuQXJyYXlTZXQucHJvdG90eXBlID0ge1xuXG4gICAgYWRkIDogZnVuY3Rpb24oeCkge1xuICAgICAgICB0aGlzLm8uYWRkKHgpO1xuICAgIH0sXG5cbiAgICByZW1vdmUgOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm8uZGVsZXRlKHgpO1xuICAgIH0sXG5cbiAgICB1bmlvbiA6IGZ1bmN0aW9uKGwpIHtcbiAgICAgICAgZm9yICh2YXIgdiBvZiBsLm8pIHtcbiAgICAgICAgICAgIHRoaXMuby5hZGQodik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGRpZmZlcmVuY2UgOiBmdW5jdGlvbihsKSB7XG4gICAgICAgIGZvciAodmFyIHYgb2YgbC5vKSB7XG4gICAgICAgICAgICB0aGlzLm8uZGVsZXRlKHYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBjb250YWlucyA6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5oYXMoeCk7XG4gICAgfSxcblxuICAgIGl0ZXIgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5vKTtcbiAgICB9LFxuXG4gICAgaXNFbXB0eSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuby5zaXplO1xuICAgIH0sXG5cbiAgICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5zaXplO1xuICAgIH0sXG5cbiAgICBlcXVhbHMgOiBmdW5jdGlvbihzMikge1xuICAgICAgICBpZiAodGhpcy5vLnNpemUgIT09IHMyLnNpemUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgdiBvZiB0aGlzLm8pIHtcbiAgICAgICAgICAgIGlmICghczIuY29udGFpbnModikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5zaXplID09PSAwID8gJzxlbXB0eT4nIDogQXJyYXkuZnJvbSh0aGlzLm8pLmpvaW4oJyxcXG4nKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5U2V0O1xuIiwidmFyIFNUQVRFX1RZUEVTID0ge1xuICAgIEJBU0lDOiAwLFxuICAgIENPTVBPU0lURTogMSxcbiAgICBQQVJBTExFTDogMixcbiAgICBISVNUT1JZOiAzLFxuICAgIElOSVRJQUw6IDQsXG4gICAgRklOQUw6IDVcbn07XG5cbmNvbnN0IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUgPSAnaHR0cDovL3d3dy53My5vcmcvVFIvc2N4bWwvI1NDWE1MRXZlbnRQcm9jZXNzb3InXG5jb25zdCBIVFRQX0lPUFJPQ0VTU09SX1RZUEUgPSAnaHR0cDovL3d3dy53My5vcmcvVFIvc2N4bWwvI0Jhc2ljSFRUUEV2ZW50UHJvY2Vzc29yJ1xuY29uc3QgUlhfVFJBSUxJTkdfV0lMRENBUkQgPSAvXFwuXFwqJC87XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTVEFURV9UWVBFUyA6IFNUQVRFX1RZUEVTLFxuICBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFICA6IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUsXG4gIEhUVFBfSU9QUk9DRVNTT1JfVFlQRSAgOiBIVFRQX0lPUFJPQ0VTU09SX1RZUEUsIFxuICBSWF9UUkFJTElOR19XSUxEQ0FSRCAgOiBSWF9UUkFJTElOR19XSUxEQ0FSRCBcbn07XG4iLCJjb25zdCBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpLFxuICAgICAgU1RBVEVfVFlQRVMgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMsXG4gICAgICBSWF9UUkFJTElOR19XSUxEQ0FSRCA9IGNvbnN0YW50cy5SWF9UUkFJTElOR19XSUxEQ0FSRDtcblxuY29uc3QgcHJpbnRUcmFjZSA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXh0ZW5kIDogZXh0ZW5kLFxuICB0cmFuc2l0aW9uV2l0aFRhcmdldHMgOiB0cmFuc2l0aW9uV2l0aFRhcmdldHMsXG4gIHRyYW5zaXRpb25Db21wYXJhdG9yIDogdHJhbnNpdGlvbkNvbXBhcmF0b3IsXG4gIGluaXRpYWxpemVNb2RlbCA6IGluaXRpYWxpemVNb2RlbCxcbiAgaXNFdmVudFByZWZpeE1hdGNoIDogaXNFdmVudFByZWZpeE1hdGNoLFxuICBpc1RyYW5zaXRpb25NYXRjaCA6IGlzVHJhbnNpdGlvbk1hdGNoLFxuICBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvciA6IHNjeG1sUHJlZml4VHJhbnNpdGlvblNlbGVjdG9yLFxuICBldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3IgOiBldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA6IGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgc29ydEluRW50cnlPcmRlciA6IHNvcnRJbkVudHJ5T3JkZXIsXG4gIGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkgOiBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5LFxuICBpbml0aWFsaXplTW9kZWxHZW5lcmF0b3JGbiA6IGluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuLFxuICBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uIDogZGVzZXJpYWxpemVTZXJpYWxpemVkQ29uZmlndXJhdGlvbixcbiAgZGVzZXJpYWxpemVIaXN0b3J5IDogZGVzZXJpYWxpemVIaXN0b3J5XG59O1xuXG5mdW5jdGlvbiBleHRlbmQgKHRvLCBmcm9tKXtcbiAgT2JqZWN0LmtleXMoZnJvbSkuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICB0b1trXSA9IGZyb21ba107IFxuICB9KTtcbiAgcmV0dXJuIHRvO1xufTtcblxuZnVuY3Rpb24gdHJhbnNpdGlvbldpdGhUYXJnZXRzKHQpe1xuICAgIHJldHVybiB0LnRhcmdldHM7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25Db21wYXJhdG9yKHQxLCB0Mikge1xuICAgIHJldHVybiB0MS5kb2N1bWVudE9yZGVyIC0gdDIuZG9jdW1lbnRPcmRlcjtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZU1vZGVsKHJvb3RTdGF0ZSl7XG4gICAgdmFyIHRyYW5zaXRpb25zID0gW10sIGlkVG9TdGF0ZU1hcCA9IG5ldyBNYXAoKSwgZG9jdW1lbnRPcmRlciA9IDA7XG5cblxuICAgIC8vVE9ETzogbmVlZCB0byBhZGQgZmFrZSBpZHMgdG8gYW55b25lIHRoYXQgZG9lc24ndCBoYXZlIHRoZW1cbiAgICAvL0ZJWE1FOiBtYWtlIHRoaXMgc2FmZXIgLSBicmVhayBpbnRvIG11bHRpcGxlIHBhc3Nlc1xuICAgIHZhciBpZENvdW50ID0ge307XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUlkKHR5cGUpe1xuICAgICAgICBpZihpZENvdW50W3R5cGVdID09PSB1bmRlZmluZWQpIGlkQ291bnRbdHlwZV0gPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICB2YXIgY291bnQgPSBpZENvdW50W3R5cGVdKys7XG4gICAgICAgICAgdmFyIGlkID0gJyRnZW5lcmF0ZWQtJyArIHR5cGUgKyAnLScgKyBjb3VudDsgXG4gICAgICAgIH0gd2hpbGUgKGlkVG9TdGF0ZU1hcC5oYXMoaWQpKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyYXBJbkZha2VSb290U3RhdGUoc3RhdGUpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGRlc2VyaWFsaXplRGF0YW1vZGVsIDogc3RhdGUuJGRlc2VyaWFsaXplRGF0YW1vZGVsIHx8IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgICAgICRzZXJpYWxpemVEYXRhbW9kZWwgOiBzdGF0ZS4kc2VyaWFsaXplRGF0YW1vZGVsIHx8IGZ1bmN0aW9uKCl7IHJldHVybiBudWxsO30sXG4gICAgICAgICAgICAkaWRUb1N0YXRlTWFwIDogaWRUb1N0YXRlTWFwLCAgIC8va2VlcCB0aGlzIGZvciBoYW5keSBkZXNlcmlhbGl6YXRpb24gb2Ygc2VyaWFsaXplZCBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICBkb2NVcmwgOiBzdGF0ZS5kb2NVcmwsXG4gICAgICAgICAgICBzdGF0ZXMgOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkdHlwZSA6ICdpbml0aWFsJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbnMgOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0IDogc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0YXRlXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlc1dpdGhJbml0aWFsQXR0cmlidXRlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICBAdGhpcyB7U0NUcmFuc2l0aW9ufVxuICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvblRvU3RyaW5nKHNvdXJjZVN0YXRlKXtcbiAgICAgIHJldHVybiBgJHtzb3VyY2VTdGF0ZX0gLS0gJHt0aGlzLmV2ZW50cyA/ICcoJyArIHRoaXMuZXZlbnRzLmpvaW4oJywnKSArICcpJyA6IG51bGx9JHt0aGlzLmNvbmQgPyAnWycgKyB0aGlzLmNvbmQubmFtZSArICddJyA6ICcnfSAtLT4gJHt0aGlzLnRhcmdldHMgPyB0aGlzLnRhcmdldHMuam9pbignLCcpIDogbnVsbH1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAgQHRoaXMge1NDU3RhdGV9XG4gICAgKi9cbiAgICBmdW5jdGlvbiBzdGF0ZVRvU3RyaW5nKCl7XG4gICAgICByZXR1cm4gdGhpcy5pZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZVN0YXRlSWRNYXAoc3RhdGUpe1xuICAgICAgLy9wb3B1bGF0ZSBzdGF0ZSBpZCBtYXBcbiAgICAgIGlmKHN0YXRlLmlkKXtcbiAgICAgICAgICBpZFRvU3RhdGVNYXAuc2V0KHN0YXRlLmlkLCBzdGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZS5zdGF0ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgcG9wdWxhdGVTdGF0ZUlkTWFwKHN0YXRlLnN0YXRlc1tqXSk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYXZlcnNlKGFuY2VzdG9ycyxzdGF0ZSl7XG5cbiAgICAgICAgaWYocHJpbnRUcmFjZSkgc3RhdGUudG9TdHJpbmcgPSBzdGF0ZVRvU3RyaW5nO1xuXG4gICAgICAgIC8vYWRkIHRvIGdsb2JhbCB0cmFuc2l0aW9uIGFuZCBzdGF0ZSBpZCBjYWNoZXNcbiAgICAgICAgaWYoc3RhdGUudHJhbnNpdGlvbnMpIHRyYW5zaXRpb25zLnB1c2guYXBwbHkodHJhbnNpdGlvbnMsc3RhdGUudHJhbnNpdGlvbnMpO1xuXG4gICAgICAgIC8vY3JlYXRlIGEgZGVmYXVsdCB0eXBlLCBqdXN0IHRvIG5vcm1hbGl6ZSB0aGluZ3NcbiAgICAgICAgLy90aGlzIHdheSB3ZSBjYW4gY2hlY2sgZm9yIHVuc3VwcG9ydGVkIHR5cGVzIGJlbG93XG4gICAgICAgIHN0YXRlLiR0eXBlID0gc3RhdGUuJHR5cGUgfHwgJ3N0YXRlJztcblxuICAgICAgICAvL2FkZCBhbmNlc3RvcnMgYW5kIGRlcHRoIHByb3BlcnRpZXNcbiAgICAgICAgc3RhdGUuYW5jZXN0b3JzID0gYW5jZXN0b3JzO1xuICAgICAgICBzdGF0ZS5kZXB0aCA9IGFuY2VzdG9ycy5sZW5ndGg7XG4gICAgICAgIHN0YXRlLnBhcmVudCA9IGFuY2VzdG9yc1swXTtcbiAgICAgICAgc3RhdGUuZG9jdW1lbnRPcmRlciA9IGRvY3VtZW50T3JkZXIrKzsgXG5cbiAgICAgICAgLy9hZGQgc29tZSBpbmZvcm1hdGlvbiB0byB0cmFuc2l0aW9uc1xuICAgICAgICBzdGF0ZS50cmFuc2l0aW9ucyA9IHN0YXRlLnRyYW5zaXRpb25zIHx8IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gc3RhdGUudHJhbnNpdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gc3RhdGUudHJhbnNpdGlvbnNbal07XG4gICAgICAgICAgICB0cmFuc2l0aW9uLmRvY3VtZW50T3JkZXIgPSBkb2N1bWVudE9yZGVyKys7IFxuICAgICAgICAgICAgdHJhbnNpdGlvbi5zb3VyY2UgPSBzdGF0ZTtcbiAgICAgICAgICAgIGlmKHByaW50VHJhY2UpIHRyYW5zaXRpb24udG9TdHJpbmcgPSB0cmFuc2l0aW9uVG9TdHJpbmcuYmluZCh0cmFuc2l0aW9uLCBzdGF0ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9yZWN1cnNpdmUgc3RlcFxuICAgICAgICBpZihzdGF0ZS5zdGF0ZXMpIHtcbiAgICAgICAgICAgIHZhciBhbmNzID0gW3N0YXRlXS5jb25jYXQoYW5jZXN0b3JzKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZS5zdGF0ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0cmF2ZXJzZShhbmNzLCBzdGF0ZS5zdGF0ZXNbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9zZXR1cCBmYXN0IHN0YXRlIHR5cGVcbiAgICAgICAgc3dpdGNoKHN0YXRlLiR0eXBlKXtcbiAgICAgICAgICAgIGNhc2UgJ3BhcmFsbGVsJzpcbiAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9IFNUQVRFX1RZUEVTLlBBUkFMTEVMO1xuICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbml0aWFsJyA6IFxuICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuSU5JVElBTDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5pc0F0b21pYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdoaXN0b3J5JyA6XG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5ISVNUT1JZO1xuICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZpbmFsJyA6IFxuICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuRklOQUw7XG4gICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RhdGUnIDogXG4gICAgICAgICAgICBjYXNlICdzY3htbCcgOlxuICAgICAgICAgICAgICAgIGlmKHN0YXRlLnN0YXRlcyAmJiBzdGF0ZS5zdGF0ZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5DT01QT1NJVEU7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuQkFTSUM7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gc3RhdGUgdHlwZTogJyArIHN0YXRlLiR0eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGVzY2VuZGFudHMgcHJvcGVydHkgb24gc3RhdGVzIHdpbGwgbm93IGJlIHBvcHVsYXRlZC4gYWRkIGRlc2NlbmRhbnRzIHRvIHRoaXMgc3RhdGVcbiAgICAgICAgaWYoc3RhdGUuc3RhdGVzKXtcbiAgICAgICAgICAgIHN0YXRlLmRlc2NlbmRhbnRzID0gc3RhdGUuc3RhdGVzLmNvbmNhdChzdGF0ZS5zdGF0ZXMubWFwKGZ1bmN0aW9uKHMpe3JldHVybiBzLmRlc2NlbmRhbnRzO30pLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhLmNvbmNhdChiKTt9LFtdKSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgc3RhdGUuZGVzY2VuZGFudHMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbml0aWFsQ2hpbGRyZW47XG4gICAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBTVEFURV9UWVBFUy5DT01QT1NJVEUpe1xuICAgICAgICAgICAgLy9zZXQgdXAgaW5pdGlhbCBzdGF0ZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KHN0YXRlLmluaXRpYWwpIHx8IHR5cGVvZiBzdGF0ZS5pbml0aWFsID09PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICAgICAgc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzLnB1c2goc3RhdGUpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgLy90YWtlIHRoZSBmaXJzdCBjaGlsZCB0aGF0IGhhcyBpbml0aWFsIHR5cGUsIG9yIGZpcnN0IGNoaWxkXG4gICAgICAgICAgICAgICAgaW5pdGlhbENoaWxkcmVuID0gc3RhdGUuc3RhdGVzLmZpbHRlcihmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC4kdHlwZSA9PT0gJ2luaXRpYWwnO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5pdGlhbFJlZiA9IFtpbml0aWFsQ2hpbGRyZW4ubGVuZ3RoID8gaW5pdGlhbENoaWxkcmVuWzBdIDogc3RhdGUuc3RhdGVzWzBdXTtcbiAgICAgICAgICAgICAgICBjaGVja0luaXRpYWxSZWYoc3RhdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvL2hvb2sgdXAgaGlzdG9yeVxuICAgICAgICBpZihzdGF0ZS50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuQ09NUE9TSVRFIHx8XG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLlBBUkFMTEVMKXtcblxuICAgICAgICAgICAgdmFyIGhpc3RvcnlDaGlsZHJlbiA9IHN0YXRlLnN0YXRlcy5maWx0ZXIoZnVuY3Rpb24ocyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMuJHR5cGUgPT09ICdoaXN0b3J5JztcbiAgICAgICAgICAgIH0pOyBcblxuICAgICAgICAgICBzdGF0ZS5oaXN0b3J5UmVmID0gaGlzdG9yeUNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9ub3cgaXQncyBzYWZlIHRvIGZpbGwgaW4gZmFrZSBzdGF0ZSBpZHNcbiAgICAgICAgaWYoIXN0YXRlLmlkKXtcbiAgICAgICAgICAgIHN0YXRlLmlkID0gZ2VuZXJhdGVJZChzdGF0ZS4kdHlwZSk7XG4gICAgICAgICAgICBpZFRvU3RhdGVNYXAuc2V0KHN0YXRlLmlkLCBzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL25vcm1hbGl6ZSBvbkVudHJ5L29uRXhpdCwgd2hpY2ggY2FuIGJlIHNpbmdsZSBmbiBvciBhcnJheSwgb3IgYXJyYXkgb2YgYXJyYXlzIChibG9ja3MpXG4gICAgICAgIFsnb25FbnRyeScsJ29uRXhpdCddLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7XG4gICAgICAgICAgaWYgKHN0YXRlW3Byb3BdKSB7XG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShzdGF0ZVtwcm9wXSkpe1xuICAgICAgICAgICAgICBzdGF0ZVtwcm9wXSA9IFtzdGF0ZVtwcm9wXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighc3RhdGVbcHJvcF0uZXZlcnkoZnVuY3Rpb24oaGFuZGxlcil7IHJldHVybiBBcnJheS5pc0FycmF5KGhhbmRsZXIpOyB9KSl7XG4gICAgICAgICAgICAgIHN0YXRlW3Byb3BdID0gW3N0YXRlW3Byb3BdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdGF0ZS5pbnZva2VzICYmICFBcnJheS5pc0FycmF5KHN0YXRlLmludm9rZXMpKSB7XG4gICAgICAgICAgICBzdGF0ZS5pbnZva2VzID0gW3N0YXRlLmludm9rZXNdO1xuICAgICAgICAgICAgc3RhdGUuaW52b2tlcy5mb3JFYWNoKCBpbnZva2UgPT4ge1xuICAgICAgICAgICAgICBpZiAoaW52b2tlLmZpbmFsaXplICYmICFBcnJheS5pc0FycmF5KGludm9rZS5maW5hbGl6ZSkpIHtcbiAgICAgICAgICAgICAgICBpbnZva2UuZmluYWxpemUgPSBbaW52b2tlLmZpbmFsaXplXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vVE9ETzogY29udmVydCBldmVudHMgdG8gcmVndWxhciBleHByZXNzaW9ucyBpbiBhZHZhbmNlXG5cbiAgICBmdW5jdGlvbiBjaGVja0luaXRpYWxSZWYoc3RhdGUpe1xuICAgICAgaWYoIXN0YXRlLmluaXRpYWxSZWYpIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBpbml0aWFsIHN0YXRlIGZvciBjb21wb3NpdGUgc3RhdGU6ICcgKyBzdGF0ZS5pZCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbm5lY3RJbnRpYWxBdHRyaWJ1dGVzKCl7XG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHZhciBzID0gc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzW2pdO1xuXG4gICAgICAgIHZhciBpbml0aWFsU3RhdGVzID0gQXJyYXkuaXNBcnJheShzLmluaXRpYWwpID8gcy5pbml0aWFsIDogW3MuaW5pdGlhbF07XG4gICAgICAgIHMuaW5pdGlhbFJlZiA9IGluaXRpYWxTdGF0ZXMubWFwKGZ1bmN0aW9uKGluaXRpYWxTdGF0ZSl7IHJldHVybiBpZFRvU3RhdGVNYXAuZ2V0KGluaXRpYWxTdGF0ZSk7IH0pO1xuICAgICAgICBjaGVja0luaXRpYWxSZWYocyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFJYX1dISVRFU1BBQ0UgPSAvXFxzKy87XG5cbiAgICBmdW5jdGlvbiBjb25uZWN0VHJhbnNpdGlvbkdyYXBoKCl7XG4gICAgICAgIC8vbm9ybWFsaXplIGFzIHdpdGggb25FbnRyeS9vbkV4aXRcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRyYW5zaXRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRyYW5zaXRpb25zW2ldO1xuICAgICAgICAgICAgaWYgKHQub25UcmFuc2l0aW9uICYmICFBcnJheS5pc0FycmF5KHQub25UcmFuc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHQub25UcmFuc2l0aW9uID0gW3Qub25UcmFuc2l0aW9uXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9ub3JtYWxpemUgXCJldmVudFwiIGF0dHJpYnV0ZSBpbnRvIFwiZXZlbnRzXCIgYXR0cmlidXRlXG4gICAgICAgICAgICBpZiAodHlwZW9mIHQuZXZlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdC5ldmVudHMgPSB0LmV2ZW50LnRyaW0oKS5zcGxpdChSWF9XSElURVNQQUNFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSB0LmV2ZW50O1xuXG4gICAgICAgICAgICBpZih0LnRhcmdldHMgfHwgKHR5cGVvZiB0LnRhcmdldCA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgLy90YXJnZXRzIGhhdmUgYWxyZWFkeSBiZWVuIHNldCB1cFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSAgIFxuXG4gICAgICAgICAgICBpZih0eXBlb2YgdC50YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gaWRUb1N0YXRlTWFwLmdldCh0LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYoIXRhcmdldCkgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCB0YXJnZXQgc3RhdGUgd2l0aCBpZCAnICsgdC50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHQudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIHQudGFyZ2V0cyA9IFt0LnRhcmdldF07XG4gICAgICAgICAgICB9ZWxzZSBpZihBcnJheS5pc0FycmF5KHQudGFyZ2V0KSl7XG4gICAgICAgICAgICAgICAgdC50YXJnZXRzID0gdC50YXJnZXQubWFwKGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGlkVG9TdGF0ZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0YXJnZXQpIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgdGFyZ2V0IHN0YXRlIHdpdGggaWQgJyArIHQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgdC50YXJnZXQgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgICAgICB0LnRhcmdldHMgPSBbdC50YXJnZXRdO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2l0aW9uIHRhcmdldCBoYXMgdW5rbm93biB0eXBlOiAnICsgdC50YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9ob29rIHVwIExDQSAtIG9wdGltaXphdGlvblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdHJhbnNpdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ID0gdHJhbnNpdGlvbnNbaV07XG4gICAgICAgICAgICBpZih0LnRhcmdldHMpIHQubGNjYSA9IGdldExDQ0EodC5zb3VyY2UsdC50YXJnZXRzWzBdKTsgICAgLy9GSVhNRTogd2UgdGVjaG5pY2FsbHkgZG8gbm90IG5lZWQgdG8gaGFuZyBvbnRvIHRoZSBsY2NhLiBvbmx5IHRoZSBzY29wZSBpcyB1c2VkIGJ5IHRoZSBhbGdvcml0aG1cblxuICAgICAgICAgICAgdC5zY29wZSA9IGdldFNjb3BlKHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2NvcGUodHJhbnNpdGlvbil7XG4gICAgICAgIC8vVHJhbnNpdGlvbiBzY29wZSBpcyBub3JtYWxseSB0aGUgbGVhc3QgY29tbW9uIGNvbXBvdW5kIGFuY2VzdG9yIChsY2NhKS5cbiAgICAgICAgLy9JbnRlcm5hbCB0cmFuc2l0aW9ucyBoYXZlIGEgc2NvcGUgZXF1YWwgdG8gdGhlIHNvdXJjZSBzdGF0ZS5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25Jc1JlYWxseUludGVybmFsID0gXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi50eXBlID09PSAnaW50ZXJuYWwnICYmXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnNvdXJjZS50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuQ09NUE9TSVRFICYmICAgLy9pcyB0cmFuc2l0aW9uIHNvdXJjZSBhIGNvbXBvc2l0ZSBzdGF0ZVxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5zb3VyY2UucGFyZW50ICYmICAgIC8vcm9vdCBzdGF0ZSB3b24ndCBoYXZlIHBhcmVudFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi50YXJnZXRzICYmIC8vZG9lcyBpdCB0YXJnZXQgaXRzIGRlc2NlbmRhbnRzXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnRhcmdldHMuZXZlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odGFyZ2V0KXsgcmV0dXJuIHRyYW5zaXRpb24uc291cmNlLmRlc2NlbmRhbnRzLmluZGV4T2YodGFyZ2V0KSA+IC0xO30pO1xuXG4gICAgICAgIGlmKCF0cmFuc2l0aW9uLnRhcmdldHMpe1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1lbHNlIGlmKHRyYW5zaXRpb25Jc1JlYWxseUludGVybmFsKXtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2l0aW9uLnNvdXJjZTsgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24ubGNjYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExDQ0EoczEsIHMyKSB7XG4gICAgICAgIHZhciBjb21tb25BbmNlc3RvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHMxLmFuY2VzdG9ycy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmFyIGFuYyA9IHMxLmFuY2VzdG9yc1tqXTtcbiAgICAgICAgICAgIGlmKChhbmMudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLkNPTVBPU0lURSB8fCBhbmMudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLlBBUkFMTEVMKSAmJlxuICAgICAgICAgICAgICAgIGFuYy5kZXNjZW5kYW50cy5pbmRleE9mKHMyKSA+IC0xKXtcbiAgICAgICAgICAgICAgICBjb21tb25BbmNlc3RvcnMucHVzaChhbmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZighY29tbW9uQW5jZXN0b3JzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGZpbmQgTENBIGZvciBzdGF0ZXMuXCIpO1xuICAgICAgICByZXR1cm4gY29tbW9uQW5jZXN0b3JzWzBdO1xuICAgIH1cblxuICAgIC8vbWFpbiBleGVjdXRpb24gc3RhcnRzIGhlcmVcbiAgICAvL0ZJWE1FOiBvbmx5IHdyYXAgaW4gcm9vdCBzdGF0ZSBpZiBpdCdzIG5vdCBhIGNvbXBvdW5kIHN0YXRlXG4gICAgcG9wdWxhdGVTdGF0ZUlkTWFwKHJvb3RTdGF0ZSk7XG4gICAgdmFyIGZha2VSb290U3RhdGUgPSB3cmFwSW5GYWtlUm9vdFN0YXRlKHJvb3RTdGF0ZSk7ICAvL0kgd2lzaCB3ZSBoYWQgcG9pbnRlciBzZW1hbnRpY3MgYW5kIGNvdWxkIG1ha2UgdGhpcyBhIEMtc3R5bGUgXCJvdXQgYXJndW1lbnRcIi4gSW5zdGVhZCB3ZSByZXR1cm4gaGltXG4gICAgdHJhdmVyc2UoW10sZmFrZVJvb3RTdGF0ZSk7XG4gICAgY29ubmVjdFRyYW5zaXRpb25HcmFwaCgpO1xuICAgIGNvbm5lY3RJbnRpYWxBdHRyaWJ1dGVzKCk7XG5cbiAgICByZXR1cm4gZmFrZVJvb3RTdGF0ZTtcbn1cblxuXG5mdW5jdGlvbiBpc0V2ZW50UHJlZml4TWF0Y2gocHJlZml4LCBmdWxsTmFtZSkge1xuICAgIHByZWZpeCA9IHByZWZpeC5yZXBsYWNlKFJYX1RSQUlMSU5HX1dJTERDQVJELCAnJyk7XG5cbiAgICBpZiAocHJlZml4ID09PSBmdWxsTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4Lmxlbmd0aCA+IGZ1bGxOYW1lLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGZ1bGxOYW1lLmNoYXJBdChwcmVmaXgubGVuZ3RoKSAhPT0gJy4nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGZ1bGxOYW1lLmluZGV4T2YocHJlZml4KSA9PT0gMCk7XG59XG5cbmZ1bmN0aW9uIGlzVHJhbnNpdGlvbk1hdGNoKHQsIGV2ZW50TmFtZSkge1xuICAgIHJldHVybiB0LmV2ZW50cy5zb21lKCh0RXZlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRFdmVudCA9PT0gJyonIHx8IGlzRXZlbnRQcmVmaXhNYXRjaCh0RXZlbnQsIGV2ZW50TmFtZSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNjeG1sUHJlZml4VHJhbnNpdGlvblNlbGVjdG9yKHQsIGV2ZW50LCBldmFsdWF0b3IsIHNlbGVjdEV2ZW50bGVzc1RyYW5zaXRpb25zKSB7XG4gICAgcmV0dXJuICggXG4gICAgICBzZWxlY3RFdmVudGxlc3NUcmFuc2l0aW9ucyA/IFxuICAgICAgICAhdC5ldmVudHMgOlxuICAgICAgICAodC5ldmVudHMgJiYgZXZlbnQgJiYgZXZlbnQubmFtZSAmJiBpc1RyYW5zaXRpb25NYXRjaCh0LCBldmVudC5uYW1lKSlcbiAgICAgIClcbiAgICAgICYmICghdC5jb25kIHx8IGV2YWx1YXRvcih0LmNvbmQpKTtcbn1cblxuZnVuY3Rpb24gZXZlbnRsZXNzVHJhbnNpdGlvblNlbGVjdG9yKHN0YXRlKXtcbiAgcmV0dXJuIHN0YXRlLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbih0cmFuc2l0aW9uKXsgcmV0dXJuICF0cmFuc2l0aW9uLmV2ZW50cyB8fCAoIHRyYW5zaXRpb24uZXZlbnRzICYmIHRyYW5zaXRpb24uZXZlbnRzLmxlbmd0aCA9PT0gMCApOyB9KTtcbn1cblxuLy9wcmlvcml0eSBjb21wYXJpc29uIGZ1bmN0aW9uc1xuZnVuY3Rpb24gZ2V0VHJhbnNpdGlvbldpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KF9hcmdzKSB7XG4gICAgbGV0IHQxID0gX2FyZ3NbMF0sIHQyID0gX2FyZ3NbMV07XG4gICAgdmFyIHIgPSBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KHQxLnNvdXJjZSwgdDIuc291cmNlKTtcbiAgICAvL2NvbXBhcmUgdHJhbnNpdGlvbnMgYmFzZWQgZmlyc3Qgb24gZGVwdGgsIHRoZW4gYmFzZWQgb24gZG9jdW1lbnQgb3JkZXJcbiAgICBpZiAodDEuc291cmNlLmRlcHRoIDwgdDIuc291cmNlLmRlcHRoKSB7XG4gICAgICAgIHJldHVybiB0MjtcbiAgICB9IGVsc2UgaWYgKHQyLnNvdXJjZS5kZXB0aCA8IHQxLnNvdXJjZS5kZXB0aCkge1xuICAgICAgICByZXR1cm4gdDE7XG4gICAgfSBlbHNlIHtcbiAgICAgICBpZiAodDEuZG9jdW1lbnRPcmRlciA8IHQyLmRvY3VtZW50T3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0MTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0MjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc29ydEluRW50cnlPcmRlcihzMSwgczIpe1xuICByZXR1cm4gZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eShzMSwgczIpICogLTFcbn1cblxuZnVuY3Rpb24gZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eShzMSwgczIpIHtcbiAgICAvL2NvbXBhcmUgc3RhdGVzIGJhc2VkIGZpcnN0IG9uIGRlcHRoLCB0aGVuIGJhc2VkIG9uIGRvY3VtZW50IG9yZGVyXG4gICAgaWYgKHMxLmRlcHRoID4gczIuZGVwdGgpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH0gZWxzZSBpZiAoczEuZGVwdGggPCBzMi5kZXB0aCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL0VxdWFsaXR5XG4gICAgICAgIGlmIChzMS5kb2N1bWVudE9yZGVyIDwgczIuZG9jdW1lbnRPcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAoczEuZG9jdW1lbnRPcmRlciA+IHMyLmRvY3VtZW50T3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuKG1vZGVsRm4sIG9wdHMsIGludGVycHJldGVyKXtcbiAgICByZXR1cm4gbW9kZWxGbi5jYWxsKGludGVycHJldGVyLFxuICAgICAgICBvcHRzLl94LFxuICAgICAgICBvcHRzLl94Ll9zZXNzaW9uaWQsXG4gICAgICAgIG9wdHMuX3guX2lvcHJvY2Vzc29ycyxcbiAgICAgICAgaW50ZXJwcmV0ZXIuaXNJbi5iaW5kKGludGVycHJldGVyKSk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplU2VyaWFsaXplZENvbmZpZ3VyYXRpb24oc2VyaWFsaXplZENvbmZpZ3VyYXRpb24saWRUb1N0YXRlTWFwKXtcbiAgcmV0dXJuIHNlcmlhbGl6ZWRDb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbihpZCl7XG4gICAgdmFyIHN0YXRlID0gaWRUb1N0YXRlTWFwLmdldChpZCk7XG4gICAgaWYoIXN0YXRlKSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGxvYWRpbmcgc2VyaWFsaXplZCBjb25maWd1cmF0aW9uLiBVbmFibGUgdG8gbG9jYXRlIHN0YXRlIHdpdGggaWQgJyArIGlkKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUhpc3Rvcnkoc2VyaWFsaXplZEhpc3RvcnksaWRUb1N0YXRlTWFwKXtcbiAgdmFyIG8gPSB7fTtcbiAgT2JqZWN0LmtleXMoc2VyaWFsaXplZEhpc3RvcnkpLmZvckVhY2goZnVuY3Rpb24oc2lkKXtcbiAgICBvW3NpZF0gPSBzZXJpYWxpemVkSGlzdG9yeVtzaWRdLm1hcChmdW5jdGlvbihpZCl7XG4gICAgICB2YXIgc3RhdGUgPSBpZFRvU3RhdGVNYXAuZ2V0KGlkKTtcbiAgICAgIGlmKCFzdGF0ZSkgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBsb2FkaW5nIHNlcmlhbGl6ZWQgaGlzdG9yeS4gVW5hYmxlIHRvIGxvY2F0ZSBzdGF0ZSB3aXRoIGlkICcgKyBpZCk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gbztcbn1cblxuIiwiLy9tb2RlbCBhY2Nlc3NvciBmdW5jdGlvbnNcbmNvbnN0IHF1ZXJ5ID0ge1xuICAgIGlzRGVzY2VuZGFudCA6IGZ1bmN0aW9uKHMxLCBzMil7XG4gICAgICAvL1JldHVybnMgJ3RydWUnIGlmIHN0YXRlMSBpcyBhIGRlc2NlbmRhbnQgb2Ygc3RhdGUyIChhIGNoaWxkLCBvciBhIGNoaWxkIG9mIGEgY2hpbGQsIG9yIGEgY2hpbGQgb2YgYSBjaGlsZCBvZiBhIGNoaWxkLCBldGMuKSBPdGhlcndpc2UgcmV0dXJucyAnZmFsc2UnLlxuICAgICAgcmV0dXJuIHMyLmRlc2NlbmRhbnRzLmluZGV4T2YoczEpID4gLTE7XG4gICAgfSxcbiAgICBnZXRBbmNlc3RvcnM6IGZ1bmN0aW9uKHMsIHJvb3QpIHtcbiAgICAgICAgdmFyIGFuY2VzdG9ycywgaW5kZXgsIHN0YXRlO1xuICAgICAgICBpbmRleCA9IHMuYW5jZXN0b3JzLmluZGV4T2Yocm9vdCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5hbmNlc3RvcnMuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHMuYW5jZXN0b3JzO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRBbmNlc3RvcnNPclNlbGY6IGZ1bmN0aW9uKHMsIHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIFtzXS5jb25jYXQocXVlcnkuZ2V0QW5jZXN0b3JzKHMsIHJvb3QpKTtcbiAgICB9LFxuICAgIGdldERlc2NlbmRhbnRzT3JTZWxmOiBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBbc10uY29uY2F0KHMuZGVzY2VuZGFudHMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcXVlcnk7XG4iLCIvLyAgIENvcHlyaWdodCAyMDEyLTIwMTIgSmFjb2IgQmVhcmQsIElORklDT04sIGFuZCBvdGhlciBTQ0lPTiBjb250cmlidXRvcnNcbi8vXG4vLyAgIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vICAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyAgIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vICAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyAgIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vICAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cblxuLyoqXG4gKiBAdHlwZWRlZiB7ZnVuY3Rpb259IEZuTW9kZWxcbiAqL1xuXG4vKipcbiAqIEFuIEFycmF5IG9mIHN0cmluZ3MgcmVwcmVzZW50aW5nIHRoZSBpZHMgYWxsIG9mIHRoZSBiYXNpYyBzdGF0ZXMgdGhlXG4gKiBpbnRlcnByZXRlciBpcyBpbiBhZnRlciBhIGJpZy1zdGVwIGNvbXBsZXRlcy5cbiAqIEB0eXBlZGVmIHtBcnJheTxzdHJpbmc+fSBDb25maWd1cmF0aW9uXG4gKi9cblxuLyoqXG4gKiBBIHNldCBvZiBiYXNpYyBhbmQgY29tcG9zaXRlIHN0YXRlIGlkcy5cbiAqIEB0eXBlZGVmIHtBcnJheTxzdHJpbmc+fSBGdWxsQ29uZmlndXJhdGlvblxuICovXG5cbi8qKlxuICogQSBzZXQgb2YgYmFzaWMgYW5kIGNvbXBvc2l0ZSBzdGF0ZSBpZHMuXG4gKiBAdHlwZWRlZiB7QXJyYXk8c3RyaW5nPn0gRnVsbENvbmZpZ3VyYXRpb25cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgndGlueS1ldmVudHMnKS5FdmVudEVtaXR0ZXIsXG4gIHV0aWwgPSByZXF1aXJlKCd1dGlsJyksXG4gIEFycmF5U2V0ID0gcmVxdWlyZSgnLi9BcnJheVNldCcpLFxuICBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpLFxuICBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyksXG4gIHF1ZXJ5ID0gcmVxdWlyZSgnLi9xdWVyeScpLFxuICBleHRlbmQgPSBoZWxwZXJzLmV4dGVuZCxcbiAgdHJhbnNpdGlvbldpdGhUYXJnZXRzID0gaGVscGVycy50cmFuc2l0aW9uV2l0aFRhcmdldHMsXG4gIHRyYW5zaXRpb25Db21wYXJhdG9yID0gaGVscGVycy50cmFuc2l0aW9uQ29tcGFyYXRvcixcbiAgaW5pdGlhbGl6ZU1vZGVsID0gaGVscGVycy5pbml0aWFsaXplTW9kZWwsXG4gIGlzRXZlbnRQcmVmaXhNYXRjaCA9IGhlbHBlcnMuaXNFdmVudFByZWZpeE1hdGNoLFxuICBpc1RyYW5zaXRpb25NYXRjaCA9IGhlbHBlcnMuaXNUcmFuc2l0aW9uTWF0Y2gsXG4gIHNjeG1sUHJlZml4VHJhbnNpdGlvblNlbGVjdG9yID0gaGVscGVycy5zY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvcixcbiAgZXZlbnRsZXNzVHJhbnNpdGlvblNlbGVjdG9yID0gaGVscGVycy5ldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA9IGhlbHBlcnMuZ2V0VHJhbnNpdGlvbldpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5LFxuICBzb3J0SW5FbnRyeU9yZGVyID0gaGVscGVycy5zb3J0SW5FbnRyeU9yZGVyLFxuICBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5ID0gaGVscGVycy5nZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5LFxuICBpbml0aWFsaXplTW9kZWxHZW5lcmF0b3JGbiA9IGhlbHBlcnMuaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4sXG4gIGRlc2VyaWFsaXplU2VyaWFsaXplZENvbmZpZ3VyYXRpb24gPSBoZWxwZXJzLmRlc2VyaWFsaXplU2VyaWFsaXplZENvbmZpZ3VyYXRpb24sXG4gIGRlc2VyaWFsaXplSGlzdG9yeSA9IGhlbHBlcnMuZGVzZXJpYWxpemVIaXN0b3J5LFxuICBCQVNJQyA9IGNvbnN0YW50cy5TVEFURV9UWVBFUy5CQVNJQyxcbiAgQ09NUE9TSVRFID0gY29uc3RhbnRzLlNUQVRFX1RZUEVTLkNPTVBPU0lURSxcbiAgUEFSQUxMRUwgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuUEFSQUxMRUwsXG4gIEhJU1RPUlkgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuSElTVE9SWSxcbiAgSU5JVElBTCA9IGNvbnN0YW50cy5TVEFURV9UWVBFUy5JTklUSUFMLFxuICBGSU5BTCA9IGNvbnN0YW50cy5TVEFURV9UWVBFUy5GSU5BTCxcbiAgU0NYTUxfSU9QUk9DRVNTT1JfVFlQRSAgPSBjb25zdGFudHMuU0NYTUxfSU9QUk9DRVNTT1JfVFlQRTtcblxuY29uc3QgcHJpbnRUcmFjZSA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAhIXByb2Nlc3MuZW52LkRFQlVHO1xuXG5CYXNlSW50ZXJwcmV0ZXIuRVZFTlRTID0gW1xuICAnb25FbnRyeScsXG4gICdvbkV4aXQnLFxuICAnb25UcmFuc2l0aW9uJyxcbiAgJ29uRGVmYXVsdEVudHJ5JyxcbiAgJ29uRXJyb3InLFxuICAnb25CaWdTdGVwQmVnaW4nLFxuICAnb25CaWdTdGVwRW5kJyxcbiAgJ29uQmlnU3RlcFN1c3BlbmQnLFxuICAnb25CaWdTdGVwUmVzdW1lJyxcbiAgJ29uU21hbGxTdGVwQmVnaW4nLFxuICAnb25TbWFsbFN0ZXBFbmQnLFxuICAnb25CaWdTdGVwRW5kJyxcbiAgJ29uRXhpdEludGVycHJldGVyJ1xuXTtcblxuLyoqIFxuICogQGRlc2NyaXB0aW9uIFRoZSBTQ1hNTCBjb25zdHJ1Y3RvciBjcmVhdGVzIGFuIGludGVycHJldGVyIGluc3RhbmNlIGZyb20gYSBtb2RlbCBvYmplY3QuXG4gKiBAY2xhc3MgQmFzZUludGVycHJldGVyXG4gKiBAZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbiAqIEBwYXJhbSB7Rm5Nb2RlbH0gbW9kZWxPckZuR2VuZXJhdG9yXG4gKiBAcGFyYW0gb3B0c1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnNlc3Npb25pZF0gVXNlZCB0byBwb3B1bGF0ZSBTQ1hNTCBfc2Vzc2lvbmlkLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdHMuZ2VuZXJhdGVTZXNzaW9uaWRdIEZhY3RvcnkgdXNlZCB0byBnZW5lcmF0ZSBzZXNzaW9uaWQgaWYgc2Vzc2lvbmlkIGtleXdvcmQgaXMgbm90IHNwZWNpZmllZFxuICogQHBhcmFtIHtNYXA8c3RyaW5nLCBCYXNlSW50ZXJwcmV0ZXI+fSBbb3B0cy5zZXNzaW9uUmVnaXN0cnldIE1hcCB1c2VkIHRvIG1hcCBzZXNzaW9uaWQgc3RyaW5ncyB0byBTdGF0ZWNoYXJ0IGluc3RhbmNlcy5cbiAqIEBwYXJhbSBbb3B0cy5TZXRdIENsYXNzIHRvIHVzZSBhcyBhbiBBcnJheVNldC4gRGVmYXVsdHMgdG8gRVM2IFNldC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0cy5wYXJhbXNdICBVc2VkIHRvIHBhc3MgcGFyYW1zIGZyb20gaW52b2tlLiBTZXRzIHRoZSBkYXRhbW9kZWwgd2hlbiBpbnRlcnByZXRlciBpcyBpbnN0YW50aWF0ZWQuXG4gKiBAcGFyYW0ge1NuYXBzaG90fSBbb3B0cy5zbmFwc2hvdF0gU3RhdGUgbWFjaGluZSBzbmFwc2hvdC4gVXNlZCB0byByZXN0b3JlIGEgc2VyaWFsaXplZCBzdGF0ZSBtYWNoaW5lLlxuICogQHBhcmFtIHtTdGF0ZWNoYXJ0fSBbb3B0cy5wYXJlbnRTZXNzaW9uXSAgVXNlZCB0byBwYXNzIHBhcmVudCBzZXNzaW9uIGR1cmluZyBpbnZva2UuXG4gKiBAcGFyYW0ge3N0cmluZyB9W29wdHMuaW52b2tlaWRdICBTdXBwb3J0IGZvciBpZCBvZiBpbnZva2UgZWxlbWVudCBhdCBydW50aW1lLlxuICogQHBhcmFtIFtvcHRzLmNvbnNvbGVdXG4gKiBAcGFyYW0gW29wdHMudHJhbnNpdGlvblNlbGVjdG9yXVxuICogQHBhcmFtIFtvcHRzLmN1c3RvbUNhbmNlbF1cbiAqIEBwYXJhbSBbb3B0cy5jdXN0b21TZW5kXVxuICogQHBhcmFtIFtvcHRzLnNlbmRBc3luY11cbiAqIEBwYXJhbSBbb3B0cy5kb1NlbmRdXG4gKiBAcGFyYW0gW29wdHMuaW52b2tlcnNdXG4gKiBAcGFyYW0gW29wdHMueG1sUGFyc2VyXVxuICogQHBhcmFtIFtvcHRzLmludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dF1cbiAqL1xuZnVuY3Rpb24gQmFzZUludGVycHJldGVyKG1vZGVsT3JGbkdlbmVyYXRvciwgb3B0cyl7XG5cbiAgICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQgPSBvcHRzLmludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCB8fCAob3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgPyBuZXcgb3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQodGhpcykgOiB7fSk7IFxuXG5cbiAgICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgdGhpcy5vcHRzLmdlbmVyYXRlU2Vzc2lvbmlkID0gdGhpcy5vcHRzLmdlbmVyYXRlU2Vzc2lvbmlkIHx8IEJhc2VJbnRlcnByZXRlci5nZW5lcmF0ZVNlc3Npb25pZDtcbiAgICB0aGlzLm9wdHMuc2Vzc2lvbmlkID0gdGhpcy5vcHRzLnNlc3Npb25pZCB8fCB0aGlzLm9wdHMuZ2VuZXJhdGVTZXNzaW9uaWQoKTtcbiAgICB0aGlzLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5ID0gdGhpcy5vcHRzLnNlc3Npb25SZWdpc3RyeSB8fCBCYXNlSW50ZXJwcmV0ZXIuc2Vzc2lvblJlZ2lzdHJ5OyAgLy9UT0RPOiBkZWZpbmUgYSBiZXR0ZXIgaW50ZXJmYWNlLiBGb3Igbm93LCBhc3N1bWUgYSBNYXA8c2Vzc2lvbmlkLCBzZXNzaW9uPlxuXG5cbiAgICBsZXQgX2lvcHJvY2Vzc29ycyA9IHt9O1xuICAgIF9pb3Byb2Nlc3NvcnNbU0NYTUxfSU9QUk9DRVNTT1JfVFlQRV0gPSB7XG4gICAgICBsb2NhdGlvbiA6IGAjX3NjeG1sXyR7dGhpcy5vcHRzLnNlc3Npb25pZH1gXG4gICAgfVxuICAgIF9pb3Byb2Nlc3NvcnMuc2N4bWwgPSBfaW9wcm9jZXNzb3JzW1NDWE1MX0lPUFJPQ0VTU09SX1RZUEVdOyAgICAvL2FsaWFzXG5cbiAgICAvL1NDWE1MIHN5c3RlbSB2YXJpYWJsZXM6XG4gICAgb3B0cy5feCA9IHtcbiAgICAgICAgX3Nlc3Npb25pZCA6IG9wdHMuc2Vzc2lvbmlkLFxuICAgICAgICBfaW9wcm9jZXNzb3JzIDogX2lvcHJvY2Vzc29yc1xuICAgIH07XG5cblxuICAgIHZhciBtb2RlbDtcbiAgICBpZih0eXBlb2YgbW9kZWxPckZuR2VuZXJhdG9yID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgbW9kZWwgPSBpbml0aWFsaXplTW9kZWxHZW5lcmF0b3JGbihtb2RlbE9yRm5HZW5lcmF0b3IsIG9wdHMsIHRoaXMpO1xuICAgIH1lbHNlIGlmKHR5cGVvZiBtb2RlbE9yRm5HZW5lcmF0b3IgPT09ICdvYmplY3QnKXtcbiAgICAgICAgbW9kZWwgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1vZGVsT3JGbkdlbmVyYXRvcikpOyAvL2Fzc3VtZSBvYmplY3RcbiAgICB9ZWxzZXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIG1vZGVsIHR5cGUuIEV4cGVjdGVkIG1vZGVsIGZhY3RvcnkgZnVuY3Rpb24sIG9yIHNjanNvbiBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fbW9kZWwgPSBpbml0aWFsaXplTW9kZWwobW9kZWwpO1xuXG4gICAgdGhpcy5vcHRzLmNvbnNvbGUgPSBvcHRzLmNvbnNvbGUgfHwgKHR5cGVvZiBjb25zb2xlID09PSAndW5kZWZpbmVkJyA/IHtsb2cgOiBmdW5jdGlvbigpe319IDogY29uc29sZSk7ICAgLy9yZWx5IG9uIGdsb2JhbCBjb25zb2xlIGlmIHRoaXMgY29uc29sZSBpcyB1bmRlZmluZWRcbiAgICB0aGlzLm9wdHMuU2V0ID0gdGhpcy5vcHRzLlNldCB8fCBBcnJheVNldDtcbiAgICB0aGlzLm9wdHMudHJhbnNpdGlvblNlbGVjdG9yID0gdGhpcy5vcHRzLnRyYW5zaXRpb25TZWxlY3RvciB8fCBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvcjtcblxuICAgIHRoaXMub3B0cy5zZXNzaW9uUmVnaXN0cnkuc2V0KFN0cmluZyh0aGlzLm9wdHMuc2Vzc2lvbmlkKSwgdGhpcyk7XG5cbiAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LmxvZyA9IHRoaXMuX3NjcmlwdGluZ0NvbnRleHQubG9nIHx8IChmdW5jdGlvbiBsb2coKXsgXG4gICAgICBpZih0aGlzLm9wdHMuY29uc29sZS5sb2cuYXBwbHkpe1xuICAgICAgICB0aGlzLm9wdHMuY29uc29sZS5sb2cuYXBwbHkodGhpcy5vcHRzLmNvbnNvbGUsIGFyZ3VtZW50cyk7IFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyBvbiBvbGRlciBJRSBkb2VzIG5vdCBzdXBwb3J0IEZ1bmN0aW9uLmFwcGx5LCBzbyBqdXN0IHBhc3MgaGltIHRoZSBmaXJzdCBhcmd1bWVudC4gQmVzdCB3ZSBjYW4gZG8gZm9yIG5vdy5cbiAgICAgICAgdGhpcy5vcHRzLmNvbnNvbGUubG9nKEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpLmpvaW4oJywnKSk7IFxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7ICAgLy9zZXQgdXAgZGVmYXVsdCBzY3JpcHRpbmcgY29udGV4dCBsb2cgZnVuY3Rpb25cblxuICAgIHRoaXMuX2V4dGVybmFsRXZlbnRRdWV1ZSA9IFtdO1xuICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZSA9IFtdO1xuXG4gICAgaWYob3B0cy5wYXJhbXMpe1xuICAgICAgdGhpcy5fbW9kZWwuJGRlc2VyaWFsaXplRGF0YW1vZGVsKG9wdHMucGFyYW1zKTsgICAvL2xvYWQgdXAgdGhlIGRhdGFtb2RlbFxuICAgIH1cblxuICAgIC8vY2hlY2sgaWYgd2UncmUgbG9hZGluZyBmcm9tIGEgcHJldmlvdXMgc25hcHNob3RcbiAgICBpZihvcHRzLnNuYXBzaG90KXtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBuZXcgdGhpcy5vcHRzLlNldChkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uKG9wdHMuc25hcHNob3RbMF0sIHRoaXMuX21vZGVsLiRpZFRvU3RhdGVNYXApKTtcbiAgICAgIHRoaXMuX2hpc3RvcnlWYWx1ZSA9IGRlc2VyaWFsaXplSGlzdG9yeShvcHRzLnNuYXBzaG90WzFdLCB0aGlzLl9tb2RlbC4kaWRUb1N0YXRlTWFwKTsgXG4gICAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSA9IG9wdHMuc25hcHNob3RbMl07XG4gICAgICB0aGlzLl9tb2RlbC4kZGVzZXJpYWxpemVEYXRhbW9kZWwob3B0cy5zbmFwc2hvdFszXSk7ICAgLy9sb2FkIHVwIHRoZSBkYXRhbW9kZWxcbiAgICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZSA9IG9wdHMuc25hcHNob3RbNF07XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcbiAgICAgIHRoaXMuX2hpc3RvcnlWYWx1ZSA9IHt9O1xuICAgICAgdGhpcy5faXNJbkZpbmFsU3RhdGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvL2FkZCBkZWJ1ZyBsb2dnaW5nXG4gICAgQmFzZUludGVycHJldGVyLkVWRU5UUy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIHRoaXMub24oZXZlbnQsIHRoaXMuX2xvZy5iaW5kKHRoaXMsZXZlbnQpKTtcbiAgICB9LCB0aGlzKTtcbn1cblxuLy9zb21lIGdsb2JhbCBzaW5nbGV0b25zIHRvIHVzZSB0byBnZW5lcmF0ZSBpbi1tZW1vcnkgc2Vzc2lvbiBpZHMsIGluIGNhc2UgdGhlIHVzZXIgZG9lcyBub3Qgc3BlY2lmeSB0aGVzZSBkYXRhIHN0cnVjdHVyZXNcbkJhc2VJbnRlcnByZXRlci5zZXNzaW9uSWRDb3VudGVyID0gMTtcbkJhc2VJbnRlcnByZXRlci5nZW5lcmF0ZVNlc3Npb25pZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBCYXNlSW50ZXJwcmV0ZXIuc2Vzc2lvbklkQ291bnRlcisrO1xufVxuQmFzZUludGVycHJldGVyLnNlc3Npb25SZWdpc3RyeSA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBAaW50ZXJmYWNlIEV2ZW50RW1pdHRlclxuICovXG5cbi8qKlxuKiBAZXZlbnQgQmFzZUludGVycHJldGVyI29uRXJyb3JcbiogQHByb3BlcnR5IHtzdHJpbmd9IHRhZ25hbWUgVGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCBwcm9kdWNlZCB0aGUgZXJyb3IuIFxuKiBAcHJvcGVydHkge251bWJlcn0gbGluZSBUaGUgbGluZSBpbiB0aGUgc291cmNlIGZpbGUgaW4gd2hpY2ggdGhlIGVycm9yIG9jY3VycmVkLlxuKiBAcHJvcGVydHkge251bWJlcn0gY29sdW1uIFRoZSBjb2x1bW4gaW4gdGhlIHNvdXJjZSBmaWxlIGluIHdoaWNoIHRoZSBlcnJvciBvY2N1cnJlZC5cbiogQHByb3BlcnR5IHtzdHJpbmd9IHJlYXNvbiBBbiBpbmZvcm1hdGl2ZSBlcnJvciBtZXNzYWdlLiBUaGUgdGV4dCBpcyBwbGF0Zm9ybS1zcGVjaWZpYyBhbmQgc3ViamVjdCB0byBjaGFuZ2UuXG4qL1xuXG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBFdmVudEVtaXR0ZXIucHJvdG90eXBlI29uXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtjYWxsYmFja30gbGlzdGVuZXJcbiAqL1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSNvbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtjYWxsYmFja30gbGlzdGVuZXJcbiAqL1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSNvZmZcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBsaXN0ZW5lclxuICovXG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBFdmVudEVtaXR0ZXIucHJvdG90eXBlI2VtaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge2FueX0gYXJnc1xuICovXG5cbkJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgPSBleHRlbmQoYmVnZXQoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSkse1xuICBcbiAgICAvKiogXG4gICAgKiBDYW5jZWxzIHRoZSBzZXNzaW9uLiBUaGlzIGNsZWFycyBhbGwgdGltZXJzOyBwdXRzIHRoZSBpbnRlcnByZXRlciBpbiBhXG4gICAgKiBmaW5hbCBzdGF0ZTsgYW5kIHJ1bnMgYWxsIGV4aXQgYWN0aW9ucyBvbiBjdXJyZW50IHN0YXRlcy5cbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlXG4gICAgKi9cbiAgICBjYW5jZWwgOiBmdW5jdGlvbigpe1xuICAgICAgZGVsZXRlIHRoaXMub3B0cy5wYXJlbnRTZXNzaW9uO1xuICAgICAgaWYodGhpcy5faXNJbkZpbmFsU3RhdGUpIHJldHVybjtcbiAgICAgIHRoaXMuX2lzSW5GaW5hbFN0YXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2xvZyhgc2Vzc2lvbiBjYW5jZWxsZWQgJHt0aGlzLm9wdHMuaW52b2tlaWR9YCk7XG4gICAgICB0aGlzLl9leGl0SW50ZXJwcmV0ZXIobnVsbCk7XG4gICAgfSxcblxuICAgIF9leGl0SW50ZXJwcmV0ZXIgOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAvL1RPRE86IGNhbmNlbCBpbnZva2VkIHNlc3Npb25zXG4gICAgICAvL2NhbmNlbCBhbGwgZGVsYXllZCBzZW5kcyB3aGVuIHdlIGVudGVyIGludG8gYSBmaW5hbCBzdGF0ZS5cbiAgICAgIHRoaXMuX2NhbmNlbEFsbERlbGF5ZWRTZW5kcygpO1xuXG4gICAgICBsZXQgc3RhdGVzVG9FeGl0ID0gdGhpcy5fZ2V0RnVsbENvbmZpZ3VyYXRpb24oKS5zb3J0KGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkpO1xuXG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gc3RhdGVzVG9FeGl0Lmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgdmFyIHN0YXRlRXhpdGVkID0gc3RhdGVzVG9FeGl0W2pdO1xuXG4gICAgICAgICAgaWYoc3RhdGVFeGl0ZWQub25FeGl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgZXhpdElkeCA9IDAsIGV4aXRMZW4gPSBzdGF0ZUV4aXRlZC5vbkV4aXQubGVuZ3RoOyBleGl0SWR4IDwgZXhpdExlbjsgZXhpdElkeCsrKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBzdGF0ZUV4aXRlZC5vbkV4aXRbZXhpdElkeF07XG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBibG9ja0lkeCA9IDAsIGJsb2NrTGVuID0gYmxvY2subGVuZ3RoOyBibG9ja0lkeCA8IGJsb2NrTGVuOyBibG9ja0lkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGlvblJlZiA9IGJsb2NrW2Jsb2NrSWR4XTtcbiAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9jYW5jZWwgaW52b2tlZCBzZXNzaW9uXG4gICAgICAgICAgaWYoc3RhdGVFeGl0ZWQuaW52b2tlcykgc3RhdGVFeGl0ZWQuaW52b2tlcy5mb3JFYWNoKCBpbnZva2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5jYW5jZWxJbnZva2UoaW52b2tlLmlkKTtcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLy9pZiBoZSBpcyBhIHRvcC1sZXZlbCA8ZmluYWw+IHN0YXRlLCB0aGVuIHJldHVybiB0aGUgZG9uZSBldmVudFxuICAgICAgICAgIGlmKCBzdGF0ZUV4aXRlZC4kdHlwZSA9PT0gJ2ZpbmFsJyAmJlxuICAgICAgICAgICAgICBzdGF0ZUV4aXRlZC5wYXJlbnQuJHR5cGUgPT09ICdzY3htbCcpe1xuXG4gICAgICAgICAgICBpZih0aGlzLm9wdHMucGFyZW50U2Vzc2lvbil7XG4gICAgICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuc2VuZCh7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnI19wYXJlbnQnLCBcbiAgICAgICAgICAgICAgICBuYW1lOiAnZG9uZS5pbnZva2UuJyArIHRoaXMub3B0cy5pbnZva2VpZCxcbiAgICAgICAgICAgICAgICBkYXRhIDogc3RhdGVFeGl0ZWQuZG9uZWRhdGEgJiYgc3RhdGVFeGl0ZWQuZG9uZWRhdGEuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBldmVudClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub3B0cy5zZXNzaW9uUmVnaXN0cnkuZGVsZXRlKHRoaXMub3B0cy5zZXNzaW9uaWQpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdvbkV4aXRJbnRlcnByZXRlcicsIGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqIFxuICAgICAqIFN0YXJ0cyB0aGUgaW50ZXJwcmV0ZXIuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlLCBhbmQgc2hvdWxkIGJlIGNhbGxlZFxuICAgICAqIGJlZm9yZSBTdGF0ZWNoYXJ0LnByb3RvdHlwZSNnZW4gaXMgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZS4gIFJldHVybnMgYVxuICAgICAqIENvbmZpZ3VyYXRpb24uXG4gICAgICogQHJldHVybiB7Q29uZmlndXJhdGlvbn1cbiAgICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZVxuICAgICAqIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25FbnRyeVxuICAgICAqIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25FeGl0XG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvblRyYW5zaXRpb25cbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRGVmYXVsdEVudHJ5XG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkVycm9yXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBCZWdpblxuICAgICAqIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBTdXNwZW5kXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBSZXN1bWVcbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwQmVnaW5cbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwRW5kXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBFbmRcbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRXhpdEludGVycHJldGVyXG4gICAgICovXG4gICAgc3RhcnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5faW5pdFN0YXJ0KCk7XG4gICAgICAgIHRoaXMuX3BlcmZvcm1CaWdTdGVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGNhbGxiYWNrIGlzIGRpc3BsYXllZCBhcyBhIGdsb2JhbCBtZW1iZXIuXG4gICAgICogQGNhbGxiYWNrIGdlbkNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gICAgICogQHBhcmFtIHtDb25maWd1cmF0aW9ufSBjb25maWd1cmF0aW9uXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBTdGFydHMgdGhlIGludGVycHJldGVyIGFzeW5jaHJvbm91c2x5XG4gICAgICogQHBhcmFtICB7Z2VuQ2FsbGJhY2t9IGNiIENhbGxiYWNrIGludm9rZWQgd2l0aCBhbiBlcnJvciBvciB0aGUgaW50ZXJwcmV0ZXIncyBzdGFibGUgY29uZmlndXJhdGlvblxuICAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICAqIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25FbnRyeVxuICAgICAqIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25FeGl0XG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvblRyYW5zaXRpb25cbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRGVmYXVsdEVudHJ5XG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkVycm9yXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBCZWdpblxuICAgICAqIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBTdXNwZW5kXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBSZXN1bWVcbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwQmVnaW5cbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwRW5kXG4gICAgICogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBFbmRcbiAgICAgKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRXhpdEludGVycHJldGVyXG4gICAgICovXG4gICAgc3RhcnRBc3luYyA6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIGNiID0gdGhpcy5faW5pdFN0YXJ0KGNiKTtcbiAgICAgICAgdGhpcy5nZW5Bc3luYyhudWxsLCBjYik7XG4gICAgfSxcblxuICAgIF9pbml0U3RhcnQgOiBmdW5jdGlvbihjYil7XG4gICAgICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNiID0gbm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nKFwicGVyZm9ybWluZyBpbml0aWFsIGJpZyBzdGVwXCIpO1xuXG4gICAgICAgIC8vV2UgZWZmZWN0aXZlbHkgbmVlZCB0byBmaWd1cmUgb3V0IHN0YXRlcyB0byBlbnRlciBoZXJlIHRvIHBvcHVsYXRlIGluaXRpYWwgY29uZmlnLiBhc3N1bWluZyByb290IGlzIGNvbXBvdW5kIHN0YXRlIG1ha2VzIHRoaXMgc2ltcGxlLlxuICAgICAgICAvL2J1dCBpZiB3ZSB3YW50IGl0IHRvIGJlIHBhcmFsbGVsLCB0aGVuIHRoaXMgYmVjb21lcyBtb3JlIGNvbXBsZXguIHNvIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSBtb2RlbCwgd2UgYWRkIGEgJ2Zha2UnIHJvb3Qgc3RhdGUsIHdoaWNoXG4gICAgICAgIC8vbWFrZXMgdGhlIGZvbGxvd2luZyBvcGVyYXRpb24gc2FmZS5cbiAgICAgICAgdGhpcy5fbW9kZWwuaW5pdGlhbFJlZi5mb3JFYWNoKCBzID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24uYWRkKHMpICk7XG5cbiAgICAgICAgcmV0dXJuIGNiO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgKiBSZXR1cm5zIHN0YXRlIG1hY2hpbmUge0BsaW5rIENvbmZpZ3VyYXRpb259LlxuICAgICogQHJldHVybiB7Q29uZmlndXJhdGlvbn1cbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICovXG4gICAgZ2V0Q29uZmlndXJhdGlvbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkubWFwKGZ1bmN0aW9uKHMpe3JldHVybiBzLmlkO30pO1xuICAgIH0sXG5cbiAgICBfZ2V0RnVsbENvbmZpZ3VyYXRpb24gOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuXG4gICAgICAgICAgICAgICAgbWFwKGZ1bmN0aW9uKHMpeyByZXR1cm4gW3NdLmNvbmNhdChxdWVyeS5nZXRBbmNlc3RvcnMocykpO30sdGhpcykuXG4gICAgICAgICAgICAgICAgcmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuY29uY2F0KGIpO30sW10pLiAgICAvL2ZsYXR0ZW5cbiAgICAgICAgICAgICAgICByZWR1Y2UoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5pbmRleE9mKGIpID4gLTEgPyBhIDogYS5jb25jYXQoYik7fSxbXSk7IC8vdW5pcVxuICAgIH0sXG5cblxuICAgIC8qKiBcbiAgICAqIEByZXR1cm4ge0Z1bGxDb25maWd1cmF0aW9ufVxuICAgICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgXG4gICAgKi9cbiAgICBnZXRGdWxsQ29uZmlndXJhdGlvbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0RnVsbENvbmZpZ3VyYXRpb24oKS5tYXAoZnVuY3Rpb24ocyl7cmV0dXJuIHMuaWQ7fSk7XG4gICAgfSxcblxuXG4gICAgLyoqIFxuICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlTmFtZVxuICAgICovXG4gICAgaXNJbiA6IGZ1bmN0aW9uKHN0YXRlTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGdWxsQ29uZmlndXJhdGlvbigpLmluZGV4T2Yoc3RhdGVOYW1lKSA+IC0xO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgKiBJcyB0aGUgc3RhdGUgbWFjaGluZSBpbiBhIGZpbmFsIHN0YXRlP1xuICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICovXG4gICAgaXNGaW5hbCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNJbkZpbmFsU3RhdGU7XG4gICAgfSxcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIF9wZXJmb3JtQmlnU3RlcCA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRFdmVudCwga2VlcEdvaW5nLCBhbGxTdGF0ZXNFeGl0ZWQsIGFsbFN0YXRlc0VudGVyZWQ7XG4gICAgICAgIFthbGxTdGF0ZXNFeGl0ZWQsIGFsbFN0YXRlc0VudGVyZWQsIGtlZXBHb2luZywgY3VycmVudEV2ZW50XSA9IHRoaXMuX3N0YXJ0QmlnU3RlcChlKTtcblxuICAgICAgICB3aGlsZSAoa2VlcEdvaW5nKSB7XG4gICAgICAgICAgW2N1cnJlbnRFdmVudCwga2VlcEdvaW5nXSA9IHRoaXMuX3NlbGVjdFRyYW5zaXRpb25zQW5kUGVyZm9ybVNtYWxsU3RlcChjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9maW5pc2hCaWdTdGVwKGN1cnJlbnRFdmVudCwgYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkKTtcbiAgICB9LFxuXG4gICAgX3NlbGVjdFRyYW5zaXRpb25zQW5kUGVyZm9ybVNtYWxsU3RlcCA6IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkKXtcbiAgICAgICAgLy9maXJzdCBzZWxlY3Qgd2l0aCBudWxsIGV2ZW50XG4gICAgICAgIHZhciBzZWxlY3RlZFRyYW5zaXRpb25zICA9IHRoaXMuX3NlbGVjdFRyYW5zaXRpb25zKGN1cnJlbnRFdmVudCwgdHJ1ZSk7XG4gICAgICAgIGlmKHNlbGVjdGVkVHJhbnNpdGlvbnMuaXNFbXB0eSgpKXtcbiAgICAgICAgICBsZXQgZXYgPSB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUuc2hpZnQoKTtcbiAgICAgICAgICBpZihldil7IFxuICAgICAgICAgICAgY3VycmVudEV2ZW50ID0gZXY7XG4gICAgICAgICAgICBzZWxlY3RlZFRyYW5zaXRpb25zID0gdGhpcy5fc2VsZWN0VHJhbnNpdGlvbnMoY3VycmVudEV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXNlbGVjdGVkVHJhbnNpdGlvbnMuaXNFbXB0eSgpKXtcbiAgICAgICAgICB0aGlzLmVtaXQoJ29uU21hbGxTdGVwQmVnaW4nLCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgIGxldCBzdGF0ZXNFeGl0ZWQsIHN0YXRlc0VudGVyZWQ7XG4gICAgICAgICAgW3N0YXRlc0V4aXRlZCwgc3RhdGVzRW50ZXJlZF0gPSB0aGlzLl9wZXJmb3JtU21hbGxTdGVwKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9ucyk7XG4gICAgICAgICAgaWYoc3RhdGVzRXhpdGVkKSBzdGF0ZXNFeGl0ZWQuZm9yRWFjaCggcyA9PiBhbGxTdGF0ZXNFeGl0ZWQuYWRkKHMpICk7XG4gICAgICAgICAgaWYoc3RhdGVzRW50ZXJlZCkgc3RhdGVzRW50ZXJlZC5mb3JFYWNoKCBzID0+IGFsbFN0YXRlc0VudGVyZWQuYWRkKHMpICk7XG4gICAgICAgICAgdGhpcy5lbWl0KCdvblNtYWxsU3RlcEVuZCcsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGtlZXBHb2luZyA9ICFzZWxlY3RlZFRyYW5zaXRpb25zLmlzRW1wdHkoKSB8fCB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUubGVuZ3RoO1xuICAgICAgICByZXR1cm4gW2N1cnJlbnRFdmVudCwga2VlcEdvaW5nXTtcbiAgICB9LFxuXG4gICAgX3N0YXJ0QmlnU3RlcCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB0aGlzLmVtaXQoJ29uQmlnU3RlcEJlZ2luJywgZSk7XG5cbiAgICAgICAgLy9kbyBhcHBseUZpbmFsaXplIGFuZCBhdXRvZm9yd2FyZFxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLml0ZXIoKS5mb3JFYWNoKHN0YXRlID0+IHtcbiAgICAgICAgICBpZihzdGF0ZS5pbnZva2VzKSBzdGF0ZS5pbnZva2VzLmZvckVhY2goIGludm9rZSA9PiAge1xuICAgICAgICAgICAgaWYoaW52b2tlLmF1dG9mb3J3YXJkKXtcbiAgICAgICAgICAgICAgLy9hdXRvZm9yd2FyZFxuICAgICAgICAgICAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LnNlbmQoe1xuICAgICAgICAgICAgICAgIHRhcmdldDogYCNfJHtpbnZva2UuaWR9YCwgXG4gICAgICAgICAgICAgICAgbmFtZTogZS5uYW1lLFxuICAgICAgICAgICAgICAgIGRhdGEgOiBlLmRhdGFcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihpbnZva2UuaWQgPT09IGUuaW52b2tlaWQpe1xuICAgICAgICAgICAgICAvL2FwcGx5RmluYWxpemVcbiAgICAgICAgICAgICAgaWYoaW52b2tlLmZpbmFsaXplKSBpbnZva2UuZmluYWxpemUuZm9yRWFjaCggYWN0aW9uID0+ICB0aGlzLl9ldmFsdWF0ZUFjdGlvbihlLCBhY3Rpb24pKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7IFxuXG4gICAgICAgIGlmIChlKSB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUucHVzaChlKTtcblxuICAgICAgICBsZXQgYWxsU3RhdGVzRXhpdGVkID0gbmV3IFNldCgpLCBhbGxTdGF0ZXNFbnRlcmVkID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQga2VlcEdvaW5nID0gdHJ1ZTtcbiAgICAgICAgbGV0IGN1cnJlbnRFdmVudCA9IGU7XG4gICAgICAgIHJldHVybiBbYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkLCBrZWVwR29pbmcsIGN1cnJlbnRFdmVudF07XG4gICAgfSxcblxuICAgIF9maW5pc2hCaWdTdGVwIDogZnVuY3Rpb24oZSwgYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkLCBjYil7XG4gICAgICAgIGxldCBzdGF0ZXNUb0ludm9rZSA9IEFycmF5LmZyb20obmV3IFNldChbLi4uYWxsU3RhdGVzRW50ZXJlZF0uZmlsdGVyKHMgPT4gcy5pbnZva2VzICYmICFhbGxTdGF0ZXNFeGl0ZWQuaGFzKHMpKSkpLnNvcnQoc29ydEluRW50cnlPcmRlcik7XG5cbiAgICAgICAgLy8gSGVyZSB3ZSBpbnZva2Ugd2hhdGV2ZXIgbmVlZHMgdG8gYmUgaW52b2tlZC4gVGhlIGltcGxlbWVudGF0aW9uIG9mICdpbnZva2UnIGlzIHBsYXRmb3JtLXNwZWNpZmljXG4gICAgICAgIHN0YXRlc1RvSW52b2tlLmZvckVhY2goIHMgPT4ge1xuICAgICAgICAgICAgcy5pbnZva2VzLmZvckVhY2goIGYgPT4gIHRoaXMuX2V2YWx1YXRlQWN0aW9uKGUsZikgKVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBjYW5jZWwgaW52b2tlIGZvciBhbGxTdGF0ZXNFeGl0ZWRcbiAgICAgICAgYWxsU3RhdGVzRXhpdGVkLmZvckVhY2goIHMgPT4ge1xuICAgICAgICAgIGlmKHMuaW52b2tlcykgcy5pbnZva2VzLmZvckVhY2goIGludm9rZSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LmNhbmNlbEludm9rZShpbnZva2UuaWQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRPRE86IEludm9raW5nIG1heSBoYXZlIHJhaXNlZCBpbnRlcm5hbCBlcnJvciBldmVudHMgYW5kIHdlIGl0ZXJhdGUgdG8gaGFuZGxlIHRoZW0gICAgICAgIFxuICAgICAgICAvL2lmIG5vdCBpbnRlcm5hbFF1ZXVlLmlzRW1wdHkoKTpcbiAgICAgICAgLy8gICAgY29udGludWVcblxuICAgICAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpLmV2ZXJ5KGZ1bmN0aW9uKHMpeyByZXR1cm4gcy50eXBlRW51bSA9PT0gRklOQUw7IH0pO1xuICAgICAgICBpZih0aGlzLl9pc0luRmluYWxTdGF0ZSl7XG4gICAgICAgICAgdGhpcy5fZXhpdEludGVycHJldGVyKGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdCgnb25CaWdTdGVwRW5kJyk7XG4gICAgICAgIGlmKGNiKSBjYih1bmRlZmluZWQsIHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpKTtcbiAgICB9LFxuXG4gICAgX2NhbmNlbEFsbERlbGF5ZWRTZW5kcyA6IGZ1bmN0aW9uKCl7XG4gICAgICBmb3IoIGxldCB0aW1lb3V0T3B0aW9ucyBvZiB0aGlzLl9zY3JpcHRpbmdDb250ZXh0Ll90aW1lb3V0cyl7XG4gICAgICAgIGlmKCF0aW1lb3V0T3B0aW9ucy5zZW5kT3B0aW9ucy5kZWxheSkgY29udGludWU7XG4gICAgICAgIHRoaXMuX2xvZygnY2FuY2VsbGluZyBkZWxheWVkIHNlbmQnLCB0aW1lb3V0T3B0aW9ucyk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0T3B0aW9ucy50aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5fdGltZW91dHMuZGVsZXRlKHRpbWVvdXRPcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuX3RpbWVvdXRNYXApLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuX3RpbWVvdXRNYXBba2V5XTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfcGVyZm9ybUJpZ1N0ZXBBc3luYyA6IGZ1bmN0aW9uKGUsIGNiKSB7XG4gICAgICAgIGxldCBjdXJyZW50RXZlbnQsIGtlZXBHb2luZywgYWxsU3RhdGVzRXhpdGVkLCBhbGxTdGF0ZXNFbnRlcmVkO1xuICAgICAgICBbYWxsU3RhdGVzRXhpdGVkLCBhbGxTdGF0ZXNFbnRlcmVkLCBrZWVwR29pbmcsIGN1cnJlbnRFdmVudF0gPSB0aGlzLl9zdGFydEJpZ1N0ZXAoZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gbmV4dFN0ZXAoZW1pdCl7XG4gICAgICAgICAgdGhpcy5lbWl0KGVtaXQpO1xuICAgICAgICAgIFtjdXJyZW50RXZlbnQsIGtlZXBHb2luZ10gPSB0aGlzLl9zZWxlY3RUcmFuc2l0aW9uc0FuZFBlcmZvcm1TbWFsbFN0ZXAoY3VycmVudEV2ZW50LCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQpO1xuXG4gICAgICAgICAgaWYoa2VlcEdvaW5nKXtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25CaWdTdGVwU3VzcGVuZCcpO1xuICAgICAgICAgICAgc2V0SW1tZWRpYXRlKG5leHRTdGVwLmJpbmQodGhpcyksJ29uQmlnU3RlcFJlc3VtZScpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5fZmluaXNoQmlnU3RlcChjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCwgY2IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBuZXh0U3RlcC5jYWxsKHRoaXMsJ29uQmlnU3RlcEJlZ2luJyk7XG4gICAgfSxcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIF9wZXJmb3JtU21hbGxTdGVwIDogZnVuY3Rpb24oY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zKSB7XG5cbiAgICAgICAgdGhpcy5fbG9nKFwic2VsZWN0aW5nIHRyYW5zaXRpb25zIHdpdGggY3VycmVudEV2ZW50XCIsIGN1cnJlbnRFdmVudCk7XG5cbiAgICAgICAgdGhpcy5fbG9nKFwic2VsZWN0ZWQgdHJhbnNpdGlvbnNcIiwgc2VsZWN0ZWRUcmFuc2l0aW9ucyk7XG5cbiAgICAgICAgbGV0IHN0YXRlc0V4aXRlZCxcbiAgICAgICAgICAgIHN0YXRlc0VudGVyZWQ7XG5cbiAgICAgICAgaWYgKCFzZWxlY3RlZFRyYW5zaXRpb25zLmlzRW1wdHkoKSkge1xuXG4gICAgICAgICAgICAvL3dlIG9ubHkgd2FudCB0byBlbnRlciBhbmQgZXhpdCBzdGF0ZXMgZnJvbSB0cmFuc2l0aW9ucyB3aXRoIHRhcmdldHNcbiAgICAgICAgICAgIC8vZmlsdGVyIG91dCB0YXJnZXRsZXNzIHRyYW5zaXRpb25zIGhlcmUgLSB3ZSB3aWxsIG9ubHkgdXNlIHRoZXNlIHRvIGV4ZWN1dGUgdHJhbnNpdGlvbiBhY3Rpb25zXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzID0gbmV3IHRoaXMub3B0cy5TZXQoc2VsZWN0ZWRUcmFuc2l0aW9ucy5pdGVyKCkuZmlsdGVyKHRyYW5zaXRpb25XaXRoVGFyZ2V0cykpO1xuXG4gICAgICAgICAgICBzdGF0ZXNFeGl0ZWQgPSB0aGlzLl9leGl0U3RhdGVzKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKVxuICAgICAgICAgICAgdGhpcy5fZXhlY3V0ZVRyYW5zaXRpb25zKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9ucyk7XG4gICAgICAgICAgICBzdGF0ZXNFbnRlcmVkID0gdGhpcy5fZW50ZXJTdGF0ZXMoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMpXG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcIm5ldyBjb25maWd1cmF0aW9uIFwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbc3RhdGVzRXhpdGVkLCBzdGF0ZXNFbnRlcmVkXTtcbiAgICB9LFxuXG4gICAgX2V4aXRTdGF0ZXMgOiBmdW5jdGlvbihjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cyl7XG4gICAgICAgIGxldCBiYXNpY1N0YXRlc0V4aXRlZCwgc3RhdGVzRXhpdGVkO1xuICAgICAgICBbYmFzaWNTdGF0ZXNFeGl0ZWQsIHN0YXRlc0V4aXRlZF0gPSB0aGlzLl9nZXRTdGF0ZXNFeGl0ZWQoc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKTsgXG5cbiAgICAgICAgdGhpcy5fbG9nKCdleGl0aW5nIHN0YXRlcycpXG4gICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZXNFeGl0ZWQubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZUV4aXRlZCA9IHN0YXRlc0V4aXRlZFtqXTtcblxuICAgICAgICAgICAgaWYoc3RhdGVFeGl0ZWQuaXNBdG9taWMpIHRoaXMuX2NvbmZpZ3VyYXRpb24ucmVtb3ZlKHN0YXRlRXhpdGVkKTtcblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiZXhpdGluZyBcIiwgc3RhdGVFeGl0ZWQuaWQpO1xuXG4gICAgICAgICAgICAvL2ludm9rZSBsaXN0ZW5lcnNcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25FeGl0JyxzdGF0ZUV4aXRlZC5pZClcblxuICAgICAgICAgICAgaWYoc3RhdGVFeGl0ZWQub25FeGl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBleGl0SWR4ID0gMCwgZXhpdExlbiA9IHN0YXRlRXhpdGVkLm9uRXhpdC5sZW5ndGg7IGV4aXRJZHggPCBleGl0TGVuOyBleGl0SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gc3RhdGVFeGl0ZWQub25FeGl0W2V4aXRJZHhdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBibG9ja0lkeCA9IDAsIGJsb2NrTGVuID0gYmxvY2subGVuZ3RoOyBibG9ja0lkeCA8IGJsb2NrTGVuOyBibG9ja0lkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uUmVmID0gYmxvY2tbYmxvY2tJZHhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgY3VycmVudEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGY7XG4gICAgICAgICAgICBpZiAoc3RhdGVFeGl0ZWQuaGlzdG9yeVJlZikge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaGlzdG9yeVJlZiBvZiBzdGF0ZUV4aXRlZC5oaXN0b3J5UmVmKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpc3RvcnlSZWYuaXNEZWVwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gZnVuY3Rpb24oczApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gczAudHlwZUVudW0gPT09IEJBU0lDICYmIHN0YXRlRXhpdGVkLmRlc2NlbmRhbnRzLmluZGV4T2YoczApID4gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKHMwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMwLnBhcmVudCA9PT0gc3RhdGVFeGl0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIGhpc3RvcnlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeVZhbHVlW2hpc3RvcnlSZWYuaWRdID0gc3RhdGVzRXhpdGVkLmZpbHRlcihmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdGVzRXhpdGVkO1xuICAgIH0sXG5cbiAgICBfZXhlY3V0ZVRyYW5zaXRpb25zIDogZnVuY3Rpb24oY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zKXtcbiAgICAgICAgdmFyIHNvcnRlZFRyYW5zaXRpb25zID0gc2VsZWN0ZWRUcmFuc2l0aW9ucy5pdGVyKCkuc29ydCh0cmFuc2l0aW9uQ29tcGFyYXRvcik7XG5cbiAgICAgICAgdGhpcy5fbG9nKFwiZXhlY3V0aW5nIHRyYW5zaXRpdGlvbiBhY3Rpb25zXCIpO1xuICAgICAgICBmb3IgKHZhciBzdHhJZHggPSAwLCBsZW4gPSBzb3J0ZWRUcmFuc2l0aW9ucy5sZW5ndGg7IHN0eElkeCA8IGxlbjsgc3R4SWR4KyspIHtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gc29ydGVkVHJhbnNpdGlvbnNbc3R4SWR4XTtcblxuICAgICAgICAgICAgdmFyIHRhcmdldElkcyA9IHRyYW5zaXRpb24udGFyZ2V0cyAmJiB0cmFuc2l0aW9uLnRhcmdldHMubWFwKGZ1bmN0aW9uKHRhcmdldCl7cmV0dXJuIHRhcmdldC5pZDt9KTtcblxuICAgICAgICAgICAgdGhpcy5lbWl0KCdvblRyYW5zaXRpb24nLHRyYW5zaXRpb24uc291cmNlLmlkLHRhcmdldElkcywgdHJhbnNpdGlvbi5zb3VyY2UudHJhbnNpdGlvbnMuaW5kZXhPZih0cmFuc2l0aW9uKSk7XG5cbiAgICAgICAgICAgIGlmKHRyYW5zaXRpb24ub25UcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0eElkeCA9IDAsIHR4TGVuID0gdHJhbnNpdGlvbi5vblRyYW5zaXRpb24ubGVuZ3RoOyB0eElkeCA8IHR4TGVuOyB0eElkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvblt0eElkeF07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgY3VycmVudEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICB9LFxuXG4gICAgX2VudGVyU3RhdGVzIDogZnVuY3Rpb24oY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMpe1xuICAgICAgICB0aGlzLl9sb2coXCJlbnRlcmluZyBzdGF0ZXNcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlc0VudGVyZWQgPSBuZXcgU2V0KCk7XG4gICAgICAgIGxldCBzdGF0ZXNGb3JEZWZhdWx0RW50cnkgPSBuZXcgU2V0KCk7XG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIHRlbXBvcmFyeSB0YWJsZSBmb3IgZGVmYXVsdCBjb250ZW50IGluIGhpc3Rvcnkgc3RhdGVzXG4gICAgICAgIGxldCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQgPSB7fTtcbiAgICAgICAgdGhpcy5fY29tcHV0ZUVudHJ5U2V0KHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cywgc3RhdGVzRW50ZXJlZCwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpOyBcbiAgICAgICAgc3RhdGVzRW50ZXJlZCA9IFsuLi5zdGF0ZXNFbnRlcmVkXS5zb3J0KHNvcnRJbkVudHJ5T3JkZXIpOyBcblxuICAgICAgICB0aGlzLl9sb2coXCJzdGF0ZXNFbnRlcmVkIFwiLCBzdGF0ZXNFbnRlcmVkKTtcblxuICAgICAgICBmb3IgKHZhciBlbnRlcklkeCA9IDAsIGVudGVyTGVuID0gc3RhdGVzRW50ZXJlZC5sZW5ndGg7IGVudGVySWR4IDwgZW50ZXJMZW47IGVudGVySWR4KyspIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZUVudGVyZWQgPSBzdGF0ZXNFbnRlcmVkW2VudGVySWR4XTtcblxuICAgICAgICAgICAgaWYoc3RhdGVFbnRlcmVkLmlzQXRvbWljKSB0aGlzLl9jb25maWd1cmF0aW9uLmFkZChzdGF0ZUVudGVyZWQpO1xuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJlbnRlcmluZ1wiLCBzdGF0ZUVudGVyZWQuaWQpO1xuXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ29uRW50cnknLHN0YXRlRW50ZXJlZC5pZCk7XG5cbiAgICAgICAgICAgIGlmKHN0YXRlRW50ZXJlZC5vbkVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBlbnRyeUlkeCA9IDAsIGVudHJ5TGVuID0gc3RhdGVFbnRlcmVkLm9uRW50cnkubGVuZ3RoOyBlbnRyeUlkeCA8IGVudHJ5TGVuOyBlbnRyeUlkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHN0YXRlRW50ZXJlZC5vbkVudHJ5W2VudHJ5SWR4XTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYmxvY2tJZHggPSAwLCBibG9ja0xlbiA9IGJsb2NrLmxlbmd0aDsgYmxvY2tJZHggPCBibG9ja0xlbjsgYmxvY2tJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGlvblJlZiA9IGJsb2NrW2Jsb2NrSWR4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHN0YXRlc0ZvckRlZmF1bHRFbnRyeS5oYXMoc3RhdGVFbnRlcmVkKSl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpbml0aWFsU3RhdGUgb2Ygc3RhdGVFbnRlcmVkLmluaXRpYWxSZWYpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ29uRGVmYXVsdEVudHJ5JywgaW5pdGlhbFN0YXRlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaW5pdGlhbFN0YXRlLnR5cGVFbnVtID09PSBJTklUSUFMKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2l0aW9uID0gaW5pdGlhbFN0YXRlLnRyYW5zaXRpb25zWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nKCdleGVjdXRpbmcgaW5pdGlhbCB0cmFuc2l0aW9uIGNvbnRlbnQgZm9yIGluaXRpYWwgc3RhdGUgb2YgcGFyZW50IHN0YXRlJyxzdGF0ZUVudGVyZWQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbi5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGlvblJlZiA9IHRyYW5zaXRpb24ub25UcmFuc2l0aW9uW3R4SWR4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmKGRlZmF1bHRIaXN0b3J5Q29udGVudFtzdGF0ZUVudGVyZWQuaWRdKXtcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNpdGlvbiA9IGRlZmF1bHRIaXN0b3J5Q29udGVudFtzdGF0ZUVudGVyZWQuaWRdXG4gICAgICAgICAgICAgICAgaWYodHJhbnNpdGlvbi5vblRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2coJ2V4ZWN1dGluZyBoaXN0b3J5IHRyYW5zaXRpb24gY29udGVudCBmb3IgaGlzdG9yeSBzdGF0ZSBvZiBwYXJlbnQgc3RhdGUnLHN0YXRlRW50ZXJlZC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbi5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvblt0eElkeF07XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgZW50ZXJJZHggPSAwLCBlbnRlckxlbiA9IHN0YXRlc0VudGVyZWQubGVuZ3RoOyBlbnRlcklkeCA8IGVudGVyTGVuOyBlbnRlcklkeCsrKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGVFbnRlcmVkID0gc3RhdGVzRW50ZXJlZFtlbnRlcklkeF07XG4gICAgICAgICAgICBpZihzdGF0ZUVudGVyZWQudHlwZUVudW0gPT09IEZJTkFMKXtcbiAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHN0YXRlRW50ZXJlZC5wYXJlbnQ7XG4gICAgICAgICAgICAgIGxldCBncmFuZHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKHtuYW1lIDogXCJkb25lLnN0YXRlLlwiICsgcGFyZW50LmlkLCBkYXRhIDogc3RhdGVFbnRlcmVkLmRvbmVkYXRhICYmIHN0YXRlRW50ZXJlZC5kb25lZGF0YS5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCl9KTtcbiAgICAgICAgICAgICAgaWYoZ3JhbmRwYXJlbnQgJiYgZ3JhbmRwYXJlbnQudHlwZUVudW0gPT09IFBBUkFMTEVMKXtcbiAgICAgICAgICAgICAgICAgIGlmKGdyYW5kcGFyZW50LnN0YXRlcy5ldmVyeShzID0+IHRoaXMuaXNJbkZpbmFsU3RhdGUocykgKSl7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLnB1c2goe25hbWUgOiBcImRvbmUuc3RhdGUuXCIgKyBncmFuZHBhcmVudC5pZH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdGVzRW50ZXJlZDtcbiAgICB9LFxuXG4gICAgaXNJbkZpbmFsU3RhdGUgOiBmdW5jdGlvbihzKXtcbiAgICAgICAgaWYocy50eXBlRW51bSA9PT0gQ09NUE9TSVRFKXtcbiAgICAgICAgICAgIHJldHVybiBzLnN0YXRlcy5zb21lKHMgPT4gcy50eXBlRW51bSA9PT0gRklOQUwgJiYgdGhpcy5fY29uZmlndXJhdGlvbi5jb250YWlucyhzKSk7XG4gICAgICAgIH1lbHNlIGlmKHMudHlwZUVudW0gPT09IFBBUkFMTEVMKXtcbiAgICAgICAgICAgIHJldHVybiBzLnN0YXRlcy5ldmVyeSh0aGlzLmlzSW5GaW5hbFN0YXRlLmJpbmQodGhpcykpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgX2V2YWx1YXRlQWN0aW9uIDogZnVuY3Rpb24oY3VycmVudEV2ZW50LCBhY3Rpb25SZWYpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgY3VycmVudEV2ZW50KTsgICAgIC8vU0NYTUwgc3lzdGVtIHZhcmlhYmxlc1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVFcnJvciA6IGZ1bmN0aW9uKGUsIGFjdGlvblJlZil7XG4gICAgICBsZXQgZXZlbnQgPSBcbiAgICAgICAgZSBpbnN0YW5jZW9mIEVycm9yIHx8ICh0eXBlb2YgZS5fX3Byb3RvX18ubmFtZSA9PT0gJ3N0cmluZycgJiYgZS5fX3Byb3RvX18ubmFtZS5tYXRjaCgvXi4qRXJyb3IkLykpID8gIC8vd2UgY2FuJ3QganVzdCBkbyAnZSBpbnN0YW5jZW9mIEVycm9yJywgYmVjYXVzZSB0aGUgRXJyb3Igb2JqZWN0IGluIHRoZSBzYW5kYm94IGlzIGZyb20gYSBkaWZmZXJlbnQgY29udGV4dCwgYW5kIGluc3RhbmNlb2Ygd2lsbCByZXR1cm4gZmFsc2VcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOidlcnJvci5leGVjdXRpb24nLFxuICAgICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgICAgdGFnbmFtZTogYWN0aW9uUmVmLnRhZ25hbWUsIFxuICAgICAgICAgICAgICBsaW5lOiBhY3Rpb25SZWYubGluZSwgXG4gICAgICAgICAgICAgIGNvbHVtbjogYWN0aW9uUmVmLmNvbHVtbixcbiAgICAgICAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlIDogJ3BsYXRmb3JtJ1xuICAgICAgICAgIH0gOiBcbiAgICAgICAgICAoZS5uYW1lID8gXG4gICAgICAgICAgICBlIDogXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6J2Vycm9yLmV4ZWN1dGlvbicsXG4gICAgICAgICAgICAgIGRhdGE6ZSxcbiAgICAgICAgICAgICAgdHlwZSA6ICdwbGF0Zm9ybSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLnB1c2goZXZlbnQpO1xuICAgICAgdGhpcy5lbWl0KCdvbkVycm9yJywgZXZlbnQpO1xuICAgIH0sXG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICBfZ2V0U3RhdGVzRXhpdGVkIDogZnVuY3Rpb24odHJhbnNpdGlvbnMpIHtcbiAgICAgICAgdmFyIHN0YXRlc0V4aXRlZCA9IG5ldyB0aGlzLm9wdHMuU2V0KCk7XG4gICAgICAgIHZhciBiYXNpY1N0YXRlc0V4aXRlZCA9IG5ldyB0aGlzLm9wdHMuU2V0KCk7XG5cbiAgICAgICAgLy9TdGF0ZXMgZXhpdGVkIGFyZSBkZWZpbmVkIHRvIGJlIGFjdGl2ZSBzdGF0ZXMgdGhhdCBhcmVcbiAgICAgICAgLy9kZXNjZW5kYW50cyBvZiB0aGUgc2NvcGUgb2YgZWFjaCBwcmlvcml0eS1lbmFibGVkIHRyYW5zaXRpb24uXG4gICAgICAgIC8vSGVyZSwgd2UgaXRlcmF0ZSB0aHJvdWdoIHRoZSB0cmFuc2l0aW9ucywgYW5kIGNvbGxlY3Qgc3RhdGVzXG4gICAgICAgIC8vdGhhdCBtYXRjaCB0aGlzIGNvbmRpdGlvbi4gXG4gICAgICAgIHZhciB0cmFuc2l0aW9uTGlzdCA9IHRyYW5zaXRpb25zLml0ZXIoKTtcbiAgICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCB0eExlbiA9IHRyYW5zaXRpb25MaXN0Lmxlbmd0aDsgdHhJZHggPCB0eExlbjsgdHhJZHgrKykge1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uTGlzdFt0eElkeF07XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0cmFuc2l0aW9uLnNjb3BlLFxuICAgICAgICAgICAgICAgIGRlc2MgPSBzY29wZS5kZXNjZW5kYW50cztcblxuICAgICAgICAgICAgLy9Gb3IgZWFjaCBzdGF0ZSBpbiB0aGUgY29uZmlndXJhdGlvblxuICAgICAgICAgICAgLy9pcyB0aGF0IHN0YXRlIGEgZGVzY2VuZGFudCBvZiB0aGUgdHJhbnNpdGlvbiBzY29wZT9cbiAgICAgICAgICAgIC8vU3RvcmUgYW5jZXN0b3JzIG9mIHRoYXQgc3RhdGUgdXAgdG8gYnV0IG5vdCBpbmNsdWRpbmcgdGhlIHNjb3BlLlxuICAgICAgICAgICAgdmFyIGNvbmZpZ0xpc3QgPSB0aGlzLl9jb25maWd1cmF0aW9uLml0ZXIoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGNmZ0lkeCA9IDAsIGNmZ0xlbiA9IGNvbmZpZ0xpc3QubGVuZ3RoOyBjZmdJZHggPCBjZmdMZW47IGNmZ0lkeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gY29uZmlnTGlzdFtjZmdJZHhdO1xuICAgICAgICAgICAgICAgIGlmKGRlc2MuaW5kZXhPZihzdGF0ZSkgPiAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGJhc2ljU3RhdGVzRXhpdGVkLmFkZChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlc0V4aXRlZC5hZGQoc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5jZXN0b3JzID0gcXVlcnkuZ2V0QW5jZXN0b3JzKHN0YXRlLHNjb3BlKTsgXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGFuY0lkeCA9IDAsIGFuY0xlbiA9IGFuY2VzdG9ycy5sZW5ndGg7IGFuY0lkeCA8IGFuY0xlbjsgYW5jSWR4KyspIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZXNFeGl0ZWQuYWRkKGFuY2VzdG9yc1thbmNJZHhdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzb3J0ZWRTdGF0ZXNFeGl0ZWQgPSBzdGF0ZXNFeGl0ZWQuaXRlcigpLnNvcnQoZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSk7XG4gICAgICAgIHJldHVybiBbYmFzaWNTdGF0ZXNFeGl0ZWQsIHNvcnRlZFN0YXRlc0V4aXRlZF07XG4gICAgfSxcblxuICAgIF9jb21wdXRlRW50cnlTZXQgOiBmdW5jdGlvbih0cmFuc2l0aW9ucywgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpe1xuICAgICAgZm9yKGxldCB0IG9mIHRyYW5zaXRpb25zLml0ZXIoKSl7XG4gICAgICAgICAgZm9yKGxldCBzIG9mIHQudGFyZ2V0cyl7XG4gICAgICAgICAgICAgIHRoaXMuX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyKHMsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpIFxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgYW5jZXN0b3IgPSB0LnNjb3BlO1xuICAgICAgICAgIGZvcihsZXQgcyBvZiB0aGlzLl9nZXRFZmZlY3RpdmVUYXJnZXRTdGF0ZXModCkpe1xuICAgICAgICAgICAgICB0aGlzLl9hZGRBbmNlc3RvclN0YXRlc1RvRW50ZXIocywgYW5jZXN0b3IsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldEVmZmVjdGl2ZVRhcmdldFN0YXRlcyA6IGZ1bmN0aW9uKHRyYW5zaXRpb24pe1xuICAgICAgbGV0IHRhcmdldHMgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IobGV0IHMgb2YgdHJhbnNpdGlvbi50YXJnZXRzKXtcbiAgICAgICAgICBpZihzLnR5cGVFbnVtID09PSBISVNUT1JZKXtcbiAgICAgICAgICAgICAgaWYocy5pZCBpbiB0aGlzLl9oaXN0b3J5VmFsdWUpXG4gICAgICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5VmFsdWVbcy5pZF0uZm9yRWFjaCggc3RhdGUgPT4gdGFyZ2V0cy5hZGQoc3RhdGUpKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBbLi4udGhpcy5fZ2V0RWZmZWN0aXZlVGFyZ2V0U3RhdGVzKHMudHJhbnNpdGlvbnNbMF0pXS5mb3JFYWNoKCBzdGF0ZSA9PiB0YXJnZXRzLmFkZChzdGF0ZSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0cy5hZGQocylcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0c1xuICAgIH0sXG5cbiAgICBfYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIgOiBmdW5jdGlvbihzdGF0ZSxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCl7XG4gICAgICBpZihzdGF0ZS50eXBlRW51bSA9PT0gSElTVE9SWSl7XG4gICAgICAgICAgaWYodGhpcy5faGlzdG9yeVZhbHVlW3N0YXRlLmlkXSl7XG4gICAgICAgICAgICAgIGZvcihsZXQgcyBvZiB0aGlzLl9oaXN0b3J5VmFsdWVbc3RhdGUuaWRdKVxuICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIocyxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGZvcihsZXQgcyBvZiB0aGlzLl9oaXN0b3J5VmFsdWVbc3RhdGUuaWRdKVxuICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkQW5jZXN0b3JTdGF0ZXNUb0VudGVyKHMsIHN0YXRlLnBhcmVudCwgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmF1bHRIaXN0b3J5Q29udGVudFtzdGF0ZS5wYXJlbnQuaWRdID0gc3RhdGUudHJhbnNpdGlvbnNbMF1cbiAgICAgICAgICAgIGZvcihsZXQgcyBvZiBzdGF0ZS50cmFuc2l0aW9uc1swXS50YXJnZXRzKVxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyKHMsc3RhdGVzVG9FbnRlcixzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yKGxldCBzIG9mIHN0YXRlLnRyYW5zaXRpb25zWzBdLnRhcmdldHMpXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkQW5jZXN0b3JTdGF0ZXNUb0VudGVyKHMsIHN0YXRlLnBhcmVudCwgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0YXRlc1RvRW50ZXIuYWRkKHN0YXRlKVxuICAgICAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBDT01QT1NJVEUpe1xuICAgICAgICAgICAgICBzdGF0ZXNGb3JEZWZhdWx0RW50cnkuYWRkKHN0YXRlKVxuICAgICAgICAgICAgICAvL2ZvciBlYWNoIHN0YXRlIGluIGluaXRpYWxSZWYsIGlmIGl0IGlzIGFuIGluaXRpYWwgc3RhdGUsIHRoZW4gYWRkIGFuY2VzdG9ycyBhbmQgZGVzY2VuZGFudHMuXG4gICAgICAgICAgICAgIGZvcihsZXQgcyBvZiBzdGF0ZS5pbml0aWFsUmVmKXtcbiAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXRzID0gcy50eXBlRW51bSA9PT0gSU5JVElBTCA/IHMudHJhbnNpdGlvbnNbMF0udGFyZ2V0cyA6IFtzXTsgXG4gICAgICAgICAgICAgICAgICBmb3IobGV0IHRhcmdldFN0YXRlIG9mIHRhcmdldHMpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcih0YXJnZXRTdGF0ZSxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3IobGV0IHMgb2Ygc3RhdGUuaW5pdGlhbFJlZil7XG4gICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0cyA9IHMudHlwZUVudW0gPT09IElOSVRJQUwgPyBzLnRyYW5zaXRpb25zWzBdLnRhcmdldHMgOiBbc107IFxuICAgICAgICAgICAgICAgICAgZm9yKGxldCB0YXJnZXRTdGF0ZSBvZiB0YXJnZXRzKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkQW5jZXN0b3JTdGF0ZXNUb0VudGVyKHRhcmdldFN0YXRlLCBzdGF0ZSwgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgaWYoc3RhdGUudHlwZUVudW0gPT09IFBBUkFMTEVMKXtcbiAgICAgICAgICAgICAgICAgIGZvcihsZXQgY2hpbGQgb2Ygc3RhdGUuc3RhdGVzKXtcbiAgICAgICAgICAgICAgICAgICAgICBpZighWy4uLnN0YXRlc1RvRW50ZXJdLnNvbWUocyA9PiBxdWVyeS5pc0Rlc2NlbmRhbnQocywgY2hpbGQpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyKGNoaWxkLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KSBcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9hZGRBbmNlc3RvclN0YXRlc1RvRW50ZXIgOiBmdW5jdGlvbihzdGF0ZSwgYW5jZXN0b3IsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KXtcbiAgICAgIGxldCB0cmF2ZXJzZSA9IChhbmMpID0+IHtcbiAgICAgICAgICBpZihhbmMudHlwZUVudW0gPT09IFBBUkFMTEVMKXtcbiAgICAgICAgICAgICAgZm9yKGxldCBjaGlsZCBvZiBhbmMuc3RhdGVzKXtcbiAgICAgICAgICAgICAgICAgIGlmKGNoaWxkLnR5cGVFbnVtICE9PSBISVNUT1JZICYmICFbLi4uc3RhdGVzVG9FbnRlcl0uc29tZShzID0+IHF1ZXJ5LmlzRGVzY2VuZGFudChzLCBjaGlsZCkpKXtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcihjaGlsZCxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCkgXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZm9yKGxldCBhbmMgb2YgcXVlcnkuZ2V0QW5jZXN0b3JzKHN0YXRlLGFuY2VzdG9yKSl7XG4gICAgICAgICAgc3RhdGVzVG9FbnRlci5hZGQoYW5jKVxuICAgICAgICAgIHRyYXZlcnNlKGFuYylcbiAgICAgIH1cbiAgICAgIHRyYXZlcnNlKGFuY2VzdG9yKVxuICAgIH0sXG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICBfc2VsZWN0VHJhbnNpdGlvbnMgOiBmdW5jdGlvbihjdXJyZW50RXZlbnQsIHNlbGVjdEV2ZW50bGVzc1RyYW5zaXRpb25zKSB7XG4gICAgICAgIHZhciB0cmFuc2l0aW9uU2VsZWN0b3IgPSB0aGlzLm9wdHMudHJhbnNpdGlvblNlbGVjdG9yO1xuICAgICAgICB2YXIgZW5hYmxlZFRyYW5zaXRpb25zID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcblxuICAgICAgICB2YXIgZSA9IHRoaXMuX2V2YWx1YXRlQWN0aW9uLmJpbmQodGhpcyxjdXJyZW50RXZlbnQpO1xuXG4gICAgICAgIGxldCBhdG9taWNTdGF0ZXMgPSB0aGlzLl9jb25maWd1cmF0aW9uLml0ZXIoKS5zb3J0KHRyYW5zaXRpb25Db21wYXJhdG9yKTtcbiAgICAgICAgZm9yKGxldCBzdGF0ZSBvZiBhdG9taWNTdGF0ZXMpe1xuICAgICAgICAgICAgbG9vcDogZm9yKGxldCBzIG9mIFtzdGF0ZV0uY29uY2F0KHF1ZXJ5LmdldEFuY2VzdG9ycyhzdGF0ZSkpKXtcbiAgICAgICAgICAgICAgICBmb3IobGV0IHQgb2Ygcy50cmFuc2l0aW9ucyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRyYW5zaXRpb25TZWxlY3Rvcih0LCBjdXJyZW50RXZlbnQsIGUsIHNlbGVjdEV2ZW50bGVzc1RyYW5zaXRpb25zKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkVHJhbnNpdGlvbnMuYWRkKHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucyA9IHRoaXMuX3JlbW92ZUNvbmZsaWN0aW5nVHJhbnNpdGlvbihlbmFibGVkVHJhbnNpdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuX2xvZyhcInByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zXCIsIHByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucztcbiAgICB9LFxuXG4gICAgXG4gICAgX2NvbXB1dGVFeGl0U2V0IDogZnVuY3Rpb24odHJhbnNpdGlvbnMpIHtcbiAgICAgIGxldCBzdGF0ZXNUb0V4aXQgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IobGV0IHQgb2YgdHJhbnNpdGlvbnMpe1xuICAgICAgICAgIGlmKHQudGFyZ2V0cyl7XG4gICAgICAgICAgICAgIGxldCBzY29wZSA9IHQuc2NvcGU7XG4gICAgICAgICAgICAgIGZvcihsZXQgcyBvZiB0aGlzLl9nZXRGdWxsQ29uZmlndXJhdGlvbigpKXtcbiAgICAgICAgICAgICAgICAgIGlmKHF1ZXJ5LmlzRGVzY2VuZGFudChzLHNjb3BlKSkgc3RhdGVzVG9FeGl0LmFkZChzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0ZXNUb0V4aXQ7IFxuICAgIH0sXG4gICBcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIF9yZW1vdmVDb25mbGljdGluZ1RyYW5zaXRpb24gOiBmdW5jdGlvbihlbmFibGVkVHJhbnNpdGlvbnMpIHtcbiAgICAgIGxldCBmaWx0ZXJlZFRyYW5zaXRpb25zID0gbmV3IHRoaXMub3B0cy5TZXQoKVxuICAgICAgLy90b0xpc3Qgc29ydHMgdGhlIHRyYW5zaXRpb25zIGluIHRoZSBvcmRlciBvZiB0aGUgc3RhdGVzIHRoYXQgc2VsZWN0ZWQgdGhlbVxuICAgICAgZm9yKCBsZXQgdDEgb2YgZW5hYmxlZFRyYW5zaXRpb25zLml0ZXIoKSl7XG4gICAgICAgICAgbGV0IHQxUHJlZW1wdGVkID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHRyYW5zaXRpb25zVG9SZW1vdmUgPSBuZXcgU2V0KClcbiAgICAgICAgICBmb3IgKGxldCB0MiBvZiBmaWx0ZXJlZFRyYW5zaXRpb25zLml0ZXIoKSl7XG4gICAgICAgICAgICAgIC8vVE9ETzogY2FuIHdlIGNvbXB1dGUgdGhpcyBzdGF0aWNhbGx5PyBmb3IgZXhhbXBsZSwgYnkgY2hlY2tpbmcgaWYgdGhlIHRyYW5zaXRpb24gc2NvcGVzIGFyZSBhcmVuYSBvcnRob2dvbmFsP1xuICAgICAgICAgICAgICBsZXQgdDFFeGl0U2V0ID0gdGhpcy5fY29tcHV0ZUV4aXRTZXQoW3QxXSk7XG4gICAgICAgICAgICAgIGxldCB0MkV4aXRTZXQgPSB0aGlzLl9jb21wdXRlRXhpdFNldChbdDJdKTtcbiAgICAgICAgICAgICAgbGV0IGhhc0ludGVyc2VjdGlvbiA9IFsuLi50MUV4aXRTZXRdLnNvbWUoIHMgPT4gdDJFeGl0U2V0LmhhcyhzKSApICB8fCBbLi4udDJFeGl0U2V0XS5zb21lKCBzID0+IHQxRXhpdFNldC5oYXMocykpO1xuICAgICAgICAgICAgICB0aGlzLl9sb2coJ3QxRXhpdFNldCcsdDEuc291cmNlLmlkLFsuLi50MUV4aXRTZXRdLm1hcCggcyA9PiBzLmlkICkpXG4gICAgICAgICAgICAgIHRoaXMuX2xvZygndDJFeGl0U2V0Jyx0Mi5zb3VyY2UuaWQsWy4uLnQyRXhpdFNldF0ubWFwKCBzID0+IHMuaWQgKSlcbiAgICAgICAgICAgICAgdGhpcy5fbG9nKCdoYXNJbnRlcnNlY3Rpb24nLGhhc0ludGVyc2VjdGlvbilcbiAgICAgICAgICAgICAgaWYoaGFzSW50ZXJzZWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgIGlmKHQyLnNvdXJjZS5kZXNjZW5kYW50cy5pbmRleE9mKHQxLnNvdXJjZSkgPiAtMSl7ICAgIC8vaXMgdGhpcyB0aGUgc2FtZSBhcyBiZWluZyBhbmNlc3RyYWxseSByZWxhdGVkP1xuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zVG9SZW1vdmUuYWRkKHQyKVxuICAgICAgICAgICAgICAgICAgfWVsc2V7IFxuICAgICAgICAgICAgICAgICAgICAgIHQxUHJlZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCF0MVByZWVtcHRlZCl7XG4gICAgICAgICAgICAgIGZvcihsZXQgdDMgb2YgdHJhbnNpdGlvbnNUb1JlbW92ZSl7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJlZFRyYW5zaXRpb25zLnJlbW92ZSh0MylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmaWx0ZXJlZFRyYW5zaXRpb25zLmFkZCh0MSlcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICAgICAgICAgXG4gICAgICByZXR1cm4gZmlsdGVyZWRUcmFuc2l0aW9ucztcbiAgICB9LFxuXG4gICAgX2xvZyA6IGZ1bmN0aW9uKCl7XG4gICAgICBpZihwcmludFRyYWNlKXtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMub3B0cy5jb25zb2xlLmxvZyggXG4gICAgICAgICAgYCR7YXJnc1swXX06ICR7XG4gICAgICAgICAgICBhcmdzLnNsaWNlKDEpLm1hcChmdW5jdGlvbihhcmcpe1xuICAgICAgICAgICAgICByZXR1cm4gYXJnID09PSBudWxsID8gJ251bGwnIDogXG4gICAgICAgICAgICAgICAgKCBhcmcgPT09IHVuZGVmaW5lZCA/ICd1bmRlZmluZWQnIDogXG4gICAgICAgICAgICAgICAgICAoIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnID8gYXJnIDogXG4gICAgICAgICAgICAgICAgICAgICggYXJnLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gdXRpbC5pbnNwZWN0KGFyZykgOiBhcmcudG9TdHJpbmcoKSkpKTtcblxuICAgICAgICAgICAgfSkuam9pbignLCAnKVxuICAgICAgICAgIH1cXG5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICogQGludGVyZmFjZSBMaXN0ZW5lclxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25FbnRyeSBcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZUlkXG4gICAgKi9cblxuICAgIC8qKlxuICAgICogQGZ1bmN0aW9uXG4gICAgKiBAbmFtZSBMaXN0ZW5lciNvbkV4aXQgXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVJZFxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25UcmFuc2l0aW9uIFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZVN0YXRlSWQgSWQgb2YgdGhlIHNvdXJjZSBzdGF0ZVxuICAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSB0YXJnZXRTdGF0ZXNJZHMgSWRzIG9mIHRoZSB0YXJnZXQgc3RhdGVzXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdHJhbnNpdGlvbkluZGV4IEluZGV4IG9mIHRoZSB0cmFuc2l0aW9uIHJlbGF0aXZlIHRvIG90aGVyIHRyYW5zaXRpb25zIG9yaWdpbmF0aW5nIGZyb20gc291cmNlIHN0YXRlLlxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25FcnJvclxuICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3JJbmZvXG4gICAgKi9cblxuICAgIC8qKlxuICAgICogQGZ1bmN0aW9uXG4gICAgKiBAbmFtZSBMaXN0ZW5lciNvbkJpZ1N0ZXBCZWdpblxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25CaWdTdGVwUmVzdW1lXG4gICAgKi9cblxuICAgIC8qKlxuICAgICogQGZ1bmN0aW9uXG4gICAgKiBAbmFtZSBMaXN0ZW5lciNvbkJpZ1N0ZXBTdXNwZW5kXG4gICAgKi9cblxuICAgIC8qKlxuICAgICogQGZ1bmN0aW9uXG4gICAgKiBAbmFtZSBMaXN0ZW5lciNvbkJpZ1N0ZXBFbmRcbiAgICAqL1xuXG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb25cbiAgICAqIEBuYW1lIExpc3RlbmVyI29uU21hbGxTdGVwQmVnaW5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgICovXG5cbiAgICAvKipcbiAgICAqIEBmdW5jdGlvblxuICAgICogQG5hbWUgTGlzdGVuZXIjb25TbWFsbFN0ZXBFbmRcbiAgICAqL1xuXG5cbiAgICAvKiogXG4gICAgKiBQcm92aWRlcyBhIGdlbmVyaWMgbWVjaGFuaXNtIHRvIHN1YnNjcmliZSB0byBzdGF0ZSBjaGFuZ2UgYW5kIHJ1bnRpbWVcbiAgICAqIGVycm9yIG5vdGlmaWNhdGlvbnMuICBDYW4gYmUgdXNlZCBmb3IgbG9nZ2luZyBhbmQgZGVidWdnaW5nLiBGb3IgZXhhbXBsZSxcbiAgICAqIGNhbiBhdHRhY2ggYSBsb2dnZXIgdGhhdCBzaW1wbHkgbG9ncyB0aGUgc3RhdGUgY2hhbmdlcy4gIE9yIGNhbiBhdHRhY2ggYVxuICAgICogbmV0d29yayBkZWJ1Z2dpbmcgY2xpZW50IHRoYXQgc2VuZHMgc3RhdGUgY2hhbmdlIG5vdGlmaWNhdGlvbnMgdG8gYVxuICAgICogZGVidWdnaW5nIHNlcnZlci5cbiAgICAqIFRoaXMgaXMgYW4gYWx0ZXJuYXRpdmUgaW50ZXJmYWNlIHRvIHtAbGluayBFdmVudEVtaXR0ZXIucHJvdG90eXBlI29ufS5cbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICogQHBhcmFtIHtMaXN0ZW5lcn0gbGlzdGVuZXJcbiAgICAqL1xuICAgIHJlZ2lzdGVyTGlzdGVuZXIgOiBmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgICAgIEJhc2VJbnRlcnByZXRlci5FVkVOVFMuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgaWYobGlzdGVuZXJbZXZlbnRdKSB0aGlzLm9uKGV2ZW50LGxpc3RlbmVyW2V2ZW50XSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgKiBVbnJlZ2lzdGVyIGEgTGlzdGVuZXJcbiAgICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAgICogQHBhcmFtIHtMaXN0ZW5lcn0gbGlzdGVuZXJcbiAgICAqL1xuICAgIHVucmVnaXN0ZXJMaXN0ZW5lciA6IGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgICAgQmFzZUludGVycHJldGVyLkVWRU5UUy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICBpZihsaXN0ZW5lcltldmVudF0pIHRoaXMub2ZmKGV2ZW50LGxpc3RlbmVyW2V2ZW50XSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgKiBRdWVyeSB0aGUgbW9kZWwgdG8gZ2V0IGFsbCB0cmFuc2l0aW9uIGV2ZW50cy5cbiAgICAqIEByZXR1cm4ge0FycmF5PHN0cmluZz59IFRyYW5zaXRpb24gZXZlbnRzLlxuICAgICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgXG4gICAgKi9cbiAgICBnZXRBbGxUcmFuc2l0aW9uRXZlbnRzIDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHt9O1xuICAgICAgICBmdW5jdGlvbiBnZXRFdmVudHMoc3RhdGUpe1xuXG4gICAgICAgICAgICBpZihzdGF0ZS50cmFuc2l0aW9ucyl7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCB0eExlbiA9IHN0YXRlLnRyYW5zaXRpb25zLmxlbmd0aDsgdHhJZHggPCB0eExlbjsgdHhJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICBldmVudHNbc3RhdGUudHJhbnNpdGlvbnNbdHhJZHhdLmV2ZW50XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihzdGF0ZS5zdGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBzdGF0ZUlkeCA9IDAsIHN0YXRlTGVuID0gc3RhdGUuc3RhdGVzLmxlbmd0aDsgc3RhdGVJZHggPCBzdGF0ZUxlbjsgc3RhdGVJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICBnZXRFdmVudHMoc3RhdGUuc3RhdGVzW3N0YXRlSWR4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0RXZlbnRzKHRoaXMuX21vZGVsKTtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgKiBUaHJlZSB0aGluZ3MgY2FwdHVyZSB0aGUgY3VycmVudCBzbmFwc2hvdCBvZiBhIHJ1bm5pbmcgU0NJT04gaW50ZXJwcmV0ZXI6XG4gICAgKlxuICAgICogICAgICA8dWw+XG4gICAgKiAgICAgIDxsaT4gYmFzaWMgY29uZmlndXJhdGlvbiAodGhlIHNldCBvZiBiYXNpYyBzdGF0ZXMgdGhlIHN0YXRlIG1hY2hpbmUgaXMgaW4pPC9saT5cbiAgICAqICAgICAgPGxpPiBoaXN0b3J5IHN0YXRlIHZhbHVlcyAodGhlIHN0YXRlcyB0aGUgc3RhdGUgbWFjaGluZSB3YXMgaW4gbGFzdCB0aW1lIGl0IHdhcyBpbiB0aGUgcGFyZW50IG9mIGEgaGlzdG9yeSBzdGF0ZSk8L2xpPlxuICAgICogICAgICA8bGk+IHRoZSBkYXRhbW9kZWw8L2xpPlxuICAgICogICAgICA8L3VsPlxuICAgICogICAgICBcbiAgICAqIFRoZSBzbmFwc2hvdCBvYmplY3QgY2FuIGJlIHNlcmlhbGl6ZWQgYXMgSlNPTiBhbmQgc2F2ZWQgdG8gYSBkYXRhYmFzZS4gSXQgY2FuXG4gICAgKiBsYXRlciBiZSBwYXNzZWQgdG8gdGhlIFNDWE1MIGNvbnN0cnVjdG9yIHRvIHJlc3RvcmUgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICAqIHVzaW5nIHRoZSBzbmFwc2hvdCBhcmd1bWVudC5cbiAgICAqXG4gICAgKiBAcmV0dXJuIHtTbmFwc2hvdH0gXG4gICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgICAqL1xuICAgIGdldFNuYXBzaG90IDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpLFxuICAgICAgICB0aGlzLl9zZXJpYWxpemVIaXN0b3J5KCksXG4gICAgICAgIHRoaXMuX2lzSW5GaW5hbFN0YXRlLFxuICAgICAgICB0aGlzLl9tb2RlbC4kc2VyaWFsaXplRGF0YW1vZGVsKCksXG4gICAgICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5zbGljZSgpXG4gICAgICBdO1xuICAgIH0sXG5cbiAgICBfc2VyaWFsaXplSGlzdG9yeSA6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgbyA9IHt9O1xuICAgICAgT2JqZWN0LmtleXModGhpcy5faGlzdG9yeVZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uKHNpZCl7XG4gICAgICAgIG9bc2lkXSA9IHRoaXMuX2hpc3RvcnlWYWx1ZVtzaWRdLm1hcChmdW5jdGlvbihzdGF0ZSl7cmV0dXJuIHN0YXRlLmlkfSk7XG4gICAgICB9LHRoaXMpO1xuICAgICAgcmV0dXJuIG87XG4gICAgfVxufSk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAZXh0ZW5kcyBCYXNlSW50ZXJwcmV0ZXJcbiAqL1xuZnVuY3Rpb24gU3RhdGVjaGFydChtb2RlbCwgb3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgb3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgPSBvcHRzLkludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCB8fCBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQ7XG5cbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gZmFsc2U7XG5cbiAgICBCYXNlSW50ZXJwcmV0ZXIuY2FsbCh0aGlzLG1vZGVsLG9wdHMpOyAgICAgLy9jYWxsIHN1cGVyIGNvbnN0cnVjdG9yXG5cbiAgICBtb2R1bGUuZXhwb3J0cy5lbWl0KCduZXcnLHRoaXMpO1xufVxuXG5mdW5jdGlvbiBiZWdldChvKXtcbiAgICBmdW5jdGlvbiBGKCl7fVxuICAgIEYucHJvdG90eXBlID0gbztcbiAgICByZXR1cm4gbmV3IEYoKTtcbn1cblxuLy8gRG8gbm90aGluZ1xuXG5mdW5jdGlvbiBub3AoKSB7fVxuXG4vL1N0YXRlY2hhcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlKTtcbi8vd291bGQgbGlrZSB0byB1c2UgT2JqZWN0LmNyZWF0ZSBoZXJlLCBidXQgbm90IHBvcnRhYmxlLCBidXQgaXQncyB0b28gY29tcGxpY2F0ZWQgdG8gdXNlIHBvcnRhYmx5XG5TdGF0ZWNoYXJ0LnByb3RvdHlwZSA9IGJlZ2V0KEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUpOyAgICBcblxuLyoqXG4gKiBAaW50ZXJmYWNlIEV2ZW50XG4gKi9cblxuLyoqIFxuKiBAbWVtYmVyIG5hbWVcbiogQG1lbWJlcm9mIEV2ZW50LnByb3RvdHlwZSBcbiogQHR5cGUgc3RyaW5nXG4qIEBkZXNjcmlwdGlvbiBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcbiovXG5cbi8qKiBcbiogQG1lbWJlciBkYXRhXG4qIEBtZW1iZXJvZiBFdmVudC5wcm90b3R5cGUgXG4qIEB0eXBlIGFueVxuKiBAZGVzY3JpcHRpb24gVGhlIGV2ZW50IGRhdGFcbiovXG5cbi8qKiBcbiogQW4gU0NYTUwgaW50ZXJwcmV0ZXIgdGFrZXMgU0NYTUwgZXZlbnRzIGFzIGlucHV0LCB3aGVyZSBhbiBTQ1hNTCBldmVudCBpcyBhblxuKiBvYmplY3Qgd2l0aCBcIm5hbWVcIiBhbmQgXCJkYXRhXCIgcHJvcGVydGllcy4gVGhlc2UgY2FuIGJlIHBhc3NlZCB0byBtZXRob2QgYGdlbmBcbiogYXMgdHdvIHBvc2l0aW9uYWwgYXJndW1lbnRzLCBvciBhcyBhIHNpbmdsZSBvYmplY3QuXG4qIEBmdW5jdGlvbiBnZW5cbiogQG1lbWJlcm9mIFN0YXRlY2hhcnQucHJvdG90eXBlIFxuKiBAcGFyYW0ge3N0cmluZ3xFdmVudH0gZXZ0T2JqT3JOYW1lXG4qIEBwYXJhbSB7YW55PX0gb3B0aW9uYWxEYXRhXG4qIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25FbnRyeVxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRXhpdFxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uVHJhbnNpdGlvblxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRGVmYXVsdEVudHJ5XG4qIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25FcnJvclxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uQmlnU3RlcEJlZ2luXG4qIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4qIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwU3VzcGVuZFxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uQmlnU3RlcFJlc3VtZVxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwQmVnaW5cbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEVuZFxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRXhpdEludGVycHJldGVyXG4qL1xuU3RhdGVjaGFydC5wcm90b3R5cGUuZ2VuID0gZnVuY3Rpb24oZXZ0T2JqT3JOYW1lLG9wdGlvbmFsRGF0YSkge1xuXG4gICAgdmFyIGN1cnJlbnRFdmVudDtcbiAgICBzd2l0Y2godHlwZW9mIGV2dE9iak9yTmFtZSl7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjdXJyZW50RXZlbnQgPSB7bmFtZSA6IGV2dE9iak9yTmFtZSwgZGF0YSA6IG9wdGlvbmFsRGF0YX07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgIGlmKHR5cGVvZiBldnRPYmpPck5hbWUubmFtZSA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRFdmVudCA9IGV2dE9iak9yTmFtZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgb2JqZWN0IG11c3QgaGF2ZSBcIm5hbWVcIiBwcm9wZXJ0eSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBnZW4gbXVzdCBiZSBhIHN0cmluZyBvciBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgaWYodGhpcy5faXNTdGVwcGluZykgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBnZW4gZHVyaW5nIGEgYmlnLXN0ZXAnKTtcblxuICAgIC8vb3RoZXJ3aXNlLCBraWNrIGhpbSBvZmZcbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gdHJ1ZTtcblxuICAgIHRoaXMuX3BlcmZvcm1CaWdTdGVwKGN1cnJlbnRFdmVudCk7XG5cbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpO1xufTtcblxuLyoqXG4qIEluamVjdHMgYW4gZXh0ZXJuYWwgZXZlbnQgaW50byB0aGUgaW50ZXJwcmV0ZXIgYXN5bmNocm9ub3VzbHlcbiogQGZ1bmN0aW9uIGdlbkFzeW5jXG4qIEBtZW1iZXJvZiBTdGF0ZWNoYXJ0LnByb3RvdHlwZSBcbiogQHBhcmFtIHtFdmVudH0gIGN1cnJlbnRFdmVudCBUaGUgZXZlbnQgdG8gaW5qZWN0XG4qIEBwYXJhbSB7Z2VuQ2FsbGJhY2t9IGNiIENhbGxiYWNrIGludm9rZWQgd2l0aCBhbiBlcnJvciBvciB0aGUgaW50ZXJwcmV0ZXIncyBzdGFibGUgY29uZmlndXJhdGlvblxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRW50cnlcbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkV4aXRcbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvblRyYW5zaXRpb25cbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkRlZmF1bHRFbnRyeVxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uRXJyb3JcbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBCZWdpblxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuKiBAZW1pdHMgQmFzZUludGVycHJldGVyI29uQmlnU3RlcFN1c3BlbmRcbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBSZXN1bWVcbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEJlZ2luXG4qIEBlbWl0cyBCYXNlSW50ZXJwcmV0ZXIjb25TbWFsbFN0ZXBFbmRcbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBFbmRcbiogQGVtaXRzIEJhc2VJbnRlcnByZXRlciNvbkV4aXRJbnRlcnByZXRlclxuKi9cblN0YXRlY2hhcnQucHJvdG90eXBlLmdlbkFzeW5jID0gZnVuY3Rpb24oY3VycmVudEV2ZW50LCBjYikge1xuICAgIGlmIChjdXJyZW50RXZlbnQgIT09IG51bGwgJiYgKHR5cGVvZiBjdXJyZW50RXZlbnQgIT09ICdvYmplY3QnIHx8ICFjdXJyZW50RXZlbnQgfHwgdHlwZW9mIGN1cnJlbnRFdmVudC5uYW1lICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBjdXJyZW50RXZlbnQgdG8gYmUgbnVsbCBvciBhbiBPYmplY3Qgd2l0aCBhIG5hbWUnKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYiA9IG5vcDtcbiAgICB9XG5cbiAgICB0aGlzLl9leHRlcm5hbEV2ZW50UXVldWUucHVzaChbY3VycmVudEV2ZW50LCBjYl0pO1xuXG4gICAgLy90aGUgc2VtYW50aWNzIHdlIHdhbnQgYXJlIHRvIHJldHVybiB0byB0aGUgY2IgdGhlIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyB0aGF0IHBhcnRpY3VsYXIgZXZlbnQuXG4gICAgZnVuY3Rpb24gbmV4dFN0ZXAoZSwgYyl7XG4gICAgICB0aGlzLl9wZXJmb3JtQmlnU3RlcEFzeW5jKGUsIGZ1bmN0aW9uKGVyciwgY29uZmlnKSB7XG4gICAgICAgICAgYyhlcnIsIGNvbmZpZyk7XG5cbiAgICAgICAgICBpZih0aGlzLl9leHRlcm5hbEV2ZW50UXVldWUubGVuZ3RoKXtcbiAgICAgICAgICAgIG5leHRTdGVwLmFwcGx5KHRoaXMsdGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLnNoaWZ0KCkpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5faXNTdGVwcGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmKCF0aGlzLl9pc1N0ZXBwaW5nKXsgXG4gICAgICB0aGlzLl9pc1N0ZXBwaW5nID0gdHJ1ZTtcbiAgICAgIG5leHRTdGVwLmFwcGx5KHRoaXMsdGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLnNoaWZ0KCkpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIEludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dChpbnRlcnByZXRlcikge1xuICAgIHRoaXMuX2ludGVycHJldGVyID0gaW50ZXJwcmV0ZXI7XG4gICAgdGhpcy5fdGltZW91dE1hcCA9IHt9O1xuICAgIHRoaXMuX2ludm9rZU1hcCA9IHt9O1xuICAgIHRoaXMuX3RpbWVvdXRzID0gbmV3IFNldCgpXG59XG5cbi8vUmVnZXggZnJvbTpcbi8vICBodHRwOi8vZGFyaW5nZmlyZWJhbGwubmV0LzIwMTAvMDcvaW1wcm92ZWRfcmVnZXhfZm9yX21hdGNoaW5nX3VybHNcbi8vICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82OTI3ODc4XG52YXIgdmFsaWRhdGVVcmlSZWdleCA9IC8oI18uKil8XFxiKCg/OlthLXpdW1xcdy1dKzooPzpcXC97MSwzfXxbYS16MC05JV0pfHd3d1xcZHswLDN9Wy5dfFthLXowLTkuXFwtXStbLl1bYS16XXsyLDR9XFwvKSg/OlteXFxzKCk8Pl0rfFxcKChbXlxccygpPD5dK3woXFwoW15cXHMoKTw+XStcXCkpKSpcXCkpKyg/OlxcKChbXlxccygpPD5dK3woXFwoW15cXHMoKTw+XStcXCkpKSpcXCl8W15cXHNgISgpXFxbXFxde307OidcIi4sPD4/wqvCu+KAnOKAneKAmOKAmV0pKS9pO1xuXG4vL1RPRE86IGNvbnNpZGVyIHdoZXRoZXIgdGhpcyBpcyB0aGUgQVBJIHdlIHdvdWxkIGxpa2UgdG8gZXhwb3NlXG5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGludm9rZVNlbmRUYXJnZXRSZWdleCAgOiAvXiNfKC4qKSQvLFxuICAgIHNjeG1sU2VuZFRhcmdldFJlZ2V4ICA6IC9eI19zY3htbF8oLiopJC8sXG4gICAgcmFpc2UgOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRoaXMuX2luc3RhbGxEZWZhdWx0UHJvcHNPbkV2ZW50KGV2ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKGV2ZW50KTsgXG4gICAgfSxcbiAgICBwYXJzZVhtbFN0cmluZ0FzRE9NIDogZnVuY3Rpb24oeG1sU3RyaW5nKXtcbiAgICAgIHJldHVybiAodGhpcy5faW50ZXJwcmV0ZXIub3B0cy54bWxQYXJzZXIgfHwgSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0LnhtbFBhcnNlcikucGFyc2UoeG1sU3RyaW5nKTtcbiAgICB9LFxuICAgIGludm9rZSA6IGZ1bmN0aW9uKGludm9rZU9iail7XG4gICAgICAvL2xvb2sgdXAgaW52b2tlciBieSB0eXBlLiBhc3N1bWUgaW52b2tlcnMgYXJlIHBhc3NlZCBpbiBhcyBhbiBvcHRpb24gdG8gY29uc3RydWN0b3JcbiAgICAgIHRoaXMuX2ludm9rZU1hcFtpbnZva2VPYmouaWRdID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAodGhpcy5faW50ZXJwcmV0ZXIub3B0cy5pbnZva2VycyB8fCBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQuaW52b2tlcnMpW2ludm9rZU9iai50eXBlXSh0aGlzLl9pbnRlcnByZXRlciwgaW52b2tlT2JqLCAoZXJyLCBzZXNzaW9uKSA9PiB7XG4gICAgICAgICAgaWYoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG5cbiAgICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5lbWl0KCdvbkludm9rZWRTZXNzaW9uSW5pdGlhbGl6ZWQnLCBzZXNzaW9uKTtcbiAgICAgICAgICByZXNvbHZlKHNlc3Npb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY2FuY2VsSW52b2tlIDogZnVuY3Rpb24oaW52b2tlaWQpe1xuICAgICAgLy9UT0RPOiBvbiBjYW5jZWwgaW52b2tlIGNsZWFuIHVwIHRoaXMuX2ludm9rZU1hcFxuICAgICAgbGV0IHNlc3Npb25Qcm9taXNlID0gdGhpcy5faW52b2tlTWFwW2ludm9rZWlkXTtcbiAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coYGNhbmNlbGxpbmcgc2Vzc2lvbiB3aXRoIGludm9rZWlkICR7aW52b2tlaWR9YCk7XG4gICAgICBpZihzZXNzaW9uUHJvbWlzZSl7XG4gICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coYHNlc3Npb25Qcm9taXNlIGZvdW5kYCk7XG4gICAgICAgIHNlc3Npb25Qcm9taXNlLnRoZW4oIFxuICAgICAgICAgICgoc2Vzc2lvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZyhgcmVzb2x2ZWQgc2Vzc2lvbiAke2ludm9rZWlkfS4gY2FuY2VsbGluZy4uLiBgKTtcbiAgICAgICAgICAgIHNlc3Npb24uY2FuY2VsKCk7IFxuICAgICAgICAgICAgLy9jbGVhbiB1cFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2ludm9rZU1hcFtpbnZva2VpZF07XG4gICAgICAgICAgfSksIFxuICAgICAgICAgICggKGVycikgPT4ge1xuICAgICAgICAgICAgLy9UT0RPOiBkaXNwYXRjaCBlcnJvciBiYWNrIGludG8gdGhlIHN0YXRlIG1hY2hpbmUgYXMgZXJyb3IuY29tbXVuaWNhdGlvblxuICAgICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9pbnN0YWxsRGVmYXVsdFByb3BzT25FdmVudCA6IGZ1bmN0aW9uKGV2ZW50LGlzSW50ZXJuYWwpe1xuICAgICAgaWYoIWlzSW50ZXJuYWwpeyBcbiAgICAgICAgZXZlbnQub3JpZ2luID0gdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5feC5faW9wcm9jZXNzb3JzLnNjeG1sLmxvY2F0aW9uOyAgICAgLy9UT0RPOiBwcmVzZXJ2ZSBvcmlnaW5hbCBvcmlnaW4gd2hlbiB3ZSBhdXRvZm9yd2FyZD8gXG4gICAgICAgIGV2ZW50Lm9yaWdpbnR5cGUgPSBldmVudC50eXBlIHx8IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEU7XG4gICAgICB9XG4gICAgICBpZih0eXBlb2YgZXZlbnQudHlwZSA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICBldmVudC50eXBlID0gaXNJbnRlcm5hbCA/ICdpbnRlcm5hbCcgOiAnZXh0ZXJuYWwnO1xuICAgICAgfVxuICAgICAgW1xuICAgICAgICAnbmFtZScsXG4gICAgICAgICdzZW5kaWQnLFxuICAgICAgICAnaW52b2tlaWQnLFxuICAgICAgICAnZGF0YScsXG4gICAgICAgICdvcmlnaW4nLFxuICAgICAgICAnb3JpZ2ludHlwZSdcbiAgICAgIF0uZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgaWYodHlwZW9mIGV2ZW50W3Byb3BdID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgZXZlbnRbcHJvcF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc2VuZCA6IGZ1bmN0aW9uKGV2ZW50LCBvcHRpb25zKXtcbiAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZygnc2VuZCBldmVudCcsIGV2ZW50LCBvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBzZW5kVHlwZSA9IG9wdGlvbnMudHlwZSB8fCBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFO1xuICAgICAgICAvL1RPRE86IG1vdmUgdGhlc2Ugb3V0XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlU2VuZChldmVudCwgb3B0aW9ucywgc2VuZEFjdGlvbil7XG4gICAgICAgICAgaWYoZXZlbnQudGFyZ2V0KXtcbiAgICAgICAgICAgIHZhciB0YXJnZXRJc1ZhbGlkVXJpID0gdmFsaWRhdGVVcmlSZWdleC50ZXN0KGV2ZW50LnRhcmdldClcbiAgICAgICAgICAgIGlmKCF0YXJnZXRJc1ZhbGlkVXJpKXtcbiAgICAgICAgICAgICAgdGhyb3cgeyBuYW1lIDogXCJlcnJvci5leGVjdXRpb25cIiwgZGF0YTogJ1RhcmdldCBpcyBub3QgdmFsaWQgVVJJJywgc2VuZGlkOiBldmVudC5zZW5kaWQsIHR5cGUgOiAncGxhdGZvcm0nIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCBzZW5kVHlwZSAhPT0gU0NYTUxfSU9QUk9DRVNTT1JfVFlQRSkgeyAgLy9UT0RPOiBleHRlbmQgdGhpcyB0byBzdXBwb3J0IEhUVFAsIGFuZCBvdGhlciBJTyBwcm9jZXNzb3JzXG4gICAgICAgICAgICAgIHRocm93IHsgbmFtZSA6IFwiZXJyb3IuZXhlY3V0aW9uXCIsIGRhdGE6ICdVbnN1cHBvcnRlZCBldmVudCBwcm9jZXNzb3IgdHlwZScsIHNlbmRpZDogZXZlbnQuc2VuZGlkLCB0eXBlIDogJ3BsYXRmb3JtJyB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlbmRBY3Rpb24uY2FsbCh0aGlzLCBldmVudCwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWZhdWx0U2VuZEFjdGlvbiAoZXZlbnQsIG9wdGlvbnMpIHtcblxuICAgICAgICAgIGlmKCB0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ3VuZGVmaW5lZCcgKSB0aHJvdyBuZXcgRXJyb3IoJ0RlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgU3RhdGVjaGFydC5wcm90b3R5cGUuc2VuZCB3aWxsIG5vdCB3b3JrIHVubGVzcyBzZXRUaW1lb3V0IGlzIGRlZmluZWQgZ2xvYmFsbHkuJyk7XG5cbiAgICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgICAgaWYoZXZlbnQudGFyZ2V0ID09PSAnI19pbnRlcm5hbCcpe1xuICAgICAgICAgICAgdGhpcy5yYWlzZShldmVudCk7XG4gICAgICAgICAgfWVsc2V7IFxuICAgICAgICAgICAgdGhpcy5faW5zdGFsbERlZmF1bHRQcm9wc09uRXZlbnQoZXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIGV2ZW50Lm9yaWdpbnR5cGUgPSBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFOyAgICAgIC8vVE9ETzogZXh0ZW5kIHRoaXMgdG8gc3VwcG9ydCBIVFRQLCBhbmQgb3RoZXIgSU8gcHJvY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPIDogcGFyYW10ZXJpemUgdGhpcyBiYXNlZCBvbiBzZW5kL0B0eXBlP1xuICAgICAgICAgICAgaWYoIWV2ZW50LnRhcmdldCl7XG4gICAgICAgICAgICAgIGRvU2VuZC5jYWxsKHRoaXMsIHRoaXMuX2ludGVycHJldGVyKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKGV2ZW50LnRhcmdldCA9PT0gJyNfcGFyZW50Jyl7XG4gICAgICAgICAgICAgIGlmKHRoaXMuX2ludGVycHJldGVyLm9wdHMucGFyZW50U2Vzc2lvbil7XG4gICAgICAgICAgICAgICAgZXZlbnQuaW52b2tlaWQgPSB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmludm9rZWlkO1xuICAgICAgICAgICAgICAgIGRvU2VuZC5jYWxsKHRoaXMsIHRoaXMuX2ludGVycHJldGVyLm9wdHMucGFyZW50U2Vzc2lvbik7XG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IHsgbmFtZSA6IFwiZXJyb3IuY29tbXVuaWNhdGlvblwiLCBkYXRhOiAnUGFyZW50IHNlc3Npb24gbm90IHNwZWNpZmllZCcsIHNlbmRpZDogZXZlbnQuc2VuZGlkLCB0eXBlIDogJ3BsYXRmb3JtJyB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYobWF0Y2ggPSBldmVudC50YXJnZXQubWF0Y2godGhpcy5zY3htbFNlbmRUYXJnZXRSZWdleCkpe1xuICAgICAgICAgICAgICBsZXQgdGFyZ2V0U2Vzc2lvbklkID0gbWF0Y2hbMV07XG4gICAgICAgICAgICAgIGxldCBzZXNzaW9uID0gdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5zZXNzaW9uUmVnaXN0cnkuZ2V0KHRhcmdldFNlc3Npb25JZClcbiAgICAgICAgICAgICAgaWYoc2Vzc2lvbil7XG4gICAgICAgICAgICAgICAgZG9TZW5kLmNhbGwodGhpcyxzZXNzaW9uKTtcbiAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IHtuYW1lIDogJ2Vycm9yLmNvbW11bmljYXRpb24nLCBzZW5kaWQ6IGV2ZW50LnNlbmRpZCwgdHlwZSA6ICdwbGF0Zm9ybSd9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSBpZihtYXRjaCA9IGV2ZW50LnRhcmdldC5tYXRjaCh0aGlzLmludm9rZVNlbmRUYXJnZXRSZWdleCkpe1xuICAgICAgICAgICAgICAvL1RPRE86IHRlc3QgdGhpcyBjb2RlIHBhdGguXG4gICAgICAgICAgICAgIHZhciBpbnZva2VJZCA9IG1hdGNoWzFdXG4gICAgICAgICAgICAgIHRoaXMuX2ludm9rZU1hcFtpbnZva2VJZF0udGhlbiggKHNlc3Npb24pID0+IHtcbiAgICAgICAgICAgICAgICBkb1NlbmQuY2FsbCh0aGlzLHNlc3Npb24pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnJlY29nbml6ZWQgc2VuZCB0YXJnZXQuJyk7IC8vVE9ETzogZGlzcGF0Y2ggZXJyb3IgYmFjayBpbnRvIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnVuY3Rpb24gZG9TZW5kKHNlc3Npb24pe1xuICAgICAgICAgICAgLy9UT0RPOiB3ZSBwcm9iYWJseSBub3cgbmVlZCB0byByZWZhY3RvciBkYXRhIHN0cnVjdHVyZXM6XG4gICAgICAgICAgICAvLyAgICB0aGlzLl90aW1lb3V0c1xuICAgICAgICAgICAgLy8gICAgdGhpcy5fdGltZW91dE1hcFxuICAgICAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGlmIChldmVudC5zZW5kaWQpIGRlbGV0ZSB0aGlzLl90aW1lb3V0TWFwW2V2ZW50LnNlbmRpZF07XG4gICAgICAgICAgICAgIHRoaXMuX3RpbWVvdXRzLmRlbGV0ZSh0aW1lb3V0T3B0aW9ucyk7XG4gICAgICAgICAgICAgIGlmKHRoaXMuX2ludGVycHJldGVyLm9wdHMuZG9TZW5kKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmRvU2VuZChzZXNzaW9uLCBldmVudCk7XG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNlc3Npb25bdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5zZW5kQXN5bmMgPyAnZ2VuQXN5bmMnIDogJ2dlbiddKGV2ZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBvcHRpb25zLmRlbGF5IHx8IDApO1xuXG4gICAgICAgICAgICB2YXIgdGltZW91dE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIHNlbmRPcHRpb25zIDogb3B0aW9ucyxcbiAgICAgICAgICAgICAgdGltZW91dEhhbmRsZSA6IHRpbWVvdXRIYW5kbGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoZXZlbnQuc2VuZGlkKSB0aGlzLl90aW1lb3V0TWFwW2V2ZW50LnNlbmRpZF0gPSB0aW1lb3V0SGFuZGxlO1xuICAgICAgICAgICAgdGhpcy5fdGltZW91dHMuYWRkKHRpbWVvdXRPcHRpb25zKTsgXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHVibGlzaCgpe1xuICAgICAgICAgIHRoaXMuX2ludGVycHJldGVyLmVtaXQoZXZlbnQubmFtZSxldmVudC5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY2hvb3NlIHNlbmQgZnVuY3Rpb25cbiAgICAgICAgLy9UT0RPOiByZXRoaW5rIGhvdyB0aGlzIGN1c3RvbSBzZW5kIHdvcmtzXG4gICAgICAgIHZhciBzZW5kRm47ICAgICAgICAgXG4gICAgICAgIGlmKGV2ZW50LnR5cGUgPT09ICdodHRwczovL2dpdGh1Yi5jb20vamJlYXJkNC9TQ0lPTiNwdWJsaXNoJyl7XG4gICAgICAgICAgc2VuZEZuID0gcHVibGlzaDtcbiAgICAgICAgfWVsc2UgaWYodGhpcy5faW50ZXJwcmV0ZXIub3B0cy5jdXN0b21TZW5kKXtcbiAgICAgICAgICBzZW5kRm4gPSB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmN1c3RvbVNlbmQ7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHNlbmRGbiA9IGRlZmF1bHRTZW5kQWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucz1vcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coXCJzZW5kaW5nIGV2ZW50XCIsIGV2ZW50Lm5hbWUsIFwid2l0aCBjb250ZW50XCIsIGV2ZW50LmRhdGEsIFwiYWZ0ZXIgZGVsYXlcIiwgb3B0aW9ucy5kZWxheSk7XG5cbiAgICAgICAgdmFsaWRhdGVTZW5kLmNhbGwodGhpcywgZXZlbnQsIG9wdGlvbnMsIHNlbmRGbik7XG4gICAgfSxcbiAgICBjYW5jZWwgOiBmdW5jdGlvbihzZW5kaWQpe1xuICAgICAgICBpZih0aGlzLl9pbnRlcnByZXRlci5vcHRzLmN1c3RvbUNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVycHJldGVyLm9wdHMuY3VzdG9tQ2FuY2VsLmFwcGx5KHRoaXMsIFtzZW5kaWRdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAndW5kZWZpbmVkJyApIHRocm93IG5ldyBFcnJvcignRGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBTdGF0ZWNoYXJ0LnByb3RvdHlwZS5jYW5jZWwgd2lsbCBub3Qgd29yayB1bmxlc3Mgc2V0VGltZW91dCBpcyBkZWZpbmVkIGdsb2JhbGx5LicpO1xuXG4gICAgICAgIGlmIChzZW5kaWQgaW4gdGhpcy5fdGltZW91dE1hcCkge1xuICAgICAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZyhcImNhbmNlbGxpbmcgXCIsIHNlbmRpZCwgXCIgd2l0aCB0aW1lb3V0IGlkIFwiLCB0aGlzLl90aW1lb3V0TWFwW3NlbmRpZF0pO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRNYXBbc2VuZGlkXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChuZXcgRXZlbnRFbWl0dGVyLHtcbiAgICBCYXNlSW50ZXJwcmV0ZXI6IEJhc2VJbnRlcnByZXRlcixcbiAgICBTdGF0ZWNoYXJ0OiBTdGF0ZWNoYXJ0LFxuICAgIEFycmF5U2V0IDogQXJyYXlTZXQsXG4gICAgU1RBVEVfVFlQRVMgOiBjb25zdGFudHMuU1RBVEVfVFlQRVMsXG4gICAgaW5pdGlhbGl6ZU1vZGVsIDogaW5pdGlhbGl6ZU1vZGVsLFxuICAgIEludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCA6IEludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dFxufSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gX29uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX2xpc3RlbmVyc1t0eXBlXSkpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gX29uY2UodHlwZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBfX29uY2UoKSB7XG4gICAgICAgIGZvciAodmFyIGFyZ3MgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLm9mZih0eXBlLCBfX29uY2UpO1xuICAgICAgICBsaXN0ZW5lci5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG5cbiAgICBfX29uY2UubGlzdGVuZXIgPSBsaXN0ZW5lcjtcblxuICAgIHJldHVybiB0aGlzLm9uKHR5cGUsIF9fb25jZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIF9vZmYodHlwZSwgbGlzdGVuZXIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5fbGlzdGVuZXJzW3R5cGVdKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyc1t0eXBlXVtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIF9lbWl0KHR5cGUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5fbGlzdGVuZXJzW3R5cGVdKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBhcmdzID0gW10sIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5mb3JFYWNoKGZ1bmN0aW9uIF9fZW1pdChsaXN0ZW5lcikge1xuICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIl19
