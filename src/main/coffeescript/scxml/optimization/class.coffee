define ["scxml/optimization/initializer","lib/beautify"],(initializer)->
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
										if(!transition.cond || evaluator(transition.cond)){
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
									if(!transition.cond || evaluator(transition.cond)){
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
				return function(states,events,evaluator){
					var toReturn = [];
					for(var i = 0; i < states.length; i++){
						var state = states[i];

						if(events.length){
							for(var j = 0; j < events.length; j++){
								var event = events[j];

								var transitions = stateClassNameList[state.documentOrder][event.name](evaluator);
								if(transitions){
									toReturn = toReturn.concat(transitions);
								} 
							}
						}else{
							//default events
							toReturn = toReturn.concat(stateClassNameList[state.documentOrder]['#{DEFAULT_EVENT_NAME}'](evaluator) || []);
						}
					}
					return toReturn;
				}
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		toReturn = if asyncModuleDef then "define(function(){return #{toReturn};});" else toReturn

		if beautify then js_beautify toReturn else toReturn
