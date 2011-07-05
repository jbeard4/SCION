spawn = require('child_process').spawn
promiseModule = require('promise')
http = require("http")
urlModule = require('url')
pathModule = require('path')
util = require('util')
fs = require('fs')

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
	event : (id,e) -> spawn xdt,["type",id,e]

port = "8888"
serverUrl = "http://localhost:#{port}/runner"

startBrowser = (promise,browser,url=serverUrl) ->
	console.log "spawning browser process"
	p = spawn browser,[url]
	#wait a second for him to open
	setTimeout (-> xdotool.search(promise,browser)),10000
	
p = new Promise()
startBrowser p,"chromium-browser"

p.then (id) ->
	console.log "moving and resizing window with id",id
	xdotool.move id,0,0
	xdotool.resize id,500,500
	xdotool.focus id

fileServerRoot = "/home/jacob/workspace/scion/build"	#TODO: customize this

server = http.createServer (request,response) ->
	url = urlModule.parse request.url

	switch url.pathname
		when "/runner"
			response.writeHead 200,{"Content-Type":"text/html"}
			response.write """
			<html>
				<head>
					<script src="http://code.jquery.com/jquery-1.6.2.min.js"></script>
					<script>
						$.getJSON("test",function(o){
							console.log(o)
						});
					</script>
				</head>
				<body></body>
			</html>
			"""
			response.end()
		when "/test"
			response.writeHead 200,{"Content-Type":"text/json"}
			response.write JSON.stringify {"hello":"world"}
			response.end()
		when "/configuration-changed"
			"TODO: compare to expected configuration"
			response.end()
		else
			#read and return file

			path = pathModule.join fileServerRoot,url.pathname

			pathModule.exists path,(exists) ->
				if exists
					console.log "here"
					console.log path
					stat = fs.statSync(path)

					response.writeHead(200, {
							'Content-Type': 'text/plain',
							'Content-Length': stat.size
							})

					readStream = fs.createReadStream(path)
					util.pump(readStream, response)
				else
					response.writeHead 404
					response.end()


server.listen(8888)
