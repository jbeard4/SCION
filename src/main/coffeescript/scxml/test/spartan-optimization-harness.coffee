# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

require ["scxml/test/optimization-harness","scxml/test/simple-env","scxml/test/report2string","logger"],(optimizationHarness,SimpleEnv,report2string,logger) ->

	finish = (report) ->
		logger.info report2string report

		#all spartan environments support quit()
		quit report.testCount == report.testsPassed

	env = new SimpleEnv()

	optimizationHarness env.setTimeout,env.clearTimeout,finish,env.mainLoop
