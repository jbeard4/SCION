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

require ["test-harness/optimization-harness","test-harness/simple-env","test-harness/report2string","logger"],(optimizationHarness,SimpleEnv,report2string,logger) ->

	finish = (report) ->
		logger.info report2string report

		#all spartan environments support quit()
		quit report.testCount == report.testsPassed

	env = new SimpleEnv()

	optimizationHarness env.setTimeout,env.clearTimeout,finish,env.mainLoop
