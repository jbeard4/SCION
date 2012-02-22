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

				switch(state.id){
				"""

		for state in scxmlJson.states when state.transitions.length

			wildcardTransitions = (initializer.transitionToVarLabel transition for transition in state.transitions when transition.events and "*" in transition.events)
			defaultTransitions= (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.events)

			toReturn += 	"""
				case "#{state.id}":
					"""

			
			if defaultTransitions.length
				toReturn +=
					"""
					//default transitions
					transitions = transitions.concat(#{initializer.arrayToIdentifierListString defaultTransitions});
					"""

			if wildcardTransitions.length
				toReturn +=
					"""
					if(eventNames.length){
						//wildcard event
						transitions = transitions.concat(#{initializer.arrayToIdentifierListString wildcardTransitions});
					}
					"""

			toReturn +=	"""
					for(var j = 0; j < eventNames.length; j++){
						var eventName = eventNames[j];

						switch(eventName){
					"""

			for own eventName of scxmlJson.events
				#NOTE: scxmlJson.events will not contain wildcard ("*") event, 
				#and will normalize events like "foo.bat.*" to "foo.bat"
				transitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when transition.events and eventName in transition.events)
				if transitionsForEvent.length
					toReturn += 	"""
							case "#{eventName}":
								transitions = transitions.concat(#{initializer.arrayToIdentifierListString transitionsForEvent});
								break;
							"""
					
			toReturn += 	"""
							default: break;
						}
					}
					break;
					"""
				
		toReturn += 	"""

					//should throw an error here for unrecognized state
					default : break;
				}

				#{initializer.transitionFilterString}
			};
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn}});" else toReturn

		if beautify then js_beautify toReturn else toReturn
