#how this works:
#request initial test from server
#start scxml test client
#run through test script
#when we're done, send results to server, and request new test
require ["util/BufferedStream","util/set/ArraySet","util/utils","child_process"],(BufferedStream,ArraySet,utils,child_process) ->

	eventDensity = 10	#TODO: parameterize this

	wl = utils.wrapLine process.stdout.write

	comm =
		getTest : -> wl {method:"get-test"}
		postTestResults : (testId,results) -> wl {method:"post-results",results:results,testId:testId}

	#state variables
	currentJsonTest = null
	currentScxmlProcess = null
	expectedConfigurations = null
	eventsToSend = null
	scxmlWL = null

	runTest = (jsonTest) ->
		#hook up state variables
		currentJsonTest = jsonTest
		expectedConfigurations =
			[new Set jsonTest.testScript.initialConfiguration].concat(
				(new Set eventTuple.nextConfiguration for eventTuple in currentTest.testScript.events))
		
		#start up a new statechart process
		currentScxmlProcess = child_process.spawn "bash",['bin/run-tests-spartan-shell.sh',jsonTest.interpreter,'scxml/test/multi-process-2/scxml.js']

		scxmlWL = utils.wrapLine currentScxmlProcess.stdin.write

		#hook up messaging
		scOutStream = new BufferedStream currentScxmlProcess.stdout
		scOutStream.on "line",(l) -> processClientMessage JSON.parse l

		scxmlWL jsonTest
			
	sendEvents = ->
		e = eventsToSend.shift()
		if e
			console.error "sending event",(e.event?.name or e)

			step = ->
				scxmlWL e.name
				setTimeout (-> sendEvents(events)),eventDensity

			if e.after then setTimeout step,e.after else step()

	#server sends tests only
	processServerMessage = (jsonTest) -> runTest jsonTest

	processClientMessage = (jsonMessage) ->
		switch jsonMessage.method
			when "statechart-initialized"
				#start to send events into sc process
				eventsToSend = test.testScript.events.slice()
				sendEvents()

			when "check-configuration"
				expectedConfiguration = expectedConfigurations.shift()

				configuration =  new Set jsonMessage.configuration

				console.error "Expected configuration",expectedConfiguration
				console.error "Remaining expected configurations",testData.expectedConfigurations
					
				if expectedConfiguration.equals configuration
					process.stderr.write "Matched expected configuration."

					#if we're out of tests, then we're done and we report that we succeeded
					if not expectedConfigurations.length
						comm.postTestResults test.id, {pass : true}
						currentScxmlProcess.removeAllListeners()
						currentScxmlProcess.stdin.write "$quit"
						currentScxmlProcess.stdin.end()
						
				else
					#test has failed
					pass = false
					msg = "Did not match expected configuration. Received: #{JSON.stringify(configuration)}. Expected:#{JSON.stringify(expectedConfiguration)}."

					#prevent sending further events
					eventsToSend = []

					#clear event listeners
					currentScxmlProcess.removeAllListeners()
					currentScxmlProcess.stdin.write "$quit"
					currentScxmlProcess.stdin.end()

					#report failed test
					comm.postTestResults test.id,{pass : pass, msg : msg}

			when "set-timeout"
				setTimeout (-> scxmlWL jsonMessage.event),jsonMessage.timeout
			when "log"
				console.error "from statechart process:",jsonMessage.args
				

	inStream = new BufferedStream process.stdin
	inStream.on "line",(l) -> processServerMessage JSON.parse l
