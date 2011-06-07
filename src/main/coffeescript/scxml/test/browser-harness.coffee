define ["scxml/test/harness","scxml/async-for","lib/jquery","lib/json2"],(harness,asyncForEach)->

	runTests = (testList) ->

		jsonTests = []

		loadCallback = (pathToJsonTest,nextStep,errBack,failBack) ->
			console.log "loading",pathToJsonTest
			fullPathToJsonTest = "/test/" + pathToJsonTest
			jQuery.ajax(
				url: fullPathToJsonTest,
				dataType: "json"
				error:errBack
				success: (jsonTest) ->

					pathToSCXML = pathToJsonTest.split("/").slice(0,-1).concat(jsonTest.scxml).join("/")
					fullPathToSCXML = "/test/" + pathToSCXML
					console.log "loading",pathToSCXML

					jQuery.ajax(
						url: fullPathToSCXML,
						dataType: "xml"
						error:errBack
						success: (scxmlDoc) ->
							jsonTest.scxmlDoc = scxmlDoc

							jsonTests.push jsonTest
							nextStep()
					)
			)

		finishLoad = ->
			console.info "starting harness"
			harness jsonTests,window.setTimeout,window.clearTimeout,finish

		loadError = (err) ->
			console.error(err)

		finish = (report) ->
			console.info "Summary:"
			console.info "Tests Run:",report.testCount
			console.info "Tests Passed:",report.testsPassed.length,"-","[",report.testsPassed,"]"
			console.info "Tests Failed:",report.testsFailed.length,"-","[",report.testsFailed,"]"
			console.info "Tests Errored:",report.testsErrored.length,"-","[",report.testsErrored,"]"
			
			window.success = report.testCount == report.testsPassed
			window.report = report

		asyncForEach testList,loadCallback,finishLoad,loadError,(->)
