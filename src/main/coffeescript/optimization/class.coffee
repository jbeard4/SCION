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
		DEFAULT_EVENT_NAME = "*"

		generateStateClassString = (state) ->
			classStr = """
			instances['#{state.id}'] = (function(){
				var o = {
					"#{state.id}" : function(){
			"""
			if state.parent
				for own eventName,event of scxmlJson.events
					transitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event or transition.event == event.name)

					if transitionsForEvent.length
						classStr += 	"""
								this['#{event.name}'] = function(evaluator){
									var toReturn = []
									var transitions = #{initializer.arrayToIdentifierListString transitionsForEvent};
									for(var i = 0,l=transitions.length; i < l; i++){
										var transition = transitions[i];
										if(!transition.cond || evaluator(transition)){
											toReturn.push(transition); 
										}
									}

									return toReturn.length ? toReturn : #{if state.parent then "instances['#{state.parent.id}']['#{event.name}'](evaluator)" else "null"};
								}
								"""

				defaultTransitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event)
				if defaultTransitionsForEvent.length
					classStr += 	"""
							this['#{DEFAULT_EVENT_NAME}']  = function(evaluator){
								var toReturn = []
								var transitions = #{initializer.arrayToIdentifierListString defaultTransitionsForEvent };
								for(var i = 0,l=transitions.length; i < l; i++){
									var transition = transitions[i];
									if(!transition.cond || evaluator(transition)){
										toReturn.push(transition); 
									}
								}

								return toReturn.length ? toReturn : #{if state.parent then "instances['#{state.parent.id}']['#{DEFAULT_EVENT_NAME}'](evaluator)" else "null"};
							}
							"""
			else
				#root state
				for eventName,event of scxmlJson.events
					classStr += "this['#{event.name}'] = function(){return null;};\n"
				classStr += "this['#{DEFAULT_EVENT_NAME}'] = function(){return null;};\n"
					
			classStr += """
					}
				} 
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
						for(var j = 0; j < eventNames.length; j++){
							var eventName = eventNames[j];

							var transitions = stateClassNameList[state.documentOrder][eventName](evaluator);
							if(transitions){
								toReturn = toReturn.concat(transitions);
							} 
						}
					}else{
						//default events
						toReturn = toReturn.concat(stateClassNameList[state.documentOrder]['#{DEFAULT_EVENT_NAME}'](evaluator) || []);
					}
					return toReturn;
				}
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn};});" else toReturn

		if beautify then js_beautify toReturn else toReturn
