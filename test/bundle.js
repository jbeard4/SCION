;(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){(function(process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

})(require("__browserify_process"))
},{"__browserify_process":1}],3:[function(require,module,exports){(function(){//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
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
            if(idCount[type] === undefined) idCount[type] = 0;

            var count = idCount[type]++;
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
            state.parent = ancestors[0];

            //add some information to transitions
            state.transitions = state.transitions || [];
            state.transitions.forEach(function(transition){
                transition.documentOrder = documentOrder++; 
                transition.source = state;
            });

            var t2 = traverse.bind(null,[state].concat(ancestors));

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

            //hook up history
            if(state.typeEnum === STATE_TYPES.COMPOSITE ||
                    state.typeEnum === STATE_TYPES.PARALLEL){

                var historyChildren = state.states.filter(function(s){
                    return s.type === 'history';
                }); 

               state.historyRef = historyChildren[0];
            }

            //now it's safe to fill in fake state ids
            if(!state.id){
                state.id = generateId(state.type);
                idToStateMap[state.id] = state;
            }

            //normalize onEntry/onExit, which can be single fn or array
            ['onEntry','onExit'].forEach(function(prop){
                if(typeof state[prop] === 'function'){
                    state[prop] = [state[prop]];
                }
            });
        }

        //TODO: convert events to regular expressions in advance

        function connectTransitionGraph(){
            //normalize as with onEntry/onExit
            transitions.forEach(function(t){
                if(typeof t.onTransition === 'function'){
                    t.onTransition = [t.onTransition];
                }
            });

            transitions.forEach(function(t){
                //normalize "event" attribute into "events" attribute
                if(t.event){
                    t.events = t.event.trim().split(/ +/);
                }
            });

            //hook up targets
            transitions.forEach(function(t){
                if(t.targets || (typeof t.target === 'undefined')) return;   //targets have already been set up

                if(typeof t.target === 'string'){
                    //console.log('here1');
                    var target = idToStateMap[t.target];
                    if(!target) throw new Error('Unable to find target state with id ' + t.target);
                    t.target = target;
                    t.targets = [t.target];
                }else if(Array.isArray(t.target)){
                    //console.log('here2');
                    t.targets = t.target.map(function(target){
                        if(typeof target === 'string'){
                            target = idToStateMap[target];
                            if(!target) throw new Error('Unable to find target state with id ' + t.target);
                            return target;
                        }else{
                            return target;
                        } 
                    }); 
                }else if(typeof t.target === 'object'){
                    t.targets = [t.target];
                }else{
                    throw new Error('Transition target has unknown type: ' + t.target);
                }
            });

            //hook up LCA - optimization
            transitions.forEach(function(t){
                if(t.targets) t.lcca = getLCCA(t.source,t.targets[0]);    //FIXME: we technically do not need to hang onto the lcca. only the scope is used by the algorithm

                t.scope = getScope(t);
                //console.log('scope',t.source.id,t.scope.id,t.targets);
            });
        }

        function getScope(transition){
            //Transition scope is normally the least common compound ancestor (lcca).
            //Internal transitions have a scope equal to the source state.

            var transitionIsReallyInternal = 
                    transition.type === 'internal' &&
                        transition.source.parent &&    //root state won't have parent
                            transition.targets && //does it target its descendants
                                transition.targets.every(
                                    function(target){ return transition.source.descendants.indexOf(target) > -1;});

            if(!transition.targets){
                return transition.source; 
            }else if(transitionIsReallyInternal){
                return transition.source; 
            }else{
                return transition.lcca;
            }
        }

        function getLCCA(s1, s2) {
            //console.log('getLCCA',s1, s2);
            var commonAncestors = [];
            s1.ancestors.forEach(function(anc){
                //console.log('s1.id',s1.id,'anc',anc.id,'anc.typeEnum',anc.typeEnum,'s2.id',s2.id);
                if(anc.typeEnum === STATE_TYPES.COMPOSITE &&
                    anc.descendants.indexOf(s2) > -1){
                    commonAncestors.push(anc);
                }
            });
            //console.log('commonAncestors',s1.id,s2.id,commonAncestors.map(function(s){return s.id;}));
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

        function nameMatch(t, event) {
            return event && event.name &&
                        (t.events.indexOf("*") > -1 ? 
                            true : 
                                t.events.filter(function(tEvent){
                                    return retrieveEventRe(tEvent).test(event.name);
                                }).length);

        }

        return function(state, event, evaluator) {
            return state.transitions.filter(function(t){
                return (!t.events || nameMatch(t,event)) && (!t.cond || evaluator(t.cond));
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
    var printTrace = false;

    /** @constructor */
    function BaseInterpreter(model, opts){
        this._model = initializeModel(model);

        //console.log(require('util').inspect(this._model,false,4));
       
        this.opts = opts || {};

        this.opts.log = opts.log || (typeof console === 'undefined' ? {log : function(){}} : console.log.bind(console));   //rely on global console if this console is undefined
        this.opts.Set = this.opts.Set || ArraySet;
        this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority;
        this.opts.transitionSelector = this.opts.transitionSelector || scxmlPrefixTransitionSelector;

        this._sessionid = this.opts.sessionid || "";

        this._configuration = new this.opts.Set();
        this._historyValue = {};
        this._internalEventQueue = [];
        this._isInFinalState = false;

        //SCXML system variables:
        this._x = {
            _sessionId : opts.sessionId || null,
            _name : model.name || opts.name || null,
            _ioprocessors : opts.ioprocessors || null
        };

        this._listeners = [];

        if(!opts.InterpreterScriptingContext) opts.log('Warning : interpreter scripting context not set');

        this._scriptingContext = opts.InterpreterScriptingContext ? new opts.InterpreterScriptingContext(this) : {}; 
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
            if (e) this._internalEventQueue.push(e);
            var keepGoing = true;
            while (keepGoing) {
                var currentEvent = this._internalEventQueue.shift() || null;

                var selectedTransitions = this._performSmallStep(currentEvent);
                keepGoing = !selectedTransitions.isEmpty();
            }
            this._isInFinalState = this._configuration.iter().every(function(s){ return s.typeEnum === STATE_TYPES.FINAL; });
        },

        /** @private */
        _performSmallStep : function(currentEvent) {

            if (printTrace) this.opts.log("selecting transitions with currentEvent: ", currentEvent);

            var selectedTransitions = this._selectTransitions(currentEvent);

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

                var evaluateAction = this._evaluateAction.bind(this, currentEvent);        //create helper fn that actions can call later on

                statesExited.forEach(function(state){

                    if (printTrace || this.opts.logStatesEnteredAndExited) this.opts.log("exiting ", state.id);

                    //invoke listeners
                    this._listeners.forEach(function(l){
                       if(l.onExit) l.onExit(state.id); 
                    });

                    if(state.onExit !== undefined) state.onExit.forEach(evaluateAction);

                    var f;
                    if (state.historyRef) {
                        if (state.historyRef.isDeep) {
                            f = function(s0) {
                                return s0.typeEnum === STATE_TYPES.BASIC && state.descendants.indexOf(s0) > -1;
                            };
                        } else {
                            f = function(s0) {
                                return s0.parent === state;
                            };
                        }
                        //update history
                        this._historyValue[state.historyRef.id] = statesExited.filter(f);
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

                    if(transition.onTransition !== undefined) transition.onTransition.forEach(evaluateAction);
                },this);
     
                if (printTrace) this.opts.log("executing state enter actions");

                statesEntered.forEach(function(state){

                    if (printTrace || this.opts.logStatesEnteredAndExited) this.opts.log("entering", state.id);

                    this._listeners.forEach(function(l){
                       if(l.onEntry) l.onEntry(state.id); 
                    });

                    if(state.onEntry !== undefined) state.onEntry.forEach(evaluateAction);
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
                    this._internalEventQueue.push(eventsToAddToInnerQueue);
                }

            }

            //if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
            return selectedTransitions;
        },

        /** @private */
        _evaluateAction : function(currentEvent, actionRef) {
            return actionRef.call(this._scriptingContext, currentEvent, this.isIn.bind(this),
                            this._x._sessionId, this._x._name, this._x._ioprocessors, this._x);     //SCXML system variables
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
                        s.states.filter(function(s){return s.typeEnum !== STATE_TYPES.HISTORY;}));
                } else if (s.typeEnum === STATE_TYPES.COMPOSITE) {
                    o.statesToProcess.push(s.initialRef); 
                } else if (s.typeEnum === STATE_TYPES.INITIAL || s.typeEnum === STATE_TYPES.BASIC || s.typeEnum === STATE_TYPES.FINAL) {
                    o.basicStatesToEnter.add(s);
                }
            }

            o.statesProcessed.add(s); 
        },

        /** @private */
        _selectTransitions : function(currentEvent) {
            if (this.opts.onlySelectFromBasicStates) {
                var states = this._configuration.iter();
            } else {
                var statesAndParents = new this.opts.Set;

                //get full configuration, unordered
                //this means we may select transitions from parents before states
                
                this._configuration.iter().forEach(function(basicState){
                    statesAndParents.add(basicState);
                    query.getAncestors(basicState).forEach(function(ancestor){
                        statesAndParents.add(ancestor);
                    });
                },this);

                states = statesAndParents.iter();
            }

            

            var usePrefixMatchingAlgorithm = currentEvent && currentEvent.name && currentEvent.name.search(".");

            var transitionSelector = usePrefixMatchingAlgorithm ? scxmlPrefixTransitionSelector : this.opts.transitionSelector;
            var enabledTransitions = new this.opts.Set();

            var e = this._evaluateAction.bind(this,currentEvent);

            states.forEach(function(state){
                transitionSelector(state,currentEvent,e).forEach(function(t){
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

            if (printTrace) this.opts.log("transition scopes", t1.scope, t2.scope);

            var isOrthogonal = query.isOrthogonalTo(t1.scope, t2.scope);

            if (printTrace) this.opts.log("transition scopes are orthogonal?", isOrthogonal);

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
        //TODO: refactor this to be event emitter? 

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

        opts.InterpreterScriptingContext = opts.InterpreterScriptingContext || InterpreterScriptingContext;

        this._isStepping = false;
        this._externalEventQueue = [];

        BaseInterpreter.call(this,model,opts);     //call super constructor
    }

    function beget(o){
        function F(){}
        F.prototype = o;
        return new F();
    }

    //Statechart.prototype = Object.create(BaseInterpreter.prototype);
    //would like to use Object.create here, but not portable, but it's too complicated to use portably
    Statechart.prototype = beget(BaseInterpreter.prototype);    

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

        this._externalEventQueue.push(e);

        if(this._isStepping) return null;       //we're already looping, we can exit and we'll process this event when the next big-step completes

        //otherwise, kick him off
        this._isStepping = true;

        var currentEvent;
        /*jsl:ignore*/
        while(currentEvent = this._externalEventQueue.shift()){
        /*jsl:end*/
            this._performBigStep(currentEvent);
        }

        this._isStepping = false;
        return this.getConfiguration();
    };

    function InterpreterScriptingContext(interpreter){
        this._interpreter = interpreter;
        this._timeoutMap = {};
    }

    //TODO: consider whether this is the API we would like to expose
    InterpreterScriptingContext.prototype = {
        raise : function(event){
            this._interpreter._internalEventQueue.push(event); 
        },
        send : function(event, options){
            if(options.delay === undefined){
                this.gen(event);
            }else{
                if( typeof setTimeout === 'undefined' ) throw new Error('Default implementation of Statechart.prototype.send will not work unless setTimeout is defined globally.');

                if (printTrace) this._interpreter.opts.log("sending event", event.name, "with content", event.data, "after delay", options.delay);

                var timeoutId = setTimeout(this._interpreter.gen.bind(this._interpreter,event), options.delay || 0);

                if (options.sendid) this._timeoutMap[options.sendid] = timeoutId;
            }
        },
        cancel : function(sendid){

            if( typeof clearTimeout === 'undefined' ) throw new Error('Default implementation of Statechart.prototype.cancel will not work unless setTimeout is defined globally.');

            if (sendid in this._timeoutMap) {
                if (printTrace) this._interpreter.opts.log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);
                clearTimeout(this._timeoutMap[sendid]);
            }
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
        initializeModel : initializeModel,
        /** @expose */
        InterpreterScriptingContext : InterpreterScriptingContext
    };
}));

})()
},{}],4:[function(require,module,exports){module.exports = [
    { name : './more-parallel/test2.test.json', test : require('./more-parallel/test2.test.json'), sc : require('./more-parallel/test2.sc.js') },
    { name : './more-parallel/test0.test.json', test : require('./more-parallel/test0.test.json'), sc : require('./more-parallel/test0.sc.js') },
    { name : './more-parallel/test8.test.json', test : require('./more-parallel/test8.test.json'), sc : require('./more-parallel/test8.sc.js') },
    { name : './more-parallel/test10.test.json', test : require('./more-parallel/test10.test.json'), sc : require('./more-parallel/test10.sc.js') },
    { name : './more-parallel/test9.test.json', test : require('./more-parallel/test9.test.json'), sc : require('./more-parallel/test9.sc.js') },
    { name : './more-parallel/test7.test.json', test : require('./more-parallel/test7.test.json'), sc : require('./more-parallel/test7.sc.js') },
    { name : './more-parallel/test6.test.json', test : require('./more-parallel/test6.test.json'), sc : require('./more-parallel/test6.sc.js') },
    { name : './more-parallel/test3.test.json', test : require('./more-parallel/test3.test.json'), sc : require('./more-parallel/test3.sc.js') },
    { name : './more-parallel/test4.test.json', test : require('./more-parallel/test4.test.json'), sc : require('./more-parallel/test4.sc.js') },
    { name : './more-parallel/test1.test.json', test : require('./more-parallel/test1.test.json'), sc : require('./more-parallel/test1.sc.js') },
    { name : './more-parallel/test5.test.json', test : require('./more-parallel/test5.test.json'), sc : require('./more-parallel/test5.sc.js') },
    { name : './default-initial-state/initial1.test.json', test : require('./default-initial-state/initial1.test.json'), sc : require('./default-initial-state/initial1.sc.js') },
    { name : './default-initial-state/initial2.test.json', test : require('./default-initial-state/initial2.test.json'), sc : require('./default-initial-state/initial2.sc.js') },
    { name : './parallel+interrupt/test2.test.json', test : require('./parallel+interrupt/test2.test.json'), sc : require('./parallel+interrupt/test2.sc.json') },
    { name : './parallel+interrupt/test28.test.json', test : require('./parallel+interrupt/test28.test.json'), sc : require('./parallel+interrupt/test28.sc.json') },
    { name : './parallel+interrupt/test0.test.json', test : require('./parallel+interrupt/test0.test.json'), sc : require('./parallel+interrupt/test0.sc.json') },
    { name : './parallel+interrupt/test16.test.json', test : require('./parallel+interrupt/test16.test.json'), sc : require('./parallel+interrupt/test16.sc.json') },
    { name : './parallel+interrupt/test21.test.json', test : require('./parallel+interrupt/test21.test.json'), sc : require('./parallel+interrupt/test21.sc.json') },
    { name : './parallel+interrupt/test8.test.json', test : require('./parallel+interrupt/test8.test.json'), sc : require('./parallel+interrupt/test8.sc.json') },
    { name : './parallel+interrupt/test15.test.json', test : require('./parallel+interrupt/test15.test.json'), sc : require('./parallel+interrupt/test15.sc.json') },
    { name : './parallel+interrupt/test18.test.json', test : require('./parallel+interrupt/test18.test.json'), sc : require('./parallel+interrupt/test18.sc.json') },
    { name : './parallel+interrupt/test20.test.json', test : require('./parallel+interrupt/test20.test.json'), sc : require('./parallel+interrupt/test20.sc.json') },
    { name : './parallel+interrupt/test17.test.json', test : require('./parallel+interrupt/test17.test.json'), sc : require('./parallel+interrupt/test17.sc.json') },
    { name : './parallel+interrupt/test14.test.json', test : require('./parallel+interrupt/test14.test.json'), sc : require('./parallel+interrupt/test14.sc.json') },
    { name : './parallel+interrupt/test22.test.json', test : require('./parallel+interrupt/test22.test.json'), sc : require('./parallel+interrupt/test22.sc.json') },
    { name : './parallel+interrupt/test29.test.json', test : require('./parallel+interrupt/test29.test.json'), sc : require('./parallel+interrupt/test29.sc.json') },
    { name : './parallel+interrupt/test26.test.json', test : require('./parallel+interrupt/test26.test.json'), sc : require('./parallel+interrupt/test26.sc.json') },
    { name : './parallel+interrupt/test10.test.json', test : require('./parallel+interrupt/test10.test.json'), sc : require('./parallel+interrupt/test10.sc.json') },
    { name : './parallel+interrupt/test19.test.json', test : require('./parallel+interrupt/test19.test.json'), sc : require('./parallel+interrupt/test19.sc.json') },
    { name : './parallel+interrupt/test9.test.json', test : require('./parallel+interrupt/test9.test.json'), sc : require('./parallel+interrupt/test9.sc.json') },
    { name : './parallel+interrupt/test7.test.json', test : require('./parallel+interrupt/test7.test.json'), sc : require('./parallel+interrupt/test7.sc.json') },
    { name : './parallel+interrupt/test27.test.json', test : require('./parallel+interrupt/test27.test.json'), sc : require('./parallel+interrupt/test27.sc.json') },
    { name : './parallel+interrupt/test13.test.json', test : require('./parallel+interrupt/test13.test.json'), sc : require('./parallel+interrupt/test13.sc.json') },
    { name : './parallel+interrupt/test12.test.json', test : require('./parallel+interrupt/test12.test.json'), sc : require('./parallel+interrupt/test12.sc.json') },
    { name : './parallel+interrupt/test6.test.json', test : require('./parallel+interrupt/test6.test.json'), sc : require('./parallel+interrupt/test6.sc.json') },
    { name : './parallel+interrupt/test25.test.json', test : require('./parallel+interrupt/test25.test.json'), sc : require('./parallel+interrupt/test25.sc.json') },
    { name : './parallel+interrupt/test3.test.json', test : require('./parallel+interrupt/test3.test.json'), sc : require('./parallel+interrupt/test3.sc.json') },
    { name : './parallel+interrupt/test11.test.json', test : require('./parallel+interrupt/test11.test.json'), sc : require('./parallel+interrupt/test11.sc.json') },
    { name : './parallel+interrupt/test4.test.json', test : require('./parallel+interrupt/test4.test.json'), sc : require('./parallel+interrupt/test4.sc.json') },
    { name : './parallel+interrupt/test31.test.json', test : require('./parallel+interrupt/test31.test.json'), sc : require('./parallel+interrupt/test31.sc.json') },
    { name : './parallel+interrupt/test30.test.json', test : require('./parallel+interrupt/test30.test.json'), sc : require('./parallel+interrupt/test30.sc.json') },
    { name : './parallel+interrupt/test23.test.json', test : require('./parallel+interrupt/test23.test.json'), sc : require('./parallel+interrupt/test23.sc.json') },
    { name : './parallel+interrupt/test1.test.json', test : require('./parallel+interrupt/test1.test.json'), sc : require('./parallel+interrupt/test1.sc.json') },
    { name : './parallel+interrupt/test24.test.json', test : require('./parallel+interrupt/test24.test.json'), sc : require('./parallel+interrupt/test24.sc.json') },
    { name : './parallel+interrupt/test5.test.json', test : require('./parallel+interrupt/test5.test.json'), sc : require('./parallel+interrupt/test5.sc.json') },
    { name : './assign-current-small-step/test2.test.json', test : require('./assign-current-small-step/test2.test.json'), sc : require('./assign-current-small-step/test2.sc.js') },
    { name : './assign-current-small-step/test0.test.json', test : require('./assign-current-small-step/test0.test.json'), sc : require('./assign-current-small-step/test0.sc.js') },
    { name : './assign-current-small-step/test3.test.json', test : require('./assign-current-small-step/test3.test.json'), sc : require('./assign-current-small-step/test3.sc.js') },
    { name : './assign-current-small-step/test4.test.json', test : require('./assign-current-small-step/test4.test.json'), sc : require('./assign-current-small-step/test4.sc.js') },
    { name : './assign-current-small-step/test1.test.json', test : require('./assign-current-small-step/test1.test.json'), sc : require('./assign-current-small-step/test1.sc.js') },
    { name : './basic/basic1.test.json', test : require('./basic/basic1.test.json'), sc : require('./basic/basic1.sc.json') },
    { name : './basic/basic2.test.json', test : require('./basic/basic2.test.json'), sc : require('./basic/basic2.sc.json') },
    { name : './basic/basic0.test.json', test : require('./basic/basic0.test.json'), sc : require('./basic/basic0.sc.json') },
    { name : './hierarchy+documentOrder/test0.test.json', test : require('./hierarchy+documentOrder/test0.test.json'), sc : require('./hierarchy+documentOrder/test0.sc.json') },
    { name : './hierarchy+documentOrder/test1.test.json', test : require('./hierarchy+documentOrder/test1.test.json'), sc : require('./hierarchy+documentOrder/test1.sc.json') },
    { name : './multiple-events-per-transition/test1.test.json', test : require('./multiple-events-per-transition/test1.test.json'), sc : require('./multiple-events-per-transition/test1.sc.js') },
    { name : './parallel/test2.test.json', test : require('./parallel/test2.test.json'), sc : require('./parallel/test2.sc.json') },
    { name : './parallel/test0.test.json', test : require('./parallel/test0.test.json'), sc : require('./parallel/test0.sc.json') },
    { name : './parallel/test3.test.json', test : require('./parallel/test3.test.json'), sc : require('./parallel/test3.sc.json') },
    { name : './parallel/test1.test.json', test : require('./parallel/test1.test.json'), sc : require('./parallel/test1.sc.json') },
    { name : './foreach/test1.test.json', test : require('./foreach/test1.test.json'), sc : require('./foreach/test1.sc.js') },
    { name : './atom3-basic-tests/m0.test.json', test : require('./atom3-basic-tests/m0.test.json'), sc : require('./atom3-basic-tests/m0.sc.js') },
    { name : './atom3-basic-tests/m3.test.json', test : require('./atom3-basic-tests/m3.test.json'), sc : require('./atom3-basic-tests/m3.sc.js') },
    { name : './atom3-basic-tests/m1.test.json', test : require('./atom3-basic-tests/m1.test.json'), sc : require('./atom3-basic-tests/m1.sc.js') },
    { name : './atom3-basic-tests/m2.test.json', test : require('./atom3-basic-tests/m2.test.json'), sc : require('./atom3-basic-tests/m2.sc.js') },
    { name : './internal-transitions/test0.test.json', test : require('./internal-transitions/test0.test.json'), sc : require('./internal-transitions/test0.sc.js') },
    { name : './internal-transitions/test1.test.json', test : require('./internal-transitions/test1.test.json'), sc : require('./internal-transitions/test1.sc.js') },
    { name : './send-internal/test0.test.json', test : require('./send-internal/test0.test.json'), sc : require('./send-internal/test0.sc.js') },
    { name : './cond-js/test2.test.json', test : require('./cond-js/test2.test.json'), sc : require('./cond-js/test2.sc.js') },
    { name : './cond-js/test0.test.json', test : require('./cond-js/test0.test.json'), sc : require('./cond-js/test0.sc.js') },
    { name : './cond-js/TestConditionalTransition.test.json', test : require('./cond-js/TestConditionalTransition.test.json'), sc : require('./cond-js/TestConditionalTransition.sc.js') },
    { name : './cond-js/test1.test.json', test : require('./cond-js/test1.test.json'), sc : require('./cond-js/test1.sc.js') },
    { name : './documentOrder/documentOrder0.test.json', test : require('./documentOrder/documentOrder0.test.json'), sc : require('./documentOrder/documentOrder0.sc.json') },
    { name : './hierarchy/hier0.test.json', test : require('./hierarchy/hier0.test.json'), sc : require('./hierarchy/hier0.sc.json') },
    { name : './hierarchy/hier1.test.json', test : require('./hierarchy/hier1.test.json'), sc : require('./hierarchy/hier1.sc.json') },
    { name : './hierarchy/hier2.test.json', test : require('./hierarchy/hier2.test.json'), sc : require('./hierarchy/hier2.sc.json') },
    { name : './if-else/test0.test.json', test : require('./if-else/test0.test.json'), sc : require('./if-else/test0.sc.js') },
    { name : './targetless-transition/test2.test.json', test : require('./targetless-transition/test2.test.json'), sc : require('./targetless-transition/test2.sc.js') },
    { name : './targetless-transition/test0.test.json', test : require('./targetless-transition/test0.test.json'), sc : require('./targetless-transition/test0.sc.js') },
    { name : './targetless-transition/test3.test.json', test : require('./targetless-transition/test3.test.json'), sc : require('./targetless-transition/test3.sc.js') },
    { name : './targetless-transition/test1.test.json', test : require('./targetless-transition/test1.test.json'), sc : require('./targetless-transition/test1.sc.js') },
    { name : './script/test2.test.json', test : require('./script/test2.test.json'), sc : require('./script/test2.sc.js') },
    { name : './script/test0.test.json', test : require('./script/test0.test.json'), sc : require('./script/test0.sc.js') },
    { name : './script/test1.test.json', test : require('./script/test1.test.json'), sc : require('./script/test1.sc.js') },
    { name : './raise/send7.test.json', test : require('./raise/send7.test.json'), sc : require('./raise/send7.sc.js') },
    { name : './raise/send8.test.json', test : require('./raise/send8.test.json'), sc : require('./raise/send8.sc.js') },
    { name : './raise/send6.test.json', test : require('./raise/send6.test.json'), sc : require('./raise/send6.sc.js') },
    { name : './raise/send2.test.json', test : require('./raise/send2.test.json'), sc : require('./raise/send2.sc.js') },
    { name : './raise/send4.test.json', test : require('./raise/send4.test.json'), sc : require('./raise/send4.sc.js') },
    { name : './raise/send3.test.json', test : require('./raise/send3.test.json'), sc : require('./raise/send3.sc.js') },
    { name : './raise/send1.test.json', test : require('./raise/send1.test.json'), sc : require('./raise/send1.sc.js') },
    { name : './raise/send5.test.json', test : require('./raise/send5.test.json'), sc : require('./raise/send5.sc.js') },
    { name : './history/history5.test.json', test : require('./history/history5.test.json'), sc : require('./history/history5.sc.json') },
    { name : './history/history2.test.json', test : require('./history/history2.test.json'), sc : require('./history/history2.sc.json') },
    { name : './history/history6.test.json', test : require('./history/history6.test.json'), sc : require('./history/history6.sc.js') },
    { name : './history/history3.test.json', test : require('./history/history3.test.json'), sc : require('./history/history3.sc.json') },
    { name : './history/history1.test.json', test : require('./history/history1.test.json'), sc : require('./history/history1.sc.json') },
    { name : './history/history0.test.json', test : require('./history/history0.test.json'), sc : require('./history/history0.sc.json') },
    { name : './history/history4.test.json', test : require('./history/history4.test.json'), sc : require('./history/history4.sc.json') },
    { name : './scxml-prefix-event-name-matching/test0.test.json', test : require('./scxml-prefix-event-name-matching/test0.test.json'), sc : require('./scxml-prefix-event-name-matching/test0.sc.js') },
    { name : './scxml-prefix-event-name-matching/star0.test.json', test : require('./scxml-prefix-event-name-matching/star0.test.json'), sc : require('./scxml-prefix-event-name-matching/star0.sc.js') },
    { name : './scxml-prefix-event-name-matching/test1.test.json', test : require('./scxml-prefix-event-name-matching/test1.test.json'), sc : require('./scxml-prefix-event-name-matching/test1.sc.js') }
];

},{"./more-parallel/test2.test.json":5,"./more-parallel/test2.sc.js":6,"./more-parallel/test0.test.json":7,"./more-parallel/test0.sc.js":8,"./more-parallel/test8.test.json":9,"./more-parallel/test8.sc.js":10,"./more-parallel/test10.test.json":11,"./more-parallel/test10.sc.js":12,"./more-parallel/test9.test.json":13,"./more-parallel/test9.sc.js":14,"./more-parallel/test7.test.json":15,"./more-parallel/test7.sc.js":16,"./more-parallel/test6.test.json":17,"./more-parallel/test6.sc.js":18,"./more-parallel/test3.test.json":19,"./more-parallel/test3.sc.js":20,"./more-parallel/test4.test.json":21,"./more-parallel/test4.sc.js":22,"./more-parallel/test1.test.json":23,"./more-parallel/test1.sc.js":24,"./more-parallel/test5.test.json":25,"./more-parallel/test5.sc.js":26,"./default-initial-state/initial1.test.json":27,"./default-initial-state/initial1.sc.js":28,"./default-initial-state/initial2.test.json":29,"./default-initial-state/initial2.sc.js":30,"./parallel+interrupt/test2.test.json":31,"./parallel+interrupt/test2.sc.json":32,"./parallel+interrupt/test28.test.json":33,"./parallel+interrupt/test28.sc.json":34,"./parallel+interrupt/test0.test.json":35,"./parallel+interrupt/test0.sc.json":36,"./parallel+interrupt/test16.test.json":37,"./parallel+interrupt/test16.sc.json":38,"./parallel+interrupt/test21.test.json":39,"./parallel+interrupt/test21.sc.json":40,"./parallel+interrupt/test8.test.json":41,"./parallel+interrupt/test8.sc.json":42,"./parallel+interrupt/test15.test.json":43,"./parallel+interrupt/test15.sc.json":44,"./parallel+interrupt/test18.test.json":45,"./parallel+interrupt/test18.sc.json":46,"./parallel+interrupt/test20.test.json":47,"./parallel+interrupt/test20.sc.json":48,"./parallel+interrupt/test17.test.json":49,"./parallel+interrupt/test17.sc.json":50,"./parallel+interrupt/test14.test.json":51,"./parallel+interrupt/test14.sc.json":52,"./parallel+interrupt/test22.test.json":53,"./parallel+interrupt/test22.sc.json":54,"./parallel+interrupt/test29.test.json":55,"./parallel+interrupt/test29.sc.json":56,"./parallel+interrupt/test26.test.json":57,"./parallel+interrupt/test26.sc.json":58,"./parallel+interrupt/test10.test.json":59,"./parallel+interrupt/test10.sc.json":60,"./parallel+interrupt/test19.test.json":61,"./parallel+interrupt/test19.sc.json":62,"./parallel+interrupt/test9.test.json":63,"./parallel+interrupt/test9.sc.json":64,"./parallel+interrupt/test7.test.json":65,"./parallel+interrupt/test7.sc.json":66,"./parallel+interrupt/test27.test.json":67,"./parallel+interrupt/test27.sc.json":68,"./parallel+interrupt/test13.test.json":69,"./parallel+interrupt/test13.sc.json":70,"./parallel+interrupt/test12.test.json":71,"./parallel+interrupt/test12.sc.json":72,"./parallel+interrupt/test6.test.json":73,"./parallel+interrupt/test6.sc.json":74,"./parallel+interrupt/test25.test.json":75,"./parallel+interrupt/test25.sc.json":76,"./parallel+interrupt/test3.test.json":77,"./parallel+interrupt/test3.sc.json":78,"./parallel+interrupt/test11.test.json":79,"./parallel+interrupt/test11.sc.json":80,"./parallel+interrupt/test4.test.json":81,"./parallel+interrupt/test4.sc.json":82,"./parallel+interrupt/test31.test.json":83,"./parallel+interrupt/test31.sc.json":84,"./parallel+interrupt/test30.test.json":85,"./parallel+interrupt/test30.sc.json":86,"./parallel+interrupt/test23.test.json":87,"./parallel+interrupt/test23.sc.json":88,"./parallel+interrupt/test1.test.json":89,"./parallel+interrupt/test1.sc.json":90,"./parallel+interrupt/test24.test.json":91,"./parallel+interrupt/test24.sc.json":92,"./parallel+interrupt/test5.test.json":93,"./parallel+interrupt/test5.sc.json":94,"./assign-current-small-step/test2.test.json":95,"./assign-current-small-step/test2.sc.js":96,"./assign-current-small-step/test0.test.json":97,"./assign-current-small-step/test0.sc.js":98,"./assign-current-small-step/test3.test.json":99,"./assign-current-small-step/test3.sc.js":100,"./assign-current-small-step/test4.test.json":101,"./assign-current-small-step/test4.sc.js":102,"./assign-current-small-step/test1.test.json":103,"./assign-current-small-step/test1.sc.js":104,"./basic/basic1.test.json":105,"./basic/basic1.sc.json":106,"./basic/basic2.test.json":107,"./basic/basic2.sc.json":108,"./basic/basic0.test.json":109,"./basic/basic0.sc.json":110,"./hierarchy+documentOrder/test0.test.json":111,"./hierarchy+documentOrder/test0.sc.json":112,"./hierarchy+documentOrder/test1.test.json":113,"./hierarchy+documentOrder/test1.sc.json":114,"./multiple-events-per-transition/test1.test.json":115,"./multiple-events-per-transition/test1.sc.js":116,"./parallel/test2.test.json":117,"./parallel/test2.sc.json":118,"./parallel/test0.test.json":119,"./parallel/test0.sc.json":120,"./parallel/test3.test.json":121,"./parallel/test3.sc.json":122,"./parallel/test1.test.json":123,"./parallel/test1.sc.json":124,"./foreach/test1.test.json":125,"./foreach/test1.sc.js":126,"./atom3-basic-tests/m0.test.json":127,"./atom3-basic-tests/m0.sc.js":128,"./atom3-basic-tests/m3.test.json":129,"./atom3-basic-tests/m3.sc.js":130,"./atom3-basic-tests/m1.test.json":131,"./atom3-basic-tests/m1.sc.js":132,"./atom3-basic-tests/m2.test.json":133,"./atom3-basic-tests/m2.sc.js":134,"./internal-transitions/test0.test.json":135,"./internal-transitions/test0.sc.js":136,"./internal-transitions/test1.test.json":137,"./internal-transitions/test1.sc.js":138,"./send-internal/test0.test.json":139,"./send-internal/test0.sc.js":140,"./cond-js/test2.test.json":141,"./cond-js/test2.sc.js":142,"./cond-js/test0.test.json":143,"./cond-js/test0.sc.js":144,"./cond-js/TestConditionalTransition.test.json":145,"./cond-js/TestConditionalTransition.sc.js":146,"./cond-js/test1.test.json":147,"./cond-js/test1.sc.js":148,"./documentOrder/documentOrder0.test.json":149,"./documentOrder/documentOrder0.sc.json":150,"./hierarchy/hier0.test.json":151,"./hierarchy/hier0.sc.json":152,"./hierarchy/hier1.test.json":153,"./hierarchy/hier1.sc.json":154,"./hierarchy/hier2.test.json":155,"./hierarchy/hier2.sc.json":156,"./if-else/test0.test.json":157,"./if-else/test0.sc.js":158,"./targetless-transition/test2.test.json":159,"./targetless-transition/test2.sc.js":160,"./targetless-transition/test0.test.json":161,"./targetless-transition/test0.sc.js":162,"./targetless-transition/test3.test.json":163,"./targetless-transition/test3.sc.js":164,"./targetless-transition/test1.test.json":165,"./targetless-transition/test1.sc.js":166,"./script/test2.test.json":167,"./script/test2.sc.js":168,"./script/test0.test.json":169,"./script/test0.sc.js":170,"./script/test1.test.json":171,"./script/test1.sc.js":172,"./raise/send7.test.json":173,"./raise/send7.sc.js":174,"./raise/send8.test.json":175,"./raise/send8.sc.js":176,"./raise/send6.test.json":177,"./raise/send6.sc.js":178,"./raise/send2.test.json":179,"./raise/send2.sc.js":180,"./raise/send4.test.json":181,"./raise/send4.sc.js":182,"./raise/send3.test.json":183,"./raise/send3.sc.js":184,"./raise/send1.test.json":185,"./raise/send1.sc.js":186,"./raise/send5.test.json":187,"./raise/send5.sc.js":188,"./history/history5.test.json":189,"./history/history5.sc.json":190,"./history/history2.test.json":191,"./history/history2.sc.json":192,"./history/history6.test.json":193,"./history/history6.sc.js":194,"./history/history3.test.json":195,"./history/history3.sc.json":196,"./history/history1.test.json":197,"./history/history1.sc.json":198,"./history/history0.test.json":199,"./history/history0.sc.json":200,"./history/history4.test.json":201,"./history/history4.sc.json":202,"./scxml-prefix-event-name-matching/test0.test.json":203,"./scxml-prefix-event-name-matching/test0.sc.js":204,"./scxml-prefix-event-name-matching/star0.test.json":205,"./scxml-prefix-event-name-matching/star0.sc.js":206,"./scxml-prefix-event-name-matching/test1.test.json":207,"./scxml-prefix-event-name-matching/test1.sc.js":208}],5:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1","b1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1","b2"]
        }

    ]
}

},{}],6:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1"
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "b2"
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],7:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a","b"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a","b"]
        }

    ]
}

},{}],8:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "target": "a",
                            "event": "t"
                        }
                    ]
                },
                {
                    "id": "b"
                }
            ]
        }
    ]
};

},{}],9:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["x"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a22","b11"]
        }

    ]
}

},{}],10:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "x",
            "transitions": [
                {
                    "event": "t",
                    "target": "a22"
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "states": [
                        {
                            "id": "a1",
                            "states": [
                                {
                                    "id": "a11"
                                },
                                {
                                    "id": "a12"
                                }
                            ]
                        },
                        {
                            "id": "a2",
                            "states": [
                                {
                                    "id": "a21"
                                },
                                {
                                    "id": "a22"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "states": [
                                {
                                    "id": "b11"
                                },
                                {
                                    "id": "b12"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "states": [
                                {
                                    "id": "b21"
                                },
                                {
                                    "id": "b22"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],11:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a","b"],
    "events" : [ 
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["a","b"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["c"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["d"]
        }
    ]
}

},{}],12:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        x = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_30_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_30_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_30_column_47.apply(this, arguments);
}

function $expr_line_27_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x +1;
}

function $assign_line_27_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_27_column_46.apply(this, arguments);
}

function $cond_line_49_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 6;
}

function $expr_line_38_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_38_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_38_column_51.apply(this, arguments);
}

function $expr_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_51.apply(this, arguments);
}

function $cond_line_43_column_62(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 2;
}

function $cond_line_54_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 8;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "onEntry": $assign_line_27_column_46,
            "onExit": $assign_line_30_column_47,
            "states": [
                {
                    "id": "a",
                    "onEntry": $assign_line_35_column_51,
                    "onExit": $assign_line_38_column_51,
                    "transitions": [
                        {
                            "target": "a",
                            "event": "t1",
                            "cond": $cond_line_43_column_62
                        }
                    ]
                },
                {
                    "id": "b"
                }
            ],
            "transitions": [
                {
                    "target": "c",
                    "event": "t2",
                    "cond": $cond_line_49_column_58
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "t3",
                    "cond": $cond_line_54_column_58
                }
            ]
        },
        {
            "id": "d"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],13:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["x"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a22","b22"]
        }

    ]
}



},{}],14:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "x",
            "transitions": [
                {
                    "event": "t",
                    "target": [
                        "a22",
                        "b22"
                    ]
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "states": [
                        {
                            "id": "a1",
                            "states": [
                                {
                                    "id": "a11"
                                },
                                {
                                    "id": "a12"
                                }
                            ]
                        },
                        {
                            "id": "a2",
                            "states": [
                                {
                                    "id": "a21"
                                },
                                {
                                    "id": "a22"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "states": [
                                {
                                    "id": "b11"
                                },
                                {
                                    "id": "b12"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "states": [
                                {
                                    "id": "b21"
                                },
                                {
                                    "id": "b22"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],15:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a11","b11"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a22","b11"]
        }

    ]
}


},{}],17:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a11","b11"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a11","b12"]
        }

    ]
}

},{}],16:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a22"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1",
                            "states": [
                                {
                                    "id": "a11"
                                },
                                {
                                    "id": "a12"
                                }
                            ]
                        },
                        {
                            "id": "a2",
                            "states": [
                                {
                                    "id": "a21"
                                },
                                {
                                    "id": "a22"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "b22"
                        }
                    ],
                    "states": [
                        {
                            "id": "b1",
                            "states": [
                                {
                                    "id": "b11"
                                },
                                {
                                    "id": "b12"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "states": [
                                {
                                    "id": "b21"
                                },
                                {
                                    "id": "b22"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],18:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a22"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1",
                            "states": [
                                {
                                    "id": "a11"
                                },
                                {
                                    "id": "a12"
                                }
                            ]
                        },
                        {
                            "id": "a2",
                            "states": [
                                {
                                    "id": "a21"
                                },
                                {
                                    "id": "a22"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "states": [
                                {
                                    "id": "b11",
                                    "transitions": [
                                        {
                                            "event": "t",
                                            "target": "b12"
                                        }
                                    ]
                                },
                                {
                                    "id": "b12"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "states": [
                                {
                                    "id": "b21"
                                },
                                {
                                    "id": "b22"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],19:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1","b1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1","b2"]
        }

    ]
}


},{}],20:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1"
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "b2"
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],21:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1","b1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1","b1"]
        }

    ]
}



},{}],22:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1"
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "b"
                        }
                    ],
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],23:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1","b1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1","b1"]
        }

    ]
}

},{}],24:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1"
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],25:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1","b1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2","b1"]
        }

    ]
}




},{}],26:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1"
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "b2"
                        }
                    ],
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],27:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],28:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        }
    ]
};

},{}],30:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        }
    ]
};

},{}],29:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}





},{}],31:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1"]
        }

    ]
}



},{}],32:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a1"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a1"
        }
    ]
}

},{}],33:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2"]
        }

    ]
}



























},{}],34:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c"
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a"
                }
            ]
        },
        {
            "id": "a",
            "initial": "a1",
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2"
                }
            ]
        }
    ]
}

},{}],35:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1"]
        }

    ]
}

},{}],36:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a1"
                        }
                    ]
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        }
    ]
}

},{}],37:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1"]
        }

    ]
}

















},{}],38:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a"
                        }
                    ]
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a",
            "initial": "a1",
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2"
                }
            ]
        }
    ]
}

},{}],39:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c","d2"]
        }

    ]
}






















},{}],40:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a1"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a2"
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        }
    ]
}

},{}],41:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["b1","b2"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c1","c2"]
        }

    ]
}









},{}],42:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "initial": "b",
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ],
                    "transitions": [
                        {
                            "event": "t",
                            "target": "c"
                        }
                    ]
                },
                {
                    "id": "c",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c1"
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],43:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["i1","j","h","g","f1","k"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["i2","j","h","g","f1","k"]
        }

    ]
}
















},{}],44:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "type": "parallel",
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "d",
                                    "type": "parallel",
                                    "states": [
                                        {
                                            "id": "e",
                                            "type": "parallel",
                                            "states": [
                                                {
                                                    "id": "i",
                                                    "initial": "i1",
                                                    "states": [
                                                        {
                                                            "id": "i1",
                                                            "transitions": [
                                                                {
                                                                    "target": "i2",
                                                                    "event": "t"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "id": "i2"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id": "j"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "h"
                                        }
                                    ]
                                },
                                {
                                    "id": "g"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "initial": "f1",
                            "states": [
                                {
                                    "id": "f1",
                                    "transitions": [
                                        {
                                            "target": "l",
                                            "event": "t"
                                        }
                                    ]
                                },
                                {
                                    "id": "f2"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "k"
                }
            ]
        },
        {
            "id": "l"
        }
    ]
}

},{}],45:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2"]
        }

    ]
}



















},{}],46:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c"
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a1"
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        }
    ]
}

},{}],47:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d"]
        }

    ]
}





















},{}],48:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a1"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a2"
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        }
    ]
}

},{}],49:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2"]
        }

    ]
}


















},{}],50:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a",
            "initial": "a1",
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2"
                }
            ]
        }
    ]
}

},{}],51:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["i1","j","h","g","f1","k"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["l"]
        }

    ]
}















},{}],52:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "type": "parallel",
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "d",
                                    "type": "parallel",
                                    "states": [
                                        {
                                            "id": "e",
                                            "type": "parallel",
                                            "states": [
                                                {
                                                    "id": "i",
                                                    "initial": "i1",
                                                    "states": [
                                                        {
                                                            "id": "i1",
                                                            "transitions": [
                                                                {
                                                                    "target": "l",
                                                                    "event": "t"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "id": "i2"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id": "j"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "h"
                                        }
                                    ]
                                },
                                {
                                    "id": "g"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "initial": "f1",
                            "states": [
                                {
                                    "id": "f1",
                                    "transitions": [
                                        {
                                            "target": "f2",
                                            "event": "t"
                                        }
                                    ]
                                },
                                {
                                    "id": "f2"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "k"
                }
            ]
        },
        {
            "id": "l"
        }
    ]
}

},{}],53:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d2"]
        }

    ]
}























},{}],54:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a1"
                }
            ]
        },
        {
            "id": "a1"
        }
    ]
}

},{}],55:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1"]
        }

    ]
}



























},{}],56:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c"
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a2"
                }
            ]
        },
        {
            "id": "a",
            "initial": "a1",
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2"
                }
            ]
        }
    ]
}

},{}],58:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a1"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a2"
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        }
    ]
}

},{}],57:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c","d2"]
        }

    ]
}



























},{}],59:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["b1","b2"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c1","c2"]
        }

    ]
}











},{}],61:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d2"]
        }

    ]
}




















},{}],60:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "initial": "b",
            "transitions": [
                {
                    "event": "t",
                    "target": "c"
                }
            ],
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ]
                },
                {
                    "id": "c",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c1"
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],62:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a1"
                }
            ]
        },
        {
            "id": "a1"
        }
    ]
}

},{}],63:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["b1","b2"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c1","c2"]
        }

    ]
}










},{}],64:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "initial": "b",
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c"
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                },
                {
                    "id": "c",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c1"
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],65:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","e1","f1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c","e2","f2"]
        }

    ]
}








},{}],66:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a1"
                        }
                    ]
                },
                {
                    "id": "d",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "e",
                            "initial": "e1",
                            "states": [
                                {
                                    "id": "e1",
                                    "transitions": [
                                        {
                                            "event": "t",
                                            "target": "e2"
                                        }
                                    ]
                                },
                                {
                                    "id": "e2"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "initial": "f1",
                            "states": [
                                {
                                    "id": "f1",
                                    "transitions": [
                                        {
                                            "event": "t",
                                            "target": "f2"
                                        }
                                    ]
                                },
                                {
                                    "id": "f2"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "a1"
        }
    ]
}

},{}],67:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d2"]
        }

    ]
}



























},{}],68:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a1"
                }
            ]
        },
        {
            "id": "a1"
        }
    ]
}

},{}],69:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["b1","b2"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c1","c2"]
        }

    ]
}














},{}],71:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["b1","b2"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c1","c2"]
        }

    ]
}













},{}],70:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "initial": "b",
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c"
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ],
                    "transitions": [
                        {
                            "event": "t",
                            "target": "d"
                        }
                    ]
                },
                {
                    "id": "c",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c1"
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d"
        }
    ]
}

},{}],72:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "initial": "b",
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "c",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c1"
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d"
        }
    ]
}

},{}],74:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "g",
                    "states": [
                        {
                            "id": "g",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "h"
                                }
                            ]
                        },
                        {
                            "id": "h"
                        }
                    ]
                },
                {
                    "id": "d",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "e",
                            "initial": "e1",
                            "states": [
                                {
                                    "id": "e1",
                                    "transitions": [
                                        {
                                            "event": "t",
                                            "target": "e2"
                                        }
                                    ]
                                },
                                {
                                    "id": "e2"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "initial": "f1",
                            "states": [
                                {
                                    "id": "f1",
                                    "transitions": [
                                        {
                                            "event": "t",
                                            "target": "f2"
                                        }
                                    ]
                                },
                                {
                                    "id": "f2"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],73:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["g","e1","f1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["h","e2","f2"]
        }

    ]
}







},{}],75:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d"]
        }

    ]
}


























},{}],77:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["e","f","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1"]
        }

    ]
}




},{}],76:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a1"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a2"
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        }
    ]
}

},{}],78:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "e",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a1"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a2"
                                }
                            ]
                        }
                    ],
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a3"
                        }
                    ]
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a4"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        },
        {
            "id": "a3"
        },
        {
            "id": "a4"
        }
    ]
}

},{}],79:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["b1","b2"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["d"]
        }

    ]
}












},{}],80:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "initial": "b",
            "states": [
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "c",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c1"
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d"
        }
    ]
}

},{}],81:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["e","f","g"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1"]
        }

    ]
}





},{}],82:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "p",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "e",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a1"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a2"
                                }
                            ]
                        }
                    ],
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a3"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "g",
                    "states": [
                        {
                            "id": "g",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "h"
                                }
                            ]
                        },
                        {
                            "id": "h"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        },
        {
            "id": "a3"
        },
        {
            "id": "a4"
        }
    ]
}

},{}],83:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a1"]
        }

    ]
}



























},{}],84:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a2"
                }
            ]
        },
        {
            "id": "a",
            "initial": "a1",
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2"
                }
            ]
        }
    ]
}

},{}],85:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d"]
        }

    ]
}



























},{}],86:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a2"
                }
            ]
        },
        {
            "id": "a",
            "initial": "a1",
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2"
                }
            ]
        }
    ]
}

},{}],87:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c","d"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2"]
        }

    ]
}
























},{}],88:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c"
                },
                {
                    "id": "d",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a1"
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        }
    ]
}

},{}],89:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d1"]
        }

    ]
}


},{}],90:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a1"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "a1"
        }
    ]
}

},{}],91:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["c1","d1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c2","d2"]
        }

    ]
}

























},{}],92:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "c2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                },
                {
                    "id": "d",
                    "initial": "d1",
                    "states": [
                        {
                            "id": "d1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "d2"
                                }
                            ]
                        },
                        {
                            "id": "d2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "a1"
                }
            ]
        },
        {
            "id": "a1"
        }
    ]
}

},{}],93:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["e","f","g"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["e","f","h"]
        }

    ]
}






},{}],94:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "b",
    "states": [
        {
            "id": "b",
            "type": "parallel",
            "states": [
                {
                    "id": "d",
                    "initial": "g",
                    "states": [
                        {
                            "id": "g",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "h"
                                }
                            ]
                        },
                        {
                            "id": "h"
                        }
                    ]
                },
                {
                    "id": "p",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "e",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a1"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a2"
                                }
                            ]
                        }
                    ],
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a3"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a1"
        },
        {
            "id": "a2"
        },
        {
            "id": "a3"
        },
        {
            "id": "a4"
        }
    ]
}

},{}],95:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["e"]
        }
    ]
}





},{}],96:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_43.apply(this, arguments);
}

