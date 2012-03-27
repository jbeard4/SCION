#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

require ["test-harness/harness","test-harness/report2string","scxml/async-for","lib/jquery","lib/json2","logger"],(harness,report2string,asyncForEach,logger)->

	setTimeout : (callback,timeout) -> window.setTimeout callback,timeout
	clearTimeout : (timeoutId) -> window.clearTimeout timeoutId

	runTests = (testList) ->

		jsonTests = []

		loadCallback = (pathToJsonTest,nextStep,errBack,failBack) ->
			logger.info "loading",pathToJsonTest
			fullPathToJsonTest = "/test/" + pathToJsonTest
			jQuery.ajax(
				url: fullPathToJsonTest,
				dataType: "json"
				error:errBack
				success: (jsonTest) ->

					pathToSCXML = pathToJsonTest.split("/").slice(0,-1).concat(jsonTest.scxml).join("/")
					fullPathToSCXML = "/test/" + pathToSCXML
					logger.info "loading",pathToSCXML

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
			logger.info "starting harness"
			harness jsonTests,setTimeout,clearTimeout,finish

		loadError = (err) ->
			logger.error(err)

		finish = (report) ->
			logger.info report2string report
			
			window.success = report.testCount == report.testsPassed
			window.report = report

		asyncForEach testList,loadCallback,finishLoad,loadError,(->)
