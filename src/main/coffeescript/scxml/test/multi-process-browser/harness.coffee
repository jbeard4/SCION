define ['scxml/test/multi-process-browser/json-tests','util/set/ArraySet',"scxml/test/report2string",'child_process','promise','http','url','path','util','fs'],(jsonTests,Set,report2string,child_process,promiseModule,http,urlModule,pathModule,util,fs) ->

	clone = (o) ->
		toReturn = {}
		toReturn[k]=v for own k,v of o
		return toReturn

	->
		browser = "firefox"

		display = ":1"
		xnestProcessEnv = clone process.env
		xnestProcessEnv.DISPLAY = display
		console.log xnestProcessEnv
		xnestProcessOpts =
			cwd: undefined
			env: xnestProcessEnv
			customFds: [-1, -1, -1]
			setsid: false

		trim = (s) -> s.replace(/^\s+|\s+$/g, '')

		testName = (test) -> "#{test.name} (#{test.group})"

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
				console.log "searching window with params:",xdt,["search","--"+option,s]
				p = spawn xdt,["search","--"+option,s],xnestProcessOpts
				data = ""
				p.stdout.setEncoding("utf8")
				p.stdout.on "data",(chunk) ->
					console.log "received chunk",chunk
					data += chunk
			
				p.stdout.on "end",->
					console.log "resolving promise"
					ids = if data.length then data.split('\n') else []
					promise.resolve(ids)
					
			move : (ids,x,y) -> spawn xdt,["windowmove",id,x,y],xnestProcessOpts for id in ids
			resize : (ids,width,height) -> spawn xdt,["windowsize",id,width,height],xnestProcessOpts  for id in ids
			focus : (ids) -> spawn xdt,["windowfocus",id],xnestProcessOpts  for id in ids
			type : (s) -> spawn xdt,["type",s],xnestProcessOpts
			key : (s) -> spawn xdt,["key",s],xnestProcessOpts

		port = "8888"
		serverUrl = "http://localhost:#{port}/runner"

		startBrowser = (promise,browser,url=serverUrl) ->
			console.log "spawning browser process"
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
			
		p = new Promise()
		p2 = new Promise()
		p3 = new Promise()
		xephyrProcess = null
		browserProcess = null
		xdotool.search(p,"Xephyr")
		p.then (ids) ->
			console.log "Xephyr window ids",ids
			f = ->
				spawn "metacity",[],xnestProcessOpts
				xdotool.search(p2,"firefox")

			if not ids.length
				xephyrProcess = spawn "Xephyr",[display,"-screen","800x600"]
				setTimeout f,1000
			else
				f()
			

		#TODO: start Xephyr as well

		p2.then (ids) -> if not ids.length then startBrowser p3,"firefox" else p3.resolve(ids)

		p3.then (ids) ->
			console.log "moving and resizing window with id",ids
			#xdotool.move ids,0,0
			#xdotool.resize ids,500,500
			#xdotool.focus ids
			xdotool.key "ctrl+r"

			fileServerRoot = "/home/jacob/workspace/scion/build"	#TODO: customize this

			state = "before-dom-ready"

			sendEventsToBrowser = (events) ->
				if state is "checking-configurations-and-sending-events"
					e = events.shift()
					if e
						console.log "sending event",e.name
						xdotool.focus ids
						xdotool.key e.name
						#TODO: parameterize event density
						setTimeout (-> sendEventsToBrowser(events)),100
					else
						transitionToBeforeSendingTestState()

			transitionToBeforeSendingTestState = ->
				state = "before-sending-test"
				console.log "updating state to #{state}"
				#xdotool.focus ids
				xdotool.key "grave"

			currentTest = null
			expectedConfigurations = null

			console.log "starting server"
			server = http.createServer (request,response) ->
				url = urlModule.parse request.url

				console.log "received request for #{url.pathname}"

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
							
							#trying to send some UI events
							#setTimeout (-> xdotool.key "`"),2000
							#xdotool.type "hello world"
							#xdotool.key "grave"
							transitionToBeforeSendingTestState()
						else
							response.writeHead 500
							#response.write "received #{url.pathname} when in state #{state}"
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
								console.log "starting test #{currentTest.name} (#{currentTest.group})"
								results.testCount++

								expectedConfigurations =
									[new Set currentTest.testScript.initialConfiguration].concat(
										(new Set eventTuple.nextConfiguration for eventTuple in currentTest.testScript.events))

								response.write JSON.stringify currentTest
								response.end()

								state = "before-statechart-ready"
								console.log "updating state to #{state}"
							else
								report =
									testsPassed : testName result for result in results.testsPassed
									testsFailed : testName result for result in results.testsFailed
									testsErrored : testName result for result in results.testsErrored


								console.info report2string report
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
							sendEventsToBrowser (eventTuple.event for eventTuple in currentTest.testScript.events)
							console.log "updating state to #{state}"
						else
							response.writeHead 500
							response.end()
							console.error "received #{url.pathname} when in state #{state}"

					when "/check-configuration"
						if state is "checking-configurations-and-sending-events"
							expectedConfiguration = expectedConfigurations.shift()

							jsonData = ""
							request.on "data",(data) ->
								jsonData += data

							request.on "end",->
								console.log "finished reading json data",jsonData
								try
									configuration =  new Set JSON.parse(jsonData)
								
									if expectedConfiguration.equals configuration
										response.writeHead 200,{"Content-Type":"text/plain"}
										#TODO: decide what to send back to client
										response.write "Matched expected configuration."
										response.end()
									else
										response.writeHead 500,{"Content-Type":"text/plain"}
										response.write "Did not match expected configuration. Received: #{JSON.stringify(configuration)}. Expected:#{JSON.stringify(expectedConfiguration)}."
										response.end()

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
								console.log path
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
			console.log "server started"
