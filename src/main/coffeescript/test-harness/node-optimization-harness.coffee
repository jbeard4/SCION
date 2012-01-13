# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["test-harness/optimization-harness","test-harness/report2string","logger"],(optimizationHarness,report2string,logger) ->

	runTests = ->

		finish = (report) ->
			logger.info report2string report
			process.exit report.testCount == report.testsPassed

		optimizationHarness this.setTimeout,this.clearTimeout,finish
