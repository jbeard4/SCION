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

		#the SCXML spec states that events must be alphanumeric, so picking out special strings to use as event names is technically safe
		WILDCARD_EVENT_NAME = "*"
		DEFAULT_EVENT_NAME = " "

		generateMethod = (eventName,transitions,parent) ->
			"""
			this['#{eventName}'] = function(evaluator){
				var toReturn = [];
				var transitions = #{initializer.arrayToIdentifierListString transitions};
				for(var i = 0,l=transitions.length; i < l; i++){
					var transition = transitions[i];
					if(!transition.cond || evaluator(transition)){
						toReturn.push(transition); 
					}
				}

				return toReturn.length ? toReturn : #{if parent then "instances['#{parent.id}']['#{eventName}'](evaluator)" else "null"};
			};
			"""

		generateStateClassString = (state) ->
			classStr = """
			instances['#{state.id}'] = (function(){
				var o = {
					"#{state.id}" : function(){
			"""
			if state.parent

				parent = state.parent

				#NOTE: scxmlJson.events will not contain wildcard ("*") event, 
				#and will normalize events like "foo.bat.*" to "foo.bat"
				for own eventName of scxmlJson.events
					transitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when transition.events and eventName in transition.events )

					if transitionsForEvent.length
						classStr += generateMethod eventName,transitionsForEvent,parent

				defaultTransitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.events)
				if defaultTransitionsForEvent.length
					classStr += generateMethod DEFAULT_EVENT_NAME,defaultTransitionsForEvent,parent

				wildcardTransitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when transition.events and "*" in transition.events)
				if wildcardTransitionsForEvent.length
					classStr += generateMethod WILDCARD_EVENT_NAME,wildcardTransitionsForEvent,parent
			else
				#root state
				for own eventName of scxmlJson.events
					classStr += "this['#{eventName}'] = function(){return null;};\n"
				classStr += "this['#{DEFAULT_EVENT_NAME}'] = function(){return null;};\n"
				classStr += "this['#{WILDCARD_EVENT_NAME}'] = function(){return null;};\n"
					
			classStr += """
					}
				}; 
			"""
			classStr += if state.parent then "o['#{state.id}'].prototype = instances['#{state.parent.id}'];" else ""
			classStr += """
				return new o['#{state.id}']();
			})();
			"""

			return classStr

		toReturn = ""

		stateClassStrings = (generateStateClassString(state) for state in scxmlJson.states)
		
		stateClassNameList = ("instances['#{state.id}']" for state in scxmlJson.states)

		toReturn += "var instances = {};\n"
		toReturn += stateClassStrings.join("\n")
		toReturn += "var stateClassNameList = #{initializer.arrayToIdentifierListString stateClassNameList};"
		toReturn += 	"""
				return function(state,eventNames,evaluator){
					var toReturn = [];

					if(eventNames.length){
						//named events
						for(var j = 0; j < eventNames.length; j++){
							var eventName = eventNames[j];

							var method = stateClassNameList[state.documentOrder][eventName];
							if(method){ 
								var transitions = method(evaluator);
								if(transitions){
									toReturn = toReturn.concat(transitions);
								} 
							}
						}

						//wildcard event
						toReturn = toReturn.concat(stateClassNameList[state.documentOrder]['#{WILDCARD_EVENT_NAME}'](evaluator) || []);
					}

					//default events
					toReturn = toReturn.concat(stateClassNameList[state.documentOrder]['#{DEFAULT_EVENT_NAME}'](evaluator) || []);
					return toReturn;
				};
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn}});" else toReturn

		if beautify then js_beautify toReturn else toReturn
