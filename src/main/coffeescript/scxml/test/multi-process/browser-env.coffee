#this is a regular old node.js process
child_process = require('child_process')
Promise = require("promise").Promise

process.stdin.resume()
process.stdin.setEncoding 'utf8'

statechartProcess = null

#TODO: send in event data as well
sendEvent = (e) -> statechartProcess.stdin.write(JSON.stringify({method : "gen", event : e.name})+'\n')

getConfiguration = -> statechartProcess.stdin.write(JSON.stringify({method : "getConfiguration"})+'\n')

ready = -> console.log "ready"

log = -> console.log JSON.stringify {method:"log",args:Array.prototype.slice.call(arguments)}

debug = -> console.log JSON.stringify {method:"debug",args:Array.prototype.slice.call(arguments)}

promise = new Promise()
process.stdin.once 'data',(chunk) ->
	#receive first chunk, which is test

	o = JSON.parse chunk
	#debug "parsed as object",o

	test = o
	statechartProcess = child_process.spawn "bash",['bin/run-tests-spartan-shell.sh',test.interpreter,'scxml/test/multi-process/scxml.js']

	statechartProcess.stdout.setEncoding 'utf8'
	statechartProcess.stdin.setEncoding 'utf8'

	#listen for statechart process ready signal
	statechartProcess.stdout.once 'data',(str) -> promise.resolve(test,str)

promise.then (test,str) ->

	#listen to external events
	statechartProcess.stdout.on 'data',(str) ->
		log "received data from statechart process:",str

		o = JSON.parse str
		switch o.method
			when "getConfiguration"
				configuration = o.configuration
				process.stdout.write(JSON.stringify({method:"configuration",configuration:configuration})+'\n')
			when "setTimeout"
				setTimeout( -> sendEvent o.e, o.delay )
			when "clearTimeout"
				clearTimeout o.sendid
			when "log"
				o.args = ["from statechart process:"].concat o.args
				process.stdout.write(JSON.stringify(o)+'\n')	#just pipe him to the parent who will print him
			when "debug"
				o.args = ["from statechart process:"].concat o.args
				process.stdout.write(JSON.stringify(o)+'\n')


	statechartProcess.stdin.write(JSON.stringify({ method : "init", test : test })+'\n')

	#this needs to be moved up, as he's missing event somehow...
	process.stdin.on 'data',(chunk) ->
		o = JSON.parse(chunk)
		log "received event",chunk
		sendEvent o
		getConfiguration()


	ready()


###
process.stdin.on 'end',->
	statechartProcess.end()
	#kill child process
	process.exit()
###

ready()

