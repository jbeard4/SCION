setTimeout = (cb,time) -> this.setTimeout cb,time
clearTimeout = (cb,time) -> this.clearTimeout cb,time

interpreter = null
$(document).ready ->
	$(document.documentElement).keypress (e) ->
		#send it to statechart instance
		console.log "receiving UI event",e

		scEvent = String.fromCharCode e.charCode
		console.log "sending event",scEvent

		interpreter.gen scEvent
		configuration = interpreter.getConfiguration()
		$.post "/check-configuration",JSON.stringify(configuration.iter()),(l) -> console.log l

require ["scxml/SCXML","scxml/test/multi-process-browser/initialize-json-test-descriptor"],(scxml,initializeJsonTest) ->

	$.getJSON "test",(testJson) ->
		initializeJsonTest testJson,([m,model,optimizations]) ->
			interpreter = new scxml.SimpleInterpreter model,setTimeout,clearTimeout,optimizations
			interpreter.start()
			initialConfiguration = interpreter.getConfiguration()
			console.log "initialConfiguration",initialConfiguration
			$.post "/check-configuration",JSON.stringify(initialConfiguration.iter()),(l) -> console.log l
			$.post "/statechart-initialized",(l) -> console.log l
