# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

#spartanLoaderForAllTests is built by make
define ["scxml/json2model","scxml/setup-default-opts","scxml/test/harness","scxml/test/report2string","scxml/test/simple-env","tests/loaders/spartan-loader-for-all-tests","logger"],(json2model,setupDefaultOpts,harness,report2string,SimpleEnv,testTuples,logger) ->

	runTests = ->

		opts = setupDefaultOpts()

		jsonTests = for testTuple in testTuples
			model = json2model(testTuple.scxmlJson)

			{
				name : testTuple.name
				group : testTuple.group
				model : model
				testScript : testTuple.testScript
				optimizations : opts
			}

		finish = (report) ->
			logger.info report2string report
			
			#all spartan environments support quit()
			quit report.testCount == report.testsPassed

		env = new SimpleEnv()

		harness jsonTests,env.setTimeout,env.clearTimeout,finish

		env.mainLoop()
