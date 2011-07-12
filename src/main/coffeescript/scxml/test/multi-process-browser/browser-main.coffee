#listen to document ready first, as we might miss it later
require ["scxml/SCXML","scxml/test/multi-process-browser/initialize-json-test-descriptor","scxml/event"],(scxml,initializeJsonTest,Event) ->

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
	p = null
	buffer = ""
 
	initializeStatechart = ->
		$.getJSON "test",(testJson) ->
			initializeJsonTest testJson,([m,model,optimizations]) ->

				dfd = new jQuery.Deferred()
				p = dfd.promise()

				interpreter = new scxml.SimpleInterpreter model,setTimeout,clearTimeout,optimizations
				interpreter.start()
				initialConfiguration = interpreter.getConfiguration()
				console.log "initialConfiguration",initialConfiguration.iter()
				$.post "/statechart-initialized",(l) ->
					console.log l
					$.post "/check-configuration",JSON.stringify(initialConfiguration.iter()),(-> dfd.resolve())

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
						$.post "/check-configuration",JSON.stringify(configuration.iter())

				else
					#append char to buffer
					buffer += scEvent


	$.post "/dom-ready"
