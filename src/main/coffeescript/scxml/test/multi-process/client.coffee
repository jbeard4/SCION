#how this works:
#request initial test from server
#start scxml test client
#run through test script
#when we're done, send results to server, and request new test
define ["util/BufferedStream","util/set/ArraySet","util/utils","child_process",'fs','util'],(BufferedStream,Set,utils,child_process,fs,util) ->

	->
		eventDensity = 10	#TODO: parameterize this

		wl = utils.wrapLine process.stdout.write,process.stdout

		postTestResults = (testId,results) -> wl {method:"post-results",results:results,testId:testId}

		#state variables
		currentTest = null
		currentScxmlProcess = null
		expectedConfigurations = null
		eventsToSend = null
		scxmlWL = null

		runTest = (jsonTest) ->
			#hook up state variables
			currentTest = jsonTest
			expectedConfigurations =
				[new Set currentTest.testScript.initialConfiguration].concat(
					(new Set eventTuple.nextConfiguration for eventTuple in currentTest.testScript.events))

			console.error "received test #{currentTest.id}"
			
			#start up a new statechart process
			currentScxmlProcess = child_process.spawn "bash",['bin/run-tests-spartan-shell.sh',currentTest.interpreter,'scxml/test/multi-process/scxml.js']

			scxmlWL = utils.wrapLine currentScxmlProcess.stdin.write,currentScxmlProcess.stdin

			#hook up messaging
			scOutStream = new BufferedStream currentScxmlProcess.stdout
			scOutStream.on "line",(l) -> processClientMessage JSON.parse l

			currentScxmlProcess.stderr.setEncoding 'utf8'
			currentScxmlProcess.stderr.on 'data',(s) ->
				console.error 'from statechart stderr',s

			scxmlWL currentTest
				
		sendEvents = ->
			e = eventsToSend.shift()
			if e
				console.error "sending event",e.event.name

				step = ->
					currentScxmlProcess.stdin.write "#{e.event.name}\n"
					setTimeout sendEvents,eventDensity

				if e.after then setTimeout step,e.after else step()

		processClientMessage = (jsonMessage) ->
			switch jsonMessage.method
				when "statechart-initialized"
					#start to send events into sc process
					eventsToSend = currentTest.testScript.events.slice()

					console.error 'statechart in child process initialized.'
					console.error "sending events #{JSON.stringify eventsToSend}"
					sendEvents()

				when "check-configuration"
					console.error "received request to check configuration"

					expectedConfiguration = expectedConfigurations.shift()

					configuration =  new Set jsonMessage.configuration

					console.error "Expected configuration",expectedConfiguration
					console.error "Received configuration",configuration
					console.error "Remaining expected configurations",expectedConfigurations
						
					if expectedConfiguration.equals configuration
						console.error "Matched expected configuration."

						#if we're out of tests, then we're done and we report that we succeeded
						if not expectedConfigurations.length
							#we're done, post results and send signal to fetch next test
							postTestResults currentTest.id, {pass : true}
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
						postTestResults currentTest.id,{pass : pass, msg : msg}

				when "set-timeout"
					setTimeout (-> scxmlWL jsonMessage.event),jsonMessage.timeout
				when "log"
					console.error "from statechart process:",jsonMessage.args
				when "debug"
					console.error "from statechart process:",jsonMessage.args
				else
					console.error "received unknown method:",jsonMessage.method
					

		inStream = new BufferedStream process.stdin
		inStream.on "line",(l) -> runTest JSON.parse l

		process.stdin.resume()
