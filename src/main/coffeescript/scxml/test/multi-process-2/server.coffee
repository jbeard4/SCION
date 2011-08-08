define ['scxml/test/multi-process-browser/json-tests','util/BufferedStream',"scxml/test/report2string",'child_process','argsparser','fs','util'],(jsonTests,BufferedStream,report2string,child_process,argsparser,fs,util) ->

	->
		optionToArray = (args,option,defaultValue) ->
			switch typeof args["-#{option}"]
				when 'undefined' then [defaultValue]
				when 'string' then [args["-#{option}"]]
				else args["-#{option}"]
	
		args = argsparser.parse Array.prototype.slice.call arguments

		eventDensity = args['-eventDensity'] or 10
		stopOnFail = args['-stopOnFail']
		projectDir = args['-projectDir'] or '/home/jacob/workspace/scion/'
		clientModulePath = args['-clientModulePath'] or '/home/jacob/workspace/scion/src/main/coffeescript/scxml/test/multi-process-2/client.coffee'
		runLocal = args['-runLocal']
		numLocalProcesses = args['-numLocalProcesses'] or 1
		verbose = args['-verbose']
		logFile = args['-logFile']
		clientAddresses = optionToArray args,'clientAddresses','localhost'
		interpreters = optionToArray args,'interpreters','spidermonkey-js'

		console.log "received args",args

		console.log "config:"
		console.log "eventDensity",eventDensity
		console.log "stopOnFail",stopOnFail
		console.log "clientModulePath",clientModulePath
		console.log "runLocal",runLocal
		console.log "numLocalProcesses",numLocalProcesses
		console.log 'logFile',logFile
		console.log 'clientAddresses',clientAddresses
		console.log 'interpreters',interpreters


		#open up file for logging
		if logFile and not (logFile is '-')
			log = fs.createWriteStream(logFile, {'flags': 'a'})

		results =
			testCount : 0
			testsPassed : []
			testsFailed : []
			testsErrored : []

		startTime = null
		endTime = null

		testMap = {}

		sendTest = (p) ->
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

				p.stdin.write "#{JSON.stringify currentTest}\n"

			else
				#there are no more tests left, so tell the client he's done
				console.error "No more tests. Wrapping up."

				finish()

		finish = ->
			console.error "All clients finished. Wrapping up."

			report =
				testCount : results.testCount
				testsPassed : result.id for result in results.testsPassed
				testsFailed : result.id for result in results.testsFailed
				testsErrored : result.id for result in results.testsErrored


			console.error report2string report

			endTime = new Date()

			#terminate all client processes
			p.stdin.end() for p in clientProcesses

			console.error "Running time: #{(endTime - startTime)/1000} seconds"

			if log then log.end()

			process.exit results.testCount == results.testsPassed

		processMessage = (jsonResults) ->

			if jsonResults.results.pass
				results.testsPassed.push testMap[jsonResults.testId].test
			else
				results.testsFailed.push testMap[jsonResults.testId].test

				console.error jsonResults.results.msg

				#if stopOnFail is set, then wrap up
				if stopOnFail
					console.error "Test #{testId} failed and stopOnFail is set. Wrapping up..."
					finish()

			#send next test
			p = clientProcesses.shift()
			clientProcesses.push p	#push this process at the end of the list, so we do a round-robin
			sendTest p

		hookUpEventHandling = (p) ->
			buff = new BufferedStream p.stdout
			buff.on "line",(line) ->
				jsonResults = JSON.parse line
				processMessage jsonResults

			#if verbose flag is set, log output of running processes
			if verbose
				p.stderr.setEncoding 'utf8'
				p.stderr.on "data",(s) ->
					l = "From process #{p.pid}: #{s}"
					if log
						log.write l
					else
						console.log l
			
		CLIENT_MODULE = "scxml/test/multi-process-2/client"

		startClient =
			if runLocal
				-> child_process.spawn "bash",["#{projectDir}/bin/run-module-node.sh",CLIENT_MODULE]
			else
				(address) -> child_process.spawn "ssh",[address,"bash","#{projectDir}/bin/run-module-node.sh",CLIENT_MODULE]

		clientAddresses = if runLocal then [0...numLocalProcesses] else clientAddresses
			
		#start clients
		console.error "starting clients"
		clientProcesses = (startClient address for address in clientAddresses)

		startTime = startTime or new Date()

		console.error "start time",startTime

		#send initial tests to clients
		for p in clientProcesses
			hookUpEventHandling p
			sendTest p
		

