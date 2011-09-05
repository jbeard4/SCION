# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

#this module meant to be run standalone. called like:
#ssh jbeard4@<sourceSourceAddress> DISPLAY=<DISPLAY> coffee src/main/coffeescript/scxml/test/multi-process-browser/send-events.coffee

eventDensity = process.argv[2] or '10'
eventDensity = parseInt eventDensity

spawn = require('child_process').spawn

type = (s,cb) ->
	p = spawn "xdotool",["type",s]
	p.stdout.on "end",cb

sendResetEvent = (cb)->
	p = spawn "xdotool",["key","grave"]
	p.stdout.on "end",cb

#e is event being processed. we use it as a mutex to prevent sendEventsToBrowser when an event list is already being processed
#this may occur as it uses timeouts, and data on stdin may come in during those timeouts
e = null
eventQueue = []

sendEventsToBrowser = (events) ->
	e = events.shift()
	if e
		console.error "sending event",(e.event?.name or e)

		step = -> if e is "reset" then sendResetEvent step2 else type (e.event.name + "-"),step2

		step2 = -> setTimeout (-> sendEventsToBrowser(events)),eventDensity

		if e.after then setTimeout step,e.after else step()
	else
		nextEvents = eventQueue.shift()

		console.error "sending next events",nextEvents

		if nextEvents then sendEventsToBrowser nextEvents

data = ""

process.stdin.on "data",(s) ->
	console.error "received data #{s}"

	#buffer data by line
	data += s

	console.error "buffered data is now #{data}"

	lineOrientedData = data.split('\n')
	jsonStrings = lineOrientedData[0...-1]
	data = lineOrientedData.pop()


	console.error "lineOrientedData",lineOrientedData
	console.error "updated data: #{data}"

	jsonDataArr = (JSON.parse jsonString for jsonString in jsonStrings)

	#contains reset event?
	resetEvents = (o for o in jsonDataArr when o.method is "reset")

	if resetEvents.length
		#clear the event queue, put this on top
		eventQueue = [["reset"]]
	else
		eventQueue = eventQueue.concat (o.events for o in jsonDataArr)

	console.error "eventQueue now",eventQueue
	console.error "are we processing an event?",e

	if not e
		nextEvents = eventQueue.shift()

		if nextEvents
			console.error "sending next events",nextEvents
			sendEventsToBrowser nextEvents
		
process.stdin.on "end",->
	process.exit true

process.stdin.resume()
