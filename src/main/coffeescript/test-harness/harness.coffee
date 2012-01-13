# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/event","scxml/SCXML","util/set/ArraySet","scxml/async-for","logger"],(Event,scxml,Set,asyncForEach,logger) ->

	stopOnFail = true	#TODO: parameterize this

	SimpleInterpreter = scxml.SimpleInterpreter

	nameGroup = (n,g) -> "#{n} (#{g})"

	printError = (e) ->
		if e.stack
			#v8
			logger.error e.stack
		else
			#rhino/spidermonkey
			logger.error e.name
			logger.error e.message
			logger.error e.fileName
			logger.error e.lineNumber

	results =
		testCount : 0
		testsPassed : []
		testsFailed : []
		testsErrored : []

	interpreter = null

	#TODO: refactor the outer loop to also be async. Right now, I believe this will only work for one test.
	runTests = (tests,setTimeout,clearTimeout,finish) ->

		testCallback = (test,nextStep,errBack,failBack) ->
			#start the while loop
			startAsyncFor test,nextStep

		testsFinishedCallback = ->
			finish results

		doCallback = (e,nextStep,errBack,failBack) ->
			sendEvent = ->
				try
					logger.info "sending event",e["event"]["name"]
					interpreter.gen(new Event(e["event"]["name"]))
					nextConfiguration = interpreter.getConfiguration()
					expectedNextConfiguration = new Set(e["nextConfiguration"])

				catch err
					errBack err

				if nextConfiguration and expectedNextConfiguration
					if not expectedNextConfiguration.equals nextConfiguration
						logger.error("Configuration error: expected " + expectedNextConfiguration + ", received " + nextConfiguration)

						failBack()
					else
						nextStep()

			if(e.after)
				logger.info("e.after " + e.after)
				setTimeout(sendEvent,e.after)
			else
				sendEvent()

		startAsyncFor = (test,doNextTest) ->

			testSuccessFullyFinished = ->
				logger.info "test",nameGroup(test.name,test.group),"...passes"
				results.testsPassed.push nameGroup(test.name,test.group)
				doNextTest()

			testFailBack = ->
				logger.info "test",nameGroup(test.name,test.group),"...failed"
				results.testsFailed.push nameGroup(test.name,test.group)

				if stopOnFail
					testsFinishedCallback()
				else
					doNextTest()

			testErrBack = (err) ->
				logger.info "test",nameGroup(test.name,test.group),"...errored"
				results.testsErrored.push nameGroup(test.name,test.group)
				printError err

				if stopOnFail
					testsFinishedCallback()
				else
					doNextTest()

			logger.info("running test",test.name)

			results.testCount++

			try
				logger.info "running test for",test.name,test.group
				#TODO: other optimizations go here
				#this is safe because js does not throw array out of bounds exceptions. 
				#instead gives "undefined", so default args kick in in the SCXML constructor
				interpreter = new SimpleInterpreter test.model,setTimeout,clearTimeout,test.optimizations

				events = test.testScript.events.slice()

				logger.info "starting interpreter"

				interpreter.start()
				initialConfiguration = interpreter.getConfiguration()

				logger.trace "initial configuration",initialConfiguration

				expectedInitialConfiguration = new Set test.testScript.initialConfiguration

				logger.trace "expected configuration",expectedInitialConfiguration

			catch err
				testErrBack err

			if expectedInitialConfiguration and initialConfiguration
				if not expectedInitialConfiguration.equals(initialConfiguration)
					logger.error("Configuration error: expected " + expectedInitialConfiguration + ", received " + initialConfiguration)
					testFailBack()
				else
					asyncForEach events,doCallback,testSuccessFullyFinished,testErrBack,testFailBack

		asyncForEach tests,testCallback,testsFinishedCallback,(->),(->)
