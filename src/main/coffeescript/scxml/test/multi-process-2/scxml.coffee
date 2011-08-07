#require ["scxml/SCXML","scxml/json2model","scxml/json2extra-model"],(scxml,json2model,json2ExtraModel) ->
require ["scxml/SCXML","scxml/test/multi-process-browser/initialize-json-test-descriptor","scxml/event",,"util/utils"],(scxml,initializeJsonTest,Event,utils) ->
	#set up communication stuff

	wl = utils.wrapLine print

	this.console =
		log : -> wl {method:"log",args:Array.prototype.slice.call(arguments)}
		debug : -> wl {method:"debug",args:Array.prototype.slice.call(arguments)}


	comm =
		setTimeout : (event,timeout) -> wl {method : "set-timeout", event : event, timeout : timeout}
		clearTimeout : (id) -> wl {method : "clear-timeout", sendid : id}
		statechartInitialized : -> wl {method:"statechart-initialized"}
		checkConfiguration : (conf) -> wl {method:"check-configuration",configuration:conf}


	readyForTest = -> print "ready to receive test"

	testJson = JSON.parse readline()

	initializeJsonTest testJson,([m,model,optimizations]) ->

		interpreter = new scxml.SimpleInterpreter model,comm.setTimeout,clearTimeout,optimizations
		interpreter.start()
		initialConfiguration = interpreter.getConfiguration()

		comm.statechartInitialized()
		comm.checkConfiguration initialConfiguration.iter()
		
		#mainloop
		while event = readline()
			console.log "received chunk",chunk
			if event is "$quit" then quit(true) else interpreter.gen new Event event
