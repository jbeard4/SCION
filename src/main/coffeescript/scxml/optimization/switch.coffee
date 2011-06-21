define ["scxml/optimization/initializer","lib/beautify"],(initializer)->

	(scxmlJson,beautify=true,asyncModuleDef=true) ->
		toReturn = 	"""
				return function(states,events,evaluator){
					var toReturn = [],transitions=[];

					for(var i = 0; i < states.length; i++){
						var state = states[i];

						if(events.length){
							for(var j = 0; j < events.length; j++){
								var event = events[j];

								switch(state.id){
				"""

		for state in scxmlJson.states when state.transitions.length
			toReturn += 	"""
									case "#{state.id}":
										switch(event.name){\n
					"""

			for eventName,event of scxmlJson.events
				transitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event or transition.event == event.name)
				if transitionsForEvent.length
					toReturn += 	"""
											case "#{event.name}":
												transitions = transitions.concat(#{initializer.arrayToIdentifierListString transitionsForEvent});\n
												break;
							"""
					
			toReturn += 	"""
										}
										break;\n
					"""
				
		toReturn += 	"""
								}
							}

						}else{
							//default events
							switch(state.id){
				"""
		for state in scxmlJson.states when state.transitions.length
			defaultTransitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event)
			if defaultTransitionsForEvent.length
				toReturn += 	"""
									case "#{state.id}":
										transitions = transitions.concat(#{initializer.arrayToIdentifierListString defaultTransitionsForEvent });
										break;\n
						"""
			
			
		toReturn +=	"""
							}
							
						}
					}

					#{initializer.transitionFilterString}
				}
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn};});" else toReturn

		if beautify then js_beautify toReturn else toReturn
