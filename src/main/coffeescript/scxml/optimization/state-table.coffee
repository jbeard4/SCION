define ["scxml/optimization/initializer","lib/js/beautify"],(initializer)->
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
			
		(scxmlJson,beautify=true) ->
			stateTransitionTable = (((initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event or transition.event == event.name) for event in scxmlJson.events ) for own stateId,state of scxmlJson.states)
			toReturn = initializer.genOuterInitializerStr scxmlJson,"""
			stateTransitionTable = #{tableToString stateTransitionTable};
			return function(state,event){
				return stateTransitionTable[state.documentOrder][event.documentOrder] || [];
			}
			"""

			if beautify then js_beautify toReturn else toReturn
