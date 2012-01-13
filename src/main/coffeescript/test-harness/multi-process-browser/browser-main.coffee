# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

#listen to document ready first, as we might miss it later
require ["scxml/SCXML","test-harness/multi-process-browser/initialize-json-test-descriptor","scxml/event"],(scxml,initializeJsonTest,Event) ->

	#fake console api if necessary
	window.console ?=
		log : ->
		debug : ->
		error : ->
		info : ->
		warn : ->

	setTimeout = (cb,time) -> window.setTimeout cb,time
	clearTimeout = (cb,time) -> window.clearTimeout cb,time

	interpreter = null
	currentTestId = null
	p = null
	buffer = ""

	currentRequest = null
	queuedRequests = null
 
	initializeStatechart = ->

		currentRequest = null
		queuedRequests = []

		$.ajax
			url : 'test'
			dataType : 'json'
			cache : false
			success : (testJson) ->
				if testJson.done	#server says we're out of tests
					$(document.documentElement).unbind()	#unbind event listeners
				else
					currentTestId = testJson.id

					initializeJsonTest testJson,([m,model,optimizations]) ->

						dfd = new jQuery.Deferred()
						p = dfd.promise()

						interpreter = new scxml.SimpleInterpreter model,setTimeout,clearTimeout,optimizations
						interpreter.start()
						initialConfiguration = interpreter.getConfiguration()
						console.log "initialConfiguration",initialConfiguration.iter()

						data = JSON.stringify {id : currentTestId}

						$.post "/statechart-initialized",data,(l) ->
							console.log l

							data = JSON.stringify
								id : currentTestId
								configuration : initialConfiguration.iter()

							$.post "/check-configuration",data,(-> dfd.resolve())

	$(document.documentElement).keypress (e) ->
		#send it to statechart instance
		console.log "receiving UI event",e

		if e.charCode
			scEvent = String.fromCharCode e.charCode

			document.body.textContent += scEvent	#easy to debug

			console.log "received event",scEvent

			switch scEvent
				when '`'
					#clear the buffer (just in case), init new statechart
					buffer = ""
					console.log "received '`' keypress event. resetting statechart"
					initializeStatechart()
				when '-'
					#clear the buffer, send the event
					b = buffer
					buffer = ""

					p.then ->
						console.log "sending event",b
						
						interpreter.gen new Event b
						configuration = interpreter.getConfiguration()
						console.log "configuration after event",scEvent,configuration.iter()
						data = JSON.stringify
							id : currentTestId
							configuration : configuration.iter()

						r = ->
							$.post "/check-configuration",data,->
								currentRequest = queuedRequests.shift()
								if currentRequest then currentRequest()

						if not currentRequest
							currentRequest = r
							currentRequest()
						else
							queuedRequests.push r
							

				else
					#append char to buffer
					buffer += scEvent

	initializeStatechart()
