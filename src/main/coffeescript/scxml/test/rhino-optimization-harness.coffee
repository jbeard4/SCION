define ["scxml/json2model", "scxml/test/harness", "scxml/test/report2string", "scxml/async-for", "spartanLoaderForAllTests", "class-transition-lookup-optimization-loader", "switch-transition-lookup-optimization-loader", "table-transition-lookup-optimization-loader","scxml/test/simple-env"],(json2model,harness,report2string,asyncForEach,testTuples,classTransitionOpts,switchTransitionOpts,tableTransitionOpts,SimpleEnv) ->

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
						" " : []
						"class-transition-lookup" : [classTransOpt,true]
						"switch-transition-lookup" : [switchTransOpt,false]
						"table-transition-lookup" : [tableTransOpt,false]
					}

			#set up our test object
			for own optName,optArg of optArgs
				jsonTests.push
					name : "#{testTuple.testScript.name} (#{optName})"
					model : model
					testScript : testTuple.testScript
					optimizations : optArg
		finish = (report) ->
			console.info report2string report
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		env = new SimpleEnv()

		harness jsonTests,env.setTimeout,env.clearTimeout,finish

		env.mainLoop()	#give control to the environment

