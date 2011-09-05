# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/optimization/initializer","lib/beautify"],(initializer)->

	(scxmlJson,beautify=true,asyncModuleDef=true) ->
		toReturn = 	"""
			return function(state,eventNames,evaluator){
				var toReturn = [],transitions=[];

				if(eventNames.length){
					for(var j = 0; j < eventNames.length; j++){
						var eventName = eventNames[j];

						switch(state.id){
				"""

		for state in scxmlJson.states when state.transitions.length
			toReturn += 	"""
								case "#{state.id}":
								switch(eventName){\n
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

				#{initializer.transitionFilterString}
			}
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn};});" else toReturn

		if beautify then js_beautify toReturn else toReturn
