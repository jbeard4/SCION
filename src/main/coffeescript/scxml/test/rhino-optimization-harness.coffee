# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/test/optimization-harness","scxml/test/simple-env","scxml/test/report2string","logger"],(optimizationHarness,SimpleEnv,report2string,logger) ->

	runTests = ->

		finish = (report) ->
			logger.info report2string report
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		env = new SimpleEnv()

		optimizationHarness env.setTimeout,env.clearTimeout,finish,env.mainLoop
