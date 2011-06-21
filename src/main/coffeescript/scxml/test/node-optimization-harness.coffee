#spartanLoaderForAllTests is built by make
#we use spartanLoaderForAllTests due to lack of decent XML support in node.js, as we would at least need to convert scxml tests to json ahead of time
#or, possibly use node's process support to make a system call to a command-line xslt process (e.g. xsltproc).
define ["scxml/json2model", "scxml/test/harness", "scxml/test/report2string", "scxml/async-for", "spartanLoaderForAllTests", "class-transition-lookup-optimization-loader", "switch-transition-lookup-optimization-loader", "table-transition-lookup-optimization-loader"],(json2model,harness,report2string,asyncForEach,testTuples,classTransitionOpts,switchTransitionOpts,tableTransitionOpts) ->

	runTests = ->

		#set up optimizations
		#TODO: when we have other optimizations, this is where their initialization will also go
		jsonTests = []
		for i in [0...testTuples.length]
			testTuple = testTuples[i]
			scxmlJson = testTuple.scxmlJson

			#parse scxmlJson model
			model = json2model scxmlJson

			#initialize opts			
			classTransOpt = classTransitionOpts[i] model.transitions,model.events
			switchTransOpt = switchTransitionOpts[i] model.transitions,model.events
			tableTransOpt = tableTransitionOpts[i] model.transitions,model.events

			optArgs =	{
						" " : []
						"class-transition-lookup" : [classTransOpt,true]
						"switch-transition-lookup" : [switchTransOpt,false]
						"table-transition-lookup" : [tableTransOpt,false]
					}

			#set up our test object
			for own optName,optArg of optArgs
				jsonTests.push
					name : "#{testTuple.testScript.name} (#{optName})"
					model : model
					testScript : testTuple.testScript
					optimizations : optArg
		

		loadError = (err) ->
			console.error(err)

		finish = (report) ->
			console.info report2string report
			process.exit report.testCount == report.testsPassed

		console.info "starting harness"
		harness jsonTests,this.setTimeout,this.clearTimeout,finish
