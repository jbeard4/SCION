#TODO: break up these dependencies based on modelParserOptions
define ["scxml/doc2model","scxml/doc2json","scxml/json2model","util/xml/rhino","util/xsl/rhino","util/xml/dom/rhino","scxml/test/harness","scxml/test/report2string","scxml/test/simple-env","lib/json2"],(doc2model,doc2json,json2model,xml,xsl,dom,harness,report2string,SimpleEnv) ->

	modelParserOptions =
		dom : 0
		xsltJson : 1

	#TODO: we should accept a command-line option to allow this to be configurable. for now, we just set a global variable to allow this to be configurable
	modelParser = modelParserOptions["xsltJson"]

	importClass(Packages.java.io.File)

	runTests = (pathsToJsonTestFiles) ->

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
			console.info report2string report
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		env = new SimpleEnv()

		harness jsonTests,env.setTimeout,env.clearTimeout,finish

		env.mainLoop()	#give control to the environment
