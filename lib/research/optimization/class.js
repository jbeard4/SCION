(function() {
  var initializer, util,
    __hasProp = Object.prototype.hasOwnProperty,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  initializer = require("research/optimization/initializer");

  util = require("research/optimization/util");

  module.exports = function(scxmlJson) {
    var DEFAULT_EVENT_NAME, generateStateClassString, state, stateClassNameList, stateClassStrings, toReturn;
    DEFAULT_EVENT_NAME = "*";
    generateStateClassString = function(state) {
      var classStr, defaultTransitionsForEvent, event, eventName, transition, transitionsForEvent, _ref, _ref2;
      classStr = "instances['" + state.id + "'] = (function(){\n    var o = {\n        \"" + state.id + "\" : function(){";
      if (state.parent) {
        _ref = scxmlJson.events;
        for (eventName in _ref) {
          if (!__hasProp.call(_ref, eventName)) continue;
          event = _ref[eventName];
          transitionsForEvent = (function() {
            var _i, _len, _ref2, _ref3, _results;
            _ref2 = state.transitions;
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              transition = _ref2[_i];
              if ((!transition.events) || (_ref3 = event.name, __indexOf.call(transition.events, _ref3) >= 0)) {
                _results.push(initializer.transitionToVarLabel(transition));
              }
            }
            return _results;
          })();
          if (transitionsForEvent.length) {
            classStr += "this['" + (util.escapeEvent(event.name)) + "'] = function(evaluator){\n    var toReturn = [];\n    var transitions = " + (initializer.arrayToIdentifierListString(transitionsForEvent)) + ";\n    for(var i = 0,l=transitions.length; i < l; i++){\n        var transition = transitions[i];\n        if(!transition.cond || evaluator(transition)){\n            toReturn.push(transition); \n        }\n    }\n\n    return toReturn.length ? toReturn : " + (state.parent ? "instances['" + state.parent.id + "']['" + (util.escapeEvent(event.name)) + "'](evaluator);" : "null") + ";\n};";
          }
        }
        defaultTransitionsForEvent = (function() {
          var _i, _len, _ref2, _results;
          _ref2 = state.transitions;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            transition = _ref2[_i];
            if (!transition.events) {
              _results.push(initializer.transitionToVarLabel(transition));
            }
          }
          return _results;
        })();
        if (defaultTransitionsForEvent.length) {
          classStr += "this['" + DEFAULT_EVENT_NAME + "']  = function(evaluator){\n    var toReturn = [];\n    var transitions = " + (initializer.arrayToIdentifierListString(defaultTransitionsForEvent)) + ";\n    for(var i = 0,l=transitions.length; i < l; i++){\n        var transition = transitions[i];\n        if(!transition.cond || evaluator(transition)){\n            toReturn.push(transition); \n        }\n    };\n\n    return toReturn.length ? toReturn : " + (state.parent ? "instances['" + state.parent.id + "']['" + DEFAULT_EVENT_NAME + "'](evaluator);" : "null") + ";\n}";
        }
      } else {
        _ref2 = scxmlJson.events;
        for (eventName in _ref2) {
          event = _ref2[eventName];
          classStr += "this['" + (util.escapeEvent(event.name)) + "'] = function(){return null;};\n";
        }
        classStr += "this['" + DEFAULT_EVENT_NAME + "'] = function(){return null;};\n";
      }
      classStr += "    }\n}; ";
      classStr += state.parent ? "o['" + state.id + "'].prototype = instances['" + state.parent.id + "'];" : "";
      classStr += "    return new o['" + state.id + "']();\n})();";
      return classStr;
    };
    toReturn = "";
    stateClassStrings = (function() {
      var _i, _len, _ref, _results;
      _ref = scxmlJson.states;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        _results.push(generateStateClassString(state));
      }
      return _results;
    })();
    stateClassNameList = (function() {
      var _i, _len, _ref, _results;
      _ref = scxmlJson.states;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        _results.push("instances['" + state.id + "']");
      }
      return _results;
    })();
    toReturn += "var instances = {};\n";
    toReturn += stateClassStrings.join("\n");
    toReturn += "var stateClassNameList = " + (initializer.arrayToIdentifierListString(stateClassNameList)) + ";";
    toReturn += "return function(state,eventNames,evaluator){\n    var toReturn = [];\n\n    if(eventNames.length){\n        for(var j = 0; j < eventNames.length; j++){\n            var eventName = eventNames[j];\n\n            var transitions = stateClassNameList[state.documentOrder][eventName](evaluator);\n            if(transitions){\n                toReturn = toReturn.concat(transitions);\n            } \n        }\n    }else{\n        //default events\n        toReturn = toReturn.concat(stateClassNameList[state.documentOrder]['" + DEFAULT_EVENT_NAME + "'](evaluator) || []);\n    }\n    return toReturn;\n}";
    return initializer.genOuterInitializerStr(scxmlJson, toReturn);
  };

}).call(this);
