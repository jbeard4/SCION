define ->
	transitionToVarLabel : (transition) -> "$#{transition.id}"

	genOuterInitializerStr : (scxmlJson,innerFnStr) ->
		toReturn = 	"""
				function(transitions){
					var 
				"""

		for i in [0...scxmlJson.transitions.length]
			toReturn += "#{@transitionToVarLabel scxmlJson.transitions[i]} = transitions[#{i}]#{if i < (scxmlJson.transitions.length-1) then ',' else ''}"

		toReturn += ";\n"
				
		toReturn +=	"""
					#{innerFnStr}
				}
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

