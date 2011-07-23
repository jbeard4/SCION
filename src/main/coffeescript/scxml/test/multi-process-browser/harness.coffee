define ['scxml/test/multi-process-browser/json-tests','util/set/ArraySet',"scxml/test/report2string",'scxml/test/multi-process-browser/server-client-comm','child_process','promise','http','url','path','util','fs','argsparser'],(jsonTests,Set,report2string,serverClientComm,child_process,promiseModule,http,urlModule,pathModule,util,fs,argsparser) ->

	clone = (o) ->
		toReturn = {}
		toReturn[k]=v for own k,v of o
		return toReturn

	->
		args = argsparser.parse Array.prototype.slice.call arguments

		browser = args['-browser'] or 'firefox'
		eventDensity = args['-eventDensity'] or 10
		hostServerHostName = args['-hostServerHostName'] or 'localhost'
		hostServerPort = args['-hostServerPort'] or '8888'
		xserver = args['-xserver'] or 'Xephyr'
		windowManager = args['-windowManager'] or 'metacity'
		forwardX11 = args['-forwardX11'] or (xserver is 'Xephyr')
		projectSrcDir = args['-projectSrcDir'] or '/home/jacob/workspace/scion'
		fileServerRoot = args['-fileServerRoot'] or "#{projectSrcDir}/build"
		stopOnFail = args['-stopOnFail']

		clientAddresses =
			switch typeof args['-clientAddresses']
				when 'undefined' then ['localhost']
				when 'string' then [args['-clientAddresses']]
				else args['-clientAddresses']

		console.log "received args",args

		console.log "config:"
		console.log "browser",browser
		console.log "eventDensity",eventDensity
		console.log "clientAddresses",clientAddresses
		console.log "hostServerHostName",hostServerHostName
		console.log "hostServerPort",hostServerPort
		console.log "xserver",xserver
		console.log "windowManager",windowManager
		console.log "forwardX11",forwardX11
		console.log "projectSrcDir",projectSrcDir
		console.log "fileServerRoot",fileServerRoot
		console.log "stopOnFail",stopOnFail

		serverTestRunnerUrl = "http://#{hostServerHostName}:#{hostServerPort}/runner"

		trim = (s) -> s.replace(/^\s+|\s+$/g, '')

		Promise = promiseModule.Promise

		results =
			testCount : 0
			testsPassed : []
			testsFailed : []
			testsErrored : []

		getContentType = (path) ->
			splitPath = path.split('.')
			path = splitPath[splitPath.length-1]
			switch path
				when "js"
					"text/javascript"
				when "html"
					"text/html"
				else
					"text/plain"


		#browserWindowIds = null

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

			#TODO: kill processes, then exit
			#serverClientComm.killClientProcesses()

			process.exit results.testCount == results.testsPassed

		console.error "starting server"
		server = http.createServer (request,response) ->
			url = urlModule.parse request.url

			console.error "received request for #{url.pathname}"

			switch url.pathname
				when "/runner"
					response.writeHead 200,{"Content-Type":"text/html"}
					response.write """
					<html>
						<head>
							<script src="lib/json2.js"></script>
							<script src="lib/jquery.js"></script>
							<script src="lib/require.js"></script>
							<script src="scxml/test/multi-process-browser/browser-main.js"></script>

						</head>
						<body></body>
					</html>
					"""
					response.end()

				when "/test"

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
							sourceAddress : request.connection.remoteAddress
							expectedConfigurations :
								[new Set currentTest.testScript.initialConfiguration].concat(
									(new Set eventTuple.nextConfiguration for eventTuple in currentTest.testScript.events))

						results.testCount++

						response.write JSON.stringify currentTest
						response.end()

					else
						#there are no more tests left, so tell the client he's done
						console.error "No more tests. Adding #{request.connection.remoteAddress} to finishedClients"

						finishedClients.push request.connection.remoteAddress

						console.error "#{finishedClients.length} clients finished"

						response.write JSON.stringify {"done":true}
						response.end()

						#once all clients are finished, then we're finished
						#print report and exit
						if finishedClients.length == clientAddresses.length then finish()

				when "/statechart-initialized"
					#signal recieved when a statechart is initialized
					#we can start sending events
					do ->
						jsonData = ""
						request.on "data",(data) ->
							jsonData += data

						request.on "end",->
							o = JSON.parse(jsonData)
							
							response.writeHead 200,{"Content-Type":"text/plain"}
							response.write "Sending events to browser"
							response.end()

							#use the testid to look up the test
							testData = testMap[o.id]

							if not testData
								console.error "Cannot find testData with id #{o.id}"

							#send the events to the browser, via a proxy
							serverClientComm.sendEventsToBrowser testData.sourceAddress,testData.test.testScript.events.slice(),projectSrcDir

				when "/check-configuration"
					do ->
						jsonData = ""
						request.on "data",(data) ->
							jsonData += data

						request.on "end",->
							try
								o = JSON.parse(jsonData)

								console.error "finished reading json data",jsonData

								testData = testMap[o.id]

								if not testData
									console.error "Cannot find testData with id #{o.id}"
								
								expectedConfiguration = testData.expectedConfigurations.shift()


								configuration =  new Set o.configuration

								console.error "Expected configuration",expectedConfiguration
								console.error "Remaining expected configurations",testData.expectedConfigurations
							
								if expectedConfiguration.equals configuration
									response.writeHead 200,{"Content-Type":"text/plain"}
									console.error "Matched expected configuration."
									response.end()

										
									#if there are no more expected configurations, mark test as succeeded, send the reset event
									if not testData.expectedConfigurations.length
										results.testsPassed.push testData.test

										serverClientComm.sendResetEventToClient testData.sourceAddress,projectSrcDir
								else
									#test has failed
									response.writeHead 500,{"Content-Type":"text/plain"}
									errMsg = "Did not match expected configuration. Received: #{JSON.stringify(configuration)}. Expected:#{JSON.stringify(expectedConfiguration)}."
									response.write errMsg
									response.end()

									console.error errMsg

									results.testsFailed.push testData.test

									#if stopOnFail is set, then wrap up
									if stopOnFail
										console.error "Test #{testData.test.id} failed and stopOnFail is set. Wrapping up..."
										finish()
									else
										#otherwise send the reset event
										serverClientComm.sendResetEventToClient testData.sourceAddress,projectSrcDir

							catch e
								console.error e.message
								console.error e.type
								console.error e.stack
								response.writeHead 500
								response.end()

								#serverClientComm.sendResetEventToClient testData.sourceAddress,projectSrcDir
								finish()
								
				else
					#read and return file

					path = pathModule.join fileServerRoot,url.pathname

					pathModule.exists path,(exists) ->
						if exists
							#console.log path
							stat = fs.statSync(path)

							response.writeHead(200, {
									'Content-Type': getContentType(path),
									'Content-Length': stat.size
									})

							readStream = fs.createReadStream(path)
							util.pump(readStream, response)
						else
							response.writeHead 404
							response.end()


		server.listen hostServerPort
		console.error "server started"
			
		serverClientComm.startClient forwardX11,address,serverTestRunnerUrl,xserver,windowManager,browser  for address in clientAddresses
