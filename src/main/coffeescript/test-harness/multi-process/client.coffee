# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

#how this works:
#request initial test from server
#start scxml test client
#run through test script
#when we're done, send results to server, and request new test
define ["util/BufferedStream","util/set/ArraySet","util/utils",'util/memory','scxml/async-for',"child_process",'fs','util'],(BufferedStream,Set,utils,memoryUtil,asyncForEach,child_process,fs,util) ->

	(eventDensity,projectDir,numberOfIterationsPerTest,performanceTestMode,numberOfEventsToSendInPerformanceTestMode) ->
		SCXML_MODULE = "test-harness/multi-process/scxml"

		eventDensity = parseInt eventDensity
		numberOfIterationsPerTest = parseInt numberOfIterationsPerTest
		performanceTestMode = performanceTestMode == 'true'
		numberOfEventsToSendInPerformanceTestMode = parseInt numberOfEventsToSendInPerformanceTestMode

		STUCK_TIMEOUT = 2000		#2s timeout

		console.error "Starting client. Received args eventDensity #{eventDensity}, projectDir #{projectDir}, numberOfIterationsPerTest #{numberOfIterationsPerTest}."

		wl = utils.wrapLine process.stdout.write,process.stdout

		#state variables for each individual test
		currentScxmlProcess = null
		expectedConfigurations = null
		eventsToSend = null
		scxmlWL = null
		memory = null
		startTime = null
		initializationTime = null
		finishTime = null
		unexpectedExitListener = null
		timeoutHandle = null

		#state variables for each individual test, specifically pertaining to performance testing
		randomEventCounter = null
		receivedConfigurationCounter = null
		
		#state variables for each set of tests
		currentTest = null
		aggregateStats = null
		nextStep = errBack = failBack = null
		eventSet = null

		postTestResults = (testId,passOrFail,errcode) ->
			wl(
				method:"post-results"
				testId:testId
				stats:aggregateStats
				pass : passOrFail	#aggregate pass or fail
				errcode : errcode or ""
			)

		pushAggregateStats = (passOrFail,msg) ->
			aggregateStats.push
				pass : passOrFail
				msg : msg
				initializationTime : initializationTime - startTime
				elapsedTime : finishTime - initializationTime
				totalElapsedTime : finishTime - startTime	#for convenience
				memory : memory

		runTest = (jsonTest) ->
			#hook up state variables
			
			if not performanceTestMode
				expectedConfigurations =
					[new Set currentTest.testScript.initialConfiguration].concat(
						(new Set eventTuple.nextConfiguration for eventTuple in currentTest.testScript.events))

			console.error "received test #{currentTest.id}"
			
			#start up a new statechart process
			currentScxmlProcess = child_process.spawn "bash",["#{projectDir}/src/test-scripts/run-module.sh",SCXML_MODULE,currentTest.interpreter]

			unexpectedExitListener = ->
				msg = "statechart process ended unexpectedly"
				finishTest "error",msg
				console.error msg

			currentScxmlProcess.on "exit",unexpectedExitListener

			scxmlWL = utils.wrapLine currentScxmlProcess.stdin.write,currentScxmlProcess.stdin

			startTime = new Date()
			memory = []
			receivedConfigurationCounter = 0

			#hook up messaging
			scOutStream = new BufferedStream currentScxmlProcess.stdout
			scOutStream.on "line",(l) -> processClientMessage JSON.parse l

			currentScxmlProcess.stderr.setEncoding 'utf8'
			currentScxmlProcess.stderr.on 'data',(s) ->
				console.error 'from statechart stderr',s

			scxmlWL currentTest

			timeoutHandle = setTimeout timeoutHandler,STUCK_TIMEOUT
				
		sendEvents = ->
			e = eventsToSend.shift()
			if e
				console.error "sending event",e.event.name

				step = ->
					currentScxmlProcess.stdin.write "#{e.event.name}\n"
					setTimeout sendEvents,eventDensity

				if e.after then setTimeout step,e.after else step()

		sendRandomEvents = ->
			if randomEventCounter < numberOfEventsToSendInPerformanceTestMode
				#increment counter
				randomEventCounter++
				
				#choose a random event
				#FIXME: do we want to keep the same sequence of random events?
				randomEvent = eventSet[Math.floor(Math.random()*eventSet.length)]
				console.error "sending random event #{randomEvent}"

				#send it in
				currentScxmlProcess.stdin.write "#{randomEvent}\n"

				#set timeout to do it again
				setTimeout sendRandomEvents,eventDensity

		#FIXME: we may want to add better, more explicit error handling (e.g. using errback)
		finishTest = (returnStatus,msg,errcode) ->
			clearTimeout timeoutHandle

			ns = switch returnStatus
				when "pass" then nextStep
				when "fail" then failBack
				when "error" then errBack

			#prevent sending further events
			if returnStatus isnt "pass" then eventsToSend = []

			if returnStatus is "error"
				#just call the next step
				ns(errcode)

				finishTime = new Date()
				pushAggregateStats returnStatus,msg
			else

				#check memory usage
				memory.push memoryUtil.getMemory currentScxmlProcess.pid

				finishTime = new Date()
				pushAggregateStats returnStatus,msg

				#otherwise, child process should still be alive
				#remove the unexpected exit listener
				currentScxmlProcess.removeListener 'exit',unexpectedExitListener

				#we're done, post results and send signal to fetch next test
				currentScxmlProcess.on 'exit',->
					#remove all other event listeners
					currentScxmlProcess.removeAllListeners()
					#call next step or failBack
					ns(errcode)

				#close the pipe, which will terminate the process
				currentScxmlProcess.stdin.end()

		timeoutHandler = ->
			currentScxmlProcess.kill()
			finishTest "error","Test timed out.","timeout"

		processClientMessage = (jsonMessage) ->
			#restart timeout timer
			clearTimeout timeoutHandle
			timeoutHandle = setTimeout timeoutHandler,STUCK_TIMEOUT

			switch jsonMessage.method
				when "statechart-initialized"
					console.error 'statechart in child process initialized.'

					#log memory and time
					memory.push memoryUtil.getMemory currentScxmlProcess.pid
					initializationTime = new Date()

					#start to send events into sc process
					if performanceTestMode
						#reset the random event counter
						randomEventCounter = 0
						sendRandomEvents()
	
					else
						console.error "sending events #{JSON.stringify eventsToSend}"
						eventsToSend = currentTest.testScript.events.slice()
						sendEvents()


				when "check-configuration"
					console.error "received request to check configuration"

					configuration =  new Set jsonMessage.configuration
					console.error "Received configuration",configuration

					if performanceTestMode
						receivedConfigurationCounter++

						#statechart has executed all events, so wrap up
						#+1 because we will receive initial configuration as well
						if receivedConfigurationCounter == (numberOfEventsToSendInPerformanceTestMode+1)
							finishTest "pass"
					else
						expectedConfiguration = expectedConfigurations.shift()

						console.error "Expected configuration",expectedConfiguration
						console.error "Remaining expected configurations",expectedConfigurations

						if expectedConfiguration.equals configuration
							console.error "Matched expected configuration."

							#if we're out of tests, then we're done and we report that we succeeded
							if not expectedConfigurations.length then finishTest "pass"
								
								
						else
							#test has failed
							msg = "Did not match expected configuration. Received: #{JSON.stringify(configuration)}. Expected:#{JSON.stringify(expectedConfiguration)}."

							finishTest "fail",msg


				when "set-timeout"
					setTimeout (-> scxmlWL jsonMessage.event),jsonMessage.timeout
				when "log"
					console.error "from statechart process:",jsonMessage.args
				when "debug"
					console.error "from statechart process:",jsonMessage.args
				else
					console.error "received unknown method:",jsonMessage.method
					

		inStream = new BufferedStream process.stdin
		inStream.on "line",(l) ->
			currentTest = JSON.parse l
			aggregateStats = []

			if performanceTestMode
				eventSet = (k for own k of currentTest.scxmlJson.events)
				if not eventSet.length
					console.error "No need to run performance test on statechart that does not have transitions other than default transitions. Posting results as trivial success."
					postTestResults currentTest.id,"pass"
					return

			#TODO: accumulate aggregate results in some data structure so we can post them here
			asyncForEach(
				[0...numberOfIterationsPerTest],
				( (l,ns,eb,fb) ->
					nextStep = ns
					errBack = eb
					failBack = fb
					runTest currentTest
				),
				(->
					console.error "Done. Posting results."
					postTestResults currentTest.id,"pass"),
				((errcode) ->
					console.error "Done (test errored). Posting results."
					postTestResults currentTest.id,"error",errcode),
				((errcode) ->
					
					console.error "Done (test failed). Posting results."
					postTestResults currentTest.id,"fail",errcode)
			)

		process.stdin.resume()
