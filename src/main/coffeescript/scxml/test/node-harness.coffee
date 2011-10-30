# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

#spartanLoaderForAllTests is built by make
#we use spartanLoaderForAllTests due to lack of decent XML support in node.js, as we would at least need to convert scxml tests to json ahead of time
#or, possibly use node's process support to make a system call to a command-line xslt process (e.g. xsltproc).
define ["scxml/setup-default-opts","scxml/json2model","scxml/test/harness","scxml/test/report2string","scxml/async-for","spartanLoaderForAllTests"],(setupDefaultOpts,json2model,harness,report2string,asyncForEach,testTuples)->

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


		loadError = (err) ->
			console.error(err)

		finish = (report) ->
			console.info report2string report
			
			process.exit report.testCount == report.testsPassed

		console.info "starting harness"
		harness jsonTests,this.setTimeout,this.clearTimeout,finish
