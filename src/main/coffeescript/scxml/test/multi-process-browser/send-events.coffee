#this module meant to be run standalone. called like:
#ssh jbeard4@<sourceSourceAddress> DISPLAY=<DISPLAY> coffee src/main/coffeescript/scxml/test/multi-process-browser/send-events.coffee

eventDensity = process.argv[2] or '10'
eventDensity = parseInt eventDensity

spawn = require('child_process').spawn

type = (s,cb) ->
	p = spawn "xdotool",["type",s]
	p.stdout.on "end",cb


sendEventsToBrowser = (events) ->
	e = events.shift()
	if e
		console.error "sending event",e.event.name

		step = ->
			type (e.event.name + "-"),->
				setTimeout (-> sendEventsToBrowser(events)),eventDensity

		if e.after then setTimeout step,e.after else step()


jsonData = ""
process.stdin.on "data",(chunk) -> jsonData += chunk

process.stdin.on "end",-> sendEventsToBrowser JSON.parse jsonData

process.stdin.resume()
