# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/json2model","scxml/optimization/class","scxml/optimization/state-table","scxml/optimization/switch","logger","env!env/file"],(json2model,classOpt,tableOpt,switchOpt,logger,file) ->

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
