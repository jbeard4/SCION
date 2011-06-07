define ["scxml/doc2model","scxml/event","scxml/SCXML","scxml/set","scxml/async-for"],(doc2model,Event,scxml,Set,asyncForEach) ->

	SimpleInterpreter = scxml.SimpleInterpreter

	printError = (e) ->
		console.error e.name
		console.error e.message
		console.error e.fileName
		console.error e.lineNumber

	results =
		testCount : 0
		testsPassed : 0
		testsFailed : 0
		testsErrored : 0

	interpreter = null

	#TODO: refactor the outer loop to also be async. Right now, I believe this will only work for one test.
	runTests = (tests,setTimeout,clearTimeout,finish) ->

		testCallback = (test,nextStep,errBack,failBack) ->
			#start the while loop
			startAsyncFor test,nextStep

		testsFinishedCallback = ->
			finish results

		doCallback = (e,nextStep,errBack,failBack) ->
			try
				console.log "sending event",e["event"]["name"]
				interpreter.gen(new Event(e["event"]["name"]))
				nextConfiguration = interpreter.getConfiguration()
				expectedNextConfiguration = new Set(e["nextConfiguration"])

			catch err
				errBack err

			if not expectedNextConfiguration.equals nextConfiguration
				console.error("Configuration error: expected " + expectedNextConfiguration + ", received " + nextConfiguration)

				failBack()
			else
				if(e.after)
					console.log("e.after " + e.after)
					setTimeout(nextStep,e.after)
				else
					nextStep()

		startAsyncFor = (test,doNextTest) ->

			testSuccessFullyFinished = ->
				console.log test["name"], "...passes"
				results.testsPassed++
				doNextTest()

			testFailBack = ->
				console.log test["name"], "...failed"
				results.testsFailed++
				doNextTest()

			testErrBack = (err) ->
				console.log test["name"], "...errored"
				results.testsErrored++
				printError err
				doNextTest()

			console.log("running test",test.name)

			results.testCount++

			try
				model = doc2model test.scxmlDoc
				interpreter = new SimpleInterpreter model,setTimeout,clearTimeout

				events = test.events.slice()

				console.log "starting interpreter"

				interpreter.start()
				initialConfiguration = interpreter.getConfiguration()

				console.log "initial configuration",initialConfiguration

				expectedInitialConfiguration = new Set(test["initialConfiguration"])

				console.log "expected configuration",expectedInitialConfiguration

			catch err
				testErrBack err

			if not expectedInitialConfiguration.equals(initialConfiguration)
				console.error("Configuration error: expected " + expectedInitialConfiguration + ", received " + initialConfiguration)
				testFailBack()
			else
				asyncForEach events,doCallback,testSuccessFullyFinished,testErrBack,testFailBack

		asyncForEach tests,testCallback,testsFinishedCallback,(->),(->)
