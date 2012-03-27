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

define ["scxml/setup-default-opts","scxml/json2model","test-harness/harness","test-harness/report2string","scxml/async-for","tests/loaders/spartan-loader-for-all-tests","logger","env!env/quit","test-harness/simple-env"],(setupDefaultOpts,json2model,harness,report2string,asyncForEach,testTuples,logger,quit,SimpleEnv)->

	runTests = ->

		opts = setupDefaultOpts()

		jsonTests = for testTuple in testTuples
			model = json2model testTuple.scxmlJson


			{
				name : testTuple.name
				group : testTuple.group
				model : model
				testScript : testTuple.testScript
				optimizations : opts
			}

		finish = (report) ->
			logger.info report2string report
			
			quit report.testCount == report.testsPassed

		logger.info "starting harness"

		if typeof setTimeout isnt "function"
			#we are not in an environment that abstracts out the mainloop
			env = new SimpleEnv()
			harness jsonTests,env.setTimeout,env.clearTimeout,finish
			env.mainLoop()	#give control to the environment
		else
			harness jsonTests,this.setTimeout,this.clearTimeout,finish

