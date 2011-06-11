#TODO: break up these dependencies based on modelParserOptions
define ["scxml/doc2model","scxml/doc2json","scxml/json2model","util/xml/rhino","util/xsl/rhino","util/xml/dom/rhino","scxml/test/harness","lib/json2"],(doc2model,doc2json,json2model,xml,xsl,dom,harness) ->

	modelParserOptions =
		dom : 0
		xsltJson : 1

	
	#TODO: we should accept a command-line option to allow this to be configurable. for now, we just set a global variable to allow this to be configurable
	modelParser = modelParserOptions["xsltJson"]

	importClass(Packages.java.io.File)

	timeouts = []
	timeoutCounter = -1
	countToTimeoutMap = {}

	setTimeout = (callback,timeout) ->

		timeoutTuple = [new Date,timeout,callback]

		timeouts.push(timeoutTuple)

		timeoutCounter = timeoutCounter + 1
		countToTimeoutMap[timeoutCounter] = timeoutTuple

		return timeoutCounter

	clearTimeout = (timeoutId) ->
		timeoutTuple = countToTimeoutMap[timeoutId]

		if timeoutTuple in timeouts
			timeouts = (timeout for timeout in timeouts when not (timeout is timeoutTuple))
			delete countToTimeoutMap[timeoutId]

	checkTimeouts = ->
		now = new Date
		triggeredTimeouts  = (timeout for timeout in timeouts when (now - timeout[0]) >= timeout[1])

		for [start,timeout,callback] in triggeredTimeouts
			callback()

		timeouts = (timeout for timeout in timeouts when timeout not in triggeredTimeouts)


	runTests = (pathsToJsonTestFiles) ->

		#TODO: refactor the outer loop to also be async. Right now, I believe this will only work for one test.
		jsonTests = for jsonTestFileName in pathsToJsonTestFiles
			jsonTest = JSON.parse readFile jsonTestFileName
			jsonTestFile = new File jsonTestFileName
			jsonTestFileDirStr = jsonTestFile.getParent()
			pathToSCXMLFile = new File jsonTestFileDirStr,jsonTest["scxml"]
			pathToSCXML = pathToSCXMLFile.getPath()
			jsonTest.model =
				if modelParser is modelParserOptions.xsltJson
					scxmlDoc =  xml.parseFromPath pathToSCXML	#parse xml doc from path
					json = doc2json scxmlDoc,xml,xsl
					json2model json
				else
					scxmlDoc = new dom.Document xml.parseFromPath pathToSCXML	#parse xml doc from path
					doc2model scxmlDoc
			jsonTest

		finish = (report) ->
			console.log "Summary:"
			console.log "Tests Run:",report.testCount
			console.log "Tests Passed:",report.testsPassed.length,"-","[",report.testsPassed,"]"
			console.log "Tests Failed:",report.testsFailed.length,"-","[",report.testsFailed,"]"
			console.log "Tests Errored:",report.testsErrored.length,"-","[",report.testsErrored,"]"
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		harness jsonTests,setTimeout,clearTimeout,finish

		#console.log "timeouts",timeouts
			
		while true
			checkTimeouts()
