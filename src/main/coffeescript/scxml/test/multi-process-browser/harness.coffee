define ['scxml/test/multi-process-browser/json-tests','util/set/ArraySet','child_process','promise','http','url','path','util','fs'],(jsonTests,Set,child_process,promiseModule,http,urlModule,pathModule,util,fs) ->

	->

		spawn = child_process.spawn

		Promise = promiseModule.Promise

		xdt = "xdotool"
		xdotool =
			search : (promise,s,option="class") ->
				console.log "searching window with params:",xdt,["search","--"+option,s]
				p = spawn xdt,["search","--"+option,s]
				data = ""
				p.stdout.setEncoding("utf8")
				p.stdout.on "data",(chunk) ->
					console.log "received chunk",chunk
					data += chunk
			
				p.stdout.on "end",->
					console.log "resolving promise"
					promise.resolve(data.split('\n')[0])
					
			move : (id,x,y) -> spawn xdt,["windowmove",id,x,y]
			resize : (id,width,height) -> spawn xdt,["windowsize",id,width,height]
			focus : (id) -> spawn xdt,["windowfocus",id]
			type : (id,s) ->
				@focus id	#first bring him in focus
				spawn xdt,["type",id,s]

		port = "8888"
		serverUrl = "http://localhost:#{port}/runner"

		startBrowser = (promise,browser,url=serverUrl) ->
			console.log "spawning browser process"
			p = spawn browser,[url]
			#wait a second for him to open
			setTimeout (-> xdotool.search(promise,browser)),10000

		sendEventsToBrowser = (id,events) ->
			e = events.shift()
			if e
				console.log "sending event",e.name
				xdotool.type id,e.name
				#TODO: parameterize event density
				setTimeout (-> sendEventsToBrowser(id,events)),100

		getContentType = (path) ->
			splitPath = path.split('.')
			path = splitPath[splitPath.length-1]
			switch path
				when "js"
					"text/javascript"
				else
					"text/plain"
			
		p = new Promise()
		p2 = new Promise()
		xdotool.search(p,"chromium-browser")

		p.then (id) -> if not id then startBrowser p2,"chromium-browser" else p2.resolve(id)

		p2.then (id) ->
			console.log "moving and resizing window with id",id
			#xdotool.move id,0,0
			#xdotool.resize id,500,500
			xdotool.focus id

			fileServerRoot = "/home/jacob/workspace/scion/build"	#TODO: customize this

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
					when "/test"
						response.writeHead 200,{"Content-Type":"text/json"}
						currentTest = jsonTests.pop()
						expectedConfigurations =
							[new Set currentTest.testScript.initialConfiguration].concat(
								(new Set eventTuple.nextConfiguration for eventTuple in currentTest.testScript.events))

						response.write JSON.stringify currentTest
						response.end()
					when "/statechart-initialized"
						response.writeHead 200,{"Content-Type":"text/plain"}
						response.write "Sending events to browser"
						response.end()
						sendEventsToBrowser id,(eventTuple.event for eventTuple in currentTest.testScript.events)
					when "/check-configuration"
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
								else
									response.writeHead 500,{"Content-Type":"text/plain"}
									response.write "Did not match expected configuration. Received: #{JSON.stringify(configuration)}. Expected:#{JSON.stringify(expectedConfiguration)}."
							catch e
								console.error e.message
								console.error e.type
								console.error e.stack
								response.writeHead 500

							response.end()
								
					when "/test-complete"
						"TODO: compare to expected configuration"
						response.end()
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
