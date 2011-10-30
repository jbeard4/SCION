define ["scxml/event","scxml/SCXML","scxml/json2model","test/basic/basic1"],(Event,scxml,json2model,basicTest,defaultTransitionSelector,ArraySet,m) ->
	->

		NodeInterpreter = scxml.NodeInterpreter

		model = json2model basicTest.scxmlJson	#initialize model from json
		interpreter = new NodeInterpreter model	#instantiate SC

		interpreter.start()
		initialConfiguration = interpreter.getConfiguration()

		console.log initialConfiguration

		interpreter.gen(new Event("t"))
		nextConfiguration = interpreter.getConfiguration()
		console.log nextConfiguration

