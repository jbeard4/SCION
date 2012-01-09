# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/setup-default-opts","scxml/json2model","scxml/test/harness","scxml/test/report2string","scxml/async-for","tests/loaders/spartan-loader-for-all-tests","logger","env!env/quit","scxml/test/simple-env"],(setupDefaultOpts,json2model,harness,report2string,asyncForEach,testTuples,logger,quit,SimpleEnv)->

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
			
			quit report.testCount == report.testsPassed

		logger.info "starting harness"

		if typeof setTimeout isnt "function"
			#we are not in an environment that abstracts out the mainloop
			env = new SimpleEnv()
			harness jsonTests,env.setTimeout,env.clearTimeout,finish
			env.mainLoop()	#give control to the environment
		else
			harness jsonTests,this.setTimeout,this.clearTimeout,finish

