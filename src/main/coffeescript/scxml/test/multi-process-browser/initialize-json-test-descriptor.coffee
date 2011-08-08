define ["scxml/json2model","scxml/json2extra-model"],(json2model,json2ExtraModel) ->

	(testJson,callback) ->

		mPath = if testJson.extraModelInfo then "scxml/model" else "scxml/extra-model"

		#console.debug "requiring",mPath,testJson.set.setType,testJson.transitionSelector.selector

		require [mPath,testJson.set.setType,testJson.transitionSelector.selector],(m,setConstructor,transitionSelector) ->

			#console.debug "imported depenedent modules",m.toString(),setConstructor.toString(),transitionSelector.toString()

			#parse scxmlJson model
			model = json2model testJson.scxmlJson

			transitionSelector = transitionSelector model.transitions,model.events

			flattenedTransitionsRE = /\.flattened-transitions$/

			onlySelectFromBasicStates =  testJson.transitionSelector.selectorKey is "class-transition-lookup" or testJson.name.match flattenedTransitionsRE

			#filter basic states the easy way
			basicStates = (state for state in model.states when not (state.basicDocumentOrder is undefined)).sort((s1,s2) -> s1.basicDocumentOrder - s2.basicDocumentOrder)
			
			setPurposes =
				transitions :
					keyProp : "documentOrder"
					keyValueMap : model.transitions
					initializedSetClass : {}
				states :
					keyProp : "documentOrder"
					keyValueMap : model.states
					initializedSetClass : {}
				basicStates :
					keyProp : "basicDocumentOrder"
					keyValueMap : basicStates
					initializedSetClass : {}

			for purpose,info of setPurposes
				info.initializedSetClass =
					switch testJson.set.setTypeKey
						when "bitVector"
							setConstructor info.keyProp,info.keyValueMap
						when "boolArray"
							setConstructor info.keyProp,info.keyValueMap.length
						when "objectSet"
							setConstructor info.keyProp
						when "arraySet"
							setConstructor


			optimizations =
				onlySelectFromBasicStates : onlySelectFromBasicStates
				TransitionSet : setPurposes.transitions.initializedSetClass
				StateSet : setPurposes.states.initializedSetClass
				BasicStateSet : setPurposes.basicStates.initializedSetClass
				transitionSelector : transitionSelector
				model : m

			callback if testJson.extraModelInfo then [m,model,optimizations] else [m,json2ExtraModel(model),optimizations]
