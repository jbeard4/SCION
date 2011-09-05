# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/doc2json","scxml/json2model","util/xml/rhino","util/xsl/rhino","scxml/test/harness","scxml/test/report2string","scxml/test/simple-env","lib/json2"],(doc2json,json2model,xml,xsl,harness,report2string,SimpleEnv) ->

	importClass(Packages.java.io.File)

	basename = (name) -> name.split(".").slice(0,-1).join(".")

	runTests = ->
		pathsToJsonTestFiles = Array.prototype.slice.call(arguments)

		jsonTests = for jsonTestFileName in pathsToJsonTestFiles
			jsonTest = JSON.parse readFile jsonTestFileName
			jsonTestFile = new File jsonTestFileName
			jsonTestFileDirStr = jsonTestFile.getParent()
			groupName = jsonTestFile.parentFile.name
			jsonBasename = basename(String(jsonTestFile.name))
			pathToSCXMLFile = new File jsonTestFileDirStr,(jsonBasename + ".scxml")
			pathToSCXML = pathToSCXMLFile.getPath()

			scxmlDoc =  xml.parseFromPath pathToSCXML	#parse xml doc from path
			json = doc2json scxmlDoc,xml,xsl
			model = json2model json

			{
				name : jsonBasename
				group : groupName
				model : model
				testScript : jsonTest
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
