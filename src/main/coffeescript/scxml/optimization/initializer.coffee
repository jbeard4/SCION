define ->
	transitionToVarLabel : (transition) -> "$#{transition.id}"

	genOuterInitializerStr : (scxmlJson,innerFnStr) ->
		toReturn = 	"""
				function(transitions,eventMap){
					var 
				"""

		for i in [0...scxmlJson.transitions.length]
			toReturn += "#{@transitionToVarLabel scxmlJson.transitions[i]} = transitions[#{i}]#{if i < (scxmlJson.transitions.length-1) then ',' else ''}"

		toReturn += ";\n"
				
		toReturn +=	"""
					#{innerFnStr}
				}
				"""

	transitionFilterString :  	"""
					//filter transitions based on condition
					var toReturn = [];
					for(var i=0; i < transitions.length; i++){
						var transition = transitions[i];
						if(!transition.cond || evaluator(transition.cond)){
							toReturn.push(transition);
						}
					}
					return toReturn;
					"""

	arrayToIdentifierListString : (transitions) ->
		toReturn = "["

		#you get the idea here. these strings will show up as identifiers in the generated code
		#the identifiers get set up in the outer context (from genOuterInitializerStr), and captured via closure in the inner context
		for i in [0...transitions.length]
			transitionLabel = transitions[i]
			toReturn += transitionLabel
			if i < transitions.length - 1
				toReturn += ","

		toReturn +=	"]"

