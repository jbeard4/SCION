# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

require ["scxml/test/harness","scxml/test/report2string","scxml/async-for","lib/jquery","lib/json2"],(harness,report2string,asyncForEach)->

	setTimeout : (callback,timeout) -> window.setTimeout callback,timeout
	clearTimeout : (timeoutId) -> window.clearTimeout timeoutId

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
			harness jsonTests,setTimeout,clearTimeout,finish

		loadError = (err) ->
			console.error(err)

		finish = (report) ->
			console.info report2string report
			
			window.success = report.testCount == report.testsPassed
			window.report = report

		asyncForEach testList,loadCallback,finishLoad,loadError,(->)
