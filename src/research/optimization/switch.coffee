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

initializer = require "research/optimization/initializer"
util = require "research/optimization/util"

module.exports = (scxmlJson) ->
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
								case '#{state.id}':
								switch(eventName){\n
					"""

			for eventName,event of scxmlJson.events
				transitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when (not transition.events) or event.name in transition.events )
				if transitionsForEvent.length
					toReturn += 	"""
									case '#{util.escapeEvent event.name}':
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
			defaultTransitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.events)
			if defaultTransitionsForEvent.length
				toReturn += 	"""
							case '#{state.id}':
								transitions = transitions.concat(#{initializer.arrayToIdentifierListString defaultTransitionsForEvent });
								break;\n
						"""
			
			
		toReturn +=	"""
					}
					
				}

				#{initializer.transitionFilterString}
			}
				"""

		return initializer.genOuterInitializerStr scxmlJson,toReturn

