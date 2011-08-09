#require ["scxml/SCXML","scxml/json2model","scxml/json2extra-model"],(scxml,json2model,json2ExtraModel) ->
require ["scxml/SCXML","scxml/test/multi-process-browser/initialize-json-test-descriptor","scxml/event","util/utils"],(scxml,initializeJsonTest,Event,utils) ->
	#set up communication stuff

	wl = utils.wrapLine print,this,false

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

		console.log "instantiating interpreter"
		interpreter = new scxml.SimpleInterpreter model,comm.setTimeout,comm.clearTimeout,optimizations

		console.log "statechart instantiated"

		interpreter.start()

		console.log "statechart initialized"

		initialConfiguration = interpreter.getConfiguration()
		
		console.log 'sending initialization event'

		comm.statechartInitialized()
		comm.checkConfiguration initialConfiguration.iter()
		
		#mainloop
		while event = readline()
			console.log "received event",event
			#perform big step, check the configuration
			interpreter.gen new Event event
			comm.checkConfiguration interpreter.getConfiguration().iter()
