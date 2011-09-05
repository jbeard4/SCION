# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/json2model","scxml/json2extra-model", "scxml/test/harness", "scxml/async-for","util/set/ArraySet","util/set/BitVector","util/set/BooleanArray","util/set/ObjectSet", "spartanLoaderForAllTests", "class-transition-lookup-optimization-loader", "switch-transition-lookup-optimization-loader", "table-transition-lookup-optimization-loader","scxml/model","scxml/extra-model"],(json2model,json2ExtraModel,harness,asyncForEach,ArraySet,BitVectorInitializer,BooleanArrayInitializer,ObjectSetInitializer,testTuples,classTransitionOpts,switchTransitionOpts,tableTransitionOpts,m,extraModel) ->

	runTests = (setTimeout,clearTimeout,finish,mainloop) ->
		
		#set up optimizations
		#TODO: when we have other optimizations, this is where their initialization will also go
		jsonTests = []
		for i in [0...testTuples.length]
			testTuple = testTuples[i]
			scxmlJson = testTuple.scxmlJson

			#parse scxmlJson model
			model = json2model scxmlJson
			

			#initialize opts			
			classTransOpt = classTransitionOpts[i] model.transitions,model.events
			switchTransOpt = switchTransitionOpts[i] model.transitions,model.events
			tableTransOpt = tableTransitionOpts[i] model.transitions,model.events

			optArgs =	{
						"default transition lookup" : {}
						"class-transition-lookup" : {transitionSelector:classTransOpt,onlySelectFromBasicStates:true}
						"switch-transition-lookup" : {transitionSelector:switchTransOpt}
						"table-transition-lookup" : {transitionSelector:tableTransOpt}
					}

			#filter basic states the easy way
			basicStates = (state for state in model.states when not (state.basicDocumentOrder is undefined)).sort((s1,s2) -> s1.basicDocumentOrder - s2.basicDocumentOrder)
			
			setPurposes =
				transitions :
					keyProp : "documentOrder"
					keyValueMap : model.transitions
					initializedSetClasses : {}
				states :
					keyProp : "documentOrder"
					keyValueMap : model.states
					initializedSetClasses : {}
				basicStates :
					keyProp : "basicDocumentOrder"
					keyValueMap : basicStates
					initializedSetClasses : {}

			setTypes =
				bitVector : BitVectorInitializer
				boolArray : BooleanArrayInitializer
				objectSet : ObjectSetInitializer
				arraySet : ArraySet

			for purpose,info of setPurposes
				for setName,setType of setTypes
					info.initializedSetClasses[setName] =
						switch setName
							when "bitVector"
								setType info.keyProp,info.keyValueMap
							when "boolArray"
								setType info.keyProp,info.keyValueMap.length
							when "objectSet"
								setType info.keyProp
							when "arraySet"
								setType

			extraInfo =
				"default model info" :
					"model" : m
					"jsonModel" : model
				"extra model info" :
					"model" : extraModel
					"jsonModel" : json2ExtraModel model

			flattenedTransitionsRE = /\.flattened-transitions$/

			#set up our test object
			for own optName,optArg of optArgs
				for setName of setTypes
					for extraInfoName,extraInfoObj of extraInfo

						if testTuple.name.match flattenedTransitionsRE
							optArg.onlySelectFromBasicStates=true

						optArg.TransitionSet = setPurposes.transitions.initializedSetClasses[setName]
						optArg.StateSet = setPurposes.states.initializedSetClasses[setName]
						optArg.BasicStateSet = setPurposes.basicStates.initializedSetClasses[setName]

						optArg.model = extraInfoObj.model

						jsonTests.push
							name : "#{testTuple.name} (#{optName},#{setName},#{extraInfoName})"
							group : testTuple.group
							model : model
							testScript : testTuple.testScript
							optimizations : optArg


		harness jsonTests,setTimeout,clearTimeout,finish

		if mainloop
			mainloop()