function $expr_line_49_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $assign_line_49_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_49_column_47.apply(this, arguments);
}

function $cond_line_48_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

function $expr_line_38_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_38_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_38_column_51.apply(this, arguments);
}

function $cond_line_37_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i < 100;
}

function $expr_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_44_column_51.apply(this, arguments);
}

function $cond_line_43_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i < 100;
}

function $cond_line_55_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 200;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $assign_line_30_column_43
                }
            ]
        },
        {
            "id": "A",
            "states": [
                {
                    "id": "b",
                    "transitions": [
                        {
                            "target": "c",
                            "cond": $cond_line_37_column_53,
                            "onTransition": $assign_line_38_column_51
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "target": "b",
                            "cond": $cond_line_43_column_53,
                            "onTransition": $assign_line_44_column_51
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "d",
                    "cond": $cond_line_48_column_48,
                    "onTransition": $assign_line_49_column_47
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "cond": $cond_line_55_column_49
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "e"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],97:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}




},{}],98:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_28_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    return -1;
}

function $assign_line_28_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_28_column_44.apply(this, arguments);
}

function $expr_line_29_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 99;
}

function $assign_line_29_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_29_column_44.apply(this, arguments);
}

function $expr_line_34_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_34_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_34_column_47.apply(this, arguments);
}

