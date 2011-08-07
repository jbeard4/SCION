define ['scxml/test/multi-process-browser/json-tests','util/set/ArraySet',"scxml/test/report2string",'scxml/test/multi-process-browser/server-client-comm','child_process','promise','http','url','path','util','fs','argsparser'],(jsonTests,Set,report2string,serverClientComm,child_process,promiseModule,http,urlModule,pathModule,util,fs,argsparser) ->

	clone = (o) ->
		toReturn = {}
		toReturn[k]=v for own k,v of o
		return toReturn

	->
		args = argsparser.parse Array.prototype.slice.call arguments

		eventDensity = args['-eventDensity'] or 10
		stopOnFail = args['-stopOnFail']
		projectDir = args['-projectDir'] or '/home/jacob/workspace/scion/'
		clientModulePath = args['-clientModulePath'] or '/home/jacob/workspace/scion/src/main/coffeescript/scxml/test/multi-process-2/client.coffee'
		runLocal = args['-runLocal']
		numLocalProcesses = args['-numLocalProcesses'] or 0

		clientAddresses =
			switch typeof args['-clientAddresses']
				when 'undefined' then ['localhost']
				when 'string' then [args['-clientAddresses']]
				else args['-clientAddresses']

		console.log "received args",args

		console.log "config:"
		console.log "eventDensity",eventDensity
		console.log "stopOnFail",stopOnFail
		console.log "clientModulePath",clientModulePath
		console.log "runLocal",runLocal
		console.log "runLocalProcesses",runLocalProcesses

		results =
			testCount : 0
			testsPassed : []
			testsFailed : []
			testsErrored : []

		startTime = null
		endTime = null

		testMap = {}

		finishedClients = []

		finish = ->
			console.error "All clients finished. Wrapping up."

			report =
				testCount : results.testCount
				testsPassed : result.id for result in results.testsPassed
				testsFailed : result.id for result in results.testsFailed
				testsErrored : result.id for result in results.testsErrored


			console.error report2string report

			endTime = new Date()

			console.error "Running time: #{(endTime - startTime)/1000} seconds"

			process.exit results.testCount == results.testsPassed

		console.error "starting server"
		processMessage = (p,jsonMessage) ->

			switch jsonMessage.method
				when "get-test"

					#capture the start time on first request
					startTime = startTime or new Date()

					response.writeHead 200,{"Content-Type":"text/json"}

					currentTest = jsonTests.pop()

					if currentTest
						#there are still tests left, so start a test
						
						console.error "starting test #{currentTest.id})"

						#put the current test in the testmap
						#the important stateful variable is the list of expected configurations
						testMap[currentTest.id] =
							test : currentTest
							sourceProcess : p

						results.testCount++

						p.write "#{JSON.stringify currentTest}\n"

					else
						#there are no more tests left, so tell the client he's done
						console.error "No more tests. Adding #{request.connection.remoteAddress} to finishedClients"

						finishedClients.push p
						p.stdin.end()

						console.error "#{finishedClients.length} clients finished"

						#once all clients are finished, then we're finished
						#print report and exit
						if finishedClients.length == clientAddresses.length then finish()

				when "post-results"
					if jsonMessage.results.pass
						results.testsPassed.push jsonMessage.testId
					else
						results.testsFailed.push jsonMessage.testId

						console.error jsonMessage.results.msg

						#if stopOnFail is set, then wrap up
						if stopOnFail
							console.error "Test #{testId} failed and stopOnFail is set. Wrapping up..."
							finish()
				else
					console.error "Received unknown message"
					process.exit()

		hookUpEventHandling = (p) ->
			buff = new BufferedStream p.stdout
			buff.on "line",(line) ->
				jsonMessage = JSON.parse line
				processMessage p,jsonMessage

			p.stderr.setEncoding 'utf8'
			p.stderr.on "data",(s) ->
				console.error "From process #{p.id} stderr: #{s}"
			
		startClient =
			if runLocal
				-> child_process.spawn "bash",["#{projectDir}/bin/run-module-node.sh","src/main/coffeescript/scxml/test/multi-process-2/client.coffee"]
			else
				(address) -> child_process.spawn "ssh",[address,"bash","#{projectDir}/bin/run-module-node.sh","src/main/coffeescript/scxml/test/multi-process-2/client.coffee"]

		clientAddresses = if runLocal then [0...numLocalProcesses] else clientAddresses
			
		#start clients
		hookUpEventHandling startClient address for address in clientAddresses
