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

function initializeModel(rootState, opts) {
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
            name: state.name,
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
            if ((opts && opts.legacySemantics ? anc.typeEnum === STATE_TYPES.COMPOSITE : anc.typeEnum === STATE_TYPES.COMPOSITE || anc.typeEnum === STATE_TYPES.PARALLEL) && anc.descendants.indexOf(s2) > -1) {

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
'use strict';

var constants = require('./constants');

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
    isOrthogonalTo: function isOrthogonalTo(s1, s2) {
        //Two control states are orthogonal if they are not ancestrally
        //related, and their smallest, mutual parent is a Concurrent-state.
        return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).typeEnum === constants.STATE_TYPES.PARALLEL;
    },
    isAncestrallyRelatedTo: function isAncestrallyRelatedTo(s1, s2) {
        //Two control states are ancestrally related if one is child/grandchild of another.
        return this.getAncestorsOrSelf(s2).indexOf(s1) > -1 || this.getAncestorsOrSelf(s1).indexOf(s2) > -1;
    },
    getAncestorsOrSelf: function getAncestorsOrSelf(s, root) {
        return [s].concat(query.getAncestors(s, root));
    },
    getDescendantsOrSelf: function getDescendantsOrSelf(s) {
        return [s].concat(s.descendants);
    },
    getLCA: function getLCA(s1, s2) {
        var commonAncestors = this.getAncestors(s1).filter(function (a) {
            return a.descendants.indexOf(s2) > -1;
        }, this);
        return commonAncestors[0];
    }
};

module.exports = query;

},{"./constants":2}],5:[function(require,module,exports){
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * @param {boolean} [opts.legacySemantics]
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

var BaseInterpreter = function (_EventEmitter) {
  _inherits(BaseInterpreter, _EventEmitter);

  function BaseInterpreter(modelOrModelFactory, opts) {
    _classCallCheck(this, BaseInterpreter);

    var _this = _possibleConstructorReturn(this, (BaseInterpreter.__proto__ || Object.getPrototypeOf(BaseInterpreter)).call(this));

    _this.opts = opts;

    _this.opts.InterpreterScriptingContext = _this.opts.InterpreterScriptingContext || InterpreterScriptingContext;

    _this._isStepping = false;

    _this._scriptingContext = _this.opts.interpreterScriptingContext || (_this.opts.InterpreterScriptingContext ? new _this.opts.InterpreterScriptingContext(_this) : {});

    _this.opts.generateSessionid = _this.opts.generateSessionid || BaseInterpreter.generateSessionid;
    _this.opts.sessionid = _this.opts.sessionid || _this.opts.generateSessionid();
    _this.opts.sessionRegistry = _this.opts.sessionRegistry || BaseInterpreter.sessionRegistry; //TODO: define a better interface. For now, assume a Map<sessionid, session>


    var _ioprocessors = {};
    _ioprocessors[SCXML_IOPROCESSOR_TYPE] = {
      location: '#_scxml_' + _this.opts.sessionid
    };
    _ioprocessors.scxml = _ioprocessors[SCXML_IOPROCESSOR_TYPE]; //alias

    //SCXML system variables:
    _this.opts._x = {
      _sessionid: _this.opts.sessionid,
      _ioprocessors: _ioprocessors
    };

    var model;
    if (typeof modelOrModelFactory === 'function') {
      model = initializeModelGeneratorFn(modelOrModelFactory, _this.opts, _this);
    } else if ((typeof modelOrModelFactory === 'undefined' ? 'undefined' : _typeof(modelOrModelFactory)) === 'object') {
      model = JSON.parse(JSON.stringify(modelOrModelFactory)); //assume object
    } else {
      throw new Error('Unexpected model type. Expected model factory function, or scjson object.');
    }

    _this._model = initializeModel(model, _this.opts);

    _this.opts.console = _this.opts.console || (typeof console === 'undefined' ? { log: function log() {} } : console); //rely on global console if this console is undefined
    _this.opts.Set = _this.opts.Set || ArraySet;
    _this.opts.priorityComparisonFn = _this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority;
    _this.opts.transitionSelector = _this.opts.transitionSelector || scxmlPrefixTransitionSelector;

    _this.opts.sessionRegistry.set(String(_this.opts.sessionid), _this);

    _this._scriptingContext.log = _this._scriptingContext.log || function log() {
      if (this.opts.console.log.apply) {
        this.opts.console.log.apply(this.opts.console, arguments);
      } else {
        //console.log on older IE does not support Function.apply, so just pass him the first argument. Best we can do for now.
        this.opts.console.log(Array.prototype.slice.apply(arguments).join(','));
      }
    }.bind(_this); //set up default scripting context log function

    _this._externalEventQueue = [];
    _this._internalEventQueue = [];

    if (_this.opts.params) {
      _this._model.$deserializeDatamodel(_this.opts.params); //load up the datamodel
    }

    //check if we're loading from a previous snapshot
    if (_this.opts.snapshot) {
      _this._configuration = new _this.opts.Set(deserializeSerializedConfiguration(_this.opts.snapshot[0], _this._model.$idToStateMap));
      _this._historyValue = deserializeHistory(_this.opts.snapshot[1], _this._model.$idToStateMap);
      _this._isInFinalState = _this.opts.snapshot[2];
      _this._model.$deserializeDatamodel(_this.opts.snapshot[3]); //load up the datamodel
      _this._internalEventQueue = _this.opts.snapshot[4];
    } else {
      _this._configuration = new _this.opts.Set();
      _this._historyValue = {};
      _this._isInFinalState = false;
    }

    //add debug logging
    BaseInterpreter.EVENTS.forEach(function (event) {
      this.on(event, this._log.bind(this, event));
    }, _this);

    module.exports.emit('new', _this);
    return _this;
  }

  /** 
  * Cancels the session. This clears all timers; puts the interpreter in a
  * final state; and runs all exit actions on current states.
  * @memberof BaseInterpreter.prototype
  */


  _createClass(BaseInterpreter, [{
    key: 'cancel',
    value: function cancel() {
      delete this.opts.parentSession;
      if (this._isInFinalState) return;
      this._isInFinalState = true;
      this._log('session cancelled ' + this.opts.invokeid);
      this._exitInterpreter(null);
    }
  }, {
    key: '_exitInterpreter',
    value: function _exitInterpreter(event) {
      var _this2 = this;

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
          _this2._scriptingContext.cancelInvoke(invoke.id);
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
    }

    /** 
     * Starts the interpreter. Should only be called once, and should be called
     * before BaseInterpreter.prototype#gen is called for the first time.  Returns a
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

  }, {
    key: 'start',
    value: function start() {
      this._initStart();
      this._performBigStep();
      return this.getConfiguration();
    }

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

  }, {
    key: 'startAsync',
    value: function startAsync(cb) {
      cb = this._initStart(cb);
      this.genAsync(null, cb);
    }
  }, {
    key: '_initStart',
    value: function _initStart(cb) {
      var _this3 = this;

      if (typeof cb !== 'function') {
        cb = nop;
      }

      this._log("performing initial big step");

      //We effectively need to figure out states to enter here to populate initial config. assuming root is compound state makes this simple.
      //but if we want it to be parallel, then this becomes more complex. so when initializing the model, we add a 'fake' root state, which
      //makes the following operation safe.
      this._model.initialRef.forEach(function (s) {
        return _this3._configuration.add(s);
      });

      return cb;
    }

    /** 
    * Returns state machine {@link Configuration}.
    * @return {Configuration}
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: 'getConfiguration',
    value: function getConfiguration() {
      return this._configuration.iter().map(function (s) {
        return s.id;
      });
    }
  }, {
    key: '_getFullConfiguration',
    value: function _getFullConfiguration() {
      return this._configuration.iter().map(function (s) {
        return [s].concat(query.getAncestors(s));
      }, this).reduce(function (a, b) {
        return a.concat(b);
      }, []). //flatten
      reduce(function (a, b) {
        return a.indexOf(b) > -1 ? a : a.concat(b);
      }, []); //uniq
    }

    /** 
    * @return {FullConfiguration}
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: 'getFullConfiguration',
    value: function getFullConfiguration() {
      return this._getFullConfiguration().map(function (s) {
        return s.id;
      });
    }

    /** 
    * @return {boolean}
    * @memberof BaseInterpreter.prototype 
    * @param {string} stateName
    */

  }, {
    key: 'isIn',
    value: function isIn(stateName) {
      return this.getFullConfiguration().indexOf(stateName) > -1;
    }

    /** 
    * Is the state machine in a final state?
    * @return {boolean}
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: 'isFinal',
    value: function isFinal() {
      return this._isInFinalState;
    }

    /** @private */

  }, {
    key: '_performBigStep',
    value: function _performBigStep(e) {
      var currentEvent = void 0,
          keepGoing = void 0,
          allStatesExited = void 0,
          allStatesEntered = void 0;

      var _startBigStep2 = this._startBigStep(e);

      var _startBigStep3 = _slicedToArray(_startBigStep2, 4);

      allStatesExited = _startBigStep3[0];
      allStatesEntered = _startBigStep3[1];
      keepGoing = _startBigStep3[2];
      currentEvent = _startBigStep3[3];


      while (keepGoing) {
        var _selectTransitionsAnd = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);

        var _selectTransitionsAnd2 = _slicedToArray(_selectTransitionsAnd, 2);

        currentEvent = _selectTransitionsAnd2[0];
        keepGoing = _selectTransitionsAnd2[1];
      }

      this._finishBigStep(currentEvent, allStatesEntered, allStatesExited);
    }
  }, {
    key: '_selectTransitionsAndPerformSmallStep',
    value: function _selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited) {
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

        var _performSmallStep2 = this._performSmallStep(currentEvent, selectedTransitions);

        var _performSmallStep3 = _slicedToArray(_performSmallStep2, 2);

        statesExited = _performSmallStep3[0];
        statesEntered = _performSmallStep3[1];

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
    }
  }, {
    key: '_startBigStep',
    value: function _startBigStep(e) {
      var _this4 = this;

      this.emit('onBigStepBegin', e);

      //do applyFinalize and autoforward
      this._configuration.iter().forEach(function (state) {
        if (state.invokes) state.invokes.forEach(function (invoke) {
          if (invoke.autoforward) {
            //autoforward
            _this4._scriptingContext.send({
              target: '#_' + invoke.id,
              name: e.name,
              data: e.data
            });
          }
          if (invoke.id === e.invokeid) {
            //applyFinalize
            if (invoke.finalize) invoke.finalize.forEach(function (action) {
              return _this4._evaluateAction(e, action);
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
    }
  }, {
    key: '_finishBigStep',
    value: function _finishBigStep(e, allStatesEntered, allStatesExited, cb) {
      var _this5 = this;

      var statesToInvoke = Array.from(new Set([].concat(_toConsumableArray(allStatesEntered)).filter(function (s) {
        return s.invokes && !allStatesExited.has(s);
      }))).sort(sortInEntryOrder);

      // Here we invoke whatever needs to be invoked. The implementation of 'invoke' is platform-specific
      statesToInvoke.forEach(function (s) {
        s.invokes.forEach(function (f) {
          return _this5._evaluateAction(e, f);
        });
      });

      // cancel invoke for allStatesExited
      allStatesExited.forEach(function (s) {
        if (s.invokes) s.invokes.forEach(function (invoke) {
          _this5._scriptingContext.cancelInvoke(invoke.id);
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
    }
  }, {
    key: '_cancelAllDelayedSends',
    value: function _cancelAllDelayedSends() {
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
    }
  }, {
    key: '_performBigStepAsync',
    value: function _performBigStepAsync(e, cb) {
      var currentEvent = void 0,
          keepGoing = void 0,
          allStatesExited = void 0,
          allStatesEntered = void 0;

      var _startBigStep4 = this._startBigStep(e);

      var _startBigStep5 = _slicedToArray(_startBigStep4, 4);

      allStatesExited = _startBigStep5[0];
      allStatesEntered = _startBigStep5[1];
      keepGoing = _startBigStep5[2];
      currentEvent = _startBigStep5[3];


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
    }

    /** @private */

  }, {
    key: '_performSmallStep',
    value: function _performSmallStep(currentEvent, selectedTransitions) {

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
    }
  }, {
    key: '_exitStates',
    value: function _exitStates(currentEvent, selectedTransitionsWithTargets) {
      var basicStatesExited = void 0,
          statesExited = void 0;

      var _getStatesExited2 = this._getStatesExited(selectedTransitionsWithTargets);

      var _getStatesExited3 = _slicedToArray(_getStatesExited2, 2);

      basicStatesExited = _getStatesExited3[0];
      statesExited = _getStatesExited3[1];


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
    }

    /** @private */

  }, {
    key: '_getStatesExited',
    value: function _getStatesExited(transitions) {
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
    }
  }, {
    key: '_executeTransitions',
    value: function _executeTransitions(currentEvent, selectedTransitions) {
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
    }
  }, {
    key: '_enterStates',
    value: function _enterStates(currentEvent, selectedTransitionsWithTargets) {
      var _this6 = this;

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
              return _this6.isInFinalState(s);
            })) {
              this._internalEventQueue.push({ name: "done.state." + grandparent.id });
            }
          }
        }
      }

      return statesEntered;
    }
  }, {
    key: '_getEffectiveTargetStates',
    value: function _getEffectiveTargetStates(transition) {
      var targets = new Set();
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = transition.targets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var s = _step4.value;

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

      return targets;
    }
  }, {
    key: '_computeEntrySet',
    value: function _computeEntrySet(transitions, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = transitions.iter()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var t = _step5.value;
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = t.targets[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var s = _step6.value;

              this._addDescendantStatesToEnter(s, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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

          var ancestor = t.scope;
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = this._getEffectiveTargetStates(t)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _s = _step7.value;

              this._addAncestorStatesToEnter(_s, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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
    }
  }, {
    key: '_computeExitSet',
    value: function _computeExitSet(transitions) {
      var statesToExit = new Set();
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = transitions[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var t = _step8.value;

          if (t.targets) {
            var scope = t.scope;
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
              for (var _iterator9 = this._getFullConfiguration()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var s = _step9.value;

                if (query.isDescendant(s, scope)) statesToExit.add(s);
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
          }
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

      return statesToExit;
    }
  }, {
    key: '_addAncestorStatesToEnter',
    value: function _addAncestorStatesToEnter(state, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
      var _this7 = this;

      var traverse = function traverse(anc) {
        if (anc.typeEnum === PARALLEL) {
          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            var _loop = function _loop() {
              var child = _step10.value;

              if (child.typeEnum !== HISTORY && ![].concat(_toConsumableArray(statesToEnter)).some(function (s) {
                return query.isDescendant(s, child);
              })) {
                _this7._addDescendantStatesToEnter(child, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
              }
            };

            for (var _iterator10 = anc.states[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              _loop();
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
        }
      };
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = query.getAncestors(state, ancestor)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var anc = _step11.value;

          statesToEnter.add(anc);
          traverse(anc);
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

      traverse(ancestor);
    }
  }, {
    key: '_addDescendantStatesToEnter',
    value: function _addDescendantStatesToEnter(state, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
      var _this8 = this;

      if (state.typeEnum === HISTORY) {
        if (this._historyValue[state.id]) {
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = this._historyValue[state.id][Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var s = _step12.value;

              this._addDescendantStatesToEnter(s, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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
            for (var _iterator13 = this._historyValue[state.id][Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
              var _s2 = _step13.value;

              this._addAncestorStatesToEnter(_s2, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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
          defaultHistoryContent[state.parent.id] = state.transitions[0];
          var _iteratorNormalCompletion14 = true;
          var _didIteratorError14 = false;
          var _iteratorError14 = undefined;

          try {
            for (var _iterator14 = state.transitions[0].targets[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
              var _s3 = _step14.value;

              this._addDescendantStatesToEnter(_s3, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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

          var _iteratorNormalCompletion15 = true;
          var _didIteratorError15 = false;
          var _iteratorError15 = undefined;

          try {
            for (var _iterator15 = state.transitions[0].targets[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
              var _s4 = _step15.value;

              this._addAncestorStatesToEnter(_s4, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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
      } else {
        statesToEnter.add(state);
        if (state.typeEnum === COMPOSITE) {
          statesForDefaultEntry.add(state);
          //for each state in initialRef, if it is an initial state, then add ancestors and descendants.
          var _iteratorNormalCompletion16 = true;
          var _didIteratorError16 = false;
          var _iteratorError16 = undefined;

          try {
            for (var _iterator16 = state.initialRef[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
              var _s5 = _step16.value;

              var targets = _s5.typeEnum === INITIAL ? _s5.transitions[0].targets : [_s5];
              var _iteratorNormalCompletion18 = true;
              var _didIteratorError18 = false;
              var _iteratorError18 = undefined;

              try {
                for (var _iterator18 = targets[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                  var targetState = _step18.value;

                  this._addDescendantStatesToEnter(targetState, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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

          var _iteratorNormalCompletion17 = true;
          var _didIteratorError17 = false;
          var _iteratorError17 = undefined;

          try {
            for (var _iterator17 = state.initialRef[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
              var _s6 = _step17.value;

              var _targets = _s6.typeEnum === INITIAL ? _s6.transitions[0].targets : [_s6];
              var _iteratorNormalCompletion19 = true;
              var _didIteratorError19 = false;
              var _iteratorError19 = undefined;

              try {
                for (var _iterator19 = _targets[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                  var _targetState = _step19.value;

                  this._addAncestorStatesToEnter(_targetState, state, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
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
        } else {
          if (state.typeEnum === PARALLEL) {
            var _iteratorNormalCompletion20 = true;
            var _didIteratorError20 = false;
            var _iteratorError20 = undefined;

            try {
              var _loop2 = function _loop2() {
                var child = _step20.value;

                if (child.typeEnum !== HISTORY && ![].concat(_toConsumableArray(statesToEnter)).some(function (s) {
                  return query.isDescendant(s, child);
                })) {
                  _this8._addDescendantStatesToEnter(child, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                }
              };

              for (var _iterator20 = state.states[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                _loop2();
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
        }
      }
    }
  }, {
    key: 'isInFinalState',
    value: function isInFinalState(s) {
      var _this9 = this;

      if (s.typeEnum === COMPOSITE) {
        return s.states.some(function (s) {
          return s.typeEnum === FINAL && _this9._configuration.contains(s);
        });
      } else if (s.typeEnum === PARALLEL) {
        return s.states.every(this.isInFinalState.bind(this));
      } else {
        return false;
      }
    }

    /** @private */

  }, {
    key: '_evaluateAction',
    value: function _evaluateAction(currentEvent, actionRef) {
      try {
        return actionRef.call(this._scriptingContext, currentEvent); //SCXML system variables
      } catch (e) {
        this._handleError(e, actionRef);
      }
    }
  }, {
    key: '_handleError',
    value: function _handleError(e, actionRef) {
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
    }
  }, {
    key: '_log',
    value: function _log() {
      if (printTrace) {
        var args = Array.from(arguments);
        this.opts.console.log(args[0] + ': ' + args.slice(1).map(function (arg) {
          return arg === null ? 'null' : arg === undefined ? 'undefined' : typeof arg === 'string' ? arg : arg.toString() === '[object Object]' ? util.inspect(arg) : arg.toString();
        }).join(', ') + '\n');
      }
    }

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

  }, {
    key: 'registerListener',
    value: function registerListener(listener) {
      BaseInterpreter.EVENTS.forEach(function (event) {
        if (listener[event]) this.on(event, listener[event]);
      }, this);
    }

    /** 
    * Unregister a Listener
    * @memberof BaseInterpreter.prototype 
    * @param {Listener} listener
    */

  }, {
    key: 'unregisterListener',
    value: function unregisterListener(listener) {
      BaseInterpreter.EVENTS.forEach(function (event) {
        if (listener[event]) this.off(event, listener[event]);
      }, this);
    }

    /** 
    * Query the model to get all transition events.
    * @return {Array<string>} Transition events.
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: 'getAllTransitionEvents',
    value: function getAllTransitionEvents() {
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
    }

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

  }, {
    key: 'getSnapshot',
    value: function getSnapshot() {
      return [this.getConfiguration(), this._serializeHistory(), this._isInFinalState, this._model.$serializeDatamodel(), this._internalEventQueue.slice()];
    }
  }, {
    key: '_serializeHistory',
    value: function _serializeHistory() {
      var o = {};
      Object.keys(this._historyValue).forEach(function (sid) {
        o[sid] = this._historyValue[sid].map(function (state) {
          return state.id;
        });
      }, this);
      return o;
    }

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

  }, {
    key: 'gen',
    value: function gen(evtObjOrName, optionalData) {
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
    }

    /**
    * Injects an external event into the interpreter asynchronously
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

  }, {
    key: 'genAsync',
    value: function genAsync(currentEvent, cb) {
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
    }
  }]);

  return BaseInterpreter;
}(EventEmitter);

BaseInterpreter.EVENTS = ['onEntry', 'onExit', 'onTransition', 'onDefaultEntry', 'onError', 'onBigStepBegin', 'onBigStepEnd', 'onBigStepSuspend', 'onBigStepResume', 'onSmallStepBegin', 'onSmallStepEnd', 'onBigStepEnd', 'onExitInterpreter'];

//some global singletons to use to generate in-memory session ids, in case the user does not specify these data structures
BaseInterpreter.sessionIdCounter = 1;
BaseInterpreter.generateSessionid = function () {
  return BaseInterpreter.sessionIdCounter++;
};
BaseInterpreter.sessionRegistry = new Map();

/** 
 * @description Implements SCION legacy semantics. See {@link scion.BaseInterpreter} for information on the constructor arguments.
 * @class Statechart
 * @extends BaseInterpreter
 */

var Statechart = function (_BaseInterpreter) {
  _inherits(Statechart, _BaseInterpreter);

  function Statechart(modelOrModelFactory, opts) {
    _classCallCheck(this, Statechart);

    opts = opts || {};
    opts.legacySemantics = true;

    return _possibleConstructorReturn(this, (Statechart.__proto__ || Object.getPrototypeOf(Statechart)).call(this, modelOrModelFactory, opts));
  }

  /** @private */


  _createClass(Statechart, [{
    key: '_selectTransitions',
    value: function _selectTransitions(currentEvent, selectEventlessTransitions) {
      if (this.opts.onlySelectFromBasicStates) {
        var states = this._configuration.iter();
      } else {
        var statesAndParents = new this.opts.Set();

        //get full configuration, unordered
        //this means we may select transitions from parents before states
        var configList = this._configuration.iter();
        for (var idx = 0, len = configList.length; idx < len; idx++) {
          var basicState = configList[idx];
          statesAndParents.add(basicState);
          var ancestors = query.getAncestors(basicState);
          for (var ancIdx = 0, ancLen = ancestors.length; ancIdx < ancLen; ancIdx++) {
            statesAndParents.add(ancestors[ancIdx]);
          }
        }

        states = statesAndParents.iter();
      }

      var transitionSelector = this.opts.transitionSelector;
      var enabledTransitions = new this.opts.Set();

      var e = this._evaluateAction.bind(this, currentEvent);

      for (var stateIdx = 0, stateLen = states.length; stateIdx < stateLen; stateIdx++) {
        var transitions = states[stateIdx].transitions;
        for (var txIdx = 0, len = transitions.length; txIdx < len; txIdx++) {
          var t = transitions[txIdx];
          if (transitionSelector(t, currentEvent, e, selectEventlessTransitions)) {
            enabledTransitions.add(t);
          }
        }
      }

      var priorityEnabledTransitions = this._selectPriorityEnabledTransitions(enabledTransitions);

      this._log("priorityEnabledTransitions", priorityEnabledTransitions);

      return priorityEnabledTransitions;
    }

    /** @private */

  }, {
    key: '_selectPriorityEnabledTransitions',
    value: function _selectPriorityEnabledTransitions(enabledTransitions) {
      var priorityEnabledTransitions = new this.opts.Set();

      var tuple = this._getInconsistentTransitions(enabledTransitions),
          consistentTransitions = tuple[0],
          inconsistentTransitionsPairs = tuple[1];

      priorityEnabledTransitions.union(consistentTransitions);

      this._log("enabledTransitions", enabledTransitions);
      this._log("consistentTransitions", consistentTransitions);
      this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
      this._log("priorityEnabledTransitions", priorityEnabledTransitions);

      while (!inconsistentTransitionsPairs.isEmpty()) {
        enabledTransitions = new this.opts.Set(inconsistentTransitionsPairs.iter().map(function (t) {
          return this.opts.priorityComparisonFn(t);
        }, this));

        tuple = this._getInconsistentTransitions(enabledTransitions);
        consistentTransitions = tuple[0];
        inconsistentTransitionsPairs = tuple[1];

        priorityEnabledTransitions.union(consistentTransitions);

        this._log("enabledTransitions", enabledTransitions);
        this._log("consistentTransitions", consistentTransitions);
        this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
        this._log("priorityEnabledTransitions", priorityEnabledTransitions);
      }
      return priorityEnabledTransitions;
    }

    /** @private */

  }, {
    key: '_getInconsistentTransitions',
    value: function _getInconsistentTransitions(transitions) {
      var allInconsistentTransitions = new this.opts.Set();
      var inconsistentTransitionsPairs = new this.opts.Set();
      var transitionList = transitions.iter();

      this._log("transitions", transitions);

      for (var i = 0; i < transitionList.length; i++) {
        for (var j = i + 1; j < transitionList.length; j++) {
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
    }
  }, {
    key: '_conflicts',
    value: function _conflicts(t1, t2) {
      return !this._isArenaOrthogonal(t1, t2);
    }

    /** @private */

  }, {
    key: '_isArenaOrthogonal',
    value: function _isArenaOrthogonal(t1, t2) {

      this._log("transition scopes", t1.scope, t2.scope);

      var isOrthogonal;
      isOrthogonal = query.isOrthogonalTo(t1.scope || t1.source, t2.scope || t2.source);

      this._log("transition scopes are orthogonal?", isOrthogonal);

      return isOrthogonal;
    }
  }]);

  return Statechart;
}(BaseInterpreter);

/** 
 * @description Implements semantics described in Algorithm D of the SCXML specification. 
 * See {@link scion.BaseInterpreter} for information on the constructor arguments.
 * @class SCInterpreter 
 * @extends BaseInterpreter
 */


var SCInterpreter = function (_BaseInterpreter2) {
  _inherits(SCInterpreter, _BaseInterpreter2);

  function SCInterpreter(modelOrModelFactory, opts) {
    _classCallCheck(this, SCInterpreter);

    opts = opts || {};
    opts.legacySemantics = false;

    return _possibleConstructorReturn(this, (SCInterpreter.__proto__ || Object.getPrototypeOf(SCInterpreter)).call(this, modelOrModelFactory, opts));
  }

  /** @private */


  _createClass(SCInterpreter, [{
    key: '_selectTransitions',
    value: function _selectTransitions(currentEvent, selectEventlessTransitions) {
      var transitionSelector = this.opts.transitionSelector;
      var enabledTransitions = new this.opts.Set();

      var e = this._evaluateAction.bind(this, currentEvent);

      var atomicStates = this._configuration.iter().sort(transitionComparator);
      var _iteratorNormalCompletion21 = true;
      var _didIteratorError21 = false;
      var _iteratorError21 = undefined;

      try {
        for (var _iterator21 = atomicStates[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
          var state = _step21.value;
          var _iteratorNormalCompletion22 = true;
          var _didIteratorError22 = false;
          var _iteratorError22 = undefined;

          try {
            loop: for (var _iterator22 = [state].concat(query.getAncestors(state))[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
              var s = _step22.value;
              var _iteratorNormalCompletion23 = true;
              var _didIteratorError23 = false;
              var _iteratorError23 = undefined;

              try {
                for (var _iterator23 = s.transitions[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                  var t = _step23.value;

                  if (transitionSelector(t, currentEvent, e, selectEventlessTransitions)) {
                    enabledTransitions.add(t);
                    break loop;
                  }
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

      var priorityEnabledTransitions = this._removeConflictingTransition(enabledTransitions);

      this._log("priorityEnabledTransitions", priorityEnabledTransitions);

      return priorityEnabledTransitions;
    }

    /** @private */

  }, {
    key: '_removeConflictingTransition',
    value: function _removeConflictingTransition(enabledTransitions) {
      var _this12 = this;

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
              var t1ExitSet = _this12._computeExitSet([t1]);
              var t2ExitSet = _this12._computeExitSet([t2]);
              var hasIntersection = [].concat(_toConsumableArray(t1ExitSet)).some(function (s) {
                return t2ExitSet.has(s);
              }) || [].concat(_toConsumableArray(t2ExitSet)).some(function (s) {
                return t1ExitSet.has(s);
              });
              _this12._log('t1ExitSet', t1.source.id, [].concat(_toConsumableArray(t1ExitSet)).map(function (s) {
                return s.id;
              }));
              _this12._log('t2ExitSet', t2.source.id, [].concat(_toConsumableArray(t2ExitSet)).map(function (s) {
                return s.id;
              }));
              _this12._log('hasIntersection', hasIntersection);
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
    }
  }]);

  return SCInterpreter;
}(BaseInterpreter);

// Do nothing

function nop() {}

var InterpreterScriptingContext = function () {
  function InterpreterScriptingContext(interpreter) {
    _classCallCheck(this, InterpreterScriptingContext);

    this._interpreter = interpreter;
    this._timeoutMap = {};
    this._invokeMap = {};
    this._timeouts = new Set();

    //Regex from:
    //  http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    //  http://stackoverflow.com/a/6927878
    this.validateUriRegex = /(#_.*)|\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

    this.invokeSendTargetRegex = /^#_(.*)$/;
    this.scxmlSendTargetRegex = /^#_scxml_(.*)$/;
  }

  _createClass(InterpreterScriptingContext, [{
    key: 'raise',
    value: function raise(event) {
      this._installDefaultPropsOnEvent(event, true);
      this._interpreter._internalEventQueue.push(event);
    }
  }, {
    key: 'parseXmlStringAsDOM',
    value: function parseXmlStringAsDOM(xmlString) {
      return (this._interpreter.opts.xmlParser || InterpreterScriptingContext.xmlParser).parse(xmlString);
    }
  }, {
    key: 'invoke',
    value: function invoke(invokeObj) {
      var _this13 = this;

      //look up invoker by type. assume invokers are passed in as an option to constructor
      this._invokeMap[invokeObj.id] = new Promise(function (resolve, reject) {
        (_this13._interpreter.opts.invokers || InterpreterScriptingContext.invokers)[invokeObj.type](_this13._interpreter, invokeObj, function (err, session) {
          if (err) return reject(err);

          _this13._interpreter.emit('onInvokedSessionInitialized', session);
          resolve(session);
        });
      });
    }
  }, {
    key: 'cancelInvoke',
    value: function cancelInvoke(invokeid) {
      var _this14 = this;

      //TODO: on cancel invoke clean up this._invokeMap
      var sessionPromise = this._invokeMap[invokeid];
      this._interpreter._log('cancelling session with invokeid ' + invokeid);
      if (sessionPromise) {
        this._interpreter._log('sessionPromise found');
        sessionPromise.then(function (session) {
          _this14._interpreter._log('resolved session ' + invokeid + '. cancelling... ');
          session.cancel();
          //clean up
          delete _this14._invokeMap[invokeid];
        }, function (err) {
          //TODO: dispatch error back into the state machine as error.communication
        });
      }
    }
  }, {
    key: '_installDefaultPropsOnEvent',
    value: function _installDefaultPropsOnEvent(event, isInternal) {
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
    }
  }, {
    key: 'send',
    value: function send(event, options) {
      this._interpreter._log('send event', event, options);
      options = options || {};
      var sendType = options.type || SCXML_IOPROCESSOR_TYPE;
      //TODO: move these out
      function validateSend(event, options, sendAction) {
        if (event.target) {
          var targetIsValidUri = this.validateUriRegex.test(event.target);
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
        var _this15 = this;

        if (typeof setTimeout === 'undefined') throw new Error('Default implementation of BaseInterpreter.prototype.send will not work unless setTimeout is defined globally.');

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
              doSend.call(_this15, session);
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
    }
  }, {
    key: 'cancel',
    value: function cancel(sendid) {
      if (this._interpreter.opts.customCancel) {
        return this._interpreter.opts.customCancel.apply(this, [sendid]);
      }

      if (typeof clearTimeout === 'undefined') throw new Error('Default implementation of BaseInterpreter.prototype.cancel will not work unless setTimeout is defined globally.');

      if (sendid in this._timeoutMap) {
        this._interpreter._log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
        clearTimeout(this._timeoutMap[sendid]);
      }
    }
  }]);

  return InterpreterScriptingContext;
}();

module.exports = extend(new EventEmitter(), {
  BaseInterpreter: BaseInterpreter,
  Statechart: Statechart,
  SCInterpreter: SCInterpreter,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQXJyYXlTZXQuanMiLCJsaWIvY29uc3RhbnRzLmpzIiwibGliL2hlbHBlcnMuanMiLCJsaWIvcXVlcnkuanMiLCJsaWIvc2Npb24uanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbnktZXZlbnRzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNqQixRQUFJLEtBQUssRUFBVDtBQUNBLFNBQUssQ0FBTCxHQUFTLElBQUksR0FBSixDQUFRLENBQVIsQ0FBVDtBQUNIOztBQUVELFNBQVMsU0FBVCxHQUFxQjs7QUFFakIsU0FBTSxhQUFTLENBQVQsRUFBWTtBQUNkLGFBQUssQ0FBTCxDQUFPLEdBQVAsQ0FBVyxDQUFYO0FBQ0gsS0FKZ0I7O0FBTWpCLFlBQVMsZ0JBQVMsQ0FBVCxFQUFZO0FBQ2pCLGVBQU8sS0FBSyxDQUFMLENBQU8sTUFBUCxDQUFjLENBQWQsQ0FBUDtBQUNILEtBUmdCOztBQVVqQixXQUFRLGVBQVMsQ0FBVCxFQUFZO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ2hCLGlDQUFjLEVBQUUsQ0FBaEIsOEhBQW1CO0FBQUEsb0JBQVYsQ0FBVTs7QUFDZixxQkFBSyxDQUFMLENBQU8sR0FBUCxDQUFXLENBQVg7QUFDSDtBQUhlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSWhCLGVBQU8sSUFBUDtBQUNILEtBZmdCOztBQWlCakIsZ0JBQWEsb0JBQVMsQ0FBVCxFQUFZO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3JCLGtDQUFjLEVBQUUsQ0FBaEIsbUlBQW1CO0FBQUEsb0JBQVYsQ0FBVTs7QUFDZixxQkFBSyxDQUFMLENBQU8sTUFBUCxDQUFjLENBQWQ7QUFDSDtBQUhvQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUlyQixlQUFPLElBQVA7QUFDSCxLQXRCZ0I7O0FBd0JqQixjQUFXLGtCQUFTLENBQVQsRUFBWTtBQUNuQixlQUFPLEtBQUssQ0FBTCxDQUFPLEdBQVAsQ0FBVyxDQUFYLENBQVA7QUFDSCxLQTFCZ0I7O0FBNEJqQixVQUFPLGdCQUFXO0FBQ2QsZUFBTyxNQUFNLElBQU4sQ0FBVyxLQUFLLENBQWhCLENBQVA7QUFDSCxLQTlCZ0I7O0FBZ0NqQixhQUFVLG1CQUFXO0FBQ2pCLGVBQU8sQ0FBQyxLQUFLLENBQUwsQ0FBTyxJQUFmO0FBQ0gsS0FsQ2dCOztBQW9DakIsVUFBTSxnQkFBVztBQUNiLGVBQU8sS0FBSyxDQUFMLENBQU8sSUFBZDtBQUNILEtBdENnQjs7QUF3Q2pCLFlBQVMsZ0JBQVMsRUFBVCxFQUFhO0FBQ2xCLFlBQUksS0FBSyxDQUFMLENBQU8sSUFBUCxLQUFnQixHQUFHLElBQUgsRUFBcEIsRUFBK0I7QUFDM0IsbUJBQU8sS0FBUDtBQUNIOztBQUhpQjtBQUFBO0FBQUE7O0FBQUE7QUFLbEIsa0NBQWMsS0FBSyxDQUFuQixtSUFBc0I7QUFBQSxvQkFBYixDQUFhOztBQUNsQixvQkFBSSxDQUFDLEdBQUcsUUFBSCxDQUFZLENBQVosQ0FBTCxFQUFxQjtBQUNqQiwyQkFBTyxLQUFQO0FBQ0g7QUFDSjtBQVRpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVdsQixlQUFPLElBQVA7QUFDSCxLQXBEZ0I7O0FBc0RqQixjQUFXLG9CQUFXO0FBQ2xCLGVBQU8sS0FBSyxDQUFMLENBQU8sSUFBUCxLQUFnQixDQUFoQixHQUFvQixTQUFwQixHQUFnQyxNQUFNLElBQU4sQ0FBVyxLQUFLLENBQWhCLEVBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQXZDO0FBQ0g7QUF4RGdCLENBQXJCOztBQTJEQSxPQUFPLE9BQVAsR0FBaUIsUUFBakI7Ozs7O0FDbkVBLElBQUksY0FBYztBQUNkLFdBQU8sQ0FETztBQUVkLGVBQVcsQ0FGRztBQUdkLGNBQVUsQ0FISTtBQUlkLGFBQVMsQ0FKSztBQUtkLGFBQVMsQ0FMSztBQU1kLFdBQU87QUFOTyxDQUFsQjs7QUFTQSxJQUFNLHlCQUF5QixpREFBL0I7QUFDQSxJQUFNLHdCQUF3QixxREFBOUI7QUFDQSxJQUFNLHVCQUF1QixPQUE3Qjs7QUFFQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixpQkFBYyxXQURDO0FBRWYsNEJBQTBCLHNCQUZYO0FBR2YsMkJBQXlCLHFCQUhWO0FBSWYsMEJBQXdCO0FBSlQsQ0FBakI7Ozs7Ozs7QUNiQSxJQUFNLFlBQVksUUFBUSxhQUFSLENBQWxCO0FBQUEsSUFDTSxjQUFjLFVBQVUsV0FEOUI7QUFBQSxJQUVNLHVCQUF1QixVQUFVLG9CQUZ2Qzs7QUFJQSxJQUFNLGFBQWEsS0FBbkI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsWUFBUyxNQURNO0FBRWYsMkJBQXdCLHFCQUZUO0FBR2YsMEJBQXVCLG9CQUhSO0FBSWYscUJBQWtCLGVBSkg7QUFLZix3QkFBcUIsa0JBTE47QUFNZix1QkFBb0IsaUJBTkw7QUFPZixtQ0FBZ0MsNkJBUGpCO0FBUWYsaUNBQThCLDJCQVJmO0FBU2YsZ0RBQTZDLDBDQVQ5QjtBQVVmLHNCQUFtQixnQkFWSjtBQVdmLDJDQUF3QyxxQ0FYekI7QUFZZixnQ0FBNkIsMEJBWmQ7QUFhZix3Q0FBcUMsa0NBYnRCO0FBY2Ysd0JBQXFCO0FBZE4sQ0FBakI7O0FBaUJBLFNBQVMsTUFBVCxDQUFpQixFQUFqQixFQUFxQixJQUFyQixFQUEwQjtBQUN4QixXQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLE9BQWxCLENBQTBCLFVBQVMsQ0FBVCxFQUFXO0FBQ25DLFdBQUcsQ0FBSCxJQUFRLEtBQUssQ0FBTCxDQUFSO0FBQ0QsS0FGRDtBQUdBLFdBQU8sRUFBUDtBQUNEOztBQUVELFNBQVMscUJBQVQsQ0FBK0IsQ0FBL0IsRUFBaUM7QUFDN0IsV0FBTyxFQUFFLE9BQVQ7QUFDSDs7QUFFRCxTQUFTLG9CQUFULENBQThCLEVBQTlCLEVBQWtDLEVBQWxDLEVBQXNDO0FBQ2xDLFdBQU8sR0FBRyxhQUFILEdBQW1CLEdBQUcsYUFBN0I7QUFDSDs7QUFFRCxTQUFTLGVBQVQsQ0FBeUIsU0FBekIsRUFBb0MsSUFBcEMsRUFBeUM7QUFDckMsUUFBSSxjQUFjLEVBQWxCO0FBQUEsUUFBc0IsZUFBZSxJQUFJLEdBQUosRUFBckM7QUFBQSxRQUFnRCxnQkFBZ0IsQ0FBaEU7O0FBR0E7QUFDQTtBQUNBLFFBQUksVUFBVSxFQUFkOztBQUVBLGFBQVMsVUFBVCxDQUFvQixJQUFwQixFQUF5QjtBQUNyQixZQUFHLFFBQVEsSUFBUixNQUFrQixTQUFyQixFQUFnQyxRQUFRLElBQVIsSUFBZ0IsQ0FBaEI7O0FBRWhDLFdBQUc7QUFDRCxnQkFBSSxRQUFRLFFBQVEsSUFBUixHQUFaO0FBQ0EsZ0JBQUksS0FBSyxnQkFBZ0IsSUFBaEIsR0FBdUIsR0FBdkIsR0FBNkIsS0FBdEM7QUFDRCxTQUhELFFBR1MsYUFBYSxHQUFiLENBQWlCLEVBQWpCLENBSFQ7O0FBS0EsZUFBTyxFQUFQO0FBQ0g7O0FBRUQsYUFBUyxtQkFBVCxDQUE2QixLQUE3QixFQUFtQztBQUMvQixlQUFPO0FBQ0gsbUNBQXdCLE1BQU0scUJBQU4sSUFBK0IsWUFBVSxDQUFFLENBRGhFO0FBRUgsaUNBQXNCLE1BQU0sbUJBQU4sSUFBNkIsWUFBVTtBQUFFLHVCQUFPLElBQVA7QUFBYSxhQUZ6RTtBQUdILDJCQUFnQixZQUhiLEVBRzZCO0FBQ2hDLG9CQUFTLE1BQU0sTUFKWjtBQUtILGtCQUFPLE1BQU0sSUFMVjtBQU1ILG9CQUFTLENBQ0w7QUFDSSx1QkFBUSxTQURaO0FBRUksNkJBQWMsQ0FBQztBQUNYLDRCQUFTO0FBREUsaUJBQUQ7QUFGbEIsYUFESyxFQU9MLEtBUEs7QUFOTixTQUFQO0FBZ0JIOztBQUVELFFBQUksOEJBQThCLEVBQWxDOztBQUVBOzs7QUFHQSxhQUFTLGtCQUFULENBQTRCLFdBQTVCLEVBQXdDO0FBQ3RDLGVBQVUsV0FBVixhQUE0QixLQUFLLE1BQUwsR0FBYyxNQUFNLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsR0FBakIsQ0FBTixHQUE4QixHQUE1QyxHQUFrRCxJQUE5RSxLQUFxRixLQUFLLElBQUwsR0FBWSxNQUFNLEtBQUssSUFBTCxDQUFVLElBQWhCLEdBQXVCLEdBQW5DLEdBQXlDLEVBQTlILGVBQXdJLEtBQUssT0FBTCxHQUFlLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsR0FBbEIsQ0FBZixHQUF3QyxJQUFoTDtBQUNEOztBQUVEOzs7QUFHQSxhQUFTLGFBQVQsR0FBd0I7QUFDdEIsZUFBTyxLQUFLLEVBQVo7QUFDRDs7QUFFRCxhQUFTLGtCQUFULENBQTRCLEtBQTVCLEVBQWtDO0FBQ2hDO0FBQ0EsWUFBRyxNQUFNLEVBQVQsRUFBWTtBQUNSLHlCQUFhLEdBQWIsQ0FBaUIsTUFBTSxFQUF2QixFQUEyQixLQUEzQjtBQUNIOztBQUVELFlBQUcsTUFBTSxNQUFULEVBQWlCO0FBQ2IsaUJBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLE1BQU0sTUFBTixDQUFhLE1BQW5DLEVBQTJDLElBQUksR0FBL0MsRUFBb0QsR0FBcEQsRUFBeUQ7QUFDckQsbUNBQW1CLE1BQU0sTUFBTixDQUFhLENBQWIsQ0FBbkI7QUFDSDtBQUNKO0FBQ0Y7O0FBRUQsYUFBUyxRQUFULENBQWtCLFNBQWxCLEVBQTRCLEtBQTVCLEVBQWtDOztBQUU5QixZQUFHLFVBQUgsRUFBZSxNQUFNLFFBQU4sR0FBaUIsYUFBakI7O0FBRWY7QUFDQSxZQUFHLE1BQU0sV0FBVCxFQUFzQixZQUFZLElBQVosQ0FBaUIsS0FBakIsQ0FBdUIsV0FBdkIsRUFBbUMsTUFBTSxXQUF6Qzs7QUFFdEI7QUFDQTtBQUNBLGNBQU0sS0FBTixHQUFjLE1BQU0sS0FBTixJQUFlLE9BQTdCOztBQUVBO0FBQ0EsY0FBTSxTQUFOLEdBQWtCLFNBQWxCO0FBQ0EsY0FBTSxLQUFOLEdBQWMsVUFBVSxNQUF4QjtBQUNBLGNBQU0sTUFBTixHQUFlLFVBQVUsQ0FBVixDQUFmO0FBQ0EsY0FBTSxhQUFOLEdBQXNCLGVBQXRCOztBQUVBO0FBQ0EsY0FBTSxXQUFOLEdBQW9CLE1BQU0sV0FBTixJQUFxQixFQUF6QztBQUNBLGFBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLE1BQU0sV0FBTixDQUFrQixNQUF4QyxFQUFnRCxJQUFJLEdBQXBELEVBQXlELEdBQXpELEVBQThEO0FBQzFELGdCQUFJLGFBQWEsTUFBTSxXQUFOLENBQWtCLENBQWxCLENBQWpCO0FBQ0EsdUJBQVcsYUFBWCxHQUEyQixlQUEzQjtBQUNBLHVCQUFXLE1BQVgsR0FBb0IsS0FBcEI7QUFDQSxnQkFBRyxVQUFILEVBQWUsV0FBVyxRQUFYLEdBQXNCLG1CQUFtQixJQUFuQixDQUF3QixVQUF4QixFQUFvQyxLQUFwQyxDQUF0QjtBQUNsQjs7QUFFRDtBQUNBLFlBQUcsTUFBTSxNQUFULEVBQWlCO0FBQ2IsZ0JBQUksT0FBTyxDQUFDLEtBQUQsRUFBUSxNQUFSLENBQWUsU0FBZixDQUFYO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLE1BQU0sTUFBTixDQUFhLE1BQW5DLEVBQTJDLElBQUksR0FBL0MsRUFBb0QsR0FBcEQsRUFBeUQ7QUFDckQseUJBQVMsSUFBVCxFQUFlLE1BQU0sTUFBTixDQUFhLENBQWIsQ0FBZjtBQUNIO0FBQ0o7O0FBRUQ7QUFDQSxnQkFBTyxNQUFNLEtBQWI7QUFDSSxpQkFBSyxVQUFMO0FBQ0ksc0JBQU0sUUFBTixHQUFpQixZQUFZLFFBQTdCO0FBQ0Esc0JBQU0sUUFBTixHQUFpQixLQUFqQjtBQUNBO0FBQ0osaUJBQUssU0FBTDtBQUNJLHNCQUFNLFFBQU4sR0FBaUIsWUFBWSxPQUE3QjtBQUNBLHNCQUFNLFFBQU4sR0FBaUIsSUFBakI7QUFDQTtBQUNKLGlCQUFLLFNBQUw7QUFDSSxzQkFBTSxRQUFOLEdBQWlCLFlBQVksT0FBN0I7QUFDQSxzQkFBTSxRQUFOLEdBQWlCLElBQWpCO0FBQ0E7QUFDSixpQkFBSyxPQUFMO0FBQ0ksc0JBQU0sUUFBTixHQUFpQixZQUFZLEtBQTdCO0FBQ0Esc0JBQU0sUUFBTixHQUFpQixJQUFqQjtBQUNBO0FBQ0osaUJBQUssT0FBTDtBQUNBLGlCQUFLLE9BQUw7QUFDSSxvQkFBRyxNQUFNLE1BQU4sSUFBZ0IsTUFBTSxNQUFOLENBQWEsTUFBaEMsRUFBdUM7QUFDbkMsMEJBQU0sUUFBTixHQUFpQixZQUFZLFNBQTdCO0FBQ0EsMEJBQU0sUUFBTixHQUFpQixLQUFqQjtBQUNILGlCQUhELE1BR0s7QUFDRCwwQkFBTSxRQUFOLEdBQWlCLFlBQVksS0FBN0I7QUFDQSwwQkFBTSxRQUFOLEdBQWlCLElBQWpCO0FBQ0g7QUFDRDtBQUNKO0FBQ0ksc0JBQU0sSUFBSSxLQUFKLENBQVUseUJBQXlCLE1BQU0sS0FBekMsQ0FBTjtBQTVCUjs7QUErQkE7QUFDQSxZQUFHLE1BQU0sTUFBVCxFQUFnQjtBQUNaLGtCQUFNLFdBQU4sR0FBb0IsTUFBTSxNQUFOLENBQWEsTUFBYixDQUFvQixNQUFNLE1BQU4sQ0FBYSxHQUFiLENBQWlCLFVBQVMsQ0FBVCxFQUFXO0FBQUMsdUJBQU8sRUFBRSxXQUFUO0FBQXNCLGFBQW5ELEVBQXFELE1BQXJELENBQTRELFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLHVCQUFPLEVBQUUsTUFBRixDQUFTLENBQVQsQ0FBUDtBQUFvQixhQUE5RixFQUErRixFQUEvRixDQUFwQixDQUFwQjtBQUNILFNBRkQsTUFFSztBQUNELGtCQUFNLFdBQU4sR0FBb0IsRUFBcEI7QUFDSDs7QUFFRCxZQUFJLGVBQUo7QUFDQSxZQUFHLE1BQU0sUUFBTixLQUFtQixZQUFZLFNBQWxDLEVBQTRDO0FBQ3hDOztBQUVBLGdCQUFHLE1BQU0sT0FBTixDQUFjLE1BQU0sT0FBcEIsS0FBZ0MsT0FBTyxNQUFNLE9BQWIsS0FBeUIsUUFBNUQsRUFBcUU7QUFDakUsNENBQTRCLElBQTVCLENBQWlDLEtBQWpDO0FBQ0gsYUFGRCxNQUVLO0FBQ0Q7QUFDQSxrQ0FBa0IsTUFBTSxNQUFOLENBQWEsTUFBYixDQUFvQixVQUFTLEtBQVQsRUFBZTtBQUNqRCwyQkFBTyxNQUFNLEtBQU4sS0FBZ0IsU0FBdkI7QUFDSCxpQkFGaUIsQ0FBbEI7O0FBSUEsc0JBQU0sVUFBTixHQUFtQixDQUFDLGdCQUFnQixNQUFoQixHQUF5QixnQkFBZ0IsQ0FBaEIsQ0FBekIsR0FBOEMsTUFBTSxNQUFOLENBQWEsQ0FBYixDQUEvQyxDQUFuQjtBQUNBLGdDQUFnQixLQUFoQjtBQUNIO0FBRUo7O0FBRUQ7QUFDQSxZQUFHLE1BQU0sUUFBTixLQUFtQixZQUFZLFNBQS9CLElBQ0ssTUFBTSxRQUFOLEtBQW1CLFlBQVksUUFEdkMsRUFDZ0Q7O0FBRTVDLGdCQUFJLGtCQUFrQixNQUFNLE1BQU4sQ0FBYSxNQUFiLENBQW9CLFVBQVMsQ0FBVCxFQUFXO0FBQ2pELHVCQUFPLEVBQUUsS0FBRixLQUFZLFNBQW5CO0FBQ0gsYUFGcUIsQ0FBdEI7O0FBSUQsa0JBQU0sVUFBTixHQUFtQixlQUFuQjtBQUNGOztBQUVEO0FBQ0EsWUFBRyxDQUFDLE1BQU0sRUFBVixFQUFhO0FBQ1Qsa0JBQU0sRUFBTixHQUFXLFdBQVcsTUFBTSxLQUFqQixDQUFYO0FBQ0EseUJBQWEsR0FBYixDQUFpQixNQUFNLEVBQXZCLEVBQTJCLEtBQTNCO0FBQ0g7O0FBRUQ7QUFDQSxTQUFDLFNBQUQsRUFBVyxRQUFYLEVBQXFCLE9BQXJCLENBQTZCLFVBQVMsSUFBVCxFQUFjO0FBQ3pDLGdCQUFJLE1BQU0sSUFBTixDQUFKLEVBQWlCO0FBQ2Ysb0JBQUcsQ0FBQyxNQUFNLE9BQU4sQ0FBYyxNQUFNLElBQU4sQ0FBZCxDQUFKLEVBQStCO0FBQzdCLDBCQUFNLElBQU4sSUFBYyxDQUFDLE1BQU0sSUFBTixDQUFELENBQWQ7QUFDRDtBQUNELG9CQUFHLENBQUMsTUFBTSxJQUFOLEVBQVksS0FBWixDQUFrQixVQUFTLE9BQVQsRUFBaUI7QUFBRSwyQkFBTyxNQUFNLE9BQU4sQ0FBYyxPQUFkLENBQVA7QUFBZ0MsaUJBQXJFLENBQUosRUFBMkU7QUFDekUsMEJBQU0sSUFBTixJQUFjLENBQUMsTUFBTSxJQUFOLENBQUQsQ0FBZDtBQUNEO0FBQ0Y7QUFDRixTQVREOztBQVdBLFlBQUksTUFBTSxPQUFOLElBQWlCLENBQUMsTUFBTSxPQUFOLENBQWMsTUFBTSxPQUFwQixDQUF0QixFQUFvRDtBQUNoRCxrQkFBTSxPQUFOLEdBQWdCLENBQUMsTUFBTSxPQUFQLENBQWhCO0FBQ0Esa0JBQU0sT0FBTixDQUFjLE9BQWQsQ0FBdUIsa0JBQVU7QUFDL0Isb0JBQUksT0FBTyxRQUFQLElBQW1CLENBQUMsTUFBTSxPQUFOLENBQWMsT0FBTyxRQUFyQixDQUF4QixFQUF3RDtBQUN0RCwyQkFBTyxRQUFQLEdBQWtCLENBQUMsT0FBTyxRQUFSLENBQWxCO0FBQ0Q7QUFDRixhQUpEO0FBS0g7QUFDSjs7QUFFRDs7QUFFQSxhQUFTLGVBQVQsQ0FBeUIsS0FBekIsRUFBK0I7QUFDN0IsWUFBRyxDQUFDLE1BQU0sVUFBVixFQUFzQixNQUFNLElBQUksS0FBSixDQUFVLHlEQUF5RCxNQUFNLEVBQXpFLENBQU47QUFDdkI7QUFDRCxhQUFTLHVCQUFULEdBQWtDO0FBQ2hDLGFBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLDRCQUE0QixNQUFsRCxFQUEwRCxJQUFJLEdBQTlELEVBQW1FLEdBQW5FLEVBQXdFO0FBQ3RFLGdCQUFJLElBQUksNEJBQTRCLENBQTVCLENBQVI7O0FBRUEsZ0JBQUksZ0JBQWdCLE1BQU0sT0FBTixDQUFjLEVBQUUsT0FBaEIsSUFBMkIsRUFBRSxPQUE3QixHQUF1QyxDQUFDLEVBQUUsT0FBSCxDQUEzRDtBQUNBLGNBQUUsVUFBRixHQUFlLGNBQWMsR0FBZCxDQUFrQixVQUFTLFlBQVQsRUFBc0I7QUFBRSx1QkFBTyxhQUFhLEdBQWIsQ0FBaUIsWUFBakIsQ0FBUDtBQUF3QyxhQUFsRixDQUFmO0FBQ0EsNEJBQWdCLENBQWhCO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJLGdCQUFnQixLQUFwQjs7QUFFQSxhQUFTLHNCQUFULEdBQWlDO0FBQzdCO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sWUFBWSxNQUFsQyxFQUEwQyxJQUFJLEdBQTlDLEVBQW1ELEdBQW5ELEVBQXdEO0FBQ3BELGdCQUFJLElBQUksWUFBWSxDQUFaLENBQVI7QUFDQSxnQkFBSSxFQUFFLFlBQUYsSUFBa0IsQ0FBQyxNQUFNLE9BQU4sQ0FBYyxFQUFFLFlBQWhCLENBQXZCLEVBQXNEO0FBQ2xELGtCQUFFLFlBQUYsR0FBaUIsQ0FBQyxFQUFFLFlBQUgsQ0FBakI7QUFDSDs7QUFFRDtBQUNBLGdCQUFJLE9BQU8sRUFBRSxLQUFULEtBQW1CLFFBQXZCLEVBQWlDO0FBQzdCLGtCQUFFLE1BQUYsR0FBVyxFQUFFLEtBQUYsQ0FBUSxJQUFSLEdBQWUsS0FBZixDQUFxQixhQUFyQixDQUFYO0FBQ0g7QUFDRCxtQkFBTyxFQUFFLEtBQVQ7O0FBRUEsZ0JBQUcsRUFBRSxPQUFGLElBQWMsT0FBTyxFQUFFLE1BQVQsS0FBb0IsV0FBckMsRUFBbUQ7QUFDL0M7QUFDQTtBQUNIOztBQUVELGdCQUFHLE9BQU8sRUFBRSxNQUFULEtBQW9CLFFBQXZCLEVBQWdDO0FBQzVCLG9CQUFJLFNBQVMsYUFBYSxHQUFiLENBQWlCLEVBQUUsTUFBbkIsQ0FBYjtBQUNBLG9CQUFHLENBQUMsTUFBSixFQUFZLE1BQU0sSUFBSSxLQUFKLENBQVUseUNBQXlDLEVBQUUsTUFBckQsQ0FBTjtBQUNaLGtCQUFFLE1BQUYsR0FBVyxNQUFYO0FBQ0Esa0JBQUUsT0FBRixHQUFZLENBQUMsRUFBRSxNQUFILENBQVo7QUFDSCxhQUxELE1BS00sSUFBRyxNQUFNLE9BQU4sQ0FBYyxFQUFFLE1BQWhCLENBQUgsRUFBMkI7QUFDN0Isa0JBQUUsT0FBRixHQUFZLEVBQUUsTUFBRixDQUFTLEdBQVQsQ0FBYSxVQUFTLE1BQVQsRUFBZ0I7QUFDckMsd0JBQUcsT0FBTyxNQUFQLEtBQWtCLFFBQXJCLEVBQThCO0FBQzFCLGlDQUFTLGFBQWEsR0FBYixDQUFpQixNQUFqQixDQUFUO0FBQ0EsNEJBQUcsQ0FBQyxNQUFKLEVBQVksTUFBTSxJQUFJLEtBQUosQ0FBVSx5Q0FBeUMsRUFBRSxNQUFyRCxDQUFOO0FBQ1osK0JBQU8sTUFBUDtBQUNILHFCQUpELE1BSUs7QUFDRCwrQkFBTyxNQUFQO0FBQ0g7QUFDSixpQkFSVyxDQUFaO0FBU0gsYUFWSyxNQVVBLElBQUcsUUFBTyxFQUFFLE1BQVQsTUFBb0IsUUFBdkIsRUFBZ0M7QUFDbEMsa0JBQUUsT0FBRixHQUFZLENBQUMsRUFBRSxNQUFILENBQVo7QUFDSCxhQUZLLE1BRUQ7QUFDRCxzQkFBTSxJQUFJLEtBQUosQ0FBVSx5Q0FBeUMsRUFBRSxNQUFyRCxDQUFOO0FBQ0g7QUFDSjs7QUFFRDtBQUNBLGFBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLFlBQVksTUFBbEMsRUFBMEMsSUFBSSxHQUE5QyxFQUFtRCxHQUFuRCxFQUF3RDtBQUNwRCxnQkFBSSxJQUFJLFlBQVksQ0FBWixDQUFSO0FBQ0EsZ0JBQUcsRUFBRSxPQUFMLEVBQWMsRUFBRSxJQUFGLEdBQVMsUUFBUSxFQUFFLE1BQVYsRUFBaUIsRUFBRSxPQUFGLENBQVUsQ0FBVixDQUFqQixDQUFULENBRnNDLENBRU07O0FBRTFELGNBQUUsS0FBRixHQUFVLFNBQVMsQ0FBVCxDQUFWO0FBQ0g7QUFDSjs7QUFFRCxhQUFTLFFBQVQsQ0FBa0IsVUFBbEIsRUFBNkI7QUFDekI7QUFDQTtBQUNBLFlBQUksNkJBQ0ksV0FBVyxJQUFYLEtBQW9CLFVBQXBCLElBQ0UsV0FBVyxNQUFYLENBQWtCLFFBQWxCLEtBQStCLFlBQVksU0FEN0MsSUFDNEQ7QUFDMUQsbUJBQVcsTUFBWCxDQUFrQixNQUZwQixJQUVpQztBQUMvQixtQkFBVyxPQUhiLElBR3dCO0FBQ3RCLG1CQUFXLE9BQVgsQ0FBbUIsS0FBbkIsQ0FDSSxVQUFTLE1BQVQsRUFBZ0I7QUFBRSxtQkFBTyxXQUFXLE1BQVgsQ0FBa0IsV0FBbEIsQ0FBOEIsT0FBOUIsQ0FBc0MsTUFBdEMsSUFBZ0QsQ0FBQyxDQUF4RDtBQUEyRCxTQURqRixDQUxWOztBQVFBLFlBQUcsQ0FBQyxXQUFXLE9BQWYsRUFBdUI7QUFDbkIsbUJBQU8sSUFBUDtBQUNILFNBRkQsTUFFTSxJQUFHLDBCQUFILEVBQThCO0FBQ2hDLG1CQUFPLFdBQVcsTUFBbEI7QUFDSCxTQUZLLE1BRUQ7QUFDRCxtQkFBTyxXQUFXLElBQWxCO0FBQ0g7QUFDSjs7QUFFRCxhQUFTLE9BQVQsQ0FBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUI7QUFDckIsWUFBSSxrQkFBa0IsRUFBdEI7QUFDQSxhQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsTUFBTSxHQUFHLFNBQUgsQ0FBYSxNQUFuQyxFQUEyQyxJQUFJLEdBQS9DLEVBQW9ELEdBQXBELEVBQXlEO0FBQ3JELGdCQUFJLE1BQU0sR0FBRyxTQUFILENBQWEsQ0FBYixDQUFWO0FBQ0EsZ0JBQ0ksQ0FDRSxRQUFRLEtBQUssZUFBYixHQUNFLElBQUksUUFBSixLQUFpQixZQUFZLFNBRC9CLEdBRUcsSUFBSSxRQUFKLEtBQWlCLFlBQVksU0FBN0IsSUFBMEMsSUFBSSxRQUFKLEtBQWlCLFlBQVksUUFINUUsS0FLQSxJQUFJLFdBQUosQ0FBZ0IsT0FBaEIsQ0FBd0IsRUFBeEIsSUFBOEIsQ0FBQyxDQU5uQyxFQU1xQzs7QUFFakMsZ0NBQWdCLElBQWhCLENBQXFCLEdBQXJCO0FBQ0g7QUFDSjtBQUNELFlBQUcsQ0FBQyxnQkFBZ0IsTUFBcEIsRUFBNEIsTUFBTSxJQUFJLEtBQUosQ0FBVSxnQ0FBVixDQUFOO0FBQzVCLGVBQU8sZ0JBQWdCLENBQWhCLENBQVA7QUFDSDs7QUFFRDtBQUNBO0FBQ0EsdUJBQW1CLFNBQW5CO0FBQ0EsUUFBSSxnQkFBZ0Isb0JBQW9CLFNBQXBCLENBQXBCLENBbFRxQyxDQWtUZ0I7QUFDckQsYUFBUyxFQUFULEVBQVksYUFBWjtBQUNBO0FBQ0E7O0FBRUEsV0FBTyxhQUFQO0FBQ0g7O0FBR0QsU0FBUyxrQkFBVCxDQUE0QixNQUE1QixFQUFvQyxRQUFwQyxFQUE4QztBQUMxQyxhQUFTLE9BQU8sT0FBUCxDQUFlLG9CQUFmLEVBQXFDLEVBQXJDLENBQVQ7O0FBRUEsUUFBSSxXQUFXLFFBQWYsRUFBeUI7QUFDckIsZUFBTyxJQUFQO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLE1BQVAsR0FBZ0IsU0FBUyxNQUE3QixFQUFxQztBQUNqQyxlQUFPLEtBQVA7QUFDSDs7QUFFRCxRQUFJLFNBQVMsTUFBVCxDQUFnQixPQUFPLE1BQXZCLE1BQW1DLEdBQXZDLEVBQTRDO0FBQ3hDLGVBQU8sS0FBUDtBQUNIOztBQUVELFdBQVEsU0FBUyxPQUFULENBQWlCLE1BQWpCLE1BQTZCLENBQXJDO0FBQ0g7O0FBRUQsU0FBUyxpQkFBVCxDQUEyQixDQUEzQixFQUE4QixTQUE5QixFQUF5QztBQUNyQyxXQUFPLEVBQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxVQUFDLE1BQUQsRUFBWTtBQUM3QixlQUFPLFdBQVcsR0FBWCxJQUFrQixtQkFBbUIsTUFBbkIsRUFBMkIsU0FBM0IsQ0FBekI7QUFDSCxLQUZNLENBQVA7QUFHSDs7QUFFRCxTQUFTLDZCQUFULENBQXVDLENBQXZDLEVBQTBDLEtBQTFDLEVBQWlELFNBQWpELEVBQTRELDBCQUE1RCxFQUF3RjtBQUNwRixXQUFPLENBQ0wsNkJBQ0UsQ0FBQyxFQUFFLE1BREwsR0FFRyxFQUFFLE1BQUYsSUFBWSxLQUFaLElBQXFCLE1BQU0sSUFBM0IsSUFBbUMsa0JBQWtCLENBQWxCLEVBQXFCLE1BQU0sSUFBM0IsQ0FIakMsTUFLRCxDQUFDLEVBQUUsSUFBSCxJQUFXLFVBQVUsRUFBRSxJQUFaLENBTFYsQ0FBUDtBQU1IOztBQUVELFNBQVMsMkJBQVQsQ0FBcUMsS0FBckMsRUFBMkM7QUFDekMsV0FBTyxNQUFNLFdBQU4sQ0FBa0IsTUFBbEIsQ0FBeUIsVUFBUyxVQUFULEVBQW9CO0FBQUUsZUFBTyxDQUFDLFdBQVcsTUFBWixJQUF3QixXQUFXLE1BQVgsSUFBcUIsV0FBVyxNQUFYLENBQWtCLE1BQWxCLEtBQTZCLENBQWpGO0FBQXVGLEtBQXRJLENBQVA7QUFDRDs7QUFFRDtBQUNBLFNBQVMsMENBQVQsQ0FBb0QsS0FBcEQsRUFBMkQ7QUFDdkQsUUFBSSxLQUFLLE1BQU0sQ0FBTixDQUFUO0FBQUEsUUFBbUIsS0FBSyxNQUFNLENBQU4sQ0FBeEI7QUFDQSxRQUFJLElBQUksc0NBQXNDLEdBQUcsTUFBekMsRUFBaUQsR0FBRyxNQUFwRCxDQUFSO0FBQ0E7QUFDQSxRQUFJLEdBQUcsTUFBSCxDQUFVLEtBQVYsR0FBa0IsR0FBRyxNQUFILENBQVUsS0FBaEMsRUFBdUM7QUFDbkMsZUFBTyxFQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUksR0FBRyxNQUFILENBQVUsS0FBVixHQUFrQixHQUFHLE1BQUgsQ0FBVSxLQUFoQyxFQUF1QztBQUMxQyxlQUFPLEVBQVA7QUFDSCxLQUZNLE1BRUE7QUFDSixZQUFJLEdBQUcsYUFBSCxHQUFtQixHQUFHLGFBQTFCLEVBQXlDO0FBQ3BDLG1CQUFPLEVBQVA7QUFDSCxTQUZGLE1BRVE7QUFDSCxtQkFBTyxFQUFQO0FBQ0g7QUFDSjtBQUNKOztBQUVELFNBQVMsZ0JBQVQsQ0FBMEIsRUFBMUIsRUFBOEIsRUFBOUIsRUFBaUM7QUFDL0IsV0FBTyxzQ0FBc0MsRUFBdEMsRUFBMEMsRUFBMUMsSUFBZ0QsQ0FBQyxDQUF4RDtBQUNEOztBQUVELFNBQVMscUNBQVQsQ0FBK0MsRUFBL0MsRUFBbUQsRUFBbkQsRUFBdUQ7QUFDbkQ7QUFDQSxRQUFJLEdBQUcsS0FBSCxHQUFXLEdBQUcsS0FBbEIsRUFBeUI7QUFDckIsZUFBTyxDQUFDLENBQVI7QUFDSCxLQUZELE1BRU8sSUFBSSxHQUFHLEtBQUgsR0FBVyxHQUFHLEtBQWxCLEVBQXlCO0FBQzVCLGVBQU8sQ0FBUDtBQUNILEtBRk0sTUFFQTtBQUNIO0FBQ0EsWUFBSSxHQUFHLGFBQUgsR0FBbUIsR0FBRyxhQUExQixFQUF5QztBQUNyQyxtQkFBTyxDQUFQO0FBQ0gsU0FGRCxNQUVPLElBQUksR0FBRyxhQUFILEdBQW1CLEdBQUcsYUFBMUIsRUFBeUM7QUFDNUMsbUJBQU8sQ0FBQyxDQUFSO0FBQ0gsU0FGTSxNQUVEO0FBQ0YsbUJBQU8sQ0FBUDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFTLDBCQUFULENBQW9DLE9BQXBDLEVBQTZDLElBQTdDLEVBQW1ELFdBQW5ELEVBQStEO0FBQzNELFdBQU8sUUFBUSxJQUFSLENBQWEsV0FBYixFQUNILEtBQUssRUFERixFQUVILEtBQUssRUFBTCxDQUFRLFVBRkwsRUFHSCxLQUFLLEVBQUwsQ0FBUSxhQUhMLEVBSUgsWUFBWSxJQUFaLENBQWlCLElBQWpCLENBQXNCLFdBQXRCLENBSkcsQ0FBUDtBQUtIOztBQUVELFNBQVMsa0NBQVQsQ0FBNEMsdUJBQTVDLEVBQW9FLFlBQXBFLEVBQWlGO0FBQy9FLFdBQU8sd0JBQXdCLEdBQXhCLENBQTRCLFVBQVMsRUFBVCxFQUFZO0FBQzdDLFlBQUksUUFBUSxhQUFhLEdBQWIsQ0FBaUIsRUFBakIsQ0FBWjtBQUNBLFlBQUcsQ0FBQyxLQUFKLEVBQVcsTUFBTSxJQUFJLEtBQUosQ0FBVSw0RUFBNEUsRUFBdEYsQ0FBTjtBQUNYLGVBQU8sS0FBUDtBQUNELEtBSk0sQ0FBUDtBQUtEOztBQUVELFNBQVMsa0JBQVQsQ0FBNEIsaUJBQTVCLEVBQThDLFlBQTlDLEVBQTJEO0FBQ3pELFFBQUksSUFBSSxFQUFSO0FBQ0EsV0FBTyxJQUFQLENBQVksaUJBQVosRUFBK0IsT0FBL0IsQ0FBdUMsVUFBUyxHQUFULEVBQWE7QUFDbEQsVUFBRSxHQUFGLElBQVMsa0JBQWtCLEdBQWxCLEVBQXVCLEdBQXZCLENBQTJCLFVBQVMsRUFBVCxFQUFZO0FBQzlDLGdCQUFJLFFBQVEsYUFBYSxHQUFiLENBQWlCLEVBQWpCLENBQVo7QUFDQSxnQkFBRyxDQUFDLEtBQUosRUFBVyxNQUFNLElBQUksS0FBSixDQUFVLHNFQUFzRSxFQUFoRixDQUFOO0FBQ1gsbUJBQU8sS0FBUDtBQUNELFNBSlEsQ0FBVDtBQUtELEtBTkQ7QUFPQSxXQUFPLENBQVA7QUFDRDs7Ozs7QUN4Y0QsSUFBTSxZQUFZLFFBQVEsYUFBUixDQUFsQjs7QUFFQTtBQUNBLElBQU0sUUFBUTtBQUNWLGtCQUFlLHNCQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWdCO0FBQzdCO0FBQ0EsZUFBTyxHQUFHLFdBQUgsQ0FBZSxPQUFmLENBQXVCLEVBQXZCLElBQTZCLENBQUMsQ0FBckM7QUFDRCxLQUpTO0FBS1Ysa0JBQWMsc0JBQVMsQ0FBVCxFQUFZLElBQVosRUFBa0I7QUFDNUIsWUFBSSxTQUFKLEVBQWUsS0FBZixFQUFzQixLQUF0QjtBQUNBLGdCQUFRLEVBQUUsU0FBRixDQUFZLE9BQVosQ0FBb0IsSUFBcEIsQ0FBUjtBQUNBLFlBQUksUUFBUSxDQUFDLENBQWIsRUFBZ0I7QUFDWixtQkFBTyxFQUFFLFNBQUYsQ0FBWSxLQUFaLENBQWtCLENBQWxCLEVBQXFCLEtBQXJCLENBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxFQUFFLFNBQVQ7QUFDSDtBQUNKLEtBYlM7QUFjVixvQkFBZ0Isd0JBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUI7QUFDN0I7QUFDQTtBQUNBLGVBQU8sQ0FBQyxLQUFLLHNCQUFMLENBQTRCLEVBQTVCLEVBQWdDLEVBQWhDLENBQUQsSUFBd0MsS0FBSyxNQUFMLENBQVksRUFBWixFQUFnQixFQUFoQixFQUFvQixRQUFwQixLQUFpQyxVQUFVLFdBQVYsQ0FBc0IsUUFBdEc7QUFDSCxLQWxCUztBQW1CViw0QkFBd0IsZ0NBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUI7QUFDckM7QUFDQSxlQUFPLEtBQUssa0JBQUwsQ0FBd0IsRUFBeEIsRUFBNEIsT0FBNUIsQ0FBb0MsRUFBcEMsSUFBMEMsQ0FBQyxDQUEzQyxJQUFnRCxLQUFLLGtCQUFMLENBQXdCLEVBQXhCLEVBQTRCLE9BQTVCLENBQW9DLEVBQXBDLElBQTBDLENBQUMsQ0FBbEc7QUFDSCxLQXRCUztBQXVCVix3QkFBb0IsNEJBQVMsQ0FBVCxFQUFZLElBQVosRUFBa0I7QUFDbEMsZUFBTyxDQUFDLENBQUQsRUFBSSxNQUFKLENBQVcsTUFBTSxZQUFOLENBQW1CLENBQW5CLEVBQXNCLElBQXRCLENBQVgsQ0FBUDtBQUNILEtBekJTO0FBMEJWLDBCQUFzQiw4QkFBUyxDQUFULEVBQVk7QUFDOUIsZUFBTyxDQUFDLENBQUQsRUFBSSxNQUFKLENBQVcsRUFBRSxXQUFiLENBQVA7QUFDSCxLQTVCUztBQTZCVixZQUFRLGdCQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCO0FBQ3JCLFlBQUksa0JBQWtCLEtBQUssWUFBTCxDQUFrQixFQUFsQixFQUFzQixNQUF0QixDQUE2QixVQUFTLENBQVQsRUFBVztBQUMxRCxtQkFBTyxFQUFFLFdBQUYsQ0FBYyxPQUFkLENBQXNCLEVBQXRCLElBQTRCLENBQUMsQ0FBcEM7QUFDSCxTQUZxQixFQUVwQixJQUZvQixDQUF0QjtBQUdBLGVBQU8sZ0JBQWdCLENBQWhCLENBQVA7QUFDSDtBQWxDUyxDQUFkOztBQXFDQSxPQUFPLE9BQVAsR0FBaUIsS0FBakI7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0E7Ozs7OztBQU1BOzs7OztBQUtBOzs7OztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxlQUFlLFFBQVEsYUFBUixFQUF1QixZQUE1QztBQUFBLElBQ0UsT0FBTyxRQUFRLE1BQVIsQ0FEVDtBQUFBLElBRUUsV0FBVyxRQUFRLFlBQVIsQ0FGYjtBQUFBLElBR0UsWUFBWSxRQUFRLGFBQVIsQ0FIZDtBQUFBLElBSUUsVUFBVSxRQUFRLFdBQVIsQ0FKWjtBQUFBLElBS0UsUUFBUSxRQUFRLFNBQVIsQ0FMVjtBQUFBLElBTUUsU0FBUyxRQUFRLE1BTm5CO0FBQUEsSUFPRSx3QkFBd0IsUUFBUSxxQkFQbEM7QUFBQSxJQVFFLHVCQUF1QixRQUFRLG9CQVJqQztBQUFBLElBU0Usa0JBQWtCLFFBQVEsZUFUNUI7QUFBQSxJQVVFLHFCQUFxQixRQUFRLGtCQVYvQjtBQUFBLElBV0Usb0JBQW9CLFFBQVEsaUJBWDlCO0FBQUEsSUFZRSxnQ0FBZ0MsUUFBUSw2QkFaMUM7QUFBQSxJQWFFLDhCQUE4QixRQUFRLDJCQWJ4QztBQUFBLElBY0UsNkNBQTZDLFFBQVEsMENBZHZEO0FBQUEsSUFlRSxtQkFBbUIsUUFBUSxnQkFmN0I7QUFBQSxJQWdCRSx3Q0FBd0MsUUFBUSxxQ0FoQmxEO0FBQUEsSUFpQkUsNkJBQTZCLFFBQVEsMEJBakJ2QztBQUFBLElBa0JFLHFDQUFxQyxRQUFRLGtDQWxCL0M7QUFBQSxJQW1CRSxxQkFBcUIsUUFBUSxrQkFuQi9CO0FBQUEsSUFvQkUsUUFBUSxVQUFVLFdBQVYsQ0FBc0IsS0FwQmhDO0FBQUEsSUFxQkUsWUFBWSxVQUFVLFdBQVYsQ0FBc0IsU0FyQnBDO0FBQUEsSUFzQkUsV0FBVyxVQUFVLFdBQVYsQ0FBc0IsUUF0Qm5DO0FBQUEsSUF1QkUsVUFBVSxVQUFVLFdBQVYsQ0FBc0IsT0F2QmxDO0FBQUEsSUF3QkUsVUFBVSxVQUFVLFdBQVYsQ0FBc0IsT0F4QmxDO0FBQUEsSUF5QkUsUUFBUSxVQUFVLFdBQVYsQ0FBc0IsS0F6QmhDO0FBQUEsSUEwQkUseUJBQTBCLFVBQVUsc0JBMUJ0Qzs7QUE0QkEsSUFBTSxhQUFhLE9BQU8sT0FBUCxLQUFtQixXQUFuQixJQUFrQyxDQUFDLENBQUMsUUFBUSxHQUFSLENBQVksS0FBbkU7O0FBR0E7Ozs7QUFJQTs7Ozs7Ozs7QUFTQTs7Ozs7OztBQU9BOzs7Ozs7O0FBT0E7Ozs7Ozs7QUFPQTs7Ozs7OztBQU9BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJNLGU7OztBQUVKLDJCQUFZLG1CQUFaLEVBQWlDLElBQWpDLEVBQXNDO0FBQUE7O0FBQUE7O0FBSXBDLFVBQUssSUFBTCxHQUFZLElBQVo7O0FBRUEsVUFBSyxJQUFMLENBQVUsMkJBQVYsR0FBd0MsTUFBSyxJQUFMLENBQVUsMkJBQVYsSUFBeUMsMkJBQWpGOztBQUVBLFVBQUssV0FBTCxHQUFtQixLQUFuQjs7QUFFQSxVQUFLLGlCQUFMLEdBQXlCLE1BQUssSUFBTCxDQUFVLDJCQUFWLEtBQTBDLE1BQUssSUFBTCxDQUFVLDJCQUFWLEdBQXdDLElBQUksTUFBSyxJQUFMLENBQVUsMkJBQWQsT0FBeEMsR0FBMEYsRUFBcEksQ0FBekI7O0FBRUEsVUFBSyxJQUFMLENBQVUsaUJBQVYsR0FBOEIsTUFBSyxJQUFMLENBQVUsaUJBQVYsSUFBK0IsZ0JBQWdCLGlCQUE3RTtBQUNBLFVBQUssSUFBTCxDQUFVLFNBQVYsR0FBc0IsTUFBSyxJQUFMLENBQVUsU0FBVixJQUF1QixNQUFLLElBQUwsQ0FBVSxpQkFBVixFQUE3QztBQUNBLFVBQUssSUFBTCxDQUFVLGVBQVYsR0FBNEIsTUFBSyxJQUFMLENBQVUsZUFBVixJQUE2QixnQkFBZ0IsZUFBekUsQ0Fkb0MsQ0FjdUQ7OztBQUczRixRQUFJLGdCQUFnQixFQUFwQjtBQUNBLGtCQUFjLHNCQUFkLElBQXdDO0FBQ3RDLDZCQUFzQixNQUFLLElBQUwsQ0FBVTtBQURNLEtBQXhDO0FBR0Esa0JBQWMsS0FBZCxHQUFzQixjQUFjLHNCQUFkLENBQXRCLENBckJvQyxDQXFCNEI7O0FBRWhFO0FBQ0EsVUFBSyxJQUFMLENBQVUsRUFBVixHQUFlO0FBQ1gsa0JBQWEsTUFBSyxJQUFMLENBQVUsU0FEWjtBQUVYLHFCQUFnQjtBQUZMLEtBQWY7O0FBTUEsUUFBSSxLQUFKO0FBQ0EsUUFBRyxPQUFPLG1CQUFQLEtBQStCLFVBQWxDLEVBQTZDO0FBQ3pDLGNBQVEsMkJBQTJCLG1CQUEzQixFQUFnRCxNQUFLLElBQXJELFFBQVI7QUFDSCxLQUZELE1BRU0sSUFBRyxRQUFPLG1CQUFQLHlDQUFPLG1CQUFQLE9BQStCLFFBQWxDLEVBQTJDO0FBQzdDLGNBQVEsS0FBSyxLQUFMLENBQVcsS0FBSyxTQUFMLENBQWUsbUJBQWYsQ0FBWCxDQUFSLENBRDZDLENBQ1k7QUFDNUQsS0FGSyxNQUVEO0FBQ0QsWUFBTSxJQUFJLEtBQUosQ0FBVSwyRUFBVixDQUFOO0FBQ0g7O0FBRUQsVUFBSyxNQUFMLEdBQWMsZ0JBQWdCLEtBQWhCLEVBQXVCLE1BQUssSUFBNUIsQ0FBZDs7QUFFQSxVQUFLLElBQUwsQ0FBVSxPQUFWLEdBQW9CLE1BQUssSUFBTCxDQUFVLE9BQVYsS0FBc0IsT0FBTyxPQUFQLEtBQW1CLFdBQW5CLEdBQWlDLEVBQUMsS0FBTSxlQUFVLENBQUUsQ0FBbkIsRUFBakMsR0FBd0QsT0FBOUUsQ0FBcEIsQ0F6Q29DLENBeUMwRTtBQUM5RyxVQUFLLElBQUwsQ0FBVSxHQUFWLEdBQWdCLE1BQUssSUFBTCxDQUFVLEdBQVYsSUFBaUIsUUFBakM7QUFDQSxVQUFLLElBQUwsQ0FBVSxvQkFBVixHQUFpQyxNQUFLLElBQUwsQ0FBVSxvQkFBVixJQUFrQywwQ0FBbkU7QUFDQSxVQUFLLElBQUwsQ0FBVSxrQkFBVixHQUErQixNQUFLLElBQUwsQ0FBVSxrQkFBVixJQUFnQyw2QkFBL0Q7O0FBRUEsVUFBSyxJQUFMLENBQVUsZUFBVixDQUEwQixHQUExQixDQUE4QixPQUFPLE1BQUssSUFBTCxDQUFVLFNBQWpCLENBQTlCOztBQUVBLFVBQUssaUJBQUwsQ0FBdUIsR0FBdkIsR0FBNkIsTUFBSyxpQkFBTCxDQUF1QixHQUF2QixJQUErQixTQUFTLEdBQVQsR0FBYztBQUN4RSxVQUFHLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsR0FBbEIsQ0FBc0IsS0FBekIsRUFBK0I7QUFDN0IsYUFBSyxJQUFMLENBQVUsT0FBVixDQUFrQixHQUFsQixDQUFzQixLQUF0QixDQUE0QixLQUFLLElBQUwsQ0FBVSxPQUF0QyxFQUErQyxTQUEvQztBQUNELE9BRkQsTUFFTztBQUNMO0FBQ0EsYUFBSyxJQUFMLENBQVUsT0FBVixDQUFrQixHQUFsQixDQUFzQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsS0FBdEIsQ0FBNEIsU0FBNUIsRUFBdUMsSUFBdkMsQ0FBNEMsR0FBNUMsQ0FBdEI7QUFDRDtBQUNGLEtBUDJELENBTzFELElBUDBELE9BQTVELENBaERvQyxDQXVEbkI7O0FBRWpCLFVBQUssbUJBQUwsR0FBMkIsRUFBM0I7QUFDQSxVQUFLLG1CQUFMLEdBQTJCLEVBQTNCOztBQUVBLFFBQUcsTUFBSyxJQUFMLENBQVUsTUFBYixFQUFvQjtBQUNsQixZQUFLLE1BQUwsQ0FBWSxxQkFBWixDQUFrQyxNQUFLLElBQUwsQ0FBVSxNQUE1QyxFQURrQixDQUNxQztBQUN4RDs7QUFFRDtBQUNBLFFBQUcsTUFBSyxJQUFMLENBQVUsUUFBYixFQUFzQjtBQUNwQixZQUFLLGNBQUwsR0FBc0IsSUFBSSxNQUFLLElBQUwsQ0FBVSxHQUFkLENBQWtCLG1DQUFtQyxNQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLENBQW5CLENBQW5DLEVBQTBELE1BQUssTUFBTCxDQUFZLGFBQXRFLENBQWxCLENBQXRCO0FBQ0EsWUFBSyxhQUFMLEdBQXFCLG1CQUFtQixNQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLENBQW5CLENBQW5CLEVBQTBDLE1BQUssTUFBTCxDQUFZLGFBQXRELENBQXJCO0FBQ0EsWUFBSyxlQUFMLEdBQXVCLE1BQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsQ0FBdkI7QUFDQSxZQUFLLE1BQUwsQ0FBWSxxQkFBWixDQUFrQyxNQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLENBQW5CLENBQWxDLEVBSm9CLENBSXdDO0FBQzVELFlBQUssbUJBQUwsR0FBMkIsTUFBSyxJQUFMLENBQVUsUUFBVixDQUFtQixDQUFuQixDQUEzQjtBQUNELEtBTkQsTUFNSztBQUNILFlBQUssY0FBTCxHQUFzQixJQUFJLE1BQUssSUFBTCxDQUFVLEdBQWQsRUFBdEI7QUFDQSxZQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxZQUFLLGVBQUwsR0FBdUIsS0FBdkI7QUFDRDs7QUFFRDtBQUNBLG9CQUFnQixNQUFoQixDQUF1QixPQUF2QixDQUErQixVQUFTLEtBQVQsRUFBZTtBQUM1QyxXQUFLLEVBQUwsQ0FBUSxLQUFSLEVBQWUsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsRUFBb0IsS0FBcEIsQ0FBZjtBQUNELEtBRkQ7O0FBSUEsV0FBTyxPQUFQLENBQWUsSUFBZixDQUFvQixLQUFwQjtBQWxGb0M7QUFtRnJDOztBQUVEOzs7Ozs7Ozs7NkJBS1E7QUFDTixhQUFPLEtBQUssSUFBTCxDQUFVLGFBQWpCO0FBQ0EsVUFBRyxLQUFLLGVBQVIsRUFBeUI7QUFDekIsV0FBSyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsV0FBSyxJQUFMLHdCQUErQixLQUFLLElBQUwsQ0FBVSxRQUF6QztBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsSUFBdEI7QUFDRDs7O3FDQUVnQixLLEVBQU07QUFBQTs7QUFDckI7QUFDQTtBQUNBLFdBQUssc0JBQUw7O0FBRUEsVUFBSSxlQUFlLEtBQUsscUJBQUwsR0FBNkIsSUFBN0IsQ0FBa0MscUNBQWxDLENBQW5COztBQUVBLFdBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLGFBQWEsTUFBbkMsRUFBMkMsSUFBSSxHQUEvQyxFQUFvRCxHQUFwRCxFQUF5RDtBQUNyRCxZQUFJLGNBQWMsYUFBYSxDQUFiLENBQWxCOztBQUVBLFlBQUcsWUFBWSxNQUFaLEtBQXVCLFNBQTFCLEVBQXFDO0FBQ2pDLGVBQUssSUFBSSxVQUFVLENBQWQsRUFBaUIsVUFBVSxZQUFZLE1BQVosQ0FBbUIsTUFBbkQsRUFBMkQsVUFBVSxPQUFyRSxFQUE4RSxTQUE5RSxFQUF5RjtBQUNyRixnQkFBSSxRQUFRLFlBQVksTUFBWixDQUFtQixPQUFuQixDQUFaO0FBQ0EsaUJBQUssSUFBSSxXQUFXLENBQWYsRUFBa0IsV0FBVyxNQUFNLE1BQXhDLEVBQWdELFdBQVcsUUFBM0QsRUFBcUUsVUFBckUsRUFBaUY7QUFDN0Usa0JBQUksWUFBWSxNQUFNLFFBQU4sQ0FBaEI7QUFDQSxrQkFBSTtBQUNGLDBCQUFVLElBQVYsQ0FBZSxLQUFLLGlCQUFwQixFQUF1QyxJQUF2QztBQUNELGVBRkQsQ0FFRSxPQUFPLENBQVAsRUFBUztBQUNULHFCQUFLLFlBQUwsQ0FBa0IsQ0FBbEIsRUFBcUIsU0FBckI7QUFDQTtBQUNEO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0EsWUFBRyxZQUFZLE9BQWYsRUFBd0IsWUFBWSxPQUFaLENBQW9CLE9BQXBCLENBQTZCLGtCQUFVO0FBQzdELGlCQUFLLGlCQUFMLENBQXVCLFlBQXZCLENBQW9DLE9BQU8sRUFBM0M7QUFDRCxTQUZ1Qjs7QUFJeEI7QUFDQSxZQUFJLFlBQVksS0FBWixLQUFzQixPQUF0QixJQUNBLFlBQVksTUFBWixDQUFtQixLQUFuQixLQUE2QixPQURqQyxFQUN5Qzs7QUFFdkMsY0FBRyxLQUFLLElBQUwsQ0FBVSxhQUFiLEVBQTJCO0FBQ3pCLGlCQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCO0FBQzFCLHNCQUFRLFVBRGtCO0FBRTFCLG9CQUFNLGlCQUFpQixLQUFLLElBQUwsQ0FBVSxRQUZQO0FBRzFCLG9CQUFPLFlBQVksUUFBWixJQUF3QixZQUFZLFFBQVosQ0FBcUIsSUFBckIsQ0FBMEIsS0FBSyxpQkFBL0IsRUFBa0QsS0FBbEQ7QUFITCxhQUE1QjtBQUtEOztBQUVELGVBQUssSUFBTCxDQUFVLGVBQVYsQ0FBMEIsTUFBMUIsQ0FBaUMsS0FBSyxJQUFMLENBQVUsU0FBM0M7QUFDQSxlQUFLLElBQUwsQ0FBVSxtQkFBVixFQUErQixLQUEvQjtBQUNEO0FBQ0o7QUFFRjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBb0JRO0FBQ0osV0FBSyxVQUFMO0FBQ0EsV0FBSyxlQUFMO0FBQ0EsYUFBTyxLQUFLLGdCQUFMLEVBQVA7QUFDSDs7QUFHRDs7Ozs7OztBQU9BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBa0JXLEUsRUFBSTtBQUNYLFdBQUssS0FBSyxVQUFMLENBQWdCLEVBQWhCLENBQUw7QUFDQSxXQUFLLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLEVBQXBCO0FBQ0g7OzsrQkFFVSxFLEVBQUc7QUFBQTs7QUFDVixVQUFJLE9BQU8sRUFBUCxLQUFjLFVBQWxCLEVBQThCO0FBQzFCLGFBQUssR0FBTDtBQUNIOztBQUVELFdBQUssSUFBTCxDQUFVLDZCQUFWOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsT0FBdkIsQ0FBZ0M7QUFBQSxlQUFLLE9BQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixDQUF4QixDQUFMO0FBQUEsT0FBaEM7O0FBRUEsYUFBTyxFQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7O3VDQUttQjtBQUNmLGFBQU8sS0FBSyxjQUFMLENBQW9CLElBQXBCLEdBQTJCLEdBQTNCLENBQStCLFVBQVMsQ0FBVCxFQUFXO0FBQUMsZUFBTyxFQUFFLEVBQVQ7QUFBYSxPQUF4RCxDQUFQO0FBQ0g7Ozs0Q0FFc0I7QUFDbkIsYUFBTyxLQUFLLGNBQUwsQ0FBb0IsSUFBcEIsR0FDQyxHQURELENBQ0ssVUFBUyxDQUFULEVBQVc7QUFBRSxlQUFPLENBQUMsQ0FBRCxFQUFJLE1BQUosQ0FBVyxNQUFNLFlBQU4sQ0FBbUIsQ0FBbkIsQ0FBWCxDQUFQO0FBQTBDLE9BRDVELEVBQzZELElBRDdELEVBRUMsTUFGRCxDQUVRLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLGVBQU8sRUFBRSxNQUFGLENBQVMsQ0FBVCxDQUFQO0FBQW9CLE9BRjFDLEVBRTJDLEVBRjNDLEdBRW1EO0FBQ2xELFlBSEQsQ0FHUSxVQUFTLENBQVQsRUFBVyxDQUFYLEVBQWE7QUFBQyxlQUFPLEVBQUUsT0FBRixDQUFVLENBQVYsSUFBZSxDQUFDLENBQWhCLEdBQW9CLENBQXBCLEdBQXdCLEVBQUUsTUFBRixDQUFTLENBQVQsQ0FBL0I7QUFBNEMsT0FIbEUsRUFHbUUsRUFIbkUsQ0FBUCxDQURtQixDQUk0RDtBQUNsRjs7QUFHRDs7Ozs7OzsyQ0FJdUI7QUFDbkIsYUFBTyxLQUFLLHFCQUFMLEdBQTZCLEdBQTdCLENBQWlDLFVBQVMsQ0FBVCxFQUFXO0FBQUMsZUFBTyxFQUFFLEVBQVQ7QUFBYSxPQUExRCxDQUFQO0FBQ0g7O0FBR0Q7Ozs7Ozs7O3lCQUtLLFMsRUFBVztBQUNaLGFBQU8sS0FBSyxvQkFBTCxHQUE0QixPQUE1QixDQUFvQyxTQUFwQyxJQUFpRCxDQUFDLENBQXpEO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzhCQUtVO0FBQ04sYUFBTyxLQUFLLGVBQVo7QUFDSDs7QUFFRDs7OztvQ0FDZ0IsQyxFQUFHO0FBQ2YsVUFBSSxxQkFBSjtBQUFBLFVBQWtCLGtCQUFsQjtBQUFBLFVBQTZCLHdCQUE3QjtBQUFBLFVBQThDLHlCQUE5Qzs7QUFEZSwyQkFFZ0QsS0FBSyxhQUFMLENBQW1CLENBQW5CLENBRmhEOztBQUFBOztBQUVkLHFCQUZjO0FBRUcsc0JBRkg7QUFFcUIsZUFGckI7QUFFZ0Msa0JBRmhDOzs7QUFJZixhQUFPLFNBQVAsRUFBa0I7QUFBQSxvQ0FDWSxLQUFLLHFDQUFMLENBQTJDLFlBQTNDLEVBQXlELGdCQUF6RCxFQUEyRSxlQUEzRSxDQURaOztBQUFBOztBQUNmLG9CQURlO0FBQ0QsaUJBREM7QUFFakI7O0FBRUQsV0FBSyxjQUFMLENBQW9CLFlBQXBCLEVBQWtDLGdCQUFsQyxFQUFvRCxlQUFwRDtBQUNIOzs7MERBRXFDLFksRUFBYyxnQixFQUFrQixlLEVBQWdCO0FBQ2xGO0FBQ0EsVUFBSSxzQkFBdUIsS0FBSyxrQkFBTCxDQUF3QixZQUF4QixFQUFzQyxJQUF0QyxDQUEzQjtBQUNBLFVBQUcsb0JBQW9CLE9BQXBCLEVBQUgsRUFBaUM7QUFDL0IsWUFBSSxLQUFLLEtBQUssbUJBQUwsQ0FBeUIsS0FBekIsRUFBVDtBQUNBLFlBQUcsRUFBSCxFQUFNO0FBQ0oseUJBQWUsRUFBZjtBQUNBLGdDQUFzQixLQUFLLGtCQUFMLENBQXdCLFlBQXhCLEVBQXNDLEtBQXRDLENBQXRCO0FBQ0Q7QUFDRjs7QUFFRCxVQUFHLENBQUMsb0JBQW9CLE9BQXBCLEVBQUosRUFBa0M7QUFDaEMsYUFBSyxJQUFMLENBQVUsa0JBQVYsRUFBOEIsWUFBOUI7QUFDQSxZQUFJLHFCQUFKO0FBQUEsWUFBa0Isc0JBQWxCOztBQUZnQyxpQ0FHQSxLQUFLLGlCQUFMLENBQXVCLFlBQXZCLEVBQXFDLG1CQUFyQyxDQUhBOztBQUFBOztBQUcvQixvQkFIK0I7QUFHakIscUJBSGlCOztBQUloQyxZQUFHLFlBQUgsRUFBaUIsYUFBYSxPQUFiLENBQXNCO0FBQUEsaUJBQUssZ0JBQWdCLEdBQWhCLENBQW9CLENBQXBCLENBQUw7QUFBQSxTQUF0QjtBQUNqQixZQUFHLGFBQUgsRUFBa0IsY0FBYyxPQUFkLENBQXVCO0FBQUEsaUJBQUssaUJBQWlCLEdBQWpCLENBQXFCLENBQXJCLENBQUw7QUFBQSxTQUF2QjtBQUNsQixhQUFLLElBQUwsQ0FBVSxnQkFBVixFQUE0QixZQUE1QjtBQUNEO0FBQ0QsVUFBSSxZQUFZLENBQUMsb0JBQW9CLE9BQXBCLEVBQUQsSUFBa0MsS0FBSyxtQkFBTCxDQUF5QixNQUEzRTtBQUNBLGFBQU8sQ0FBQyxZQUFELEVBQWUsU0FBZixDQUFQO0FBQ0g7OztrQ0FFYSxDLEVBQUU7QUFBQTs7QUFDWixXQUFLLElBQUwsQ0FBVSxnQkFBVixFQUE0QixDQUE1Qjs7QUFFQTtBQUNBLFdBQUssY0FBTCxDQUFvQixJQUFwQixHQUEyQixPQUEzQixDQUFtQyxpQkFBUztBQUMxQyxZQUFHLE1BQU0sT0FBVCxFQUFrQixNQUFNLE9BQU4sQ0FBYyxPQUFkLENBQXVCLGtCQUFXO0FBQ2xELGNBQUcsT0FBTyxXQUFWLEVBQXNCO0FBQ3BCO0FBQ0EsbUJBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEI7QUFDMUIsNkJBQWEsT0FBTyxFQURNO0FBRTFCLG9CQUFNLEVBQUUsSUFGa0I7QUFHMUIsb0JBQU8sRUFBRTtBQUhpQixhQUE1QjtBQUtEO0FBQ0QsY0FBRyxPQUFPLEVBQVAsS0FBYyxFQUFFLFFBQW5CLEVBQTRCO0FBQzFCO0FBQ0EsZ0JBQUcsT0FBTyxRQUFWLEVBQW9CLE9BQU8sUUFBUCxDQUFnQixPQUFoQixDQUF5QjtBQUFBLHFCQUFXLE9BQUssZUFBTCxDQUFxQixDQUFyQixFQUF3QixNQUF4QixDQUFYO0FBQUEsYUFBekI7QUFDckI7QUFDRixTQWJpQjtBQWNuQixPQWZEOztBQWlCQSxVQUFJLENBQUosRUFBTyxLQUFLLG1CQUFMLENBQXlCLElBQXpCLENBQThCLENBQTlCOztBQUVQLFVBQUksa0JBQWtCLElBQUksR0FBSixFQUF0QjtBQUFBLFVBQWlDLG1CQUFtQixJQUFJLEdBQUosRUFBcEQ7QUFDQSxVQUFJLFlBQVksSUFBaEI7QUFDQSxVQUFJLGVBQWUsQ0FBbkI7QUFDQSxhQUFPLENBQUMsZ0JBQUQsRUFBbUIsZUFBbkIsRUFBb0MsU0FBcEMsRUFBK0MsWUFBL0MsQ0FBUDtBQUNIOzs7bUNBRWMsQyxFQUFHLGdCLEVBQWtCLGUsRUFBaUIsRSxFQUFHO0FBQUE7O0FBQ3BELFVBQUksaUJBQWlCLE1BQU0sSUFBTixDQUFXLElBQUksR0FBSixDQUFRLDZCQUFJLGdCQUFKLEdBQXNCLE1BQXRCLENBQTZCO0FBQUEsZUFBSyxFQUFFLE9BQUYsSUFBYSxDQUFDLGdCQUFnQixHQUFoQixDQUFvQixDQUFwQixDQUFuQjtBQUFBLE9BQTdCLENBQVIsQ0FBWCxFQUE2RixJQUE3RixDQUFrRyxnQkFBbEcsQ0FBckI7O0FBRUE7QUFDQSxxQkFBZSxPQUFmLENBQXdCLGFBQUs7QUFDekIsVUFBRSxPQUFGLENBQVUsT0FBVixDQUFtQjtBQUFBLGlCQUFNLE9BQUssZUFBTCxDQUFxQixDQUFyQixFQUF1QixDQUF2QixDQUFOO0FBQUEsU0FBbkI7QUFDSCxPQUZEOztBQUlBO0FBQ0Esc0JBQWdCLE9BQWhCLENBQXlCLGFBQUs7QUFDNUIsWUFBRyxFQUFFLE9BQUwsRUFBYyxFQUFFLE9BQUYsQ0FBVSxPQUFWLENBQW1CLGtCQUFVO0FBQ3pDLGlCQUFLLGlCQUFMLENBQXVCLFlBQXZCLENBQW9DLE9BQU8sRUFBM0M7QUFDRCxTQUZhO0FBR2YsT0FKRDs7QUFNQTtBQUNBO0FBQ0E7O0FBRUEsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxDQUFvQixJQUFwQixHQUEyQixLQUEzQixDQUFpQyxVQUFTLENBQVQsRUFBVztBQUFFLGVBQU8sRUFBRSxRQUFGLEtBQWUsS0FBdEI7QUFBOEIsT0FBNUUsQ0FBdkI7QUFDQSxVQUFHLEtBQUssZUFBUixFQUF3QjtBQUN0QixhQUFLLGdCQUFMLENBQXNCLENBQXRCO0FBQ0Q7QUFDRCxXQUFLLElBQUwsQ0FBVSxjQUFWO0FBQ0EsVUFBRyxFQUFILEVBQU8sR0FBRyxTQUFILEVBQWMsS0FBSyxnQkFBTCxFQUFkO0FBQ1Y7Ozs2Q0FFdUI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdEIsNkJBQTJCLEtBQUssaUJBQUwsQ0FBdUIsU0FBbEQsOEhBQTREO0FBQUEsY0FBbkQsY0FBbUQ7O0FBQzFELGNBQUcsQ0FBQyxlQUFlLFdBQWYsQ0FBMkIsS0FBL0IsRUFBc0M7QUFDdEMsZUFBSyxJQUFMLENBQVUseUJBQVYsRUFBcUMsY0FBckM7QUFDQSx1QkFBYSxlQUFlLGFBQTVCO0FBQ0EsZUFBSyxpQkFBTCxDQUF1QixTQUF2QixDQUFpQyxNQUFqQyxDQUF3QyxjQUF4QztBQUNEO0FBTnFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT3RCLGFBQU8sSUFBUCxDQUFZLEtBQUssaUJBQUwsQ0FBdUIsV0FBbkMsRUFBZ0QsT0FBaEQsQ0FBd0QsVUFBUyxHQUFULEVBQWE7QUFDbkUsZUFBTyxLQUFLLGlCQUFMLENBQXVCLFdBQXZCLENBQW1DLEdBQW5DLENBQVA7QUFDRCxPQUZELEVBRUcsSUFGSDtBQUdEOzs7eUNBRW9CLEMsRUFBRyxFLEVBQUk7QUFDeEIsVUFBSSxxQkFBSjtBQUFBLFVBQWtCLGtCQUFsQjtBQUFBLFVBQTZCLHdCQUE3QjtBQUFBLFVBQThDLHlCQUE5Qzs7QUFEd0IsMkJBRXVDLEtBQUssYUFBTCxDQUFtQixDQUFuQixDQUZ2Qzs7QUFBQTs7QUFFdkIscUJBRnVCO0FBRU4sc0JBRk07QUFFWSxlQUZaO0FBRXVCLGtCQUZ2Qjs7O0FBSXhCLGVBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF1QjtBQUNyQixhQUFLLElBQUwsQ0FBVSxJQUFWOztBQURxQixxQ0FFTyxLQUFLLHFDQUFMLENBQTJDLFlBQTNDLEVBQXlELGdCQUF6RCxFQUEyRSxlQUEzRSxDQUZQOztBQUFBOztBQUVwQixvQkFGb0I7QUFFTixpQkFGTTs7O0FBSXJCLFlBQUcsU0FBSCxFQUFhO0FBQ1gsZUFBSyxJQUFMLENBQVUsa0JBQVY7QUFDQSx1QkFBYSxTQUFTLElBQVQsQ0FBYyxJQUFkLENBQWIsRUFBaUMsaUJBQWpDO0FBQ0QsU0FIRCxNQUdLO0FBQ0gsZUFBSyxjQUFMLENBQW9CLFlBQXBCLEVBQWtDLGdCQUFsQyxFQUFvRCxlQUFwRCxFQUFxRSxFQUFyRTtBQUNEO0FBQ0Y7QUFDRCxlQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW1CLGdCQUFuQjtBQUNIOztBQUVEOzs7O3NDQUNrQixZLEVBQWMsbUIsRUFBcUI7O0FBRWpELFdBQUssSUFBTCxDQUFVLHlDQUFWLEVBQXFELFlBQXJEOztBQUVBLFdBQUssSUFBTCxDQUFVLHNCQUFWLEVBQWtDLG1CQUFsQzs7QUFFQSxVQUFJLHFCQUFKO0FBQUEsVUFDSSxzQkFESjs7QUFHQSxVQUFJLENBQUMsb0JBQW9CLE9BQXBCLEVBQUwsRUFBb0M7O0FBRWhDO0FBQ0E7QUFDQSxZQUFJLGlDQUFpQyxJQUFJLEtBQUssSUFBTCxDQUFVLEdBQWQsQ0FBa0Isb0JBQW9CLElBQXBCLEdBQTJCLE1BQTNCLENBQWtDLHFCQUFsQyxDQUFsQixDQUFyQzs7QUFFQSx1QkFBZSxLQUFLLFdBQUwsQ0FBaUIsWUFBakIsRUFBK0IsOEJBQS9CLENBQWY7QUFDQSxhQUFLLG1CQUFMLENBQXlCLFlBQXpCLEVBQXVDLG1CQUF2QztBQUNBLHdCQUFnQixLQUFLLFlBQUwsQ0FBa0IsWUFBbEIsRUFBZ0MsOEJBQWhDLENBQWhCOztBQUVBLGFBQUssSUFBTCxDQUFVLG9CQUFWLEVBQWdDLEtBQUssY0FBckM7QUFDSDs7QUFFRCxhQUFPLENBQUMsWUFBRCxFQUFlLGFBQWYsQ0FBUDtBQUNIOzs7Z0NBRVcsWSxFQUFjLDhCLEVBQStCO0FBQ3JELFVBQUksMEJBQUo7QUFBQSxVQUF1QixxQkFBdkI7O0FBRHFELDhCQUVqQixLQUFLLGdCQUFMLENBQXNCLDhCQUF0QixDQUZpQjs7QUFBQTs7QUFFcEQsdUJBRm9EO0FBRWpDLGtCQUZpQzs7O0FBSXJELFdBQUssSUFBTCxDQUFVLGdCQUFWO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sYUFBYSxNQUFuQyxFQUEyQyxJQUFJLEdBQS9DLEVBQW9ELEdBQXBELEVBQXlEO0FBQ3JELFlBQUksY0FBYyxhQUFhLENBQWIsQ0FBbEI7O0FBRUEsWUFBRyxZQUFZLFFBQWYsRUFBeUIsS0FBSyxjQUFMLENBQW9CLE1BQXBCLENBQTJCLFdBQTNCOztBQUV6QixhQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLFlBQVksRUFBbEM7O0FBRUE7QUFDQSxhQUFLLElBQUwsQ0FBVSxRQUFWLEVBQW1CLFlBQVksRUFBL0I7O0FBRUEsWUFBRyxZQUFZLE1BQVosS0FBdUIsU0FBMUIsRUFBcUM7QUFDakMsZUFBSyxJQUFJLFVBQVUsQ0FBZCxFQUFpQixVQUFVLFlBQVksTUFBWixDQUFtQixNQUFuRCxFQUEyRCxVQUFVLE9BQXJFLEVBQThFLFNBQTlFLEVBQXlGO0FBQ3JGLGdCQUFJLFFBQVEsWUFBWSxNQUFaLENBQW1CLE9BQW5CLENBQVo7QUFDQSxpQkFBSyxJQUFJLFdBQVcsQ0FBZixFQUFrQixXQUFXLE1BQU0sTUFBeEMsRUFBZ0QsV0FBVyxRQUEzRCxFQUFxRSxVQUFyRSxFQUFpRjtBQUM3RSxrQkFBSSxZQUFZLE1BQU0sUUFBTixDQUFoQjtBQUNBLGtCQUFJO0FBQ0YsMEJBQVUsSUFBVixDQUFlLEtBQUssaUJBQXBCLEVBQXVDLFlBQXZDO0FBQ0QsZUFGRCxDQUVFLE9BQU8sQ0FBUCxFQUFTO0FBQ1QscUJBQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixTQUFyQjtBQUNBO0FBQ0Q7QUFDSjtBQUNKO0FBQ0o7O0FBRUQsWUFBSSxDQUFKO0FBQ0EsWUFBSSxZQUFZLFVBQWhCLEVBQTRCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3hCLGtDQUFzQixZQUFZLFVBQWxDLG1JQUE2QztBQUFBLGtCQUFyQyxVQUFxQzs7QUFDekMsa0JBQUksV0FBVyxNQUFmLEVBQXVCO0FBQ25CLG9CQUFJLFdBQVMsRUFBVCxFQUFhO0FBQ2IseUJBQU8sR0FBRyxRQUFILEtBQWdCLEtBQWhCLElBQXlCLFlBQVksV0FBWixDQUF3QixPQUF4QixDQUFnQyxFQUFoQyxJQUFzQyxDQUFDLENBQXZFO0FBQ0gsaUJBRkQ7QUFHSCxlQUpELE1BSU87QUFDSCxvQkFBSSxXQUFTLEVBQVQsRUFBYTtBQUNiLHlCQUFPLEdBQUcsTUFBSCxLQUFjLFdBQXJCO0FBQ0gsaUJBRkQ7QUFHSDtBQUNEO0FBQ0EsbUJBQUssYUFBTCxDQUFtQixXQUFXLEVBQTlCLElBQW9DLGFBQWEsTUFBYixDQUFvQixDQUFwQixDQUFwQztBQUNIO0FBYnVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFjM0I7QUFDSjs7QUFFRCxhQUFPLFlBQVA7QUFDSDs7QUFFRDs7OztxQ0FDaUIsVyxFQUFhO0FBQzVCLFVBQUksZUFBZSxJQUFJLEtBQUssSUFBTCxDQUFVLEdBQWQsRUFBbkI7QUFDQSxVQUFJLG9CQUFvQixJQUFJLEtBQUssSUFBTCxDQUFVLEdBQWQsRUFBeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFJLGlCQUFpQixZQUFZLElBQVosRUFBckI7QUFDQSxXQUFLLElBQUksUUFBUSxDQUFaLEVBQWUsUUFBUSxlQUFlLE1BQTNDLEVBQW1ELFFBQVEsS0FBM0QsRUFBa0UsT0FBbEUsRUFBMkU7QUFDekUsWUFBSSxhQUFhLGVBQWUsS0FBZixDQUFqQjtBQUNBLFlBQUksUUFBUSxXQUFXLEtBQXZCO0FBQUEsWUFDSSxPQUFPLE1BQU0sV0FEakI7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxhQUFhLEtBQUssY0FBTCxDQUFvQixJQUFwQixFQUFqQjtBQUNBLGFBQUssSUFBSSxTQUFTLENBQWIsRUFBZ0IsU0FBUyxXQUFXLE1BQXpDLEVBQWlELFNBQVMsTUFBMUQsRUFBa0UsUUFBbEUsRUFBNEU7QUFDMUUsY0FBSSxRQUFRLFdBQVcsTUFBWCxDQUFaO0FBQ0EsY0FBRyxLQUFLLE9BQUwsQ0FBYSxLQUFiLElBQXNCLENBQUMsQ0FBMUIsRUFBNEI7QUFDMUIsOEJBQWtCLEdBQWxCLENBQXNCLEtBQXRCO0FBQ0EseUJBQWEsR0FBYixDQUFpQixLQUFqQjtBQUNBLGdCQUFJLFlBQVksTUFBTSxZQUFOLENBQW1CLEtBQW5CLEVBQXlCLEtBQXpCLENBQWhCO0FBQ0EsaUJBQUssSUFBSSxTQUFTLENBQWIsRUFBZ0IsU0FBUyxVQUFVLE1BQXhDLEVBQWdELFNBQVMsTUFBekQsRUFBaUUsUUFBakUsRUFBMkU7QUFDekUsMkJBQWEsR0FBYixDQUFpQixVQUFVLE1BQVYsQ0FBakI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxVQUFJLHFCQUFxQixhQUFhLElBQWIsR0FBb0IsSUFBcEIsQ0FBeUIscUNBQXpCLENBQXpCO0FBQ0EsYUFBTyxDQUFDLGlCQUFELEVBQW9CLGtCQUFwQixDQUFQO0FBQ0Q7Ozt3Q0FFbUIsWSxFQUFjLG1CLEVBQW9CO0FBQ2xELFVBQUksb0JBQW9CLG9CQUFvQixJQUFwQixHQUEyQixJQUEzQixDQUFnQyxvQkFBaEMsQ0FBeEI7O0FBRUEsV0FBSyxJQUFMLENBQVUsZ0NBQVY7QUFDQSxXQUFLLElBQUksU0FBUyxDQUFiLEVBQWdCLE1BQU0sa0JBQWtCLE1BQTdDLEVBQXFELFNBQVMsR0FBOUQsRUFBbUUsUUFBbkUsRUFBNkU7QUFDekUsWUFBSSxhQUFhLGtCQUFrQixNQUFsQixDQUFqQjs7QUFFQSxZQUFJLFlBQVksV0FBVyxPQUFYLElBQXNCLFdBQVcsT0FBWCxDQUFtQixHQUFuQixDQUF1QixVQUFTLE1BQVQsRUFBZ0I7QUFBQyxpQkFBTyxPQUFPLEVBQWQ7QUFBa0IsU0FBMUQsQ0FBdEM7O0FBRUEsYUFBSyxJQUFMLENBQVUsY0FBVixFQUF5QixXQUFXLE1BQVgsQ0FBa0IsRUFBM0MsRUFBOEMsU0FBOUMsRUFBeUQsV0FBVyxNQUFYLENBQWtCLFdBQWxCLENBQThCLE9BQTlCLENBQXNDLFVBQXRDLENBQXpEOztBQUVBLFlBQUcsV0FBVyxZQUFYLEtBQTRCLFNBQS9CLEVBQTBDO0FBQ3RDLGVBQUssSUFBSSxRQUFRLENBQVosRUFBZSxRQUFRLFdBQVcsWUFBWCxDQUF3QixNQUFwRCxFQUE0RCxRQUFRLEtBQXBFLEVBQTJFLE9BQTNFLEVBQW9GO0FBQ2hGLGdCQUFJLFlBQVksV0FBVyxZQUFYLENBQXdCLEtBQXhCLENBQWhCO0FBQ0EsZ0JBQUk7QUFDRix3QkFBVSxJQUFWLENBQWUsS0FBSyxpQkFBcEIsRUFBdUMsWUFBdkM7QUFDRCxhQUZELENBRUUsT0FBTyxDQUFQLEVBQVM7QUFDVCxtQkFBSyxZQUFMLENBQWtCLENBQWxCLEVBQXFCLFNBQXJCO0FBQ0E7QUFDRDtBQUNKO0FBQ0o7QUFDSjtBQUNKOzs7aUNBRVksWSxFQUFjLDhCLEVBQStCO0FBQUE7O0FBQ3RELFdBQUssSUFBTCxDQUFVLGlCQUFWOztBQUVBLFVBQUksZ0JBQWdCLElBQUksR0FBSixFQUFwQjtBQUNBLFVBQUksd0JBQXdCLElBQUksR0FBSixFQUE1QjtBQUNBO0FBQ0EsVUFBSSx3QkFBd0IsRUFBNUI7QUFDQSxXQUFLLGdCQUFMLENBQXNCLDhCQUF0QixFQUFzRCxhQUF0RCxFQUFxRSxxQkFBckUsRUFBNEYscUJBQTVGO0FBQ0Esc0JBQWdCLDZCQUFJLGFBQUosR0FBbUIsSUFBbkIsQ0FBd0IsZ0JBQXhCLENBQWhCOztBQUVBLFdBQUssSUFBTCxDQUFVLGdCQUFWLEVBQTRCLGFBQTVCOztBQUVBLFdBQUssSUFBSSxXQUFXLENBQWYsRUFBa0IsV0FBVyxjQUFjLE1BQWhELEVBQXdELFdBQVcsUUFBbkUsRUFBNkUsVUFBN0UsRUFBeUY7QUFDckYsWUFBSSxlQUFlLGNBQWMsUUFBZCxDQUFuQjs7QUFFQSxZQUFHLGFBQWEsUUFBaEIsRUFBMEIsS0FBSyxjQUFMLENBQW9CLEdBQXBCLENBQXdCLFlBQXhCOztBQUUxQixhQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLGFBQWEsRUFBbkM7O0FBRUEsYUFBSyxJQUFMLENBQVUsU0FBVixFQUFvQixhQUFhLEVBQWpDOztBQUVBLFlBQUcsYUFBYSxPQUFiLEtBQXlCLFNBQTVCLEVBQXVDO0FBQ25DLGVBQUssSUFBSSxXQUFXLENBQWYsRUFBa0IsV0FBVyxhQUFhLE9BQWIsQ0FBcUIsTUFBdkQsRUFBK0QsV0FBVyxRQUExRSxFQUFvRixVQUFwRixFQUFnRztBQUM1RixnQkFBSSxRQUFRLGFBQWEsT0FBYixDQUFxQixRQUFyQixDQUFaO0FBQ0EsaUJBQUssSUFBSSxXQUFXLENBQWYsRUFBa0IsV0FBVyxNQUFNLE1BQXhDLEVBQWdELFdBQVcsUUFBM0QsRUFBcUUsVUFBckUsRUFBaUY7QUFDN0Usa0JBQUksWUFBWSxNQUFNLFFBQU4sQ0FBaEI7QUFDQSxrQkFBSTtBQUNGLDBCQUFVLElBQVYsQ0FBZSxLQUFLLGlCQUFwQixFQUF1QyxZQUF2QztBQUNELGVBRkQsQ0FFRSxPQUFPLENBQVAsRUFBUztBQUNULHFCQUFLLFlBQUwsQ0FBa0IsQ0FBbEIsRUFBcUIsU0FBckI7QUFDQTtBQUNEO0FBQ0o7QUFDSjtBQUNKOztBQUVELFlBQUcsc0JBQXNCLEdBQXRCLENBQTBCLFlBQTFCLENBQUgsRUFBMkM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdkMsa0NBQXdCLGFBQWEsVUFBckMsbUlBQWdEO0FBQUEsa0JBQXhDLFlBQXdDOztBQUM1QyxtQkFBSyxJQUFMLENBQVUsZ0JBQVYsRUFBNEIsYUFBYSxFQUF6QztBQUNBLGtCQUFHLGFBQWEsUUFBYixLQUEwQixPQUE3QixFQUFxQztBQUNqQyxvQkFBSSxhQUFhLGFBQWEsV0FBYixDQUF5QixDQUF6QixDQUFqQjtBQUNBLG9CQUFHLFdBQVcsWUFBWCxLQUE0QixTQUEvQixFQUEwQztBQUN0Qyx1QkFBSyxJQUFMLENBQVUsd0VBQVYsRUFBbUYsYUFBYSxFQUFoRztBQUNBLHVCQUFLLElBQUksUUFBUSxDQUFaLEVBQWUsUUFBUSxXQUFXLFlBQVgsQ0FBd0IsTUFBcEQsRUFBNEQsUUFBUSxLQUFwRSxFQUEyRSxPQUEzRSxFQUFvRjtBQUNoRix3QkFBSSxhQUFZLFdBQVcsWUFBWCxDQUF3QixLQUF4QixDQUFoQjtBQUNBLHdCQUFJO0FBQ0YsaUNBQVUsSUFBVixDQUFlLEtBQUssaUJBQXBCLEVBQXVDLFlBQXZDO0FBQ0QscUJBRkQsQ0FFRSxPQUFPLENBQVAsRUFBUztBQUNULDJCQUFLLFlBQUwsQ0FBa0IsQ0FBbEIsRUFBcUIsVUFBckI7QUFDQTtBQUNEO0FBQ0o7QUFDSjtBQUNKO0FBQ0o7QUFsQnNDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFtQjFDOztBQUdELFlBQUcsc0JBQXNCLGFBQWEsRUFBbkMsQ0FBSCxFQUEwQztBQUN0QyxjQUFJLGNBQWEsc0JBQXNCLGFBQWEsRUFBbkMsQ0FBakI7QUFDQSxjQUFHLFlBQVcsWUFBWCxLQUE0QixTQUEvQixFQUEwQztBQUN0QyxpQkFBSyxJQUFMLENBQVUsd0VBQVYsRUFBbUYsYUFBYSxFQUFoRztBQUNBLGlCQUFLLElBQUksUUFBUSxDQUFaLEVBQWUsUUFBUSxZQUFXLFlBQVgsQ0FBd0IsTUFBcEQsRUFBNEQsUUFBUSxLQUFwRSxFQUEyRSxPQUEzRSxFQUFvRjtBQUNoRixrQkFBSSxjQUFZLFlBQVcsWUFBWCxDQUF3QixLQUF4QixDQUFoQjtBQUNBLGtCQUFJO0FBQ0YsNEJBQVUsSUFBVixDQUFlLEtBQUssaUJBQXBCLEVBQXVDLFlBQXZDO0FBQ0QsZUFGRCxDQUVFLE9BQU8sQ0FBUCxFQUFTO0FBQ1QscUJBQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixXQUFyQjtBQUNBO0FBQ0Q7QUFDSjtBQUNKO0FBQ0o7QUFDSjs7QUFFRCxXQUFLLElBQUksV0FBVyxDQUFmLEVBQWtCLFdBQVcsY0FBYyxNQUFoRCxFQUF3RCxXQUFXLFFBQW5FLEVBQTZFLFVBQTdFLEVBQXlGO0FBQ3JGLFlBQUksZUFBZSxjQUFjLFFBQWQsQ0FBbkI7QUFDQSxZQUFHLGFBQWEsUUFBYixLQUEwQixLQUE3QixFQUFtQztBQUNqQyxjQUFJLFNBQVMsYUFBYSxNQUExQjtBQUNBLGNBQUksY0FBYyxPQUFPLE1BQXpCO0FBQ0EsZUFBSyxtQkFBTCxDQUF5QixJQUF6QixDQUE4QixFQUFDLE1BQU8sZ0JBQWdCLE9BQU8sRUFBL0IsRUFBbUMsTUFBTyxhQUFhLFFBQWIsSUFBeUIsYUFBYSxRQUFiLENBQXNCLElBQXRCLENBQTJCLEtBQUssaUJBQWhDLEVBQW1ELFlBQW5ELENBQW5FLEVBQTlCO0FBQ0EsY0FBRyxlQUFlLFlBQVksUUFBWixLQUF5QixRQUEzQyxFQUFvRDtBQUNoRCxnQkFBRyxZQUFZLE1BQVosQ0FBbUIsS0FBbkIsQ0FBeUI7QUFBQSxxQkFBSyxPQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsQ0FBTDtBQUFBLGFBQXpCLENBQUgsRUFBMEQ7QUFDdEQsbUJBQUssbUJBQUwsQ0FBeUIsSUFBekIsQ0FBOEIsRUFBQyxNQUFPLGdCQUFnQixZQUFZLEVBQXBDLEVBQTlCO0FBQ0g7QUFDSjtBQUNGO0FBQ0o7O0FBRUQsYUFBTyxhQUFQO0FBQ0g7Ozs4Q0FFeUIsVSxFQUFXO0FBQ25DLFVBQUksVUFBVSxJQUFJLEdBQUosRUFBZDtBQURtQztBQUFBO0FBQUE7O0FBQUE7QUFFbkMsOEJBQWEsV0FBVyxPQUF4QixtSUFBZ0M7QUFBQSxjQUF4QixDQUF3Qjs7QUFDOUIsY0FBRyxFQUFFLFFBQUYsS0FBZSxPQUFsQixFQUEwQjtBQUN4QixnQkFBRyxFQUFFLEVBQUYsSUFBUSxLQUFLLGFBQWhCLEVBQ0UsS0FBSyxhQUFMLENBQW1CLEVBQUUsRUFBckIsRUFBeUIsT0FBekIsQ0FBa0M7QUFBQSxxQkFBUyxRQUFRLEdBQVIsQ0FBWSxLQUFaLENBQVQ7QUFBQSxhQUFsQyxFQURGLEtBR0UsNkJBQUksS0FBSyx5QkFBTCxDQUErQixFQUFFLFdBQUYsQ0FBYyxDQUFkLENBQS9CLENBQUosR0FBc0QsT0FBdEQsQ0FBK0Q7QUFBQSxxQkFBUyxRQUFRLEdBQVIsQ0FBWSxLQUFaLENBQVQ7QUFBQSxhQUEvRDtBQUNILFdBTEQsTUFLTztBQUNMLG9CQUFRLEdBQVIsQ0FBWSxDQUFaO0FBQ0Q7QUFDRjtBQVhrQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVluQyxhQUFPLE9BQVA7QUFDRDs7O3FDQUVnQixXLEVBQWEsYSxFQUFlLHFCLEVBQXVCLHFCLEVBQXNCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3hGLDhCQUFhLFlBQVksSUFBWixFQUFiLG1JQUFnQztBQUFBLGNBQXhCLENBQXdCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQzlCLGtDQUFhLEVBQUUsT0FBZixtSUFBdUI7QUFBQSxrQkFBZixDQUFlOztBQUNyQixtQkFBSywyQkFBTCxDQUFpQyxDQUFqQyxFQUFtQyxhQUFuQyxFQUFrRCxxQkFBbEQsRUFBeUUscUJBQXpFO0FBQ0Q7QUFINkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFJOUIsY0FBSSxXQUFXLEVBQUUsS0FBakI7QUFKOEI7QUFBQTtBQUFBOztBQUFBO0FBSzlCLGtDQUFhLEtBQUsseUJBQUwsQ0FBK0IsQ0FBL0IsQ0FBYixtSUFBK0M7QUFBQSxrQkFBdkMsRUFBdUM7O0FBQzdDLG1CQUFLLHlCQUFMLENBQStCLEVBQS9CLEVBQWtDLFFBQWxDLEVBQTRDLGFBQTVDLEVBQTJELHFCQUEzRCxFQUFrRixxQkFBbEY7QUFDRDtBQVA2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUS9CO0FBVHVGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVekY7OztvQ0FFZSxXLEVBQWE7QUFDM0IsVUFBSSxlQUFlLElBQUksR0FBSixFQUFuQjtBQUQyQjtBQUFBO0FBQUE7O0FBQUE7QUFFM0IsOEJBQWEsV0FBYixtSUFBeUI7QUFBQSxjQUFqQixDQUFpQjs7QUFDdkIsY0FBRyxFQUFFLE9BQUwsRUFBYTtBQUNYLGdCQUFJLFFBQVEsRUFBRSxLQUFkO0FBRFc7QUFBQTtBQUFBOztBQUFBO0FBRVgsb0NBQWEsS0FBSyxxQkFBTCxFQUFiLG1JQUEwQztBQUFBLG9CQUFsQyxDQUFrQzs7QUFDeEMsb0JBQUcsTUFBTSxZQUFOLENBQW1CLENBQW5CLEVBQXFCLEtBQXJCLENBQUgsRUFBZ0MsYUFBYSxHQUFiLENBQWlCLENBQWpCO0FBQ2pDO0FBSlU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtaO0FBQ0Y7QUFUMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFVM0IsYUFBTyxZQUFQO0FBQ0Q7Ozs4Q0FFeUIsSyxFQUFPLFEsRUFBVSxhLEVBQWUscUIsRUFBdUIscUIsRUFBc0I7QUFBQTs7QUFDckcsVUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFDLEdBQUQsRUFBUztBQUN0QixZQUFHLElBQUksUUFBSixLQUFpQixRQUFwQixFQUE2QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsa0JBQ25CLEtBRG1COztBQUV6QixrQkFBRyxNQUFNLFFBQU4sS0FBbUIsT0FBbkIsSUFBOEIsQ0FBQyw2QkFBSSxhQUFKLEdBQW1CLElBQW5CLENBQXdCO0FBQUEsdUJBQUssTUFBTSxZQUFOLENBQW1CLENBQW5CLEVBQXNCLEtBQXRCLENBQUw7QUFBQSxlQUF4QixDQUFsQyxFQUE2RjtBQUMzRix1QkFBSywyQkFBTCxDQUFpQyxLQUFqQyxFQUF1QyxhQUF2QyxFQUFzRCxxQkFBdEQsRUFBNkUscUJBQTdFO0FBQ0Q7QUFKd0I7O0FBQzNCLG1DQUFpQixJQUFJLE1BQXJCLHdJQUE0QjtBQUFBO0FBSTNCO0FBTDBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNNUI7QUFDRixPQVJEO0FBRHFHO0FBQUE7QUFBQTs7QUFBQTtBQVVyRywrQkFBZSxNQUFNLFlBQU4sQ0FBbUIsS0FBbkIsRUFBeUIsUUFBekIsQ0FBZix3SUFBa0Q7QUFBQSxjQUExQyxHQUEwQzs7QUFDaEQsd0JBQWMsR0FBZCxDQUFrQixHQUFsQjtBQUNBLG1CQUFTLEdBQVQ7QUFDRDtBQWJvRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWNyRyxlQUFTLFFBQVQ7QUFDRDs7O2dEQUcyQixLLEVBQU0sYSxFQUFlLHFCLEVBQXVCLHFCLEVBQXNCO0FBQUE7O0FBQzVGLFVBQUcsTUFBTSxRQUFOLEtBQW1CLE9BQXRCLEVBQThCO0FBQzVCLFlBQUcsS0FBSyxhQUFMLENBQW1CLE1BQU0sRUFBekIsQ0FBSCxFQUFnQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUM5QixtQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsTUFBTSxFQUF6QixDQUFiO0FBQUEsa0JBQVEsQ0FBUjs7QUFDRSxtQkFBSywyQkFBTCxDQUFpQyxDQUFqQyxFQUFtQyxhQUFuQyxFQUFrRCxxQkFBbEQsRUFBeUUscUJBQXpFO0FBREY7QUFEOEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFJOUIsbUNBQWEsS0FBSyxhQUFMLENBQW1CLE1BQU0sRUFBekIsQ0FBYjtBQUFBLGtCQUFRLEdBQVI7O0FBQ0UsbUJBQUsseUJBQUwsQ0FBK0IsR0FBL0IsRUFBa0MsTUFBTSxNQUF4QyxFQUFnRCxhQUFoRCxFQUErRCxxQkFBL0QsRUFBc0YscUJBQXRGO0FBREY7QUFKOEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU0vQixTQU5ELE1BTU87QUFDTCxnQ0FBc0IsTUFBTSxNQUFOLENBQWEsRUFBbkMsSUFBeUMsTUFBTSxXQUFOLENBQWtCLENBQWxCLENBQXpDO0FBREs7QUFBQTtBQUFBOztBQUFBO0FBRUwsbUNBQWEsTUFBTSxXQUFOLENBQWtCLENBQWxCLEVBQXFCLE9BQWxDO0FBQUEsa0JBQVEsR0FBUjs7QUFDRSxtQkFBSywyQkFBTCxDQUFpQyxHQUFqQyxFQUFtQyxhQUFuQyxFQUFpRCxxQkFBakQsRUFBd0UscUJBQXhFO0FBREY7QUFGSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUtMLG1DQUFhLE1BQU0sV0FBTixDQUFrQixDQUFsQixFQUFxQixPQUFsQztBQUFBLGtCQUFRLEdBQVI7O0FBQ0UsbUJBQUsseUJBQUwsQ0FBK0IsR0FBL0IsRUFBa0MsTUFBTSxNQUF4QyxFQUFnRCxhQUFoRCxFQUErRCxxQkFBL0QsRUFBc0YscUJBQXRGO0FBREY7QUFMSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUU47QUFDRixPQWhCRCxNQWdCTztBQUNMLHNCQUFjLEdBQWQsQ0FBa0IsS0FBbEI7QUFDRSxZQUFHLE1BQU0sUUFBTixLQUFtQixTQUF0QixFQUFnQztBQUM5QixnQ0FBc0IsR0FBdEIsQ0FBMEIsS0FBMUI7QUFDQTtBQUY4QjtBQUFBO0FBQUE7O0FBQUE7QUFHOUIsbUNBQWEsTUFBTSxVQUFuQix3SUFBOEI7QUFBQSxrQkFBdEIsR0FBc0I7O0FBQzVCLGtCQUFJLFVBQVUsSUFBRSxRQUFGLEtBQWUsT0FBZixHQUF5QixJQUFFLFdBQUYsQ0FBYyxDQUFkLEVBQWlCLE9BQTFDLEdBQW9ELENBQUMsR0FBRCxDQUFsRTtBQUQ0QjtBQUFBO0FBQUE7O0FBQUE7QUFFNUIsdUNBQXVCLE9BQXZCLHdJQUErQjtBQUFBLHNCQUF2QixXQUF1Qjs7QUFDN0IsdUJBQUssMkJBQUwsQ0FBaUMsV0FBakMsRUFBNkMsYUFBN0MsRUFBNEQscUJBQTVELEVBQW1GLHFCQUFuRjtBQUNEO0FBSjJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLN0I7QUFSNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFTOUIsbUNBQWEsTUFBTSxVQUFuQix3SUFBOEI7QUFBQSxrQkFBdEIsR0FBc0I7O0FBQzVCLGtCQUFJLFdBQVUsSUFBRSxRQUFGLEtBQWUsT0FBZixHQUF5QixJQUFFLFdBQUYsQ0FBYyxDQUFkLEVBQWlCLE9BQTFDLEdBQW9ELENBQUMsR0FBRCxDQUFsRTtBQUQ0QjtBQUFBO0FBQUE7O0FBQUE7QUFFNUIsdUNBQXVCLFFBQXZCLHdJQUErQjtBQUFBLHNCQUF2QixZQUF1Qjs7QUFDN0IsdUJBQUsseUJBQUwsQ0FBK0IsWUFBL0IsRUFBNEMsS0FBNUMsRUFBbUQsYUFBbkQsRUFBa0UscUJBQWxFLEVBQXlGLHFCQUF6RjtBQUNEO0FBSjJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLN0I7QUFkNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWUvQixTQWZELE1BZUs7QUFDSCxjQUFHLE1BQU0sUUFBTixLQUFtQixRQUF0QixFQUErQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsb0JBQ3JCLEtBRHFCOztBQUUzQixvQkFBRyxNQUFNLFFBQU4sS0FBbUIsT0FBbkIsSUFBOEIsQ0FBQyw2QkFBSSxhQUFKLEdBQW1CLElBQW5CLENBQXdCO0FBQUEseUJBQUssTUFBTSxZQUFOLENBQW1CLENBQW5CLEVBQXNCLEtBQXRCLENBQUw7QUFBQSxpQkFBeEIsQ0FBbEMsRUFBNkY7QUFDM0YseUJBQUssMkJBQUwsQ0FBaUMsS0FBakMsRUFBdUMsYUFBdkMsRUFBc0QscUJBQXRELEVBQTZFLHFCQUE3RTtBQUNEO0FBSjBCOztBQUM3QixxQ0FBaUIsTUFBTSxNQUF2Qix3SUFBOEI7QUFBQTtBQUk3QjtBQUw0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTTlCO0FBQ0Y7QUFDSjtBQUNGOzs7bUNBRWMsQyxFQUFFO0FBQUE7O0FBQ2IsVUFBRyxFQUFFLFFBQUYsS0FBZSxTQUFsQixFQUE0QjtBQUN4QixlQUFPLEVBQUUsTUFBRixDQUFTLElBQVQsQ0FBYztBQUFBLGlCQUFLLEVBQUUsUUFBRixLQUFlLEtBQWYsSUFBd0IsT0FBSyxjQUFMLENBQW9CLFFBQXBCLENBQTZCLENBQTdCLENBQTdCO0FBQUEsU0FBZCxDQUFQO0FBQ0gsT0FGRCxNQUVNLElBQUcsRUFBRSxRQUFGLEtBQWUsUUFBbEIsRUFBMkI7QUFDN0IsZUFBTyxFQUFFLE1BQUYsQ0FBUyxLQUFULENBQWUsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLElBQXpCLENBQWYsQ0FBUDtBQUNILE9BRkssTUFFRDtBQUNELGVBQU8sS0FBUDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7b0NBQ2dCLFksRUFBYyxTLEVBQVc7QUFDckMsVUFBSTtBQUNGLGVBQU8sVUFBVSxJQUFWLENBQWUsS0FBSyxpQkFBcEIsRUFBdUMsWUFBdkMsQ0FBUCxDQURFLENBQytEO0FBQ2xFLE9BRkQsQ0FFRSxPQUFPLENBQVAsRUFBUztBQUNULGFBQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixTQUFyQjtBQUNEO0FBQ0o7OztpQ0FFWSxDLEVBQUcsUyxFQUFVO0FBQ3hCLFVBQUksUUFDRixhQUFhLEtBQWIsSUFBdUIsT0FBTyxFQUFFLFNBQUYsQ0FBWSxJQUFuQixLQUE0QixRQUE1QixJQUF3QyxFQUFFLFNBQUYsQ0FBWSxJQUFaLENBQWlCLEtBQWpCLENBQXVCLFdBQXZCLENBQS9ELEdBQXVHO0FBQ3JHO0FBQ0UsY0FBSyxpQkFEUDtBQUVFLGNBQU87QUFDTCxtQkFBUyxVQUFVLE9BRGQ7QUFFTCxnQkFBTSxVQUFVLElBRlg7QUFHTCxrQkFBUSxVQUFVLE1BSGI7QUFJTCxrQkFBUSxFQUFFO0FBSkwsU0FGVDtBQVFFLGNBQU87QUFSVCxPQURGLEdBV0csRUFBRSxJQUFGLEdBQ0MsQ0FERCxHQUVDO0FBQ0UsY0FBSyxpQkFEUDtBQUVFLGNBQUssQ0FGUDtBQUdFLGNBQU87QUFIVCxPQWROO0FBb0JBLFdBQUssbUJBQUwsQ0FBeUIsSUFBekIsQ0FBOEIsS0FBOUI7QUFDQSxXQUFLLElBQUwsQ0FBVSxTQUFWLEVBQXFCLEtBQXJCO0FBQ0Q7OzsyQkFFSztBQUNKLFVBQUcsVUFBSCxFQUFjO0FBQ1osWUFBSSxPQUFPLE1BQU0sSUFBTixDQUFXLFNBQVgsQ0FBWDtBQUNBLGFBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsR0FBbEIsQ0FDSyxLQUFLLENBQUwsQ0FETCxVQUVJLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxHQUFkLENBQWtCLFVBQVMsR0FBVCxFQUFhO0FBQzdCLGlCQUFPLFFBQVEsSUFBUixHQUFlLE1BQWYsR0FDSCxRQUFRLFNBQVIsR0FBb0IsV0FBcEIsR0FDRSxPQUFPLEdBQVAsS0FBZSxRQUFmLEdBQTBCLEdBQTFCLEdBQ0UsSUFBSSxRQUFKLE9BQW1CLGlCQUFuQixHQUF1QyxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQXZDLEdBQTJELElBQUksUUFBSixFQUhuRTtBQUtELFNBTkQsRUFNRyxJQU5ILENBTVEsSUFOUixDQUZKO0FBV0Q7QUFDRjs7QUFFRDs7OztBQUlBOzs7Ozs7QUFNQTs7Ozs7O0FBTUE7Ozs7Ozs7O0FBUUE7Ozs7OztBQU1BOzs7OztBQUtBOzs7OztBQUtBOzs7OztBQUtBOzs7OztBQUtBOzs7Ozs7QUFNQTs7Ozs7QUFNQTs7Ozs7Ozs7Ozs7OztxQ0FVaUIsUSxFQUFTO0FBQ3RCLHNCQUFnQixNQUFoQixDQUF1QixPQUF2QixDQUErQixVQUFTLEtBQVQsRUFBZTtBQUM1QyxZQUFHLFNBQVMsS0FBVCxDQUFILEVBQW9CLEtBQUssRUFBTCxDQUFRLEtBQVIsRUFBYyxTQUFTLEtBQVQsQ0FBZDtBQUNyQixPQUZELEVBRUcsSUFGSDtBQUdIOztBQUVEOzs7Ozs7Ozt1Q0FLbUIsUSxFQUFTO0FBQ3hCLHNCQUFnQixNQUFoQixDQUF1QixPQUF2QixDQUErQixVQUFTLEtBQVQsRUFBZTtBQUM1QyxZQUFHLFNBQVMsS0FBVCxDQUFILEVBQW9CLEtBQUssR0FBTCxDQUFTLEtBQVQsRUFBZSxTQUFTLEtBQVQsQ0FBZjtBQUNyQixPQUZELEVBRUcsSUFGSDtBQUdIOztBQUVEOzs7Ozs7Ozs2Q0FLd0I7QUFDcEIsVUFBSSxTQUFTLEVBQWI7QUFDQSxlQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBeUI7O0FBRXJCLFlBQUcsTUFBTSxXQUFULEVBQXFCO0FBQ2pCLGVBQUssSUFBSSxRQUFRLENBQVosRUFBZSxRQUFRLE1BQU0sV0FBTixDQUFrQixNQUE5QyxFQUFzRCxRQUFRLEtBQTlELEVBQXFFLE9BQXJFLEVBQThFO0FBQzFFLG1CQUFPLE1BQU0sV0FBTixDQUFrQixLQUFsQixFQUF5QixLQUFoQyxJQUF5QyxJQUF6QztBQUNIO0FBQ0o7O0FBRUQsWUFBRyxNQUFNLE1BQVQsRUFBaUI7QUFDYixlQUFLLElBQUksV0FBVyxDQUFmLEVBQWtCLFdBQVcsTUFBTSxNQUFOLENBQWEsTUFBL0MsRUFBdUQsV0FBVyxRQUFsRSxFQUE0RSxVQUE1RSxFQUF3RjtBQUNwRixzQkFBVSxNQUFNLE1BQU4sQ0FBYSxRQUFiLENBQVY7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsZ0JBQVUsS0FBSyxNQUFmOztBQUVBLGFBQU8sT0FBTyxJQUFQLENBQVksTUFBWixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBZ0JhO0FBQ1gsYUFBTyxDQUNMLEtBQUssZ0JBQUwsRUFESyxFQUVMLEtBQUssaUJBQUwsRUFGSyxFQUdMLEtBQUssZUFIQSxFQUlMLEtBQUssTUFBTCxDQUFZLG1CQUFaLEVBSkssRUFLTCxLQUFLLG1CQUFMLENBQXlCLEtBQXpCLEVBTEssQ0FBUDtBQU9EOzs7d0NBRWtCO0FBQ2pCLFVBQUksSUFBSSxFQUFSO0FBQ0EsYUFBTyxJQUFQLENBQVksS0FBSyxhQUFqQixFQUFnQyxPQUFoQyxDQUF3QyxVQUFTLEdBQVQsRUFBYTtBQUNuRCxVQUFFLEdBQUYsSUFBUyxLQUFLLGFBQUwsQ0FBbUIsR0FBbkIsRUFBd0IsR0FBeEIsQ0FBNEIsVUFBUyxLQUFULEVBQWU7QUFBQyxpQkFBTyxNQUFNLEVBQWI7QUFBZ0IsU0FBNUQsQ0FBVDtBQUNELE9BRkQsRUFFRSxJQUZGO0FBR0EsYUFBTyxDQUFQO0FBQ0Q7O0FBR0Q7Ozs7QUFJQTs7Ozs7OztBQU9BOzs7Ozs7O0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQW9CSSxZLEVBQWEsWSxFQUFjO0FBQzdCLFVBQUksWUFBSjtBQUNBLHFCQUFjLFlBQWQseUNBQWMsWUFBZDtBQUNFLGFBQUssUUFBTDtBQUNFLHlCQUFlLEVBQUMsTUFBTyxZQUFSLEVBQXNCLE1BQU8sWUFBN0IsRUFBZjtBQUNBO0FBQ0YsYUFBSyxRQUFMO0FBQ0UsY0FBRyxPQUFPLGFBQWEsSUFBcEIsS0FBNkIsUUFBaEMsRUFBeUM7QUFDdkMsMkJBQWUsWUFBZjtBQUNELFdBRkQsTUFFSztBQUNILGtCQUFNLElBQUksS0FBSixDQUFVLHdEQUFWLENBQU47QUFDRDtBQUNEO0FBQ0Y7QUFDRSxnQkFBTSxJQUFJLEtBQUosQ0FBVSxtREFBVixDQUFOO0FBWko7O0FBZUEsVUFBRyxLQUFLLFdBQVIsRUFBcUIsTUFBTSxJQUFJLEtBQUosQ0FBVSxtQ0FBVixDQUFOOztBQUVyQjtBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjs7QUFFQSxXQUFLLGVBQUwsQ0FBcUIsWUFBckI7O0FBRUEsV0FBSyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsYUFBTyxLQUFLLGdCQUFMLEVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQWtCUyxZLEVBQWMsRSxFQUFJO0FBQ3pCLFVBQUksaUJBQWlCLElBQWpCLEtBQTBCLFFBQU8sWUFBUCx5Q0FBTyxZQUFQLE9BQXdCLFFBQXhCLElBQW9DLENBQUMsWUFBckMsSUFBcUQsT0FBTyxhQUFhLElBQXBCLEtBQTZCLFFBQTVHLENBQUosRUFBMkg7QUFDekgsY0FBTSxJQUFJLEtBQUosQ0FBVSwyREFBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBSSxPQUFPLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QixhQUFLLEdBQUw7QUFDRDs7QUFFRCxXQUFLLG1CQUFMLENBQXlCLElBQXpCLENBQThCLENBQUMsWUFBRCxFQUFlLEVBQWYsQ0FBOUI7O0FBRUE7QUFDQSxlQUFTLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBdUI7QUFDckIsYUFBSyxvQkFBTCxDQUEwQixDQUExQixFQUE2QixVQUFTLEdBQVQsRUFBYyxNQUFkLEVBQXNCO0FBQ2pELFlBQUUsR0FBRixFQUFPLE1BQVA7O0FBRUEsY0FBRyxLQUFLLG1CQUFMLENBQXlCLE1BQTVCLEVBQW1DO0FBQ2pDLHFCQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQW9CLEtBQUssbUJBQUwsQ0FBeUIsS0FBekIsRUFBcEI7QUFDRCxXQUZELE1BRUs7QUFDSCxpQkFBSyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0Q7QUFDRixTQVI0QixDQVEzQixJQVIyQixDQVF0QixJQVJzQixDQUE3QjtBQVNEO0FBQ0QsVUFBRyxDQUFDLEtBQUssV0FBVCxFQUFxQjtBQUNuQixhQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxpQkFBUyxLQUFULENBQWUsSUFBZixFQUFvQixLQUFLLG1CQUFMLENBQXlCLEtBQXpCLEVBQXBCO0FBQ0Q7QUFDRjs7OztFQW5oQzJCLFk7O0FBc2hDOUIsZ0JBQWdCLE1BQWhCLEdBQXlCLENBQ3ZCLFNBRHVCLEVBRXZCLFFBRnVCLEVBR3ZCLGNBSHVCLEVBSXZCLGdCQUp1QixFQUt2QixTQUx1QixFQU12QixnQkFOdUIsRUFPdkIsY0FQdUIsRUFRdkIsa0JBUnVCLEVBU3ZCLGlCQVR1QixFQVV2QixrQkFWdUIsRUFXdkIsZ0JBWHVCLEVBWXZCLGNBWnVCLEVBYXZCLG1CQWJ1QixDQUF6Qjs7QUFnQkE7QUFDQSxnQkFBZ0IsZ0JBQWhCLEdBQW1DLENBQW5DO0FBQ0EsZ0JBQWdCLGlCQUFoQixHQUFvQyxZQUFVO0FBQzVDLFNBQU8sZ0JBQWdCLGdCQUFoQixFQUFQO0FBQ0QsQ0FGRDtBQUdBLGdCQUFnQixlQUFoQixHQUFrQyxJQUFJLEdBQUosRUFBbEM7O0FBRUE7Ozs7OztJQUtNLFU7OztBQUVKLHNCQUFZLG1CQUFaLEVBQWlDLElBQWpDLEVBQXNDO0FBQUE7O0FBRXBDLFdBQU8sUUFBUSxFQUFmO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLElBQXZCOztBQUhvQyxtSEFLOUIsbUJBTDhCLEVBS1QsSUFMUztBQU1yQzs7QUFFRDs7Ozs7dUNBQ21CLFksRUFBYywwQixFQUE0QjtBQUMzRCxVQUFJLEtBQUssSUFBTCxDQUFVLHlCQUFkLEVBQXlDO0FBQ3ZDLFlBQUksU0FBUyxLQUFLLGNBQUwsQ0FBb0IsSUFBcEIsRUFBYjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksbUJBQW1CLElBQUksS0FBSyxJQUFMLENBQVUsR0FBZCxFQUF2Qjs7QUFFQTtBQUNBO0FBQ0EsWUFBSSxhQUFhLEtBQUssY0FBTCxDQUFvQixJQUFwQixFQUFqQjtBQUNBLGFBQUssSUFBSSxNQUFNLENBQVYsRUFBYSxNQUFNLFdBQVcsTUFBbkMsRUFBMkMsTUFBTSxHQUFqRCxFQUFzRCxLQUF0RCxFQUE2RDtBQUMzRCxjQUFJLGFBQWEsV0FBVyxHQUFYLENBQWpCO0FBQ0EsMkJBQWlCLEdBQWpCLENBQXFCLFVBQXJCO0FBQ0EsY0FBSSxZQUFZLE1BQU0sWUFBTixDQUFtQixVQUFuQixDQUFoQjtBQUNBLGVBQUssSUFBSSxTQUFTLENBQWIsRUFBZ0IsU0FBUyxVQUFVLE1BQXhDLEVBQWdELFNBQVMsTUFBekQsRUFBaUUsUUFBakUsRUFBMkU7QUFDekUsNkJBQWlCLEdBQWpCLENBQXFCLFVBQVUsTUFBVixDQUFyQjtBQUNEO0FBQ0Y7O0FBRUQsaUJBQVMsaUJBQWlCLElBQWpCLEVBQVQ7QUFDRDs7QUFFRCxVQUFJLHFCQUFxQixLQUFLLElBQUwsQ0FBVSxrQkFBbkM7QUFDQSxVQUFJLHFCQUFxQixJQUFJLEtBQUssSUFBTCxDQUFVLEdBQWQsRUFBekI7O0FBRUEsVUFBSSxJQUFJLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixFQUErQixZQUEvQixDQUFSOztBQUVBLFdBQUssSUFBSSxXQUFXLENBQWYsRUFBa0IsV0FBVyxPQUFPLE1BQXpDLEVBQWlELFdBQVcsUUFBNUQsRUFBc0UsVUFBdEUsRUFBa0Y7QUFDaEYsWUFBSSxjQUFjLE9BQU8sUUFBUCxFQUFpQixXQUFuQztBQUNBLGFBQUssSUFBSSxRQUFRLENBQVosRUFBZSxNQUFNLFlBQVksTUFBdEMsRUFBOEMsUUFBUSxHQUF0RCxFQUEyRCxPQUEzRCxFQUFvRTtBQUNsRSxjQUFNLElBQUksWUFBWSxLQUFaLENBQVY7QUFDQSxjQUFHLG1CQUFtQixDQUFuQixFQUFzQixZQUF0QixFQUFvQyxDQUFwQyxFQUF1QywwQkFBdkMsQ0FBSCxFQUFzRTtBQUNwRSwrQkFBbUIsR0FBbkIsQ0FBdUIsQ0FBdkI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsVUFBSSw2QkFBNkIsS0FBSyxpQ0FBTCxDQUF1QyxrQkFBdkMsQ0FBakM7O0FBRUEsV0FBSyxJQUFMLENBQVUsNEJBQVYsRUFBd0MsMEJBQXhDOztBQUVBLGFBQU8sMEJBQVA7QUFDRDs7QUFFRDs7OztzREFDa0Msa0IsRUFBb0I7QUFDcEQsVUFBSSw2QkFBNkIsSUFBSSxLQUFLLElBQUwsQ0FBVSxHQUFkLEVBQWpDOztBQUVBLFVBQUksUUFBUSxLQUFLLDJCQUFMLENBQWlDLGtCQUFqQyxDQUFaO0FBQUEsVUFDSSx3QkFBd0IsTUFBTSxDQUFOLENBRDVCO0FBQUEsVUFFSSwrQkFBK0IsTUFBTSxDQUFOLENBRm5DOztBQUlBLGlDQUEyQixLQUEzQixDQUFpQyxxQkFBakM7O0FBRUEsV0FBSyxJQUFMLENBQVUsb0JBQVYsRUFBZ0Msa0JBQWhDO0FBQ0EsV0FBSyxJQUFMLENBQVUsdUJBQVYsRUFBbUMscUJBQW5DO0FBQ0EsV0FBSyxJQUFMLENBQVUsOEJBQVYsRUFBMEMsNEJBQTFDO0FBQ0EsV0FBSyxJQUFMLENBQVUsNEJBQVYsRUFBd0MsMEJBQXhDOztBQUVBLGFBQU8sQ0FBQyw2QkFBNkIsT0FBN0IsRUFBUixFQUFnRDtBQUM5Qyw2QkFBcUIsSUFBSSxLQUFLLElBQUwsQ0FBVSxHQUFkLENBQ2pCLDZCQUE2QixJQUE3QixHQUFvQyxHQUFwQyxDQUF3QyxVQUFTLENBQVQsRUFBVztBQUFDLGlCQUFPLEtBQUssSUFBTCxDQUFVLG9CQUFWLENBQStCLENBQS9CLENBQVA7QUFBMEMsU0FBOUYsRUFBK0YsSUFBL0YsQ0FEaUIsQ0FBckI7O0FBR0EsZ0JBQVEsS0FBSywyQkFBTCxDQUFpQyxrQkFBakMsQ0FBUjtBQUNBLGdDQUF3QixNQUFNLENBQU4sQ0FBeEI7QUFDQSx1Q0FBK0IsTUFBTSxDQUFOLENBQS9COztBQUVBLG1DQUEyQixLQUEzQixDQUFpQyxxQkFBakM7O0FBRUEsYUFBSyxJQUFMLENBQVUsb0JBQVYsRUFBZ0Msa0JBQWhDO0FBQ0EsYUFBSyxJQUFMLENBQVUsdUJBQVYsRUFBbUMscUJBQW5DO0FBQ0EsYUFBSyxJQUFMLENBQVUsOEJBQVYsRUFBMEMsNEJBQTFDO0FBQ0EsYUFBSyxJQUFMLENBQVUsNEJBQVYsRUFBd0MsMEJBQXhDO0FBRUQ7QUFDRCxhQUFPLDBCQUFQO0FBQ0Q7O0FBRUQ7Ozs7Z0RBQzRCLFcsRUFBYTtBQUN2QyxVQUFJLDZCQUE2QixJQUFJLEtBQUssSUFBTCxDQUFVLEdBQWQsRUFBakM7QUFDQSxVQUFJLCtCQUErQixJQUFJLEtBQUssSUFBTCxDQUFVLEdBQWQsRUFBbkM7QUFDQSxVQUFJLGlCQUFpQixZQUFZLElBQVosRUFBckI7O0FBRUEsV0FBSyxJQUFMLENBQVUsYUFBVixFQUF5QixXQUF6Qjs7QUFFQSxXQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxlQUFlLE1BQWxDLEVBQTBDLEdBQTFDLEVBQThDO0FBQzVDLGFBQUksSUFBSSxJQUFJLElBQUUsQ0FBZCxFQUFpQixJQUFJLGVBQWUsTUFBcEMsRUFBNEMsR0FBNUMsRUFBZ0Q7QUFDOUMsY0FBSSxLQUFLLGVBQWUsQ0FBZixDQUFUO0FBQ0EsY0FBSSxLQUFLLGVBQWUsQ0FBZixDQUFUO0FBQ0EsY0FBSSxLQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsRUFBb0IsRUFBcEIsQ0FBSixFQUE2QjtBQUMzQix1Q0FBMkIsR0FBM0IsQ0FBK0IsRUFBL0I7QUFDQSx1Q0FBMkIsR0FBM0IsQ0FBK0IsRUFBL0I7QUFDQSx5Q0FBNkIsR0FBN0IsQ0FBaUMsQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFqQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxVQUFJLHdCQUF3QixZQUFZLFVBQVosQ0FBdUIsMEJBQXZCLENBQTVCO0FBQ0EsYUFBTyxDQUFDLHFCQUFELEVBQXdCLDRCQUF4QixDQUFQO0FBQ0Q7OzsrQkFFVSxFLEVBQUksRSxFQUFJO0FBQ2pCLGFBQU8sQ0FBQyxLQUFLLGtCQUFMLENBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLENBQVI7QUFDRDs7QUFFRDs7Ozt1Q0FDbUIsRSxFQUFJLEUsRUFBSTs7QUFFekIsV0FBSyxJQUFMLENBQVUsbUJBQVYsRUFBK0IsR0FBRyxLQUFsQyxFQUF5QyxHQUFHLEtBQTVDOztBQUVBLFVBQUksWUFBSjtBQUNBLHFCQUFlLE1BQU0sY0FBTixDQUFxQixHQUFHLEtBQUgsSUFBWSxHQUFHLE1BQXBDLEVBQTRDLEdBQUcsS0FBSCxJQUFZLEdBQUcsTUFBM0QsQ0FBZjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxtQ0FBVixFQUErQyxZQUEvQzs7QUFFQSxhQUFPLFlBQVA7QUFDRDs7OztFQS9Ic0IsZTs7QUFrSXpCOzs7Ozs7OztJQU1NLGE7OztBQUVKLHlCQUFZLG1CQUFaLEVBQWlDLElBQWpDLEVBQXNDO0FBQUE7O0FBRXBDLFdBQU8sUUFBUSxFQUFmO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUhvQyx5SEFLOUIsbUJBTDhCLEVBS1QsSUFMUztBQU1yQzs7QUFFRDs7Ozs7dUNBQ21CLFksRUFBYywwQixFQUE0QjtBQUMzRCxVQUFJLHFCQUFxQixLQUFLLElBQUwsQ0FBVSxrQkFBbkM7QUFDQSxVQUFJLHFCQUFxQixJQUFJLEtBQUssSUFBTCxDQUFVLEdBQWQsRUFBekI7O0FBRUEsVUFBSSxJQUFJLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixFQUErQixZQUEvQixDQUFSOztBQUVBLFVBQUksZUFBZSxLQUFLLGNBQUwsQ0FBb0IsSUFBcEIsR0FBMkIsSUFBM0IsQ0FBZ0Msb0JBQWhDLENBQW5CO0FBTjJEO0FBQUE7QUFBQTs7QUFBQTtBQU8zRCwrQkFBaUIsWUFBakIsd0lBQThCO0FBQUEsY0FBdEIsS0FBc0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDbEMsZ0JBRGtDLEVBQzVCLHVCQUFhLENBQUMsS0FBRCxFQUFRLE1BQVIsQ0FBZSxNQUFNLFlBQU4sQ0FBbUIsS0FBbkIsQ0FBZixDQUFiLHdJQUF1RDtBQUFBLGtCQUEvQyxDQUErQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNyRCx1Q0FBYSxFQUFFLFdBQWYsd0lBQTJCO0FBQUEsc0JBQW5CLENBQW1COztBQUN6QixzQkFBRyxtQkFBbUIsQ0FBbkIsRUFBc0IsWUFBdEIsRUFBb0MsQ0FBcEMsRUFBdUMsMEJBQXZDLENBQUgsRUFBc0U7QUFDcEUsdUNBQW1CLEdBQW5CLENBQXVCLENBQXZCO0FBQ0EsMEJBQU0sSUFBTjtBQUNEO0FBQ0Y7QUFOb0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU90RDtBQVIyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUzdCO0FBaEIwRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWtCM0QsVUFBSSw2QkFBNkIsS0FBSyw0QkFBTCxDQUFrQyxrQkFBbEMsQ0FBakM7O0FBRUEsV0FBSyxJQUFMLENBQVUsNEJBQVYsRUFBd0MsMEJBQXhDOztBQUVBLGFBQU8sMEJBQVA7QUFDRDs7QUFFRDs7OztpREFDNkIsa0IsRUFBb0I7QUFBQTs7QUFDL0MsVUFBSSxzQkFBc0IsSUFBSSxLQUFLLElBQUwsQ0FBVSxHQUFkLEVBQTFCO0FBQ0E7QUFGK0M7QUFBQTtBQUFBOztBQUFBO0FBRy9DLCtCQUFlLG1CQUFtQixJQUFuQixFQUFmLHdJQUF5QztBQUFBLGNBQWhDLEVBQWdDOztBQUN2QyxjQUFJLGNBQWMsS0FBbEI7QUFDQSxjQUFJLHNCQUFzQixJQUFJLEdBQUosRUFBMUI7QUFGdUM7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxrQkFHOUIsRUFIOEI7O0FBSXJDO0FBQ0Esa0JBQUksWUFBWSxRQUFLLGVBQUwsQ0FBcUIsQ0FBQyxFQUFELENBQXJCLENBQWhCO0FBQ0Esa0JBQUksWUFBWSxRQUFLLGVBQUwsQ0FBcUIsQ0FBQyxFQUFELENBQXJCLENBQWhCO0FBQ0Esa0JBQUksa0JBQWtCLDZCQUFJLFNBQUosR0FBZSxJQUFmLENBQXFCO0FBQUEsdUJBQUssVUFBVSxHQUFWLENBQWMsQ0FBZCxDQUFMO0FBQUEsZUFBckIsS0FBaUQsNkJBQUksU0FBSixHQUFlLElBQWYsQ0FBcUI7QUFBQSx1QkFBSyxVQUFVLEdBQVYsQ0FBYyxDQUFkLENBQUw7QUFBQSxlQUFyQixDQUF2RTtBQUNBLHNCQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXNCLEdBQUcsTUFBSCxDQUFVLEVBQWhDLEVBQW1DLDZCQUFJLFNBQUosR0FBZSxHQUFmLENBQW9CO0FBQUEsdUJBQUssRUFBRSxFQUFQO0FBQUEsZUFBcEIsQ0FBbkM7QUFDRSxzQkFBSyxJQUFMLENBQVUsV0FBVixFQUFzQixHQUFHLE1BQUgsQ0FBVSxFQUFoQyxFQUFtQyw2QkFBSSxTQUFKLEdBQWUsR0FBZixDQUFvQjtBQUFBLHVCQUFLLEVBQUUsRUFBUDtBQUFBLGVBQXBCLENBQW5DO0FBQ0Esc0JBQUssSUFBTCxDQUFVLGlCQUFWLEVBQTRCLGVBQTVCO0FBQ0Esa0JBQUcsZUFBSCxFQUFtQjtBQUNqQixvQkFBRyxHQUFHLE1BQUgsQ0FBVSxXQUFWLENBQXNCLE9BQXRCLENBQThCLEdBQUcsTUFBakMsSUFBMkMsQ0FBQyxDQUEvQyxFQUFpRDtBQUFLO0FBQ3BELHNDQUFvQixHQUFwQixDQUF3QixFQUF4QjtBQUNELGlCQUZELE1BRUs7QUFDSCxnQ0FBYyxJQUFkO0FBQ0E7QUFDRDtBQUNGO0FBbEJrQzs7QUFHdkMsbUNBQWUsb0JBQW9CLElBQXBCLEVBQWYsd0lBQTBDO0FBQUE7O0FBQUEscUNBYWxDO0FBR1A7QUFuQnNDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBb0J2QyxjQUFHLENBQUMsV0FBSixFQUFnQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNkLHFDQUFjLG1CQUFkLHdJQUFrQztBQUFBLG9CQUExQixFQUEwQjs7QUFDaEMsb0NBQW9CLE1BQXBCLENBQTJCLEVBQTNCO0FBQ0Q7QUFIYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUlkLGdDQUFvQixHQUFwQixDQUF3QixFQUF4QjtBQUNEO0FBQ0Y7QUE3QjhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBK0IvQyxhQUFPLG1CQUFQO0FBQ0Q7Ozs7RUFyRXlCLGU7O0FBd0U1Qjs7QUFFQSxTQUFTLEdBQVQsR0FBZSxDQUFFOztJQUdYLDJCO0FBQ0osdUNBQVksV0FBWixFQUF3QjtBQUFBOztBQUN0QixTQUFLLFlBQUwsR0FBb0IsV0FBcEI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsSUFBSSxHQUFKLEVBQWpCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQUssZ0JBQUwsR0FBd0Isb05BQXhCOztBQUVBLFNBQUsscUJBQUwsR0FBNkIsVUFBN0I7QUFDQSxTQUFLLG9CQUFMLEdBQTRCLGdCQUE1QjtBQUNEOzs7OzBCQUdLLEssRUFBTTtBQUNWLFdBQUssMkJBQUwsQ0FBaUMsS0FBakMsRUFBd0MsSUFBeEM7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsbUJBQWxCLENBQXNDLElBQXRDLENBQTJDLEtBQTNDO0FBQ0Q7Ozt3Q0FFbUIsUyxFQUFVO0FBQzVCLGFBQU8sQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsU0FBdkIsSUFBb0MsNEJBQTRCLFNBQWpFLEVBQTRFLEtBQTVFLENBQWtGLFNBQWxGLENBQVA7QUFDRDs7OzJCQUVNLFMsRUFBVTtBQUFBOztBQUNmO0FBQ0EsV0FBSyxVQUFMLENBQWdCLFVBQVUsRUFBMUIsSUFBZ0MsSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUMvRCxTQUFDLFFBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixRQUF2QixJQUFtQyw0QkFBNEIsUUFBaEUsRUFBMEUsVUFBVSxJQUFwRixFQUEwRixRQUFLLFlBQS9GLEVBQTZHLFNBQTdHLEVBQXdILFVBQUMsR0FBRCxFQUFNLE9BQU4sRUFBa0I7QUFDeEksY0FBRyxHQUFILEVBQVEsT0FBTyxPQUFPLEdBQVAsQ0FBUDs7QUFFUixrQkFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLDZCQUF2QixFQUFzRCxPQUF0RDtBQUNBLGtCQUFRLE9BQVI7QUFDRCxTQUxEO0FBTUQsT0FQK0IsQ0FBaEM7QUFRRDs7O2lDQUVZLFEsRUFBUztBQUFBOztBQUNwQjtBQUNBLFVBQUksaUJBQWlCLEtBQUssVUFBTCxDQUFnQixRQUFoQixDQUFyQjtBQUNBLFdBQUssWUFBTCxDQUFrQixJQUFsQix1Q0FBMkQsUUFBM0Q7QUFDQSxVQUFHLGNBQUgsRUFBa0I7QUFDaEIsYUFBSyxZQUFMLENBQWtCLElBQWxCO0FBQ0EsdUJBQWUsSUFBZixDQUNHLFVBQUMsT0FBRCxFQUFhO0FBQ1osa0JBQUssWUFBTCxDQUFrQixJQUFsQix1QkFBMkMsUUFBM0M7QUFDQSxrQkFBUSxNQUFSO0FBQ0E7QUFDQSxpQkFBTyxRQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBUDtBQUNELFNBTkgsRUFPSSxVQUFDLEdBQUQsRUFBUztBQUNUO0FBQ0QsU0FUSDtBQVVEO0FBQ0Y7OztnREFFMkIsSyxFQUFNLFUsRUFBVztBQUMzQyxVQUFHLENBQUMsVUFBSixFQUFlO0FBQ2IsY0FBTSxNQUFOLEdBQWUsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLEVBQXZCLENBQTBCLGFBQTFCLENBQXdDLEtBQXhDLENBQThDLFFBQTdELENBRGEsQ0FDOEQ7QUFDM0UsY0FBTSxVQUFOLEdBQW1CLE1BQU0sSUFBTixJQUFjLHNCQUFqQztBQUNEO0FBQ0QsVUFBRyxPQUFPLE1BQU0sSUFBYixLQUFzQixXQUF6QixFQUFxQztBQUNuQyxjQUFNLElBQU4sR0FBYSxhQUFhLFVBQWIsR0FBMEIsVUFBdkM7QUFDRDtBQUNELE9BQ0UsTUFERixFQUVFLFFBRkYsRUFHRSxVQUhGLEVBSUUsTUFKRixFQUtFLFFBTEYsRUFNRSxZQU5GLEVBT0UsT0FQRixDQU9VLGdCQUFRO0FBQ2hCLFlBQUcsT0FBTyxNQUFNLElBQU4sQ0FBUCxLQUF1QixXQUExQixFQUFzQztBQUNwQyxnQkFBTSxJQUFOLElBQWMsU0FBZDtBQUNEO0FBQ0YsT0FYRDtBQVlEOzs7eUJBRUksSyxFQUFPLE8sRUFBUTtBQUNsQixXQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsWUFBdkIsRUFBcUMsS0FBckMsRUFBNEMsT0FBNUM7QUFDQSxnQkFBVSxXQUFXLEVBQXJCO0FBQ0EsVUFBSSxXQUFXLFFBQVEsSUFBUixJQUFnQixzQkFBL0I7QUFDQTtBQUNBLGVBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixPQUE3QixFQUFzQyxVQUF0QyxFQUFpRDtBQUMvQyxZQUFHLE1BQU0sTUFBVCxFQUFnQjtBQUNkLGNBQUksbUJBQW1CLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsTUFBTSxNQUFqQyxDQUF2QjtBQUNBLGNBQUcsQ0FBQyxnQkFBSixFQUFxQjtBQUNuQixrQkFBTSxFQUFFLE1BQU8saUJBQVQsRUFBNEIsTUFBTSx5QkFBbEMsRUFBNkQsUUFBUSxNQUFNLE1BQTNFLEVBQW1GLE1BQU8sVUFBMUYsRUFBTjtBQUNEO0FBQ0Y7QUFDRCxZQUFJLGFBQWEsc0JBQWpCLEVBQXlDO0FBQUc7QUFDMUMsZ0JBQU0sRUFBRSxNQUFPLGlCQUFULEVBQTRCLE1BQU0sa0NBQWxDLEVBQXNFLFFBQVEsTUFBTSxNQUFwRixFQUE0RixNQUFPLFVBQW5HLEVBQU47QUFDRDs7QUFFRCxtQkFBVyxJQUFYLENBQWdCLElBQWhCLEVBQXNCLEtBQXRCLEVBQTZCLE9BQTdCO0FBQ0Q7O0FBRUQsZUFBUyxpQkFBVCxDQUE0QixLQUE1QixFQUFtQyxPQUFuQyxFQUE0QztBQUFBOztBQUUxQyxZQUFJLE9BQU8sVUFBUCxLQUFzQixXQUExQixFQUF3QyxNQUFNLElBQUksS0FBSixDQUFVLCtHQUFWLENBQU47O0FBRXhDLFlBQUksS0FBSjtBQUNBLFlBQUcsTUFBTSxNQUFOLEtBQWlCLFlBQXBCLEVBQWlDO0FBQy9CLGVBQUssS0FBTCxDQUFXLEtBQVg7QUFDRCxTQUZELE1BRUs7QUFDSCxlQUFLLDJCQUFMLENBQWlDLEtBQWpDLEVBQXdDLEtBQXhDO0FBQ0EsZ0JBQU0sVUFBTixHQUFtQixzQkFBbkIsQ0FGRyxDQUU2QztBQUNBO0FBQ2hELGNBQUcsQ0FBQyxNQUFNLE1BQVYsRUFBaUI7QUFDZixtQkFBTyxJQUFQLENBQVksSUFBWixFQUFrQixLQUFLLFlBQXZCO0FBQ0QsV0FGRCxNQUVNLElBQUcsTUFBTSxNQUFOLEtBQWlCLFVBQXBCLEVBQStCO0FBQ25DLGdCQUFHLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixhQUExQixFQUF3QztBQUN0QyxvQkFBTSxRQUFOLEdBQWlCLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixRQUF4QztBQUNBLHFCQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixhQUF6QztBQUNELGFBSEQsTUFHSztBQUNILG9CQUFNLEVBQUUsTUFBTyxxQkFBVCxFQUFnQyxNQUFNLDhCQUF0QyxFQUFzRSxRQUFRLE1BQU0sTUFBcEYsRUFBNEYsTUFBTyxVQUFuRyxFQUFOO0FBQ0Q7QUFDRixXQVBLLE1BT0MsSUFBRyxRQUFRLE1BQU0sTUFBTixDQUFhLEtBQWIsQ0FBbUIsS0FBSyxvQkFBeEIsQ0FBWCxFQUF5RDtBQUM5RCxnQkFBSSxrQkFBa0IsTUFBTSxDQUFOLENBQXRCO0FBQ0EsZ0JBQUksVUFBVSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsZUFBdkIsQ0FBdUMsR0FBdkMsQ0FBMkMsZUFBM0MsQ0FBZDtBQUNBLGdCQUFHLE9BQUgsRUFBVztBQUNULHFCQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWlCLE9BQWpCO0FBQ0QsYUFGRCxNQUVNO0FBQ0osb0JBQU0sRUFBQyxNQUFPLHFCQUFSLEVBQStCLFFBQVEsTUFBTSxNQUE3QyxFQUFxRCxNQUFPLFVBQTVELEVBQU47QUFDRDtBQUNGLFdBUk0sTUFRRCxJQUFHLFFBQVEsTUFBTSxNQUFOLENBQWEsS0FBYixDQUFtQixLQUFLLHFCQUF4QixDQUFYLEVBQTBEO0FBQzlEO0FBQ0EsZ0JBQUksV0FBVyxNQUFNLENBQU4sQ0FBZjtBQUNBLGlCQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsRUFBMEIsSUFBMUIsQ0FBZ0MsVUFBQyxPQUFELEVBQWE7QUFDM0MscUJBQU8sSUFBUCxVQUFpQixPQUFqQjtBQUNELGFBRkQ7QUFHRCxXQU5LLE1BTUM7QUFDTCxrQkFBTSxJQUFJLEtBQUosQ0FBVSwyQkFBVixDQUFOLENBREssQ0FDeUM7QUFDL0M7QUFDRjs7QUFFRCxpQkFBUyxNQUFULENBQWdCLE9BQWhCLEVBQXdCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGNBQUksZ0JBQWdCLFdBQVcsWUFBVTtBQUN2QyxnQkFBSSxNQUFNLE1BQVYsRUFBa0IsT0FBTyxLQUFLLFdBQUwsQ0FBaUIsTUFBTSxNQUF2QixDQUFQO0FBQ2xCLGlCQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLGNBQXRCO0FBQ0EsZ0JBQUcsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLE1BQTFCLEVBQWlDO0FBQy9CLG1CQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsTUFBdkIsQ0FBOEIsT0FBOUIsRUFBdUMsS0FBdkM7QUFDRCxhQUZELE1BRUs7QUFDSCxzQkFBUSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsU0FBdkIsR0FBbUMsVUFBbkMsR0FBZ0QsS0FBeEQsRUFBK0QsS0FBL0Q7QUFDRDtBQUNGLFdBUjhCLENBUTdCLElBUjZCLENBUXhCLElBUndCLENBQVgsRUFRTixRQUFRLEtBQVIsSUFBaUIsQ0FSWCxDQUFwQjs7QUFVQSxjQUFJLGlCQUFpQjtBQUNuQix5QkFBYyxPQURLO0FBRW5CLDJCQUFnQjtBQUZHLFdBQXJCO0FBSUEsY0FBSSxNQUFNLE1BQVYsRUFBa0IsS0FBSyxXQUFMLENBQWlCLE1BQU0sTUFBdkIsSUFBaUMsYUFBakM7QUFDbEIsZUFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixjQUFuQjtBQUNEO0FBQ0Y7O0FBRUQsZUFBUyxPQUFULEdBQWtCO0FBQ2hCLGFBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixNQUFNLElBQTdCLEVBQWtDLE1BQU0sSUFBeEM7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsVUFBSSxNQUFKO0FBQ0EsVUFBRyxNQUFNLElBQU4sS0FBZSwwQ0FBbEIsRUFBNkQ7QUFDM0QsaUJBQVMsT0FBVDtBQUNELE9BRkQsTUFFTSxJQUFHLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixVQUExQixFQUFxQztBQUN6QyxpQkFBUyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsVUFBaEM7QUFDRCxPQUZLLE1BRUQ7QUFDSCxpQkFBUyxpQkFBVDtBQUNEOztBQUVELGdCQUFRLFdBQVcsRUFBbkI7O0FBRUEsV0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLGVBQXZCLEVBQXdDLE1BQU0sSUFBOUMsRUFBb0QsY0FBcEQsRUFBb0UsTUFBTSxJQUExRSxFQUFnRixhQUFoRixFQUErRixRQUFRLEtBQXZHOztBQUVBLG1CQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0IsS0FBeEIsRUFBK0IsT0FBL0IsRUFBd0MsTUFBeEM7QUFDRDs7OzJCQUVNLE0sRUFBTztBQUNaLFVBQUcsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLFlBQTFCLEVBQXdDO0FBQ3RDLGVBQU8sS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLFlBQXZCLENBQW9DLEtBQXBDLENBQTBDLElBQTFDLEVBQWdELENBQUMsTUFBRCxDQUFoRCxDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxPQUFPLFlBQVAsS0FBd0IsV0FBNUIsRUFBMEMsTUFBTSxJQUFJLEtBQUosQ0FBVSxpSEFBVixDQUFOOztBQUUxQyxVQUFJLFVBQVUsS0FBSyxXQUFuQixFQUFnQztBQUM5QixhQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsYUFBdkIsRUFBc0MsTUFBdEMsRUFBOEMsbUJBQTlDLEVBQW1FLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFuRTtBQUNBLHFCQUFhLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFiO0FBQ0Q7QUFDRjs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLE9BQU8sSUFBSSxZQUFKLEVBQVAsRUFBd0I7QUFDckMsbUJBQWlCLGVBRG9CO0FBRXJDLGNBQVksVUFGeUI7QUFHckMsaUJBQWUsYUFIc0I7QUFJckMsWUFBVyxRQUowQjtBQUtyQyxlQUFjLFVBQVUsV0FMYTtBQU1yQyxtQkFBa0IsZUFObUI7QUFPckMsK0JBQThCO0FBUE8sQ0FBeEIsQ0FBakI7Ozs7O0FDbmxEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogYmVnaW4gQXJyYXlTZXQgKi9cblxuLyoqIEBjb25zdHJ1Y3RvciAqL1xuZnVuY3Rpb24gQXJyYXlTZXQobCkge1xuICAgIGwgPSBsIHx8IFtdO1xuICAgIHRoaXMubyA9IG5ldyBTZXQobCk7ICAgICAgICBcbn1cblxuQXJyYXlTZXQucHJvdG90eXBlID0ge1xuXG4gICAgYWRkIDogZnVuY3Rpb24oeCkge1xuICAgICAgICB0aGlzLm8uYWRkKHgpO1xuICAgIH0sXG5cbiAgICByZW1vdmUgOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm8uZGVsZXRlKHgpO1xuICAgIH0sXG5cbiAgICB1bmlvbiA6IGZ1bmN0aW9uKGwpIHtcbiAgICAgICAgZm9yICh2YXIgdiBvZiBsLm8pIHtcbiAgICAgICAgICAgIHRoaXMuby5hZGQodik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGRpZmZlcmVuY2UgOiBmdW5jdGlvbihsKSB7XG4gICAgICAgIGZvciAodmFyIHYgb2YgbC5vKSB7XG4gICAgICAgICAgICB0aGlzLm8uZGVsZXRlKHYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBjb250YWlucyA6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5oYXMoeCk7XG4gICAgfSxcblxuICAgIGl0ZXIgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5vKTtcbiAgICB9LFxuXG4gICAgaXNFbXB0eSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuby5zaXplO1xuICAgIH0sXG5cbiAgICBzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5zaXplO1xuICAgIH0sXG5cbiAgICBlcXVhbHMgOiBmdW5jdGlvbihzMikge1xuICAgICAgICBpZiAodGhpcy5vLnNpemUgIT09IHMyLnNpemUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgdiBvZiB0aGlzLm8pIHtcbiAgICAgICAgICAgIGlmICghczIuY29udGFpbnModikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuby5zaXplID09PSAwID8gJzxlbXB0eT4nIDogQXJyYXkuZnJvbSh0aGlzLm8pLmpvaW4oJyxcXG4nKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5U2V0O1xuIiwidmFyIFNUQVRFX1RZUEVTID0ge1xuICAgIEJBU0lDOiAwLFxuICAgIENPTVBPU0lURTogMSxcbiAgICBQQVJBTExFTDogMixcbiAgICBISVNUT1JZOiAzLFxuICAgIElOSVRJQUw6IDQsXG4gICAgRklOQUw6IDVcbn07XG5cbmNvbnN0IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUgPSAnaHR0cDovL3d3dy53My5vcmcvVFIvc2N4bWwvI1NDWE1MRXZlbnRQcm9jZXNzb3InXG5jb25zdCBIVFRQX0lPUFJPQ0VTU09SX1RZUEUgPSAnaHR0cDovL3d3dy53My5vcmcvVFIvc2N4bWwvI0Jhc2ljSFRUUEV2ZW50UHJvY2Vzc29yJ1xuY29uc3QgUlhfVFJBSUxJTkdfV0lMRENBUkQgPSAvXFwuXFwqJC87XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTVEFURV9UWVBFUyA6IFNUQVRFX1RZUEVTLFxuICBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFICA6IFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUsXG4gIEhUVFBfSU9QUk9DRVNTT1JfVFlQRSAgOiBIVFRQX0lPUFJPQ0VTU09SX1RZUEUsIFxuICBSWF9UUkFJTElOR19XSUxEQ0FSRCAgOiBSWF9UUkFJTElOR19XSUxEQ0FSRCBcbn07XG4iLCJjb25zdCBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpLFxuICAgICAgU1RBVEVfVFlQRVMgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMsXG4gICAgICBSWF9UUkFJTElOR19XSUxEQ0FSRCA9IGNvbnN0YW50cy5SWF9UUkFJTElOR19XSUxEQ0FSRDtcblxuY29uc3QgcHJpbnRUcmFjZSA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXh0ZW5kIDogZXh0ZW5kLFxuICB0cmFuc2l0aW9uV2l0aFRhcmdldHMgOiB0cmFuc2l0aW9uV2l0aFRhcmdldHMsXG4gIHRyYW5zaXRpb25Db21wYXJhdG9yIDogdHJhbnNpdGlvbkNvbXBhcmF0b3IsXG4gIGluaXRpYWxpemVNb2RlbCA6IGluaXRpYWxpemVNb2RlbCxcbiAgaXNFdmVudFByZWZpeE1hdGNoIDogaXNFdmVudFByZWZpeE1hdGNoLFxuICBpc1RyYW5zaXRpb25NYXRjaCA6IGlzVHJhbnNpdGlvbk1hdGNoLFxuICBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvciA6IHNjeG1sUHJlZml4VHJhbnNpdGlvblNlbGVjdG9yLFxuICBldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3IgOiBldmVudGxlc3NUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA6IGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgc29ydEluRW50cnlPcmRlciA6IHNvcnRJbkVudHJ5T3JkZXIsXG4gIGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkgOiBnZXRTdGF0ZVdpdGhIaWdoZXJTb3VyY2VDaGlsZFByaW9yaXR5LFxuICBpbml0aWFsaXplTW9kZWxHZW5lcmF0b3JGbiA6IGluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuLFxuICBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uIDogZGVzZXJpYWxpemVTZXJpYWxpemVkQ29uZmlndXJhdGlvbixcbiAgZGVzZXJpYWxpemVIaXN0b3J5IDogZGVzZXJpYWxpemVIaXN0b3J5XG59O1xuXG5mdW5jdGlvbiBleHRlbmQgKHRvLCBmcm9tKXtcbiAgT2JqZWN0LmtleXMoZnJvbSkuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICB0b1trXSA9IGZyb21ba107IFxuICB9KTtcbiAgcmV0dXJuIHRvO1xufTtcblxuZnVuY3Rpb24gdHJhbnNpdGlvbldpdGhUYXJnZXRzKHQpe1xuICAgIHJldHVybiB0LnRhcmdldHM7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25Db21wYXJhdG9yKHQxLCB0Mikge1xuICAgIHJldHVybiB0MS5kb2N1bWVudE9yZGVyIC0gdDIuZG9jdW1lbnRPcmRlcjtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZU1vZGVsKHJvb3RTdGF0ZSwgb3B0cyl7XG4gICAgdmFyIHRyYW5zaXRpb25zID0gW10sIGlkVG9TdGF0ZU1hcCA9IG5ldyBNYXAoKSwgZG9jdW1lbnRPcmRlciA9IDA7XG5cblxuICAgIC8vVE9ETzogbmVlZCB0byBhZGQgZmFrZSBpZHMgdG8gYW55b25lIHRoYXQgZG9lc24ndCBoYXZlIHRoZW1cbiAgICAvL0ZJWE1FOiBtYWtlIHRoaXMgc2FmZXIgLSBicmVhayBpbnRvIG11bHRpcGxlIHBhc3Nlc1xuICAgIHZhciBpZENvdW50ID0ge307XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUlkKHR5cGUpe1xuICAgICAgICBpZihpZENvdW50W3R5cGVdID09PSB1bmRlZmluZWQpIGlkQ291bnRbdHlwZV0gPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICB2YXIgY291bnQgPSBpZENvdW50W3R5cGVdKys7XG4gICAgICAgICAgdmFyIGlkID0gJyRnZW5lcmF0ZWQtJyArIHR5cGUgKyAnLScgKyBjb3VudDsgXG4gICAgICAgIH0gd2hpbGUgKGlkVG9TdGF0ZU1hcC5oYXMoaWQpKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyYXBJbkZha2VSb290U3RhdGUoc3RhdGUpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGRlc2VyaWFsaXplRGF0YW1vZGVsIDogc3RhdGUuJGRlc2VyaWFsaXplRGF0YW1vZGVsIHx8IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgICAgICRzZXJpYWxpemVEYXRhbW9kZWwgOiBzdGF0ZS4kc2VyaWFsaXplRGF0YW1vZGVsIHx8IGZ1bmN0aW9uKCl7IHJldHVybiBudWxsO30sXG4gICAgICAgICAgICAkaWRUb1N0YXRlTWFwIDogaWRUb1N0YXRlTWFwLCAgIC8va2VlcCB0aGlzIGZvciBoYW5keSBkZXNlcmlhbGl6YXRpb24gb2Ygc2VyaWFsaXplZCBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICBkb2NVcmwgOiBzdGF0ZS5kb2NVcmwsXG4gICAgICAgICAgICBuYW1lIDogc3RhdGUubmFtZSxcbiAgICAgICAgICAgIHN0YXRlcyA6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICR0eXBlIDogJ2luaXRpYWwnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucyA6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgOiBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdGVcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGVzV2l0aEluaXRpYWxBdHRyaWJ1dGVzID0gW107XG5cbiAgICAvKipcbiAgICAgIEB0aGlzIHtTQ1RyYW5zaXRpb259XG4gICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc2l0aW9uVG9TdHJpbmcoc291cmNlU3RhdGUpe1xuICAgICAgcmV0dXJuIGAke3NvdXJjZVN0YXRlfSAtLSAke3RoaXMuZXZlbnRzID8gJygnICsgdGhpcy5ldmVudHMuam9pbignLCcpICsgJyknIDogbnVsbH0ke3RoaXMuY29uZCA/ICdbJyArIHRoaXMuY29uZC5uYW1lICsgJ10nIDogJyd9IC0tPiAke3RoaXMudGFyZ2V0cyA/IHRoaXMudGFyZ2V0cy5qb2luKCcsJykgOiBudWxsfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICBAdGhpcyB7U0NTdGF0ZX1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIHN0YXRlVG9TdHJpbmcoKXtcbiAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvcHVsYXRlU3RhdGVJZE1hcChzdGF0ZSl7XG4gICAgICAvL3BvcHVsYXRlIHN0YXRlIGlkIG1hcFxuICAgICAgaWYoc3RhdGUuaWQpe1xuICAgICAgICAgIGlkVG9TdGF0ZU1hcC5zZXQoc3RhdGUuaWQsIHN0YXRlKTtcbiAgICAgIH1cblxuICAgICAgaWYoc3RhdGUuc3RhdGVzKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlLnN0YXRlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICBwb3B1bGF0ZVN0YXRlSWRNYXAoc3RhdGUuc3RhdGVzW2pdKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhdmVyc2UoYW5jZXN0b3JzLHN0YXRlKXtcblxuICAgICAgICBpZihwcmludFRyYWNlKSBzdGF0ZS50b1N0cmluZyA9IHN0YXRlVG9TdHJpbmc7XG5cbiAgICAgICAgLy9hZGQgdG8gZ2xvYmFsIHRyYW5zaXRpb24gYW5kIHN0YXRlIGlkIGNhY2hlc1xuICAgICAgICBpZihzdGF0ZS50cmFuc2l0aW9ucykgdHJhbnNpdGlvbnMucHVzaC5hcHBseSh0cmFuc2l0aW9ucyxzdGF0ZS50cmFuc2l0aW9ucyk7XG5cbiAgICAgICAgLy9jcmVhdGUgYSBkZWZhdWx0IHR5cGUsIGp1c3QgdG8gbm9ybWFsaXplIHRoaW5nc1xuICAgICAgICAvL3RoaXMgd2F5IHdlIGNhbiBjaGVjayBmb3IgdW5zdXBwb3J0ZWQgdHlwZXMgYmVsb3dcbiAgICAgICAgc3RhdGUuJHR5cGUgPSBzdGF0ZS4kdHlwZSB8fCAnc3RhdGUnO1xuXG4gICAgICAgIC8vYWRkIGFuY2VzdG9ycyBhbmQgZGVwdGggcHJvcGVydGllc1xuICAgICAgICBzdGF0ZS5hbmNlc3RvcnMgPSBhbmNlc3RvcnM7XG4gICAgICAgIHN0YXRlLmRlcHRoID0gYW5jZXN0b3JzLmxlbmd0aDtcbiAgICAgICAgc3RhdGUucGFyZW50ID0gYW5jZXN0b3JzWzBdO1xuICAgICAgICBzdGF0ZS5kb2N1bWVudE9yZGVyID0gZG9jdW1lbnRPcmRlcisrOyBcblxuICAgICAgICAvL2FkZCBzb21lIGluZm9ybWF0aW9uIHRvIHRyYW5zaXRpb25zXG4gICAgICAgIHN0YXRlLnRyYW5zaXRpb25zID0gc3RhdGUudHJhbnNpdGlvbnMgfHwgW107XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZS50cmFuc2l0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb24gPSBzdGF0ZS50cmFuc2l0aW9uc1tqXTtcbiAgICAgICAgICAgIHRyYW5zaXRpb24uZG9jdW1lbnRPcmRlciA9IGRvY3VtZW50T3JkZXIrKzsgXG4gICAgICAgICAgICB0cmFuc2l0aW9uLnNvdXJjZSA9IHN0YXRlO1xuICAgICAgICAgICAgaWYocHJpbnRUcmFjZSkgdHJhbnNpdGlvbi50b1N0cmluZyA9IHRyYW5zaXRpb25Ub1N0cmluZy5iaW5kKHRyYW5zaXRpb24sIHN0YXRlKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvL3JlY3Vyc2l2ZSBzdGVwXG4gICAgICAgIGlmKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgICAgdmFyIGFuY3MgPSBbc3RhdGVdLmNvbmNhdChhbmNlc3RvcnMpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlLnN0YXRlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIHRyYXZlcnNlKGFuY3MsIHN0YXRlLnN0YXRlc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL3NldHVwIGZhc3Qgc3RhdGUgdHlwZVxuICAgICAgICBzd2l0Y2goc3RhdGUuJHR5cGUpe1xuICAgICAgICAgICAgY2FzZSAncGFyYWxsZWwnOlxuICAgICAgICAgICAgICAgIHN0YXRlLnR5cGVFbnVtID0gU1RBVEVfVFlQRVMuUEFSQUxMRUw7XG4gICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2luaXRpYWwnIDogXG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5JTklUSUFMO1xuICAgICAgICAgICAgICAgIHN0YXRlLmlzQXRvbWljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2hpc3RvcnknIDpcbiAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9IFNUQVRFX1RZUEVTLkhJU1RPUlk7XG4gICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZmluYWwnIDogXG4gICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5GSU5BTDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5pc0F0b21pYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGF0ZScgOiBcbiAgICAgICAgICAgIGNhc2UgJ3NjeG1sJyA6XG4gICAgICAgICAgICAgICAgaWYoc3RhdGUuc3RhdGVzICYmIHN0YXRlLnN0YXRlcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9IFNUQVRFX1RZUEVTLkNPTVBPU0lURTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudHlwZUVudW0gPSBTVEFURV9UWVBFUy5CQVNJQztcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaXNBdG9taWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBzdGF0ZSB0eXBlOiAnICsgc3RhdGUuJHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kZXNjZW5kYW50cyBwcm9wZXJ0eSBvbiBzdGF0ZXMgd2lsbCBub3cgYmUgcG9wdWxhdGVkLiBhZGQgZGVzY2VuZGFudHMgdG8gdGhpcyBzdGF0ZVxuICAgICAgICBpZihzdGF0ZS5zdGF0ZXMpe1xuICAgICAgICAgICAgc3RhdGUuZGVzY2VuZGFudHMgPSBzdGF0ZS5zdGF0ZXMuY29uY2F0KHN0YXRlLnN0YXRlcy5tYXAoZnVuY3Rpb24ocyl7cmV0dXJuIHMuZGVzY2VuZGFudHM7fSkucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuY29uY2F0KGIpO30sW10pKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBzdGF0ZS5kZXNjZW5kYW50cyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluaXRpYWxDaGlsZHJlbjtcbiAgICAgICAgaWYoc3RhdGUudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLkNPTVBPU0lURSl7XG4gICAgICAgICAgICAvL3NldCB1cCBpbml0aWFsIHN0YXRlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkoc3RhdGUuaW5pdGlhbCkgfHwgdHlwZW9mIHN0YXRlLmluaXRpYWwgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgICAgICBzdGF0ZXNXaXRoSW5pdGlhbEF0dHJpYnV0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAvL3Rha2UgdGhlIGZpcnN0IGNoaWxkIHRoYXQgaGFzIGluaXRpYWwgdHlwZSwgb3IgZmlyc3QgY2hpbGRcbiAgICAgICAgICAgICAgICBpbml0aWFsQ2hpbGRyZW4gPSBzdGF0ZS5zdGF0ZXMuZmlsdGVyKGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLiR0eXBlID09PSAnaW5pdGlhbCc7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS5pbml0aWFsUmVmID0gW2luaXRpYWxDaGlsZHJlbi5sZW5ndGggPyBpbml0aWFsQ2hpbGRyZW5bMF0gOiBzdGF0ZS5zdGF0ZXNbMF1dO1xuICAgICAgICAgICAgICAgIGNoZWNrSW5pdGlhbFJlZihzdGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vaG9vayB1cCBoaXN0b3J5XG4gICAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBTVEFURV9UWVBFUy5DT01QT1NJVEUgfHxcbiAgICAgICAgICAgICAgICBzdGF0ZS50eXBlRW51bSA9PT0gU1RBVEVfVFlQRVMuUEFSQUxMRUwpe1xuXG4gICAgICAgICAgICB2YXIgaGlzdG9yeUNoaWxkcmVuID0gc3RhdGUuc3RhdGVzLmZpbHRlcihmdW5jdGlvbihzKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcy4kdHlwZSA9PT0gJ2hpc3RvcnknO1xuICAgICAgICAgICAgfSk7IFxuXG4gICAgICAgICAgIHN0YXRlLmhpc3RvcnlSZWYgPSBoaXN0b3J5Q2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICAvL25vdyBpdCdzIHNhZmUgdG8gZmlsbCBpbiBmYWtlIHN0YXRlIGlkc1xuICAgICAgICBpZighc3RhdGUuaWQpe1xuICAgICAgICAgICAgc3RhdGUuaWQgPSBnZW5lcmF0ZUlkKHN0YXRlLiR0eXBlKTtcbiAgICAgICAgICAgIGlkVG9TdGF0ZU1hcC5zZXQoc3RhdGUuaWQsIHN0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vbm9ybWFsaXplIG9uRW50cnkvb25FeGl0LCB3aGljaCBjYW4gYmUgc2luZ2xlIGZuIG9yIGFycmF5LCBvciBhcnJheSBvZiBhcnJheXMgKGJsb2NrcylcbiAgICAgICAgWydvbkVudHJ5Jywnb25FeGl0J10uZm9yRWFjaChmdW5jdGlvbihwcm9wKXtcbiAgICAgICAgICBpZiAoc3RhdGVbcHJvcF0pIHtcbiAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KHN0YXRlW3Byb3BdKSl7XG4gICAgICAgICAgICAgIHN0YXRlW3Byb3BdID0gW3N0YXRlW3Byb3BdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFzdGF0ZVtwcm9wXS5ldmVyeShmdW5jdGlvbihoYW5kbGVyKXsgcmV0dXJuIEFycmF5LmlzQXJyYXkoaGFuZGxlcik7IH0pKXtcbiAgICAgICAgICAgICAgc3RhdGVbcHJvcF0gPSBbc3RhdGVbcHJvcF1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHN0YXRlLmludm9rZXMgJiYgIUFycmF5LmlzQXJyYXkoc3RhdGUuaW52b2tlcykpIHtcbiAgICAgICAgICAgIHN0YXRlLmludm9rZXMgPSBbc3RhdGUuaW52b2tlc107XG4gICAgICAgICAgICBzdGF0ZS5pbnZva2VzLmZvckVhY2goIGludm9rZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpbnZva2UuZmluYWxpemUgJiYgIUFycmF5LmlzQXJyYXkoaW52b2tlLmZpbmFsaXplKSkge1xuICAgICAgICAgICAgICAgIGludm9rZS5maW5hbGl6ZSA9IFtpbnZva2UuZmluYWxpemVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9UT0RPOiBjb252ZXJ0IGV2ZW50cyB0byByZWd1bGFyIGV4cHJlc3Npb25zIGluIGFkdmFuY2VcblxuICAgIGZ1bmN0aW9uIGNoZWNrSW5pdGlhbFJlZihzdGF0ZSl7XG4gICAgICBpZighc3RhdGUuaW5pdGlhbFJlZikgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gbG9jYXRlIGluaXRpYWwgc3RhdGUgZm9yIGNvbXBvc2l0ZSBzdGF0ZTogJyArIHN0YXRlLmlkKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29ubmVjdEludGlhbEF0dHJpYnV0ZXMoKXtcbiAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBzdGF0ZXNXaXRoSW5pdGlhbEF0dHJpYnV0ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgdmFyIHMgPSBzdGF0ZXNXaXRoSW5pdGlhbEF0dHJpYnV0ZXNbal07XG5cbiAgICAgICAgdmFyIGluaXRpYWxTdGF0ZXMgPSBBcnJheS5pc0FycmF5KHMuaW5pdGlhbCkgPyBzLmluaXRpYWwgOiBbcy5pbml0aWFsXTtcbiAgICAgICAgcy5pbml0aWFsUmVmID0gaW5pdGlhbFN0YXRlcy5tYXAoZnVuY3Rpb24oaW5pdGlhbFN0YXRlKXsgcmV0dXJuIGlkVG9TdGF0ZU1hcC5nZXQoaW5pdGlhbFN0YXRlKTsgfSk7XG4gICAgICAgIGNoZWNrSW5pdGlhbFJlZihzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUlhfV0hJVEVTUEFDRSA9IC9cXHMrLztcblxuICAgIGZ1bmN0aW9uIGNvbm5lY3RUcmFuc2l0aW9uR3JhcGgoKXtcbiAgICAgICAgLy9ub3JtYWxpemUgYXMgd2l0aCBvbkVudHJ5L29uRXhpdFxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdHJhbnNpdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ID0gdHJhbnNpdGlvbnNbaV07XG4gICAgICAgICAgICBpZiAodC5vblRyYW5zaXRpb24gJiYgIUFycmF5LmlzQXJyYXkodC5vblRyYW5zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdC5vblRyYW5zaXRpb24gPSBbdC5vblRyYW5zaXRpb25dO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL25vcm1hbGl6ZSBcImV2ZW50XCIgYXR0cmlidXRlIGludG8gXCJldmVudHNcIiBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdC5ldmVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0LmV2ZW50cyA9IHQuZXZlbnQudHJpbSgpLnNwbGl0KFJYX1dISVRFU1BBQ0UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIHQuZXZlbnQ7XG5cbiAgICAgICAgICAgIGlmKHQudGFyZ2V0cyB8fCAodHlwZW9mIHQudGFyZ2V0ID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICAvL3RhcmdldHMgaGF2ZSBhbHJlYWR5IGJlZW4gc2V0IHVwXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9ICAgXG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiB0LnRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBpZFRvU3RhdGVNYXAuZ2V0KHQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZighdGFyZ2V0KSB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIHRhcmdldCBzdGF0ZSB3aXRoIGlkICcgKyB0LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdC50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgdC50YXJnZXRzID0gW3QudGFyZ2V0XTtcbiAgICAgICAgICAgIH1lbHNlIGlmKEFycmF5LmlzQXJyYXkodC50YXJnZXQpKXtcbiAgICAgICAgICAgICAgICB0LnRhcmdldHMgPSB0LnRhcmdldC5tYXAoZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gaWRUb1N0YXRlTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRhcmdldCkgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCB0YXJnZXQgc3RhdGUgd2l0aCBpZCAnICsgdC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiB0LnRhcmdldCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgIHQudGFyZ2V0cyA9IFt0LnRhcmdldF07XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zaXRpb24gdGFyZ2V0IGhhcyB1bmtub3duIHR5cGU6ICcgKyB0LnRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2hvb2sgdXAgTENBIC0gb3B0aW1pemF0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0cmFuc2l0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIHQgPSB0cmFuc2l0aW9uc1tpXTtcbiAgICAgICAgICAgIGlmKHQudGFyZ2V0cykgdC5sY2NhID0gZ2V0TENDQSh0LnNvdXJjZSx0LnRhcmdldHNbMF0pOyAgICAvL0ZJWE1FOiB3ZSB0ZWNobmljYWxseSBkbyBub3QgbmVlZCB0byBoYW5nIG9udG8gdGhlIGxjY2EuIG9ubHkgdGhlIHNjb3BlIGlzIHVzZWQgYnkgdGhlIGFsZ29yaXRobVxuXG4gICAgICAgICAgICB0LnNjb3BlID0gZ2V0U2NvcGUodCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTY29wZSh0cmFuc2l0aW9uKXtcbiAgICAgICAgLy9UcmFuc2l0aW9uIHNjb3BlIGlzIG5vcm1hbGx5IHRoZSBsZWFzdCBjb21tb24gY29tcG91bmQgYW5jZXN0b3IgKGxjY2EpLlxuICAgICAgICAvL0ludGVybmFsIHRyYW5zaXRpb25zIGhhdmUgYSBzY29wZSBlcXVhbCB0byB0aGUgc291cmNlIHN0YXRlLlxuICAgICAgICB2YXIgdHJhbnNpdGlvbklzUmVhbGx5SW50ZXJuYWwgPSBcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnR5cGUgPT09ICdpbnRlcm5hbCcgJiZcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24uc291cmNlLnR5cGVFbnVtID09PSBTVEFURV9UWVBFUy5DT01QT1NJVEUgJiYgICAvL2lzIHRyYW5zaXRpb24gc291cmNlIGEgY29tcG9zaXRlIHN0YXRlXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnNvdXJjZS5wYXJlbnQgJiYgICAgLy9yb290IHN0YXRlIHdvbid0IGhhdmUgcGFyZW50XG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnRhcmdldHMgJiYgLy9kb2VzIGl0IHRhcmdldCBpdHMgZGVzY2VuZGFudHNcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24udGFyZ2V0cy5ldmVyeShcbiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih0YXJnZXQpeyByZXR1cm4gdHJhbnNpdGlvbi5zb3VyY2UuZGVzY2VuZGFudHMuaW5kZXhPZih0YXJnZXQpID4gLTE7fSk7XG5cbiAgICAgICAgaWYoIXRyYW5zaXRpb24udGFyZ2V0cyl7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfWVsc2UgaWYodHJhbnNpdGlvbklzUmVhbGx5SW50ZXJuYWwpe1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24uc291cmNlOyBcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbi5sY2NhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TENDQShzMSwgczIpIHtcbiAgICAgICAgdmFyIGNvbW1vbkFuY2VzdG9ycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gczEuYW5jZXN0b3JzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICB2YXIgYW5jID0gczEuYW5jZXN0b3JzW2pdO1xuICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgb3B0cyAmJiBvcHRzLmxlZ2FjeVNlbWFudGljcyA/IFxuICAgICAgICAgICAgICAgICAgICBhbmMudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLkNPTVBPU0lURSA6XG4gICAgICAgICAgICAgICAgICAgIChhbmMudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLkNPTVBPU0lURSB8fCBhbmMudHlwZUVudW0gPT09IFNUQVRFX1RZUEVTLlBBUkFMTEVMKSBcbiAgICAgICAgICAgICAgICApICYmXG4gICAgICAgICAgICAgICAgYW5jLmRlc2NlbmRhbnRzLmluZGV4T2YoczIpID4gLTEpe1xuXG4gICAgICAgICAgICAgICAgY29tbW9uQW5jZXN0b3JzLnB1c2goYW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYoIWNvbW1vbkFuY2VzdG9ycy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIExDQSBmb3Igc3RhdGVzLlwiKTtcbiAgICAgICAgcmV0dXJuIGNvbW1vbkFuY2VzdG9yc1swXTtcbiAgICB9XG5cbiAgICAvL21haW4gZXhlY3V0aW9uIHN0YXJ0cyBoZXJlXG4gICAgLy9GSVhNRTogb25seSB3cmFwIGluIHJvb3Qgc3RhdGUgaWYgaXQncyBub3QgYSBjb21wb3VuZCBzdGF0ZVxuICAgIHBvcHVsYXRlU3RhdGVJZE1hcChyb290U3RhdGUpO1xuICAgIHZhciBmYWtlUm9vdFN0YXRlID0gd3JhcEluRmFrZVJvb3RTdGF0ZShyb290U3RhdGUpOyAgLy9JIHdpc2ggd2UgaGFkIHBvaW50ZXIgc2VtYW50aWNzIGFuZCBjb3VsZCBtYWtlIHRoaXMgYSBDLXN0eWxlIFwib3V0IGFyZ3VtZW50XCIuIEluc3RlYWQgd2UgcmV0dXJuIGhpbVxuICAgIHRyYXZlcnNlKFtdLGZha2VSb290U3RhdGUpO1xuICAgIGNvbm5lY3RUcmFuc2l0aW9uR3JhcGgoKTtcbiAgICBjb25uZWN0SW50aWFsQXR0cmlidXRlcygpO1xuXG4gICAgcmV0dXJuIGZha2VSb290U3RhdGU7XG59XG5cblxuZnVuY3Rpb24gaXNFdmVudFByZWZpeE1hdGNoKHByZWZpeCwgZnVsbE5hbWUpIHtcbiAgICBwcmVmaXggPSBwcmVmaXgucmVwbGFjZShSWF9UUkFJTElOR19XSUxEQ0FSRCwgJycpO1xuXG4gICAgaWYgKHByZWZpeCA9PT0gZnVsbE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByZWZpeC5sZW5ndGggPiBmdWxsTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChmdWxsTmFtZS5jaGFyQXQocHJlZml4Lmxlbmd0aCkgIT09ICcuJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIChmdWxsTmFtZS5pbmRleE9mKHByZWZpeCkgPT09IDApO1xufVxuXG5mdW5jdGlvbiBpc1RyYW5zaXRpb25NYXRjaCh0LCBldmVudE5hbWUpIHtcbiAgICByZXR1cm4gdC5ldmVudHMuc29tZSgodEV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiB0RXZlbnQgPT09ICcqJyB8fCBpc0V2ZW50UHJlZml4TWF0Y2godEV2ZW50LCBldmVudE5hbWUpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3Rvcih0LCBldmVudCwgZXZhbHVhdG9yLCBzZWxlY3RFdmVudGxlc3NUcmFuc2l0aW9ucykge1xuICAgIHJldHVybiAoIFxuICAgICAgc2VsZWN0RXZlbnRsZXNzVHJhbnNpdGlvbnMgPyBcbiAgICAgICAgIXQuZXZlbnRzIDpcbiAgICAgICAgKHQuZXZlbnRzICYmIGV2ZW50ICYmIGV2ZW50Lm5hbWUgJiYgaXNUcmFuc2l0aW9uTWF0Y2godCwgZXZlbnQubmFtZSkpXG4gICAgICApXG4gICAgICAmJiAoIXQuY29uZCB8fCBldmFsdWF0b3IodC5jb25kKSk7XG59XG5cbmZ1bmN0aW9uIGV2ZW50bGVzc1RyYW5zaXRpb25TZWxlY3RvcihzdGF0ZSl7XG4gIHJldHVybiBzdGF0ZS50cmFuc2l0aW9ucy5maWx0ZXIoZnVuY3Rpb24odHJhbnNpdGlvbil7IHJldHVybiAhdHJhbnNpdGlvbi5ldmVudHMgfHwgKCB0cmFuc2l0aW9uLmV2ZW50cyAmJiB0cmFuc2l0aW9uLmV2ZW50cy5sZW5ndGggPT09IDAgKTsgfSk7XG59XG5cbi8vcHJpb3JpdHkgY29tcGFyaXNvbiBmdW5jdGlvbnNcbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eShfYXJncykge1xuICAgIGxldCB0MSA9IF9hcmdzWzBdLCB0MiA9IF9hcmdzWzFdO1xuICAgIHZhciByID0gZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSh0MS5zb3VyY2UsIHQyLnNvdXJjZSk7XG4gICAgLy9jb21wYXJlIHRyYW5zaXRpb25zIGJhc2VkIGZpcnN0IG9uIGRlcHRoLCB0aGVuIGJhc2VkIG9uIGRvY3VtZW50IG9yZGVyXG4gICAgaWYgKHQxLnNvdXJjZS5kZXB0aCA8IHQyLnNvdXJjZS5kZXB0aCkge1xuICAgICAgICByZXR1cm4gdDI7XG4gICAgfSBlbHNlIGlmICh0Mi5zb3VyY2UuZGVwdGggPCB0MS5zb3VyY2UuZGVwdGgpIHtcbiAgICAgICAgcmV0dXJuIHQxO1xuICAgIH0gZWxzZSB7XG4gICAgICAgaWYgKHQxLmRvY3VtZW50T3JkZXIgPCB0Mi5kb2N1bWVudE9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdDI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRJbkVudHJ5T3JkZXIoczEsIHMyKXtcbiAgcmV0dXJuIGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkoczEsIHMyKSAqIC0xXG59XG5cbmZ1bmN0aW9uIGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkoczEsIHMyKSB7XG4gICAgLy9jb21wYXJlIHN0YXRlcyBiYXNlZCBmaXJzdCBvbiBkZXB0aCwgdGhlbiBiYXNlZCBvbiBkb2N1bWVudCBvcmRlclxuICAgIGlmIChzMS5kZXB0aCA+IHMyLmRlcHRoKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9IGVsc2UgaWYgKHMxLmRlcHRoIDwgczIuZGVwdGgpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9FcXVhbGl0eVxuICAgICAgICBpZiAoczEuZG9jdW1lbnRPcmRlciA8IHMyLmRvY3VtZW50T3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2UgaWYgKHMxLmRvY3VtZW50T3JkZXIgPiBzMi5kb2N1bWVudE9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplTW9kZWxHZW5lcmF0b3JGbihtb2RlbEZuLCBvcHRzLCBpbnRlcnByZXRlcil7XG4gICAgcmV0dXJuIG1vZGVsRm4uY2FsbChpbnRlcnByZXRlcixcbiAgICAgICAgb3B0cy5feCxcbiAgICAgICAgb3B0cy5feC5fc2Vzc2lvbmlkLFxuICAgICAgICBvcHRzLl94Ll9pb3Byb2Nlc3NvcnMsXG4gICAgICAgIGludGVycHJldGVyLmlzSW4uYmluZChpbnRlcnByZXRlcikpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uKHNlcmlhbGl6ZWRDb25maWd1cmF0aW9uLGlkVG9TdGF0ZU1hcCl7XG4gIHJldHVybiBzZXJpYWxpemVkQ29uZmlndXJhdGlvbi5tYXAoZnVuY3Rpb24oaWQpe1xuICAgIHZhciBzdGF0ZSA9IGlkVG9TdGF0ZU1hcC5nZXQoaWQpO1xuICAgIGlmKCFzdGF0ZSkgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBsb2FkaW5nIHNlcmlhbGl6ZWQgY29uZmlndXJhdGlvbi4gVW5hYmxlIHRvIGxvY2F0ZSBzdGF0ZSB3aXRoIGlkICcgKyBpZCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVIaXN0b3J5KHNlcmlhbGl6ZWRIaXN0b3J5LGlkVG9TdGF0ZU1hcCl7XG4gIHZhciBvID0ge307XG4gIE9iamVjdC5rZXlzKHNlcmlhbGl6ZWRIaXN0b3J5KS5mb3JFYWNoKGZ1bmN0aW9uKHNpZCl7XG4gICAgb1tzaWRdID0gc2VyaWFsaXplZEhpc3Rvcnlbc2lkXS5tYXAoZnVuY3Rpb24oaWQpe1xuICAgICAgdmFyIHN0YXRlID0gaWRUb1N0YXRlTWFwLmdldChpZCk7XG4gICAgICBpZighc3RhdGUpIHRocm93IG5ldyBFcnJvcignRXJyb3IgbG9hZGluZyBzZXJpYWxpemVkIGhpc3RvcnkuIFVuYWJsZSB0byBsb2NhdGUgc3RhdGUgd2l0aCBpZCAnICsgaWQpO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG87XG59XG5cbiIsImNvbnN0IGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbi8vbW9kZWwgYWNjZXNzb3IgZnVuY3Rpb25zXG5jb25zdCBxdWVyeSA9IHtcbiAgICBpc0Rlc2NlbmRhbnQgOiBmdW5jdGlvbihzMSwgczIpe1xuICAgICAgLy9SZXR1cm5zICd0cnVlJyBpZiBzdGF0ZTEgaXMgYSBkZXNjZW5kYW50IG9mIHN0YXRlMiAoYSBjaGlsZCwgb3IgYSBjaGlsZCBvZiBhIGNoaWxkLCBvciBhIGNoaWxkIG9mIGEgY2hpbGQgb2YgYSBjaGlsZCwgZXRjLikgT3RoZXJ3aXNlIHJldHVybnMgJ2ZhbHNlJy5cbiAgICAgIHJldHVybiBzMi5kZXNjZW5kYW50cy5pbmRleE9mKHMxKSA+IC0xO1xuICAgIH0sXG4gICAgZ2V0QW5jZXN0b3JzOiBmdW5jdGlvbihzLCByb290KSB7XG4gICAgICAgIHZhciBhbmNlc3RvcnMsIGluZGV4LCBzdGF0ZTtcbiAgICAgICAgaW5kZXggPSBzLmFuY2VzdG9ycy5pbmRleE9mKHJvb3QpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHMuYW5jZXN0b3JzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzLmFuY2VzdG9ycztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaXNPcnRob2dvbmFsVG86IGZ1bmN0aW9uKHMxLCBzMikge1xuICAgICAgICAvL1R3byBjb250cm9sIHN0YXRlcyBhcmUgb3J0aG9nb25hbCBpZiB0aGV5IGFyZSBub3QgYW5jZXN0cmFsbHlcbiAgICAgICAgLy9yZWxhdGVkLCBhbmQgdGhlaXIgc21hbGxlc3QsIG11dHVhbCBwYXJlbnQgaXMgYSBDb25jdXJyZW50LXN0YXRlLlxuICAgICAgICByZXR1cm4gIXRoaXMuaXNBbmNlc3RyYWxseVJlbGF0ZWRUbyhzMSwgczIpICYmIHRoaXMuZ2V0TENBKHMxLCBzMikudHlwZUVudW0gPT09IGNvbnN0YW50cy5TVEFURV9UWVBFUy5QQVJBTExFTDtcbiAgICB9LFxuICAgIGlzQW5jZXN0cmFsbHlSZWxhdGVkVG86IGZ1bmN0aW9uKHMxLCBzMikge1xuICAgICAgICAvL1R3byBjb250cm9sIHN0YXRlcyBhcmUgYW5jZXN0cmFsbHkgcmVsYXRlZCBpZiBvbmUgaXMgY2hpbGQvZ3JhbmRjaGlsZCBvZiBhbm90aGVyLlxuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbmNlc3RvcnNPclNlbGYoczIpLmluZGV4T2YoczEpID4gLTEgfHwgdGhpcy5nZXRBbmNlc3RvcnNPclNlbGYoczEpLmluZGV4T2YoczIpID4gLTE7XG4gICAgfSxcbiAgICBnZXRBbmNlc3RvcnNPclNlbGY6IGZ1bmN0aW9uKHMsIHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIFtzXS5jb25jYXQocXVlcnkuZ2V0QW5jZXN0b3JzKHMsIHJvb3QpKTtcbiAgICB9LFxuICAgIGdldERlc2NlbmRhbnRzT3JTZWxmOiBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBbc10uY29uY2F0KHMuZGVzY2VuZGFudHMpO1xuICAgIH0sXG4gICAgZ2V0TENBOiBmdW5jdGlvbihzMSwgczIpIHtcbiAgICAgICAgdmFyIGNvbW1vbkFuY2VzdG9ycyA9IHRoaXMuZ2V0QW5jZXN0b3JzKHMxKS5maWx0ZXIoZnVuY3Rpb24oYSl7XG4gICAgICAgICAgICByZXR1cm4gYS5kZXNjZW5kYW50cy5pbmRleE9mKHMyKSA+IC0xO1xuICAgICAgICB9LHRoaXMpO1xuICAgICAgICByZXR1cm4gY29tbW9uQW5jZXN0b3JzWzBdO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcXVlcnk7XG4iLCIvLyAgIENvcHlyaWdodCAyMDEyLTIwMTIgSmFjb2IgQmVhcmQsIElORklDT04sIGFuZCBvdGhlciBTQ0lPTiBjb250cmlidXRvcnNcbi8vXG4vLyAgIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vICAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyAgIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vICAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyAgIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vICAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8qKlxuICogU0NJT04tQ09SRSBnbG9iYWwgb2JqZWN0XG4gKiBAbmFtZXNwYWNlIHNjaW9uXG4gKi9cblxuLyoqXG4gKiBBbiBBcnJheSBvZiBzdHJpbmdzIHJlcHJlc2VudGluZyB0aGUgaWRzIGFsbCBvZiB0aGUgYmFzaWMgc3RhdGVzIHRoZVxuICogaW50ZXJwcmV0ZXIgaXMgaW4gYWZ0ZXIgYSBiaWctc3RlcCBjb21wbGV0ZXMuXG4gKiBAdHlwZWRlZiB7QXJyYXk8c3RyaW5nPn0gQ29uZmlndXJhdGlvblxuICovXG5cbi8qKlxuICogQSBzZXQgb2YgYmFzaWMgYW5kIGNvbXBvc2l0ZSBzdGF0ZSBpZHMuXG4gKiBAdHlwZWRlZiB7QXJyYXk8c3RyaW5nPn0gRnVsbENvbmZpZ3VyYXRpb25cbiAqL1xuXG4vKipcbiAqIEEgc2V0IG9mIGJhc2ljIGFuZCBjb21wb3NpdGUgc3RhdGUgaWRzLlxuICogQHR5cGVkZWYge0FycmF5PHN0cmluZz59IEZ1bGxDb25maWd1cmF0aW9uXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZXZlbnRzJykuRXZlbnRFbWl0dGVyLFxuICB1dGlsID0gcmVxdWlyZSgndXRpbCcpLFxuICBBcnJheVNldCA9IHJlcXVpcmUoJy4vQXJyYXlTZXQnKSxcbiAgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKSxcbiAgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpLFxuICBxdWVyeSA9IHJlcXVpcmUoJy4vcXVlcnknKSxcbiAgZXh0ZW5kID0gaGVscGVycy5leHRlbmQsXG4gIHRyYW5zaXRpb25XaXRoVGFyZ2V0cyA9IGhlbHBlcnMudHJhbnNpdGlvbldpdGhUYXJnZXRzLFxuICB0cmFuc2l0aW9uQ29tcGFyYXRvciA9IGhlbHBlcnMudHJhbnNpdGlvbkNvbXBhcmF0b3IsXG4gIGluaXRpYWxpemVNb2RlbCA9IGhlbHBlcnMuaW5pdGlhbGl6ZU1vZGVsLFxuICBpc0V2ZW50UHJlZml4TWF0Y2ggPSBoZWxwZXJzLmlzRXZlbnRQcmVmaXhNYXRjaCxcbiAgaXNUcmFuc2l0aW9uTWF0Y2ggPSBoZWxwZXJzLmlzVHJhbnNpdGlvbk1hdGNoLFxuICBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvciA9IGhlbHBlcnMuc2N4bWxQcmVmaXhUcmFuc2l0aW9uU2VsZWN0b3IsXG4gIGV2ZW50bGVzc1RyYW5zaXRpb25TZWxlY3RvciA9IGhlbHBlcnMuZXZlbnRsZXNzVHJhbnNpdGlvblNlbGVjdG9yLFxuICBnZXRUcmFuc2l0aW9uV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkgPSBoZWxwZXJzLmdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgc29ydEluRW50cnlPcmRlciA9IGhlbHBlcnMuc29ydEluRW50cnlPcmRlcixcbiAgZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSA9IGhlbHBlcnMuZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSxcbiAgaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4gPSBoZWxwZXJzLmluaXRpYWxpemVNb2RlbEdlbmVyYXRvckZuLFxuICBkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uID0gaGVscGVycy5kZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uLFxuICBkZXNlcmlhbGl6ZUhpc3RvcnkgPSBoZWxwZXJzLmRlc2VyaWFsaXplSGlzdG9yeSxcbiAgQkFTSUMgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuQkFTSUMsXG4gIENPTVBPU0lURSA9IGNvbnN0YW50cy5TVEFURV9UWVBFUy5DT01QT1NJVEUsXG4gIFBBUkFMTEVMID0gY29uc3RhbnRzLlNUQVRFX1RZUEVTLlBBUkFMTEVMLFxuICBISVNUT1JZID0gY29uc3RhbnRzLlNUQVRFX1RZUEVTLkhJU1RPUlksXG4gIElOSVRJQUwgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuSU5JVElBTCxcbiAgRklOQUwgPSBjb25zdGFudHMuU1RBVEVfVFlQRVMuRklOQUwsXG4gIFNDWE1MX0lPUFJPQ0VTU09SX1RZUEUgID0gY29uc3RhbnRzLlNDWE1MX0lPUFJPQ0VTU09SX1RZUEU7XG5cbmNvbnN0IHByaW50VHJhY2UgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgISFwcm9jZXNzLmVudi5ERUJVRztcblxuXG4vKipcbiAqIEBpbnRlcmZhY2UgRXZlbnRFbWl0dGVyXG4gKi9cblxuLyoqXG4qIEBldmVudCBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FcnJvclxuKiBAcHJvcGVydHkge3N0cmluZ30gdGFnbmFtZSBUaGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHByb2R1Y2VkIHRoZSBlcnJvci4gXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBsaW5lIFRoZSBsaW5lIGluIHRoZSBzb3VyY2UgZmlsZSBpbiB3aGljaCB0aGUgZXJyb3Igb2NjdXJyZWQuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb2x1bW4gVGhlIGNvbHVtbiBpbiB0aGUgc291cmNlIGZpbGUgaW4gd2hpY2ggdGhlIGVycm9yIG9jY3VycmVkLlxuKiBAcHJvcGVydHkge3N0cmluZ30gcmVhc29uIEFuIGluZm9ybWF0aXZlIGVycm9yIG1lc3NhZ2UuIFRoZSB0ZXh0IGlzIHBsYXRmb3JtLXNwZWNpZmljIGFuZCBzdWJqZWN0IHRvIGNoYW5nZS5cbiovXG5cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEV2ZW50RW1pdHRlci5wcm90b3R5cGUjb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBsaXN0ZW5lclxuICovXG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBFdmVudEVtaXR0ZXIucHJvdG90eXBlI29uY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBsaXN0ZW5lclxuICovXG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBFdmVudEVtaXR0ZXIucHJvdG90eXBlI29mZlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGxpc3RlbmVyXG4gKi9cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEV2ZW50RW1pdHRlci5wcm90b3R5cGUjZW1pdFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7YW55fSBhcmdzXG4gKi9cblxuLyoqIFxuICogQGRlc2NyaXB0aW9uIFRoZSBTQ1hNTCBjb25zdHJ1Y3RvciBjcmVhdGVzIGFuIGludGVycHJldGVyIGluc3RhbmNlIGZyb20gYSBtb2RlbCBvYmplY3QuXG4gKiBAYWJzdHJhY3RcbiAqIEBjbGFzcyBCYXNlSW50ZXJwcmV0ZXJcbiAqIEBtZW1iZXJvZiBzY2lvblxuICogQGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4gKiBAcGFyYW0ge1NDSlNPTiB8IHNjeG1sLk1vZGVsRmFjdG9yeX0gbW9kZWxPck1vZGVsRmFjdG9yeSBFaXRoZXIgYW4gU0NKU09OIHJvb3Qgc3RhdGU7IG9yIGFuIHNjeG1sLk1vZGVsRmFjdG9yeSwgd2hpY2ggaXMgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIFNDSlNPTiBvYmplY3QuIFxuICogQHBhcmFtIG9wdHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5zZXNzaW9uaWRdIFVzZWQgdG8gcG9wdWxhdGUgU0NYTUwgX3Nlc3Npb25pZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRzLmdlbmVyYXRlU2Vzc2lvbmlkXSBGYWN0b3J5IHVzZWQgdG8gZ2VuZXJhdGUgc2Vzc2lvbmlkIGlmIHNlc3Npb25pZCBrZXl3b3JkIGlzIG5vdCBzcGVjaWZpZWRcbiAqIEBwYXJhbSB7TWFwPHN0cmluZywgQmFzZUludGVycHJldGVyPn0gW29wdHMuc2Vzc2lvblJlZ2lzdHJ5XSBNYXAgdXNlZCB0byBtYXAgc2Vzc2lvbmlkIHN0cmluZ3MgdG8gU3RhdGVjaGFydCBpbnN0YW5jZXMuXG4gKiBAcGFyYW0gW29wdHMuU2V0XSBDbGFzcyB0byB1c2UgYXMgYW4gQXJyYXlTZXQuIERlZmF1bHRzIHRvIEVTNiBTZXQuXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdHMucGFyYW1zXSAgVXNlZCB0byBwYXNzIHBhcmFtcyBmcm9tIGludm9rZS4gU2V0cyB0aGUgZGF0YW1vZGVsIHdoZW4gaW50ZXJwcmV0ZXIgaXMgaW5zdGFudGlhdGVkLlxuICogQHBhcmFtIHtTbmFwc2hvdH0gW29wdHMuc25hcHNob3RdIFN0YXRlIG1hY2hpbmUgc25hcHNob3QuIFVzZWQgdG8gcmVzdG9yZSBhIHNlcmlhbGl6ZWQgc3RhdGUgbWFjaGluZS5cbiAqIEBwYXJhbSB7U3RhdGVjaGFydH0gW29wdHMucGFyZW50U2Vzc2lvbl0gIFVzZWQgdG8gcGFzcyBwYXJlbnQgc2Vzc2lvbiBkdXJpbmcgaW52b2tlLlxuICogQHBhcmFtIHtzdHJpbmcgfVtvcHRzLmludm9rZWlkXSAgU3VwcG9ydCBmb3IgaWQgb2YgaW52b2tlIGVsZW1lbnQgYXQgcnVudGltZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMubGVnYWN5U2VtYW50aWNzXVxuICogQHBhcmFtIFtvcHRzLmNvbnNvbGVdXG4gKiBAcGFyYW0gW29wdHMudHJhbnNpdGlvblNlbGVjdG9yXVxuICogQHBhcmFtIFtvcHRzLmN1c3RvbUNhbmNlbF1cbiAqIEBwYXJhbSBbb3B0cy5jdXN0b21TZW5kXVxuICogQHBhcmFtIFtvcHRzLnNlbmRBc3luY11cbiAqIEBwYXJhbSBbb3B0cy5kb1NlbmRdXG4gKiBAcGFyYW0gW29wdHMuaW52b2tlcnNdXG4gKiBAcGFyYW0gW29wdHMueG1sUGFyc2VyXVxuICogQHBhcmFtIFtvcHRzLmludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dF1cbiAqL1xuY2xhc3MgQmFzZUludGVycHJldGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3Rvcihtb2RlbE9yTW9kZWxGYWN0b3J5LCBvcHRzKXtcblxuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm9wdHMgPSBvcHRzO1xuXG4gICAgdGhpcy5vcHRzLkludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCA9IHRoaXMub3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgfHwgSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0O1xuXG4gICAgdGhpcy5faXNTdGVwcGluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fc2NyaXB0aW5nQ29udGV4dCA9IHRoaXMub3B0cy5pbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgfHwgKHRoaXMub3B0cy5JbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgPyBuZXcgdGhpcy5vcHRzLkludGVycHJldGVyU2NyaXB0aW5nQ29udGV4dCh0aGlzKSA6IHt9KTsgXG5cbiAgICB0aGlzLm9wdHMuZ2VuZXJhdGVTZXNzaW9uaWQgPSB0aGlzLm9wdHMuZ2VuZXJhdGVTZXNzaW9uaWQgfHwgQmFzZUludGVycHJldGVyLmdlbmVyYXRlU2Vzc2lvbmlkO1xuICAgIHRoaXMub3B0cy5zZXNzaW9uaWQgPSB0aGlzLm9wdHMuc2Vzc2lvbmlkIHx8IHRoaXMub3B0cy5nZW5lcmF0ZVNlc3Npb25pZCgpO1xuICAgIHRoaXMub3B0cy5zZXNzaW9uUmVnaXN0cnkgPSB0aGlzLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5IHx8IEJhc2VJbnRlcnByZXRlci5zZXNzaW9uUmVnaXN0cnk7ICAvL1RPRE86IGRlZmluZSBhIGJldHRlciBpbnRlcmZhY2UuIEZvciBub3csIGFzc3VtZSBhIE1hcDxzZXNzaW9uaWQsIHNlc3Npb24+XG5cblxuICAgIGxldCBfaW9wcm9jZXNzb3JzID0ge307XG4gICAgX2lvcHJvY2Vzc29yc1tTQ1hNTF9JT1BST0NFU1NPUl9UWVBFXSA9IHtcbiAgICAgIGxvY2F0aW9uIDogYCNfc2N4bWxfJHt0aGlzLm9wdHMuc2Vzc2lvbmlkfWBcbiAgICB9XG4gICAgX2lvcHJvY2Vzc29ycy5zY3htbCA9IF9pb3Byb2Nlc3NvcnNbU0NYTUxfSU9QUk9DRVNTT1JfVFlQRV07ICAgIC8vYWxpYXNcblxuICAgIC8vU0NYTUwgc3lzdGVtIHZhcmlhYmxlczpcbiAgICB0aGlzLm9wdHMuX3ggPSB7XG4gICAgICAgIF9zZXNzaW9uaWQgOiB0aGlzLm9wdHMuc2Vzc2lvbmlkLFxuICAgICAgICBfaW9wcm9jZXNzb3JzIDogX2lvcHJvY2Vzc29yc1xuICAgIH07XG5cblxuICAgIHZhciBtb2RlbDtcbiAgICBpZih0eXBlb2YgbW9kZWxPck1vZGVsRmFjdG9yeSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIG1vZGVsID0gaW5pdGlhbGl6ZU1vZGVsR2VuZXJhdG9yRm4obW9kZWxPck1vZGVsRmFjdG9yeSwgdGhpcy5vcHRzLCB0aGlzKTtcbiAgICB9ZWxzZSBpZih0eXBlb2YgbW9kZWxPck1vZGVsRmFjdG9yeSA9PT0gJ29iamVjdCcpe1xuICAgICAgICBtb2RlbCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobW9kZWxPck1vZGVsRmFjdG9yeSkpOyAvL2Fzc3VtZSBvYmplY3RcbiAgICB9ZWxzZXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIG1vZGVsIHR5cGUuIEV4cGVjdGVkIG1vZGVsIGZhY3RvcnkgZnVuY3Rpb24sIG9yIHNjanNvbiBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fbW9kZWwgPSBpbml0aWFsaXplTW9kZWwobW9kZWwsIHRoaXMub3B0cyk7XG5cbiAgICB0aGlzLm9wdHMuY29uc29sZSA9IHRoaXMub3B0cy5jb25zb2xlIHx8ICh0eXBlb2YgY29uc29sZSA9PT0gJ3VuZGVmaW5lZCcgPyB7bG9nIDogZnVuY3Rpb24oKXt9fSA6IGNvbnNvbGUpOyAgIC8vcmVseSBvbiBnbG9iYWwgY29uc29sZSBpZiB0aGlzIGNvbnNvbGUgaXMgdW5kZWZpbmVkXG4gICAgdGhpcy5vcHRzLlNldCA9IHRoaXMub3B0cy5TZXQgfHwgQXJyYXlTZXQ7XG4gICAgdGhpcy5vcHRzLnByaW9yaXR5Q29tcGFyaXNvbkZuID0gdGhpcy5vcHRzLnByaW9yaXR5Q29tcGFyaXNvbkZuIHx8IGdldFRyYW5zaXRpb25XaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eTtcbiAgICB0aGlzLm9wdHMudHJhbnNpdGlvblNlbGVjdG9yID0gdGhpcy5vcHRzLnRyYW5zaXRpb25TZWxlY3RvciB8fCBzY3htbFByZWZpeFRyYW5zaXRpb25TZWxlY3RvcjtcblxuICAgIHRoaXMub3B0cy5zZXNzaW9uUmVnaXN0cnkuc2V0KFN0cmluZyh0aGlzLm9wdHMuc2Vzc2lvbmlkKSwgdGhpcyk7XG5cbiAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LmxvZyA9IHRoaXMuX3NjcmlwdGluZ0NvbnRleHQubG9nIHx8IChmdW5jdGlvbiBsb2coKXsgXG4gICAgICBpZih0aGlzLm9wdHMuY29uc29sZS5sb2cuYXBwbHkpe1xuICAgICAgICB0aGlzLm9wdHMuY29uc29sZS5sb2cuYXBwbHkodGhpcy5vcHRzLmNvbnNvbGUsIGFyZ3VtZW50cyk7IFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyBvbiBvbGRlciBJRSBkb2VzIG5vdCBzdXBwb3J0IEZ1bmN0aW9uLmFwcGx5LCBzbyBqdXN0IHBhc3MgaGltIHRoZSBmaXJzdCBhcmd1bWVudC4gQmVzdCB3ZSBjYW4gZG8gZm9yIG5vdy5cbiAgICAgICAgdGhpcy5vcHRzLmNvbnNvbGUubG9nKEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpLmpvaW4oJywnKSk7IFxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7ICAgLy9zZXQgdXAgZGVmYXVsdCBzY3JpcHRpbmcgY29udGV4dCBsb2cgZnVuY3Rpb25cblxuICAgIHRoaXMuX2V4dGVybmFsRXZlbnRRdWV1ZSA9IFtdO1xuICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZSA9IFtdO1xuXG4gICAgaWYodGhpcy5vcHRzLnBhcmFtcyl7XG4gICAgICB0aGlzLl9tb2RlbC4kZGVzZXJpYWxpemVEYXRhbW9kZWwodGhpcy5vcHRzLnBhcmFtcyk7ICAgLy9sb2FkIHVwIHRoZSBkYXRhbW9kZWxcbiAgICB9XG5cbiAgICAvL2NoZWNrIGlmIHdlJ3JlIGxvYWRpbmcgZnJvbSBhIHByZXZpb3VzIHNuYXBzaG90XG4gICAgaWYodGhpcy5vcHRzLnNuYXBzaG90KXtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBuZXcgdGhpcy5vcHRzLlNldChkZXNlcmlhbGl6ZVNlcmlhbGl6ZWRDb25maWd1cmF0aW9uKHRoaXMub3B0cy5zbmFwc2hvdFswXSwgdGhpcy5fbW9kZWwuJGlkVG9TdGF0ZU1hcCkpO1xuICAgICAgdGhpcy5faGlzdG9yeVZhbHVlID0gZGVzZXJpYWxpemVIaXN0b3J5KHRoaXMub3B0cy5zbmFwc2hvdFsxXSwgdGhpcy5fbW9kZWwuJGlkVG9TdGF0ZU1hcCk7IFxuICAgICAgdGhpcy5faXNJbkZpbmFsU3RhdGUgPSB0aGlzLm9wdHMuc25hcHNob3RbMl07XG4gICAgICB0aGlzLl9tb2RlbC4kZGVzZXJpYWxpemVEYXRhbW9kZWwodGhpcy5vcHRzLnNuYXBzaG90WzNdKTsgICAvL2xvYWQgdXAgdGhlIGRhdGFtb2RlbFxuICAgICAgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlID0gdGhpcy5vcHRzLnNuYXBzaG90WzRdO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IG5ldyB0aGlzLm9wdHMuU2V0KCk7XG4gICAgICB0aGlzLl9oaXN0b3J5VmFsdWUgPSB7fTtcbiAgICAgIHRoaXMuX2lzSW5GaW5hbFN0YXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9hZGQgZGVidWcgbG9nZ2luZ1xuICAgIEJhc2VJbnRlcnByZXRlci5FVkVOVFMuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XG4gICAgICB0aGlzLm9uKGV2ZW50LCB0aGlzLl9sb2cuYmluZCh0aGlzLGV2ZW50KSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICBtb2R1bGUuZXhwb3J0cy5lbWl0KCduZXcnLHRoaXMpO1xuICB9XG5cbiAgLyoqIFxuICAqIENhbmNlbHMgdGhlIHNlc3Npb24uIFRoaXMgY2xlYXJzIGFsbCB0aW1lcnM7IHB1dHMgdGhlIGludGVycHJldGVyIGluIGFcbiAgKiBmaW5hbCBzdGF0ZTsgYW5kIHJ1bnMgYWxsIGV4aXQgYWN0aW9ucyBvbiBjdXJyZW50IHN0YXRlcy5cbiAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZVxuICAqL1xuICBjYW5jZWwoKXtcbiAgICBkZWxldGUgdGhpcy5vcHRzLnBhcmVudFNlc3Npb247XG4gICAgaWYodGhpcy5faXNJbkZpbmFsU3RhdGUpIHJldHVybjtcbiAgICB0aGlzLl9pc0luRmluYWxTdGF0ZSA9IHRydWU7XG4gICAgdGhpcy5fbG9nKGBzZXNzaW9uIGNhbmNlbGxlZCAke3RoaXMub3B0cy5pbnZva2VpZH1gKTtcbiAgICB0aGlzLl9leGl0SW50ZXJwcmV0ZXIobnVsbCk7XG4gIH1cblxuICBfZXhpdEludGVycHJldGVyKGV2ZW50KXtcbiAgICAvL1RPRE86IGNhbmNlbCBpbnZva2VkIHNlc3Npb25zXG4gICAgLy9jYW5jZWwgYWxsIGRlbGF5ZWQgc2VuZHMgd2hlbiB3ZSBlbnRlciBpbnRvIGEgZmluYWwgc3RhdGUuXG4gICAgdGhpcy5fY2FuY2VsQWxsRGVsYXllZFNlbmRzKCk7XG5cbiAgICBsZXQgc3RhdGVzVG9FeGl0ID0gdGhpcy5fZ2V0RnVsbENvbmZpZ3VyYXRpb24oKS5zb3J0KGdldFN0YXRlV2l0aEhpZ2hlclNvdXJjZUNoaWxkUHJpb3JpdHkpO1xuXG4gICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlc1RvRXhpdC5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICB2YXIgc3RhdGVFeGl0ZWQgPSBzdGF0ZXNUb0V4aXRbal07XG5cbiAgICAgICAgaWYoc3RhdGVFeGl0ZWQub25FeGl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGV4aXRJZHggPSAwLCBleGl0TGVuID0gc3RhdGVFeGl0ZWQub25FeGl0Lmxlbmd0aDsgZXhpdElkeCA8IGV4aXRMZW47IGV4aXRJZHgrKykge1xuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHN0YXRlRXhpdGVkLm9uRXhpdFtleGl0SWR4XTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBibG9ja0lkeCA9IDAsIGJsb2NrTGVuID0gYmxvY2subGVuZ3RoOyBibG9ja0lkeCA8IGJsb2NrTGVuOyBibG9ja0lkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSBibG9ja1tibG9ja0lkeF07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVmLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2NhbmNlbCBpbnZva2VkIHNlc3Npb25cbiAgICAgICAgaWYoc3RhdGVFeGl0ZWQuaW52b2tlcykgc3RhdGVFeGl0ZWQuaW52b2tlcy5mb3JFYWNoKCBpbnZva2UgPT4ge1xuICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuY2FuY2VsSW52b2tlKGludm9rZS5pZCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy9pZiBoZSBpcyBhIHRvcC1sZXZlbCA8ZmluYWw+IHN0YXRlLCB0aGVuIHJldHVybiB0aGUgZG9uZSBldmVudFxuICAgICAgICBpZiggc3RhdGVFeGl0ZWQuJHR5cGUgPT09ICdmaW5hbCcgJiZcbiAgICAgICAgICAgIHN0YXRlRXhpdGVkLnBhcmVudC4kdHlwZSA9PT0gJ3NjeG1sJyl7XG5cbiAgICAgICAgICBpZih0aGlzLm9wdHMucGFyZW50U2Vzc2lvbil7XG4gICAgICAgICAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0LnNlbmQoe1xuICAgICAgICAgICAgICB0YXJnZXQ6ICcjX3BhcmVudCcsIFxuICAgICAgICAgICAgICBuYW1lOiAnZG9uZS5pbnZva2UuJyArIHRoaXMub3B0cy5pbnZva2VpZCxcbiAgICAgICAgICAgICAgZGF0YSA6IHN0YXRlRXhpdGVkLmRvbmVkYXRhICYmIHN0YXRlRXhpdGVkLmRvbmVkYXRhLmNhbGwodGhpcy5fc2NyaXB0aW5nQ29udGV4dCwgZXZlbnQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm9wdHMuc2Vzc2lvblJlZ2lzdHJ5LmRlbGV0ZSh0aGlzLm9wdHMuc2Vzc2lvbmlkKTtcbiAgICAgICAgICB0aGlzLmVtaXQoJ29uRXhpdEludGVycHJldGVyJywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKiogXG4gICAqIFN0YXJ0cyB0aGUgaW50ZXJwcmV0ZXIuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlLCBhbmQgc2hvdWxkIGJlIGNhbGxlZFxuICAgKiBiZWZvcmUgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSNnZW4gaXMgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZS4gIFJldHVybnMgYVxuICAgKiBDb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJuIHtDb25maWd1cmF0aW9ufVxuICAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZVxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRW50cnlcbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkV4aXRcbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblRyYW5zaXRpb25cbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkRlZmF1bHRFbnRyeVxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXJyb3JcbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBCZWdpblxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcFN1c3BlbmRcbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBSZXN1bWVcbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEJlZ2luXG4gICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25TbWFsbFN0ZXBFbmRcbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBFbmRcbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkV4aXRJbnRlcnByZXRlclxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgICB0aGlzLl9pbml0U3RhcnQoKTtcbiAgICAgIHRoaXMuX3BlcmZvcm1CaWdTdGVwKCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb25maWd1cmF0aW9uKCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGlzIGNhbGxiYWNrIGlzIGRpc3BsYXllZCBhcyBhIGdsb2JhbCBtZW1iZXIuXG4gICAqIEBjYWxsYmFjayBnZW5DYWxsYmFja1xuICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAgICogQHBhcmFtIHtDb25maWd1cmF0aW9ufSBjb25maWd1cmF0aW9uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIGludGVycHJldGVyIGFzeW5jaHJvbm91c2x5XG4gICAqIEBwYXJhbSAge2dlbkNhbGxiYWNrfSBjYiBDYWxsYmFjayBpbnZva2VkIHdpdGggYW4gZXJyb3Igb3IgdGhlIGludGVycHJldGVyJ3Mgc3RhYmxlIGNvbmZpZ3VyYXRpb25cbiAgICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgXG4gICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FbnRyeVxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdFxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uVHJhbnNpdGlvblxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRGVmYXVsdEVudHJ5XG4gICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FcnJvclxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEJlZ2luXG4gICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4gICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwU3VzcGVuZFxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcFJlc3VtZVxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwQmVnaW5cbiAgICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEVuZFxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuICAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdEludGVycHJldGVyXG4gICAqL1xuICBzdGFydEFzeW5jKGNiKSB7XG4gICAgICBjYiA9IHRoaXMuX2luaXRTdGFydChjYik7XG4gICAgICB0aGlzLmdlbkFzeW5jKG51bGwsIGNiKTtcbiAgfVxuXG4gIF9pbml0U3RhcnQoY2Ipe1xuICAgICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNiID0gbm9wO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9sb2coXCJwZXJmb3JtaW5nIGluaXRpYWwgYmlnIHN0ZXBcIik7XG5cbiAgICAgIC8vV2UgZWZmZWN0aXZlbHkgbmVlZCB0byBmaWd1cmUgb3V0IHN0YXRlcyB0byBlbnRlciBoZXJlIHRvIHBvcHVsYXRlIGluaXRpYWwgY29uZmlnLiBhc3N1bWluZyByb290IGlzIGNvbXBvdW5kIHN0YXRlIG1ha2VzIHRoaXMgc2ltcGxlLlxuICAgICAgLy9idXQgaWYgd2Ugd2FudCBpdCB0byBiZSBwYXJhbGxlbCwgdGhlbiB0aGlzIGJlY29tZXMgbW9yZSBjb21wbGV4LiBzbyB3aGVuIGluaXRpYWxpemluZyB0aGUgbW9kZWwsIHdlIGFkZCBhICdmYWtlJyByb290IHN0YXRlLCB3aGljaFxuICAgICAgLy9tYWtlcyB0aGUgZm9sbG93aW5nIG9wZXJhdGlvbiBzYWZlLlxuICAgICAgdGhpcy5fbW9kZWwuaW5pdGlhbFJlZi5mb3JFYWNoKCBzID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24uYWRkKHMpICk7XG5cbiAgICAgIHJldHVybiBjYjtcbiAgfVxuXG4gIC8qKiBcbiAgKiBSZXR1cm5zIHN0YXRlIG1hY2hpbmUge0BsaW5rIENvbmZpZ3VyYXRpb259LlxuICAqIEByZXR1cm4ge0NvbmZpZ3VyYXRpb259XG4gICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgXG4gICovXG4gIGdldENvbmZpZ3VyYXRpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkubWFwKGZ1bmN0aW9uKHMpe3JldHVybiBzLmlkO30pO1xuICB9XG5cbiAgX2dldEZ1bGxDb25maWd1cmF0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuXG4gICAgICAgICAgICAgIG1hcChmdW5jdGlvbihzKXsgcmV0dXJuIFtzXS5jb25jYXQocXVlcnkuZ2V0QW5jZXN0b3JzKHMpKTt9LHRoaXMpLlxuICAgICAgICAgICAgICByZWR1Y2UoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5jb25jYXQoYik7fSxbXSkuICAgIC8vZmxhdHRlblxuICAgICAgICAgICAgICByZWR1Y2UoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5pbmRleE9mKGIpID4gLTEgPyBhIDogYS5jb25jYXQoYik7fSxbXSk7IC8vdW5pcVxuICB9XG5cblxuICAvKiogXG4gICogQHJldHVybiB7RnVsbENvbmZpZ3VyYXRpb259XG4gICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgXG4gICovXG4gIGdldEZ1bGxDb25maWd1cmF0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldEZ1bGxDb25maWd1cmF0aW9uKCkubWFwKGZ1bmN0aW9uKHMpe3JldHVybiBzLmlkO30pO1xuICB9XG5cblxuICAvKiogXG4gICogQHJldHVybiB7Ym9vbGVhbn1cbiAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVOYW1lXG4gICovXG4gIGlzSW4oc3RhdGVOYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRGdWxsQ29uZmlndXJhdGlvbigpLmluZGV4T2Yoc3RhdGVOYW1lKSA+IC0xO1xuICB9XG5cbiAgLyoqIFxuICAqIElzIHRoZSBzdGF0ZSBtYWNoaW5lIGluIGEgZmluYWwgc3RhdGU/XG4gICogQHJldHVybiB7Ym9vbGVhbn1cbiAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgKi9cbiAgaXNGaW5hbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pc0luRmluYWxTdGF0ZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcGVyZm9ybUJpZ1N0ZXAoZSkge1xuICAgICAgbGV0IGN1cnJlbnRFdmVudCwga2VlcEdvaW5nLCBhbGxTdGF0ZXNFeGl0ZWQsIGFsbFN0YXRlc0VudGVyZWQ7XG4gICAgICBbYWxsU3RhdGVzRXhpdGVkLCBhbGxTdGF0ZXNFbnRlcmVkLCBrZWVwR29pbmcsIGN1cnJlbnRFdmVudF0gPSB0aGlzLl9zdGFydEJpZ1N0ZXAoZSk7XG5cbiAgICAgIHdoaWxlIChrZWVwR29pbmcpIHtcbiAgICAgICAgW2N1cnJlbnRFdmVudCwga2VlcEdvaW5nXSA9IHRoaXMuX3NlbGVjdFRyYW5zaXRpb25zQW5kUGVyZm9ybVNtYWxsU3RlcChjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ZpbmlzaEJpZ1N0ZXAoY3VycmVudEV2ZW50LCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQpO1xuICB9XG5cbiAgX3NlbGVjdFRyYW5zaXRpb25zQW5kUGVyZm9ybVNtYWxsU3RlcChjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCl7XG4gICAgICAvL2ZpcnN0IHNlbGVjdCB3aXRoIG51bGwgZXZlbnRcbiAgICAgIHZhciBzZWxlY3RlZFRyYW5zaXRpb25zICA9IHRoaXMuX3NlbGVjdFRyYW5zaXRpb25zKGN1cnJlbnRFdmVudCwgdHJ1ZSk7XG4gICAgICBpZihzZWxlY3RlZFRyYW5zaXRpb25zLmlzRW1wdHkoKSl7XG4gICAgICAgIGxldCBldiA9IHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5zaGlmdCgpO1xuICAgICAgICBpZihldil7IFxuICAgICAgICAgIGN1cnJlbnRFdmVudCA9IGV2O1xuICAgICAgICAgIHNlbGVjdGVkVHJhbnNpdGlvbnMgPSB0aGlzLl9zZWxlY3RUcmFuc2l0aW9ucyhjdXJyZW50RXZlbnQsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZighc2VsZWN0ZWRUcmFuc2l0aW9ucy5pc0VtcHR5KCkpe1xuICAgICAgICB0aGlzLmVtaXQoJ29uU21hbGxTdGVwQmVnaW4nLCBjdXJyZW50RXZlbnQpO1xuICAgICAgICBsZXQgc3RhdGVzRXhpdGVkLCBzdGF0ZXNFbnRlcmVkO1xuICAgICAgICBbc3RhdGVzRXhpdGVkLCBzdGF0ZXNFbnRlcmVkXSA9IHRoaXMuX3BlcmZvcm1TbWFsbFN0ZXAoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zKTtcbiAgICAgICAgaWYoc3RhdGVzRXhpdGVkKSBzdGF0ZXNFeGl0ZWQuZm9yRWFjaCggcyA9PiBhbGxTdGF0ZXNFeGl0ZWQuYWRkKHMpICk7XG4gICAgICAgIGlmKHN0YXRlc0VudGVyZWQpIHN0YXRlc0VudGVyZWQuZm9yRWFjaCggcyA9PiBhbGxTdGF0ZXNFbnRlcmVkLmFkZChzKSApO1xuICAgICAgICB0aGlzLmVtaXQoJ29uU21hbGxTdGVwRW5kJywgY3VycmVudEV2ZW50KTtcbiAgICAgIH1cbiAgICAgIGxldCBrZWVwR29pbmcgPSAhc2VsZWN0ZWRUcmFuc2l0aW9ucy5pc0VtcHR5KCkgfHwgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLmxlbmd0aDtcbiAgICAgIHJldHVybiBbY3VycmVudEV2ZW50LCBrZWVwR29pbmddO1xuICB9XG5cbiAgX3N0YXJ0QmlnU3RlcChlKXtcbiAgICAgIHRoaXMuZW1pdCgnb25CaWdTdGVwQmVnaW4nLCBlKTtcblxuICAgICAgLy9kbyBhcHBseUZpbmFsaXplIGFuZCBhdXRvZm9yd2FyZFxuICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuZm9yRWFjaChzdGF0ZSA9PiB7XG4gICAgICAgIGlmKHN0YXRlLmludm9rZXMpIHN0YXRlLmludm9rZXMuZm9yRWFjaCggaW52b2tlID0+ICB7XG4gICAgICAgICAgaWYoaW52b2tlLmF1dG9mb3J3YXJkKXtcbiAgICAgICAgICAgIC8vYXV0b2ZvcndhcmRcbiAgICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuc2VuZCh7XG4gICAgICAgICAgICAgIHRhcmdldDogYCNfJHtpbnZva2UuaWR9YCwgXG4gICAgICAgICAgICAgIG5hbWU6IGUubmFtZSxcbiAgICAgICAgICAgICAgZGF0YSA6IGUuZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGludm9rZS5pZCA9PT0gZS5pbnZva2VpZCl7XG4gICAgICAgICAgICAvL2FwcGx5RmluYWxpemVcbiAgICAgICAgICAgIGlmKGludm9rZS5maW5hbGl6ZSkgaW52b2tlLmZpbmFsaXplLmZvckVhY2goIGFjdGlvbiA9PiAgdGhpcy5fZXZhbHVhdGVBY3Rpb24oZSwgYWN0aW9uKSk7XG4gICAgICAgICAgfSBcbiAgICAgICAgfSlcbiAgICAgIH0pOyBcblxuICAgICAgaWYgKGUpIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKGUpO1xuXG4gICAgICBsZXQgYWxsU3RhdGVzRXhpdGVkID0gbmV3IFNldCgpLCBhbGxTdGF0ZXNFbnRlcmVkID0gbmV3IFNldCgpO1xuICAgICAgbGV0IGtlZXBHb2luZyA9IHRydWU7XG4gICAgICBsZXQgY3VycmVudEV2ZW50ID0gZTtcbiAgICAgIHJldHVybiBbYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkLCBrZWVwR29pbmcsIGN1cnJlbnRFdmVudF07XG4gIH1cblxuICBfZmluaXNoQmlnU3RlcChlLCBhbGxTdGF0ZXNFbnRlcmVkLCBhbGxTdGF0ZXNFeGl0ZWQsIGNiKXtcbiAgICAgIGxldCBzdGF0ZXNUb0ludm9rZSA9IEFycmF5LmZyb20obmV3IFNldChbLi4uYWxsU3RhdGVzRW50ZXJlZF0uZmlsdGVyKHMgPT4gcy5pbnZva2VzICYmICFhbGxTdGF0ZXNFeGl0ZWQuaGFzKHMpKSkpLnNvcnQoc29ydEluRW50cnlPcmRlcik7XG5cbiAgICAgIC8vIEhlcmUgd2UgaW52b2tlIHdoYXRldmVyIG5lZWRzIHRvIGJlIGludm9rZWQuIFRoZSBpbXBsZW1lbnRhdGlvbiBvZiAnaW52b2tlJyBpcyBwbGF0Zm9ybS1zcGVjaWZpY1xuICAgICAgc3RhdGVzVG9JbnZva2UuZm9yRWFjaCggcyA9PiB7XG4gICAgICAgICAgcy5pbnZva2VzLmZvckVhY2goIGYgPT4gIHRoaXMuX2V2YWx1YXRlQWN0aW9uKGUsZikgKVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNhbmNlbCBpbnZva2UgZm9yIGFsbFN0YXRlc0V4aXRlZFxuICAgICAgYWxsU3RhdGVzRXhpdGVkLmZvckVhY2goIHMgPT4ge1xuICAgICAgICBpZihzLmludm9rZXMpIHMuaW52b2tlcy5mb3JFYWNoKCBpbnZva2UgPT4ge1xuICAgICAgICAgIHRoaXMuX3NjcmlwdGluZ0NvbnRleHQuY2FuY2VsSW52b2tlKGludm9rZS5pZCk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgLy8gVE9ETzogSW52b2tpbmcgbWF5IGhhdmUgcmFpc2VkIGludGVybmFsIGVycm9yIGV2ZW50cyBhbmQgd2UgaXRlcmF0ZSB0byBoYW5kbGUgdGhlbSAgICAgICAgXG4gICAgICAvL2lmIG5vdCBpbnRlcm5hbFF1ZXVlLmlzRW1wdHkoKTpcbiAgICAgIC8vICAgIGNvbnRpbnVlXG5cbiAgICAgIHRoaXMuX2lzSW5GaW5hbFN0YXRlID0gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuZXZlcnkoZnVuY3Rpb24ocyl7IHJldHVybiBzLnR5cGVFbnVtID09PSBGSU5BTDsgfSk7XG4gICAgICBpZih0aGlzLl9pc0luRmluYWxTdGF0ZSl7XG4gICAgICAgIHRoaXMuX2V4aXRJbnRlcnByZXRlcihlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdCgnb25CaWdTdGVwRW5kJyk7XG4gICAgICBpZihjYikgY2IodW5kZWZpbmVkLCB0aGlzLmdldENvbmZpZ3VyYXRpb24oKSk7XG4gIH1cblxuICBfY2FuY2VsQWxsRGVsYXllZFNlbmRzKCl7XG4gICAgZm9yKCBsZXQgdGltZW91dE9wdGlvbnMgb2YgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5fdGltZW91dHMpe1xuICAgICAgaWYoIXRpbWVvdXRPcHRpb25zLnNlbmRPcHRpb25zLmRlbGF5KSBjb250aW51ZTtcbiAgICAgIHRoaXMuX2xvZygnY2FuY2VsbGluZyBkZWxheWVkIHNlbmQnLCB0aW1lb3V0T3B0aW9ucyk7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dE9wdGlvbnMudGltZW91dEhhbmRsZSk7XG4gICAgICB0aGlzLl9zY3JpcHRpbmdDb250ZXh0Ll90aW1lb3V0cy5kZWxldGUodGltZW91dE9wdGlvbnMpO1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyh0aGlzLl9zY3JpcHRpbmdDb250ZXh0Ll90aW1lb3V0TWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG4gICAgICBkZWxldGUgdGhpcy5fc2NyaXB0aW5nQ29udGV4dC5fdGltZW91dE1hcFtrZXldO1xuICAgIH0sIHRoaXMpO1xuICB9XG5cbiAgX3BlcmZvcm1CaWdTdGVwQXN5bmMoZSwgY2IpIHtcbiAgICAgIGxldCBjdXJyZW50RXZlbnQsIGtlZXBHb2luZywgYWxsU3RhdGVzRXhpdGVkLCBhbGxTdGF0ZXNFbnRlcmVkO1xuICAgICAgW2FsbFN0YXRlc0V4aXRlZCwgYWxsU3RhdGVzRW50ZXJlZCwga2VlcEdvaW5nLCBjdXJyZW50RXZlbnRdID0gdGhpcy5fc3RhcnRCaWdTdGVwKGUpO1xuXG4gICAgICBmdW5jdGlvbiBuZXh0U3RlcChlbWl0KXtcbiAgICAgICAgdGhpcy5lbWl0KGVtaXQpO1xuICAgICAgICBbY3VycmVudEV2ZW50LCBrZWVwR29pbmddID0gdGhpcy5fc2VsZWN0VHJhbnNpdGlvbnNBbmRQZXJmb3JtU21hbGxTdGVwKGN1cnJlbnRFdmVudCwgYWxsU3RhdGVzRW50ZXJlZCwgYWxsU3RhdGVzRXhpdGVkKTtcblxuICAgICAgICBpZihrZWVwR29pbmcpe1xuICAgICAgICAgIHRoaXMuZW1pdCgnb25CaWdTdGVwU3VzcGVuZCcpO1xuICAgICAgICAgIHNldEltbWVkaWF0ZShuZXh0U3RlcC5iaW5kKHRoaXMpLCdvbkJpZ1N0ZXBSZXN1bWUnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgdGhpcy5fZmluaXNoQmlnU3RlcChjdXJyZW50RXZlbnQsIGFsbFN0YXRlc0VudGVyZWQsIGFsbFN0YXRlc0V4aXRlZCwgY2IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBuZXh0U3RlcC5jYWxsKHRoaXMsJ29uQmlnU3RlcEJlZ2luJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3BlcmZvcm1TbWFsbFN0ZXAoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zKSB7XG5cbiAgICAgIHRoaXMuX2xvZyhcInNlbGVjdGluZyB0cmFuc2l0aW9ucyB3aXRoIGN1cnJlbnRFdmVudFwiLCBjdXJyZW50RXZlbnQpO1xuXG4gICAgICB0aGlzLl9sb2coXCJzZWxlY3RlZCB0cmFuc2l0aW9uc1wiLCBzZWxlY3RlZFRyYW5zaXRpb25zKTtcblxuICAgICAgbGV0IHN0YXRlc0V4aXRlZCxcbiAgICAgICAgICBzdGF0ZXNFbnRlcmVkO1xuXG4gICAgICBpZiAoIXNlbGVjdGVkVHJhbnNpdGlvbnMuaXNFbXB0eSgpKSB7XG5cbiAgICAgICAgICAvL3dlIG9ubHkgd2FudCB0byBlbnRlciBhbmQgZXhpdCBzdGF0ZXMgZnJvbSB0cmFuc2l0aW9ucyB3aXRoIHRhcmdldHNcbiAgICAgICAgICAvL2ZpbHRlciBvdXQgdGFyZ2V0bGVzcyB0cmFuc2l0aW9ucyBoZXJlIC0gd2Ugd2lsbCBvbmx5IHVzZSB0aGVzZSB0byBleGVjdXRlIHRyYW5zaXRpb24gYWN0aW9uc1xuICAgICAgICAgIHZhciBzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMgPSBuZXcgdGhpcy5vcHRzLlNldChzZWxlY3RlZFRyYW5zaXRpb25zLml0ZXIoKS5maWx0ZXIodHJhbnNpdGlvbldpdGhUYXJnZXRzKSk7XG5cbiAgICAgICAgICBzdGF0ZXNFeGl0ZWQgPSB0aGlzLl9leGl0U3RhdGVzKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKVxuICAgICAgICAgIHRoaXMuX2V4ZWN1dGVUcmFuc2l0aW9ucyhjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnMpO1xuICAgICAgICAgIHN0YXRlc0VudGVyZWQgPSB0aGlzLl9lbnRlclN0YXRlcyhjdXJyZW50RXZlbnQsIHNlbGVjdGVkVHJhbnNpdGlvbnNXaXRoVGFyZ2V0cylcblxuICAgICAgICAgIHRoaXMuX2xvZyhcIm5ldyBjb25maWd1cmF0aW9uIFwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFtzdGF0ZXNFeGl0ZWQsIHN0YXRlc0VudGVyZWRdO1xuICB9XG5cbiAgX2V4aXRTdGF0ZXMoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMpe1xuICAgICAgbGV0IGJhc2ljU3RhdGVzRXhpdGVkLCBzdGF0ZXNFeGl0ZWQ7XG4gICAgICBbYmFzaWNTdGF0ZXNFeGl0ZWQsIHN0YXRlc0V4aXRlZF0gPSB0aGlzLl9nZXRTdGF0ZXNFeGl0ZWQoc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKTsgXG5cbiAgICAgIHRoaXMuX2xvZygnZXhpdGluZyBzdGF0ZXMnKVxuICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHN0YXRlc0V4aXRlZC5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIHZhciBzdGF0ZUV4aXRlZCA9IHN0YXRlc0V4aXRlZFtqXTtcblxuICAgICAgICAgIGlmKHN0YXRlRXhpdGVkLmlzQXRvbWljKSB0aGlzLl9jb25maWd1cmF0aW9uLnJlbW92ZShzdGF0ZUV4aXRlZCk7XG5cbiAgICAgICAgICB0aGlzLl9sb2coXCJleGl0aW5nIFwiLCBzdGF0ZUV4aXRlZC5pZCk7XG5cbiAgICAgICAgICAvL2ludm9rZSBsaXN0ZW5lcnNcbiAgICAgICAgICB0aGlzLmVtaXQoJ29uRXhpdCcsc3RhdGVFeGl0ZWQuaWQpXG5cbiAgICAgICAgICBpZihzdGF0ZUV4aXRlZC5vbkV4aXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBleGl0SWR4ID0gMCwgZXhpdExlbiA9IHN0YXRlRXhpdGVkLm9uRXhpdC5sZW5ndGg7IGV4aXRJZHggPCBleGl0TGVuOyBleGl0SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHN0YXRlRXhpdGVkLm9uRXhpdFtleGl0SWR4XTtcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGJsb2NrSWR4ID0gMCwgYmxvY2tMZW4gPSBibG9jay5sZW5ndGg7IGJsb2NrSWR4IDwgYmxvY2tMZW47IGJsb2NrSWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uUmVmID0gYmxvY2tbYmxvY2tJZHhdO1xuICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBmO1xuICAgICAgICAgIGlmIChzdGF0ZUV4aXRlZC5oaXN0b3J5UmVmKSB7XG4gICAgICAgICAgICAgIGZvcihsZXQgaGlzdG9yeVJlZiBvZiBzdGF0ZUV4aXRlZC5oaXN0b3J5UmVmKXtcbiAgICAgICAgICAgICAgICAgIGlmIChoaXN0b3J5UmVmLmlzRGVlcCkge1xuICAgICAgICAgICAgICAgICAgICAgIGYgPSBmdW5jdGlvbihzMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gczAudHlwZUVudW0gPT09IEJBU0lDICYmIHN0YXRlRXhpdGVkLmRlc2NlbmRhbnRzLmluZGV4T2YoczApID4gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKHMwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzMC5wYXJlbnQgPT09IHN0YXRlRXhpdGVkO1xuICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvL3VwZGF0ZSBoaXN0b3J5XG4gICAgICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5VmFsdWVbaGlzdG9yeVJlZi5pZF0gPSBzdGF0ZXNFeGl0ZWQuZmlsdGVyKGYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdGVzRXhpdGVkO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRTdGF0ZXNFeGl0ZWQodHJhbnNpdGlvbnMpIHtcbiAgICB2YXIgc3RhdGVzRXhpdGVkID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcbiAgICB2YXIgYmFzaWNTdGF0ZXNFeGl0ZWQgPSBuZXcgdGhpcy5vcHRzLlNldCgpO1xuXG4gICAgLy9TdGF0ZXMgZXhpdGVkIGFyZSBkZWZpbmVkIHRvIGJlIGFjdGl2ZSBzdGF0ZXMgdGhhdCBhcmVcbiAgICAvL2Rlc2NlbmRhbnRzIG9mIHRoZSBzY29wZSBvZiBlYWNoIHByaW9yaXR5LWVuYWJsZWQgdHJhbnNpdGlvbi5cbiAgICAvL0hlcmUsIHdlIGl0ZXJhdGUgdGhyb3VnaCB0aGUgdHJhbnNpdGlvbnMsIGFuZCBjb2xsZWN0IHN0YXRlc1xuICAgIC8vdGhhdCBtYXRjaCB0aGlzIGNvbmRpdGlvbi4gXG4gICAgdmFyIHRyYW5zaXRpb25MaXN0ID0gdHJhbnNpdGlvbnMuaXRlcigpO1xuICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSB0cmFuc2l0aW9uTGlzdC5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbkxpc3RbdHhJZHhdO1xuICAgICAgdmFyIHNjb3BlID0gdHJhbnNpdGlvbi5zY29wZSxcbiAgICAgICAgICBkZXNjID0gc2NvcGUuZGVzY2VuZGFudHM7XG5cbiAgICAgIC8vRm9yIGVhY2ggc3RhdGUgaW4gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgIC8vaXMgdGhhdCBzdGF0ZSBhIGRlc2NlbmRhbnQgb2YgdGhlIHRyYW5zaXRpb24gc2NvcGU/XG4gICAgICAvL1N0b3JlIGFuY2VzdG9ycyBvZiB0aGF0IHN0YXRlIHVwIHRvIGJ1dCBub3QgaW5jbHVkaW5nIHRoZSBzY29wZS5cbiAgICAgIHZhciBjb25maWdMaXN0ID0gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCk7XG4gICAgICBmb3IgKHZhciBjZmdJZHggPSAwLCBjZmdMZW4gPSBjb25maWdMaXN0Lmxlbmd0aDsgY2ZnSWR4IDwgY2ZnTGVuOyBjZmdJZHgrKykge1xuICAgICAgICB2YXIgc3RhdGUgPSBjb25maWdMaXN0W2NmZ0lkeF07XG4gICAgICAgIGlmKGRlc2MuaW5kZXhPZihzdGF0ZSkgPiAtMSl7XG4gICAgICAgICAgYmFzaWNTdGF0ZXNFeGl0ZWQuYWRkKHN0YXRlKTtcbiAgICAgICAgICBzdGF0ZXNFeGl0ZWQuYWRkKHN0YXRlKTtcbiAgICAgICAgICB2YXIgYW5jZXN0b3JzID0gcXVlcnkuZ2V0QW5jZXN0b3JzKHN0YXRlLHNjb3BlKTsgXG4gICAgICAgICAgZm9yICh2YXIgYW5jSWR4ID0gMCwgYW5jTGVuID0gYW5jZXN0b3JzLmxlbmd0aDsgYW5jSWR4IDwgYW5jTGVuOyBhbmNJZHgrKykgeyBcbiAgICAgICAgICAgIHN0YXRlc0V4aXRlZC5hZGQoYW5jZXN0b3JzW2FuY0lkeF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzb3J0ZWRTdGF0ZXNFeGl0ZWQgPSBzdGF0ZXNFeGl0ZWQuaXRlcigpLnNvcnQoZ2V0U3RhdGVXaXRoSGlnaGVyU291cmNlQ2hpbGRQcmlvcml0eSk7XG4gICAgcmV0dXJuIFtiYXNpY1N0YXRlc0V4aXRlZCwgc29ydGVkU3RhdGVzRXhpdGVkXTtcbiAgfVxuXG4gIF9leGVjdXRlVHJhbnNpdGlvbnMoY3VycmVudEV2ZW50LCBzZWxlY3RlZFRyYW5zaXRpb25zKXtcbiAgICAgIHZhciBzb3J0ZWRUcmFuc2l0aW9ucyA9IHNlbGVjdGVkVHJhbnNpdGlvbnMuaXRlcigpLnNvcnQodHJhbnNpdGlvbkNvbXBhcmF0b3IpO1xuXG4gICAgICB0aGlzLl9sb2coXCJleGVjdXRpbmcgdHJhbnNpdGl0aW9uIGFjdGlvbnNcIik7XG4gICAgICBmb3IgKHZhciBzdHhJZHggPSAwLCBsZW4gPSBzb3J0ZWRUcmFuc2l0aW9ucy5sZW5ndGg7IHN0eElkeCA8IGxlbjsgc3R4SWR4KyspIHtcbiAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHNvcnRlZFRyYW5zaXRpb25zW3N0eElkeF07XG5cbiAgICAgICAgICB2YXIgdGFyZ2V0SWRzID0gdHJhbnNpdGlvbi50YXJnZXRzICYmIHRyYW5zaXRpb24udGFyZ2V0cy5tYXAoZnVuY3Rpb24odGFyZ2V0KXtyZXR1cm4gdGFyZ2V0LmlkO30pO1xuXG4gICAgICAgICAgdGhpcy5lbWl0KCdvblRyYW5zaXRpb24nLHRyYW5zaXRpb24uc291cmNlLmlkLHRhcmdldElkcywgdHJhbnNpdGlvbi5zb3VyY2UudHJhbnNpdGlvbnMuaW5kZXhPZih0cmFuc2l0aW9uKSk7XG5cbiAgICAgICAgICBpZih0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbi5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvblt0eElkeF07XG4gICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICB9XG5cbiAgX2VudGVyU3RhdGVzKGN1cnJlbnRFdmVudCwgc2VsZWN0ZWRUcmFuc2l0aW9uc1dpdGhUYXJnZXRzKXtcbiAgICAgIHRoaXMuX2xvZyhcImVudGVyaW5nIHN0YXRlc1wiKTtcblxuICAgICAgbGV0IHN0YXRlc0VudGVyZWQgPSBuZXcgU2V0KCk7XG4gICAgICBsZXQgc3RhdGVzRm9yRGVmYXVsdEVudHJ5ID0gbmV3IFNldCgpO1xuICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgdGVtcG9yYXJ5IHRhYmxlIGZvciBkZWZhdWx0IGNvbnRlbnQgaW4gaGlzdG9yeSBzdGF0ZXNcbiAgICAgIGxldCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQgPSB7fTtcbiAgICAgIHRoaXMuX2NvbXB1dGVFbnRyeVNldChzZWxlY3RlZFRyYW5zaXRpb25zV2l0aFRhcmdldHMsIHN0YXRlc0VudGVyZWQsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KTsgXG4gICAgICBzdGF0ZXNFbnRlcmVkID0gWy4uLnN0YXRlc0VudGVyZWRdLnNvcnQoc29ydEluRW50cnlPcmRlcik7IFxuXG4gICAgICB0aGlzLl9sb2coXCJzdGF0ZXNFbnRlcmVkIFwiLCBzdGF0ZXNFbnRlcmVkKTtcblxuICAgICAgZm9yICh2YXIgZW50ZXJJZHggPSAwLCBlbnRlckxlbiA9IHN0YXRlc0VudGVyZWQubGVuZ3RoOyBlbnRlcklkeCA8IGVudGVyTGVuOyBlbnRlcklkeCsrKSB7XG4gICAgICAgICAgdmFyIHN0YXRlRW50ZXJlZCA9IHN0YXRlc0VudGVyZWRbZW50ZXJJZHhdO1xuXG4gICAgICAgICAgaWYoc3RhdGVFbnRlcmVkLmlzQXRvbWljKSB0aGlzLl9jb25maWd1cmF0aW9uLmFkZChzdGF0ZUVudGVyZWQpO1xuXG4gICAgICAgICAgdGhpcy5fbG9nKFwiZW50ZXJpbmdcIiwgc3RhdGVFbnRlcmVkLmlkKTtcblxuICAgICAgICAgIHRoaXMuZW1pdCgnb25FbnRyeScsc3RhdGVFbnRlcmVkLmlkKTtcblxuICAgICAgICAgIGlmKHN0YXRlRW50ZXJlZC5vbkVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgZW50cnlJZHggPSAwLCBlbnRyeUxlbiA9IHN0YXRlRW50ZXJlZC5vbkVudHJ5Lmxlbmd0aDsgZW50cnlJZHggPCBlbnRyeUxlbjsgZW50cnlJZHgrKykge1xuICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gc3RhdGVFbnRlcmVkLm9uRW50cnlbZW50cnlJZHhdO1xuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYmxvY2tJZHggPSAwLCBibG9ja0xlbiA9IGJsb2NrLmxlbmd0aDsgYmxvY2tJZHggPCBibG9ja0xlbjsgYmxvY2tJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSBibG9ja1tibG9ja0lkeF07XG4gICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoc3RhdGVzRm9yRGVmYXVsdEVudHJ5LmhhcyhzdGF0ZUVudGVyZWQpKXtcbiAgICAgICAgICAgICAgZm9yKGxldCBpbml0aWFsU3RhdGUgb2Ygc3RhdGVFbnRlcmVkLmluaXRpYWxSZWYpe1xuICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdvbkRlZmF1bHRFbnRyeScsIGluaXRpYWxTdGF0ZS5pZCk7XG4gICAgICAgICAgICAgICAgICBpZihpbml0aWFsU3RhdGUudHlwZUVudW0gPT09IElOSVRJQUwpe1xuICAgICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2l0aW9uID0gaW5pdGlhbFN0YXRlLnRyYW5zaXRpb25zWzBdXG4gICAgICAgICAgICAgICAgICAgICAgaWYodHJhbnNpdGlvbi5vblRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2coJ2V4ZWN1dGluZyBpbml0aWFsIHRyYW5zaXRpb24gY29udGVudCBmb3IgaW5pdGlhbCBzdGF0ZSBvZiBwYXJlbnQgc3RhdGUnLHN0YXRlRW50ZXJlZC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHR4SWR4ID0gMCwgdHhMZW4gPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvbi5sZW5ndGg7IHR4SWR4IDwgdHhMZW47IHR4SWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvblt0eElkeF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKGUsIGFjdGlvblJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICBpZihkZWZhdWx0SGlzdG9yeUNvbnRlbnRbc3RhdGVFbnRlcmVkLmlkXSl7XG4gICAgICAgICAgICAgIGxldCB0cmFuc2l0aW9uID0gZGVmYXVsdEhpc3RvcnlDb250ZW50W3N0YXRlRW50ZXJlZC5pZF1cbiAgICAgICAgICAgICAgaWYodHJhbnNpdGlvbi5vblRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nKCdleGVjdXRpbmcgaGlzdG9yeSB0cmFuc2l0aW9uIGNvbnRlbnQgZm9yIGhpc3Rvcnkgc3RhdGUgb2YgcGFyZW50IHN0YXRlJyxzdGF0ZUVudGVyZWQuaWQpO1xuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCB0eExlbiA9IHRyYW5zaXRpb24ub25UcmFuc2l0aW9uLmxlbmd0aDsgdHhJZHggPCB0eExlbjsgdHhJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Rpb25SZWYgPSB0cmFuc2l0aW9uLm9uVHJhbnNpdGlvblt0eElkeF07XG4gICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblJlZi5jYWxsKHRoaXMuX3NjcmlwdGluZ0NvbnRleHQsIGN1cnJlbnRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBlbnRlcklkeCA9IDAsIGVudGVyTGVuID0gc3RhdGVzRW50ZXJlZC5sZW5ndGg7IGVudGVySWR4IDwgZW50ZXJMZW47IGVudGVySWR4KyspIHtcbiAgICAgICAgICB2YXIgc3RhdGVFbnRlcmVkID0gc3RhdGVzRW50ZXJlZFtlbnRlcklkeF07XG4gICAgICAgICAgaWYoc3RhdGVFbnRlcmVkLnR5cGVFbnVtID09PSBGSU5BTCl7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gc3RhdGVFbnRlcmVkLnBhcmVudDtcbiAgICAgICAgICAgIGxldCBncmFuZHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcm5hbEV2ZW50UXVldWUucHVzaCh7bmFtZSA6IFwiZG9uZS5zdGF0ZS5cIiArIHBhcmVudC5pZCwgZGF0YSA6IHN0YXRlRW50ZXJlZC5kb25lZGF0YSAmJiBzdGF0ZUVudGVyZWQuZG9uZWRhdGEuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpfSk7XG4gICAgICAgICAgICBpZihncmFuZHBhcmVudCAmJiBncmFuZHBhcmVudC50eXBlRW51bSA9PT0gUEFSQUxMRUwpe1xuICAgICAgICAgICAgICAgIGlmKGdyYW5kcGFyZW50LnN0YXRlcy5ldmVyeShzID0+IHRoaXMuaXNJbkZpbmFsU3RhdGUocykgKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKHtuYW1lIDogXCJkb25lLnN0YXRlLlwiICsgZ3JhbmRwYXJlbnQuaWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdGVzRW50ZXJlZDtcbiAgfVxuXG4gIF9nZXRFZmZlY3RpdmVUYXJnZXRTdGF0ZXModHJhbnNpdGlvbil7XG4gICAgbGV0IHRhcmdldHMgPSBuZXcgU2V0KCk7XG4gICAgZm9yKGxldCBzIG9mIHRyYW5zaXRpb24udGFyZ2V0cyl7XG4gICAgICBpZihzLnR5cGVFbnVtID09PSBISVNUT1JZKXtcbiAgICAgICAgaWYocy5pZCBpbiB0aGlzLl9oaXN0b3J5VmFsdWUpXG4gICAgICAgICAgdGhpcy5faGlzdG9yeVZhbHVlW3MuaWRdLmZvckVhY2goIHN0YXRlID0+IHRhcmdldHMuYWRkKHN0YXRlKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFsuLi50aGlzLl9nZXRFZmZlY3RpdmVUYXJnZXRTdGF0ZXMocy50cmFuc2l0aW9uc1swXSldLmZvckVhY2goIHN0YXRlID0+IHRhcmdldHMuYWRkKHN0YXRlKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldHMuYWRkKHMpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRzXG4gIH1cblxuICBfY29tcHV0ZUVudHJ5U2V0KHRyYW5zaXRpb25zLCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCl7XG4gICAgZm9yKGxldCB0IG9mIHRyYW5zaXRpb25zLml0ZXIoKSl7XG4gICAgICBmb3IobGV0IHMgb2YgdC50YXJnZXRzKXtcbiAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIocyxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCkgXG4gICAgICB9XG4gICAgICBsZXQgYW5jZXN0b3IgPSB0LnNjb3BlO1xuICAgICAgZm9yKGxldCBzIG9mIHRoaXMuX2dldEVmZmVjdGl2ZVRhcmdldFN0YXRlcyh0KSl7XG4gICAgICAgIHRoaXMuX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlcihzLCBhbmNlc3Rvciwgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2NvbXB1dGVFeGl0U2V0KHRyYW5zaXRpb25zKSB7XG4gICAgbGV0IHN0YXRlc1RvRXhpdCA9IG5ldyBTZXQoKTtcbiAgICBmb3IobGV0IHQgb2YgdHJhbnNpdGlvbnMpe1xuICAgICAgaWYodC50YXJnZXRzKXtcbiAgICAgICAgbGV0IHNjb3BlID0gdC5zY29wZTtcbiAgICAgICAgZm9yKGxldCBzIG9mIHRoaXMuX2dldEZ1bGxDb25maWd1cmF0aW9uKCkpe1xuICAgICAgICAgIGlmKHF1ZXJ5LmlzRGVzY2VuZGFudChzLHNjb3BlKSkgc3RhdGVzVG9FeGl0LmFkZChzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVzVG9FeGl0OyBcbiAgfVxuXG4gIF9hZGRBbmNlc3RvclN0YXRlc1RvRW50ZXIoc3RhdGUsIGFuY2VzdG9yLCBzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudCl7XG4gICAgbGV0IHRyYXZlcnNlID0gKGFuYykgPT4ge1xuICAgICAgaWYoYW5jLnR5cGVFbnVtID09PSBQQVJBTExFTCl7XG4gICAgICAgIGZvcihsZXQgY2hpbGQgb2YgYW5jLnN0YXRlcyl7XG4gICAgICAgICAgaWYoY2hpbGQudHlwZUVudW0gIT09IEhJU1RPUlkgJiYgIVsuLi5zdGF0ZXNUb0VudGVyXS5zb21lKHMgPT4gcXVlcnkuaXNEZXNjZW5kYW50KHMsIGNoaWxkKSkpe1xuICAgICAgICAgICAgdGhpcy5fYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIoY2hpbGQsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZm9yKGxldCBhbmMgb2YgcXVlcnkuZ2V0QW5jZXN0b3JzKHN0YXRlLGFuY2VzdG9yKSl7XG4gICAgICBzdGF0ZXNUb0VudGVyLmFkZChhbmMpXG4gICAgICB0cmF2ZXJzZShhbmMpXG4gICAgfVxuICAgIHRyYXZlcnNlKGFuY2VzdG9yKVxuICB9XG5cblxuICBfYWRkRGVzY2VuZGFudFN0YXRlc1RvRW50ZXIoc3RhdGUsc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpe1xuICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBISVNUT1JZKXtcbiAgICAgIGlmKHRoaXMuX2hpc3RvcnlWYWx1ZVtzdGF0ZS5pZF0pe1xuICAgICAgICBmb3IobGV0IHMgb2YgdGhpcy5faGlzdG9yeVZhbHVlW3N0YXRlLmlkXSlcbiAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcihzLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuXG4gICAgICAgIGZvcihsZXQgcyBvZiB0aGlzLl9oaXN0b3J5VmFsdWVbc3RhdGUuaWRdKVxuICAgICAgICAgIHRoaXMuX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlcihzLCBzdGF0ZS5wYXJlbnQsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmYXVsdEhpc3RvcnlDb250ZW50W3N0YXRlLnBhcmVudC5pZF0gPSBzdGF0ZS50cmFuc2l0aW9uc1swXVxuICAgICAgICBmb3IobGV0IHMgb2Ygc3RhdGUudHJhbnNpdGlvbnNbMF0udGFyZ2V0cylcbiAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcihzLHN0YXRlc1RvRW50ZXIsc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG5cbiAgICAgICAgZm9yKGxldCBzIG9mIHN0YXRlLnRyYW5zaXRpb25zWzBdLnRhcmdldHMpXG4gICAgICAgICAgdGhpcy5fYWRkQW5jZXN0b3JTdGF0ZXNUb0VudGVyKHMsIHN0YXRlLnBhcmVudCwgc3RhdGVzVG9FbnRlciwgc3RhdGVzRm9yRGVmYXVsdEVudHJ5LCBkZWZhdWx0SGlzdG9yeUNvbnRlbnQpXG5cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGVzVG9FbnRlci5hZGQoc3RhdGUpXG4gICAgICAgIGlmKHN0YXRlLnR5cGVFbnVtID09PSBDT01QT1NJVEUpe1xuICAgICAgICAgIHN0YXRlc0ZvckRlZmF1bHRFbnRyeS5hZGQoc3RhdGUpXG4gICAgICAgICAgLy9mb3IgZWFjaCBzdGF0ZSBpbiBpbml0aWFsUmVmLCBpZiBpdCBpcyBhbiBpbml0aWFsIHN0YXRlLCB0aGVuIGFkZCBhbmNlc3RvcnMgYW5kIGRlc2NlbmRhbnRzLlxuICAgICAgICAgIGZvcihsZXQgcyBvZiBzdGF0ZS5pbml0aWFsUmVmKXtcbiAgICAgICAgICAgIGxldCB0YXJnZXRzID0gcy50eXBlRW51bSA9PT0gSU5JVElBTCA/IHMudHJhbnNpdGlvbnNbMF0udGFyZ2V0cyA6IFtzXTsgXG4gICAgICAgICAgICBmb3IobGV0IHRhcmdldFN0YXRlIG9mIHRhcmdldHMpe1xuICAgICAgICAgICAgICB0aGlzLl9hZGREZXNjZW5kYW50U3RhdGVzVG9FbnRlcih0YXJnZXRTdGF0ZSxzdGF0ZXNUb0VudGVyLCBzdGF0ZXNGb3JEZWZhdWx0RW50cnksIGRlZmF1bHRIaXN0b3J5Q29udGVudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yKGxldCBzIG9mIHN0YXRlLmluaXRpYWxSZWYpe1xuICAgICAgICAgICAgbGV0IHRhcmdldHMgPSBzLnR5cGVFbnVtID09PSBJTklUSUFMID8gcy50cmFuc2l0aW9uc1swXS50YXJnZXRzIDogW3NdOyBcbiAgICAgICAgICAgIGZvcihsZXQgdGFyZ2V0U3RhdGUgb2YgdGFyZ2V0cyl7XG4gICAgICAgICAgICAgIHRoaXMuX2FkZEFuY2VzdG9yU3RhdGVzVG9FbnRlcih0YXJnZXRTdGF0ZSwgc3RhdGUsIHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgaWYoc3RhdGUudHlwZUVudW0gPT09IFBBUkFMTEVMKXtcbiAgICAgICAgICAgIGZvcihsZXQgY2hpbGQgb2Ygc3RhdGUuc3RhdGVzKXtcbiAgICAgICAgICAgICAgaWYoY2hpbGQudHlwZUVudW0gIT09IEhJU1RPUlkgJiYgIVsuLi5zdGF0ZXNUb0VudGVyXS5zb21lKHMgPT4gcXVlcnkuaXNEZXNjZW5kYW50KHMsIGNoaWxkKSkpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2FkZERlc2NlbmRhbnRTdGF0ZXNUb0VudGVyKGNoaWxkLHN0YXRlc1RvRW50ZXIsIHN0YXRlc0ZvckRlZmF1bHRFbnRyeSwgZGVmYXVsdEhpc3RvcnlDb250ZW50KSBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzSW5GaW5hbFN0YXRlKHMpe1xuICAgICAgaWYocy50eXBlRW51bSA9PT0gQ09NUE9TSVRFKXtcbiAgICAgICAgICByZXR1cm4gcy5zdGF0ZXMuc29tZShzID0+IHMudHlwZUVudW0gPT09IEZJTkFMICYmIHRoaXMuX2NvbmZpZ3VyYXRpb24uY29udGFpbnMocykpO1xuICAgICAgfWVsc2UgaWYocy50eXBlRW51bSA9PT0gUEFSQUxMRUwpe1xuICAgICAgICAgIHJldHVybiBzLnN0YXRlcy5ldmVyeSh0aGlzLmlzSW5GaW5hbFN0YXRlLmJpbmQodGhpcykpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZXZhbHVhdGVBY3Rpb24oY3VycmVudEV2ZW50LCBhY3Rpb25SZWYpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhY3Rpb25SZWYuY2FsbCh0aGlzLl9zY3JpcHRpbmdDb250ZXh0LCBjdXJyZW50RXZlbnQpOyAgICAgLy9TQ1hNTCBzeXN0ZW0gdmFyaWFibGVzXG4gICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoZSwgYWN0aW9uUmVmKTtcbiAgICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVFcnJvcihlLCBhY3Rpb25SZWYpe1xuICAgIGxldCBldmVudCA9IFxuICAgICAgZSBpbnN0YW5jZW9mIEVycm9yIHx8ICh0eXBlb2YgZS5fX3Byb3RvX18ubmFtZSA9PT0gJ3N0cmluZycgJiYgZS5fX3Byb3RvX18ubmFtZS5tYXRjaCgvXi4qRXJyb3IkLykpID8gIC8vd2UgY2FuJ3QganVzdCBkbyAnZSBpbnN0YW5jZW9mIEVycm9yJywgYmVjYXVzZSB0aGUgRXJyb3Igb2JqZWN0IGluIHRoZSBzYW5kYm94IGlzIGZyb20gYSBkaWZmZXJlbnQgY29udGV4dCwgYW5kIGluc3RhbmNlb2Ygd2lsbCByZXR1cm4gZmFsc2VcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6J2Vycm9yLmV4ZWN1dGlvbicsXG4gICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgIHRhZ25hbWU6IGFjdGlvblJlZi50YWduYW1lLCBcbiAgICAgICAgICAgIGxpbmU6IGFjdGlvblJlZi5saW5lLCBcbiAgICAgICAgICAgIGNvbHVtbjogYWN0aW9uUmVmLmNvbHVtbixcbiAgICAgICAgICAgIHJlYXNvbjogZS5tZXNzYWdlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0eXBlIDogJ3BsYXRmb3JtJ1xuICAgICAgICB9IDogXG4gICAgICAgIChlLm5hbWUgPyBcbiAgICAgICAgICBlIDogXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTonZXJyb3IuZXhlY3V0aW9uJyxcbiAgICAgICAgICAgIGRhdGE6ZSxcbiAgICAgICAgICAgIHR5cGUgOiAncGxhdGZvcm0nXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgIHRoaXMuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKGV2ZW50KTtcbiAgICB0aGlzLmVtaXQoJ29uRXJyb3InLCBldmVudCk7XG4gIH1cblxuICBfbG9nKCl7XG4gICAgaWYocHJpbnRUcmFjZSl7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcbiAgICAgIHRoaXMub3B0cy5jb25zb2xlLmxvZyggXG4gICAgICAgIGAke2FyZ3NbMF19OiAke1xuICAgICAgICAgIGFyZ3Muc2xpY2UoMSkubWFwKGZ1bmN0aW9uKGFyZyl7XG4gICAgICAgICAgICByZXR1cm4gYXJnID09PSBudWxsID8gJ251bGwnIDogXG4gICAgICAgICAgICAgICggYXJnID09PSB1bmRlZmluZWQgPyAndW5kZWZpbmVkJyA6IFxuICAgICAgICAgICAgICAgICggdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgPyBhcmcgOiBcbiAgICAgICAgICAgICAgICAgICggYXJnLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gdXRpbC5pbnNwZWN0KGFyZykgOiBhcmcudG9TdHJpbmcoKSkpKTtcblxuICAgICAgICAgIH0pLmpvaW4oJywgJylcbiAgICAgICAgfVxcbmBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogQGludGVyZmFjZSBMaXN0ZW5lclxuICAqL1xuXG4gIC8qKlxuICAqIEBmdW5jdGlvblxuICAqIEBuYW1lIExpc3RlbmVyI29uRW50cnkgXG4gICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlSWRcbiAgKi9cblxuICAvKipcbiAgKiBAZnVuY3Rpb25cbiAgKiBAbmFtZSBMaXN0ZW5lciNvbkV4aXQgXG4gICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlSWRcbiAgKi9cblxuICAvKipcbiAgKiBAZnVuY3Rpb25cbiAgKiBAbmFtZSBMaXN0ZW5lciNvblRyYW5zaXRpb24gXG4gICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZVN0YXRlSWQgSWQgb2YgdGhlIHNvdXJjZSBzdGF0ZVxuICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gdGFyZ2V0U3RhdGVzSWRzIElkcyBvZiB0aGUgdGFyZ2V0IHN0YXRlc1xuICAqIEBwYXJhbSB7bnVtYmVyfSB0cmFuc2l0aW9uSW5kZXggSW5kZXggb2YgdGhlIHRyYW5zaXRpb24gcmVsYXRpdmUgdG8gb3RoZXIgdHJhbnNpdGlvbnMgb3JpZ2luYXRpbmcgZnJvbSBzb3VyY2Ugc3RhdGUuXG4gICovXG5cbiAgLyoqXG4gICogQGZ1bmN0aW9uXG4gICogQG5hbWUgTGlzdGVuZXIjb25FcnJvclxuICAqIEBwYXJhbSB7RXJyb3J9IGVycm9ySW5mb1xuICAqL1xuXG4gIC8qKlxuICAqIEBmdW5jdGlvblxuICAqIEBuYW1lIExpc3RlbmVyI29uQmlnU3RlcEJlZ2luXG4gICovXG5cbiAgLyoqXG4gICogQGZ1bmN0aW9uXG4gICogQG5hbWUgTGlzdGVuZXIjb25CaWdTdGVwUmVzdW1lXG4gICovXG5cbiAgLyoqXG4gICogQGZ1bmN0aW9uXG4gICogQG5hbWUgTGlzdGVuZXIjb25CaWdTdGVwU3VzcGVuZFxuICAqL1xuXG4gIC8qKlxuICAqIEBmdW5jdGlvblxuICAqIEBuYW1lIExpc3RlbmVyI29uQmlnU3RlcEVuZFxuICAqL1xuXG4gIC8qKlxuICAqIEBmdW5jdGlvblxuICAqIEBuYW1lIExpc3RlbmVyI29uU21hbGxTdGVwQmVnaW5cbiAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgKi9cblxuICAvKipcbiAgKiBAZnVuY3Rpb25cbiAgKiBAbmFtZSBMaXN0ZW5lciNvblNtYWxsU3RlcEVuZFxuICAqL1xuXG5cbiAgLyoqIFxuICAqIFByb3ZpZGVzIGEgZ2VuZXJpYyBtZWNoYW5pc20gdG8gc3Vic2NyaWJlIHRvIHN0YXRlIGNoYW5nZSBhbmQgcnVudGltZVxuICAqIGVycm9yIG5vdGlmaWNhdGlvbnMuICBDYW4gYmUgdXNlZCBmb3IgbG9nZ2luZyBhbmQgZGVidWdnaW5nLiBGb3IgZXhhbXBsZSxcbiAgKiBjYW4gYXR0YWNoIGEgbG9nZ2VyIHRoYXQgc2ltcGx5IGxvZ3MgdGhlIHN0YXRlIGNoYW5nZXMuICBPciBjYW4gYXR0YWNoIGFcbiAgKiBuZXR3b3JrIGRlYnVnZ2luZyBjbGllbnQgdGhhdCBzZW5kcyBzdGF0ZSBjaGFuZ2Ugbm90aWZpY2F0aW9ucyB0byBhXG4gICogZGVidWdnaW5nIHNlcnZlci5cbiAgKiBUaGlzIGlzIGFuIGFsdGVybmF0aXZlIGludGVyZmFjZSB0byB7QGxpbmsgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSNvbn0uXG4gICogQG1lbWJlcm9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUgXG4gICogQHBhcmFtIHtMaXN0ZW5lcn0gbGlzdGVuZXJcbiAgKi9cbiAgcmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lcil7XG4gICAgICBCYXNlSW50ZXJwcmV0ZXIuRVZFTlRTLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZihsaXN0ZW5lcltldmVudF0pIHRoaXMub24oZXZlbnQsbGlzdGVuZXJbZXZlbnRdKTtcbiAgICAgIH0sIHRoaXMpO1xuICB9XG5cbiAgLyoqIFxuICAqIFVucmVnaXN0ZXIgYSBMaXN0ZW5lclxuICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyXG4gICovXG4gIHVucmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lcil7XG4gICAgICBCYXNlSW50ZXJwcmV0ZXIuRVZFTlRTLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZihsaXN0ZW5lcltldmVudF0pIHRoaXMub2ZmKGV2ZW50LGxpc3RlbmVyW2V2ZW50XSk7XG4gICAgICB9LCB0aGlzKTtcbiAgfVxuXG4gIC8qKiBcbiAgKiBRdWVyeSB0aGUgbW9kZWwgdG8gZ2V0IGFsbCB0cmFuc2l0aW9uIGV2ZW50cy5cbiAgKiBAcmV0dXJuIHtBcnJheTxzdHJpbmc+fSBUcmFuc2l0aW9uIGV2ZW50cy5cbiAgKiBAbWVtYmVyb2YgQmFzZUludGVycHJldGVyLnByb3RvdHlwZSBcbiAgKi9cbiAgZ2V0QWxsVHJhbnNpdGlvbkV2ZW50cygpe1xuICAgICAgdmFyIGV2ZW50cyA9IHt9O1xuICAgICAgZnVuY3Rpb24gZ2V0RXZlbnRzKHN0YXRlKXtcblxuICAgICAgICAgIGlmKHN0YXRlLnRyYW5zaXRpb25zKXtcbiAgICAgICAgICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCB0eExlbiA9IHN0YXRlLnRyYW5zaXRpb25zLmxlbmd0aDsgdHhJZHggPCB0eExlbjsgdHhJZHgrKykge1xuICAgICAgICAgICAgICAgICAgZXZlbnRzW3N0YXRlLnRyYW5zaXRpb25zW3R4SWR4XS5ldmVudF0gPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoc3RhdGUuc3RhdGVzKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIHN0YXRlSWR4ID0gMCwgc3RhdGVMZW4gPSBzdGF0ZS5zdGF0ZXMubGVuZ3RoOyBzdGF0ZUlkeCA8IHN0YXRlTGVuOyBzdGF0ZUlkeCsrKSB7XG4gICAgICAgICAgICAgICAgICBnZXRFdmVudHMoc3RhdGUuc3RhdGVzW3N0YXRlSWR4XSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdldEV2ZW50cyh0aGlzLl9tb2RlbCk7XG5cbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhldmVudHMpO1xuICB9XG5cbiAgLyoqXG4gICogVGhyZWUgdGhpbmdzIGNhcHR1cmUgdGhlIGN1cnJlbnQgc25hcHNob3Qgb2YgYSBydW5uaW5nIFNDSU9OIGludGVycHJldGVyOlxuICAqXG4gICogICAgICA8dWw+XG4gICogICAgICA8bGk+IGJhc2ljIGNvbmZpZ3VyYXRpb24gKHRoZSBzZXQgb2YgYmFzaWMgc3RhdGVzIHRoZSBzdGF0ZSBtYWNoaW5lIGlzIGluKTwvbGk+XG4gICogICAgICA8bGk+IGhpc3Rvcnkgc3RhdGUgdmFsdWVzICh0aGUgc3RhdGVzIHRoZSBzdGF0ZSBtYWNoaW5lIHdhcyBpbiBsYXN0IHRpbWUgaXQgd2FzIGluIHRoZSBwYXJlbnQgb2YgYSBoaXN0b3J5IHN0YXRlKTwvbGk+XG4gICogICAgICA8bGk+IHRoZSBkYXRhbW9kZWw8L2xpPlxuICAqICAgICAgPC91bD5cbiAgKiAgICAgIFxuICAqIFRoZSBzbmFwc2hvdCBvYmplY3QgY2FuIGJlIHNlcmlhbGl6ZWQgYXMgSlNPTiBhbmQgc2F2ZWQgdG8gYSBkYXRhYmFzZS4gSXQgY2FuXG4gICogbGF0ZXIgYmUgcGFzc2VkIHRvIHRoZSBTQ1hNTCBjb25zdHJ1Y3RvciB0byByZXN0b3JlIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICogdXNpbmcgdGhlIHNuYXBzaG90IGFyZ3VtZW50LlxuICAqXG4gICogQHJldHVybiB7U25hcHNob3R9IFxuICAqIEBtZW1iZXJvZiBCYXNlSW50ZXJwcmV0ZXIucHJvdG90eXBlIFxuICAqL1xuICBnZXRTbmFwc2hvdCgpe1xuICAgIHJldHVybiBbXG4gICAgICB0aGlzLmdldENvbmZpZ3VyYXRpb24oKSxcbiAgICAgIHRoaXMuX3NlcmlhbGl6ZUhpc3RvcnkoKSxcbiAgICAgIHRoaXMuX2lzSW5GaW5hbFN0YXRlLFxuICAgICAgdGhpcy5fbW9kZWwuJHNlcmlhbGl6ZURhdGFtb2RlbCgpLFxuICAgICAgdGhpcy5faW50ZXJuYWxFdmVudFF1ZXVlLnNsaWNlKClcbiAgICBdO1xuICB9XG5cbiAgX3NlcmlhbGl6ZUhpc3RvcnkoKXtcbiAgICB2YXIgbyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX2hpc3RvcnlWYWx1ZSkuZm9yRWFjaChmdW5jdGlvbihzaWQpe1xuICAgICAgb1tzaWRdID0gdGhpcy5faGlzdG9yeVZhbHVlW3NpZF0ubWFwKGZ1bmN0aW9uKHN0YXRlKXtyZXR1cm4gc3RhdGUuaWR9KTtcbiAgICB9LHRoaXMpO1xuICAgIHJldHVybiBvO1xuICB9XG5cblxuICAvKipcbiAgICogQGludGVyZmFjZSBFdmVudFxuICAgKi9cblxuICAvKiogXG4gICogQG1lbWJlciBuYW1lXG4gICogQG1lbWJlcm9mIEV2ZW50LnByb3RvdHlwZSBcbiAgKiBAdHlwZSBzdHJpbmdcbiAgKiBAZGVzY3JpcHRpb24gVGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gICovXG5cbiAgLyoqIFxuICAqIEBtZW1iZXIgZGF0YVxuICAqIEBtZW1iZXJvZiBFdmVudC5wcm90b3R5cGUgXG4gICogQHR5cGUgYW55XG4gICogQGRlc2NyaXB0aW9uIFRoZSBldmVudCBkYXRhXG4gICovXG5cbiAgLyoqIFxuICAqIEFuIFNDWE1MIGludGVycHJldGVyIHRha2VzIFNDWE1MIGV2ZW50cyBhcyBpbnB1dCwgd2hlcmUgYW4gU0NYTUwgZXZlbnQgaXMgYW5cbiAgKiBvYmplY3Qgd2l0aCBcIm5hbWVcIiBhbmQgXCJkYXRhXCIgcHJvcGVydGllcy4gVGhlc2UgY2FuIGJlIHBhc3NlZCB0byBtZXRob2QgYGdlbmBcbiAgKiBhcyB0d28gcG9zaXRpb25hbCBhcmd1bWVudHMsIG9yIGFzIGEgc2luZ2xlIG9iamVjdC5cbiAgKiBAcGFyYW0ge3N0cmluZ3xFdmVudH0gZXZ0T2JqT3JOYW1lXG4gICogQHBhcmFtIHthbnk9fSBvcHRpb25hbERhdGFcbiAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRW50cnlcbiAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdFxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25UcmFuc2l0aW9uXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkRlZmF1bHRFbnRyeVxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FcnJvclxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwQmVnaW5cbiAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uQmlnU3RlcEVuZFxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwU3VzcGVuZFxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwUmVzdW1lXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEJlZ2luXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblNtYWxsU3RlcEVuZFxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkV4aXRJbnRlcnByZXRlclxuICAqL1xuICBnZW4oZXZ0T2JqT3JOYW1lLG9wdGlvbmFsRGF0YSkge1xuICAgIHZhciBjdXJyZW50RXZlbnQ7XG4gICAgc3dpdGNoKHR5cGVvZiBldnRPYmpPck5hbWUpe1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgY3VycmVudEV2ZW50ID0ge25hbWUgOiBldnRPYmpPck5hbWUsIGRhdGEgOiBvcHRpb25hbERhdGF9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmKHR5cGVvZiBldnRPYmpPck5hbWUubmFtZSA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgIGN1cnJlbnRFdmVudCA9IGV2dE9iak9yTmFtZTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBvYmplY3QgbXVzdCBoYXZlIFwibmFtZVwiIHByb3BlcnR5IG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBnZW4gbXVzdCBiZSBhIHN0cmluZyBvciBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgaWYodGhpcy5faXNTdGVwcGluZykgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBnZW4gZHVyaW5nIGEgYmlnLXN0ZXAnKTtcblxuICAgIC8vb3RoZXJ3aXNlLCBraWNrIGhpbSBvZmZcbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gdHJ1ZTtcblxuICAgIHRoaXMuX3BlcmZvcm1CaWdTdGVwKGN1cnJlbnRFdmVudCk7XG5cbiAgICB0aGlzLl9pc1N0ZXBwaW5nID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICogSW5qZWN0cyBhbiBleHRlcm5hbCBldmVudCBpbnRvIHRoZSBpbnRlcnByZXRlciBhc3luY2hyb25vdXNseVxuICAqIEBwYXJhbSB7RXZlbnR9ICBjdXJyZW50RXZlbnQgVGhlIGV2ZW50IHRvIGluamVjdFxuICAqIEBwYXJhbSB7Z2VuQ2FsbGJhY2t9IGNiIENhbGxiYWNrIGludm9rZWQgd2l0aCBhbiBlcnJvciBvciB0aGUgaW50ZXJwcmV0ZXIncyBzdGFibGUgY29uZmlndXJhdGlvblxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FbnRyeVxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25FeGl0XG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvblRyYW5zaXRpb25cbiAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRGVmYXVsdEVudHJ5XG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkVycm9yXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBCZWdpblxuICAqIEBlbWl0cyBzY2lvbi5CYXNlSW50ZXJwcmV0ZXIjb25CaWdTdGVwRW5kXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBTdXNwZW5kXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBSZXN1bWVcbiAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwQmVnaW5cbiAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uU21hbGxTdGVwRW5kXG4gICogQGVtaXRzIHNjaW9uLkJhc2VJbnRlcnByZXRlciNvbkJpZ1N0ZXBFbmRcbiAgKiBAZW1pdHMgc2Npb24uQmFzZUludGVycHJldGVyI29uRXhpdEludGVycHJldGVyXG4gICovXG4gIGdlbkFzeW5jKGN1cnJlbnRFdmVudCwgY2IpIHtcbiAgICBpZiAoY3VycmVudEV2ZW50ICE9PSBudWxsICYmICh0eXBlb2YgY3VycmVudEV2ZW50ICE9PSAnb2JqZWN0JyB8fCAhY3VycmVudEV2ZW50IHx8IHR5cGVvZiBjdXJyZW50RXZlbnQubmFtZSAhPT0gJ3N0cmluZycpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGN1cnJlbnRFdmVudCB0byBiZSBudWxsIG9yIGFuIE9iamVjdCB3aXRoIGEgbmFtZScpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYiA9IG5vcDtcbiAgICB9XG5cbiAgICB0aGlzLl9leHRlcm5hbEV2ZW50UXVldWUucHVzaChbY3VycmVudEV2ZW50LCBjYl0pO1xuXG4gICAgLy90aGUgc2VtYW50aWNzIHdlIHdhbnQgYXJlIHRvIHJldHVybiB0byB0aGUgY2IgdGhlIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyB0aGF0IHBhcnRpY3VsYXIgZXZlbnQuXG4gICAgZnVuY3Rpb24gbmV4dFN0ZXAoZSwgYyl7XG4gICAgICB0aGlzLl9wZXJmb3JtQmlnU3RlcEFzeW5jKGUsIGZ1bmN0aW9uKGVyciwgY29uZmlnKSB7XG4gICAgICAgIGMoZXJyLCBjb25maWcpO1xuXG4gICAgICAgIGlmKHRoaXMuX2V4dGVybmFsRXZlbnRRdWV1ZS5sZW5ndGgpe1xuICAgICAgICAgIG5leHRTdGVwLmFwcGx5KHRoaXMsdGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLnNoaWZ0KCkpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICB0aGlzLl9pc1N0ZXBwaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmKCF0aGlzLl9pc1N0ZXBwaW5nKXsgXG4gICAgICB0aGlzLl9pc1N0ZXBwaW5nID0gdHJ1ZTtcbiAgICAgIG5leHRTdGVwLmFwcGx5KHRoaXMsdGhpcy5fZXh0ZXJuYWxFdmVudFF1ZXVlLnNoaWZ0KCkpO1xuICAgIH1cbiAgfVxufVxuXG5CYXNlSW50ZXJwcmV0ZXIuRVZFTlRTID0gW1xuICAnb25FbnRyeScsXG4gICdvbkV4aXQnLFxuICAnb25UcmFuc2l0aW9uJyxcbiAgJ29uRGVmYXVsdEVudHJ5JyxcbiAgJ29uRXJyb3InLFxuICAnb25CaWdTdGVwQmVnaW4nLFxuICAnb25CaWdTdGVwRW5kJyxcbiAgJ29uQmlnU3RlcFN1c3BlbmQnLFxuICAnb25CaWdTdGVwUmVzdW1lJyxcbiAgJ29uU21hbGxTdGVwQmVnaW4nLFxuICAnb25TbWFsbFN0ZXBFbmQnLFxuICAnb25CaWdTdGVwRW5kJyxcbiAgJ29uRXhpdEludGVycHJldGVyJ1xuXTtcblxuLy9zb21lIGdsb2JhbCBzaW5nbGV0b25zIHRvIHVzZSB0byBnZW5lcmF0ZSBpbi1tZW1vcnkgc2Vzc2lvbiBpZHMsIGluIGNhc2UgdGhlIHVzZXIgZG9lcyBub3Qgc3BlY2lmeSB0aGVzZSBkYXRhIHN0cnVjdHVyZXNcbkJhc2VJbnRlcnByZXRlci5zZXNzaW9uSWRDb3VudGVyID0gMTtcbkJhc2VJbnRlcnByZXRlci5nZW5lcmF0ZVNlc3Npb25pZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBCYXNlSW50ZXJwcmV0ZXIuc2Vzc2lvbklkQ291bnRlcisrO1xufVxuQmFzZUludGVycHJldGVyLnNlc3Npb25SZWdpc3RyeSA9IG5ldyBNYXAoKTtcblxuLyoqIFxuICogQGRlc2NyaXB0aW9uIEltcGxlbWVudHMgU0NJT04gbGVnYWN5IHNlbWFudGljcy4gU2VlIHtAbGluayBzY2lvbi5CYXNlSW50ZXJwcmV0ZXJ9IGZvciBpbmZvcm1hdGlvbiBvbiB0aGUgY29uc3RydWN0b3IgYXJndW1lbnRzLlxuICogQGNsYXNzIFN0YXRlY2hhcnRcbiAqIEBleHRlbmRzIEJhc2VJbnRlcnByZXRlclxuICovXG5jbGFzcyBTdGF0ZWNoYXJ0IGV4dGVuZHMgQmFzZUludGVycHJldGVye1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsT3JNb2RlbEZhY3RvcnksIG9wdHMpe1xuXG4gICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgb3B0cy5sZWdhY3lTZW1hbnRpY3MgPSB0cnVlO1xuXG4gICAgc3VwZXIobW9kZWxPck1vZGVsRmFjdG9yeSwgb3B0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3NlbGVjdFRyYW5zaXRpb25zKGN1cnJlbnRFdmVudCwgc2VsZWN0RXZlbnRsZXNzVHJhbnNpdGlvbnMpIHtcbiAgICBpZiAodGhpcy5vcHRzLm9ubHlTZWxlY3RGcm9tQmFzaWNTdGF0ZXMpIHtcbiAgICAgIHZhciBzdGF0ZXMgPSB0aGlzLl9jb25maWd1cmF0aW9uLml0ZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YXRlc0FuZFBhcmVudHMgPSBuZXcgdGhpcy5vcHRzLlNldDtcblxuICAgICAgLy9nZXQgZnVsbCBjb25maWd1cmF0aW9uLCB1bm9yZGVyZWRcbiAgICAgIC8vdGhpcyBtZWFucyB3ZSBtYXkgc2VsZWN0IHRyYW5zaXRpb25zIGZyb20gcGFyZW50cyBiZWZvcmUgc3RhdGVzXG4gICAgICB2YXIgY29uZmlnTGlzdCA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uaXRlcigpO1xuICAgICAgZm9yICh2YXIgaWR4ID0gMCwgbGVuID0gY29uZmlnTGlzdC5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgICAgdmFyIGJhc2ljU3RhdGUgPSBjb25maWdMaXN0W2lkeF07XG4gICAgICAgIHN0YXRlc0FuZFBhcmVudHMuYWRkKGJhc2ljU3RhdGUpO1xuICAgICAgICB2YXIgYW5jZXN0b3JzID0gcXVlcnkuZ2V0QW5jZXN0b3JzKGJhc2ljU3RhdGUpO1xuICAgICAgICBmb3IgKHZhciBhbmNJZHggPSAwLCBhbmNMZW4gPSBhbmNlc3RvcnMubGVuZ3RoOyBhbmNJZHggPCBhbmNMZW47IGFuY0lkeCsrKSB7XG4gICAgICAgICAgc3RhdGVzQW5kUGFyZW50cy5hZGQoYW5jZXN0b3JzW2FuY0lkeF0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0YXRlcyA9IHN0YXRlc0FuZFBhcmVudHMuaXRlcigpO1xuICAgIH1cblxuICAgIHZhciB0cmFuc2l0aW9uU2VsZWN0b3IgPSB0aGlzLm9wdHMudHJhbnNpdGlvblNlbGVjdG9yO1xuICAgIHZhciBlbmFibGVkVHJhbnNpdGlvbnMgPSBuZXcgdGhpcy5vcHRzLlNldCgpO1xuXG4gICAgdmFyIGUgPSB0aGlzLl9ldmFsdWF0ZUFjdGlvbi5iaW5kKHRoaXMsY3VycmVudEV2ZW50KTtcblxuICAgIGZvciAodmFyIHN0YXRlSWR4ID0gMCwgc3RhdGVMZW4gPSBzdGF0ZXMubGVuZ3RoOyBzdGF0ZUlkeCA8IHN0YXRlTGVuOyBzdGF0ZUlkeCsrKSB7XG4gICAgICBsZXQgdHJhbnNpdGlvbnMgPSBzdGF0ZXNbc3RhdGVJZHhdLnRyYW5zaXRpb25zO1xuICAgICAgZm9yICh2YXIgdHhJZHggPSAwLCBsZW4gPSB0cmFuc2l0aW9ucy5sZW5ndGg7IHR4SWR4IDwgbGVuOyB0eElkeCsrKSB7XG4gICAgICAgIGNvbnN0IHQgPSB0cmFuc2l0aW9uc1t0eElkeF07XG4gICAgICAgIGlmKHRyYW5zaXRpb25TZWxlY3Rvcih0LCBjdXJyZW50RXZlbnQsIGUsIHNlbGVjdEV2ZW50bGVzc1RyYW5zaXRpb25zKSl7XG4gICAgICAgICAgZW5hYmxlZFRyYW5zaXRpb25zLmFkZCh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucyA9IHRoaXMuX3NlbGVjdFByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zKGVuYWJsZWRUcmFuc2l0aW9ucyk7XG5cbiAgICB0aGlzLl9sb2coXCJwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9uc1wiLCBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucyk7XG5cbiAgICByZXR1cm4gcHJpb3JpdHlFbmFibGVkVHJhbnNpdGlvbnM7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3NlbGVjdFByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zKGVuYWJsZWRUcmFuc2l0aW9ucykge1xuICAgIHZhciBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucyA9IG5ldyB0aGlzLm9wdHMuU2V0KCk7XG5cbiAgICB2YXIgdHVwbGUgPSB0aGlzLl9nZXRJbmNvbnNpc3RlbnRUcmFuc2l0aW9ucyhlbmFibGVkVHJhbnNpdGlvbnMpLCBcbiAgICAgICAgY29uc2lzdGVudFRyYW5zaXRpb25zID0gdHVwbGVbMF0sIFxuICAgICAgICBpbmNvbnNpc3RlbnRUcmFuc2l0aW9uc1BhaXJzID0gdHVwbGVbMV07XG5cbiAgICBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucy51bmlvbihjb25zaXN0ZW50VHJhbnNpdGlvbnMpO1xuXG4gICAgdGhpcy5fbG9nKFwiZW5hYmxlZFRyYW5zaXRpb25zXCIsIGVuYWJsZWRUcmFuc2l0aW9ucyk7XG4gICAgdGhpcy5fbG9nKFwiY29uc2lzdGVudFRyYW5zaXRpb25zXCIsIGNvbnNpc3RlbnRUcmFuc2l0aW9ucyk7XG4gICAgdGhpcy5fbG9nKFwiaW5jb25zaXN0ZW50VHJhbnNpdGlvbnNQYWlyc1wiLCBpbmNvbnNpc3RlbnRUcmFuc2l0aW9uc1BhaXJzKTtcbiAgICB0aGlzLl9sb2coXCJwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9uc1wiLCBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucyk7XG5cbiAgICB3aGlsZSAoIWluY29uc2lzdGVudFRyYW5zaXRpb25zUGFpcnMuaXNFbXB0eSgpKSB7XG4gICAgICBlbmFibGVkVHJhbnNpdGlvbnMgPSBuZXcgdGhpcy5vcHRzLlNldChcbiAgICAgICAgICBpbmNvbnNpc3RlbnRUcmFuc2l0aW9uc1BhaXJzLml0ZXIoKS5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMub3B0cy5wcmlvcml0eUNvbXBhcmlzb25Gbih0KTt9LHRoaXMpKTtcblxuICAgICAgdHVwbGUgPSB0aGlzLl9nZXRJbmNvbnNpc3RlbnRUcmFuc2l0aW9ucyhlbmFibGVkVHJhbnNpdGlvbnMpO1xuICAgICAgY29uc2lzdGVudFRyYW5zaXRpb25zID0gdHVwbGVbMF07IFxuICAgICAgaW5jb25zaXN0ZW50VHJhbnNpdGlvbnNQYWlycyA9IHR1cGxlWzFdO1xuXG4gICAgICBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucy51bmlvbihjb25zaXN0ZW50VHJhbnNpdGlvbnMpO1xuXG4gICAgICB0aGlzLl9sb2coXCJlbmFibGVkVHJhbnNpdGlvbnNcIiwgZW5hYmxlZFRyYW5zaXRpb25zKTtcbiAgICAgIHRoaXMuX2xvZyhcImNvbnNpc3RlbnRUcmFuc2l0aW9uc1wiLCBjb25zaXN0ZW50VHJhbnNpdGlvbnMpO1xuICAgICAgdGhpcy5fbG9nKFwiaW5jb25zaXN0ZW50VHJhbnNpdGlvbnNQYWlyc1wiLCBpbmNvbnNpc3RlbnRUcmFuc2l0aW9uc1BhaXJzKTtcbiAgICAgIHRoaXMuX2xvZyhcInByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zXCIsIHByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zKTtcblxuICAgIH1cbiAgICByZXR1cm4gcHJpb3JpdHlFbmFibGVkVHJhbnNpdGlvbnM7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldEluY29uc2lzdGVudFRyYW5zaXRpb25zKHRyYW5zaXRpb25zKSB7XG4gICAgdmFyIGFsbEluY29uc2lzdGVudFRyYW5zaXRpb25zID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcbiAgICB2YXIgaW5jb25zaXN0ZW50VHJhbnNpdGlvbnNQYWlycyA9IG5ldyB0aGlzLm9wdHMuU2V0KCk7XG4gICAgdmFyIHRyYW5zaXRpb25MaXN0ID0gdHJhbnNpdGlvbnMuaXRlcigpO1xuXG4gICAgdGhpcy5fbG9nKFwidHJhbnNpdGlvbnNcIiwgdHJhbnNpdGlvbnMpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRyYW5zaXRpb25MaXN0Lmxlbmd0aDsgaSsrKXtcbiAgICAgIGZvcih2YXIgaiA9IGkrMTsgaiA8IHRyYW5zaXRpb25MaXN0Lmxlbmd0aDsgaisrKXtcbiAgICAgICAgdmFyIHQxID0gdHJhbnNpdGlvbkxpc3RbaV07XG4gICAgICAgIHZhciB0MiA9IHRyYW5zaXRpb25MaXN0W2pdO1xuICAgICAgICBpZiAodGhpcy5fY29uZmxpY3RzKHQxLCB0MikpIHtcbiAgICAgICAgICBhbGxJbmNvbnNpc3RlbnRUcmFuc2l0aW9ucy5hZGQodDEpO1xuICAgICAgICAgIGFsbEluY29uc2lzdGVudFRyYW5zaXRpb25zLmFkZCh0Mik7XG4gICAgICAgICAgaW5jb25zaXN0ZW50VHJhbnNpdGlvbnNQYWlycy5hZGQoW3QxLCB0Ml0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNvbnNpc3RlbnRUcmFuc2l0aW9ucyA9IHRyYW5zaXRpb25zLmRpZmZlcmVuY2UoYWxsSW5jb25zaXN0ZW50VHJhbnNpdGlvbnMpO1xuICAgIHJldHVybiBbY29uc2lzdGVudFRyYW5zaXRpb25zLCBpbmNvbnNpc3RlbnRUcmFuc2l0aW9uc1BhaXJzXTtcbiAgfVxuXG4gIF9jb25mbGljdHModDEsIHQyKSB7XG4gICAgcmV0dXJuICF0aGlzLl9pc0FyZW5hT3J0aG9nb25hbCh0MSwgdDIpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9pc0FyZW5hT3J0aG9nb25hbCh0MSwgdDIpIHtcblxuICAgIHRoaXMuX2xvZyhcInRyYW5zaXRpb24gc2NvcGVzXCIsIHQxLnNjb3BlLCB0Mi5zY29wZSk7XG5cbiAgICB2YXIgaXNPcnRob2dvbmFsO1xuICAgIGlzT3J0aG9nb25hbCA9IHF1ZXJ5LmlzT3J0aG9nb25hbFRvKHQxLnNjb3BlIHx8IHQxLnNvdXJjZSwgdDIuc2NvcGUgfHwgdDIuc291cmNlKVxuICAgIFxuICAgIHRoaXMuX2xvZyhcInRyYW5zaXRpb24gc2NvcGVzIGFyZSBvcnRob2dvbmFsP1wiLCBpc09ydGhvZ29uYWwpO1xuXG4gICAgcmV0dXJuIGlzT3J0aG9nb25hbDtcbiAgfVxufVxuXG4vKiogXG4gKiBAZGVzY3JpcHRpb24gSW1wbGVtZW50cyBzZW1hbnRpY3MgZGVzY3JpYmVkIGluIEFsZ29yaXRobSBEIG9mIHRoZSBTQ1hNTCBzcGVjaWZpY2F0aW9uLiBcbiAqIFNlZSB7QGxpbmsgc2Npb24uQmFzZUludGVycHJldGVyfSBmb3IgaW5mb3JtYXRpb24gb24gdGhlIGNvbnN0cnVjdG9yIGFyZ3VtZW50cy5cbiAqIEBjbGFzcyBTQ0ludGVycHJldGVyIFxuICogQGV4dGVuZHMgQmFzZUludGVycHJldGVyXG4gKi9cbmNsYXNzIFNDSW50ZXJwcmV0ZXIgZXh0ZW5kcyBCYXNlSW50ZXJwcmV0ZXJ7XG5cbiAgY29uc3RydWN0b3IobW9kZWxPck1vZGVsRmFjdG9yeSwgb3B0cyl7XG5cbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICBvcHRzLmxlZ2FjeVNlbWFudGljcyA9IGZhbHNlO1xuXG4gICAgc3VwZXIobW9kZWxPck1vZGVsRmFjdG9yeSwgb3B0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3NlbGVjdFRyYW5zaXRpb25zKGN1cnJlbnRFdmVudCwgc2VsZWN0RXZlbnRsZXNzVHJhbnNpdGlvbnMpIHtcbiAgICB2YXIgdHJhbnNpdGlvblNlbGVjdG9yID0gdGhpcy5vcHRzLnRyYW5zaXRpb25TZWxlY3RvcjtcbiAgICB2YXIgZW5hYmxlZFRyYW5zaXRpb25zID0gbmV3IHRoaXMub3B0cy5TZXQoKTtcblxuICAgIHZhciBlID0gdGhpcy5fZXZhbHVhdGVBY3Rpb24uYmluZCh0aGlzLGN1cnJlbnRFdmVudCk7XG5cbiAgICBsZXQgYXRvbWljU3RhdGVzID0gdGhpcy5fY29uZmlndXJhdGlvbi5pdGVyKCkuc29ydCh0cmFuc2l0aW9uQ29tcGFyYXRvcik7XG4gICAgZm9yKGxldCBzdGF0ZSBvZiBhdG9taWNTdGF0ZXMpe1xubG9vcDogZm9yKGxldCBzIG9mIFtzdGF0ZV0uY29uY2F0KHF1ZXJ5LmdldEFuY2VzdG9ycyhzdGF0ZSkpKXtcbiAgICAgICAgZm9yKGxldCB0IG9mIHMudHJhbnNpdGlvbnMpe1xuICAgICAgICAgIGlmKHRyYW5zaXRpb25TZWxlY3Rvcih0LCBjdXJyZW50RXZlbnQsIGUsIHNlbGVjdEV2ZW50bGVzc1RyYW5zaXRpb25zKSl7XG4gICAgICAgICAgICBlbmFibGVkVHJhbnNpdGlvbnMuYWRkKHQpO1xuICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJpb3JpdHlFbmFibGVkVHJhbnNpdGlvbnMgPSB0aGlzLl9yZW1vdmVDb25mbGljdGluZ1RyYW5zaXRpb24oZW5hYmxlZFRyYW5zaXRpb25zKTtcblxuICAgIHRoaXMuX2xvZyhcInByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zXCIsIHByaW9yaXR5RW5hYmxlZFRyYW5zaXRpb25zKTtcblxuICAgIHJldHVybiBwcmlvcml0eUVuYWJsZWRUcmFuc2l0aW9ucztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVtb3ZlQ29uZmxpY3RpbmdUcmFuc2l0aW9uKGVuYWJsZWRUcmFuc2l0aW9ucykge1xuICAgIGxldCBmaWx0ZXJlZFRyYW5zaXRpb25zID0gbmV3IHRoaXMub3B0cy5TZXQoKVxuICAgIC8vdG9MaXN0IHNvcnRzIHRoZSB0cmFuc2l0aW9ucyBpbiB0aGUgb3JkZXIgb2YgdGhlIHN0YXRlcyB0aGF0IHNlbGVjdGVkIHRoZW1cbiAgICBmb3IoIGxldCB0MSBvZiBlbmFibGVkVHJhbnNpdGlvbnMuaXRlcigpKXtcbiAgICAgIGxldCB0MVByZWVtcHRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHRyYW5zaXRpb25zVG9SZW1vdmUgPSBuZXcgU2V0KClcbiAgICAgIGZvciAobGV0IHQyIG9mIGZpbHRlcmVkVHJhbnNpdGlvbnMuaXRlcigpKXtcbiAgICAgICAgLy9UT0RPOiBjYW4gd2UgY29tcHV0ZSB0aGlzIHN0YXRpY2FsbHk/IGZvciBleGFtcGxlLCBieSBjaGVja2luZyBpZiB0aGUgdHJhbnNpdGlvbiBzY29wZXMgYXJlIGFyZW5hIG9ydGhvZ29uYWw/XG4gICAgICAgIGxldCB0MUV4aXRTZXQgPSB0aGlzLl9jb21wdXRlRXhpdFNldChbdDFdKTtcbiAgICAgICAgbGV0IHQyRXhpdFNldCA9IHRoaXMuX2NvbXB1dGVFeGl0U2V0KFt0Ml0pO1xuICAgICAgICBsZXQgaGFzSW50ZXJzZWN0aW9uID0gWy4uLnQxRXhpdFNldF0uc29tZSggcyA9PiB0MkV4aXRTZXQuaGFzKHMpICkgIHx8IFsuLi50MkV4aXRTZXRdLnNvbWUoIHMgPT4gdDFFeGl0U2V0LmhhcyhzKSk7XG4gICAgICAgIHRoaXMuX2xvZygndDFFeGl0U2V0Jyx0MS5zb3VyY2UuaWQsWy4uLnQxRXhpdFNldF0ubWFwKCBzID0+IHMuaWQgKSlcbiAgICAgICAgICB0aGlzLl9sb2coJ3QyRXhpdFNldCcsdDIuc291cmNlLmlkLFsuLi50MkV4aXRTZXRdLm1hcCggcyA9PiBzLmlkICkpXG4gICAgICAgICAgdGhpcy5fbG9nKCdoYXNJbnRlcnNlY3Rpb24nLGhhc0ludGVyc2VjdGlvbilcbiAgICAgICAgICBpZihoYXNJbnRlcnNlY3Rpb24pe1xuICAgICAgICAgICAgaWYodDIuc291cmNlLmRlc2NlbmRhbnRzLmluZGV4T2YodDEuc291cmNlKSA+IC0xKXsgICAgLy9pcyB0aGlzIHRoZSBzYW1lIGFzIGJlaW5nIGFuY2VzdHJhbGx5IHJlbGF0ZWQ/XG4gICAgICAgICAgICAgIHRyYW5zaXRpb25zVG9SZW1vdmUuYWRkKHQyKVxuICAgICAgICAgICAgfWVsc2V7IFxuICAgICAgICAgICAgICB0MVByZWVtcHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoIXQxUHJlZW1wdGVkKXtcbiAgICAgICAgZm9yKGxldCB0MyBvZiB0cmFuc2l0aW9uc1RvUmVtb3ZlKXtcbiAgICAgICAgICBmaWx0ZXJlZFRyYW5zaXRpb25zLnJlbW92ZSh0MylcbiAgICAgICAgfVxuICAgICAgICBmaWx0ZXJlZFRyYW5zaXRpb25zLmFkZCh0MSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyZWRUcmFuc2l0aW9ucztcbiAgfVxufVxuXG4vLyBEbyBub3RoaW5nXG5cbmZ1bmN0aW9uIG5vcCgpIHt9XG5cblxuY2xhc3MgSW50ZXJwcmV0ZXJTY3JpcHRpbmdDb250ZXh0e1xuICBjb25zdHJ1Y3RvcihpbnRlcnByZXRlcil7IFxuICAgIHRoaXMuX2ludGVycHJldGVyID0gaW50ZXJwcmV0ZXI7XG4gICAgdGhpcy5fdGltZW91dE1hcCA9IHt9O1xuICAgIHRoaXMuX2ludm9rZU1hcCA9IHt9O1xuICAgIHRoaXMuX3RpbWVvdXRzID0gbmV3IFNldCgpXG5cbiAgICAvL1JlZ2V4IGZyb206XG4gICAgLy8gIGh0dHA6Ly9kYXJpbmdmaXJlYmFsbC5uZXQvMjAxMC8wNy9pbXByb3ZlZF9yZWdleF9mb3JfbWF0Y2hpbmdfdXJsc1xuICAgIC8vICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82OTI3ODc4XG4gICAgdGhpcy52YWxpZGF0ZVVyaVJlZ2V4ID0gLygjXy4qKXxcXGIoKD86W2Etel1bXFx3LV0rOig/OlxcL3sxLDN9fFthLXowLTklXSl8d3d3XFxkezAsM31bLl18W2EtejAtOS5cXC1dK1suXVthLXpdezIsNH1cXC8pKD86W15cXHMoKTw+XSt8XFwoKFteXFxzKCk8Pl0rfChcXChbXlxccygpPD5dK1xcKSkpKlxcKSkrKD86XFwoKFteXFxzKCk8Pl0rfChcXChbXlxccygpPD5dK1xcKSkpKlxcKXxbXlxcc2AhKClcXFtcXF17fTs6J1wiLiw8Pj/Cq8K74oCc4oCd4oCY4oCZXSkpL2k7XG5cbiAgICB0aGlzLmludm9rZVNlbmRUYXJnZXRSZWdleCA9IC9eI18oLiopJC87XG4gICAgdGhpcy5zY3htbFNlbmRUYXJnZXRSZWdleCA9IC9eI19zY3htbF8oLiopJC87XG4gIH1cblxuXG4gIHJhaXNlKGV2ZW50KXtcbiAgICB0aGlzLl9pbnN0YWxsRGVmYXVsdFByb3BzT25FdmVudChldmVudCwgdHJ1ZSk7XG4gICAgdGhpcy5faW50ZXJwcmV0ZXIuX2ludGVybmFsRXZlbnRRdWV1ZS5wdXNoKGV2ZW50KTsgXG4gIH1cblxuICBwYXJzZVhtbFN0cmluZ0FzRE9NKHhtbFN0cmluZyl7XG4gICAgcmV0dXJuICh0aGlzLl9pbnRlcnByZXRlci5vcHRzLnhtbFBhcnNlciB8fCBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQueG1sUGFyc2VyKS5wYXJzZSh4bWxTdHJpbmcpO1xuICB9XG5cbiAgaW52b2tlKGludm9rZU9iail7XG4gICAgLy9sb29rIHVwIGludm9rZXIgYnkgdHlwZS4gYXNzdW1lIGludm9rZXJzIGFyZSBwYXNzZWQgaW4gYXMgYW4gb3B0aW9uIHRvIGNvbnN0cnVjdG9yXG4gICAgdGhpcy5faW52b2tlTWFwW2ludm9rZU9iai5pZF0gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAodGhpcy5faW50ZXJwcmV0ZXIub3B0cy5pbnZva2VycyB8fCBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQuaW52b2tlcnMpW2ludm9rZU9iai50eXBlXSh0aGlzLl9pbnRlcnByZXRlciwgaW52b2tlT2JqLCAoZXJyLCBzZXNzaW9uKSA9PiB7XG4gICAgICAgIGlmKGVycikgcmV0dXJuIHJlamVjdChlcnIpO1xuXG4gICAgICAgIHRoaXMuX2ludGVycHJldGVyLmVtaXQoJ29uSW52b2tlZFNlc3Npb25Jbml0aWFsaXplZCcsIHNlc3Npb24pO1xuICAgICAgICByZXNvbHZlKHNlc3Npb24pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjYW5jZWxJbnZva2UoaW52b2tlaWQpe1xuICAgIC8vVE9ETzogb24gY2FuY2VsIGludm9rZSBjbGVhbiB1cCB0aGlzLl9pbnZva2VNYXBcbiAgICBsZXQgc2Vzc2lvblByb21pc2UgPSB0aGlzLl9pbnZva2VNYXBbaW52b2tlaWRdO1xuICAgIHRoaXMuX2ludGVycHJldGVyLl9sb2coYGNhbmNlbGxpbmcgc2Vzc2lvbiB3aXRoIGludm9rZWlkICR7aW52b2tlaWR9YCk7XG4gICAgaWYoc2Vzc2lvblByb21pc2Upe1xuICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZyhgc2Vzc2lvblByb21pc2UgZm91bmRgKTtcbiAgICAgIHNlc3Npb25Qcm9taXNlLnRoZW4oIFxuICAgICAgICAoKHNlc3Npb24pID0+IHtcbiAgICAgICAgICB0aGlzLl9pbnRlcnByZXRlci5fbG9nKGByZXNvbHZlZCBzZXNzaW9uICR7aW52b2tlaWR9LiBjYW5jZWxsaW5nLi4uIGApO1xuICAgICAgICAgIHNlc3Npb24uY2FuY2VsKCk7IFxuICAgICAgICAgIC8vY2xlYW4gdXBcbiAgICAgICAgICBkZWxldGUgdGhpcy5faW52b2tlTWFwW2ludm9rZWlkXTtcbiAgICAgICAgfSksIFxuICAgICAgICAoIChlcnIpID0+IHtcbiAgICAgICAgICAvL1RPRE86IGRpc3BhdGNoIGVycm9yIGJhY2sgaW50byB0aGUgc3RhdGUgbWFjaGluZSBhcyBlcnJvci5jb21tdW5pY2F0aW9uXG4gICAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBfaW5zdGFsbERlZmF1bHRQcm9wc09uRXZlbnQoZXZlbnQsaXNJbnRlcm5hbCl7XG4gICAgaWYoIWlzSW50ZXJuYWwpeyBcbiAgICAgIGV2ZW50Lm9yaWdpbiA9IHRoaXMuX2ludGVycHJldGVyLm9wdHMuX3guX2lvcHJvY2Vzc29ycy5zY3htbC5sb2NhdGlvbjsgICAgIC8vVE9ETzogcHJlc2VydmUgb3JpZ2luYWwgb3JpZ2luIHdoZW4gd2UgYXV0b2ZvcndhcmQ/IFxuICAgICAgZXZlbnQub3JpZ2ludHlwZSA9IGV2ZW50LnR5cGUgfHwgU0NYTUxfSU9QUk9DRVNTT1JfVFlQRTtcbiAgICB9XG4gICAgaWYodHlwZW9mIGV2ZW50LnR5cGUgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgIGV2ZW50LnR5cGUgPSBpc0ludGVybmFsID8gJ2ludGVybmFsJyA6ICdleHRlcm5hbCc7XG4gICAgfVxuICAgIFtcbiAgICAgICduYW1lJyxcbiAgICAgICdzZW5kaWQnLFxuICAgICAgJ2ludm9rZWlkJyxcbiAgICAgICdkYXRhJyxcbiAgICAgICdvcmlnaW4nLFxuICAgICAgJ29yaWdpbnR5cGUnXG4gICAgXS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgaWYodHlwZW9mIGV2ZW50W3Byb3BdID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgIGV2ZW50W3Byb3BdID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2VuZChldmVudCwgb3B0aW9ucyl7XG4gICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZygnc2VuZCBldmVudCcsIGV2ZW50LCBvcHRpb25zKTtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgc2VuZFR5cGUgPSBvcHRpb25zLnR5cGUgfHwgU0NYTUxfSU9QUk9DRVNTT1JfVFlQRTtcbiAgICAvL1RPRE86IG1vdmUgdGhlc2Ugb3V0XG4gICAgZnVuY3Rpb24gdmFsaWRhdGVTZW5kKGV2ZW50LCBvcHRpb25zLCBzZW5kQWN0aW9uKXtcbiAgICAgIGlmKGV2ZW50LnRhcmdldCl7XG4gICAgICAgIHZhciB0YXJnZXRJc1ZhbGlkVXJpID0gdGhpcy52YWxpZGF0ZVVyaVJlZ2V4LnRlc3QoZXZlbnQudGFyZ2V0KVxuICAgICAgICBpZighdGFyZ2V0SXNWYWxpZFVyaSl7XG4gICAgICAgICAgdGhyb3cgeyBuYW1lIDogXCJlcnJvci5leGVjdXRpb25cIiwgZGF0YTogJ1RhcmdldCBpcyBub3QgdmFsaWQgVVJJJywgc2VuZGlkOiBldmVudC5zZW5kaWQsIHR5cGUgOiAncGxhdGZvcm0nIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKCBzZW5kVHlwZSAhPT0gU0NYTUxfSU9QUk9DRVNTT1JfVFlQRSkgeyAgLy9UT0RPOiBleHRlbmQgdGhpcyB0byBzdXBwb3J0IEhUVFAsIGFuZCBvdGhlciBJTyBwcm9jZXNzb3JzXG4gICAgICAgIHRocm93IHsgbmFtZSA6IFwiZXJyb3IuZXhlY3V0aW9uXCIsIGRhdGE6ICdVbnN1cHBvcnRlZCBldmVudCBwcm9jZXNzb3IgdHlwZScsIHNlbmRpZDogZXZlbnQuc2VuZGlkLCB0eXBlIDogJ3BsYXRmb3JtJyB9O1xuICAgICAgfVxuXG4gICAgICBzZW5kQWN0aW9uLmNhbGwodGhpcywgZXZlbnQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRTZW5kQWN0aW9uIChldmVudCwgb3B0aW9ucykge1xuXG4gICAgICBpZiggdHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnICkgdGhyb3cgbmV3IEVycm9yKCdEZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUuc2VuZCB3aWxsIG5vdCB3b3JrIHVubGVzcyBzZXRUaW1lb3V0IGlzIGRlZmluZWQgZ2xvYmFsbHkuJyk7XG5cbiAgICAgIHZhciBtYXRjaDtcbiAgICAgIGlmKGV2ZW50LnRhcmdldCA9PT0gJyNfaW50ZXJuYWwnKXtcbiAgICAgICAgdGhpcy5yYWlzZShldmVudCk7XG4gICAgICB9ZWxzZXsgXG4gICAgICAgIHRoaXMuX2luc3RhbGxEZWZhdWx0UHJvcHNPbkV2ZW50KGV2ZW50LCBmYWxzZSk7XG4gICAgICAgIGV2ZW50Lm9yaWdpbnR5cGUgPSBTQ1hNTF9JT1BST0NFU1NPUl9UWVBFOyAgICAgIC8vVE9ETzogZXh0ZW5kIHRoaXMgdG8gc3VwcG9ydCBIVFRQLCBhbmQgb3RoZXIgSU8gcHJvY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE8gOiBwYXJhbXRlcml6ZSB0aGlzIGJhc2VkIG9uIHNlbmQvQHR5cGU/XG4gICAgICAgIGlmKCFldmVudC50YXJnZXQpe1xuICAgICAgICAgIGRvU2VuZC5jYWxsKHRoaXMsIHRoaXMuX2ludGVycHJldGVyKTtcbiAgICAgICAgfWVsc2UgaWYoZXZlbnQudGFyZ2V0ID09PSAnI19wYXJlbnQnKXtcbiAgICAgICAgICBpZih0aGlzLl9pbnRlcnByZXRlci5vcHRzLnBhcmVudFNlc3Npb24pe1xuICAgICAgICAgICAgZXZlbnQuaW52b2tlaWQgPSB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmludm9rZWlkO1xuICAgICAgICAgICAgZG9TZW5kLmNhbGwodGhpcywgdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5wYXJlbnRTZXNzaW9uKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRocm93IHsgbmFtZSA6IFwiZXJyb3IuY29tbXVuaWNhdGlvblwiLCBkYXRhOiAnUGFyZW50IHNlc3Npb24gbm90IHNwZWNpZmllZCcsIHNlbmRpZDogZXZlbnQuc2VuZGlkLCB0eXBlIDogJ3BsYXRmb3JtJyB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKG1hdGNoID0gZXZlbnQudGFyZ2V0Lm1hdGNoKHRoaXMuc2N4bWxTZW5kVGFyZ2V0UmVnZXgpKXtcbiAgICAgICAgICBsZXQgdGFyZ2V0U2Vzc2lvbklkID0gbWF0Y2hbMV07XG4gICAgICAgICAgbGV0IHNlc3Npb24gPSB0aGlzLl9pbnRlcnByZXRlci5vcHRzLnNlc3Npb25SZWdpc3RyeS5nZXQodGFyZ2V0U2Vzc2lvbklkKVxuICAgICAgICAgIGlmKHNlc3Npb24pe1xuICAgICAgICAgICAgZG9TZW5kLmNhbGwodGhpcyxzZXNzaW9uKTtcbiAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyB7bmFtZSA6ICdlcnJvci5jb21tdW5pY2F0aW9uJywgc2VuZGlkOiBldmVudC5zZW5kaWQsIHR5cGUgOiAncGxhdGZvcm0nfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNlIGlmKG1hdGNoID0gZXZlbnQudGFyZ2V0Lm1hdGNoKHRoaXMuaW52b2tlU2VuZFRhcmdldFJlZ2V4KSl7XG4gICAgICAgICAgLy9UT0RPOiB0ZXN0IHRoaXMgY29kZSBwYXRoLlxuICAgICAgICAgIHZhciBpbnZva2VJZCA9IG1hdGNoWzFdXG4gICAgICAgICAgdGhpcy5faW52b2tlTWFwW2ludm9rZUlkXS50aGVuKCAoc2Vzc2lvbikgPT4ge1xuICAgICAgICAgICAgZG9TZW5kLmNhbGwodGhpcyxzZXNzaW9uKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5yZWNvZ25pemVkIHNlbmQgdGFyZ2V0LicpOyAvL1RPRE86IGRpc3BhdGNoIGVycm9yIGJhY2sgaW50byB0aGUgc3RhdGUgbWFjaGluZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRvU2VuZChzZXNzaW9uKXtcbiAgICAgICAgLy9UT0RPOiB3ZSBwcm9iYWJseSBub3cgbmVlZCB0byByZWZhY3RvciBkYXRhIHN0cnVjdHVyZXM6XG4gICAgICAgIC8vICAgIHRoaXMuX3RpbWVvdXRzXG4gICAgICAgIC8vICAgIHRoaXMuX3RpbWVvdXRNYXBcbiAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaWYgKGV2ZW50LnNlbmRpZCkgZGVsZXRlIHRoaXMuX3RpbWVvdXRNYXBbZXZlbnQuc2VuZGlkXTtcbiAgICAgICAgICB0aGlzLl90aW1lb3V0cy5kZWxldGUodGltZW91dE9wdGlvbnMpO1xuICAgICAgICAgIGlmKHRoaXMuX2ludGVycHJldGVyLm9wdHMuZG9TZW5kKXtcbiAgICAgICAgICAgIHRoaXMuX2ludGVycHJldGVyLm9wdHMuZG9TZW5kKHNlc3Npb24sIGV2ZW50KTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHNlc3Npb25bdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5zZW5kQXN5bmMgPyAnZ2VuQXN5bmMnIDogJ2dlbiddKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSwgb3B0aW9ucy5kZWxheSB8fCAwKTtcblxuICAgICAgICB2YXIgdGltZW91dE9wdGlvbnMgPSB7XG4gICAgICAgICAgc2VuZE9wdGlvbnMgOiBvcHRpb25zLFxuICAgICAgICAgIHRpbWVvdXRIYW5kbGUgOiB0aW1lb3V0SGFuZGxlXG4gICAgICAgIH07XG4gICAgICAgIGlmIChldmVudC5zZW5kaWQpIHRoaXMuX3RpbWVvdXRNYXBbZXZlbnQuc2VuZGlkXSA9IHRpbWVvdXRIYW5kbGU7XG4gICAgICAgIHRoaXMuX3RpbWVvdXRzLmFkZCh0aW1lb3V0T3B0aW9ucyk7IFxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHB1Ymxpc2goKXtcbiAgICAgIHRoaXMuX2ludGVycHJldGVyLmVtaXQoZXZlbnQubmFtZSxldmVudC5kYXRhKTtcbiAgICB9XG5cbiAgICAvL2Nob29zZSBzZW5kIGZ1bmN0aW9uXG4gICAgLy9UT0RPOiByZXRoaW5rIGhvdyB0aGlzIGN1c3RvbSBzZW5kIHdvcmtzXG4gICAgdmFyIHNlbmRGbjsgICAgICAgICBcbiAgICBpZihldmVudC50eXBlID09PSAnaHR0cHM6Ly9naXRodWIuY29tL2piZWFyZDQvU0NJT04jcHVibGlzaCcpe1xuICAgICAgc2VuZEZuID0gcHVibGlzaDtcbiAgICB9ZWxzZSBpZih0aGlzLl9pbnRlcnByZXRlci5vcHRzLmN1c3RvbVNlbmQpe1xuICAgICAgc2VuZEZuID0gdGhpcy5faW50ZXJwcmV0ZXIub3B0cy5jdXN0b21TZW5kO1xuICAgIH1lbHNle1xuICAgICAgc2VuZEZuID0gZGVmYXVsdFNlbmRBY3Rpb247XG4gICAgfVxuXG4gICAgb3B0aW9ucz1vcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZyhcInNlbmRpbmcgZXZlbnRcIiwgZXZlbnQubmFtZSwgXCJ3aXRoIGNvbnRlbnRcIiwgZXZlbnQuZGF0YSwgXCJhZnRlciBkZWxheVwiLCBvcHRpb25zLmRlbGF5KTtcblxuICAgIHZhbGlkYXRlU2VuZC5jYWxsKHRoaXMsIGV2ZW50LCBvcHRpb25zLCBzZW5kRm4pO1xuICB9XG5cbiAgY2FuY2VsKHNlbmRpZCl7XG4gICAgaWYodGhpcy5faW50ZXJwcmV0ZXIub3B0cy5jdXN0b21DYW5jZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnRlcnByZXRlci5vcHRzLmN1c3RvbUNhbmNlbC5hcHBseSh0aGlzLCBbc2VuZGlkXSk7XG4gICAgfVxuXG4gICAgaWYoIHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICd1bmRlZmluZWQnICkgdGhyb3cgbmV3IEVycm9yKCdEZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIEJhc2VJbnRlcnByZXRlci5wcm90b3R5cGUuY2FuY2VsIHdpbGwgbm90IHdvcmsgdW5sZXNzIHNldFRpbWVvdXQgaXMgZGVmaW5lZCBnbG9iYWxseS4nKTtcblxuICAgIGlmIChzZW5kaWQgaW4gdGhpcy5fdGltZW91dE1hcCkge1xuICAgICAgdGhpcy5faW50ZXJwcmV0ZXIuX2xvZyhcImNhbmNlbGxpbmcgXCIsIHNlbmRpZCwgXCIgd2l0aCB0aW1lb3V0IGlkIFwiLCB0aGlzLl90aW1lb3V0TWFwW3NlbmRpZF0pO1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRNYXBbc2VuZGlkXSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKG5ldyBFdmVudEVtaXR0ZXIse1xuICAgIEJhc2VJbnRlcnByZXRlcjogQmFzZUludGVycHJldGVyLFxuICAgIFN0YXRlY2hhcnQ6IFN0YXRlY2hhcnQsXG4gICAgU0NJbnRlcnByZXRlcjogU0NJbnRlcnByZXRlcixcbiAgICBBcnJheVNldCA6IEFycmF5U2V0LFxuICAgIFNUQVRFX1RZUEVTIDogY29uc3RhbnRzLlNUQVRFX1RZUEVTLFxuICAgIGluaXRpYWxpemVNb2RlbCA6IGluaXRpYWxpemVNb2RlbCxcbiAgICBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHQgOiBJbnRlcnByZXRlclNjcmlwdGluZ0NvbnRleHRcbn0pO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIF9vbih0eXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLl9saXN0ZW5lcnNbdHlwZV0pKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXSA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbdHlwZV0uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIF9vbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gX19vbmNlKCkge1xuICAgICAgICBmb3IgKHZhciBhcmdzID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5vZmYodHlwZSwgX19vbmNlKTtcbiAgICAgICAgbGlzdGVuZXIuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuXG4gICAgX19vbmNlLmxpc3RlbmVyID0gbGlzdGVuZXI7XG5cbiAgICByZXR1cm4gdGhpcy5vbih0eXBlLCBfX29uY2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiBfb2ZmKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX2xpc3RlbmVyc1t0eXBlXSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbdHlwZV1baV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBfZW1pdCh0eXBlKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX2xpc3RlbmVyc1t0eXBlXSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgYXJncyA9IFtdLCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uZm9yRWFjaChmdW5jdGlvbiBfX2VtaXQobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiJdfQ==
