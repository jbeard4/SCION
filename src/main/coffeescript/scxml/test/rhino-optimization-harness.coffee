define ["scxml/test/optimization-harness","scxml/test/simple-env","scxml/test/report2string"],(optimizationHarness,SimpleEnv,report2string) ->

	runTests = ->

		finish = (report) ->
			debugger
			console.info report2string report
			
			if report.testCount == report.testsPassed
				java.lang.System.exit(0)
			else
				java.lang.System.exit(1)

		env = new SimpleEnv()

		optimizationHarness env.setTimeout,env.clearTimeout,finish,env.mainLoop
