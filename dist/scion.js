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

BaseInterpreter.prototype = extend(beget(EventEmitter.prototype), {

    /** @expose */
    //cancel an invoked session
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

    /** @expose */
    getFullConfiguration: function getFullConfiguration() {
        return this._getFullConfiguration().map(function (s) {
            return s.id;
        });
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
 * @constructor
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
    /** @expose */
    BaseInterpreter: BaseInterpreter,
    /** @expose */
    Statechart: Statechart,
    /** @expose */
    ArraySet: ArraySet,
    /** @expose */
    STATE_TYPES: constants.STATE_TYPES,
    /** @expose */
    initializeModel: initializeModel,
    /** @expose */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQXJyYXlTZXQuanMiLCJsaWIvY29uc3RhbnRzLmpzIiwibGliL2hlbHBlcnMuanMiLCJsaWIvcXVlcnkuanMiLCJsaWIvc2Npb24uanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbnktZXZlbnRzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNqQixRQUFJLEtBQUssRUFBVDtBQUNBLFNBQUssQ0FBTCxHQUFTLElBQUksR0FBSixDQUFRLENBQVIsQ0FBVDtBQUNIOztBQUVELFNBQVMsU0FBVCxHQUFxQjs7QUFFakIsU0FBTSxhQUFTLENBQVQsRUFBWTtBQUNkLGFBQUssQ0FBTCxDQUFPLEdBQVAsQ0FBVyxDQUFYO0FBQ0gsS0FKZ0I7O0FBTWpCLFlBQVMsZ0JBQVMsQ0FBVCxFQUFZO0FBQ2pCLGVBQU8sS0FBSyxDQUFMLENBQU8sTUFBUCxDQUFjLENBQWQsQ0FBUDtBQUNILEtBUmdCOztBQVVqQixXQUFRLGVBQVMsQ0FBVCxFQUFZO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ2hCLGlDQUFjLEVBQUUsQ0FBaEIsOEhBQW1CO0FBQUEsb0JBQVYsQ0FBVTs7QUFDZixxQkFBSyxDQUFMLENBQU8sR0FBUCxDQUFXLENBQVg7QUFDSDtBQUhlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSWhCLGVB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBiZWdpbiBBcnJheVNldCAqL1xuXG4vKiogQGNvbnN0cnVjdG9yICovXG5mdW5jdGlvbiBBcnJheVNldChsKSB7XG4gICAgbCA9IGwgfHwgW107XG4gICAgdGhpcy5vID0gbmV3IFNldChsKTsgICAgICAgIFxufVxuXG5BcnJheVNldC5wcm90b3R5cGUgPSB7XG5cbiAgICBhZGQgOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHRoaXMuby5hZGQoeCk7XG4gICAgfSxcblxuICAgIHJlbW92ZSA6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5kZWxldGUoeCk7XG4gICAgfSxcblxuICAgIHVuaW9uIDogZnVuY3Rpb24obCkge1xuICAgICAgICBmb3IgKHZhciB2IG9mIGwubykge1xuICAgICAgICAgICAgdGhpcy5vLmFkZCh2KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZGlmZmVyZW5jZSA6IGZ1bmN0aW9uKGwpIHtcbiAgICAgICAgZm9yICh2YXIgdiBvZiBsLm8pIHtcbiAgICAgICAgICAgIHRoaXMuby5kZWxldGUodik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zIDogZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vLmhhcyh4KTtcbiAgICB9LFxuXG4gICAgaXRlciA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLm8pO1xuICAgIH0sXG5cbiAgICBpc0VtcHR5IDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5vLnNpemU7XG4gICAgfSxcblxuICAgIHNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vLnNpemU7XG4gICAgfSxcblxuICAgIGVxdWFscyA6IGZ1bmN0aW9uKHMyKSB7XG4gICAgICAgIGlmICh0aGlzLm8uc2l6ZSAhPT0gczIuc2l6ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciB2IG9mIHRoaXMubykge1xuICAgICAgICAgICAgaWYgKCFzMi5jb250YWlucyh2KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vLnNpemUgPT09IDAgPyAnPGVtcHR5PicgOiBBcnJheS5mcm9tKHRoaXMubykuam9pbignLFxcbicpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXlTZXQ7XG4iLCJ2YXIgU1RBVEVfVFlQRVMgPSB7XG4gICAgQkFTSUM6IDAsXG4gICAgQ09NUE9TSVRFOiAxLFxuICAgIFBBUkFMTEVMOiAyLFxuICAgIEhJU1RPUlk6IDMsXG4gICAgSU5JVElBTDogNCxcbiAgICBGSU5BTDogNVxufTtcblxuY29uc3QgU0NYTUxfSU9QUk9DRVNTT1JfVFlQRSA9ICdodHRwOi8vd3d3LnczLm9yZy9UUi9zY3htbC8jU0NYTUxFdmVudFByb2Nlc3NvcidcbmNvbnN0IEhUVFBfSU9QUk9DRVNTT1JfVFlQRSA9ICdodHRwOi8vd3d3LnczLm9yZy9UUi9zY3htbC8jQmFzaWNIVFRQRXZlbnRQcm9jZXNzb3InXG5jb25zdCBSWF9UUkFJTElOR19XSUxEQ0FSRCA9IC9cXC5cXCokLztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNUQVRFX1RZUEVTIDogU1RBVEVfVFlQRVMsXG4gIFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUgIDogU0NYTUxfSU9QUk9DRVNTT1JfVFlQRSxcbiAgSFRUUF9JT1BST0NFU1NPUl9UWVBFICA6IEhUVFBfSU9QUk9DRVNTT1JfVFlQRSwgXG4gIFJYX1RSQUlMSU5HX1dJTERDQVJEICA6IFJYX1RSQUlMSU5HX1dJTERDQVJEIFxufTtcbiIsImNvbnN0IGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyksXG4gICAgICBTVEFURV9UWVBFUyA9IGNvbnN0YW50cy5TVEFURV9UWVBFUyxcbiAgICAgIFJYX1RSQUlMSU5HX1dJTERDQVJEID0gY29uc3RhbnRzLlJYX1RSQUlMSU5HX1dJTERDQVJEO1xuXG5jb25zdCBwcmludFRyYWNlID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBleHRlbmQgOiBleHRlbmQsXG4gIHRyYW5zaXRpb25XaXRoVGFyZ2V0cyA6IHRyYW5zaXRpb25XaXRoVGFyZ2V0cyxcbiAgdHJhbnNpdGlvbkNvbXBhcmF0b3IgOiB0cmFuc2l0aW9uQ29tcGFyYXRvcixcbiAgaW5pdGlhbGl6ZU1vZGVsIDogaW5pdGlhbGl6ZU1vZGVsLFxuICBpc0V2ZW50UHJlZml4TWF0Y2ggOiBpc0V2ZW50UHJlZml4TWF0Y2gsXG4gIGlzVHJhbnNpdGlvbk1hdGNoIDogaXNUcmFuc2l0aW9uTWF0Y2gsXG4gIHNjeG1sUHJlZml4VHJhbnNpdGlvblNlbGVjdG9yIDogc2N4bWxQcmVmaXhUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGV2ZW50bGVzc1RyYW5zaXRpb25TZWxlY3RvciA6IGV2ZW50bGVzc1RyYW5zaXRpb25TZWxlY3RvcixcbiAgZ2V0VHJhbnNpdGlvbldpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5IDogZ2V0VHJhbnNpdGlvbldpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5LFxuICBzb3J0SW5FbnRyeU9yZGVyIDogc29ydEluRW50cnlPcmRlcixcbiAgZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA6IGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHksXG4gIGluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuIDogaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4sXG4gIGRlc2VyaWFsaXplU2VyaWFsaXplZENvbmZpZ3VyYXRpb24gOiBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uLFxuICBkZXNlcmlhbGl6ZUhpc3RvcnkgOiBkZXNlcmlhbGl6ZUhpc3Rvcnlcbn07XG5cbmZ1bmN0aW9uIGV4dGVuZCAodG8sIGZyb20pe1xuICBPYmplY3Qua2V5cyhmcm9tKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgIHRvW2tdID0gZnJvbVtrXTsgXG4gIH0pO1xuICByZXR1cm4gdG87XG59O1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uV2l0aFRhcmdldHModCl7XG4gICAgcmV0dXJuIHQudGFyZ2V0cztcbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkNvbXBhcmF0b3IodDEsIHQyKSB7XG4gICAgcmV0dXJuIHQxLmRvY3VtZW50T3JkZXIgLSB0Mi5kb2N1bWVudE9yZGVyO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplTW9kZWwocm9vdFN0YXRlKXtcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSBbXSwgaWRUb1N0YXRlTWFwID0gbmV3IE1hcCgpLCBkb2N1bWVudE9yZGVyID0gMDtcblxuXG4gICAgLy9UT0RPOiBuZWVkIHRvIGFkZCBmYWtlIGlkcyB0byBhbnlvbmUgdGhhdCBkb2Vzbid0IGhhdmUgdGhlbVxuICAgIC8vRklYTUU6IG1ha2UgdGhpcyBzYWZlciAtIGJyZWFrIGludG8gbXVsdGlwbGUgcGFzc2VzXG4gICAgdmFyIGlkQ291bnQgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlSWQodHlwZSl7XG4gICAgICAgIGlmKGlkQ291bnRbdHlwZV0gPT09IHVuZGVmaW5lZCkgaWRDb3VudFt0eXBlXSA9IDA7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgIHZhciBjb3VudCA9IGlkQ291bnRbdHlwZV0rKztcbiAgICAgICAgICB2YXIgaWQgPSAnJGdlbmVyYXRlZC0nICsgdHlwZSArICctJyArIGNvdW50OyBcbiAgICAgICAgfSB3aGlsZSAoaWRUb1N0YXRlTWFwLmhhcyhpZCkpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd3JhcEluRmFrZVJvb3RTdGF0ZShzdGF0ZSl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAkZGVzZXJpYWxpemVEYXRhbW9kZWwgOiBzdGF0ZS4kZGVzZXJpYWxpemVEYXRhbW9kZWwgfHwgZnVuY3Rpb24oKXt9LFxuICAgICAgICAgICAgJHNlcmlhbGl6ZURhdGFtb2RlbCA6IHN0YXRlLiRzZXJpYWxpemVEYXRhbW9kZWwgfHwgZnVuY3Rpb24oKXsgcmV0dXJuIG51bGw7fSxcbiAgICAgICAgICAgICRpZFRvU3RhdGVNYXAgOiBpZFRvU3RhdGVNYXAsICAgLy9rZWVwIHRoaXMgZm9yIGhhbmR5IGRlc2VyaWFsaXphdGlvbiBvZiBzZXJpYWxpemVkIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgIGRvY1VybCA6IHN0YXRlLmRvY1VybCxcbiAgICAgICAgICAgIHN0YXRlcyA6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICR0eXBlIDogJ2luaXRpYWwnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucyA6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgOiBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdGVcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzID0gW107XG5cbiAgICAvKipcbiAgICAgIEB0aGlzIHtTQ1RyYW5zaXRpb259XG4gICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc2l0aW9uVG9TdHJpbmcoc291cmNlU3RhdGUpe1xuICAgICAgcmV0dXJuIGAke3NvdXJjZVN0YXRlfSAtLSAke3RoaXMuZXZlbnRzID8gJygnICsgdGhpcy5ldmVudHMuam9pbignLCcpICsgJyknIDogbnVsbH0ke3RoaXMuY29uZCA/ICdbJyArIHRoaXMuY29uZC5uYW1lICsgJ10nIDogJyd9IC0tPiAke3RoaXMudGFyZ2V0cyA/IHRoaXMudGFyZ2V0cy5qb2luKCcsJykgOiBudWxsfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICBAdGhpcyB7U0NTdGF0ZX1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIHN0YXRlVG9TdHJpbmcoKXtcbiAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvcHVsYXRlU3RhdGVJZE1hcChzdGF0ZSl7XG4gICAgICAvL3BvcHVsYXRlIHN0YXRlIGlkIG1hcFxuICAgICAgaWYoc3RhdGUuaWQpe1xuICAgICAgICAgIGlkVG9TdGF0ZU1hcC5zZXQoc3RhdGUuaWQsIHN0YXRlKTtcbiAgICAgIH1cblxuICAgICAgaWYoc3RhdGUuc3RhdGVzKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlLnN0YXRlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICBwb3B1bGF0ZVN0YXRlSWRNYXAoc3RhdGUuc3RhdGVzW2pdKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhdmVyc2UoYW5jZXN0b3JzLHN0YXRlKXtcblxuICAgICAgICBpZihwcmludFRyYWNlKSBzdGF0ZS50b1N0cmluZyA9IHN0YXRlVG9TdHJpbmc7XG5cbiAgICAgICAgLy9hZGQgdG8gZ2xvYmFsIHRyYW5zaXRpb24gYW5kIHN0YXRlIGlkIGNhY2hlc1xuICAgICAgICBpZihzdGF0ZS50cmFuc2l0aW9ucykgdHJhbnNpdGlvbnMucHVzaC5hcHBseSh0cmFuc2l0aW9ucyxzdGF0ZS50cmFuc2l0aW9ucyk7XG5cbiAgICAgICAgLy9jcmVhdGUgYSBkZWZhdWx0IHR5cGUsIGp1c3QgdG8gbm9ybWFsaXplIHRoaW5nc1xuICAgICAgICAvL3RoaXMgd2F5IHdlIGNhbiBjaGVjayBmb3IgdW5zdXBwb3J0ZWQgdHlwZXMgYmVsb3dcbiAgICAgICAgc3RhdGUuJHR5cGUgPSBzdGF0ZS4kdHlwZSB8fCAnc3RhdGUnO1xuXG4gICAgICAgIC8vYWRkIGFuY2VzdG9ycyBhbmQgZGVwdGggcHJvcGVydGllc1xuICAgICAgICBzdGF0ZS5hbmNlc3RvcnMgPSBhbmNlc3RvcnM7XG4gICAgICAgIHN0YXRlLmRlcHRoID0gYW5jZXN0b3JzLmxlbmd0aDtcbiAgICAgICAgc3RhdGUucGFyZW50ID0gYW5jZXN0b3JzWzBdO1xuICAgICAgICBzdGF0ZS5kb2N1bWVudE9yZGVyID0gZG9jdW1lbnRPcmRlcisrOyBcblxuICAgICAgICAvL2FkZCBzb21lIGluZm9ybWF0aW9uIHRvIHRyYW5zaXRpb25zXG4gICAgICAgIHN0YXRlLnRyYW5zaXRpb25zID0gc3RhdGUudHJhbnNpdGlvbnMgfHwgW107XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZS50cmFuc2l0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb24gPSBzdGF0ZS50cmFuc2l0aW9uc1tqXTtcbiAgICAgICAgICAgIHRyYW5zaXRpb24uZG9jdW1lbnRPcmRlciA9IGRvY3VtZW50T3JkZXIrKzsgXG4gICAgICAgICAgICB0cmFuc2l0aW9uLnNvdXJjZSA9IHN0YXRlO1xuICAgICAgICAgICAgaWYocHJpbnRUcmFjZSkgdHJhbnNpdGlvbi50b1N0cmluZyA9IHRyYW5zaXRpb25Ub1N0cmluZy5iaW5kKHRyYW5zaXRpb24sIHN0YXRlKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvL3JlY3Vyc2l2ZSBzdGVwXG4gICAgICAgIGlmKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgICAgdmFyIGFuY3MgPSBbc3RhdGVdLmNvbmNhdChhbmNlc3RvcnMpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlLnN0YXRlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIHRyYXZlcnNlKGFuY3MsIHN0YXRlLnN0YXRlc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL3NldHVwIGZhc3Qgc3RhdGUgdHlwZVxuICAgICAgICBzd2l0Y2goc3RhdGUuJHR5cGUpe1xuICAgICAgICAgICAgY2FzZSAncGFyYWxsZWwnOlxuICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuUEFSQUxMRUw7XG4gICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2luaXRpYWwnIDogXG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5JTklUSUFMO1xuICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2hpc3RvcnknIDpcbiAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9IFNUQVRFX1RZUEVTLkhJU1RPUlk7XG4gICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZmluYWwnIDogXG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5GSU5BTDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5pc0F0b21pYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGF0ZScgOiBcbiAgICAgICAgICAgIGNhc2UgJ3NjeG1sJyA6XG4gICAgICAgICAgICAgICAgaWYoc3RhdGUuc3RhdGVzICYmIHN0YXRlLnN0YXRlcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9IFNUQVRFX1RZUEVTLkNPTVBPU0lURTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5CQVNJQztcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBzdGF0ZSB0eXBlOiAnICsgc3RhdGUuJHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kZXNjZW5kYW50cyBwcm9wZXJ0eSBvbiBzdGF0ZXMgd2lsbCBub3cgYmUgcG9wdWxhdGVkLiBhZGQgZGVzY2VuZGFudHMgdG8gdGhpcyBzdGF0ZVxuICAgICAgICBpZihzdGF0ZS5zdGF0ZXMpe1xuICAgICAgICAgICAgc3RhdGUuZGVzY2VuZGFudHMgPSBzdGF0ZS5zdGF0ZXMuY29uY2F0KHN0YXRlLnN0YXRlcy5tYXAoZnVuY3Rpb24ocyl7cmV0dXJuIHMuZGVzY2VuZGFudHM7fSkucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuY29uY2F0KGIpO30sW10pKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBzdGF0ZS5kZXNjZW5kYW50cyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluaXRpYWxDaGlsZHJlbjtcbiAgICAgICAgaWYoc3RhdGUudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLkNPTVBPU0lURSl7XG4gICAgICAgICAgICAvL3NldCB1cCBpbml0aWFsIHN0YXRlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkoc3RhdGUuaW5pdGlhbCkgfHwgdHlwZW9mIHN0YXRlLmluaXRpYWwgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgICAgICBzdGF0ZXNXaXRoSW5pdGlhbEF0dHJpYnV0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAvL3Rha2UgdGhlIGZpcnN0IGNoaWxkIHRoYXQgaGFzIGluaXRpYWwgdHlwZSwgb3IgZmlyc3QgY2hpbGRcbiAgICAgICAgICAgICAgICBpbml0aWFsQ2hpbGRyZW4gPSBzdGF0ZS5zdGF0ZXMuZmlsdGVyKGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLiR0eXBlID09PSAnaW5pdGlhbCc7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS5pbml0aWFsUmVmID0gW2luaXRpYWxDaGlsZHJlbi5sZW5ndGggPyBpbml0aWFsQ2hpbGRyZW5bMF0gOiBzdGF0ZS5zdGF0ZXNbMF1dO1xuICAgICAgICAgICAgICAgIGNoZWNrSW5pdGlhbFJlZihzdGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vaG9vayB1cCBoaXN0b3J5XG4gICAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBTVEFURV9UWVBFUy5DT01QT1NJVEUgfHxcbiAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuUEFSQUxMRUwpe1xuXG4gICAgICAgICAgICB2YXIgaGlzdG9yeUNoaWxkcmVuID0gc3RhdGUuc3RhdGVzLmZpbHRlcihmdW5jdGlvbihzKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcy4kdHlwZSA9PT0gJ2hpc3RvcnknO1xuICAgICAgICAgICAgfSk7IFxuXG4gICAgICAgICAgIHN0YXRlLmhpc3RvcnlSZWYgPSBoaXN0b3J5Q2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICAvL25vdyBpdCdzIHNhZmUgdG8gZmlsbCBpbiBmYWtlIHN0YXRlIGlkc1xuICAgICAgICBpZighc3RhdGUuaWQpe1xuICAgICAgICAgICAgc3RhdGUuaWQgPSBnZW5lcmF0ZUlkKHN0YXRlLiR0eXBlKTtcbiAgICAgICAgICAgIGlkVG9TdGF0ZU1hcC5zZXQoc3RhdGUuaWQsIHN0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vbm9ybWFsaXplIG9uRW50cnkvb25FeGl0LCB3aGljaCBjYW4gYmUgc2luZ2xlIGZuIG9yIGFycmF5LCBvciBhcnJheSBvZiBhcnJheXMgKGJsb2NrcylcbiAgICAgICAgWydvbkVudHJ5Jywnb25FeGl0J10uZm9yRWFjaChmdW5jdGlvbihwcm9wKXtcbiAgICAgICAgICBpZiAoc3RhdGVbcHJvcF0pIHtcbiAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KHN0YXRlW3Byb3BdKSl7XG4gICAgICAgICAgICAgIHN0YXRlW3Byb3BdID0gW3N0YXRlW3Byb3BdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFzdGF0ZVtwcm9wXS5ldmVyeShmdW5jdGlvbihoYW5kbGVyKXsgcmV0dXJuIEFycmF5LmlzQXJyYXkoaGFuZGxlcik7IH0pKXtcbiAgICAgICAgICAgICAgc3RhdGVbcHJvcF0gPSBbc3RhdGVbcHJvcF1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHN0YXRlLmludm9rZXMgJiYgIUFycmF5LmlzQXJyYXkoc3RhdGUuaW52b2tlcykpIHtcbiAgICAgICAgICAgIHN0YXRlLmludm9rZXMgPSBbc3RhdGUuaW52b2tlc107XG4gICAgICAgICAgICBzdGF0ZS5pbnZva2VzLmZvckVhY2goIGludm9rZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpbnZva2UuZmluYWxpemUgJiYgIUFycmF5LmlzQXJyYXkoaW52b2tlLmZpbmFsaXplKSkge1xuICAgICAgICAgICAgICAgIGludm9rZS5maW5hbGl6ZSA9IFtpbnZva2UuZmluYWxpemVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9UT0RPOiBjb252ZXJ0IGV2ZW50cyB0byByZWd1bGFyIGV4cHJlc3Npb25zIGluIGFkdmFuY2VcblxuICAgIGZ1bmN0aW9uIGNoZWNrSW5pdGlhbFJlZihzdGF0ZSl7XG4gICAgICBpZighc3RhdGUuaW5pdGlhbFJlZikgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gbG9jYXRlIGluaXRpYWwgc3RhdGUgZm9yIGNvbXBvc2l0ZSBzdGF0ZTogJyArIHN0YXRlLmlkKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29ubmVjdEludGlhbEF0dHJpYnV0ZXMoKXtcbiAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZXNXaXRoSW5pdGlhbEF0dHJpYnV0ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgdmFyIHMgPSBzdGF0ZXNXaXRoSW5pdGlhbEF0dHJpYnV0ZXNbal07XG5cbiAgICAgICAgdmFyIGluaXRpYWxTdGF0ZXMgPSBBcnJheS5pc0FycmF5KHMuaW5pdGlhbCkgPyBzLmluaXRpYWwgOiBbcy5pbml0aWFsXTtcbiAgICAgICAgcy5pbml0aWFsUmVmID0gaW5pdGlhbFN0YXRlcy5tYXAoZnVuY3Rpb24oaW5pdGlhbFN0YXRlKXsgcmV0dXJuIGlkVG9TdGF0ZU1hcC5nZXQoaW5pdGlhbFN0YXRlKTsgfSk7XG4gICAgICAgIGNoZWNrSW5pdGlhbFJlZihzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUlhfV0hJVEVTUEFDRSA9IC9cXHMrLztcblxuICAgIGZ1bmN0aW9uIGNvbm5lY3RUcmFuc2l0aW9uR3JhcGgoKXtcbiAgICAgICAgLy9ub3JtYWxpemUgYXMgd2l0aCBvbkVudHJ5L29uRXhpdFxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdHJhbnNpdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ID0gdHJhbnNpdGlvbnNbaV07XG4gICAgICAgICAgICBpZiAodC5vblRyYW5zaXRpb24gJiYgIUFycmF5LmlzQXJyYXkodC5vblRyYW5zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdC5vblRyYW5zaXRpb24gPSBbdC5vblRyYW5zaXRpb25dO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL25vcm1hbGl6ZSBcImV2ZW50XCIgYXR0cmlidXRlIGludG8gXCJldmVudHNcIiBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdC5ldmVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0LmV2ZW50cyA9IHQuZXZlbnQudHJpbSgpLnNwbGl0KFJYX1dISVRFU1BBQ0UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIHQuZXZlbnQ7XG5cbiAgICAgICAgICAgIGlmKHQudGFyZ2V0cyB8fCAodHlwZW9mIHQudGFyZ2V0ID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICAvL3RhcmdldHMgaGF2ZSBhbHJlYWR5IGJlZW4gc2V0IHVwXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9ICAgXG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiB0LnRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBpZFRvU3RhdGVNYXAuZ2V0KHQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZighdGFyZ2V0KSB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIHRhcmdldCBzdGF0ZSB3aXRoIGlkICcgKyB0LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdC50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgdC50YXJnZXRzID0gW3QudGFyZ2V0XTtcbiAgICAgICAgICAgIH1lbHNlIGlmKEFycmF5LmlzQXJyYXkodC50YXJnZXQpKXtcbiAgICAgICAgICAgICAgICB0LnRhcmdldHMgPSB0LnRhcmdldC5tYXAoZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gaWRUb1N0YXRlTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRhcmdldCkgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCB0YXJnZXQgc3RhdGUgd2l0aCBpZCAnICsgdC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiB0LnRhcmdldCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgIHQudGFyZ2V0cyA9IFt0LnRhcmdldF07XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zaXRpb24gdGFyZ2V0IGhhcyB1bmtub3duIHR5cGU6ICcgKyB0LnRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2hvb2sgdXAgTENBIC0gb3B0aW1pemF0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0cmFuc2l0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIHQgPSB0cmFuc2l0aW9uc1tpXTtcbiAgICAgICAgICAgIGlmKHQudGFyZ2V0cykgdC5sY2NhID0gZ2V0TENDQSh0LnNvdXJjZSx0LnRhcmdldHNbMF0pOyAgICAvL0ZJWE1FOiB3ZSB0ZWNobmljYWxseSBkbyBub3QgbmVlZCB0byBoYW5nIG9udG8gdGhlIGxjY2EuIG9ubHkgdGhlIHNjb3BlIGlzIHVzZWQgYnkgdGhlIGFsZ29yaXRobVxuXG4gICAgICAgICAgICB0LnNjb3BlID0gZ2V0U2NvcGUodCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTY29wZSh0cmFuc2l0aW9uKXtcbiAgICAgICAgLy9UcmFuc2l0aW9uIHNjb3BlIGlzIG5vcm1hbGx5IHRoZSBsZWFzdCBjb21tb24gY29tcG91bmQgYW5jZXN0b3IgKGxjY2EpLlxuICAgICAgICAvL0ludGVybmFsIHRyYW5zaXRpb25zIGhhdmUgYSBzY29wZSBlcXVhbCB0byB0aGUgc291cmNlIHN0YXRlLlxuICAgICAgICB2YXIgdHJhbnNpdGlvbklzUmVhbGx5SW50ZXJuYWwgPSBcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnR5cGUgPT09ICdpbnRlcm5hbCcgJiZcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24uc291cmNlLnR5cGVFbnVtID09PSBTVEFURV9UWVBFUy5DT01QT1NJVEUgJiYgICAvL2lzIHRyYW5zaXRpb24gc291cmNlIGEgY29tcG9zaXRlIHN0YXRlXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnNvdXJjZS5wYXJlbnQgJiYgICAgLy9yb290IHN0YXRlIHdvbid0IGhhdmUgcGFyZW50XG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnRhcmdldHMgJiYgLy9kb2VzIGl0IHRhcmdldCBpdHMgZGVzY2VuZGFudHNcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24udGFyZ2V0cy5ldmVyeShcbiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih0YXJnZXQpeyByZXR1cm4gdHJhbnNpdGlvbi5zb3VyY2UuZGVzY2VuZGFudHMuaW5kZXhPZih0YXJnZXQpID4gLTE7fSk7XG5cbiAgICAgICAgaWYoIXRyYW5zaXRpb24udGFyZ2V0cyl7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfWVsc2UgaWYodHJhbnNpdGlvbklzUmVhbGx5SW50ZXJuYWwpe1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24uc291cmNlOyBcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbi5sY2NhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TENDQShzMSwgczIpIHtcbiAgICAgICAgdmFyIGNvbW1vbkFuY2VzdG9ycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gczEuYW5jZXN0b3JzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICB2YXIgYW5jID0gczEuYW5jZXN0b3JzW2pdO1xuICAgICAgICAgICAgaWYoKGFuYy50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuQ09NUE9TSVRFIHx8IGFuYy50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuUEFSQUxMRUwpICYmXG4gICAgICAgICAgICAgICAgYW5jLmRlc2NlbmRhbnRzLmluZGV4T2YoczIpID4gLTEpe1xuICAgICAgICAgICAgICAgIGNvbW1vbkFuY2VzdG9ycy5wdXNoKGFuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmKCFjb21tb25BbmNlc3RvcnMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZmluZCBMQ0EgZm9yIHN0YXRlcy5cIik7XG4gICAgICAgIHJldHVybiBjb21tb25BbmNlc3RvcnNbMF07XG4gICAgfVxuXG4gICAgLy9tYWluIGV4ZWN1dGlvbiBzdGFydHMgaGVyZVxuICAgIC8vRklYTUU6IG9ubHkgd3JhcCBpbiByb290IHN0YXRlIGlmIGl0J3Mgbm90IGEgY29tcG91bmQgc3RhdGVcbiAgICBwb3B1bGF0ZVN0YXRlSWRNYXAocm9vdFN0YXRlKTtcbiAgICB2YXIgZmFrZVJvb3RTdGF0ZSA9IHdyYXBJbkZha2VSb290U3RhdGUocm9vdFN0YXRlKTsgIC8vSSB3aXNoIHdlIGhhZCBwb2ludGVyIHNlbWFudGljcyBhbmQgY291bGQgbWFrZSB0aGlzIGEgQy1zdHlsZSBcIm91dCBhcmd1bWVudFwiLiBJbnN0ZWFkIHdlIHJldHVybiBoaW1cbiAgICB0cmF2ZXJzZShbXSxmYWtlUm9vdFN0YXRlKTtcbiAgICBjb25uZWN0VHJhbnNpdGlvbkdyYXBoKCk7XG4gICAgY29ubmVjdEludGlhbEF0dHJpYnV0ZXMoKTtcblxuICAgIHJldHVybiBmYWtlUm9vdFN0YXRlO1xufVxuXG5cbmZ1bmN0aW9uIGlzRXZlbnRQcmVmaXhNYXRjaChwcmVmaXgsIGZ1bGxOYW1lKSB7XG4gICAgcHJlZml4ID0gcHJlZml4LnJlcGxhY2UoUlhfVFJBSUxJTkdfV0lMRENBUkQsICcnKTtcblxuICAgIGlmIChwcmVmaXggPT09IGZ1bGxOYW1lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXgubGVuZ3RoID4gZnVsbE5hbWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnVsbE5hbWUuY2hhckF0KHByZWZpeC5sZW5ndGgpICE9PSAnLicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAoZnVsbE5hbWUuaW5kZXhPZihwcmVmaXgpID09PSAwKTtcbn1cblxuZnVuY3Rpb24gaXNUcmFuc2l0aW9uTWF0Y2godCwgZXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIHQuZXZlbnRzLnNvbWUoKHRFdmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gdEV2ZW50ID09PSAnKicgfHwgaXNFdmVudFByZWZpeE1hdGNoKHRFdmVudCwgZXZlbnROYW1lKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2N4bWxQcmVmaXhUcmFuc2l0aW9uU2VsZWN0b3IodCwgZXZlbnQsIGV2YWx1YXRvciwgc2VsZWN0RXZlbnRsZXNzVHJhbnNpdGlvbnMpIHtcbiAgICByZXR1cm4gKCBcbiAgICAgIHNlbGVjdEV2ZW50bGVzc1RyYW5zaXRpb25zID8gXG4gICAgICAgICF0LmV2ZW50cyA6XG4gICAgICAgICh0LmV2ZW50cyAmJiBldmVudCAmJiBldmVudC5uYW1lICYmIGlzVHJhbnNpdGlvbk1hdGNoKHQsIGV2ZW50Lm5hbWUpKVxuICAgICAgKVxuICAgICAgJiYgKCF0LmNvbmQgfHwgZXZhbHVhdG9yKHQuY29uZCkpO1xufVxuXG5mdW5jdGlvbiBldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3Ioc3RhdGUpe1xuICByZXR1cm4gc3RhdGUudHJhbnNpdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKHRyYW5zaXRpb24peyByZXR1cm4gIXRyYW5zaXRpb24uZXZlbnRzIHx8ICggdHJhbnNpdGlvbi5ldmVudHMgJiYgdHJhbnNpdGlvbi5ldmVudHMubGVuZ3RoID09PSAwICk7IH0pO1xufVxuXG4vL3ByaW9yaXR5IGNvbXBhcmlzb24gZnVuY3Rpb25zXG5mdW5jdGlvbiBnZXRUcmFuc2l0aW9uV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkoX2FyZ3MpIHtcbiAgICBsZXQgdDEgPSBfYXJnc1swXSwgdDIgPSBfYXJnc1sxXTtcbiAgICB2YXIgciA9IGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkodDEuc291cmNlLCB0Mi5zb3VyY2UpO1xuICAgIC8vY29tcGFyZSB0cmFuc2l0aW9ucyBiYXNlZCBmaXJzdCBvbiBkZXB0aCwgdGhlbiBiYXNlZCBvbiBkb2N1bWVudCBvcmRlclxuICAgIGlmICh0MS5zb3VyY2UuZGVwdGggPCB0Mi5zb3VyY2UuZGVwdGgpIHtcbiAgICAgICAgcmV0dXJuIHQyO1xuICAgIH0gZWxzZSBpZiAodDIuc291cmNlLmRlcHRoIDwgdDEuc291cmNlLmRlcHRoKSB7XG4gICAgICAgIHJldHVybiB0MTtcbiAgICB9IGVsc2Uge1xuICAgICAgIGlmICh0MS5kb2N1bWVudE9yZGVyIDwgdDIuZG9jdW1lbnRPcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHQxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHQyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzb3J0SW5FbnRyeU9yZGVyKHMxLCBzMil7XG4gIHJldHVybiBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KHMxLCBzMikgKiAtMVxufVxuXG5mdW5jdGlvbiBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KHMxLCBzMikge1xuICAgIC8vY29tcGFyZSBzdGF0ZXMgYmFzZWQgZmlyc3Qgb24gZGVwdGgsIHRoZW4gYmFzZWQgb24gZG9jdW1lbnQgb3JkZXJcbiAgICBpZiAoczEuZGVwdGggPiBzMi5kZXB0aCkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfSBlbHNlIGlmIChzMS5kZXB0aCA8IHMyLmRlcHRoKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vRXF1YWxpdHlcbiAgICAgICAgaWYgKHMxLmRvY3VtZW50T3JkZXIgPCBzMi5kb2N1bWVudE9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChzMS5kb2N1bWVudE9yZGVyID4gczIuZG9jdW1lbnRPcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4obW9kZWxGbiwgb3B0cywgaW50ZXJwcmV0ZXIpe1xuICAgIHJldHVybiBtb2RlbEZuLmNhbGwoaW50ZXJwcmV0ZXIsXG4gICAgICAgIG9wdHMuX3gsXG4gICAgICAgIG9wdHMuX3guX3Nlc3Npb25pZCxcbiAgICAgICAgb3B0cy5feC5faW9wcm9jZXNzb3JzLFxuICAgICAgICBpbnRlcnByZXRlci5pc0luLmJpbmQoaW50ZXJwcmV0ZXIpKTtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVTZXJpYWxpemVkQ29uZmlndXJhdGlvbihzZXJpYWxpemVkQ29uZmlndXJhdGlvbixpZFRvU3RhdGVNYXApe1xuICByZXR1cm4gc2VyaWFsaXplZENvbmZpZ3VyYXRpb24ubWFwKGZ1bmN0aW9uKGlkKXtcbiAgICB2YXIgc3RhdGUgPSBpZFRvU3RhdGVNYXAuZ2V0KGlkKTtcbiAgICBpZighc3RhdGUpIHRocm93IG5ldyBFcnJvcignRXJyb3IgbG9hZGluZyBzZXJpYWxpemVkIGNvbmZpZ3VyYXRpb24uIFVuYWJsZSB0byBsb2NhdGUgc3RhdGUgd2l0aCBpZCAnICsgaWQpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplSGlzdG9yeShzZXJpYWxpemVkSGlzdG9yeSxpZFRvU3RhdGVNYXApe1xuICB2YXIgbyA9IHt9O1xuICBPYmplY3Qua2V5cyhzZXJpYWxpemVkSGlzdG9yeSkuZm9yRWFjaChmdW5jdGlvbihzaWQpe1xuICAgIG9bc2lkXSA9IHNlcmlhbGl6ZWRIaXN0b3J5W3NpZF0ubWFwKGZ1bmN0aW9uKGlkKXtcbiAgICAgIHZhciBzdGF0ZSA9IGlkVG9TdGF0ZU1hcC5nZXQoaWQpO1xuICAgICAgaWYoIXN0YXRlKSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGxvYWRpbmcgc2VyaWFsaXplZCBoaXN0b3J5LiBVbmFibGUgdG8gbG9jYXRlIHN0YXRlIHdpdGggaWQgJyArIGlkKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBvO1xufVxuXG4iLCIvL21vZGVsIGFjY2Vzc29yIGZ1bmN0aW9uc1xuY29uc3QgcXVlcnkgPSB7XG4gICAgaXNEZXNjZW5kYW50IDogZnVuY3Rpb24oczEsIHMyKXtcbiAgICAgIC8vUmV0dXJucyAndHJ1ZScgaWYgc3RhdGUxIGlzIGEgZGVzY2VuZGFudCBvZiBzdGF0ZTIgKGEgY2hpbGQsIG9yIGEgY2hpbGQgb2YgYSBjaGlsZCwgb3IgYSBjaGlsZCBvZiBhIGNoaWxkIG9mIGEgY2hpbGQsIGV0Yy4pIE90aGVyd2lzZSByZXR1cm5zICdmYWxzZScuXG4gICAgICByZXR1cm4gczIuZGVzY2VuZGFudHMuaW5kZXhPZihzMSkgPiAtMTtcbiAgICB9LFxuICAgIGdldEFuY2VzdG9yczogZnVuY3Rpb24ocywgcm9vdCkge1xuICAgICAgICB2YXIgYW5jZXN0b3JzLCBpbmRleCwgc3RhdGU7XG4gICAgICAgIGluZGV4ID0gcy5hbmNlc3RvcnMuaW5kZXhPZihyb290KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBzLmFuY2VzdG9ycy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcy5hbmNlc3RvcnM7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldEFuY2VzdG9yc09yU2VsZjogZnVuY3Rpb24ocywgcm9vdCkge1xuICAgICAgICByZXR1cm4gW3NdLmNvbmNhdChxdWVyeS5nZXRBbmNlc3RvcnMocywgcm9vdCkpO1xuICAgIH0sXG4gICAgZ2V0RGVzY2VuZGFudHNPclNlbGY6IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIFtzXS5jb25jYXQocy5kZXNjZW5kYW50cyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBxdWVyeTtcbiIsIi8vICAgQ29weXJpZ2h0IDIwMTItMjAxMiBKYWNvYiBCZWFyZCwgSU5GSUNPTiwgYW5kIG90aGVyIFNDSU9OIGNvbnRyaWJ1dG9yc1xuLy9cbi8vICAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vICAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyAgIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vICAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vICAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZXZlbnRzJykuRXZlbnRFbWl0dGVyLFxuICB1dGlsID0gcmVxdWlyZSgndXRpbCcpLFxuICBBcnJheVNldCA9IHJlcXVpcmUoJy4vQXJyYXlTZXQnKSxcbiAgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKSxcbiAgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpLFxuICBxdWVyeSA9IHJlcXVpcmUoJy4vcXVlcnknKSxcbiAgZXh0ZW5kID0gaGVscGVycy5leHRlbmQsXG4gIHRyYW5zaXRpb25XaXRoVGFyZ2V0cyA9IGhlbHBlcnMudHJhbnNpdGlvbldpdGhUYXJnZXRzLFxuICB0cmFuc2l0aW9uQ29tcGFyYXRvciA9IGhlbHBlcnMudHJhbnNpdGlvbkNvbXBhcmF0b3IsXG4gIGluaXRpYWxpemVNb2RlbCA9IGhlbHBlcnMuaW5pdGlhbGl6ZU1vZGVsLFxuICBpc0V2ZW50UHJlZml4TWF0Y2ggPSBoZWxwZXJzLmlzRXZlbnRQcmVmaXhNYXRjaCxcbiAgaXNUcmFuc2l0aW9uTWF0Y2ggPSBoZWxwZXJzLmlzVHJhbnNpdGlvbk1hdGNoLFxuICBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvciA9IGhlbHBlcnMuc2N4bWxQcmVmaXhUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGV2ZW50bGVzc1RyYW5zaXRpb25TZWxlY3RvciA9IGhlbHBlcnMuZXZlbnRsZXNzVHJhbnNpdGlvblNlbGVjdG9yLFxuICBnZXRUcmFuc2l0aW9uV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkgPSBoZWxwZXJzLmdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgc29ydEluRW50cnlPcmRlciA9IGhlbHBlcnMuc29ydEluRW50cnlPcmRlcixcbiAgZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA9IGhlbHBlcnMuZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4gPSBoZWxwZXJzLmluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuLFxuICBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uID0gaGVscGVycy5kZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uLFxuICBkZXNlcmlhbGl6ZUhpc3RvcnkgPSBoZWxwZXJzLmRlc2VyaWFsaXplSGlzdG9yeSxcbiAgQkFTSUMgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuQkFTSUMsXG4gIENPTVBPU0lURSA9IGNvbnN0YW50cy5TVEFURV9UWVBFUy5DT01QT1NJVEUsXG4gIFBBUkFMTEVMID0gY29uc3RhbnRzLlNUQVRFX1RZUEVTLlBBUkFMTEVMLFxuICBISVNUT1JZID0gY29uc3RhbnRzLlNUQVRFX1RZUEVTLkhJU1RPUlksXG4gIElOSVRJQUwgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuSU5JVElBTCxcbiAgRklOQUwgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuRklOQUwsXG4gIFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUgID0gY29uc3RhbnRzLlNDWE1MX0lPUFJPQ0VTU09SX1RZUEU7XG5cbmNvbnN0IHByaW50VHJhY2UgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgISFwcm9jZXNzLmVudi5ERUJVRztcblxuQmFzZUludGVycHJldGVyLkVWRU5UUyA9IFtcbiAgJ29uRW50cnknLFxuICAnb25FeGl0JyxcbiAgJ29uVHJhbnNpdGlvbicsXG4gICdvbkRlZmF1bHRFbnRyeScsXG4gICdvbkVycm9yJyxcbiAgJ29uQmlnU3RlcEJlZ2luJyxcbiAgJ29uQmlnU3RlcEVuZCcsXG4gICdvbkJpZ1N0ZXBTdXNwZW5kJyxcbiAgJ29uQmlnU3RlcFJlc3VtZScsXG4gICdvblNtYWxsU3RlcEJlZ2luJyxcbiAgJ29uU21hbGxTdGVwRW5kJyxcbiAgJ29uQmlnU3RlcEVuZCcsXG4gICdvbkV4aXRJbnRlcnByZXRlcidcbl07XG5cbi8qKiBAY29uc3RydWN0b3IgKi9cbmZ1bmN0aW9uIEJhc2VJbnRlcnByZXRlcihtb2RlbE9yRm5HZW5lcmF0b3IsIG9wdHMpe1xuXG4gICAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0ID0gb3B0cy5pbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgfHwgKG9wdHMuSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0ID8gbmV3IG9wdHMuSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0KHRoaXMpIDoge30pOyBcblxuXG4gICAgdGhpcy5vcHRzID0gb3B0cyB8fCB7fTtcblxuICAgIHRoaXMub3B0cy5nZW5lcmF0ZVNlc3Npb25pZCA9IHRoaXMub3B0cy5nZW5lcmF0ZVNlc3Npb25pZCB8fCBCYXNlSW50ZXJwcmV0ZXIuZ2VuZXJhdGVTZXNzaW9uaWQ7XG4gICAgdGhpcy5vcHRzLnNlc3Npb25pZCA9IHRoaXMub3B0cy5zZXNzaW9uaWQgfHwgdGhpcy5vcHRzLmdlbmVyYXRlU2Vzc2lvbmlkKCk7XG4gICAgdGhpcy5vcHRzLnNlc3Npb25SZWdpc3RyeSA9IHRoaXMub3B0cy5zZXNzaW9uUmVnaXN0cnkgfHwgQmFzZUludGVycHJldGVyLnNlc3Npb25SZWdpc3RyeTsgIC8vVE9ETzogZGVmaW5lIGEgYmV0dGVyIGludGVyZmFjZS4gRm9yIG5vdywgYXNzdW1lIGEgTWFwPHNlc3Npb25pZCwgc2Vzc2lvbj5cblxuXG4gICAgbGV0IF9pb3Byb2Nlc3NvcnMgPSB7fTtcbiAgICBfaW9wcm9jZXNzb3JzW1NDWE1MX0lPUFJPQ0VTU09SX1RZUEVdID0ge1xuICAgICAgbG9jYXRpb24gOiBgI19zY3htbF8ke3RoaXMub3B0cy5zZXNzaW9uaWR9YFxuICAgIH1cbiAgICBfaW9wcm9jZXNzb3JzLnNjeG1sID0gX2lvcHJvY2Vzc29yc1tTQ1hNTF9JT1BST0NFU1NPUl9UWVBFXTsgICAgLy9hbGlhc1xuXG4gICAgLy9TQ1hNTCBzeXN0ZW0gdmFyaWFibGVzOlxuICAgIG9wdHMuX3ggPSB7XG4gICAgICAgIF9zZXNzaW9uaWQgOiBvcHRzLnNlc3Npb25pZCxcbiAgICAgICAgX2lvcHJvY2Vzc29ycyA6IF9pb3Byb2Nlc3NvcnNcbiAgICB9O1xuXG5cbiAgICB2YXIgbW9kZWw7XG4gICAgaWYodHlwZW9mIG1vZGVsT3JGbkdlbmVyYXRvciA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIG1vZGVsID0gaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4obW9kZWxPckZuR2VuZXJhdG9yLCBvcHRzLCB0aGlzKTtcbiAgICB9ZWxzZSBpZih0eXBlb2YgbW9kZWxPckZuR2VuZXJhdG9yID09PSAnb2JqZWN0Jyl7XG4gICAgICAgIG1vZGVsID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtb2RlbE9yRm5HZW5lcmF0b3IpKTsgLy9hc3N1bWUgb2JqZWN0XG4gICAgfWVsc2V7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBtb2RlbCB0eXBlLiBFeHBlY3RlZCBtb2RlbCBmYWN0b3J5IGZ1bmN0aW9uLCBvciBzY2pzb24gb2JqZWN0LicpO1xuICAgIH1cblxuICAgIHRoaXMuX21vZGVsID0gaW5pdGlhbGl6ZU1vZGVsKG1vZGVsKTtcblxuICAgIHRoaXMub3B0cy5jb25zb2xlID0gb3B0cy5jb25zb2xlIHx8ICh0eXBlb2YgY29uc29sZSA9PT0gJ3VuZGVmaW5lZCcgPyB7bG9nIDogZnVuY3Rpb24oKXt9fSA6IGNvbnNvbGUpOyAgIC8vcmVseSBvbiBnbG9iYWwgY29uc29sZSBpZiB0aGlzIGNvbnNvbGUgaXMgdW5kZWZpbmVkXG4gICAgdGhpcy5vcHRzLlNldCA9IHRoaXMub3B0cy5TZXQgfHwgQXJyYXlTZXQ7XG4gICAgdGhpcy5vcHRzLnByaW9yaXR5Q29tcGFyaXNvbkZuID0gdGhpcy5vcHRzLnByaW9yaXR5Q29tcGFyaXNvbkZuIHx8IGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eTtcbiAgICB0aGlzLm9wdHMudHJhbnNpdGlvblNlbGVjdG9yID0gdGhpcy5vcHRzLnRyYW5zaXRpb25TZWxlY3RvciB8fCBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvcjtcblxuICAgIHRoaXMub3B0cy5zZXNzaW9uUmVnaXN0cnkuc2V0KFN0cmluZyh0aGlzLm9wdHMuc2Vzc2lvbmlkKSwgdGhpcyk7XG5cbiAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LmxvZyA9IHRoaXMuX3NjcmlwdGluZ0NvbnRleHQubG9nIHx8IChmdW5jdGlvbiBsb2coKXsgXG4gICAgICBpZih0aGlzLm9wdHMuY29uc29sZS5sb2cuYXBwbHkpe1xuICAgICAgICB0aGlzLm9wdHMuY29uc29sZS5sb2cuYXBwbHkodGhpcy5vcHRzLmNvbnNvbGUsIGFyZ3VtZW50cyk7IFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyBvbiBvbGRlciBJRSBkb2VzIG5vdCBzdXBwb3J0IEZ1bmN0aW9uLmFwcGx5LCBzbyBqdXN0IHBhc3MgaGltIHRoZSBmaXJzdCBhcmd1bWVudC4gQmVzdCB3ZSBjYW4gZG8gZm9yIG5vdy5cbiAgICAgICAgdGhpcy5vcHRzLmNvbnNvbGUubG9nKEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpLmpvaW4oJywnKSk7IFxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7ICAgLy9zZXQgdXAgZGVmYXVsdCBzY3JpcHRpbmcgY29udGV4dCBsb2cgZnVuY3Rpb25cblxuICAgIHRoaXMuX2V4dGVybmFsRXZlbnRRdWV1ZSA9IFtdO1xuICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZSA9IFtdO1xuXG4gICAgaWYob3B0cy5wYXJhbXMpe1xuICAgICAgdGhpcy5fbW9kZWwuJGRlc2VyaWFsaXplRGF0YW1vZGVsKG9wdHMucGFyYW1zKTsgICAvL2xvYWQgdXAgdGhlIGRhdGFtb2RlbFxuICAgIH1cblxuICAgIC8vY2hlY2sgaWYgd2UncmUgbG9hZGluZyBmcm9tIGEgcHJldmlvdXMgc25hcHNob3RcbiAgICBpZihvcHRzLnNuYXBzaG90KXtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBuZXcgdGhpcy5vcHRzLlNldChkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uKG9wdHMuc25hcHNob3RbMF0sIHRoaXMuX21vZGVsLiRpZFRvU3RhdGVNYXApKTtcbiAgICAgIHRoaXMuX2hpc3RvcnlWYWx1ZSA9IGRlc2VyaWFsaXplSGlzdG9yeShvcHRzLnNuYXBzaG90WzFdLCB0aGlzLl9tb2RlbC4kaWRUb1N0YXRlTWFwKTsgXG4gICAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSA9IG9wdHMuc25hcHNob3RbMl07XG4gICAgICB0aGlzLl9tb2RlbC4kZGVzZXJpYWxpemVEYXRhbW9kZWwob3B0cy5zbmFwc2hvdFszXSk7ICAgLy9sb2FkIHVwIHRoZSBkYXRhbW9kZWxcbiAgICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZSA9IG9wdHMuc25hcHNob3RbNF07XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcbiAgICAgIHRoaXMuX2hpc3RvcnlWYWx1ZSA9IHt9O1xuICAgICAgdGhpcy5faXNJbkZpbmFsU3RhdGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvL2FkZCBkZWJ1ZyBsb2dnaW5nXG4gICAgQmFzZUludGVycHJldGVyLkVWRU5UUy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIHRoaXMub24oZXZlbnQsIHRoaXMuX2xvZy5iaW5kKHRoaXMsZXZlbnQpKTtcbiAgICB9LCB0aGlzKTtcbn1cblxuLy9zb21lIGdsb2JhbCBzaW5nbGV0b25zIHRvIHVzZSB0byBnZW5lcmF0ZSBpbi1tZW1vcnkgc2Vzc2lvbiBpZHMsIGluIGNhc2UgdGhlIHVzZXIgZG9lcyBub3Qgc3BlY2lmeSB0aGVzZSBkYXRhIHN0cnVjdHVyZXNcbkJhc2VJbnRlcnByZXRlci5zZXNzaW9uSWRDb3VudGVyID0gMTtcbkJhc2VJbnRlcnByZXRlci5nZW5lcmF0ZVNlc3Npb25pZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBCYXNlSW50ZXJwcmV0ZXIuc2Vzc2lvbklkQ291bnRlcisrO1xufVxuQmFzZUludGVycHJldGVyLnNlc3Npb25SZWdpc3RyeSA9IG5ldyBNYXAoKTtcblxuQmFzZUludGVycHJldGVyLnByb3RvdHlwZSA9IGV4dGVuZChiZWdldChFdmVudEVtaXR0ZXIucHJvdG90eXBlKSx7XG4gIFxuICAgIC8qKiBAZXhwb3NlICovXG4gICAgLy9jYW5jZWwgYW4gaW52b2tlZCBzZXNzaW9uXG4gICAgY2FuY2VsIDogZnVuY3Rpb24oKXtcbiAgICAgIGRlbGV0ZSB0aGlzLm9wdHMucGFyZW50U2Vzc2lvbjtcbiAgICAgIGlmKHRoaXMuX2lzSW5GaW5hbFN0YXRlKSByZXR1cm47XG4gICAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSA9IHRydWU7XG4gICAgICB0aGlzLl9sb2coYHNlc3Npb24gY2FuY2VsbGVkICR7dGhpcy5vcHRzLmludm9rZWlkfWApO1xuICAgICAgdGhpcy5fZXhpdEludGVycHJldGVyKG51bGwpO1xuICAgIH0sXG5cbiAgICBfZXhpdEludGVycHJldGVyIDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgLy9UT0RPOiBjYW5jZWwgaW52b2tlZCBzZXNzaW9uc1xuICAgICAgLy9jYW5jZWwgYWxsIGRlbGF5ZWQgc2VuZHMgd2hlbiB3ZSBlbnRlciBpbnRvIGEgZmluYWwgc3RhdGUuXG4gICAgICB0aGlzLl9jYW5jZWxBbGxEZWxheWVkU2VuZHMoKTtcblxuICAgICAgbGV0IHN0YXRlc1RvRXhpdCA9IHRoaXMuX2dldEZ1bGxDb25maWd1cmF0aW9uKCkuc29ydChnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KTtcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlc1RvRXhpdC5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIHZhciBzdGF0ZUV4aXRlZCA9IHN0YXRlc1RvRXhpdFtqXTtcblxuICAgICAgICAgIGlmKHN0YXRlRXhpdGVkLm9uRXhpdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGV4aXRJZHggPSAwLCBleGl0TGVuID0gc3RhdGVFeGl0ZWQub25FeGl0Lmxlbmd0aDsgZXhpdElkeCA8IGV4aXRMZW47IGV4aXRJZHgrKykge1xuICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gc3RhdGVFeGl0ZWQub25FeGl0W2V4aXRJZHhdO1xuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYmxvY2tJZHggPSAwLCBibG9ja0xlbiA9IGJsb2NrLmxlbmd0aDsgYmxvY2tJZHggPCBibG9ja0xlbjsgYmxvY2tJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSBibG9ja1tibG9ja0lkeF07XG4gICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vY2FuY2VsIGludm9rZWQgc2Vzc2lvblxuICAgICAgICAgIGlmKHN0YXRlRXhpdGVkLmludm9rZXMpIHN0YXRlRXhpdGVkLmludm9rZXMuZm9yRWFjaCggaW52b2tlID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuY2FuY2VsSW52b2tlKGludm9rZS5pZCk7XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC8vaWYgaGUgaXMgYSB0b3AtbGV2ZWwgPGZpbmFsPiBzdGF0ZSwgdGhlbiByZXR1cm4gdGhlIGRvbmUgZXZlbnRcbiAgICAgICAgICBpZiggc3RhdGVFeGl0ZWQuJHR5cGUgPT09ICdmaW5hbCcgJiZcbiAgICAgICAgICAgICAgc3RhdGVFeGl0ZWQucGFyZW50LiR0eXBlID09PSAnc2N4bWwnKXtcblxuICAgICAgICAgICAgaWYodGhpcy5vcHRzLnBhcmVudFNlc3Npb24pe1xuICAgICAgICAgICAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LnNlbmQoe1xuICAgICAgICAgICAgICAgIHRhcmdldDogJyNfcGFyZW50JywgXG4gICAgICAgICAgICAgICAgbmFtZTogJ2RvbmUuaW52b2tlLicgKyB0aGlzLm9wdHMuaW52b2tlaWQsXG4gICAgICAgICAgICAgICAgZGF0YSA6IHN0YXRlRXhpdGVkLmRvbmVkYXRhICYmIHN0YXRlRXhpdGVkLmRvbmVkYXRhLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgZXZlbnQpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5LmRlbGV0ZSh0aGlzLm9wdHMuc2Vzc2lvbmlkKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25FeGl0SW50ZXJwcmV0ZXInLCBldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKiBAZXhwb3NlICovXG4gICAgc3RhcnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5faW5pdFN0YXJ0KCk7XG4gICAgICAgIHRoaXMuX3BlcmZvcm1CaWdTdGVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIHRoZSBpbnRlcnByZXRlciBhc3luY2hyb25vdXNseVxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYiBDYWxsYmFjayBpbnZva2VkIHdpdGggYW4gZXJyb3Igb3IgdGhlIGludGVycHJldGVyJ3Mgc3RhYmxlIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAZXhwb3NlXG4gICAgICovXG4gICAgc3RhcnRBc3luYyA6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIGNiID0gdGhpcy5faW5pdFN0YXJ0KGNiKTtcbiAgICAgICAgdGhpcy5nZW5Bc3luYyhudWxsLCBjYik7XG4gICAgfSxcblxuICAgIF9pbml0U3RhcnQgOiBmdW5jdGlvbihjYil7XG4gICAgICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNiID0gbm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nKFwicGVyZm9ybWluZyBpbml0aWFsIGJpZyBzdGVwXCIpO1xuXG4gICAgICAgIC8vV2UgZWZmZWN0aXZlbHkgbmVlZCB0byBmaWd1cmUgb3V0IHN0YXRlcyB0byBlbnRlciBoZXJlIHRvIHBvcHVsYXRlIGluaXRpYWwgY29uZmlnLiBhc3N1bWluZyByb290IGlzIGNvbXBvdW5kIHN0YXRlIG1ha2VzIHRoaXMgc2ltcGxlLlxuICAgICAgICAvL2J1dCBpZiB3ZSB3YW50IGl0IHRvIGJlIHBhcmFsbGVsLCB0aGVuIHRoaXMgYmVjb21lcyBtb3JlIGNvbXBsZXguIHNvIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSBtb2RlbCwgd2UgYWRkIGEgJ2Zha2UnIHJvb3Qgc3RhdGUsIHdoaWNoXG4gICAgICAgIC8vbWFrZXMgdGhlIGZvbGxvd2luZyBvcGVyYXRpb24gc2FmZS5cbiAgICAgICAgdGhpcy5fbW9kZWwuaW5pdGlhbFJlZi5mb3JFYWNoKCBzID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24uYWRkKHMpICk7XG5cbiAgICAgICAgcmV0dXJuIGNiO1xuICAgIH0sXG5cbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIGdldENvbmZpZ3VyYXRpb24gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpLm1hcChmdW5jdGlvbihzKXtyZXR1cm4gcy5pZDt9KTtcbiAgICB9LFxuXG4gICAgX2dldEZ1bGxDb25maWd1cmF0aW9uIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpLlxuICAgICAgICAgICAgICAgIG1hcChmdW5jdGlvbihzKXsgcmV0dXJuIFtzXS5jb25jYXQocXVlcnkuZ2V0QW5jZXN0b3JzKHMpKTt9LHRoaXMpLlxuICAgICAgICAgICAgICAgIHJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhLmNvbmNhdChiKTt9LFtdKS4gICAgLy9mbGF0dGVuXG4gICAgICAgICAgICAgICAgcmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaW5kZXhPZihiKSA+IC0xID8gYSA6IGEuY29uY2F0KGIpO30sW10pOyAvL3VuaXFcbiAgICB9LFxuXG5cbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIGdldEZ1bGxDb25maWd1cmF0aW9uIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRGdWxsQ29uZmlndXJhdGlvbigpLm1hcChmdW5jdGlvbihzKXtyZXR1cm4gcy5pZDt9KTtcbiAgICB9LFxuXG5cbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIGlzSW4gOiBmdW5jdGlvbihzdGF0ZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnVsbENvbmZpZ3VyYXRpb24oKS5pbmRleE9mKHN0YXRlTmFtZSkgPiAtMTtcbiAgICB9LFxuXG4gICAgLyoqIEBleHBvc2UgKi9cbiAgICBpc0ZpbmFsIDogZnVuY3Rpb24oc3RhdGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0luRmluYWxTdGF0ZTtcbiAgICB9LFxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgX3BlcmZvcm1CaWdTdGVwIDogZnVuY3Rpb24oZSkge1xuICAgICAgICBsZXQgY3VycmVudEV2ZW50LCBrZWVwR29pbmcsIGFsbFN0YXRlc0V4aXRlZCwgYWxsU3RhdGVzRW50ZXJlZDtcbiAgICAgICAgW2FsbFN0YXRlc0V4aXRlZCwgYWxsU3RhdGVzRW50ZXJlZCwga2VlcEdvaW5nLCBjdXJyZW50RXZlbnRdID0gdGhpcy5fc3RhcnRCaWdTdGVwKGUpO1xuXG4gICAgICAgIHdoaWxlIChrZWVwR29pbmcpIHtcbiAgICAgICAgICBbY3VycmVudEV2ZW50LCBrZWVwR29pbmddID0gdGhpcy5fc2VsZWN0VHJhbnNpdGlvbnNBbmRQZXJmb3JtU21hbGxTdGVwKGN1cnJlbnRFdmVudCwgYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZpbmlzaEJpZ1N0ZXAoY3VycmVudEV2ZW50LCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQpO1xuICAgIH0sXG5cbiAgICBfc2VsZWN0VHJhbnNpdGlvbnNBbmRQZXJmb3JtU21hbGxTdGVwIDogZnVuY3Rpb24oY3VycmVudEV2ZW50LCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQpe1xuICAgICAgICAvL2ZpcnN0IHNlbGVjdCB3aXRoIG51bGwgZXZlbnRcbiAgICAgICAgdmFyIHNlbGVjdGVkVHJhbnNpdGlvbnMgID0gdGhpcy5fc2VsZWN0VHJhbnNpdGlvbnMoY3VycmVudEV2ZW50LCB0cnVlKTtcbiAgICAgICAgaWYoc2VsZWN0ZWRUcmFuc2l0aW9ucy5pc0VtcHR5KCkpe1xuICAgICAgICAgIGxldCBldiA9IHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgIGlmKGV2KXsgXG4gICAgICAgICAgICBjdXJyZW50RXZlbnQgPSBldjtcbiAgICAgICAgICAgIHNlbGVjdGVkVHJhbnNpdGlvbnMgPSB0aGlzLl9zZWxlY3RUcmFuc2l0aW9ucyhjdXJyZW50RXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZighc2VsZWN0ZWRUcmFuc2l0aW9ucy5pc0VtcHR5KCkpe1xuICAgICAgICAgIHRoaXMuZW1pdCgnb25TbWFsbFN0ZXBCZWdpbicsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgbGV0IHN0YXRlc0V4aXRlZCwgc3RhdGVzRW50ZXJlZDtcbiAgICAgICAgICBbc3RhdGVzRXhpdGVkLCBzdGF0ZXNFbnRlcmVkXSA9IHRoaXMuX3BlcmZvcm1TbWFsbFN0ZXAoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zKTtcbiAgICAgICAgICBpZihzdGF0ZXNFeGl0ZWQpIHN0YXRlc0V4aXRlZC5mb3JFYWNoKCBzID0+IGFsbFN0YXRlc0V4aXRlZC5hZGQocykgKTtcbiAgICAgICAgICBpZihzdGF0ZXNFbnRlcmVkKSBzdGF0ZXNFbnRlcmVkLmZvckVhY2goIHMgPT4gYWxsU3RhdGVzRW50ZXJlZC5hZGQocykgKTtcbiAgICAgICAgICB0aGlzLmVtaXQoJ29uU21hbGxTdGVwRW5kJywgY3VycmVudEV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQga2VlcEdvaW5nID0gIXNlbGVjdGVkVHJhbnNpdGlvbnMuaXNFbXB0eSgpIHx8IHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBbY3VycmVudEV2ZW50LCBrZWVwR29pbmddO1xuICAgIH0sXG5cbiAgICBfc3RhcnRCaWdTdGVwIDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHRoaXMuZW1pdCgnb25CaWdTdGVwQmVnaW4nLCBlKTtcblxuICAgICAgICAvL2RvIGFwcGx5RmluYWxpemUgYW5kIGF1dG9mb3J3YXJkXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpLmZvckVhY2goc3RhdGUgPT4ge1xuICAgICAgICAgIGlmKHN0YXRlLmludm9rZXMpIHN0YXRlLmludm9rZXMuZm9yRWFjaCggaW52b2tlID0+ICB7XG4gICAgICAgICAgICBpZihpbnZva2UuYXV0b2ZvcndhcmQpe1xuICAgICAgICAgICAgICAvL2F1dG9mb3J3YXJkXG4gICAgICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuc2VuZCh7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBgI18ke2ludm9rZS5pZH1gLCBcbiAgICAgICAgICAgICAgICBuYW1lOiBlLm5hbWUsXG4gICAgICAgICAgICAgICAgZGF0YSA6IGUuZGF0YVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGludm9rZS5pZCA9PT0gZS5pbnZva2VpZCl7XG4gICAgICAgICAgICAgIC8vYXBwbHlGaW5hbGl6ZVxuICAgICAgICAgICAgICBpZihpbnZva2UuZmluYWxpemUpIGludm9rZS5maW5hbGl6ZS5mb3JFYWNoKCBhY3Rpb24gPT4gIHRoaXMuX2V2YWx1YXRlQWN0aW9uKGUsIGFjdGlvbikpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICB9KVxuICAgICAgICB9KTsgXG5cbiAgICAgICAgaWYgKGUpIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKGUpO1xuXG4gICAgICAgIGxldCBhbGxTdGF0ZXNFeGl0ZWQgPSBuZXcgU2V0KCksIGFsbFN0YXRlc0VudGVyZWQgPSBuZXcgU2V0KCk7XG4gICAgICAgIGxldCBrZWVwR29pbmcgPSB0cnVlO1xuICAgICAgICBsZXQgY3VycmVudEV2ZW50ID0gZTtcbiAgICAgICAgcmV0dXJuIFthbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQsIGtlZXBHb2luZywgY3VycmVudEV2ZW50XTtcbiAgICB9LFxuXG4gICAgX2ZpbmlzaEJpZ1N0ZXAgOiBmdW5jdGlvbihlLCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQsIGNiKXtcbiAgICAgICAgbGV0IHN0YXRlc1RvSW52b2tlID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5hbGxTdGF0ZXNFbnRlcmVkXS5maWx0ZXIocyA9PiBzLmludm9rZXMgJiYgIWFsbFN0YXRlc0V4aXRlZC5oYXMocykpKSkuc29ydChzb3J0SW5FbnRyeU9yZGVyKTtcblxuICAgICAgICAvLyBIZXJlIHdlIGludm9rZSB3aGF0ZXZlciBuZWVkcyB0byBiZSBpbnZva2VkLiBUaGUgaW1wbGVtZW50YXRpb24gb2YgJ2ludm9rZScgaXMgcGxhdGZvcm0tc3BlY2lmaWNcbiAgICAgICAgc3RhdGVzVG9JbnZva2UuZm9yRWFjaCggcyA9PiB7XG4gICAgICAgICAgICBzLmludm9rZXMuZm9yRWFjaCggZiA9PiAgdGhpcy5fZXZhbHVhdGVBY3Rpb24oZSxmKSApXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNhbmNlbCBpbnZva2UgZm9yIGFsbFN0YXRlc0V4aXRlZFxuICAgICAgICBhbGxTdGF0ZXNFeGl0ZWQuZm9yRWFjaCggcyA9PiB7XG4gICAgICAgICAgaWYocy5pbnZva2VzKSBzLmludm9rZXMuZm9yRWFjaCggaW52b2tlID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuY2FuY2VsSW52b2tlKGludm9rZS5pZCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVE9ETzogSW52b2tpbmcgbWF5IGhhdmUgcmFpc2VkIGludGVybmFsIGVycm9yIGV2ZW50cyBhbmQgd2UgaXRlcmF0ZSB0byBoYW5kbGUgdGhlbSAgICAgICAgXG4gICAgICAgIC8vaWYgbm90IGludGVybmFsUXVldWUuaXNFbXB0eSgpOlxuICAgICAgICAvLyAgICBjb250aW51ZVxuXG4gICAgICAgIHRoaXMuX2lzSW5GaW5hbFN0YXRlID0gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuZXZlcnkoZnVuY3Rpb24ocyl7IHJldHVybiBzLnR5cGVFbnVtID09PSBGSU5BTDsgfSk7XG4gICAgICAgIGlmKHRoaXMuX2lzSW5GaW5hbFN0YXRlKXtcbiAgICAgICAgICB0aGlzLl9leGl0SW50ZXJwcmV0ZXIoZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0KCdvbkJpZ1N0ZXBFbmQnKTtcbiAgICAgICAgaWYoY2IpIGNiKHVuZGVmaW5lZCwgdGhpcy5nZXRDb25maWd1cmF0aW9uKCkpO1xuICAgIH0sXG5cbiAgICBfY2FuY2VsQWxsRGVsYXllZFNlbmRzIDogZnVuY3Rpb24oKXtcbiAgICAgIGZvciggbGV0IHRpbWVvdXRPcHRpb25zIG9mIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuX3RpbWVvdXRzKXtcbiAgICAgICAgaWYoIXRpbWVvdXRPcHRpb25zLnNlbmRPcHRpb25zLmRlbGF5KSBjb250aW51ZTtcbiAgICAgICAgdGhpcy5fbG9nKCdjYW5jZWxsaW5nIGRlbGF5ZWQgc2VuZCcsIHRpbWVvdXRPcHRpb25zKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRPcHRpb25zLnRpbWVvdXRIYW5kbGUpO1xuICAgICAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0Ll90aW1lb3V0cy5kZWxldGUodGltZW91dE9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NyaXB0aW5nQ29udGV4dC5fdGltZW91dE1hcCkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuICAgICAgICBkZWxldGUgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5fdGltZW91dE1hcFtrZXldO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9wZXJmb3JtQmlnU3RlcEFzeW5jIDogZnVuY3Rpb24oZSwgY2IpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRFdmVudCwga2VlcEdvaW5nLCBhbGxTdGF0ZXNFeGl0ZWQsIGFsbFN0YXRlc0VudGVyZWQ7XG4gICAgICAgIFthbGxTdGF0ZXNFeGl0ZWQsIGFsbFN0YXRlc0VudGVyZWQsIGtlZXBHb2luZywgY3VycmVudEV2ZW50XSA9IHRoaXMuX3N0YXJ0QmlnU3RlcChlKTtcblxuICAgICAgICBmdW5jdGlvbiBuZXh0U3RlcChlbWl0KXtcbiAgICAgICAgICB0aGlzLmVtaXQoZW1pdCk7XG4gICAgICAgICAgW2N1cnJlbnRFdmVudCwga2VlcEdvaW5nXSA9IHRoaXMuX3NlbGVjdFRyYW5zaXRpb25zQW5kUGVyZm9ybVNtYWxsU3RlcChjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCk7XG5cbiAgICAgICAgICBpZihrZWVwR29pbmcpe1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdvbkJpZ1N0ZXBTdXNwZW5kJyk7XG4gICAgICAgICAgICBzZXRJbW1lZGlhdGUobmV4dFN0ZXAuYmluZCh0aGlzKSwnb25CaWdTdGVwUmVzdW1lJyk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLl9maW5pc2hCaWdTdGVwKGN1cnJlbnRFdmVudCwgYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkLCBjYik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5leHRTdGVwLmNhbGwodGhpcywnb25CaWdTdGVwQmVnaW4nKTtcbiAgICB9LFxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgX3BlcmZvcm1TbWFsbFN0ZXAgOiBmdW5jdGlvbihjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnMpIHtcblxuICAgICAgICB0aGlzLl9sb2coXCJzZWxlY3RpbmcgdHJhbnNpdGlvbnMgd2l0aCBjdXJyZW50RXZlbnRcIiwgY3VycmVudEV2ZW50KTtcblxuICAgICAgICB0aGlzLl9sb2coXCJzZWxlY3RlZCB0cmFuc2l0aW9uc1wiLCBzZWxlY3RlZFRyYW5zaXRpb25zKTtcblxuICAgICAgICBsZXQgc3RhdGVzRXhpdGVkLFxuICAgICAgICAgICAgc3RhdGVzRW50ZXJlZDtcblxuICAgICAgICBpZiAoIXNlbGVjdGVkVHJhbnNpdGlvbnMuaXNFbXB0eSgpKSB7XG5cbiAgICAgICAgICAgIC8vd2Ugb25seSB3YW50IHRvIGVudGVyIGFuZCBleGl0IHN0YXRlcyBmcm9tIHRyYW5zaXRpb25zIHdpdGggdGFyZ2V0c1xuICAgICAgICAgICAgLy9maWx0ZXIgb3V0IHRhcmdldGxlc3MgdHJhbnNpdGlvbnMgaGVyZSAtIHdlIHdpbGwgb25seSB1c2UgdGhlc2UgdG8gZXhlY3V0ZSB0cmFuc2l0aW9uIGFjdGlvbnNcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMgPSBuZXcgdGhpcy5vcHRzLlNldChzZWxlY3RlZFRyYW5zaXRpb25zLml0ZXIoKS5maWx0ZXIodHJhbnNpdGlvbldpdGhUYXJnZXRzKSk7XG5cbiAgICAgICAgICAgIHN0YXRlc0V4aXRlZCA9IHRoaXMuX2V4aXRTdGF0ZXMoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMpXG4gICAgICAgICAgICB0aGlzLl9leGVjdXRlVHJhbnNpdGlvbnMoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zKTtcbiAgICAgICAgICAgIHN0YXRlc0VudGVyZWQgPSB0aGlzLl9lbnRlclN0YXRlcyhjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cylcblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwibmV3IGNvbmZpZ3VyYXRpb24gXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtzdGF0ZXNFeGl0ZWQsIHN0YXRlc0VudGVyZWRdO1xuICAgIH0sXG5cbiAgICBfZXhpdFN0YXRlcyA6IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKXtcbiAgICAgICAgbGV0IGJhc2ljU3RhdGVzRXhpdGVkLCBzdGF0ZXNFeGl0ZWQ7XG4gICAgICAgIFtiYXNpY1N0YXRlc0V4aXRlZCwgc3RhdGVzRXhpdGVkXSA9IHRoaXMuX2dldFN0YXRlc0V4aXRlZChzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMpOyBcblxuICAgICAgICB0aGlzLl9sb2coJ2V4aXRpbmcgc3RhdGVzJylcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlc0V4aXRlZC5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmFyIHN0YXRlRXhpdGVkID0gc3RhdGVzRXhpdGVkW2pdO1xuXG4gICAgICAgICAgICBpZihzdGF0ZUV4aXRlZC5pc0F0b21pYykgdGhpcy5fY29uZmlndXJhdGlvbi5yZW1vdmUoc3RhdGVFeGl0ZWQpO1xuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJleGl0aW5nIFwiLCBzdGF0ZUV4aXRlZC5pZCk7XG5cbiAgICAgICAgICAgIC8vaW52b2tlIGxpc3RlbmVyc1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdvbkV4aXQnLHN0YXRlRXhpdGVkLmlkKVxuXG4gICAgICAgICAgICBpZihzdGF0ZUV4aXRlZC5vbkV4aXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGV4aXRJZHggPSAwLCBleGl0TGVuID0gc3RhdGVFeGl0ZWQub25FeGl0Lmxlbmd0aDsgZXhpdElkeCA8IGV4aXRMZW47IGV4aXRJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBzdGF0ZUV4aXRlZC5vbkV4aXRbZXhpdElkeF07XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGJsb2NrSWR4ID0gMCwgYmxvY2tMZW4gPSBibG9jay5sZW5ndGg7IGJsb2NrSWR4IDwgYmxvY2tMZW47IGJsb2NrSWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSBibG9ja1tibG9ja0lkeF07XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZjtcbiAgICAgICAgICAgIGlmIChzdGF0ZUV4aXRlZC5oaXN0b3J5UmVmKSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBoaXN0b3J5UmVmIG9mIHN0YXRlRXhpdGVkLmhpc3RvcnlSZWYpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGlzdG9yeVJlZi5pc0RlZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmdW5jdGlvbihzMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzMC50eXBlRW51bSA9PT0gQkFTSUMgJiYgc3RhdGVFeGl0ZWQuZGVzY2VuZGFudHMuaW5kZXhPZihzMCkgPiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gZnVuY3Rpb24oczApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gczAucGFyZW50ID09PSBzdGF0ZUV4aXRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy91cGRhdGUgaGlzdG9yeVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5VmFsdWVbaGlzdG9yeVJlZi5pZF0gPSBzdGF0ZXNFeGl0ZWQuZmlsdGVyKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZXNFeGl0ZWQ7XG4gICAgfSxcblxuICAgIF9leGVjdXRlVHJhbnNpdGlvbnMgOiBmdW5jdGlvbihjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnMpe1xuICAgICAgICB2YXIgc29ydGVkVHJhbnNpdGlvbnMgPSBzZWxlY3RlZFRyYW5zaXRpb25zLml0ZXIoKS5zb3J0KHRyYW5zaXRpb25Db21wYXJhdG9yKTtcblxuICAgICAgICB0aGlzLl9sb2coXCJleGVjdXRpbmcgdHJhbnNpdGl0aW9uIGFjdGlvbnNcIik7XG4gICAgICAgIGZvciAodmFyIHN0eElkeCA9IDAsIGxlbiA9IHNvcnRlZFRyYW5zaXRpb25zLmxlbmd0aDsgc3R4SWR4IDwgbGVuOyBzdHhJZHgrKykge1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb24gPSBzb3J0ZWRUcmFuc2l0aW9uc1tzdHhJZHhdO1xuXG4gICAgICAgICAgICB2YXIgdGFyZ2V0SWRzID0gdHJhbnNpdGlvbi50YXJnZXRzICYmIHRyYW5zaXRpb24udGFyZ2V0cy5tYXAoZnVuY3Rpb24odGFyZ2V0KXtyZXR1cm4gdGFyZ2V0LmlkO30pO1xuXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ29uVHJhbnNpdGlvbicsdHJhbnNpdGlvbi5zb3VyY2UuaWQsdGFyZ2V0SWRzLCB0cmFuc2l0aW9uLnNvdXJjZS50cmFuc2l0aW9ucy5pbmRleE9mKHRyYW5zaXRpb24pKTtcblxuICAgICAgICAgICAgaWYodHJhbnNpdGlvbi5vblRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbi5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGlvblJlZiA9IHRyYW5zaXRpb24ub25UcmFuc2l0aW9uW3R4SWR4XTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgIH0sXG5cbiAgICBfZW50ZXJTdGF0ZXMgOiBmdW5jdGlvbihjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cyl7XG4gICAgICAgIHRoaXMuX2xvZyhcImVudGVyaW5nIHN0YXRlc1wiKTtcblxuICAgICAgICBsZXQgc3RhdGVzRW50ZXJlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IHN0YXRlc0ZvckRlZmF1bHRFbnRyeSA9IG5ldyBTZXQoKTtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgdGVtcG9yYXJ5IHRhYmxlIGZvciBkZWZhdWx0IGNvbnRlbnQgaW4gaGlzdG9yeSBzdGF0ZXNcbiAgICAgICAgbGV0IGRlZmF1bHRIaXN0b3J5Q29udGVudCA9IHt9O1xuICAgICAgICB0aGlzLl9jb21wdXRlRW50cnlTZXQoc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzLCBzdGF0ZXNFbnRlcmVkLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCk7IFxuICAgICAgICBzdGF0ZXNFbnRlcmVkID0gWy4uLnN0YXRlc0VudGVyZWRdLnNvcnQoc29ydEluRW50cnlPcmRlcik7IFxuXG4gICAgICAgIHRoaXMuX2xvZyhcInN0YXRlc0VudGVyZWQgXCIsIHN0YXRlc0VudGVyZWQpO1xuXG4gICAgICAgIGZvciAodmFyIGVudGVySWR4ID0gMCwgZW50ZXJMZW4gPSBzdGF0ZXNFbnRlcmVkLmxlbmd0aDsgZW50ZXJJZHggPCBlbnRlckxlbjsgZW50ZXJJZHgrKykge1xuICAgICAgICAgICAgdmFyIHN0YXRlRW50ZXJlZCA9IHN0YXRlc0VudGVyZWRbZW50ZXJJZHhdO1xuXG4gICAgICAgICAgICBpZihzdGF0ZUVudGVyZWQuaXNBdG9taWMpIHRoaXMuX2NvbmZpZ3VyYXRpb24uYWRkKHN0YXRlRW50ZXJlZCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImVudGVyaW5nXCIsIHN0YXRlRW50ZXJlZC5pZCk7XG5cbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25FbnRyeScsc3RhdGVFbnRlcmVkLmlkKTtcblxuICAgICAgICAgICAgaWYoc3RhdGVFbnRlcmVkLm9uRW50cnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGVudHJ5SWR4ID0gMCwgZW50cnlMZW4gPSBzdGF0ZUVudGVyZWQub25FbnRyeS5sZW5ndGg7IGVudHJ5SWR4IDwgZW50cnlMZW47IGVudHJ5SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gc3RhdGVFbnRlcmVkLm9uRW50cnlbZW50cnlJZHhdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBibG9ja0lkeCA9IDAsIGJsb2NrTGVuID0gYmxvY2subGVuZ3RoOyBibG9ja0lkeCA8IGJsb2NrTGVuOyBibG9ja0lkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uUmVmID0gYmxvY2tbYmxvY2tJZHhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgY3VycmVudEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoc3RhdGVzRm9yRGVmYXVsdEVudHJ5LmhhcyhzdGF0ZUVudGVyZWQpKXtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGluaXRpYWxTdGF0ZSBvZiBzdGF0ZUVudGVyZWQuaW5pdGlhbFJlZil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnb25EZWZhdWx0RW50cnknLCBpbml0aWFsU3RhdGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZihpbml0aWFsU3RhdGUudHlwZUVudW0gPT09IElOSVRJQUwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRyYW5zaXRpb24gPSBpbml0aWFsU3RhdGUudHJhbnNpdGlvbnNbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRyYW5zaXRpb24ub25UcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2coJ2V4ZWN1dGluZyBpbml0aWFsIHRyYW5zaXRpb24gY29udGVudCBmb3IgaW5pdGlhbCBzdGF0ZSBvZiBwYXJlbnQgc3RhdGUnLHN0YXRlRW50ZXJlZC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCB0eExlbiA9IHRyYW5zaXRpb24ub25UcmFuc2l0aW9uLmxlbmd0aDsgdHhJZHggPCB0eExlbjsgdHhJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uUmVmID0gdHJhbnNpdGlvbi5vblRyYW5zaXRpb25bdHhJZHhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYoZGVmYXVsdEhpc3RvcnlDb250ZW50W3N0YXRlRW50ZXJlZC5pZF0pe1xuICAgICAgICAgICAgICAgIGxldCB0cmFuc2l0aW9uID0gZGVmYXVsdEhpc3RvcnlDb250ZW50W3N0YXRlRW50ZXJlZC5pZF1cbiAgICAgICAgICAgICAgICBpZih0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZygnZXhlY3V0aW5nIGhpc3RvcnkgdHJhbnNpdGlvbiBjb250ZW50IGZvciBoaXN0b3J5IHN0YXRlIG9mIHBhcmVudCBzdGF0ZScsc3RhdGVFbnRlcmVkLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCB0eExlbiA9IHRyYW5zaXRpb24ub25UcmFuc2l0aW9uLmxlbmd0aDsgdHhJZHggPCB0eExlbjsgdHhJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGlvblJlZiA9IHRyYW5zaXRpb24ub25UcmFuc2l0aW9uW3R4SWR4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBlbnRlcklkeCA9IDAsIGVudGVyTGVuID0gc3RhdGVzRW50ZXJlZC5sZW5ndGg7IGVudGVySWR4IDwgZW50ZXJMZW47IGVudGVySWR4KyspIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZUVudGVyZWQgPSBzdGF0ZXNFbnRlcmVkW2VudGVySWR4XTtcbiAgICAgICAgICAgIGlmKHN0YXRlRW50ZXJlZC50eXBlRW51bSA9PT0gRklOQUwpe1xuICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gc3RhdGVFbnRlcmVkLnBhcmVudDtcbiAgICAgICAgICAgICAgbGV0IGdyYW5kcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLnB1c2goe25hbWUgOiBcImRvbmUuc3RhdGUuXCIgKyBwYXJlbnQuaWQsIGRhdGEgOiBzdGF0ZUVudGVyZWQuZG9uZWRhdGEgJiYgc3RhdGVFbnRlcmVkLmRvbmVkYXRhLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgY3VycmVudEV2ZW50KX0pO1xuICAgICAgICAgICAgICBpZihncmFuZHBhcmVudCAmJiBncmFuZHBhcmVudC50eXBlRW51bSA9PT0gUEFSQUxMRUwpe1xuICAgICAgICAgICAgICAgICAgaWYoZ3JhbmRwYXJlbnQuc3RhdGVzLmV2ZXJ5KHMgPT4gdGhpcy5pc0luRmluYWxTdGF0ZShzKSApKXtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUucHVzaCh7bmFtZSA6IFwiZG9uZS5zdGF0ZS5cIiArIGdyYW5kcGFyZW50LmlkfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZXNFbnRlcmVkO1xuICAgIH0sXG5cbiAgICBpc0luRmluYWxTdGF0ZSA6IGZ1bmN0aW9uKHMpe1xuICAgICAgICBpZihzLnR5cGVFbnVtID09PSBDT01QT1NJVEUpe1xuICAgICAgICAgICAgcmV0dXJuIHMuc3RhdGVzLnNvbWUocyA9PiBzLnR5cGVFbnVtID09PSBGSU5BTCAmJiB0aGlzLl9jb25maWd1cmF0aW9uLmNvbnRhaW5zKHMpKTtcbiAgICAgICAgfWVsc2UgaWYocy50eXBlRW51bSA9PT0gUEFSQUxMRUwpe1xuICAgICAgICAgICAgcmV0dXJuIHMuc3RhdGVzLmV2ZXJ5KHRoaXMuaXNJbkZpbmFsU3RhdGUuYmluZCh0aGlzKSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICBfZXZhbHVhdGVBY3Rpb24gOiBmdW5jdGlvbihjdXJyZW50RXZlbnQsIGFjdGlvblJlZikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpOyAgICAgLy9TQ1hNTCBzeXN0ZW0gdmFyaWFibGVzXG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZUVycm9yIDogZnVuY3Rpb24oZSwgYWN0aW9uUmVmKXtcbiAgICAgIGxldCBldmVudCA9IFxuICAgICAgICBlIGluc3RhbmNlb2YgRXJyb3IgfHwgKHR5cGVvZiBlLl9fcHJvdG9fXy5uYW1lID09PSAnc3RyaW5nJyAmJiBlLl9fcHJvdG9fXy5uYW1lLm1hdGNoKC9eLipFcnJvciQvKSkgPyAgLy93ZSBjYW4ndCBqdXN0IGRvICdlIGluc3RhbmNlb2YgRXJyb3InLCBiZWNhdXNlIHRoZSBFcnJvciBvYmplY3QgaW4gdGhlIHNhbmRib3ggaXMgZnJvbSBhIGRpZmZlcmVudCBjb250ZXh0LCBhbmQgaW5zdGFuY2VvZiB3aWxsIHJldHVybiBmYWxzZVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6J2Vycm9yLmV4ZWN1dGlvbicsXG4gICAgICAgICAgICBkYXRhIDoge1xuICAgICAgICAgICAgICB0YWduYW1lOiBhY3Rpb25SZWYudGFnbmFtZSwgXG4gICAgICAgICAgICAgIGxpbmU6IGFjdGlvblJlZi5saW5lLCBcbiAgICAgICAgICAgICAgY29sdW1uOiBhY3Rpb25SZWYuY29sdW1uLFxuICAgICAgICAgICAgICByZWFzb246IGUubWVzc2FnZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGUgOiAncGxhdGZvcm0nXG4gICAgICAgICAgfSA6IFxuICAgICAgICAgIChlLm5hbWUgPyBcbiAgICAgICAgICAgIGUgOiBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTonZXJyb3IuZXhlY3V0aW9uJyxcbiAgICAgICAgICAgICAgZGF0YTplLFxuICAgICAgICAgICAgICB0eXBlIDogJ3BsYXRmb3JtJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUucHVzaChldmVudCk7XG4gICAgICB0aGlzLmVtaXQoJ29uRXJyb3InLCBldmVudCk7XG4gICAgfSxcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIF9nZXRTdGF0ZXNFeGl0ZWQgOiBmdW5jdGlvbih0cmFuc2l0aW9ucykge1xuICAgICAgICB2YXIgc3RhdGVzRXhpdGVkID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcbiAgICAgICAgdmFyIGJhc2ljU3RhdGVzRXhpdGVkID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcblxuICAgICAgICAvL1N0YXRlcyBleGl0ZWQgYXJlIGRlZmluZWQgdG8gYmUgYWN0aXZlIHN0YXRlcyB0aGF0IGFyZVxuICAgICAgICAvL2Rlc2NlbmRhbnRzIG9mIHRoZSBzY29wZSBvZiBlYWNoIHByaW9yaXR5LWVuYWJsZWQgdHJhbnNpdGlvbi5cbiAgICAgICAgLy9IZXJlLCB3ZSBpdGVyYXRlIHRocm91Z2ggdGhlIHRyYW5zaXRpb25zLCBhbmQgY29sbGVjdCBzdGF0ZXNcbiAgICAgICAgLy90aGF0IG1hdGNoIHRoaXMgY29uZGl0aW9uLiBcbiAgICAgICAgdmFyIHRyYW5zaXRpb25MaXN0ID0gdHJhbnNpdGlvbnMuaXRlcigpO1xuICAgICAgICBmb3IgKHZhciB0eElkeCA9IDAsIHR4TGVuID0gdHJhbnNpdGlvbkxpc3QubGVuZ3RoOyB0eElkeCA8IHR4TGVuOyB0eElkeCsrKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHRyYW5zaXRpb25MaXN0W3R4SWR4XTtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRyYW5zaXRpb24uc2NvcGUsXG4gICAgICAgICAgICAgICAgZGVzYyA9IHNjb3BlLmRlc2NlbmRhbnRzO1xuXG4gICAgICAgICAgICAvL0ZvciBlYWNoIHN0YXRlIGluIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICAvL2lzIHRoYXQgc3RhdGUgYSBkZXNjZW5kYW50IG9mIHRoZSB0cmFuc2l0aW9uIHNjb3BlP1xuICAgICAgICAgICAgLy9TdG9yZSBhbmNlc3RvcnMgb2YgdGhhdCBzdGF0ZSB1cCB0byBidXQgbm90IGluY2x1ZGluZyB0aGUgc2NvcGUuXG4gICAgICAgICAgICB2YXIgY29uZmlnTGlzdCA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpO1xuICAgICAgICAgICAgZm9yICh2YXIgY2ZnSWR4ID0gMCwgY2ZnTGVuID0gY29uZmlnTGlzdC5sZW5ndGg7IGNmZ0lkeCA8IGNmZ0xlbjsgY2ZnSWR4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBjb25maWdMaXN0W2NmZ0lkeF07XG4gICAgICAgICAgICAgICAgaWYoZGVzYy5pbmRleE9mKHN0YXRlKSA+IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgYmFzaWNTdGF0ZXNFeGl0ZWQuYWRkKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVzRXhpdGVkLmFkZChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmNlc3RvcnMgPSBxdWVyeS5nZXRBbmNlc3RvcnMoc3RhdGUsc2NvcGUpOyBcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYW5jSWR4ID0gMCwgYW5jTGVuID0gYW5jZXN0b3JzLmxlbmd0aDsgYW5jSWR4IDwgYW5jTGVuOyBhbmNJZHgrKykgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlc0V4aXRlZC5hZGQoYW5jZXN0b3JzW2FuY0lkeF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNvcnRlZFN0YXRlc0V4aXRlZCA9IHN0YXRlc0V4aXRlZC5pdGVyKCkuc29ydChnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5KTtcbiAgICAgICAgcmV0dXJuIFtiYXNpY1N0YXRlc0V4aXRlZCwgc29ydGVkU3RhdGVzRXhpdGVkXTtcbiAgICB9LFxuXG4gICAgX2NvbXB1dGVFbnRyeVNldCA6IGZ1bmN0aW9uKHRyYW5zaXRpb25zLCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCl7XG4gICAgICBmb3IobGV0IHQgb2YgdHJhbnNpdGlvbnMuaXRlcigpKXtcbiAgICAgICAgICBmb3IobGV0IHMgb2YgdC50YXJnZXRzKXtcbiAgICAgICAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIocyxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCkgXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBhbmNlc3RvciA9IHQuc2NvcGU7XG4gICAgICAgICAgZm9yKGxldCBzIG9mIHRoaXMuX2dldEVmZmVjdGl2ZVRhcmdldFN0YXRlcyh0KSl7XG4gICAgICAgICAgICAgIHRoaXMuX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlcihzLCBhbmNlc3Rvciwgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0RWZmZWN0aXZlVGFyZ2V0U3RhdGVzIDogZnVuY3Rpb24odHJhbnNpdGlvbil7XG4gICAgICBsZXQgdGFyZ2V0cyA9IG5ldyBTZXQoKTtcbiAgICAgIGZvcihsZXQgcyBvZiB0cmFuc2l0aW9uLnRhcmdldHMpe1xuICAgICAgICAgIGlmKHMudHlwZUVudW0gPT09IEhJU1RPUlkpe1xuICAgICAgICAgICAgICBpZihzLmlkIGluIHRoaXMuX2hpc3RvcnlWYWx1ZSlcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnlWYWx1ZVtzLmlkXS5mb3JFYWNoKCBzdGF0ZSA9PiB0YXJnZXRzLmFkZChzdGF0ZSkpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIFsuLi50aGlzLl9nZXRFZmZlY3RpdmVUYXJnZXRTdGF0ZXMocy50cmFuc2l0aW9uc1swXSldLmZvckVhY2goIHN0YXRlID0+IHRhcmdldHMuYWRkKHN0YXRlKSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRzLmFkZChzKVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXRzXG4gICAgfSxcblxuICAgIF9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlciA6IGZ1bmN0aW9uKHN0YXRlLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KXtcbiAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBISVNUT1JZKXtcbiAgICAgICAgICBpZih0aGlzLl9oaXN0b3J5VmFsdWVbc3RhdGUuaWRdKXtcbiAgICAgICAgICAgICAgZm9yKGxldCBzIG9mIHRoaXMuX2hpc3RvcnlWYWx1ZVtzdGF0ZS5pZF0pXG4gICAgICAgICAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcihzLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgZm9yKGxldCBzIG9mIHRoaXMuX2hpc3RvcnlWYWx1ZVtzdGF0ZS5pZF0pXG4gICAgICAgICAgICAgICAgICB0aGlzLl9hZGRBbmNlc3RvclN0YXRlc1RvRW50ZXIocywgc3RhdGUucGFyZW50LCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVmYXVsdEhpc3RvcnlDb250ZW50W3N0YXRlLnBhcmVudC5pZF0gPSBzdGF0ZS50cmFuc2l0aW9uc1swXVxuICAgICAgICAgICAgZm9yKGxldCBzIG9mIHN0YXRlLnRyYW5zaXRpb25zWzBdLnRhcmdldHMpXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIocyxzdGF0ZXNUb0VudGVyLHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IobGV0IHMgb2Ygc3RhdGUudHJhbnNpdGlvbnNbMF0udGFyZ2V0cylcbiAgICAgICAgICAgICAgICB0aGlzLl9hZGRBbmNlc3RvclN0YXRlc1RvRW50ZXIocywgc3RhdGUucGFyZW50LCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhdGVzVG9FbnRlci5hZGQoc3RhdGUpXG4gICAgICAgICAgaWYoc3RhdGUudHlwZUVudW0gPT09IENPTVBPU0lURSl7XG4gICAgICAgICAgICAgIHN0YXRlc0ZvckRlZmF1bHRFbnRyeS5hZGQoc3RhdGUpXG4gICAgICAgICAgICAgIC8vZm9yIGVhY2ggc3RhdGUgaW4gaW5pdGlhbFJlZiwgaWYgaXQgaXMgYW4gaW5pdGlhbCBzdGF0ZSwgdGhlbiBhZGQgYW5jZXN0b3JzIGFuZCBkZXNjZW5kYW50cy5cbiAgICAgICAgICAgICAgZm9yKGxldCBzIG9mIHN0YXRlLmluaXRpYWxSZWYpe1xuICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldHMgPSBzLnR5cGVFbnVtID09PSBJTklUSUFMID8gcy50cmFuc2l0aW9uc1swXS50YXJnZXRzIDogW3NdOyBcbiAgICAgICAgICAgICAgICAgIGZvcihsZXQgdGFyZ2V0U3RhdGUgb2YgdGFyZ2V0cyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyKHRhcmdldFN0YXRlLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZvcihsZXQgcyBvZiBzdGF0ZS5pbml0aWFsUmVmKXtcbiAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXRzID0gcy50eXBlRW51bSA9PT0gSU5JVElBTCA/IHMudHJhbnNpdGlvbnNbMF0udGFyZ2V0cyA6IFtzXTsgXG4gICAgICAgICAgICAgICAgICBmb3IobGV0IHRhcmdldFN0YXRlIG9mIHRhcmdldHMpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRBbmNlc3RvclN0YXRlc1RvRW50ZXIodGFyZ2V0U3RhdGUsIHN0YXRlLCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICBpZihzdGF0ZS50eXBlRW51bSA9PT0gUEFSQUxMRUwpe1xuICAgICAgICAgICAgICAgICAgZm9yKGxldCBjaGlsZCBvZiBzdGF0ZS5zdGF0ZXMpe1xuICAgICAgICAgICAgICAgICAgICAgIGlmKCFbLi4uc3RhdGVzVG9FbnRlcl0uc29tZShzID0+IHF1ZXJ5LmlzRGVzY2VuZGFudChzLCBjaGlsZCkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIoY2hpbGQsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpIFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlciA6IGZ1bmN0aW9uKHN0YXRlLCBhbmNlc3Rvciwgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpe1xuICAgICAgbGV0IHRyYXZlcnNlID0gKGFuYykgPT4ge1xuICAgICAgICAgIGlmKGFuYy50eXBlRW51bSA9PT0gUEFSQUxMRUwpe1xuICAgICAgICAgICAgICBmb3IobGV0IGNoaWxkIG9mIGFuYy5zdGF0ZXMpe1xuICAgICAgICAgICAgICAgICAgaWYoY2hpbGQudHlwZUVudW0gIT09IEhJU1RPUlkgJiYgIVsuLi5zdGF0ZXNUb0VudGVyXS5zb21lKHMgPT4gcXVlcnkuaXNEZXNjZW5kYW50KHMsIGNoaWxkKSkpe1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyKGNoaWxkLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KSBcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH07XG4gICAgICBmb3IobGV0IGFuYyBvZiBxdWVyeS5nZXRBbmNlc3RvcnMoc3RhdGUsYW5jZXN0b3IpKXtcbiAgICAgICAgICBzdGF0ZXNUb0VudGVyLmFkZChhbmMpXG4gICAgICAgICAgdHJhdmVyc2UoYW5jKVxuICAgICAgfVxuICAgICAgdHJhdmVyc2UoYW5jZXN0b3IpXG4gICAgfSxcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIF9zZWxlY3RUcmFuc2l0aW9ucyA6IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgc2VsZWN0RXZlbnRsZXNzVHJhbnNpdGlvbnMpIHtcbiAgICAgICAgdmFyIHRyYW5zaXRpb25TZWxlY3RvciA9IHRoaXMub3B0cy50cmFuc2l0aW9uU2VsZWN0b3I7XG4gICAgICAgIHZhciBlbmFibGVkVHJhbnNpdGlvbnMgPSBuZXcgdGhpcy5vcHRzLlNldCgpO1xuXG4gICAgICAgIHZhciBlID0gdGhpcy5fZXZhbHVhdGVBY3Rpb24uYmluZCh0aGlzLGN1cnJlbnRFdmVudCk7XG5cbiAgICAgICAgbGV0IGF0b21pY1N0YXRlcyA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpLnNvcnQodHJhbnNpdGlvbkNvbXBhcmF0b3IpO1xuICAgICAgICBmb3IobGV0IHN0YXRlIG9mIGF0b21pY1N0YXRlcyl7XG4gICAgICAgICAgICBsb29wOiBmb3IobGV0IHMgb2YgW3N0YXRlXS5jb25jYXQocXVlcnkuZ2V0QW5jZXN0b3JzKHN0YXRlKSkpe1xuICAgICAgICAgICAgICAgIGZvcihsZXQgdCBvZiBzLnRyYW5zaXRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodHJhbnNpdGlvblNlbGVjdG9yKHQsIGN1cnJlbnRFdmVudCwgZSwgc2VsZWN0RXZlbnRsZXNzVHJhbnNpdGlvbnMpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWRUcmFuc2l0aW9ucy5hZGQodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zID0gdGhpcy5fcmVtb3ZlQ29uZmxpY3RpbmdUcmFuc2l0aW9uKGVuYWJsZWRUcmFuc2l0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5fbG9nKFwicHJpb3JpdHlFbmFibGVkVHJhbnNpdGlvbnNcIiwgcHJpb3JpdHlFbmFibGVkVHJhbnNpdGlvbnMpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zO1xuICAgIH0sXG5cbiAgICBcbiAgICBfY29tcHV0ZUV4aXRTZXQgOiBmdW5jdGlvbih0cmFuc2l0aW9ucykge1xuICAgICAgbGV0IHN0YXRlc1RvRXhpdCA9IG5ldyBTZXQoKTtcbiAgICAgIGZvcihsZXQgdCBvZiB0cmFuc2l0aW9ucyl7XG4gICAgICAgICAgaWYodC50YXJnZXRzKXtcbiAgICAgICAgICAgICAgbGV0IHNjb3BlID0gdC5zY29wZTtcbiAgICAgICAgICAgICAgZm9yKGxldCBzIG9mIHRoaXMuX2dldEZ1bGxDb25maWd1cmF0aW9uKCkpe1xuICAgICAgICAgICAgICAgICAgaWYocXVlcnkuaXNEZXNjZW5kYW50KHMsc2NvcGUpKSBzdGF0ZXNUb0V4aXQuYWRkKHMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXRlc1RvRXhpdDsgXG4gICAgfSxcbiAgIFxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgX3JlbW92ZUNvbmZsaWN0aW5nVHJhbnNpdGlvbiA6IGZ1bmN0aW9uKGVuYWJsZWRUcmFuc2l0aW9ucykge1xuICAgICAgbGV0IGZpbHRlcmVkVHJhbnNpdGlvbnMgPSBuZXcgdGhpcy5vcHRzLlNldCgpXG4gICAgICAvL3RvTGlzdCBzb3J0cyB0aGUgdHJhbnNpdGlvbnMgaW4gdGhlIG9yZGVyIG9mIHRoZSBzdGF0ZXMgdGhhdCBzZWxlY3RlZCB0aGVtXG4gICAgICBmb3IoIGxldCB0MSBvZiBlbmFibGVkVHJhbnNpdGlvbnMuaXRlcigpKXtcbiAgICAgICAgICBsZXQgdDFQcmVlbXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBsZXQgdHJhbnNpdGlvbnNUb1JlbW92ZSA9IG5ldyBTZXQoKVxuICAgICAgICAgIGZvciAobGV0IHQyIG9mIGZpbHRlcmVkVHJhbnNpdGlvbnMuaXRlcigpKXtcbiAgICAgICAgICAgICAgLy9UT0RPOiBjYW4gd2UgY29tcHV0ZSB0aGlzIHN0YXRpY2FsbHk/IGZvciBleGFtcGxlLCBieSBjaGVja2luZyBpZiB0aGUgdHJhbnNpdGlvbiBzY29wZXMgYXJlIGFyZW5hIG9ydGhvZ29uYWw/XG4gICAgICAgICAgICAgIGxldCB0MUV4aXRTZXQgPSB0aGlzLl9jb21wdXRlRXhpdFNldChbdDFdKTtcbiAgICAgICAgICAgICAgbGV0IHQyRXhpdFNldCA9IHRoaXMuX2NvbXB1dGVFeGl0U2V0KFt0Ml0pO1xuICAgICAgICAgICAgICBsZXQgaGFzSW50ZXJzZWN0aW9uID0gWy4uLnQxRXhpdFNldF0uc29tZSggcyA9PiB0MkV4aXRTZXQuaGFzKHMpICkgIHx8IFsuLi50MkV4aXRTZXRdLnNvbWUoIHMgPT4gdDFFeGl0U2V0LmhhcyhzKSk7XG4gICAgICAgICAgICAgIHRoaXMuX2xvZygndDFFeGl0U2V0Jyx0MS5zb3VyY2UuaWQsWy4uLnQxRXhpdFNldF0ubWFwKCBzID0+IHMuaWQgKSlcbiAgICAgICAgICAgICAgdGhpcy5fbG9nKCd0MkV4aXRTZXQnLHQyLnNvdXJjZS5pZCxbLi4udDJFeGl0U2V0XS5tYXAoIHMgPT4gcy5pZCApKVxuICAgICAgICAgICAgICB0aGlzLl9sb2coJ2hhc0ludGVyc2VjdGlvbicsaGFzSW50ZXJzZWN0aW9uKVxuICAgICAgICAgICAgICBpZihoYXNJbnRlcnNlY3Rpb24pe1xuICAgICAgICAgICAgICAgICAgaWYodDIuc291cmNlLmRlc2NlbmRhbnRzLmluZGV4T2YodDEuc291cmNlKSA+IC0xKXsgICAgLy9pcyB0aGlzIHRoZSBzYW1lIGFzIGJlaW5nIGFuY2VzdHJhbGx5IHJlbGF0ZWQ/XG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbnNUb1JlbW92ZS5hZGQodDIpXG4gICAgICAgICAgICAgICAgICB9ZWxzZXsgXG4gICAgICAgICAgICAgICAgICAgICAgdDFQcmVlbXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoIXQxUHJlZW1wdGVkKXtcbiAgICAgICAgICAgICAgZm9yKGxldCB0MyBvZiB0cmFuc2l0aW9uc1RvUmVtb3ZlKXtcbiAgICAgICAgICAgICAgICAgIGZpbHRlcmVkVHJhbnNpdGlvbnMucmVtb3ZlKHQzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZpbHRlcmVkVHJhbnNpdGlvbnMuYWRkKHQxKVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgICAgICAgICBcbiAgICAgIHJldHVybiBmaWx0ZXJlZFRyYW5zaXRpb25zO1xuICAgIH0sXG5cbiAgICBfbG9nIDogZnVuY3Rpb24oKXtcbiAgICAgIGlmKHByaW50VHJhY2Upe1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5vcHRzLmNvbnNvbGUubG9nKCBcbiAgICAgICAgICBgJHthcmdzWzBdfTogJHtcbiAgICAgICAgICAgIGFyZ3Muc2xpY2UoMSkubWFwKGZ1bmN0aW9uKGFyZyl7XG4gICAgICAgICAgICAgIHJldHVybiBhcmcgPT09IG51bGwgPyAnbnVsbCcgOiBcbiAgICAgICAgICAgICAgICAoIGFyZyA9PT0gdW5kZWZpbmVkID8gJ3VuZGVmaW5lZCcgOiBcbiAgICAgICAgICAgICAgICAgICggdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgPyBhcmcgOiBcbiAgICAgICAgICAgICAgICAgICAgKCBhcmcudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyB1dGlsLmluc3BlY3QoYXJnKSA6IGFyZy50b1N0cmluZygpKSkpO1xuXG4gICAgICAgICAgICB9KS5qb2luKCcsICcpXG4gICAgICAgICAgfVxcbmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgcmVnaXN0ZXJMaXN0ZW5lciBwcm92aWRlcyBhIGdlbmVyaWMgbWVjaGFuaXNtIHRvIHN1YnNjcmliZSB0byBzdGF0ZSBjaGFuZ2UgYW5kIHJ1bnRpbWUgZXJyb3Igbm90aWZpY2F0aW9ucy5cbiAgICAgICAgQ2FuIGJlIHVzZWQgZm9yIGxvZ2dpbmcgYW5kIGRlYnVnZ2luZy4gRm9yIGV4YW1wbGUsIGNhbiBhdHRhY2ggYSBsb2dnZXIgdGhhdCBzaW1wbHkgbG9ncyB0aGUgc3RhdGUgY2hhbmdlcy5cbiAgICAgICAgT3IgY2FuIGF0dGFjaCBhIG5ldHdvcmsgZGVidWdnaW5nIGNsaWVudCB0aGF0IHNlbmRzIHN0YXRlIGNoYW5nZSBub3RpZmljYXRpb25zIHRvIGEgZGVidWdnaW5nIHNlcnZlci5cbiAgICBcbiAgICAgICAgbGlzdGVuZXIgaXMgb2YgdGhlIGZvcm06XG4gICAgICAgIHtcbiAgICAgICAgICBvbkVudHJ5IDogZnVuY3Rpb24oc3RhdGVJZCl7fSxcbiAgICAgICAgICBvbkV4aXQgOiBmdW5jdGlvbihzdGF0ZUlkKXt9LFxuICAgICAgICAgIG9uVHJhbnNpdGlvbiA6IGZ1bmN0aW9uKHNvdXJjZVN0YXRlSWQsdGFyZ2V0U3RhdGVzSWRzW10pe30sXG4gICAgICAgICAgb25FcnJvcjogZnVuY3Rpb24oZXJyb3JJbmZvKXt9LFxuICAgICAgICAgIG9uQmlnU3RlcEJlZ2luOiBmdW5jdGlvbigpe30sXG4gICAgICAgICAgb25CaWdTdGVwUmVzdW1lOiBmdW5jdGlvbigpe30sXG4gICAgICAgICAgb25CaWdTdGVwU3VzcGVuZDogZnVuY3Rpb24oKXt9LFxuICAgICAgICAgIG9uQmlnU3RlcEVuZDogZnVuY3Rpb24oKXt9XG4gICAgICAgICAgb25TbWFsbFN0ZXBCZWdpbjogZnVuY3Rpb24oZXZlbnQpe30sXG4gICAgICAgICAgb25TbWFsbFN0ZXBFbmQ6IGZ1bmN0aW9uKCl7fVxuICAgICAgICB9XG4gICAgKi9cbiAgICAvL1RPRE86IHJlZmFjdG9yIHRoaXMgdG8gYmUgZXZlbnQgZW1pdHRlcj8gXG5cbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIHJlZ2lzdGVyTGlzdGVuZXIgOiBmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgICAgIEJhc2VJbnRlcnByZXRlci5FVkVOVFMuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgaWYobGlzdGVuZXJbZXZlbnRdKSB0aGlzLm9uKGV2ZW50LGxpc3RlbmVyW2V2ZW50XSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIHVucmVnaXN0ZXJMaXN0ZW5lciA6IGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgICAgQmFzZUludGVycHJldGVyLkVWRU5UUy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICBpZihsaXN0ZW5lcltldmVudF0pIHRoaXMub2ZmKGV2ZW50LGxpc3RlbmVyW2V2ZW50XSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIGdldEFsbFRyYW5zaXRpb25FdmVudHMgOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgZXZlbnRzID0ge307XG4gICAgICAgIGZ1bmN0aW9uIGdldEV2ZW50cyhzdGF0ZSl7XG5cbiAgICAgICAgICAgIGlmKHN0YXRlLnRyYW5zaXRpb25zKXtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0eElkeCA9IDAsIHR4TGVuID0gc3RhdGUudHJhbnNpdGlvbnMubGVuZ3RoOyB0eElkeCA8IHR4TGVuOyB0eElkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50c1tzdGF0ZS50cmFuc2l0aW9uc1t0eElkeF0uZXZlbnRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHN0YXRlSWR4ID0gMCwgc3RhdGVMZW4gPSBzdGF0ZS5zdGF0ZXMubGVuZ3RoOyBzdGF0ZUlkeCA8IHN0YXRlTGVuOyBzdGF0ZUlkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldEV2ZW50cyhzdGF0ZS5zdGF0ZXNbc3RhdGVJZHhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXRFdmVudHModGhpcy5fbW9kZWwpO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhldmVudHMpO1xuICAgIH0sXG5cbiAgICBcbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIC8qKlxuICAgICAgVGhyZWUgdGhpbmdzIGNhcHR1cmUgdGhlIGN1cnJlbnQgc25hcHNob3Qgb2YgYSBydW5uaW5nIFNDSU9OIGludGVycHJldGVyOlxuXG4gICAgICAqIGJhc2ljIGNvbmZpZ3VyYXRpb24gKHRoZSBzZXQgb2YgYmFzaWMgc3RhdGVzIHRoZSBzdGF0ZSBtYWNoaW5lIGlzIGluKVxuICAgICAgKiBoaXN0b3J5IHN0YXRlIHZhbHVlcyAodGhlIHN0YXRlcyB0aGUgc3RhdGUgbWFjaGluZSB3YXMgaW4gbGFzdCB0aW1lIGl0IHdhcyBpbiB0aGUgcGFyZW50IG9mIGEgaGlzdG9yeSBzdGF0ZSlcbiAgICAgICogdGhlIGRhdGFtb2RlbFxuICAgICAgXG4gICAgICBOb3RlIHRoYXQgdGhpcyBhc3N1bWVzIHRoYXQgdGhlIG1ldGhvZCB0byBzZXJpYWxpemUgYSBzY2lvbi5TQ1hNTFxuICAgICAgaW5zdGFuY2UgaXMgbm90IGNhbGxlZCB3aGVuIHRoZSBpbnRlcnByZXRlciBpcyBleGVjdXRpbmcgYSBiaWctc3RlcCAoZS5nLiBhZnRlclxuICAgICAgc2Npb24uU0NYTUwucHJvdG90eXBlLmdlbiBpcyBjYWxsZWQsIGFuZCBiZWZvcmUgdGhlIGNhbGwgdG8gZ2VuIHJldHVybnMpLiBJZlxuICAgICAgdGhlIHNlcmlhbGl6YXRpb24gbWV0aG9kIGlzIGNhbGxlZCBkdXJpbmcgdGhlIGV4ZWN1dGlvbiBvZiBhIGJpZy1zdGVwLCB0aGVuIHRoZVxuICAgICAgaW5uZXIgZXZlbnQgcXVldWUgbXVzdCBhbHNvIGJlIHNhdmVkLiBJIGRvIG5vdCBleHBlY3QgdGhpcyB0byBiZSBhIGNvbW1vblxuICAgICAgcmVxdWlyZW1lbnQgaG93ZXZlciwgYW5kIHRoZXJlZm9yZSBJIGJlbGlldmUgaXQgd291bGQgYmUgYmV0dGVyIHRvIG9ubHkgc3VwcG9ydFxuICAgICAgc2VyaWFsaXphdGlvbiB3aGVuIHRoZSBpbnRlcnByZXRlciBpcyBub3QgZXhlY3V0aW5nIGEgYmlnLXN0ZXAuXG4gICAgKi9cbiAgICBnZXRTbmFwc2hvdCA6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmdldENvbmZpZ3VyYXRpb24oKSxcbiAgICAgICAgdGhpcy5fc2VyaWFsaXplSGlzdG9yeSgpLFxuICAgICAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSxcbiAgICAgICAgdGhpcy5fbW9kZWwuJHNlcmlhbGl6ZURhdGFtb2RlbCgpLFxuICAgICAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUuc2xpY2UoKVxuICAgICAgXTtcbiAgICB9LFxuXG4gICAgX3NlcmlhbGl6ZUhpc3RvcnkgOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIG8gPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2hpc3RvcnlWYWx1ZSkuZm9yRWFjaChmdW5jdGlvbihzaWQpe1xuICAgICAgICBvW3NpZF0gPSB0aGlzLl9oaXN0b3J5VmFsdWVbc2lkXS5tYXAoZnVuY3Rpb24oc3RhdGUpe3JldHVybiBzdGF0ZS5pZH0pO1xuICAgICAgfSx0aGlzKTtcbiAgICAgIHJldHVybiBvO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQmFzZUludGVycHJldGVyXG4gKi9cbmZ1bmN0aW9uIFN0YXRlY2hhcnQobW9kZWwsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICAgIG9wdHMuSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0ID0gb3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgfHwgSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0O1xuXG4gICAgdGhpcy5faXNTdGVwcGluZyA9IGZhbHNlO1xuXG4gICAgQmFzZUludGVycHJldGVyLmNhbGwodGhpcyxtb2RlbCxvcHRzKTsgICAgIC8vY2FsbCBzdXBlciBjb25zdHJ1Y3RvclxuXG4gICAgbW9kdWxlLmV4cG9ydHMuZW1pdCgnbmV3Jyx0aGlzKTtcbn1cblxuZnVuY3Rpb24gYmVnZXQobyl7XG4gICAgZnVuY3Rpb24gRigpe31cbiAgICBGLnByb3RvdHlwZSA9IG87XG4gICAgcmV0dXJuIG5ldyBGKCk7XG59XG5cbi8qKlxuICogRG8gbm90aGluZ1xuICovXG5mdW5jdGlvbiBub3AoKSB7fVxuXG4vL1N0YXRlY2hhcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlKTtcbi8vd291bGQgbGlrZSB0byB1c2UgT2JqZWN0LmNyZWF0ZSBoZXJlLCBidXQgbm90IHBvcnRhYmxlLCBidXQgaXQncyB0b28gY29tcGxpY2F0ZWQgdG8gdXNlIHBvcnRhYmx5XG5TdGF0ZWNoYXJ0LnByb3RvdHlwZSA9IGJlZ2V0KEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUpOyAgICBcblxuLyoqIEBleHBvc2UgKi9cblN0YXRlY2hhcnQucHJvdG90eXBlLmdlbiA9IGZ1bmN0aW9uKGV2dE9iak9yTmFtZSxvcHRpb25hbERhdGEpIHtcblxuICAgIHZhciBjdXJyZW50RXZlbnQ7XG4gICAgc3dpdGNoKHR5cGVvZiBldnRPYmpPck5hbWUpe1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY3VycmVudEV2ZW50ID0ge25hbWUgOiBldnRPYmpPck5hbWUsIGRhdGEgOiBvcHRpb25hbERhdGF9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICBpZih0eXBlb2YgZXZ0T2JqT3JOYW1lLm5hbWUgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50RXZlbnQgPSBldnRPYmpPck5hbWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IG9iamVjdCBtdXN0IGhhdmUgXCJuYW1lXCIgcHJvcGVydHkgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgdG8gZ2VuIG11c3QgYmUgYSBzdHJpbmcgb3Igb2JqZWN0LicpO1xuICAgIH1cblxuICAgIGlmKHRoaXMuX2lzU3RlcHBpbmcpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhbGwgZ2VuIGR1cmluZyBhIGJpZy1zdGVwJyk7XG5cbiAgICAvL290aGVyd2lzZSwga2ljayBoaW0gb2ZmXG4gICAgdGhpcy5faXNTdGVwcGluZyA9IHRydWU7XG5cbiAgICB0aGlzLl9wZXJmb3JtQmlnU3RlcChjdXJyZW50RXZlbnQpO1xuXG4gICAgdGhpcy5faXNTdGVwcGluZyA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcbn07XG5cbi8qKlxuICogSW5qZWN0cyBhbiBleHRlcm5hbCBldmVudCBpbnRvIHRoZSBpbnRlcnByZXRlciBhc3luY2hyb25vdXNseVxuICogQHBhcmFtICB7b2JqZWN0fSAgIGN1cnJlbnRFdmVudCBUaGUgZXZlbnQgdG8gaW5qZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gY3VycmVudEV2ZW50Lm5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge3N0cmluZ30gW2N1cnJlbnRFdmVudC5kYXRhXSBUaGUgZXZlbnQgZGF0YVxuICogQHBhcmFtICB7RnVuY3Rpb259IGNiIENhbGxiYWNrIGludm9rZWQgd2l0aCBhbiBlcnJvciBvciB0aGUgaW50ZXJwcmV0ZXIncyBzdGFibGUgY29uZmlndXJhdGlvblxuICogQGV4cG9zZVxuICovXG5TdGF0ZWNoYXJ0LnByb3RvdHlwZS5nZW5Bc3luYyA9IGZ1bmN0aW9uKGN1cnJlbnRFdmVudCwgY2IpIHtcbiAgICBpZiAoY3VycmVudEV2ZW50ICE9PSBudWxsICYmICh0eXBlb2YgY3VycmVudEV2ZW50ICE9PSAnb2JqZWN0JyB8fCAhY3VycmVudEV2ZW50IHx8IHR5cGVvZiBjdXJyZW50RXZlbnQubmFtZSAhPT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY3VycmVudEV2ZW50IHRvIGJlIG51bGwgb3IgYW4gT2JqZWN0IHdpdGggYSBuYW1lJyk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2IgPSBub3A7XG4gICAgfVxuXG4gICAgdGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLnB1c2goW2N1cnJlbnRFdmVudCwgY2JdKTtcblxuICAgIC8vdGhlIHNlbWFudGljcyB3ZSB3YW50IGFyZSB0byByZXR1cm4gdG8gdGhlIGNiIHRoZSByZXN1bHRzIG9mIHByb2Nlc3NpbmcgdGhhdCBwYXJ0aWN1bGFyIGV2ZW50LlxuICAgIGZ1bmN0aW9uIG5leHRTdGVwKGUsIGMpe1xuICAgICAgdGhpcy5fcGVyZm9ybUJpZ1N0ZXBBc3luYyhlLCBmdW5jdGlvbihlcnIsIGNvbmZpZykge1xuICAgICAgICAgIGMoZXJyLCBjb25maWcpO1xuXG4gICAgICAgICAgaWYodGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLmxlbmd0aCl7XG4gICAgICAgICAgICBuZXh0U3RlcC5hcHBseSh0aGlzLHRoaXMuX2V4dGVybmFsRXZlbnRRdWV1ZS5zaGlmdCgpKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuX2lzU3RlcHBpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZighdGhpcy5faXNTdGVwcGluZyl7IFxuICAgICAgdGhpcy5faXNTdGVwcGluZyA9IHRydWU7XG4gICAgICBuZXh0U3RlcC5hcHBseSh0aGlzLHRoaXMuX2V4dGVybmFsRXZlbnRRdWV1ZS5zaGlmdCgpKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQoaW50ZXJwcmV0ZXIpIHtcbiAgICB0aGlzLl9pbnRlcnByZXRlciA9IGludGVycHJldGVyO1xuICAgIHRoaXMuX3RpbWVvdXRNYXAgPSB7fTtcbiAgICB0aGlzLl9pbnZva2VNYXAgPSB7fTtcbiAgICB0aGlzLl90aW1lb3V0cyA9IG5ldyBTZXQoKVxufVxuXG4vL1JlZ2V4IGZyb206XG4vLyAgaHR0cDovL2RhcmluZ2ZpcmViYWxsLm5ldC8yMDEwLzA3L2ltcHJvdmVkX3JlZ2V4X2Zvcl9tYXRjaGluZ191cmxzXG4vLyAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjkyNzg3OFxudmFyIHZhbGlkYXRlVXJpUmVnZXggPSAvKCNfLiopfFxcYigoPzpbYS16XVtcXHctXSs6KD86XFwvezEsM318W2EtejAtOSVdKXx3d3dcXGR7MCwzfVsuXXxbYS16MC05LlxcLV0rWy5dW2Etel17Miw0fVxcLykoPzpbXlxccygpPD5dK3xcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpKSsoPzpcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpfFteXFxzYCEoKVxcW1xcXXt9OzonXCIuLDw+P8KrwrvigJzigJ3igJjigJldKSkvaTtcblxuLy9UT0RPOiBjb25zaWRlciB3aGV0aGVyIHRoaXMgaXMgdGhlIEFQSSB3ZSB3b3VsZCBsaWtlIHRvIGV4cG9zZVxuSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBpbnZva2VTZW5kVGFyZ2V0UmVnZXggIDogL14jXyguKikkLyxcbiAgICBzY3htbFNlbmRUYXJnZXRSZWdleCAgOiAvXiNfc2N4bWxfKC4qKSQvLFxuICAgIHJhaXNlIDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB0aGlzLl9pbnN0YWxsRGVmYXVsdFByb3BzT25FdmVudChldmVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9pbnRlcm5hbEV2ZW50UXVldWUucHVzaChldmVudCk7IFxuICAgIH0sXG4gICAgcGFyc2VYbWxTdHJpbmdBc0RPTSA6IGZ1bmN0aW9uKHhtbFN0cmluZyl7XG4gICAgICByZXR1cm4gKHRoaXMuX2ludGVycHJldGVyLm9wdHMueG1sUGFyc2VyIHx8IEludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dC54bWxQYXJzZXIpLnBhcnNlKHhtbFN0cmluZyk7XG4gICAgfSxcbiAgICBpbnZva2UgOiBmdW5jdGlvbihpbnZva2VPYmope1xuICAgICAgLy9sb29rIHVwIGludm9rZXIgYnkgdHlwZS4gYXNzdW1lIGludm9rZXJzIGFyZSBwYXNzZWQgaW4gYXMgYW4gb3B0aW9uIHRvIGNvbnN0cnVjdG9yXG4gICAgICB0aGlzLl9pbnZva2VNYXBbaW52b2tlT2JqLmlkXSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgKHRoaXMuX2ludGVycHJldGVyLm9wdHMuaW52b2tlcnMgfHwgSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0Lmludm9rZXJzKVtpbnZva2VPYmoudHlwZV0odGhpcy5faW50ZXJwcmV0ZXIsIGludm9rZU9iaiwgKGVyciwgc2Vzc2lvbikgPT4ge1xuICAgICAgICAgIGlmKGVycikgcmV0dXJuIHJlamVjdChlcnIpO1xuXG4gICAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuZW1pdCgnb25JbnZva2VkU2Vzc2lvbkluaXRpYWxpemVkJywgc2Vzc2lvbik7XG4gICAgICAgICAgcmVzb2x2ZShzZXNzaW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNhbmNlbEludm9rZSA6IGZ1bmN0aW9uKGludm9rZWlkKXtcbiAgICAgIC8vVE9ETzogb24gY2FuY2VsIGludm9rZSBjbGVhbiB1cCB0aGlzLl9pbnZva2VNYXBcbiAgICAgIGxldCBzZXNzaW9uUHJvbWlzZSA9IHRoaXMuX2ludm9rZU1hcFtpbnZva2VpZF07XG4gICAgICB0aGlzLl9pbnRlcnByZXRlci5fbG9nKGBjYW5jZWxsaW5nIHNlc3Npb24gd2l0aCBpbnZva2VpZCAke2ludm9rZWlkfWApO1xuICAgICAgaWYoc2Vzc2lvblByb21pc2Upe1xuICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5fbG9nKGBzZXNzaW9uUHJvbWlzZSBmb3VuZGApO1xuICAgICAgICBzZXNzaW9uUHJvbWlzZS50aGVuKCBcbiAgICAgICAgICAoKHNlc3Npb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coYHJlc29sdmVkIHNlc3Npb24gJHtpbnZva2VpZH0uIGNhbmNlbGxpbmcuLi4gYCk7XG4gICAgICAgICAgICBzZXNzaW9uLmNhbmNlbCgpOyBcbiAgICAgICAgICAgIC8vY2xlYW4gdXBcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9pbnZva2VNYXBbaW52b2tlaWRdO1xuICAgICAgICAgIH0pLCBcbiAgICAgICAgICAoIChlcnIpID0+IHtcbiAgICAgICAgICAgIC8vVE9ETzogZGlzcGF0Y2ggZXJyb3IgYmFjayBpbnRvIHRoZSBzdGF0ZSBtYWNoaW5lIGFzIGVycm9yLmNvbW11bmljYXRpb25cbiAgICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBfaW5zdGFsbERlZmF1bHRQcm9wc09uRXZlbnQgOiBmdW5jdGlvbihldmVudCxpc0ludGVybmFsKXtcbiAgICAgIGlmKCFpc0ludGVybmFsKXsgXG4gICAgICAgIGV2ZW50Lm9yaWdpbiA9IHRoaXMuX2ludGVycHJldGVyLm9wdHMuX3guX2lvcHJvY2Vzc29ycy5zY3htbC5sb2NhdGlvbjsgICAgIC8vVE9ETzogcHJlc2VydmUgb3JpZ2luYWwgb3JpZ2luIHdoZW4gd2UgYXV0b2ZvcndhcmQ/IFxuICAgICAgICBldmVudC5vcmlnaW50eXBlID0gZXZlbnQudHlwZSB8fCBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFO1xuICAgICAgfVxuICAgICAgaWYodHlwZW9mIGV2ZW50LnR5cGUgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgZXZlbnQudHlwZSA9IGlzSW50ZXJuYWwgPyAnaW50ZXJuYWwnIDogJ2V4dGVybmFsJztcbiAgICAgIH1cbiAgICAgIFtcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICAnc2VuZGlkJyxcbiAgICAgICAgJ2ludm9rZWlkJyxcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICAnb3JpZ2luJyxcbiAgICAgICAgJ29yaWdpbnR5cGUnXG4gICAgICBdLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgIGlmKHR5cGVvZiBldmVudFtwcm9wXSA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgIGV2ZW50W3Byb3BdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNlbmQgOiBmdW5jdGlvbihldmVudCwgb3B0aW9ucyl7XG4gICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coJ3NlbmQgZXZlbnQnLCBldmVudCwgb3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB2YXIgc2VuZFR5cGUgPSBvcHRpb25zLnR5cGUgfHwgU0NYTUxfSU9QUk9DRVNTT1JfVFlQRTtcbiAgICAgICAgLy9UT0RPOiBtb3ZlIHRoZXNlIG91dFxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZVNlbmQoZXZlbnQsIG9wdGlvbnMsIHNlbmRBY3Rpb24pe1xuICAgICAgICAgIGlmKGV2ZW50LnRhcmdldCl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0SXNWYWxpZFVyaSA9IHZhbGlkYXRlVXJpUmVnZXgudGVzdChldmVudC50YXJnZXQpXG4gICAgICAgICAgICBpZighdGFyZ2V0SXNWYWxpZFVyaSl7XG4gICAgICAgICAgICAgIHRocm93IHsgbmFtZSA6IFwiZXJyb3IuZXhlY3V0aW9uXCIsIGRhdGE6ICdUYXJnZXQgaXMgbm90IHZhbGlkIFVSSScsIHNlbmRpZDogZXZlbnQuc2VuZGlkLCB0eXBlIDogJ3BsYXRmb3JtJyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiggc2VuZFR5cGUgIT09IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUpIHsgIC8vVE9ETzogZXh0ZW5kIHRoaXMgdG8gc3VwcG9ydCBIVFRQLCBhbmQgb3RoZXIgSU8gcHJvY2Vzc29yc1xuICAgICAgICAgICAgICB0aHJvdyB7IG5hbWUgOiBcImVycm9yLmV4ZWN1dGlvblwiLCBkYXRhOiAnVW5zdXBwb3J0ZWQgZXZlbnQgcHJvY2Vzc29yIHR5cGUnLCBzZW5kaWQ6IGV2ZW50LnNlbmRpZCwgdHlwZSA6ICdwbGF0Zm9ybScgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZW5kQWN0aW9uLmNhbGwodGhpcywgZXZlbnQsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVmYXVsdFNlbmRBY3Rpb24gKGV2ZW50LCBvcHRpb25zKSB7XG5cbiAgICAgICAgICBpZiggdHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnICkgdGhyb3cgbmV3IEVycm9yKCdEZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIFN0YXRlY2hhcnQucHJvdG90eXBlLnNlbmQgd2lsbCBub3Qgd29yayB1bmxlc3Mgc2V0VGltZW91dCBpcyBkZWZpbmVkIGdsb2JhbGx5LicpO1xuXG4gICAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICAgIGlmKGV2ZW50LnRhcmdldCA9PT0gJyNfaW50ZXJuYWwnKXtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoZXZlbnQpO1xuICAgICAgICAgIH1lbHNleyBcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbGxEZWZhdWx0UHJvcHNPbkV2ZW50KGV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICBldmVudC5vcmlnaW50eXBlID0gU0NYTUxfSU9QUk9DRVNTT1JfVFlQRTsgICAgICAvL1RPRE86IGV4dGVuZCB0aGlzIHRvIHN1cHBvcnQgSFRUUCwgYW5kIG90aGVyIElPIHByb2Nlc3NvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETyA6IHBhcmFtdGVyaXplIHRoaXMgYmFzZWQgb24gc2VuZC9AdHlwZT9cbiAgICAgICAgICAgIGlmKCFldmVudC50YXJnZXQpe1xuICAgICAgICAgICAgICBkb1NlbmQuY2FsbCh0aGlzLCB0aGlzLl9pbnRlcnByZXRlcik7XG4gICAgICAgICAgICB9ZWxzZSBpZihldmVudC50YXJnZXQgPT09ICcjX3BhcmVudCcpe1xuICAgICAgICAgICAgICBpZih0aGlzLl9pbnRlcnByZXRlci5vcHRzLnBhcmVudFNlc3Npb24pe1xuICAgICAgICAgICAgICAgIGV2ZW50Lmludm9rZWlkID0gdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5pbnZva2VpZDtcbiAgICAgICAgICAgICAgICBkb1NlbmQuY2FsbCh0aGlzLCB0aGlzLl9pbnRlcnByZXRlci5vcHRzLnBhcmVudFNlc3Npb24pO1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aHJvdyB7IG5hbWUgOiBcImVycm9yLmNvbW11bmljYXRpb25cIiwgZGF0YTogJ1BhcmVudCBzZXNzaW9uIG5vdCBzcGVjaWZpZWQnLCBzZW5kaWQ6IGV2ZW50LnNlbmRpZCwgdHlwZSA6ICdwbGF0Zm9ybScgfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmKG1hdGNoID0gZXZlbnQudGFyZ2V0Lm1hdGNoKHRoaXMuc2N4bWxTZW5kVGFyZ2V0UmVnZXgpKXtcbiAgICAgICAgICAgICAgbGV0IHRhcmdldFNlc3Npb25JZCA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgICBsZXQgc2Vzc2lvbiA9IHRoaXMuX2ludGVycHJldGVyLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5LmdldCh0YXJnZXRTZXNzaW9uSWQpXG4gICAgICAgICAgICAgIGlmKHNlc3Npb24pe1xuICAgICAgICAgICAgICAgIGRvU2VuZC5jYWxsKHRoaXMsc2Vzc2lvbik7XG4gICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyB7bmFtZSA6ICdlcnJvci5jb21tdW5pY2F0aW9uJywgc2VuZGlkOiBldmVudC5zZW5kaWQsIHR5cGUgOiAncGxhdGZvcm0nfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYobWF0Y2ggPSBldmVudC50YXJnZXQubWF0Y2godGhpcy5pbnZva2VTZW5kVGFyZ2V0UmVnZXgpKXtcbiAgICAgICAgICAgICAgLy9UT0RPOiB0ZXN0IHRoaXMgY29kZSBwYXRoLlxuICAgICAgICAgICAgICB2YXIgaW52b2tlSWQgPSBtYXRjaFsxXVxuICAgICAgICAgICAgICB0aGlzLl9pbnZva2VNYXBbaW52b2tlSWRdLnRoZW4oIChzZXNzaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9TZW5kLmNhbGwodGhpcyxzZXNzaW9uKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5yZWNvZ25pemVkIHNlbmQgdGFyZ2V0LicpOyAvL1RPRE86IGRpc3BhdGNoIGVycm9yIGJhY2sgaW50byB0aGUgc3RhdGUgbWFjaGluZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGZ1bmN0aW9uIGRvU2VuZChzZXNzaW9uKXtcbiAgICAgICAgICAgIC8vVE9ETzogd2UgcHJvYmFibHkgbm93IG5lZWQgdG8gcmVmYWN0b3IgZGF0YSBzdHJ1Y3R1cmVzOlxuICAgICAgICAgICAgLy8gICAgdGhpcy5fdGltZW91dHNcbiAgICAgICAgICAgIC8vICAgIHRoaXMuX3RpbWVvdXRNYXBcbiAgICAgICAgICAgIHZhciB0aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBpZiAoZXZlbnQuc2VuZGlkKSBkZWxldGUgdGhpcy5fdGltZW91dE1hcFtldmVudC5zZW5kaWRdO1xuICAgICAgICAgICAgICB0aGlzLl90aW1lb3V0cy5kZWxldGUodGltZW91dE9wdGlvbnMpO1xuICAgICAgICAgICAgICBpZih0aGlzLl9pbnRlcnByZXRlci5vcHRzLmRvU2VuZCl7XG4gICAgICAgICAgICAgICAgdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5kb1NlbmQoc2Vzc2lvbiwgZXZlbnQpO1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzZXNzaW9uW3RoaXMuX2ludGVycHJldGVyLm9wdHMuc2VuZEFzeW5jID8gJ2dlbkFzeW5jJyA6ICdnZW4nXShldmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgb3B0aW9ucy5kZWxheSB8fCAwKTtcblxuICAgICAgICAgICAgdmFyIHRpbWVvdXRPcHRpb25zID0ge1xuICAgICAgICAgICAgICBzZW5kT3B0aW9ucyA6IG9wdGlvbnMsXG4gICAgICAgICAgICAgIHRpbWVvdXRIYW5kbGUgOiB0aW1lb3V0SGFuZGxlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNlbmRpZCkgdGhpcy5fdGltZW91dE1hcFtldmVudC5zZW5kaWRdID0gdGltZW91dEhhbmRsZTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVvdXRzLmFkZCh0aW1lb3V0T3B0aW9ucyk7IFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHB1Ymxpc2goKXtcbiAgICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5lbWl0KGV2ZW50Lm5hbWUsZXZlbnQuZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2Nob29zZSBzZW5kIGZ1bmN0aW9uXG4gICAgICAgIC8vVE9ETzogcmV0aGluayBob3cgdGhpcyBjdXN0b20gc2VuZCB3b3Jrc1xuICAgICAgICB2YXIgc2VuZEZuOyAgICAgICAgIFxuICAgICAgICBpZihldmVudC50eXBlID09PSAnaHR0cHM6Ly9naXRodWIuY29tL2piZWFyZDQvU0NJT04jcHVibGlzaCcpe1xuICAgICAgICAgIHNlbmRGbiA9IHB1Ymxpc2g7XG4gICAgICAgIH1lbHNlIGlmKHRoaXMuX2ludGVycHJldGVyLm9wdHMuY3VzdG9tU2VuZCl7XG4gICAgICAgICAgc2VuZEZuID0gdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5jdXN0b21TZW5kO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBzZW5kRm4gPSBkZWZhdWx0U2VuZEFjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnM9b3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5fbG9nKFwic2VuZGluZyBldmVudFwiLCBldmVudC5uYW1lLCBcIndpdGggY29udGVudFwiLCBldmVudC5kYXRhLCBcImFmdGVyIGRlbGF5XCIsIG9wdGlvbnMuZGVsYXkpO1xuXG4gICAgICAgIHZhbGlkYXRlU2VuZC5jYWxsKHRoaXMsIGV2ZW50LCBvcHRpb25zLCBzZW5kRm4pO1xuICAgIH0sXG4gICAgY2FuY2VsIDogZnVuY3Rpb24oc2VuZGlkKXtcbiAgICAgICAgaWYodGhpcy5faW50ZXJwcmV0ZXIub3B0cy5jdXN0b21DYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmN1c3RvbUNhbmNlbC5hcHBseSh0aGlzLCBbc2VuZGlkXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggdHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ3VuZGVmaW5lZCcgKSB0aHJvdyBuZXcgRXJyb3IoJ0RlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgU3RhdGVjaGFydC5wcm90b3R5cGUuY2FuY2VsIHdpbGwgbm90IHdvcmsgdW5sZXNzIHNldFRpbWVvdXQgaXMgZGVmaW5lZCBnbG9iYWxseS4nKTtcblxuICAgICAgICBpZiAoc2VuZGlkIGluIHRoaXMuX3RpbWVvdXRNYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coXCJjYW5jZWxsaW5nIFwiLCBzZW5kaWQsIFwiIHdpdGggdGltZW91dCBpZCBcIiwgdGhpcy5fdGltZW91dE1hcFtzZW5kaWRdKTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0TWFwW3NlbmRpZF0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQobmV3IEV2ZW50RW1pdHRlcix7XG4gICAgLyoqIEBleHBvc2UgKi9cbiAgICBCYXNlSW50ZXJwcmV0ZXI6IEJhc2VJbnRlcnByZXRlcixcbiAgICAvKiogQGV4cG9zZSAqL1xuICAgIFN0YXRlY2hhcnQ6IFN0YXRlY2hhcnQsXG4gICAgLyoqIEBleHBvc2UgKi9cbiAgICBBcnJheVNldCA6IEFycmF5U2V0LFxuICAgIC8qKiBAZXhwb3NlICovXG4gICAgU1RBVEVfVFlQRVMgOiBjb25zdGFudHMuU1RBVEVfVFlQRVMsXG4gICAgLyoqIEBleHBvc2UgKi9cbiAgICBpbml0aWFsaXplTW9kZWwgOiBpbml0aWFsaXplTW9kZWwsXG4gICAgLyoqIEBleHBvc2UgKi9cbiAgICBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgOiBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHRcbn0pO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIF9vbih0eXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLl9saXN0ZW5lcnNbdHlwZV0pKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXSA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbdHlwZV0uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIF9vbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gX19vbmNlKCkge1xuICAgICAgICBmb3IgKHZhciBhcmdzID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5vZmYodHlwZSwgX19vbmNlKTtcbiAgICAgICAgbGlzdGVuZXIuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuXG4gICAgX19vbmNlLmxpc3RlbmVyID0gbGlzdGVuZXI7XG5cbiAgICByZXR1cm4gdGhpcy5vbih0eXBlLCBfX29uY2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiBfb2ZmKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX2xpc3RlbmVyc1t0eXBlXSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbdHlwZV1baV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBfZW1pdCh0eXBlKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX2xpc3RlbmVyc1t0eXBlXSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgYXJncyA9IFtdLCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uZm9yRWFjaChmdW5jdGlvbiBfX2VtaXQobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiJdfQ==
