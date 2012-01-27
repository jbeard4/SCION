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

define ["scxml/json2model","scxml/json2extra-model", "test-harness/harness", "scxml/async-for","util/set/ArraySet","util/set/BitVector","util/set/BooleanArray","util/set/ObjectSet", "tests/loaders/spartan-loader-for-all-tests", "tests/loaders/class-transition-lookup-optimization-loader", "tests/loaders/switch-transition-lookup-optimization-loader", "tests/loaders/table-transition-lookup-optimization-loader","scxml/model","scxml/extra-model","scxml/default-transition-selector"],(json2model,json2ExtraModel,harness,asyncForEach,ArraySet,BitVectorInitializer,BooleanArrayInitializer,ObjectSetInitializer,testTuples,classTransitionOpts,switchTransitionOpts,tableTransitionOpts,m,extraModel,defaultTransitionSelector) ->



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
						"default transition lookup" : {transitionSelector:defaultTransitionSelector()}
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
