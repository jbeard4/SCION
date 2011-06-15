define ["scxml/optimization/initializer","lib/js/beautify"],(initializer)->

	(scxmlJson,beautify=true) ->
		toReturn = 	"""
				return function(state,event){
					switch(state.id){
				"""

		for own stateId,state of scxmlJson.states when state.transitions.length
			toReturn += 	"""
					case "#{state.id}":
						switch(event.name){\n
					"""

			for event in scxmlJson.events
				transitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event or transition.event == event.name)
				if transitionsForEvent.length
					toReturn += 	"""
							case "#{event.name}":
								return #{initializer.arrayToIdentifierListString transitionsForEvent};\n
							"""
					
			toReturn += 	"""
						}
						break;\n
					"""
				
		toReturn += 	"""
					}
				}
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		if beautify then js_beautify toReturn else toReturn
