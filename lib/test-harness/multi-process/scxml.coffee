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

#require ["scxml/SCXML","scxml/json2model","scxml/json2extra-model"],(scxml,json2model,json2ExtraModel) ->
define ["scxml/SCXML","test-harness/multi-process/initialize-json-test-descriptor","scxml/event","util/utils","util/readline","lib/json2"],(scxml,initializeJsonTest,Event,utils,readline) ->

	#a little compatibility layer for fn readline for rhino

	->
		#set up communication stuff

		wl = utils.wrapLine print,this,false

		this.console =
			log : -> wl {method:"log",args:Array.prototype.slice.call(arguments)}
			debug : -> wl {method:"debug",args:Array.prototype.slice.call(arguments)}


		comm =
			setTimeout : (event,timeout) -> wl {method : "set-timeout", event : event, timeout : timeout}
			clearTimeout : (id) -> wl {method : "clear-timeout", sendid : id}
			statechartInitialized : -> wl {method:"statechart-initialized"}
			checkConfiguration : (conf) -> wl {method:"check-configuration",configuration:conf}


		readyForTest = -> print "ready to receive test"

		testJson = JSON.parse readline()

		initializeJsonTest testJson,([m,model,optimizations]) ->

			console.log "instantiating interpreter"
			interpreter = new scxml.SimpleInterpreter model,comm.setTimeout,comm.clearTimeout,optimizations

			console.log "statechart instantiated"

			interpreter.start()

			console.log "statechart initialized"

			initialConfiguration = interpreter.getConfiguration()
			
			console.log 'sending initialization event'

			comm.statechartInitialized()
			comm.checkConfiguration initialConfiguration.iter()
			
			#mainloop
			while event = readline()
				console.log "received event",event
				#perform big step, check the configuration
				interpreter.gen new Event event
				comm.checkConfiguration interpreter.getConfiguration().iter()
