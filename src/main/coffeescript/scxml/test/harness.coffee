# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/event","scxml/SCXML","util/set/ArraySet","scxml/async-for"],(Event,scxml,Set,asyncForEach) ->

	SimpleInterpreter = scxml.SimpleInterpreter

	nameGroup = (n,g) -> "#{n} (#{g})"

	printError = (e) ->
		if e.stack
			#v8
			console.error e.stack
		else
			#rhino/spidermonkey
			console.error e.name
			console.error e.message
			console.error e.fileName
			console.error e.lineNumber

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
					console.info "sending event",e["event"]["name"]
					interpreter.gen(new Event(e["event"]["name"]))
					nextConfiguration = interpreter.getConfiguration()
					expectedNextConfiguration = new Set(e["nextConfiguration"])

				catch err
					errBack err

				if nextConfiguration and expectedNextConfiguration
					if not expectedNextConfiguration.equals nextConfiguration
						console.error("Configuration error: expected " + expectedNextConfiguration + ", received " + nextConfiguration)

						failBack()
					else
						nextStep()

			if(e.after)
				console.info("e.after " + e.after)
				setTimeout(sendEvent,e.after)
			else
				sendEvent()

		startAsyncFor = (test,doNextTest) ->

			testSuccessFullyFinished = ->
				console.info "test",nameGroup(test.name,test.group),"...passes"
				results.testsPassed.push nameGroup(test.name,test.group)
				doNextTest()

			testFailBack = ->
				console.info "test",nameGroup(test.name,test.group),"...failed"
				results.testsFailed.push nameGroup(test.name,test.group)
				#doNextTest()
				testsFinishedCallback()

			testErrBack = (err) ->
				console.info "test",nameGroup(test.name,test.group),"...errored"
				results.testsErrored.push nameGroup(test.name,test.group)
				printError err
				doNextTest()

			console.info("running test",test.name)

			results.testCount++

			try
				console.log "running test for",test.name,test.group
				#TODO: other optimizations go here
				#this is safe because js does not throw array out of bounds exceptions. 
				#instead gives "undefined", so default args kick in in the SCXML constructor
				interpreter = new SimpleInterpreter test.model,setTimeout,clearTimeout,test.optimizations

				events = test.testScript.events.slice()

				console.info "starting interpreter"

				interpreter.start()
				initialConfiguration = interpreter.getConfiguration()

				console.debug "initial configuration",initialConfiguration

				expectedInitialConfiguration = new Set test.testScript.initialConfiguration

				console.debug "expected configuration",expectedInitialConfiguration

			catch err
				testErrBack err

			if expectedInitialConfiguration and initialConfiguration
				if not expectedInitialConfiguration.equals(initialConfiguration)
					console.error("Configuration error: expected " + expectedInitialConfiguration + ", received " + initialConfiguration)
					testFailBack()
				else
					asyncForEach events,doCallback,testSuccessFullyFinished,testErrBack,testFailBack

		asyncForEach tests,testCallback,testsFinishedCallback,(->),(->)
