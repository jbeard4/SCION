define ["scxml/json2model", "scxml/test/harness", "scxml/test/report2string", "scxml/async-for","util/set/ArraySet","util/set/BitVector","util/set/BooleanArray","util/set/ObjectSet", "spartanLoaderForAllTests", "class-transition-lookup-optimization-loader", "switch-transition-lookup-optimization-loader", "table-transition-lookup-optimization-loader","scxml/test/simple-env"],(json2model,harness,report2string,asyncForEach,ArraySet,BitVectorInitializer,BooleanArrayInitializer,ObjectSetInitializer,testTuples,classTransitionOpts,switchTransitionOpts,tableTransitionOpts,SimpleEnv) ->

	runTests = ->
		
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
						" " : [undefined,undefined]
						"class-transition-lookup" : [classTransOpt,true]
						"switch-transition-lookup" : [switchTransOpt,false]
						"table-transition-lookup" : [tableTransOpt,false]
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

				
			#set up our test object
			for own optName,optArg of optArgs
				for setName of setTypes
					setArgs = [
							setPurposes.transitions.initializedSetClasses[setName]
							setPurposes.states.initializedSetClasses[setName]
							setPurposes.basicStates.initializedSetClasses[setName]]

					args = optArg.concat(setArgs)

					jsonTests.push
						name : "#{testTuple.testScript.name} (#{optName},#{setName})"
						model : model
						testScript : testTuple.testScript
						optimizations : args

		finish = (report) ->
			console.info report2string report
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		env = new SimpleEnv()

		harness jsonTests,env.setTimeout,env.clearTimeout,finish

		env.mainLoop()	#give control to the environment