function $cond_line_33_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 99;
}

function $script_line_41_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x *= 2;
}

function $cond_line_46_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 200;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "onEntry": [
                $assign_line_28_column_44,
                $assign_line_29_column_44
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "b",
                    "cond": $cond_line_33_column_58,
                    "onTransition": $assign_line_34_column_47
                }
            ]
        },
        {
            "id": "b",
            "onEntry": $script_line_41_column_20,
            "transitions": [
                {
                    "target": "c",
                    "cond": $cond_line_46_column_49
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "c"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],99:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b1","c1"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b2","c2"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["d"]
        }
    ]
}






},{}],100:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_43.apply(this, arguments);
}

function $cond_line_58_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 0;
}

function $expr_line_39_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_39_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_39_column_55.apply(this, arguments);
}

function $expr_line_50_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i - 1;
}

function $assign_line_50_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_50_column_55.apply(this, arguments);
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "p",
                    "event": "t1",
                    "onTransition": $assign_line_30_column_43
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "b",
                    "initial": "b1",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "b2",
                                    "onTransition": $assign_line_39_column_55
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                },
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "c2",
                                    "onTransition": $assign_line_50_column_55
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t3",
                    "target": "d",
                    "cond": $cond_line_58_column_58
                },
                {
                    "event": "t3",
                    "target": "f"
                }
            ]
        },
        {
            "id": "d"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],101:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}

},{}],102:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_27_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

