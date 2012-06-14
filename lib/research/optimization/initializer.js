(function() {

  module.exports = {
    transitionToVarLabel: function(transition) {
      return "$" + transition.id;
    },
    genOuterInitializerStr: function(scxmlJson, innerFnStr) {
      var i, toReturn, _ref;
      toReturn = "(function(transitions,eventMap){\n	var ";
      for (i = 0, _ref = scxmlJson.transitions.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        toReturn += "" + (this.transitionToVarLabel(scxmlJson.transitions[i])) + " = transitions[" + i + "]" + (i < (scxmlJson.transitions.length - 1) ? ',' : '');
      }
      toReturn += ";\n";
      return toReturn += "	" + innerFnStr + "\n})";
    },
    transitionFilterString: "//filter transitions based on condition\nvar toReturn = [];\nfor(var i=0; i < transitions.length; i++){\n	var transition = transitions[i];\n	if(!transition.cond || evaluator(transition)){\n		toReturn.push(transition);\n	}\n}\nreturn toReturn;",
    arrayToIdentifierListString: function(transitions) {
      var i, toReturn, transitionLabel, _ref;
      toReturn = "[";
      for (i = 0, _ref = transitions.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        transitionLabel = transitions[i];
        toReturn += transitionLabel;
        if (i < transitions.length - 1) toReturn += ",";
      }
      return toReturn += "]";
    }
  };

}).call(this);
