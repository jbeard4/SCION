#listen to document ready first, as we might miss it later
require ["scxml/SCXML","scxml/test/multi-process-browser/initialize-json-test-descriptor"],(scxml,initializeJsonTest) ->
	setTimeout = (cb,time) -> this.setTimeout cb,time
	clearTimeout = (cb,time) -> this.clearTimeout cb,time

	interpreter = null

	initializeStatechart = ->
		$.getJSON "test",(testJson) ->
			initializeJsonTest testJson,([m,model,optimizations]) ->
				interpreter = new scxml.SimpleInterpreter model,setTimeout,clearTimeout,optimizations
				interpreter.start()
				initialConfiguration = interpreter.getConfiguration()
				console.log "initialConfiguration",initialConfiguration
				$.post "/statechart-initialized",(l) ->
					console.log l
					$.post "/check-configuration",JSON.stringify(initialConfiguration.iter()),(l) -> console.log l

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
				console.log "sending event",scEvent

				interpreter.gen scEvent
				configuration = interpreter.getConfiguration()
				$.post "/check-configuration",JSON.stringify(configuration.iter()),(l) -> console.log l

	$.post "/dom-ready"
