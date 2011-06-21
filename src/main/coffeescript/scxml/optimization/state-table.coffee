define ["scxml/optimization/initializer","lib/beautify"],(initializer)->
	tableToString = (table) ->
		toReturn = "[\n"

		for i in [0...table.length]
			toReturn += "\t["

			for j in [0...table[i].length]

				if table[i][j].length > 0
					toReturn += "["
					for k in [0...table[i][j].length]
						transitionLabel = table[i][j][k]
						toReturn += transitionLabel

						if k < table[i][j].length - 1
							toReturn += ","
					toReturn += "]"
				else
					toReturn += "null"

				if j < table[i].length - 1
					toReturn += ","

			toReturn += "]"
			if i < table.length - 1 then toReturn += ","
			toReturn += "\n"

		toReturn += "]"
		return toReturn

	defaultTableToString = (table) ->
		toReturn = "[\n"

		for i in [0...table.length]
			if table[i].length
				toReturn += "\t["

				for j in [0...table[i].length]

					transitionLabel = table[i][j]
					toReturn += transitionLabel

					if j < table[i].length - 1
						toReturn += ","

				toReturn += "]"
			else
				toReturn += "null"
				
			if i < table.length - 1 then toReturn += ","
			toReturn += "\n"

		toReturn += "]"
		return toReturn
		
	(scxmlJson,beautify=true,asyncModuleDef=true) ->
		stateTransitionTable = (((initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event or transition.event == event.name) for eventName,event of scxmlJson.events ) for own stateId,state of scxmlJson.states)
		defaultTransitionsForStates = ((initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event) for own stateId,state of scxmlJson.states)
		toReturn = initializer.genOuterInitializerStr scxmlJson,"""
		var stateTransitionTable = #{tableToString stateTransitionTable};
		var defaultTransitionTable = #{defaultTableToString defaultTransitionsForStates};
		return function(states,events,evaluator){
			var transitions = [];
			for(var i = 0; i < states.length; i++){
				var state = states[i];

				if(events.length){
					for(var j = 0; j < events.length; j++){
						var event = events[j];
						var enumeratedEvent = eventMap[event.name];
						var eventId = enumeratedEvent.documentOrder; 

						transitions = transitions.concat(stateTransitionTable[state.documentOrder][eventId] || []);
					}
				}else{
					//default events
					transitions = transitions.concat(defaultTransitionTable[state.documentOrder] || []);
				}

			}

			#{initializer.transitionFilterString}
		};
		"""

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn};});" else toReturn

		if beautify then js_beautify toReturn else toReturn
