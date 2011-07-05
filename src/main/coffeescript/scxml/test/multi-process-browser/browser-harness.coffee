define ["scxml/test/multi-process-browser/initialize-json-test-descriptor","scxml/test/harness","scxml/test/report2string"],(initializeJsonTest,harness,report2string) ->

	setTimeout = (cb,time) -> this.setTimeout cb,time
	clearTimeout = (cb,time) -> this.clearTimeout cb,time

	finish = (report) ->
		console.info report2string report
		
		#TODO: do next test after this finishes
		$.post("/test-complete",report.testCount == report.testsPassed)

	(testJson) ->

		initializeJsonTest(testJson,([m,model,optimizations]) ->

			testJson.model = model
			testJson.optimizations = optimizations


			console.info "starting harness"
			harness [testJson],setTimeout,clearTimeout,finish
		)
