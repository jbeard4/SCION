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

define ["scxml/json2model","optimization/class","optimization/state-table","optimization/switch","logger","env!env/file"],(json2model,classOpt,tableOpt,switchOpt,logger,file) ->

	(pathToSCXMLJson,optimizerName="table",beautify,asyncModuleDef) ->
		beautify = beautify is "true"
		asyncModuleDef = asyncModuleDef is "true"

		jsonDoc  = JSON.parse(file.readFile(pathToSCXMLJson))
		model = json2model jsonDoc
		optimizer = switch optimizerName
			when "table" then tableOpt
			when "class" then classOpt
			when "switch" then switchOpt

		logger.info optimizer model,beautify,asyncModuleDef
