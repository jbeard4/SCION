#spartanLoaderForAllTests is built by make
require ["scxml/json2model","scxml/test/harness","scxml/test/report2string","scxml/test/simple-env","spartanLoaderForAllTests"],(json2model,harness,report2string,SimpleEnv,testTuples) ->

	this.console =
		log : this.print
		info : this.print
		error : this.print
		debug : this.print

	jsonTests = for testTuple in testTuples
		model = json2model(testTuple.scxmlJson)

		{
			name : testTuple.name
			group : testTuple.group
			model : model
			testScript : testTuple.testScript
		}

	finish = (report) ->
		console.info report2string report
		
		#all spartan environments support quit()
		quit report.testCount == report.testsPassed

	env = new SimpleEnv()

	harness jsonTests,env.setTimeout,env.clearTimeout,finish

	env.mainLoop()
