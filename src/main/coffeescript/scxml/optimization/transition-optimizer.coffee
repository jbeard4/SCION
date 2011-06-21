define ["scxml/json2model","scxml/optimization/class","scxml/optimization/state-table","scxml/optimization/switch","lib/json2"],(json2model,classOpt,tableOpt,switchOpt) ->

	(pathToSCXMLJson,optimizerName="table",beautify,asyncModuleDef) ->
		beautify = beautify is "true"
		asyncModuleDef = asyncModuleDef is "true"

		jsonDoc  = JSON.parse(readFile(pathToSCXMLJson))
		model = json2model jsonDoc
		optimizer = switch optimizerName
			when "table" then tableOpt
			when "class" then classOpt
			when "switch" then switchOpt

		console.log optimizer model,beautify,asyncModuleDef
