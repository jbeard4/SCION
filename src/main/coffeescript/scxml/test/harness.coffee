define ["scxml/doc2model","scxml/event","scxml/SCXML","scxml/set","scxml/async-for"],(doc2model,Event,scxml,Set,asyncForEach) ->

	SimpleInterpreter = scxml.SimpleInterpreter

	printError = (e) ->
		console.error e.name
		console.error e.message
		console.error e.fileName
		console.error e.lineNumber

	testCount = 0
	testsPassed = 0
	testsFailed = 0
	testsErrored = 0
	interpreter = null

	class SCXMLConfigurationException extends Error
		constructor: (@expected,@actual) ->

		toString: -> "Configuration error: expected " + @expected + ", received " + @actual


	#TODO: refactor the outer loop to also be async. Right now, I believe this will only work for one test.
	runTests = (tests,setTimeout,clearTimeout,finish) ->

		testCallback = (test,nextStep) ->
			#start the while loop
			startAsyncFor test,nextStep

		testErrBack = (e,nextStep) ->
			printError e

			testsErrored++

			results =
				testCount : testCount
				testsPassed : testsPassed
				testsFailed :testsFailed
				testsErrored : testsErrored

			finish results

		testsFinishedCallback = ->
			results =
				testCount : testCount
				testsPassed : testsPassed
				testsFailed :testsFailed
				testsErrored : testsErrored

			finish results

		doCallback = (e,nextStep) ->
			console.log "sending event",e["event"]["name"]
			interpreter.gen(new Event(e["event"]["name"]))
			nextConfiguration = interpreter.getConfiguration()
			expectedNextConfiguration = new Set(e["nextConfiguration"])

			try
				if not expectedNextConfiguration.equals nextConfiguration
					throw SCXMLConfigurationException(expectedNextConfiguration,nextConfiguration)

			catch e
				printError e
				testsFailed++

			if(e.after)
				console.log("e.after " + e.after)
				setTimeout(nextStep,e.after)
			else
				nextStep()

		errBack = (e,nextStep) ->
			printError e
			testsErrored++
			
			nextStep()

		startAsyncFor = (test,doNextTest) ->

			console.log("running test",test.name)

			testCount++

			model = doc2model test.scxmlDoc
			interpreter = new SimpleInterpreter model,setTimeout,clearTimeout

			events = test.events.slice()

			console.log "starting interpreter"

			interpreter.start()
			initialConfiguration = interpreter.getConfiguration()

			console.log "initial configuration",initialConfiguration

			expectedInitialConfiguration = new Set(test["initialConfiguration"])

			console.log "expected configuration",expectedInitialConfiguration

			if not expectedInitialConfiguration.equals(initialConfiguration)
				throw new SCXMLConfigurationException(expectedInitialConfiguration,initialConfiguration)

			testSuccessFullyFinished = ->
				console.log test["name"], "...passes"
				testsPassed++
				doNextTest()

			asyncForEach events,doCallback,testSuccessFullyFinished,errBack

		asyncForEach tests,testCallback,testsFinishedCallback,testErrBack
