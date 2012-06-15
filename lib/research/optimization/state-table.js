(function() {
  var defaultTableToString, initializer, tableToString,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  initializer = require("research/optimization/initializer");

  tableToString = function(table) {
    var i, j, k, toReturn, transitionLabel, _ref, _ref2, _ref3;
    toReturn = "[\n";
    for (i = 0, _ref = table.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      toReturn += "\t[";
      for (j = 0, _ref2 = table[i].length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
        if (table[i][j].length > 0) {
          toReturn += "[";
          for (k = 0, _ref3 = table[i][j].length; 0 <= _ref3 ? k < _ref3 : k > _ref3; 0 <= _ref3 ? k++ : k--) {
            transitionLabel = table[i][j][k];
            toReturn += transitionLabel;
            if (k < table[i][j].length - 1) toReturn += ",";
          }
          toReturn += "]";
        } else {
          toReturn += "null";
        }
        if (j < table[i].length - 1) toReturn += ",";
      }
      toReturn += "]";
      if (i < table.length - 1) toReturn += ",";
      toReturn += "\n";
    }
    toReturn += "]";
    return toReturn;
  };

  defaultTableToString = function(table) {
    var i, j, toReturn, transitionLabel, _ref, _ref2;
    toReturn = "[\n";
    for (i = 0, _ref = table.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      if (table[i].length) {
        toReturn += "\t[";
        for (j = 0, _ref2 = table[i].length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
          transitionLabel = table[i][j];
          toReturn += transitionLabel;
          if (j < table[i].length - 1) toReturn += ",";
        }
        toReturn += "]";
      } else {
        toReturn += "null";
      }
      if (i < table.length - 1) toReturn += ",";
      toReturn += "\n";
    }
    toReturn += "]";
    return toReturn;
  };

  module.exports = function(scxmlJson) {
    var defaultTransitionsForStates, event, eventName, state, stateTransitionTable, toReturn, transition;
    stateTransitionTable = (function() {
      var _i, _len, _ref, _results;
      _ref = scxmlJson.states;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        _results.push((function() {
          var _ref2, _results2;
          _ref2 = scxmlJson.events;
          _results2 = [];
          for (eventName in _ref2) {
            event = _ref2[eventName];
            _results2.push((function() {
              var _j, _len2, _ref3, _ref4, _results3;
              _ref3 = state.transitions;
              _results3 = [];
              for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
                transition = _ref3[_j];
                if ((!transition.events) || (_ref4 = event.name, __indexOf.call(transition.events, _ref4) >= 0)) {
                  _results3.push(initializer.transitionToVarLabel(transition));
                }
              }
              return _results3;
            })());
          }
          return _results2;
        })());
      }
      return _results;
    })();
    defaultTransitionsForStates = (function() {
      var _i, _len, _ref, _results;
      _ref = scxmlJson.states;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        _results.push((function() {
          var _j, _len2, _ref2, _results2;
          _ref2 = state.transitions;
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            transition = _ref2[_j];
            if (!transition.events) {
              _results2.push(initializer.transitionToVarLabel(transition));
            }
          }
          return _results2;
        })());
      }
      return _results;
    })();
    toReturn = initializer.genOuterInitializerStr(scxmlJson, "var stateTransitionTable = " + (tableToString(stateTransitionTable)) + ";\nvar defaultTransitionTable = " + (defaultTableToString(defaultTransitionsForStates)) + ";\nreturn function(state,eventNames,evaluator){\n    var transitions = [];\n\n    if(eventNames.length){\n        for(var j = 0; j < eventNames.length; j++){\n            var eventName = eventNames[j];\n            var enumeratedEvent = eventMap[eventName];\n            var eventId = enumeratedEvent.documentOrder; \n\n            transitions = transitions.concat(stateTransitionTable[state.documentOrder][eventId] || []);\n        }\n    }else{\n        //default events\n        transitions = transitions.concat(defaultTransitionTable[state.documentOrder] || []);\n    }\n\n    " + initializer.transitionFilterString + "\n};");
    return toReturn;
  };

}).call(this);
