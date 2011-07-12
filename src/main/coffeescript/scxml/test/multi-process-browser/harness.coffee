define ['scxml/test/multi-process-browser/json-tests','util/set/ArraySet',"scxml/test/report2string",'child_process','promise','http','url','path','util','fs'],(jsonTests,Set,report2string,child_process,promiseModule,http,urlModule,pathModule,util,fs) ->

	clone = (o) ->
		toReturn = {}
		toReturn[k]=v for own k,v of o
		return toReturn

	(browser="firefox",eventDensity=10)->

		display = ":1"
		xnestProcessEnv = clone process.env
		xnestProcessEnv.DISPLAY = display
		console.error xnestProcessEnv
		xnestProcessOpts =
			cwd: undefined
			env: xnestProcessEnv
			customFds: [-1, -1, -1]
			setsid: false

		trim = (s) -> s.replace(/^\s+|\s+$/g, '')

		testName = (test) -> "(#{test.name}/#{test.group}[#{test.transitionSelector.selectorKey};#{test.set.setTypeKey};#{test.extraModelInfo}])"

		spawn = child_process.spawn

		Promise = promiseModule.Promise

		results =
			testCount : 0
			testsPassed : []
			testsFailed : []
			testsErrored : []

		xdt = "xdotool"
		xdotool =
			search : (promise,s,option="class") ->
				console.error "searching window with params:",xdt,["search","--"+option,s]
				p = spawn xdt,["search","--"+option,s],xnestProcessOpts
				data = ""
				p.stdout.setEncoding("utf8")
				p.stdout.on "data",(chunk) ->
					console.error "received chunk",chunk
					data += chunk
			
				p.stdout.on "end",->
					console.error "resolving promise"
					ids = if data.length then data.split('\n') else []
					promise.resolve(ids)
					
			move : (ids,x,y) -> spawn xdt,["windowmove",id,x,y],xnestProcessOpts for id in ids
			resize : (ids,width,height) -> spawn xdt,["windowsize",id,width,height],xnestProcessOpts  for id in ids
			focus : (ids) -> spawn xdt,["windowfocus",id],xnestProcessOpts  for id in ids
			type : (s,cb) ->
				typeProcess = spawn xdt,["type",s],xnestProcessOpts
				typeProcess.stdout.on "end",cb
			key : (s) -> spawn xdt,["key",s],xnestProcessOpts

		port = "8888"
		serverUrl = "http://localhost:#{port}/runner"

		startBrowser = (promise,browser,url=serverUrl) ->
			console.error "spawning browser process"
			browserProcess = spawn browser,[url],xnestProcessOpts
			#wait a second for him to open
			setTimeout (-> xdotool.search(promise,browser)),10000

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

		sendEventsToBrowser = (events) ->
			if state is "checking-configurations-and-sending-events"
				e = events.shift()
				if e
					console.error "sending event",e.name

					step = -> xdotool.type (e.name + "-"),-> setTimeout (-> sendEventsToBrowser(events)),eventDensity

					if e.after then setTimeout step,e.after else step()

		currentTest = null
		expectedConfigurations = null

		fileServerRoot = "/home/jacob/workspace/scion/build"	#TODO: customize this

		state = "before-dom-ready"

		#browserWindowIds = null

		transitionToBeforeSendingTestState = ->
			state = "before-sending-test"
			console.error "updating state to #{state}"
			xdotool.key "grave"

		startTime = null
		endTime = null

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

				when "/dom-ready"
					if state is "before-dom-ready"
						response.writeHead 200,{"Content-Type":"text/plain"}
						response.write "Success"
						response.end()

						startTime = new Date()

						transitionToBeforeSendingTestState()
					else
						response.writeHead 500
						response.end()
						console.error "received #{url.pathname} when in state #{state}"
				when "/test"
					if state is "before-sending-test"
						response.writeHead 200,{"Content-Type":"text/json"}

						if currentTest and not (currentTest in results.testsFailed)
							#we're back here, as we've passed last test
							results.testsPassed.push currentTest

						currentTest = jsonTests.pop()
						if currentTest
							console.error "starting test #{testName currentTest})"

							results.testCount++

							expectedConfigurations =
								[new Set currentTest.testScript.initialConfiguration].concat(
									(new Set eventTuple.nextConfiguration for eventTuple in currentTest.testScript.events))

							console.error "New expected configurations:",expectedConfigurations

							response.write JSON.stringify currentTest
							response.end()

							state = "before-statechart-ready"
							console.error "updating state to #{state}"
						else
							report =
								testCount : results.testCount
								testsPassed : testName result for result in results.testsPassed
								testsFailed : testName result for result in results.testsFailed
								testsErrored : testName result for result in results.testsErrored


							console.error report2string report

							endTime = new Date()

							console.error "Running time: #{(endTime - startTime)/1000} seconds"

							#kill processes, then exit
							browserProcess?.kill()
							xephyrProcss?.kill()
							process.exit results.testCount == results.testsPassed
					else
						response.writeHead 500
						response.end()
						console.error "received #{url.pathname} when in state #{state}"


				when "/statechart-initialized"
					if state is "before-statechart-ready"
						response.writeHead 200,{"Content-Type":"text/plain"}
						response.write "Sending events to browser"
						response.end()

						state = "checking-configurations-and-sending-events"
						events = (eventTuple.event for eventTuple in currentTest.testScript.events)
						sendEventsToBrowser events
						console.error "updating state to #{state}"
					else
						response.writeHead 500
						response.end()
						console.error "received #{url.pathname} when in state #{state}"

				when "/check-configuration"
					if state is "checking-configurations-and-sending-events"
						jsonData = ""
						request.on "data",(data) ->
							jsonData += data

						request.on "end",->
							console.error "finished reading json data",jsonData

							expectedConfiguration = expectedConfigurations.shift()
							console.error "Expected configuration",expectedConfiguration
							console.error "Remaining expected configurations",expectedConfigurations
							try
								configuration =  new Set JSON.parse(jsonData)
							
								if expectedConfiguration.equals configuration
									response.writeHead 200,{"Content-Type":"text/plain"}
									#TODO: decide what to send back to client
									console.error "Matched expected configuration."
									response.end()
									
									if not expectedConfigurations.length
										transitionToBeforeSendingTestState()
								else
									response.writeHead 500,{"Content-Type":"text/plain"}
									errMsg = "Did not match expected configuration. Received: #{JSON.stringify(configuration)}. Expected:#{JSON.stringify(expectedConfiguration)}."
									response.write errMsg
									response.end()

									console.error errMsg

									results.testsFailed.push currentTest

									transitionToBeforeSendingTestState()
							catch e
								console.error e.message
								console.error e.type
								console.error e.stack
								response.writeHead 500
								response.end()
								transitionToBeforeSendingTestState()
					else
						response.writeHead 500
						response.end()
						console.error "received #{url.pathname} when in state #{state}"
								
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


		server.listen(8888)
		console.error "server started"
			
		p = new Promise()
		p2 = new Promise()
		p3 = new Promise()
		xephyrProcess = null
		browserProcess = null
		xdotool.search(p,"Xephyr")
		p.then (ids) ->
			console.error "Xephyr window ids",ids
			f = ->
				spawn "metacity",[],xnestProcessOpts
				xdotool.search(p2,browser)

			if not ids.length
				xephyrProcess = spawn "Xephyr",[display,"-screen","800x600"]
				setTimeout f,1000
			else
				f()
			

		#TODO: start Xephyr as well

		p2.then (ids) -> if not ids.length then startBrowser p3,browser else p3.resolve(ids)

		#p3.then (ids) -> browserWindowIds = ids

