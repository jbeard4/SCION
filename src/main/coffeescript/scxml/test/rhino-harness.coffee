# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/test/simple-env","scxml/setup-default-opts","scxml/json2model","scxml/test/harness","scxml/test/report2string","scxml/async-for","tests/loaders/spartan-loader-for-all-tests","logger"],(SimpleEnv,setupDefaultOpts,json2model,harness,report2string,asyncForEach,testTuples,logger)->

	runTests = ->

		opts = setupDefaultOpts()

		jsonTests = for testTuple in testTuples
			model = json2model testTuple.scxmlJson

			{
				name : testTuple.name
				group : testTuple.group
				model : model
				testScript : testTuple.testScript
				optimizations : opts
			}

		finish = (report) ->
			logger.info report2string report
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		env = new SimpleEnv()

		harness jsonTests,env.setTimeout,env.clearTimeout,finish

		env.mainLoop()	#give control to the environment