function $assign_line_27_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_27_column_43.apply(this, arguments);
}

function $expr_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 3;
}

function $assign_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_47.apply(this, arguments);
}

function $expr_line_36_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b, x:' + x;
}

function $log_line_36_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_36_column_37.apply(this, arguments));
}

function $cond_line_53_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 30;
}

function $expr_line_41_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 5;
}

function $assign_line_41_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_41_column_51.apply(this, arguments);
}

function $expr_line_42_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b1, x:' + x;
}

function $log_line_42_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_42_column_42.apply(this, arguments));
}

function $expr_line_48_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 7;
}

function $assign_line_48_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_48_column_51.apply(this, arguments);
}

function $expr_line_49_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b2, x:' + x;
}

function $log_line_49_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_49_column_42.apply(this, arguments));
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "onEntry": $assign_line_27_column_43,
            "transitions": [
                {
                    "event": "t",
                    "target": "b1"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $assign_line_35_column_47,
                $log_line_36_column_37
            ],
            "states": [
                {
                    "id": "b1",
                    "onEntry": [
                        $assign_line_41_column_51,
                        $log_line_42_column_42
                    ]
                },
                {
                    "id": "b2",
                    "onEntry": [
                        $assign_line_48_column_51,
                        $log_line_49_column_42
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "c",
                    "cond": $cond_line_53_column_48
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "c"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],103:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}




},{}],104:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_43.apply(this, arguments);
}

function $expr_line_36_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_36_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_36_column_47.apply(this, arguments);
}

function $cond_line_35_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i < 100;
}

function $cond_line_38_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $assign_line_30_column_43
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "b",
                    "cond": $cond_line_35_column_49,
                    "onTransition": $assign_line_36_column_47
                },
                {
                    "target": "c",
                    "cond": $cond_line_38_column_49
                }
            ]
        },
        {
            "id": "c"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],105:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],106:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        }
    ]
}

},{}],107:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["c"]
        }
    ]
}




},{}],108:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "t2"
                }
            ]
        },
        {
            "id": "c"
        }
    ]
}

},{}],109:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : []
}



},{}],110:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a"
        }
    ]
}

},{}],111:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2"]
        }
    ]
}




},{}],112:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "states": [
                {
                    "id": "a1",
                    "transitions": [
                        {
                            "target": "a2",
                            "event": "t"
                        },
                        {
                            "target": "c",
                            "event": "t"
                        }
                    ]
                },
                {
                    "id": "a2"
                }
            ],
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "c"
        }
    ]
}

},{}],113:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],114:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "states": [
                {
                    "id": "a1",
                    "transitions": [
                        {
                            "target": "b",
                            "event": "t"
                        },
                        {
                            "target": "c",
                            "event": "t"
                        }
                    ]
                },
                {
                    "id": "a2"
                }
            ],
            "transitions": [
                {
                    "target": "a2",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "c"
        }
    ]
}

},{}],115:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["b"]
        },
        {
            "event" : { "name" : "bar" },
            "nextConfiguration" : ["c"]
        },
        {
            "event" : { "name" : "bat" },
            "nextConfiguration" : ["d"]
        }
    ]
}




},{}],116:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "foo bar bat"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "foo bar bat"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "foo bar bat"
                }
            ]
        },
        {
            "id": "d"
        }
    ]
};

},{}],117:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["s3","s4","s7","s8"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["s5","s6","s9","s10"]
        }

    ]
}





},{}],118:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p1",
            "type": "parallel",
            "states": [
                {
                    "id": "s1",
                    "initial": "p2",
                    "states": [
                        {
                            "id": "p2",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s3"
                                },
                                {
                                    "id": "s4"
                                }
                            ],
                            "transitions": [
                                {
                                    "target": "p3",
                                    "event": "t"
                                }
                            ]
                        },
                        {
                            "id": "p3",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s5"
                                },
                                {
                                    "id": "s6"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "s2",
                    "initial": "p4",
                    "states": [
                        {
                            "id": "p4",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s7"
                                },
                                {
                                    "id": "s8"
                                }
                            ],
                            "transitions": [
                                {
                                    "target": "p5",
                                    "event": "t"
                                }
                            ]
                        },
                        {
                            "id": "p5",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s9"
                                },
                                {
                                    "id": "s10"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],119:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a","b"],
    "events" : [ ]
}




},{}],120:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a"
                },
                {
                    "id": "b"
                }
            ]
        }
    ]
}

},{}],121:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["s3.1","s4","s7","s8"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["s3.2","s4","s9","s10"]
        }

    ]
}






},{}],122:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "p1",
    "states": [
        {
            "id": "p1",
            "type": "parallel",
            "states": [
                {
                    "id": "s1",
                    "initial": "p2",
                    "states": [
                        {
                            "id": "p2",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s3",
                                    "initial": "s3.1",
                                    "states": [
                                        {
                                            "id": "s3.1",
                                            "transitions": [
                                                {
                                                    "target": "s3.2",
                                                    "event": "t"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "s3.2"
                                        }
                                    ]
                                },
                                {
                                    "id": "s4"
                                }
                            ]
                        },
                        {
                            "id": "p3",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s5"
                                },
                                {
                                    "id": "s6"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "s2",
                    "initial": "p4",
                    "states": [
                        {
                            "id": "p4",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s7"
                                },
                                {
                                    "id": "s8"
                                }
                            ],
                            "transitions": [
                                {
                                    "target": "p5",
                                    "event": "t"
                                }
                            ]
                        },
                        {
                            "id": "p5",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "s9"
                                },
                                {
                                    "id": "s10"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],123:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1","b1"],
    "events" : [ 
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2","b2"]
        }

    ]
}




},{}],124:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "states": [
                        {
                            "type": "initial",
                            "transitions": [
                                {
                                    "target": "a1"
                                }
                            ]
                        },
                        {
                            "id": "a1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "a2"
                                }
                            ]
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "type": "initial",
                            "transitions": [
                                {
                                    "target": "b1"
                                }
                            ]
                        },
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t",
                                    "target": "b2"
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],125:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}




},{}],126:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler



var myArray, myItem, myIndex, sum, indexSum;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        myArray = $data_line_25_column_47.apply(this, arguments);
        myItem = $data_line_26_column_36.apply(this, arguments);
        myIndex = $data_line_27_column_37.apply(this, arguments);
        sum = $data_line_28_column_33.apply(this, arguments);
        indexSum = $data_line_29_column_38.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_34_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [sum,indexSum];
}

function $log_line_34_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("before",$expr_line_34_column_55.apply(this, arguments));
}

function $expr_line_36_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum + myItem;
}

function $assign_line_36_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    sum = $expr_line_36_column_60.apply(this, arguments);
}

function $expr_line_37_column_71(_event, In, _sessionId, _name, _ioprocessors, _x){
    return indexSum + myIndex;
}

function $assign_line_37_column_71(_event, In, _sessionId, _name, _ioprocessors, _x){
    indexSum = $expr_line_37_column_71.apply(this, arguments);
}

function $foreach_line_35_column_67(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(Array.isArray(myArray)){
        for(myIndex = 0; myIndex < myArray.length;myIndex++){
           myItem = myArray[myIndex];
           $assign_line_36_column_60.apply(this, arguments);
           $assign_line_37_column_71.apply(this, arguments);
        }
    } else{
        for(myIndex in myArray){
            if(myArray.hasOwnProperty(myIndex)){
               myItem = myArray[myIndex];
               $assign_line_36_column_60.apply(this, arguments);
               $assign_line_37_column_71.apply(this, arguments);
            }
        }
    }
}

function $expr_line_40_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum + myItem;
}

function $assign_line_40_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    sum = $expr_line_40_column_60.apply(this, arguments);
}

function $foreach_line_39_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    var $i;
    if(Array.isArray(myArray)){
        for($i = 0; $i < myArray.length;$i++){
           myItem = myArray[$i];
           $assign_line_40_column_60.apply(this, arguments);
        }
    } else{
        for($i in myArray){
            if(myArray.hasOwnProperty($i)){
               myItem = myArray[$i];
               $assign_line_40_column_60.apply(this, arguments);
            }
        }
    }
}

function $expr_line_42_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [sum,indexSum];
}

function $log_line_42_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("after",$expr_line_42_column_54.apply(this, arguments));
}

function $cond_line_44_column_87(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum === 50 && indexSum === 10;
}

function $data_line_25_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [1,3,5,7,9];
}

function $data_line_26_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $data_line_27_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $data_line_28_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $data_line_29_column_38(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "onEntry": [
                $log_line_34_column_55,
                $foreach_line_35_column_67,
                $foreach_line_39_column_51,
                $log_line_42_column_54
            ],
            "transitions": [
                {
                    "target": "c",
                    "event": "t",
                    "cond": $cond_line_44_column_87
                }
            ]
        },
        {
            "id": "c"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],127:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["A"],
    "events" : [
        {
            "event" : { "name" : "e1" },
            "nextConfiguration" : ["B"]
        },
        {
            "event" : { "name" : "e2" },
            "nextConfiguration" : ["A"]
        }
    ]
}

},{}],128:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $expr_line_8_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting A";
}

function $log_line_8_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_8_column_45.apply(this, arguments));
}

function $expr_line_5_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering A";
}

function $log_line_5_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_5_column_46.apply(this, arguments));
}

function $expr_line_11_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "doing A->B transition";
}

function $log_line_11_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_11_column_60.apply(this, arguments));
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "A",
            "onEntry": $log_line_5_column_46,
            "onExit": $log_line_8_column_45,
            "transitions": [
                {
                    "target": "B",
                    "event": "e1",
                    "onTransition": $log_line_11_column_60
                }
            ]
        },
        {
            "id": "B",
            "transitions": [
                {
                    "target": "A",
                    "event": "e2"
                }
            ]
        }
    ]
};

},{}],129:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["A"],
    "events" : [
        {
            "event" : { "name" : "e1" },
            "nextConfiguration" : ["B"]
        },
        {
            "event" : { "name" : "e2" },
            "nextConfiguration" : ["A"]
        },
        {
            "event" : { "name" : "e1" },
            "nextConfiguration" : ["B"]
        },
        {
            "event" : { "name" : "e1" },
            "nextConfiguration" : ["C"]
        }
    ]
}




},{}],130:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $expr_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state A";
}

function $log_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_12_column_53.apply(this, arguments));
}

function $expr_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state A";
}

function $log_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_9_column_54.apply(this, arguments));
}

function $expr_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e1";
}

function $log_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_15_column_53.apply(this, arguments));
}

function $expr_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e2";
}

