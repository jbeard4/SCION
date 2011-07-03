define ["scxml/test/report2string","scxml/async-for","scxml/test/multi-process/json-tests","util/set/ArraySet","child_process"],(report2string,asyncFor,jsonTests,Set,child_process) ->

	isDebug = false

	debug = () -> if isDebug then console.debug.apply(this,arguments)

	trim = (s) -> s.replace(/^\s+|\s+$/g, '')

	printError = (e) ->
		if e.stack
			#v8
			console.error e.stack
		else
			#rhino/spidermonkey
			console.error e.name
			console.error e.message
			console.error e.fileName
			console.error e.lineNumber

	->
		results =
			testCount : 0
			testsPassed : []
			testsFailed : []
			testsErrored : []

		runTest = (test,runNextTest,failback,errback) ->
			p = child_process.spawn 'node',['build/scxml/test/multi-process/browser-env.js']

			p.stdout.setEncoding "utf8"

			checkInitialState = true

			#first ready event, send in test
			p.stdout.once "data",(str) ->
				debug "received ready string from browser-env process:",str
				
				#second ready event
				p.stdout.once "data",(str) ->
					debug "received ready string from browser-env process:",str

					#read new configuration when we receive it
					p.stdout.on "data",(chunk) ->
						debug "received data from browser-env process:",chunk

						strs = trim(chunk).split("\n")
						for str in strs
							debug "processing",str
							o = JSON.parse str

							switch o.method
								when "configuration"
									configuration = new Set o.configuration

									#compare to expected configuration
									expectedConfiguration =
										if checkInitialState
											checkInitialState = false
											new Set test.testScript.initialConfiguration
										else
											expectedConfigurations.shift()

									if not (expectedConfiguration.equals configuration)
										failback test
										p.stdin.end()
										runNextTest()

									#when we receive a configuration, and expectedConfigurations is empty, then we're done with this test
									if not expectedConfigurations.length
										p.stdin.end()
										runNextTest()
								when "log"
									console.log.apply this,["from browser-env:"].concat(o.args)
								when "debug"
									debug.apply this,["from browser-env:"].concat(o.args)
								else
									console.log "Unrcognized message method"
									console.log o

					expectedConfigurations = (new Set event.nextConfiguration for event in test.testScript.events)

					#send events in at fixed rate
					for eventTuple in test.testScript.events
						debug "sending event to browser process:",eventTuple.event
						#TODO: also add support for timeouts/delays
						p.stdin.write JSON.stringify eventTuple.event

				p.stdin.write JSON.stringify test



		failBack = (test) ->
			console.info "test",nameGroup(test.name,test.group),"...failed"
			results.testsFailed.push nameGroup(test.name,test.group)
				

		errBack = (test) ->
			console.info "test",nameGroup(test.name,test.group),"...errored"
			results.testsErrored.push nameGroup(test.name,test.group)
			printError err

		finish = ->
			report2string results
			process.exit results.testCount == results.testsPassed.length


		interpreters = ["v8-js","spidermonkey-js","webcore-js"] #,"rhino"

		tests = []
		for interpreter in interpreters
			for test in jsonTests
				test.interpreter = interpreter

		asyncFor jsonTests,runTest,finish,errBack,failBack
