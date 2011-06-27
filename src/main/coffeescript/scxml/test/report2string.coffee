define ->
	truncate = (list) -> if list.length > 100 then list[0...50] + "..." else list

	(report) ->
		"""Summary:
		Tests Run: #{report.testCount}
		Tests Passed: #{report.testsPassed.length} - [ #{truncate report.testsPassed} ]
		Tests Failed: #{report.testsFailed.length} - [ #{truncate report.testsFailed} ]
		Tests Errored: #{report.testsErrored.length} - [ #{truncate report.testsErrored} ]"""