function $log_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_20_column_53.apply(this, arguments));
}

function $expr_line_30_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state C";
}

function $log_line_30_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_30_column_51.apply(this, arguments));
}

function $expr_line_27_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state C";
}

function $log_line_27_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_27_column_52.apply(this, arguments));
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "AB",
            "states": [
                {
                    "type": "initial",
                    "transitions": [
                        {
                            "target": "A"
                        }
                    ]
                },
                {
                    "id": "A",
                    "onEntry": $log_line_9_column_54,
                    "onExit": $log_line_12_column_53,
                    "transitions": [
                        {
                            "target": "B",
                            "event": "e1",
                            "onTransition": $log_line_15_column_53
                        }
                    ]
                },
                {
                    "id": "B",
                    "transitions": [
                        {
                            "target": "A",
                            "event": "e2",
                            "onTransition": $log_line_20_column_53
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "C",
                    "event": "e1"
                }
            ]
        },
        {
            "id": "C",
            "onEntry": $log_line_27_column_52,
            "onExit": $log_line_30_column_51
        }
    ]
};

},{}],131:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["A"],
    "events" : [
        {
            "event" : { "name" : "e1" },
            "nextConfiguration" : ["B"]
        },
        {
            "event" : { "name" : "e2" },
            "nextConfiguration" : ["A"]
        }
    ]
}


},{}],132:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $expr_line_8_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state A";
}

function $log_line_8_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_8_column_51.apply(this, arguments));
}

function $expr_line_5_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state A";
}

function $log_line_5_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_5_column_52.apply(this, arguments));
}

function $expr_line_11_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e1";
}

function $log_line_11_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_11_column_51.apply(this, arguments));
}

function $expr_line_16_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e2";
}

function $log_line_16_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_16_column_51.apply(this, arguments));
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "A",
            "onEntry": $log_line_5_column_52,
            "onExit": $log_line_8_column_51,
            "transitions": [
                {
                    "target": "B",
                    "event": "e1",
                    "onTransition": $log_line_11_column_51
                }
            ]
        },
        {
            "id": "B",
            "transitions": [
                {
                    "target": "A",
                    "event": "e2",
                    "onTransition": $log_line_16_column_51
                }
            ]
        }
    ]
};

},{}],133:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["A"],
    "events" : [
        {
            "event" : { "name" : "e1" },
            "nextConfiguration" : ["B"]
        },
        {
            "event" : { "name" : "e2" },
            "nextConfiguration" : ["A"]
        }
    ]
}



},{}],134:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $expr_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state A";
}

function $log_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_12_column_53.apply(this, arguments));
}

function $expr_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state A";
}

function $log_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_9_column_54.apply(this, arguments));
}

function $expr_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e1";
}

function $log_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_15_column_53.apply(this, arguments));
}

function $expr_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e2";
}

function $log_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_20_column_53.apply(this, arguments));
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "AB",
            "states": [
                {
                    "type": "initial",
                    "transitions": [
                        {
                            "target": "A"
                        }
                    ]
                },
                {
                    "id": "A",
                    "onEntry": $log_line_9_column_54,
                    "onExit": $log_line_12_column_53,
                    "transitions": [
                        {
                            "target": "B",
                            "event": "e1",
                            "onTransition": $log_line_15_column_53
                        }
                    ]
                },
                {
                    "id": "B",
                    "transitions": [
                        {
                            "target": "A",
                            "event": "e2",
                            "onTransition": $log_line_20_column_53
                        }
                    ]
                }
            ]
        }
    ]
};

},{}],135:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["a2"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["c"]
        }
    ]
}

},{}],136:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        x = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_26_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $log_line_26_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_26_column_33.apply(this, arguments));
}

function $expr_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_47.apply(this, arguments);
}

function $expr_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_31_column_47.apply(this, arguments);
}

function $cond_line_46_column_75(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1;
}

function $cond_line_43_column_62(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1;
}

function $cond_line_50_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 2;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "transitions": [
        {
            "event": "*",
            "onTransition": $log_line_26_column_33
        }
    ],
    "states": [
        {
            "id": "a",
            "onEntry": $assign_line_31_column_47,
            "onExit": $assign_line_35_column_47,
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2",
                    "transitions": [
                        {
                            "target": "b",
                            "event": "t2",
                            "cond": $cond_line_43_column_62
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "a2",
                    "event": "t1",
                    "type": "internal",
                    "cond": $cond_line_46_column_75
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "t3",
                    "cond": $cond_line_50_column_59
                }
            ]
        },
        {
            "id": "c"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],137:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1", "b1"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["a2", "b1"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["c"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["d"]
        }
    ]
}


},{}],138:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        x = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_31_column_47.apply(this, arguments);
}

function $expr_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_27_column_47.apply(this, arguments);
}

function $expr_line_40_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_40_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_40_column_51.apply(this, arguments);
}

function $expr_line_36_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_36_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_36_column_51.apply(this, arguments);
}

function $cond_line_67_column_79(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 3;
}

function $expr_line_49_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_49_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_49_column_55.apply(this, arguments);
}

function $expr_line_45_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_45_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_45_column_55.apply(this, arguments);
}

function $expr_line_59_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_59_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_59_column_55.apply(this, arguments);
}

function $expr_line_55_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_55_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_55_column_55.apply(this, arguments);
}

function $cond_line_63_column_66(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 5;
}

function $cond_line_82_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 8;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "onEntry": $assign_line_27_column_47,
            "onExit": $assign_line_31_column_47,
            "states": [
                {
                    "id": "a",
                    "onEntry": $assign_line_36_column_51,
                    "onExit": $assign_line_40_column_51,
                    "states": [
                        {
                            "id": "a1",
                            "onEntry": $assign_line_45_column_55,
                            "onExit": $assign_line_49_column_55
                        },
                        {
                            "id": "a2",
                            "onEntry": $assign_line_55_column_55,
                            "onExit": $assign_line_59_column_55,
                            "transitions": [
                                {
                                    "target": "c",
                                    "event": "t2",
                                    "cond": $cond_line_63_column_66
                                }
                            ]
                        }
                    ],
                    "transitions": [
                        {
                            "target": "a2",
                            "event": "t1",
                            "type": "internal",
                            "cond": $cond_line_67_column_79
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "t3",
                    "cond": $cond_line_82_column_58
                }
            ]
        },
        {
            "id": "d"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],139:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["d"]
        }
    ]
}

},{}],140:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:29 by the SCION SCXML compiler

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

var foo, bar, bat;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        foo = $data_line_22_column_33.apply(this, arguments);
        bar = $data_line_23_column_33.apply(this, arguments);
        bat = $data_line_24_column_33.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $eventexpr_line_29_column_74(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 's1';
}

function $location_line_30_column_50(_event, In, _sessionId, _name, _ioprocessors, _x){
    return bat;
}

function $expr_line_31_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 4;
}

function $send_line_29_column_74(_event, In, _sessionId, _name, _ioprocessors, _x){
    var _scionTargetRef = "#_internal";
    if(_scionTargetRef === '#_internal'){
         this.raise(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_29_column_74.apply(this, arguments),
            type: "send",
            data: 
                {
                    "foo":foo,
                    "bar":bar,
                    "bif":$location_line_30_column_50.apply(this, arguments),
                    "belt":$expr_line_31_column_45.apply(this, arguments)
                },
            origin: _sessionId
         });
    }else{
         this.send(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_29_column_74.apply(this, arguments),
            type: "send",
            data: 
                {
                    "foo":foo,
                    "bar":bar,
                    "bif":$location_line_30_column_50.apply(this, arguments),
                    "belt":$expr_line_31_column_45.apply(this, arguments)
                },
            origin: _sessionId
         }, 
           {
               delay: getDelayInMs(null),
               sendId: null
           });
    }
}

function $eventexpr_line_43_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 's2';
}

function $send_line_43_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    var _scionTargetRef = "#_internal";
    if(_scionTargetRef === '#_internal'){
         this.raise(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_43_column_55.apply(this, arguments),
            type: "send",
            data: 
                "More content.",
            origin: _sessionId
         });
    }else{
         this.send(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_43_column_55.apply(this, arguments),
            type: "send",
            data: 
                "More content.",
            origin: _sessionId
         }, 
           {
               delay: getDelayInMs(null),
               sendId: null
           });
    }
}

function $cond_line_41_column_40(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event.data.foo === 1 && 
                    _event.data.bar === 2 && 
                    _event.data.bif === 3 &&
                    _event.data.belt === 4;
}

function $cond_line_55_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event.data === 'More content.';
}

function $expr_line_58_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event;
}

function $log_line_58_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("_event",$expr_line_58_column_47.apply(this, arguments));
}

function $data_line_22_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

function $data_line_23_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

function $data_line_24_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 3;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $send_line_29_column_74
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "event": "s1",
                    "target": "c",
                    "cond": $cond_line_41_column_40,
                    "onTransition": $send_line_43_column_55
                },
                {
                    "event": "s1",
                    "target": "f"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "event": "s2",
                    "target": "d",
                    "cond": $cond_line_55_column_52
                },
                {
                    "event": "s2",
                    "target": "f",
                    "onTransition": $log_line_58_column_47
                }
            ]
        },
        {
            "id": "d"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],141:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],142:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $cond_line_22_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_22_column_54
                }
            ]
        },
        {
            "id": "b"
        }
    ]
};

},{}],143:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],144:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $cond_line_22_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_22_column_54
                }
            ]
        },
        {
            "id": "b"
        }
    ]
};

},{}],145:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["b"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["d1"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["e1"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["f2"]
        },
        {
            "event" : { "name" : "t4" },
            "nextConfiguration" : ["h"]
        },
        {
            "event" : { "name" : "t5" },
            "nextConfiguration" : ["i"]
        },
        {
            "event" : { "name" : "t5" },
            "nextConfiguration" : ["last"]
        }
    ]
}





},{}],146:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $cond_line_55_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_56_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_65_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_66_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_67_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_92_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_82_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_87_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d1"
                },
                {
                    "target": "d2"
                }
            ]
        },
        {
            "id": "d1",
            "transitions": [
                {
                    "target": "e1",
                    "event": "t2"
                },
                {
                    "target": "e2",
                    "event": "t2"
                }
            ]
        },
        {
            "id": "d2"
        },
        {
            "id": "e1",
            "transitions": [
                {
                    "target": "f1",
                    "event": "t3",
                    "cond": $cond_line_55_column_57
                },
                {
                    "target": "f2",
                    "event": "t3",
                    "cond": $cond_line_56_column_56
                }
            ]
        },
        {
            "id": "e2"
        },
        {
            "id": "f1"
        },
        {
            "id": "f2",
            "transitions": [
                {
                    "target": "g1",
                    "event": "t4",
                    "cond": $cond_line_65_column_57
                },
                {
                    "target": "g2",
                    "event": "t4",
                    "cond": $cond_line_66_column_57
                },
                {
                    "target": "g3",
                    "event": "t4",
                    "cond": $cond_line_67_column_56
                }
            ]
        },
        {
            "id": "g1"
        },
        {
            "id": "g2"
        },
        {
            "id": "g3",
            "states": [
                {
                    "type": "initial",
                    "transitions": [
                        {
                            "target": "h"
                        }
                    ]
                },
                {
                    "id": "h",
                    "transitions": [
                        {
                            "target": "i",
                            "event": "t5",
                            "cond": $cond_line_82_column_59
                        }
                    ]
                },
                {
                    "id": "i",
                    "transitions": [
                        {
                            "target": "j",
                            "event": "t5",
                            "cond": $cond_line_87_column_60
                        }
                    ]
                },
                {
                    "id": "j"
                }
            ],
            "transitions": [
                {
                    "target": "last",
                    "event": "t5",
                    "cond": $cond_line_92_column_58
                }
            ]
        },
        {
            "id": "last"
        }
    ]
};

},{}],147:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],148:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $cond_line_22_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_23_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "f",
                    "event": "t",
                    "cond": $cond_line_22_column_55
                },
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_23_column_54
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "f"
        }
    ]
};

},{}],149:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],150:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                },
                {
                    "target": "c",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "c"
        }
    ]
}

},{}],151:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2"]
        }
    ]
}




},{}],152:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "states": [
                {
                    "id": "a1",
                    "transitions": [
                        {
                            "target": "a2",
                            "event": "t"
                        }
                    ]
                },
                {
                    "id": "a2"
                }
            ]
        }
    ]
}

},{}],153:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["a2"]
        }
    ]
}




},{}],154:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "states": [
                {
                    "id": "a1",
                    "transitions": [
                        {
                            "target": "a2",
                            "event": "t"
                        }
                    ]
                },
                {
                    "id": "a2"
                }
            ],
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        }
    ]
}

},{}],155:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],156:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "states": [
                {
                    "id": "a1",
                    "transitions": [
                        {
                            "target": "b",
                            "event": "t"
                        }
                    ]
                },
                {
                    "id": "a2"
                }
            ],
            "transitions": [
                {
                    "target": "a2",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        }
    ]
}

},{}],157:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}




},{}],158:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        x = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_45_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $log_line_45_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_45_column_37.apply(this, arguments));
}

function $cond_line_46_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x !== 10;
}

function $expr_line_47_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 3;
}

function $assign_line_47_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_47_column_51.apply(this, arguments);
}

function $expr_line_49_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 2;
}

function $assign_line_49_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_49_column_51.apply(this, arguments);
}

function $if_line_46_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_46_column_32.apply(this, arguments)){
        $assign_line_47_column_51.apply(this, arguments);
    }else{
        $assign_line_49_column_51.apply(this, arguments);
    }
}

function $expr_line_51_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $log_line_51_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_51_column_37.apply(this, arguments));
}

function $expr_line_28_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $log_line_28_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_28_column_37.apply(this, arguments));
}

function $cond_line_29_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 0;
}

function $expr_line_30_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 10;
}

function $assign_line_30_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_30_column_48.apply(this, arguments);
}

function $cond_line_31_column_41(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 10;
}

function $expr_line_32_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 20;
}

function $assign_line_32_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_32_column_48.apply(this, arguments);
}

function $expr_line_34_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 30;
}

function $assign_line_34_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_34_column_48.apply(this, arguments);
}

function $if_line_29_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_29_column_31.apply(this, arguments)){
        $assign_line_30_column_48.apply(this, arguments);
    }else if($cond_line_31_column_41.apply(this, arguments)){
        $assign_line_32_column_48.apply(this, arguments);
    }else{
        $assign_line_34_column_48.apply(this, arguments);
    }
}

function $expr_line_36_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $log_line_36_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_36_column_37.apply(this, arguments));
}

function $expr_line_40_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_40_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_40_column_47.apply(this, arguments);
}

function $cond_line_39_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 10;
}

function $expr_line_58_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $log_line_58_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_58_column_37.apply(this, arguments));
}

function $cond_line_59_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 0;
}

function $expr_line_60_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 100;
}

function $assign_line_60_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_60_column_49.apply(this, arguments);
}

function $cond_line_61_column_41(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 21;
}

function $expr_line_62_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 2;
}

function $assign_line_62_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_62_column_51.apply(this, arguments);
}

function $expr_line_63_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 3;
}

function $assign_line_63_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_63_column_51.apply(this, arguments);
}

function $expr_line_65_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 200;
}

function $assign_line_65_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_65_column_49.apply(this, arguments);
}

function $if_line_59_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_59_column_31.apply(this, arguments)){
        $assign_line_60_column_49.apply(this, arguments);
    }else if($cond_line_61_column_41.apply(this, arguments)){
        $assign_line_62_column_51.apply(this, arguments);
        $assign_line_63_column_51.apply(this, arguments);
    }else{
        $assign_line_65_column_49.apply(this, arguments);
    }
}

function $cond_line_68_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 26;
}

function $expr_line_69_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_69_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_69_column_51.apply(this, arguments);
}

function $if_line_68_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_68_column_32.apply(this, arguments)){
        $assign_line_69_column_51.apply(this, arguments);
    }
}

function $cond_line_72_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 26;
}

function $cond_line_73_column_41(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 27;
}

function $expr_line_74_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_74_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_74_column_51.apply(this, arguments);
}

function $expr_line_76_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 10;
}

