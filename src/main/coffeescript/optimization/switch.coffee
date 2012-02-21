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

	(scxmlJson,beautify=true,asyncModuleDef=true) ->
		toReturn = 	"""
			return function(state,eventNames,evaluator){
				var transitions=[];

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
									default : break;
								}
								break;\n
					"""
				
		toReturn += 	"""
							default : break;
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
						default : break;
					}
					
				}

				#{initializer.transitionFilterString}
			};
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn}});" else toReturn

		if beautify then js_beautify toReturn else toReturn
