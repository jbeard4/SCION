define ["scxml/test/optimization-harness","scxml/test/report2string"],(optimizationHarness,report2string) ->

	runTests = ->

		finish = (report) ->
			console.info report2string report
			process.exit report.testCount == report.testsPassed

		optimizationHarness this.setTimeout,this.clearTimeout,finish