function $assign_line_76_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_76_column_52.apply(this, arguments);
}

function $if_line_72_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_72_column_32.apply(this, arguments)){
    }else if($cond_line_73_column_41.apply(this, arguments)){
        $assign_line_74_column_51.apply(this, arguments);
    }else{
        $assign_line_76_column_52.apply(this, arguments);
    }
}

function $cond_line_79_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 28;
}

function $expr_line_80_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 12;
}

function $assign_line_80_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_80_column_52.apply(this, arguments);
}

function $cond_line_81_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 40;
}

function $expr_line_82_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 10;
}

function $assign_line_82_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_82_column_56.apply(this, arguments);
}

function $if_line_81_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_81_column_36.apply(this, arguments)){
        $assign_line_82_column_56.apply(this, arguments);
    }
}

function $if_line_79_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_79_column_32.apply(this, arguments)){
        $assign_line_80_column_52.apply(this, arguments);
        $if_line_81_column_36.apply(this, arguments);
    }
}

function $cond_line_86_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 50;
}

function $expr_line_87_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_87_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_87_column_51.apply(this, arguments);
}

function $cond_line_88_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x !== 51;
}

function $expr_line_90_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 20;
}

function $assign_line_90_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_90_column_56.apply(this, arguments);
}

function $if_line_88_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_88_column_36.apply(this, arguments)){
    }else{
        $assign_line_90_column_56.apply(this, arguments);
    }
}

function $if_line_86_column_32(_event, In, _sessionId, _name, _ioprocessors, _x){
    if($cond_line_86_column_32.apply(this, arguments)){
        $assign_line_87_column_51.apply(this, arguments);
        $if_line_88_column_36.apply(this, arguments);
    }
}

function $expr_line_94_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $log_line_94_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_94_column_37.apply(this, arguments));
}

function $cond_line_97_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 71;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "onEntry": [
                $log_line_28_column_37,
                $if_line_29_column_31,
                $log_line_36_column_37
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "b",
                    "cond": $cond_line_39_column_58,
                    "onTransition": $assign_line_40_column_47
                }
            ],
            "onExit": [
                $log_line_45_column_37,
                $if_line_46_column_32,
                $log_line_51_column_37
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $log_line_58_column_37,
                $if_line_59_column_31,
                $if_line_68_column_32,
                $if_line_72_column_32,
                $if_line_79_column_32,
                $if_line_86_column_32,
                $log_line_94_column_37
            ],
            "transitions": [
                {
                    "target": "c",
                    "cond": $cond_line_97_column_48
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "c"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],159:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "bar" },
            "nextConfiguration" : ["done"]
        }
    ]
}






},{}],160:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:29 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        i = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $assign_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_27_column_47.apply(this, arguments);
}

function $expr_line_30_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return Math.pow(i,3);
}

function $assign_line_30_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_55.apply(this, arguments);
}

function $cond_line_39_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 27;
}

function $expr_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 2;
}

function $assign_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_35_column_51.apply(this, arguments);
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "A",
            "transitions": [
                {
                    "event": "foo",
                    "onTransition": $assign_line_27_column_47
                },
                {
                    "event": "bar",
                    "onTransition": $assign_line_30_column_55
                },
                {
                    "target": "done",
                    "cond": $cond_line_39_column_51
                }
            ],
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "foo",
                            "onTransition": $assign_line_35_column_51
                        }
                    ]
                }
            ]
        },
        {
            "id": "done"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],161:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["done"]
        }
    ]
}




},{}],162:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:29 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        i = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $cond_line_30_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

function $expr_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_32_column_47.apply(this, arguments);
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "done",
                    "cond": $cond_line_30_column_52
                },
                {
                    "onTransition": $assign_line_32_column_47
                }
            ]
        },
        {
            "id": "done"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],163:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a1","b1","c"],
    "events" : [
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["a2","b2","c"]
        },
        {
            "event" : { "name" : "bar" },
            "nextConfiguration" : ["done"]
        }
    ]
}







},{}],164:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:29 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        i = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $cond_line_27_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

function $expr_line_30_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 20;
}

function $assign_line_30_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_48.apply(this, arguments);
}

function $expr_line_31_column_27(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_31_column_27(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_31_column_27.apply(this, arguments));
}

function $expr_line_37_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $assign_line_37_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_37_column_55.apply(this, arguments);
}

function $expr_line_38_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_38_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_38_column_35.apply(this, arguments));
}

function $expr_line_49_column_63(_event, In, _sessionId, _name, _ioprocessors, _x){
    return Math.pow(i,3);
}

function $assign_line_49_column_63(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_49_column_63.apply(this, arguments);
}

function $expr_line_50_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_50_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_50_column_35.apply(this, arguments));
}

function $expr_line_60_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i - 3;
}

function $assign_line_60_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_60_column_51.apply(this, arguments);
}

function $expr_line_61_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_61_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_61_column_31.apply(this, arguments));
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "transitions": [
                {
                    "target": "done",
                    "cond": $cond_line_27_column_52
                },
                {
                    "event": "bar",
                    "onTransition": [
                        $assign_line_30_column_48,
                        $log_line_31_column_27
                    ]
                }
            ],
            "states": [
                {
                    "id": "a",
                    "states": [
                        {
                            "id": "a1",
                            "transitions": [
                                {
                                    "event": "foo",
                                    "target": "a2",
                                    "onTransition": [
                                        $assign_line_37_column_55,
                                        $log_line_38_column_35
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "foo",
                                    "target": "b2",
                                    "onTransition": [
                                        $assign_line_49_column_63,
                                        $log_line_50_column_35
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "foo",
                            "onTransition": [
                                $assign_line_60_column_51,
                                $log_line_61_column_31
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "done"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],165:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "bar" },
            "nextConfiguration" : ["done"]
        }
    ]
}





},{}],166:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:29 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        i = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $assign_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_27_column_47.apply(this, arguments);
}

function $cond_line_36_column_50(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 8;
}

function $expr_line_32_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return Math.pow(i,3);
}

function $assign_line_32_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_32_column_59.apply(this, arguments);
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "A",
            "transitions": [
                {
                    "event": "foo",
                    "onTransition": $assign_line_27_column_47
                },
                {
                    "target": "done",
                    "cond": $cond_line_36_column_50
                }
            ],
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "bar",
                            "onTransition": $assign_line_32_column_59
                        }
                    ]
                }
            ]
        },
        {
            "id": "done"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],167:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["e"]
        }
    ]
}





},{}],168:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 0;
}

function $script_line_52_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x * 2;
}

function $cond_line_51_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

function $script_line_37_column_24(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_36_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $script_line_45_column_24(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_44_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $cond_line_60_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 200;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "A",
            "states": [
                {
                    "id": "b",
                    "transitions": [
                        {
                            "target": "c",
                            "cond": $cond_line_36_column_53,
                            "onTransition": $script_line_37_column_24
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "target": "b",
                            "cond": $cond_line_44_column_53,
                            "onTransition": $script_line_45_column_24
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "d",
                    "cond": $cond_line_51_column_48,
                    "onTransition": $script_line_52_column_20
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "cond": $cond_line_60_column_49
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "e"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],169:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b"]
        }
    ]
}




},{}],170:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 100;
}

function $cond_line_34_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "intitial1",
            "transitions": [
                {
                    "target": "a",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_34_column_59
                },
                {
                    "target": "f",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],171:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}




},{}],172:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 0;
}

function $script_line_35_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_34_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $cond_line_39_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "b",
                    "cond": $cond_line_34_column_49,
                    "onTransition": $script_line_35_column_20
                },
                {
                    "target": "c",
                    "cond": $cond_line_39_column_49
                }
            ]
        },
        {
            "id": "c"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],173:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b2"]
        }
    ]
}










},{}],174:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_27_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $raise_line_27_column_30
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "states": [
                {
                    "id": "b1",
                    "transitions": [
                        {
                            "event": "s",
                            "target": "b2"
                        },
                        {
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b2"
                },
                {
                    "id": "b3"
                }
            ]
        }
    ]
};

},{}],175:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["b2"]
        }
    ]
}











},{}],176:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_27_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b1",
                    "event": "t",
                    "onTransition": $raise_line_27_column_30
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "states": [
                {
                    "id": "b1",
                    "transitions": [
                        {
                            "event": "s",
                            "target": "b2"
                        },
                        {
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b2"
                },
                {
                    "id": "b3"
                }
            ]
        }
    ]
};

},{}],177:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["d"]
        }
    ]
}









},{}],178:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_32_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

function $raise_line_33_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"r", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $raise_line_32_column_30,
                $raise_line_33_column_30
            ],
            "transitions": [
                {
                    "target": "f1",
                    "event": "r"
                },
                {
                    "target": "c"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "f2",
                    "event": "s"
                },
                {
                    "target": "d"
                }
            ]
        },
        {
            "id": "f1"
        },
        {
            "id": "d"
        },
        {
            "id": "f2"
        }
    ]
};

},{}],179:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}





},{}],180:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_24_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "onExit": $raise_line_24_column_30,
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "s"
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};

},{}],181:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["d"]
        }
    ]
}







},{}],182:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_32_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": $raise_line_32_column_30,
            "transitions": [
                {
                    "target": "c",
                    "event": "s"
                },
                {
                    "target": "f1"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "f2",
                    "event": "s"
                },
                {
                    "target": "d"
                }
            ]
        },
        {
            "id": "f1"
        },
        {
            "id": "d"
        },
        {
            "id": "f2"
        }
    ]
};

},{}],183:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}






},{}],184:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_29_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": $raise_line_29_column_30,
            "transitions": [
                {
                    "target": "c",
                    "event": "s"
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};

},{}],185:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["c"]
        }
    ]
}




},{}],186:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_24_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $raise_line_24_column_30
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "s"
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};

},{}],187:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t" },
            "nextConfiguration" : ["d"]
        }
    ]
}








},{}],188:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_32_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

function $raise_line_33_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"r", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $raise_line_32_column_30,
                $raise_line_33_column_30
            ],
            "transitions": [
                {
                    "target": "c",
                    "event": "s"
                },
                {
                    "target": "f1"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "r"
                },
                {
                    "target": "f2"
                }
            ]
        },
        {
            "id": "f1"
        },
        {
            "id": "d"
        },
        {
            "id": "f2"
        }
    ]
};

},{}],189:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["i1","j","h","g","f1","k"],
    "events" : [ 
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["i2","j","h","g","f2","k"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["l"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["i2","j","h","g","f2","k"]
        }


    ]
}

},{}],190:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "type": "parallel",
            "states": [
                {
                    "id": "ha",
                    "type": "history",
                    "isDeep": true,
                    "transitions": [
                        {
                            "target": "b"
                        }
                    ]
                },
                {
                    "id": "b",
                    "type": "parallel",
                    "states": [
                        {
                            "id": "c",
                            "type": "parallel",
                            "states": [
                                {
                                    "id": "d",
                                    "type": "parallel",
                                    "states": [
                                        {
                                            "id": "e",
                                            "type": "parallel",
                                            "states": [
                                                {
                                                    "id": "i",
                                                    "initial": "i1",
                                                    "states": [
                                                        {
                                                            "id": "i1",
                                                            "transitions": [
                                                                {
                                                                    "target": "i2",
                                                                    "event": "t1"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "id": "i2",
                                                            "transitions": [
                                                                {
                                                                    "target": "l",
                                                                    "event": "t2"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id": "j"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "h"
                                        }
                                    ]
                                },
                                {
                                    "id": "g"
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "initial": "f1",
                            "states": [
                                {
                                    "id": "f1",
                                    "transitions": [
                                        {
                                            "target": "f2",
                                            "event": "t1"
                                        }
                                    ]
                                },
                                {
                                    "id": "f2"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "k"
                }
            ]
        },
        {
            "id": "l",
            "transitions": [
                {
                    "target": "ha",
                    "event": "t3"
                }
            ]
        }
    ]
}

},{}],191:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b1.2"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b1.3"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b1.1"]
        }
    ]
}





},{}],192:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "h",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "states": [
                {
                    "id": "h",
                    "type": "history",
                    "isDeep": false,
                    "transitions": [
                        {
                            "target": "b1.2"
                        }
                    ]
                },
                {
                    "id": "b1",
                    "initial": "b1.1",
                    "states": [
                        {
                            "id": "b1.1"
                        },
                        {
                            "id": "b1.2",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "b1.3"
                                }
                            ]
                        },
                        {
                            "id": "b1.3",
                            "transitions": [
                                {
                                    "event": "t3",
                                    "target": "a"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],193:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b2"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b3"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b3"]
        },
        {
            "event" : { "name" : "t4" },
            "nextConfiguration" : ["success"]
        }
    ]
}




},{}],194:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        x = $data_line_23_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 3;
}

function $assign_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_32_column_47.apply(this, arguments);
}

function $expr_line_33_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b, x:' + x;
}

function $log_line_33_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_33_column_37.apply(this, arguments));
}

function $cond_line_60_column_67(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 4410;
}

function $cond_line_62_column_71(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1470;
}

function $expr_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 5;
}

function $assign_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_44_column_51.apply(this, arguments);
}

function $expr_line_45_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b2, x:' + x;
}

function $log_line_45_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_45_column_42.apply(this, arguments));
}

function $expr_line_52_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 7;
}

function $assign_line_52_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_52_column_51.apply(this, arguments);
}

function $expr_line_53_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b3, x:' + x;
}

function $log_line_53_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_53_column_42.apply(this, arguments));
}

