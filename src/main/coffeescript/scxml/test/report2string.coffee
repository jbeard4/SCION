define ->
	(report) ->
		"""Summary:
		Tests Run: #{report.testCount}
		Tests Passed: #{report.testsPassed.length} - [ #{report.testsPassed} ]
		Tests Failed: #{report.testsFailed.length} - [ #{report.testsFailed} ]
		Tests Errored: #{report.testsErrored.length} - [ #{report.testsErrored} ]"""
