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
		
		parser.onopentag = function (node) {
		  if (node.name === "assign" && node.attributes.location &&
		  	//If assignee is a system variable
		  	systemVariables.indexOf(node.attributes.location.value) !== -1) {

		  	var newError = {
		  		message: 'You can\'t change system variables. At ' +
		  		currentScxml.substring(parser.startTagPosition - 1, parser.position),
		  		start: parser.startTagPosition - 1,
		  		end: parser.position,
		  		line: parser.line,
		  		col: parser.column,
		  		oldScxml: currentScxml.substring(parser.startTagPosition - 1, parser.position),
		  		newScxml: '<raise event="error.execution"/>'
		  		//data="You can\'t change system variables. At ' +
		  		//currentScxml.substring(parser.startTagPosition - 1, parser.position)+ '">'
		  	};
		  	
		  	result.errors.push(newError);
		  };
		};
		
		parser.onend = function () {
		  result = replaceErrors(result);
		};

		parser.write(currentScxml).close();

	  	result.newScxml = currentScxml;
		return result;
	}
};

module.exports = scxmlAnalyzer;

//Removing content from a file more than once with indexof is a tricky thing.
//I just took the shortcut and went with replace
function replaceErrors (result) {
	var errors = result.errors;
	for (var i = errors.length - 1; i >= 0; i--) {
		console.log(errors[i].message);
		currentScxml = currentScxml.replace(errors[i].oldScxml, errors[i].newScxml);
	};

	return result;
}