#TODO: break up these dependencies based on modelParserOptions
define ["scxml/doc2json","scxml/json2model","util/xml/rhino","util/xsl/rhino","scxml/test/harness","scxml/test/report2string","scxml/test/simple-env","lib/json2"],(doc2json,json2model,xml,xsl,harness,report2string,SimpleEnv) ->

	importClass(Packages.java.io.File)

	runTests = ->
		pathsToJsonTestFiles = Array.prototype.slice.call(arguments)

		jsonTests = for jsonTestFileName in pathsToJsonTestFiles
			jsonTest = JSON.parse readFile jsonTestFileName
			jsonTestFile = new File jsonTestFileName
			jsonTestFileDirStr = jsonTestFile.getParent()
			pathToSCXMLFile = new File jsonTestFileDirStr,jsonTest["scxml"]
			pathToSCXML = pathToSCXMLFile.getPath()

			scxmlDoc =  xml.parseFromPath pathToSCXML	#parse xml doc from path
			json = doc2json scxmlDoc,xml,xsl
			model = json2model json

			{
				name : jsonTest.name
				model : model
				testScript : jsonTest
				optimizations : []
			}

		finish = (report) ->
			console.info report2string report
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		env = new SimpleEnv()

		harness jsonTests,env.setTimeout,env.clearTimeout,finish

		env.mainLoop()	#give control to the environment
