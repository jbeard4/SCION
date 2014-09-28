var esprima = require('esprima');
var parser = require("sax").parser(true, { trim: true, xmlns: true, position: true });


var systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];

var currentScxml, originalScxml, result;
var scxmlAnalyzer = {
	analyze: function (scxml) {
		currentScxml = originalScxml = scxml;
		result = {
			errors: [],
			newScxml: null
		};

		parser.onerror = function (e) {
		  console.log(e);
		};

		// parser.ontext = function (t) {
		//   // got some text.  t is the string of text.
		// };
		
		parser.onopentag = function (node) {
		  if (node.name === "assign" && node.attributes.location &&
		  	//If assignee is a system variable
		  	systemVariables.indexOf(node.attributes.location.value) !== -1) {

		  	console.log('You can\'t change system variables. ' + node.attributes.location.value);

		  	var newError = {
		  		message: 'You can\'t change system variables. At ' +
		  		currentScxml.substring(parser.startTagPosition - 1, parser.position),
		  		start: parser.startTagPosition - 1,
		  		end: parser.position,
		  		line: parser.line,
		  		col: parser.column,
		  		newScxml: '<raise event="error.execution"></raise>'
		  		//data="You can\'t change system variables. At ' +
		  		//currentScxml.substring(parser.startTagPosition - 1, parser.position)+ '">'
		  	};

		  	result.errors.push(newError);
		  };
		};
		
		// parser.onattribute = function (attr) {
		//   // an attribute.  attr has "name" and "value"
		// };
		parser.onend = function () {
		  // parser stream is done, and ready to have more stuff written to it.
		  result = replaceErrors(result);
		};

		parser.write(currentScxml).close();

	  	result.newScxml = currentScxml;
		return result;
	}
};

module.exports = scxmlAnalyzer;

function replaceErrors (result) {
	var errors = result.errors;
	for (var i = errors.length - 1; i >= 0; i--) {
		console.log(errors[i].start);
	};

	return result;
		// currentScxml = currentScxml.substring(0, error.start) + error.newScxml + currentScxml.substring(error.end, currentScxml.length);
}