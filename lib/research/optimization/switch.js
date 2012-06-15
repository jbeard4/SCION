(function() {
  var initializer, util,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  initializer = require("research/optimization/initializer");

  util = require("research/optimization/util");

  module.exports = function(scxmlJson) {
    var defaultTransitionsForEvent, event, eventName, state, toReturn, transition, transitionsForEvent, _i, _j, _len, _len2, _ref, _ref2, _ref3;
    toReturn = "return function(state,eventNames,evaluator){\n	var toReturn = [],transitions=[];\n\n	if(eventNames.length){\n		for(var j = 0; j < eventNames.length; j++){\n			var eventName = eventNames[j];\n\n			switch(state.id){";
    _ref = scxmlJson.states;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      state = _ref[_i];
      if (!state.transitions.length) continue;
      toReturn += "case '" + state.id + "':\nswitch(eventName){\n";
      _ref2 = scxmlJson.events;
      for (eventName in _ref2) {
        event = _ref2[eventName];
        transitionsForEvent = (function() {
          var _j, _len2, _ref3, _ref4, _results;
          _ref3 = state.transitions;
          _results = [];
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            transition = _ref3[_j];
            if ((!transition.events) || (_ref4 = event.name, __indexOf.call(transition.events, _ref4) >= 0)) {
              _results.push(initializer.transitionToVarLabel(transition));
            }
          }
          return _results;
        })();
        if (transitionsForEvent.length) {
          toReturn += "case '" + (util.escapeEvent(event.name)) + "':\n	transitions = transitions.concat(" + (initializer.arrayToIdentifierListString(transitionsForEvent)) + ");\n\n	break;";
        }
      }
      toReturn += "}\nbreak;\n";
    }
    toReturn += "		}\n	}\n\n}else{\n	//default events\n	switch(state.id){";
    _ref3 = scxmlJson.states;
    for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
      state = _ref3[_j];
      if (!state.transitions.length) continue;
      defaultTransitionsForEvent = (function() {
        var _k, _len3, _ref4, _results;
        _ref4 = state.transitions;
        _results = [];
        for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
          transition = _ref4[_k];
          if (!transition.events) {
            _results.push(initializer.transitionToVarLabel(transition));
          }
        }
        return _results;
      })();
      if (defaultTransitionsForEvent.length) {
        toReturn += "case '" + state.id + "':\n	transitions = transitions.concat(" + (initializer.arrayToIdentifierListString(defaultTransitionsForEvent)) + ");\n	break;\n";
      }
    }
    toReturn += "		}\n		\n	}\n\n	" + initializer.transitionFilterString + "\n}";
    return initializer.genOuterInitializerStr(scxmlJson, toReturn);
  };

}).call(this);
