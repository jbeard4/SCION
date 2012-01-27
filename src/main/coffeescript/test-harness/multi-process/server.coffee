#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

define ['test-harness/multi-process/json-tests','util/BufferedStream',"test-harness/report2string",'util/utils','child_process','argsparser','fs','util'],(jsonTests,BufferedStream,report2string,utils,child_process,argsparser,fs,util) ->

	->
		optionToArray = (args,option,defaultValue) ->
			switch typeof args["-#{option}"]
				when 'undefined' then [defaultValue]
				when 'string' then [args["-#{option}"]]
				else args["-#{option}"]
	
		args = argsparser.parse Array.prototype.slice.call arguments

		eventDensity = args['-eventDensity'] or 10
		stopOnFail = args['-stopOnFail']
		projectDir = args['-projectDir'] or '/home/jacob/workspace/scion/'
		clientModulePath = args['-clientModulePath'] or '/home/jacob/workspace/scion/src/main/coffeescript/test-harness/multi-process/client.coffee'
		local = args['-local']
		numLocalProcesses = args['-numLocalProcesses'] or 1
		verbose = args['-verbose']
		logFile = args['-logFile']
		statsFile = args['-statsFile'] or 'stats.json'
		clientAddresses = optionToArray args,'clientAddresses','localhost'
		interpreters = optionToArray args,'interpreters','spidermonkey'
		numberOfIterationsPerTest = args['-numberOfIterationsPerTest'] or 1
		performanceTestMode = args['-performanceTestMode']
		numberOfEventsToSendInPerformanceTestMode = args['-numberOfEventsToSendInPerformanceTestMode'] or 10

		if args['-help']
			console.log """
				Usage:
				./bin/run-multi-process-testing-framework.sh [options]

				Available options:
				-eventDensity
				-stopOnFail
				-projectDir
				-clientModulePath
				-local
				-numLocalProcesses
				-verbose
				-logFile
				-clientAddresses
				-interpreters
				-statsFile 
				-numberOfIterationsPerTest
				-performanceTestMode
				-numberOfEventsToSendInPerformanceTestMode
			"""
			return true

		console.log "received args",args

		console.log "config:"
		console.log "eventDensity",eventDensity
		console.log "stopOnFail",stopOnFail
		console.log "projectDir",projectDir
		console.log "clientModulePath",clientModulePath
		console.log "local",local
		console.log "numLocalProcesses",numLocalProcesses
		console.log 'logFile',logFile
		console.log 'clientAddresses',clientAddresses
		console.log 'interpreters',interpreters
		console.log 'statsFile',statsFile
		console.log 'numberOfIterationsPerTest',numberOfIterationsPerTest
		console.log 'performanceTestMode',performanceTestMode
		console.log 'numberOfEventsToSendInPerformanceTestMode',numberOfEventsToSendInPerformanceTestMode

		#add interpreters
		tmp = []
		for interpreter in interpreters
			for test in jsonTests
				tmp.push utils.merge test,{interpreter : interpreter}
		jsonTests = tmp

		#open up file for logging
		if logFile and not (logFile is '-')
			log = fs.createWriteStream(logFile, {'flags': 'w'})

		results =
			testCount : 0
			testsPassed : []
			testsFailed : []
			testsErrored : []

		startTime = null
		endTime = null

		testMap = {}

		sendTest = (p) ->
			currentTest = jsonTests.pop()

			if currentTest
				#there are still tests left, so start a test
				
				console.log "starting test {#{currentTest.interpreter}}#{currentTest.id}) on process #{p.pid}"

				#put the current test in the testmap
				#the important stateful variable is the list of expected configurations
				testMap[currentTest.id] =
					test : currentTest
					sourceProcess : p

				results.testCount++

				#diagnositcs. TODO: remove this later
				s = "#{JSON.stringify currentTest}\n"
				for e in currentTest.testScript.events
					s += "#{e.event.name}\n"
				fs.writeFileSync 'jsonTest.json',s
				

				p.stdin.write "#{JSON.stringify currentTest}\n"

			else
				#there are no more tests left, so tell the client he's done
				console.log "No more tests. Ending client process #{p.pid}."

				p.removeAllListeners 'exit'
				p.stdin.end()
				clientProcesses.splice(clientProcesses.indexOf(p),1)

				#all client processes have finished, then we can end
				if not clientProcesses.length then finish()

		finish = ->
			console.log "All clients finished. Wrapping up."

			console.log "The following tests did not receive results:"
			for own k,v of testMap when not v.stats
				console.log k

			summary = (results) -> "{#{result.interpreter}}#{result.id}" for result in results

			report =
				testCount : results.testCount
				testsPassed : summary results.testsPassed
				testsFailed : summary results.testsFailed
				testsErrored : summary results.testsErrored

			console.log report2string report

			endTime = new Date()

			console.log "Running time: #{(endTime - startTime)/1000} seconds"

			#dump the stats
			r = {}
			for k,v of testMap
				r[k] = v.stats
	
			fs.writeFileSync statsFile,(JSON.stringify r)

			if log then log.end()

			process.exit results.testCount == results.testsPassed

		processMessage = (jsonResults,p) ->

			#console.log "Received results back for #{jsonResults.testId} from process #{p.pid}"

			testMap[jsonResults.testId].stats = jsonResults.stats

			if jsonResults.pass
				results.testsPassed.push testMap[jsonResults.testId].test
			else
				results.testsFailed.push testMap[jsonResults.testId].test

				#error message will be in there somewhere. TODO: maybe filter it?
				console.log jsonResults.stats

				#if stopOnFail is set, then wrap up
				if stopOnFail
					console.log "Test #{testId} failed and stopOnFail is set. Wrapping up..."
					finish()

			#send next test
			sendTest p

		hookUpEventHandling = (p) ->
			buff = new BufferedStream p.stdout
			buff.on "line",(line) ->
				jsonResults = JSON.parse line
				processMessage jsonResults,p

			#if verbose flag is set, log output of running processes
			if verbose
				p.stderr.setEncoding 'utf8'
				p.stderr.on "data",(s) ->
					l = "From process #{p.pid}: #{s}"
					if log
						log.write l
					else
						console.log l

		onPrematureExit = (p) ->
			console.error "Process #{p.pid} ended unexpectedly"
			if stopOnFail then process.exit 1
			
		CLIENT_MODULE = "test-harness/multi-process/client"

		startClient =
			if local
				-> child_process.spawn "bash",["#{projectDir}/src/test-scripts/run-module.sh",CLIENT_MODULE,"node",eventDensity,projectDir,numberOfIterationsPerTest,performanceTestMode,numberOfEventsToSendInPerformanceTestMode]
			else
				(address) -> child_process.spawn "ssh",[address,"bash","#{projectDir}/bin/run-module.sh",CLIENT_MODULE,"node",eventDensity,projectDir,numberOfIterationsPerTest,performanceTestMode,numberOfEventsToSendInPerformanceTestMode]

		clientAddresses = if local then [0...numLocalProcesses] else clientAddresses
			
		#start clients
		console.log "starting clients"
		clientProcesses = (startClient address for address in clientAddresses)

		console.log "spawned client processes",(p.pid for p in clientProcesses)

		startTime = startTime or new Date()

		console.log "start time",startTime

		#send initial tests to clients
		for p in clientProcesses
			p.on "exit",onPrematureExit
			hookUpEventHandling p
			sendTest p
		
