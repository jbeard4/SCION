#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

define ["optimization/initializer","lib/beautify"],(initializer,js_beautify)->
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
		stateTransitionTable = (((initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event or transition.event == event.name) for eventName,event of scxmlJson.events ) for state in scxmlJson.states)
		defaultTransitionsForStates = ((initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event) for state in scxmlJson.states)
		toReturn = initializer.genOuterInitializerStr scxmlJson,"""
		var stateTransitionTable = #{tableToString stateTransitionTable};
		var defaultTransitionTable = #{defaultTableToString defaultTransitionsForStates};
		return function(state,eventNames,evaluator){
			var transitions = [];

			if(eventNames.length){
				for(var j = 0; j < eventNames.length; j++){
					var eventName = eventNames[j];
					var enumeratedEvent = eventMap[eventName];
					var eventId = enumeratedEvent.documentOrder; 

					transitions = transitions.concat(stateTransitionTable[state.documentOrder][eventId] || []);
				}
			}else{
				//default events
				transitions = transitions.concat(defaultTransitionTable[state.documentOrder] || []);
			}

			#{initializer.transitionFilterString}
		};
		"""

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn};});" else toReturn

		if beautify then js_beautify toReturn else toReturn
