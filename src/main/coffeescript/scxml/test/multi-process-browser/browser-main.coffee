#listen to document ready first, as we might miss it later
require ["scxml/SCXML","scxml/test/multi-process-browser/initialize-json-test-descriptor","scxml/event"],(scxml,initializeJsonTest,Event) ->

	setTimeout = (cb,time) -> this.setTimeout cb,time
	clearTimeout = (cb,time) -> this.clearTimeout cb,time

	interpreter = null
	p = null
 
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

			if scEvent is '`'
				console.log "received '`' keypress event. resetting statechart"
				initializeStatechart()
			else
				console.log "received event",scEvent
				p.then ->
					console.log "sending event",scEvent
					
					interpreter.gen new Event scEvent
					configuration = interpreter.getConfiguration()
					console.log "configuration after event",scEvent,configuration.iter()
					$.post "/check-configuration",JSON.stringify(configuration.iter())

	$.post "/dom-ready"
