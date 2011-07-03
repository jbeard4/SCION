#this is a regular old node.js process
child_process = require('child_process')

process.stdin.resume()
process.stdin.setEncoding 'utf8'

statechartProcess = null

#TODO: send in event data as well
sendEvent = (e) -> statechartProcess.stdin.write(JSON.stringify({method : "gen", event : e.name})+'\n')

getConfiguration = -> statechartProcess.stdin.write(JSON.stringify({method : "getConfiguration"})+'\n')

ready = -> console.log "ready"

log = -> console.log JSON.stringify {method:"log",args:Array.prototype.slice.call(arguments)}

debug = -> console.log JSON.stringify {method:"debug",args:Array.prototype.slice.call(arguments)}

process.stdin.once 'data',(chunk) ->

	#debug "received chunk from user thread",chunk

	o = JSON.parse chunk
	#debug "parsed as object",o

	test = o
	statechartProcess = child_process.spawn "bash",['bin/run-tests-spartan-shell.sh',test.interpreter,'scxml/test/multi-process/scxml.js']

	statechartProcess.stdout.setEncoding 'utf8'

	statechartProcess.stdout.once 'data',(str) ->
		log "statechart ready: ",str

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
			log "received event",o
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

