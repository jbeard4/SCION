define ["scxml/optimization/initializer","lib/js/beautify"],(initializer)->
	(scxmlJson,beautify=true) ->
		generateStateClassString = (state) ->
			toReturn = ""
			constructorFnName = state.id + "Constructor"
			toReturn += """
			var #{state.id} = (function(){
				function #{constructorFnName}(){
			"""
			for event in scxmlJson.events
				transitionsForEvent = (initializer.transitionToVarLabel transition for transition in state.transitions when not transition.event or transition.event == event.name)

				if transitionsForEvent.length
					toReturn += 	"""
							this.#{event.name} = function(){
								toReturn = []
								transitions = #{initializer.arrayToIdentifierListString transitionsForEvent};
								for(var i = 0,l=transitions.length; i < l; i++){
									var transition = transitions[i];
									if(!transition.cond || evaluator(transition.cond)){
										toReturn.push(transition); 
									}
								}

								return toReturn.length ? toReturn : #{if state.parent then state.parent.id + "['#{event.name}']()" else "null"};
							}
							"""
					
			toReturn += """
				} 
			"""
			toReturn += if state.parent then "#{constructorFnName}.prototype = #{state.parent.id};" else ""
			toReturn += """
				return new #{constructorFnName}();
			})();
			"""

			return toReturn


		stateClassStrings = (generateStateClassString(state) for own stateId,state of scxmlJson.states)
		
		stateClassNameList = (stateId for own stateId of scxmlJson.states)

		toReturn = stateClassStrings.join("\n")
		toReturn += "var stateClassNameList = #{initializer.arrayToIdentifierListString stateClassNameList};"
		toReturn += 	"""
				return function(state,event){
					return stateClassNameList[state.documentOrder][event.name] || [];
				}
				"""

		toReturn = initializer.genOuterInitializerStr scxmlJson,toReturn

		if beautify then js_beautify toReturn else toReturn