function $data_line_23_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "h",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "onEntry": [
                $assign_line_32_column_47,
                $log_line_33_column_37
            ],
            "states": [
                {
                    "id": "h",
                    "type": "history",
                    "transitions": [
                        {
                            "target": "b2"
                        }
                    ]
                },
                {
                    "id": "b1"
                },
                {
                    "id": "b2",
                    "onEntry": [
                        $assign_line_44_column_51,
                        $log_line_45_column_42
                    ],
                    "transitions": [
                        {
                            "event": "t2",
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b3",
                    "onEntry": [
                        $assign_line_52_column_51,
                        $log_line_53_column_42
                    ],
                    "transitions": [
                        {
                            "event": "t3",
                            "target": "a"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t4",
                    "target": "success",
                    "cond": $cond_line_60_column_67
                },
                {
                    "event": "t4",
                    "target": "really-fail",
                    "cond": $cond_line_62_column_71
                },
                {
                    "event": "t4",
                    "target": "fail"
                }
            ]
        },
        {
            "id": "success"
        },
        {
            "id": "fail"
        },
        {
            "id": "really-fail"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};

},{}],195:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b1","c1"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b2","c2"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "t4" },
            "nextConfiguration" : ["b2","c2"]
        }
    ]
}






},{}],196:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "p",
                    "event": "t1"
                },
                {
                    "target": "h",
                    "event": "t4"
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "h",
                    "type": "history",
                    "isDeep": true,
                    "transitions": [
                        {
                            "target": "b"
                        }
                    ]
                },
                {
                    "id": "b",
                    "initial": "b1",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "target": "b2",
                                    "event": "t2"
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                },
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "target": "c2",
                                    "event": "t2"
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "a",
                    "event": "t3"
                }
            ]
        }
    ]
}

},{}],197:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b1.2"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b1.3"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b1.3"]
        }
    ]
}




},{}],198:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "h",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "states": [
                {
                    "id": "h",
                    "type": "history",
                    "isDeep": true,
                    "transitions": [
                        {
                            "target": "b1.2"
                        }
                    ]
                },
                {
                    "id": "b1",
                    "initial": "b1.1",
                    "states": [
                        {
                            "id": "b1.1"
                        },
                        {
                            "id": "b1.2",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "b1.3"
                                }
                            ]
                        },
                        {
                            "id": "b1.3",
                            "transitions": [
                                {
                                    "event": "t3",
                                    "target": "a"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],199:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b2"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b3"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b3"]
        }
    ]
}



},{}],200:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "h",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "states": [
                {
                    "id": "h",
                    "type": "history",
                    "transitions": [
                        {
                            "target": "b2"
                        }
                    ]
                },
                {
                    "id": "b1"
                },
                {
                    "id": "b2",
                    "transitions": [
                        {
                            "event": "t2",
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b3",
                    "transitions": [
                        {
                            "event": "t3",
                            "target": "a"
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],201:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "t1" },
            "nextConfiguration" : ["b1.1","c1.1"]
        },
        {
            "event" : { "name" : "t2" },
            "nextConfiguration" : ["b1.2","c1.2"]
        },
        {
            "event" : { "name" : "t3" },
            "nextConfiguration" : ["b2.1","c2.1"]
        },
        {
            "event" : { "name" : "t4" },
            "nextConfiguration" : ["b2.2","c2.2"]
        },
        {
            "event" : { "name" : "t5" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "t6" },
            "nextConfiguration" : ["b2.2","c2.1"]
        },
        {
            "event" : { "name" : "t7" },
            "nextConfiguration" : ["b2.2","c2.2"]
        },
        {
            "event" : { "name" : "t8" },
            "nextConfiguration" : ["a"]
        },
        {
            "event" : { "name" : "t9" },
            "nextConfiguration" : ["b2.2","c2.2"]
        }
    ]
}







},{}],202:[function(require,module,exports){module.exports={
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "p",
                    "event": "t1"
                },
                {
                    "target": "p",
                    "event": "t6"
                },
                {
                    "target": "hp",
                    "event": "t9"
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "hp",
                    "type": "history",
                    "isDeep": true,
                    "transitions": [
                        {
                            "target": "b"
                        }
                    ]
                },
                {
                    "id": "b",
                    "initial": "hb",
                    "states": [
                        {
                            "id": "hb",
                            "type": "history",
                            "isDeep": true,
                            "transitions": [
                                {
                                    "target": "b1"
                                }
                            ]
                        },
                        {
                            "id": "b1",
                            "initial": "b1.1",
                            "states": [
                                {
                                    "id": "b1.1",
                                    "transitions": [
                                        {
                                            "target": "b1.2",
                                            "event": "t2"
                                        }
                                    ]
                                },
                                {
                                    "id": "b1.2",
                                    "transitions": [
                                        {
                                            "target": "b2",
                                            "event": "t3"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "initial": "b2.1",
                            "states": [
                                {
                                    "id": "b2.1",
                                    "transitions": [
                                        {
                                            "target": "b2.2",
                                            "event": "t4"
                                        }
                                    ]
                                },
                                {
                                    "id": "b2.2",
                                    "transitions": [
                                        {
                                            "target": "a",
                                            "event": "t5"
                                        },
                                        {
                                            "target": "a",
                                            "event": "t8"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "c",
                    "initial": "hc",
                    "states": [
                        {
                            "id": "hc",
                            "type": "history",
                            "isDeep": false,
                            "transitions": [
                                {
                                    "target": "c1"
                                }
                            ]
                        },
                        {
                            "id": "c1",
                            "initial": "c1.1",
                            "states": [
                                {
                                    "id": "c1.1",
                                    "transitions": [
                                        {
                                            "target": "c1.2",
                                            "event": "t2"
                                        }
                                    ]
                                },
                                {
                                    "id": "c1.2",
                                    "transitions": [
                                        {
                                            "target": "c2",
                                            "event": "t3"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "c2",
                            "initial": "c2.1",
                            "states": [
                                {
                                    "id": "c2.1",
                                    "transitions": [
                                        {
                                            "target": "c2.2",
                                            "event": "t4"
                                        },
                                        {
                                            "target": "c2.2",
                                            "event": "t7"
                                        }
                                    ]
                                },
                                {
                                    "id": "c2.2"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

},{}],203:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["b"]
        },
        {
            "event" : { "name" : "foo.bar" },
            "nextConfiguration" : ["c"]
        },
        {
            "event" : { "name" : "foo.bar.bat" },
            "nextConfiguration" : ["d"]
        },
        {
            "event" : { "name" : "foo.bar.bat" },
            "nextConfiguration" : ["e"]
        },
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["e"]
        },
        {
            "event" : { "name" : "foo.bar.bat" },
            "nextConfiguration" : ["f"]
        },
        {
            "event" : { "name" : "foobar" },
            "nextConfiguration" : ["f"]
        },
        {
            "event" : { "name" : "foo.bar.bat.bif" },
            "nextConfiguration" : ["g"]
        }
    ]
}




},{}],204:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "foo.bar"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "foo.bar.bat"
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "e",
            "transitions": [
                {
                    "target": "f",
                    "event": "foo.bar"
                }
            ]
        },
        {
            "id": "f",
            "transitions": [
                {
                    "target": "g",
                    "event": "foo.bar.bat"
                }
            ]
        },
        {
            "id": "g"
        }
    ]
};

},{}],205:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["b"]
        }
    ]
}





},{}],206:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "*"
                },
                {
                    "target": "fail",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "fail"
        }
    ]
};

},{}],207:[function(require,module,exports){module.exports={
    "initialConfiguration" : ["a"],
    "events" : [
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["b"]
        },
        {
            "event" : { "name" : "foo.bar" },
            "nextConfiguration" : ["c"]
        },
        {
            "event" : { "name" : "foo.bar.bat" },
            "nextConfiguration" : ["d"]
        },
        {
            "event" : { "name" : "foo.bar.bat" },
            "nextConfiguration" : ["e"]
        },
        {
            "event" : { "name" : "foo" },
            "nextConfiguration" : ["e"]
        },
        {
            "event" : { "name" : "foo.bar.bat" },
            "nextConfiguration" : ["f"]
        },
        {
            "event" : { "name" : "foobar" },
            "nextConfiguration" : ["f"]
        },
        {
            "event" : { "name" : "foo.bar.bat.bif" },
            "nextConfiguration" : ["g"]
        }
    ]
}





},{}],208:[function(require,module,exports){//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "foo.bar"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "foo.bar.bat"
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "event": "foo.*"
                },
                {
                    "target": "fail",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "e",
            "transitions": [
                {
                    "target": "f",
                    "event": "foo.bar.*"
                },
                {
                    "target": "fail",
                    "event": "foo.bar"
                }
            ]
        },
        {
            "id": "f",
            "transitions": [
                {
                    "target": "g",
                    "event": "foo.bar.bat.*"
                },
                {
                    "target": "fail",
                    "event": "foo.bar.bat"
                }
            ]
        },
        {
            "id": "g"
        },
        {
            "id": "fail"
        }
    ]
};

},{}],209:[function(require,module,exports){(function(process){require('es5-shim');        //load this first!
var scion = require('../lib/scion');
var addTest = require('tape');
var path = require('path');
var async = require('async');

//path to test cases is passed in via argv
var statechartModulePaths = process.argv.slice(2);      //assume these are of the form *.test.json

//console.log('statechartModulePaths',statechartModulePaths); 

var swallowErrors = false;

//if we've specified individual tests via argv, get them
//otherwise, pull it from the registry
var tests = statechartModulePaths.length ? 
        statechartModulePaths.map(function(statechartModulePath){

            //try to find a .test.json file
            var testModulePath = statechartModulePath.replace(/\.sc\.js(on)?$/,'.test.json');
            var sc = require(path.resolve('.',statechartModulePath));

            return {
                name : testModulePath,
                sc : sc,
                test : require(path.resolve('.',testModulePath))
            };
        }) : require('./tests.js');

tests.forEach(function(test){
    addTest(test.name,function(t){

        t.plan(test.test.events.length + 1);

        var sc = new scion.Statechart(test.sc);

        var actualInitialConf = sc.start();

        console.log('initial configuration',actualInitialConf);

        t.deepEqual(actualInitialConf.sort(),test.test.initialConfiguration.sort(),'initial configuration');

        async.eachSeries(test.test.events,function(nextEvent,cb){

            function ns(){
                console.log('sending event',nextEvent.event);

                var actualNextConf = sc.gen(nextEvent.event);

                console.log('next configuration',actualNextConf);

                t.deepEqual(actualNextConf.sort(),nextEvent.nextConfiguration.sort(),'next configuration after sending event ' + nextEvent.name);

                cb();
            }

            if(nextEvent.after){
                console.log('Test harness waiting',nextEvent.after,'ms before sending next event');
                setTimeout(ns,nextEvent.after);
            }else{
                ns();
            }
        },function(){
            //we could explicitly end here by calling t.end(), but we don't need to - t.plan() should take care of it automatically
        });
    });
});

})(require("__browserify_process"))
},{"path":2,"./tests.js":4,"../lib/scion":3,"es5-shim":210,"tape":211,"async":212,"__browserify_process":1}],210:[function(require,module,exports){(function(){// vim: ts=4 sts=4 sw=4 expandtab
// -- kriskowal Kris Kowal Copyright (C) 2009-2011 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright (C) 2010 XXX TODO License or CLA
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Gozala Irakli Gozalishvili Copyright (C) 2010 MIT License
// -- kitcambridge Kit Cambridge Copyright (C) 2011 MIT License
// -- kossnocorp Sasha Koss XXX TODO License or CLA
// -- bryanforbes Bryan Forbes XXX TODO License or CLA
// -- killdream Quildreen Motta XXX TODO License or CLA
// -- michaelficarra Michael Ficarra Copyright (C) 2011 3-clause BSD License
// -- sharkbrainguy Gerard Paapu Copyright (C) 2011 MIT License
// -- bbqsrc Brendan Molloy XXX TODO License or CLA
// -- iwyg XXX TODO License or CLA
// -- DomenicDenicola Domenic Denicola XXX TODO License or CLA
// -- xavierm02 Montillet Xavier XXX TODO License or CLA
// -- Raynos Raynos XXX TODO License or CLA
// -- samsonjs Sami Samhuri XXX TODO License or CLA
// -- rwldrn Rick Waldron XXX TODO License or CLA
// -- lexer Alexey Zakharov XXX TODO License or CLA

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-050.pdf
 *
 * NOTE: this is a draft, and as such, the URL is subject to change.  If the
 * link is broken, check in the parent directory for the latest TC39 PDF.
 * http://www.ecma-international.org/publications/files/drafts/
 *
 * Previous ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
 * This is a broken link to the previous draft of ES5 on which most of the
 * numbered specification references and quotes herein were taken.  Updating
 * these references and quotes to reflect the new document would be a welcome
 * volunteer project.
 *
 * @module
 */

/*whatsupdoc*/

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function")
            throw new TypeError(); // TODO message
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 9. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 10. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 11. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 12. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        // 13. The [[Scope]] internal property of F is unused and need not
        //   exist.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.

                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (result !== null && Object(result) === result)
                    return result;
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the list
                //   boundArgs in the same order followed by the same values as
                //   the list ExtraArgs in the same order. 5.  Return the
                //   result of calling the [[Call]] internal method of target
                //   providing boundThis as the this value and providing args
                //   as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // XXX bound.length is never writable, so don't even try
        //
        // 16. The length own property of F is given attributes as specified in
        //   15.3.5.1.
        // TODO
        // 17. Set the [[Extensible]] internal property of F to true.
        // TODO
        // 18. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // 19. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property.
        // XXX can't delete it in pure-js.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.3.2
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var self = toObject(this),
            thisp = arguments[1],
            i = 0,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object context
                fun.call(thisp, self[i], i, self);
            }
            i++;
        }
    };
}

// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, self);
        }
        return result;
    };
}

// ES5 15.4.4.20
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = [],
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                result.push(self[i]);
        }
        return result;
    };
}

// ES5 15.4.4.16
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self))
                return false;
        }
        return true;
    };
}

// ES5 15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                return true;
        }
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self)
                result = fun.call(void 0, result, self[i], i, self);
        }

        return result;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        do {
            if (i in this)
                result = fun.call(void 0, result, self[i], i, self);
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;

        var i = 0;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);

        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;
        var i = length - 1;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i])
                return i;
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}

// ES5 15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        // If object does not owns property return undefined immediately.
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;

                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { "__proto__": null };
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);

        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

// ES5 15.2.3.14
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {

    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function keys(object) {

        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// Format a Date object as a string according to a simplified subset of the ISO 8601
// standard as defined in 15.9.1.15.
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value;
        if (!isFinite(this))
            throw new RangeError;

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10)
                result[length] = "0" + value;
        }
        // pad milliseconds to have three digits.
        return result.slice(0, 3).join("-") + "T" + result.slice(3).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }
}

// ES5 15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // This function provides a String representation of a Date object for
        // use by JSON.stringify (15.12.3). When the toJSON method is called
        // with argument key, the following steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function")
            throw new TypeError(); // TODO message
        // 6. Return the result of calling the [[Call]] internal method of
        // toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("2011-06-15T21:40:05+06:00"))) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format. This pattern does not implement
        // extended years (15.9.1.15.1), as `Date.UTC` cannot parse them.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4})" + // four-digit year capture
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:\\.(\\d{3}))?" + // milliseconds capture
                ")?" +
            "(?:" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate)
            Date[key] = NativeDate[key];

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // parse months, days, hours, minutes, seconds, and milliseconds
                for (var i = 1; i < 7; i++) {
                    // provide default values if necessary
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // `Date` objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i == 1)
                        match[i]--;
                }

                // parse the UTC offset component
                var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

                // compute the explicit time zone offset if specified
                var offset = 0;
                if (sign) {
                    // detect invalid offsets and return early
                    if (hourOffset > 23 || minuteOffset > 59)
                        return NaN;

                    // express the provided time zone offset in minutes. The offset is
                    // negative for time zones west of UTC; positive otherwise.
                    offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
                }

                // compute a new UTC date value, accounting for the optional offset
                return NativeDate.UTC.apply(this, match) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

//
// String
// ======
//

