#this module exposes the main scion modules to node
requirejs = require 'requirejs'

#Pass the top-level main.js/index.js require
#function to requirejs so that node modules
#are loaded relative to the top-level JS file.
requirejs.config
	nodeRequire: require,
	baseUrl : __dirname + "/.."

requirejs ['scxml/SCXML', 'scxml/event', 'scxml/json2model','util/annotate-scxml-json'], ({NodeInterpreter : NodeInterpreter }, Event, json2model, annotator) ->
	exports.NodeInterpreter = NodeInterpreter
	exports.Event = Event
	exports.json2model = json2model
	exports.annotateScxmlJson = annotator