// ES5 15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// http://jsperf.com/to-integer
var toInteger = function (n) {
    n = +n;
    if (n !== n) // isNaN
        n = -1;
    else if (n !== 0 && n !== (1/0) && n !== -(1/0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    return n;
};

var prepareString = "a"[0] != "a",
    // ES5 9.9
    toObject = function (o) {
        if (o == null) { // this matches both null and undefined
            throw new TypeError(); // TODO message
        }
        // If the implementation doesn't support by-index access of
        // string characters (ex. IE < 7), split the string
        if (prepareString && typeof o == "string" && o) {
            return o.split("");
        }
        return Object(o);
    };
});

})()
},{}],212:[function(require,module,exports){(function(process){/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                setImmediate(fn);
            };
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
        }
    }
    else {
        async.nextTick = process.nextTick;
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            var sync = true;
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        if (sync) {
                            async.nextTick(iterate);
                        }
                        else {
                            iterate();
                        }
                    }
                }
            });
            sync = false;
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                if (err) {
                    callback(err);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    async.nextTick(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.nextTick(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            var sync = true;
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (sync) {
                    async.nextTick(function () {
                        async.whilst(test, iterator, callback);
                    });
                }
                else {
                    async.whilst(test, iterator, callback);
                }
            });
            sync = false;
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var sync = true;
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                if (sync) {
                    async.nextTick(function () {
                        async.doWhilst(iterator, test, callback);
                    });
                }
                else {
                    async.doWhilst(iterator, test, callback);
                }
            }
            else {
                callback();
            }
        });
        sync = false;
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            var sync = true;
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (sync) {
                    async.nextTick(function () {
                        async.until(test, iterator, callback);
                    });
                }
                else {
                    async.until(test, iterator, callback);
                }
            });
            sync = false;
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        var sync = true;
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                if (sync) {
                    async.nextTick(function () {
                        async.doUntil(iterator, test, callback);
                    });
                }
                else {
                    async.doUntil(iterator, test, callback);
                }
            }
            else {
                callback();
            }
        });
        sync = false;
    };

    async.queue = function (worker, concurrency) {
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.nextTick(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var sync = true;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(function () {
                        var cbArgs = arguments;

                        if (sync) {
                            async.nextTick(function () {
                                next.apply(null, cbArgs);
                            });
                        } else {
                            next.apply(null, arguments);
                        }
                    });
                    worker(task.data, cb);
                    sync = false;
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.nextTick(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

})(require("__browserify_process"))
},{"__browserify_process":1}],211:[function(require,module,exports){(function(process){var createDefaultStream = require('./lib/default_stream');
var Render = require('./lib/render');
var Test = require('./lib/test');

exports = module.exports = createHarness();
exports.createHarness = createHarness;
exports.Test = Test;

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function'
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;
var onexit = (function () {
    var stack = [];
    if (canEmitExit) process.on('exit', function (code) {
        for (var i = 0; i < stack.length; i++) stack[i](code);
    });
    return function (cb) { stack.push(cb) };
})();

function createHarness (conf_) {
    var pending = [];
    var running = false;
    var count = 0;
    
    var began = false;
    var only = false;
    var closed = false;
    var out = new Render();
    
    var test = function (name, conf, cb) {
        count++;
        var t = new Test(name, conf, cb);
        if (!conf || typeof conf !== 'object') conf = conf_ || {};
        
        if (conf.exit !== false) {
            onexit(function (code) {
                t._exit();
                if (!closed) {
                    closed = true
                    out.close();
                }
                if (!code && !t._ok && (!only || name === only)) {
                    process.exit(1);
                }
            });
        }
        
        process.nextTick(function () {
            if (!out.piped) out.pipe(createDefaultStream());
            if (!began) out.begin();
            began = true;
            
            var run = function () {
                running = true;
                out.push(t);
                t.run();
            };
            
            if (only && name !== only) {
                count--;
                return;
            }

            if (running || pending.length) {
                pending.push(run);
            }
            else run();
        });
        
        t.on('test', function sub (st) {
            count++;
            st.on('test', sub);
            st.on('end', onend);
        });
        
        t.on('end', onend);
        
        return t;
        
        function onend () {
            count--;
            if (this._progeny.length) {
                var unshifts = this._progeny.map(function (st) {
                    return function () {
                        running = true;
                        out.push(st);
                        st.run();
                    };
                });
                pending.unshift.apply(pending, unshifts);
            }
            
            process.nextTick(function () {
                running = false;
                if (pending.length) return pending.shift()();
                if (count === 0 && !closed) {
                    closed = true
                    out.close();
                }
                if (conf.exit !== false && canExit && !t._ok) {
                    process.exit(1);
                }
            });
        }
    };
    
    test.only = function (name) {
        if (only) {
            throw new Error("there can only be one only test");
        }
        
        only = name;
        
        return test.apply(null, arguments);
    };
    
    test.stream = out;
    return test;
}

// vim: set softtabstop=4 shiftwidth=4:

})(require("__browserify_process"))
},{"./lib/default_stream":213,"./lib/render":214,"./lib/test":215,"__browserify_process":1}],213:[function(require,module,exports){var Stream = require('stream');

module.exports = function () {
    var out = new Stream;
    out.writable = true;
    var buffered = '';
    
    out.write = function (buf) {
        var s = buffered + String(buf);
        var lines = s.split('\n');
        for (var i = 0; i < lines.length - 1; i++) {
            console.log(lines[i]);
        }
        buffered = lines[i];
    };
    
    out.destroy = function () {
        out.writable = false;
        out.emit('close');
    };
    
    out.end = function (msg) {
        if (msg !== undefined) out.write(msg);
        if (buffered) console.log(buffered);
        out.writable = false;
        out.emit('close');
    };
    
    return out;
};

},{"stream":216}],216:[function(require,module,exports){var events = require('events');
var util = require('util');

function Stream() {
  events.EventEmitter.call(this);
}
util.inherits(Stream, events.EventEmitter);
module.exports = Stream;
// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once, and
  // only when all sources have ended.
  if (!dest._isStdio && (!options || options.end !== false)) {
    dest._pipeCount = dest._pipeCount || 0;
    dest._pipeCount++;

    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":217,"util":218}],217:[function(require,module,exports){(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":1}],218:[function(require,module,exports){var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
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
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
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
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
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

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
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
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":217}],214:[function(require,module,exports){var Stream = require('stream');
var json = typeof JSON === 'object' ? JSON : require('jsonify');

module.exports = Render;

function Render () {
    Stream.call(this);
    this.readable = true;
    this.count = 0;
    this.fail = 0;
    this.pass = 0;
}

Render.prototype = new Stream;

Render.prototype.pipe = function () {
    this.piped = true;
    return Stream.prototype.pipe.apply(this, arguments);
};

Render.prototype.begin = function () {
    this.emit('data', 'TAP version 13\n');
};

Render.prototype.push = function (t) {
    var self = this;
    this.emit('data', '# ' + t.name + '\n');
    
    t.on('result', function (res) {
        if (typeof res === 'string') {
            self.emit('data', '# ' + res + '\n');
            return;
        }

        self.emit('data', encodeResult(res, self.count + 1));
        self.count ++;
        
        if (res.ok) self.pass ++
        else self.fail ++
    });
};

Render.prototype.close = function () {
    this.emit('data', '\n1..' + this.count + '\n');
    this.emit('data', '# tests ' + this.count + '\n');
    this.emit('data', '# pass  ' + this.pass + '\n');
    if (this.fail) {
        this.emit('data', '# fail  ' + this.fail + '\n');
    }
    else {
        this.emit('data', '\n# ok\n');
    }
    
    this.emit('end');
};

function encodeResult (res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.replace(/\s+/g, ' ') : '';
    
    if (res.skip) output += ' # SKIP';
    else if (res.todo) output += ' # TODO';
    
    output += '\n';
    
    if (!res.ok) {
        var outer = '  ';
        var inner = outer + '  ';
        output += outer + '---\n';
        output += inner + 'operator: ' + res.operator + '\n';
        
        var ex = json.stringify(res.expected) || '';
        var ac = json.stringify(res.actual) || '';
        
        if (Math.max(ex.length, ac.length) > 65) {
            output += inner + 'expected:\n' + inner + '  ' + ex + '\n';
            output += inner + 'actual:\n' + inner + '  ' + ac + '\n';
        }
        else {
            output += inner + 'expected: ' + ex + '\n';
            output += inner + 'actual:   ' + ac + '\n';
        }
        if (res.at) {
            output += inner + 'at: ' + res.at + '\n';
        }
        if (res.operator === 'error' && res.actual && res.actual.stack) {
            var lines = String(res.actual.stack).split('\n');
            output += inner + 'stack:\n';
            output += inner + '  ' + lines[0] + '\n';
            for (var i = 1; i < lines.length; i++) {
                output += inner + lines[i] + '\n';
            }
        }
        
        output += outer + '...\n';
    }
    
    return output;
}

},{"stream":216,"jsonify":219}],215:[function(require,module,exports){(function(process,__dirname){var EventEmitter = require('events').EventEmitter;
var deepEqual = require('deep-equal');
var defined = require('defined');
var path = require('path');

module.exports = Test;

Test.prototype = new EventEmitter;

function Test (name_, opts_, cb_) {
    var name = '(anonymous)';
    var opts = {};
    var cb;
    
    for (var i = 0; i < arguments.length; i++) {
        switch (typeof arguments[i]) {
            case 'string':
                name = arguments[i];
                break;
            case 'object':
                opts = arguments[i] || opts;
                break;
            case 'function':
                cb = arguments[i];
        }
    }
    
    EventEmitter.call(this);
    
    this.name = name || '(anonymous)';
    this.assertCount = 0;
    this._skip = opts.skip || false;
    this._plan = undefined;
    this._cb = cb;
    this._progeny = [];
    this._ok = true;
}

Test.prototype.run = function () {
    if (this._skip) {
        return this.end();
    }
    try {
        this._cb(this);
    }
    catch (err) {
        this.error(err);
        this.end();
    }
};

Test.prototype.test = function (name, opts, cb) {
    var t = new Test(name, opts, cb);
    this._progeny.push(t);
    this.emit('test', t);
};

Test.prototype.comment = function (msg) {
    this.emit('result', msg.trim().replace(/^#\s*/, ''));
};

Test.prototype.plan = function (n) {
    this._plan = n;
    this.emit('plan', n);
};

Test.prototype.end = function () {
    if (!this.ended) this.emit('end');
    if (this._plan !== undefined &&
        !this._planError && this.assertCount !== this._plan) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount
        });
    }
    this.ended = true;
};

Test.prototype._exit = function () {
    if (this._plan !== undefined &&
        !this._planError && this.assertCount !== this._plan) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount
        });
    }
    else if (!this.ended) {
        this.fail('test exited without ending');
    }
    
};

Test.prototype._assert = function assert (ok, opts) {
    var self = this;
    var extra = opts.extra || {};
    
    var res = {
        id : self.assertCount ++,
        ok : Boolean(ok),
        skip : defined(extra.skip, opts.skip),
        name : defined(extra.message, opts.message, '(unnamed assert)'),
        operator : defined(extra.operator, opts.operator),
        actual : defined(extra.actual, opts.actual),
        expected : defined(extra.expected, opts.expected)
    };
    this._ok = Boolean(this._ok && ok);
    
    if (!ok) {
        res.error = defined(extra.error, opts.error, new Error(res.name));
    }
    
    var e = new Error('exception');
    var err = (e.stack || '').split('\n');
    var dir = path.dirname(__dirname) + '/';
    
    for (var i = 0; i < err.length; i++) {
        var m = /^\s*\bat\s+(.+)/.exec(err[i]);
        if (!m) continue;
        
        var s = m[1].split(/\s+/);
        var filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[1]);
        if (!filem) continue;
        
        if (filem[1].slice(0, dir.length) === dir) continue;
        
        res.functionName = s[0];
        res.file = filem[1];
        res.line = Number(filem[2]);
        if (filem[3]) res.column = filem[3];
        
        res.at = m[1];
        break;
    }
    
    self.emit('result', res);
    
    if (self._plan === self.assertCount) {
        process.nextTick(function () {
            if (!self.ended) self.end();
        });
    }
    
    if (!self._planError && self.assertCount > self._plan) {
        self._planError = true;
        self.fail('plan != count', {
            expected : self._plan,
            actual : self.assertCount
        });
    }
};

Test.prototype.fail = function (msg, extra) {
    this._assert(false, {
        message : msg,
        operator : 'fail',
        extra : extra
    });
};

Test.prototype.pass = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'pass',
        extra : extra
    });
};

Test.prototype.skip = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'skip',
        skip : true,
        extra : extra
    });
};

Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= function (value, msg, extra) {
    this._assert(value, {
        message : msg,
        operator : 'ok',
        expected : true,
        actual : value,
        extra : extra
    });
};

Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= function (value, msg, extra) {
    this._assert(!value, {
        message : msg,
        operator : 'notOk',
        expected : false,
        actual : value,
        extra : extra
    });
};

Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= function (err, msg, extra) {
    this._assert(!err, {
        message : defined(msg, String(err)),
        operator : 'error',
        actual : err,
        extra : extra
    });
};

Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.is
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= function (a, b, msg, extra) {
    this._assert(a === b, {
        message : defined(msg, 'should be equal'),
        operator : 'equal',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNotEqual
= Test.prototype.isNot
= Test.prototype.not
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= function (a, b, msg, extra) {
    this._assert(a !== b, {
        message : defined(msg, 'should not be equal'),
        operator : 'notEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.looseEqual
= Test.prototype.looseEquals
= Test.prototype.same
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notDeepEqual
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b), {
        message : defined(msg, 'should not be equivalent'),
        operator : 'notDeepEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype['throws'] = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    }
    catch (err) {
        caught = { error : err };
        var message = err.message;
        delete err.message;
        err.message = message;
    }

    var passed = caught;

    if (expected instanceof RegExp) {
        passed = expected.test(caught && caught.error);
        expected = String(expected);
    }

    this._assert(passed, {
        message : defined(msg, 'should throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error: !passed && caught && caught.error,
        extra : extra
    });
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    }
    catch (err) {
        caught = { error : err };
    }
    this._assert(!caught, {
        message : defined(msg, 'should throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error : caught && caught.error,
        extra : extra
    });
};

// vim: set softtabstop=4 shiftwidth=4:

})(require("__browserify_process"),"/../node_modules/tape/lib")
},{"events":217,"path":2,"deep-equal":220,"defined":221,"__browserify_process":1}],220:[function(require,module,exports){var pSlice = Array.prototype.slice;
var Object_keys = typeof Object.keys === 'function'
    ? Object.keys
    : function (obj) {
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }
;

var deepEqual = module.exports = function (actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b);
  }
  try {
    var ka = Object_keys(a),
        kb = Object_keys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

},{}],221:[function(require,module,exports){module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],219:[function(require,module,exports){exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

},{"./lib/parse":222,"./lib/stringify":223}],222:[function(require,module,exports){var at, // The index of the current character
    ch, // The current character
    escapee = {
        '"':  '"',
        '\\': '\\',
        '/':  '/',
        b:    '\b',
        f:    '\f',
        n:    '\n',
        r:    '\r',
        t:    '\t'
    },
    text,

    error = function (m) {
        // Call error when something is wrong.
        throw {
            name:    'SyntaxError',
            message: m,
            at:      at,
            text:    text
        };
    },
    
    next = function (c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }
        
        // Get the next character. When there are no more characters,
        // return the empty string.
        
        ch = text.charAt(at);
        at += 1;
        return ch;
    },
    
    number = function () {
        // Parse a number value.
        var number,
            string = '';
        
        if (ch === '-') {
            string = '-';
            next('-');
        }
        while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
        }
        if (ch === '.') {
            string += '.';
            while (next() && ch >= '0' && ch <= '9') {
                string += ch;
            }
        }
        if (ch === 'e' || ch === 'E') {
            string += ch;
            next();
            if (ch === '-' || ch === '+') {
                string += ch;
                next();
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
        }
        number = +string;
        if (!isFinite(number)) {
            error("Bad number");
        } else {
            return number;
        }
    },
    
    string = function () {
        // Parse a string value.
        var hex,
            i,
            string = '',
            uffff;
        
        // When parsing for string values, we must look for " and \ characters.
        if (ch === '"') {
            while (next()) {
                if (ch === '"') {
                    next();
                    return string;
                } else if (ch === '\\') {
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    string += ch;
                }
            }
        }
        error("Bad string");
    },

    white = function () {

// Skip whitespace.

        while (ch && ch <= ' ') {
            next();
        }
    },

    word = function () {

// true, false, or null.

        switch (ch) {
        case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        error("Unexpected '" + ch + "'");
    },

    value,  // Place holder for the value function.

    array = function () {

// Parse an array value.

        var array = [];

        if (ch === '[') {
            next('[');
            white();
            if (ch === ']') {
                next(']');
                return array;   // empty array
            }
            while (ch) {
                array.push(value());
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error("Bad array");
    },

    object = function () {

// Parse an object value.

        var key,
            object = {};

        if (ch === '{') {
            next('{');
            white();
            if (ch === '}') {
                next('}');
                return object;   // empty object
            }
            while (ch) {
                key = string();
                white();
                next(':');
                if (Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"');
                }
                object[key] = value();
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error("Bad object");
    };

value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

    white();
    switch (ch) {
    case '{':
        return object();
    case '[':
        return array();
    case '"':
        return string();
    case '-':
        return number();
    default:
        return ch >= '0' && ch <= '9' ? number() : word();
    }
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

module.exports = function (source, reviver) {
    var result;
    
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.

    return typeof reviver === 'function' ? (function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                }
            }
        }
        return reviver.call(holder, key, value);
    }({'': result}, '')) : result;
};

},{}],223:[function(require,module,exports){var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
}

function str(key, holder) {
    // Produce a string from holder[key].
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }
    
    // What happens next depends on the value's type.
    switch (typeof value) {
        case 'string':
            return quote(value);
        
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite(value) ? String(value) : 'null';
        
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String(value);
            
        case 'object':
            if (!value) return 'null';
            gap += indent;
            partial = [];
            
            // Array.isArray
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                
                // Join all of the elements together, separated with commas, and
                // wrap them in brackets.
                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            
            // If the replacer is an array, use it to select the members to be
            // stringified.
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            else {
                // Otherwise, iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            
        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0 ? '{}' : gap ?
            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
            '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

module.exports = function (value, replacer, space) {
    var i;
    gap = '';
    indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }
    }
    // If the space parameter is a string, it will be used as the indent string.
    else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    rep = replacer;
    if (replacer && typeof replacer !== 'function'
    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str('', {'': value});
};

},{}]},{},[209]);