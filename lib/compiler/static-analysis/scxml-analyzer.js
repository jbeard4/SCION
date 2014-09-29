var esprima = require('esprima');
var parser = require("sax").parser(true, { trim: true, xmlns: true, position: true });


var systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];

var currentScxml, originalScxml, result, lastOpenScriptTagPosition;
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
			if(node.name && openNodeTypes[node.name]) {
				openNodeTypes[node.name](node);
			}
		};

		parser.onclosetag = function (node) {
			if(node && closedNodeTypes[node]) {
				closedNodeTypes[node]();
			}
		};
		
		parser.onend = function () {
		  result = replaceErrors(result);
		};

		parser.write(currentScxml).close();

	  	result.newScxml = currentScxml;
		return result;
	}
};

var openNodeTypes = {
	"assign" : function (node) {
		if (node.attributes.location && systemVariables.indexOf(node.attributes.location.value) !== -1) {
			//If assignee is a system variable
			createError('You can\'t change system variables.', '<raise event="error.execution"/>');
		};
	},
	"script" : function (node) {
		//Catch opening of script tag.
		lastOpenScriptTagPosition = parser.startTagPosition - 1;
	}
};

var closedNodeTypes = {
	"script" : function () {
		
		//Strip from <script></script> tags
		var strippedJS = currentScxml.substring(lastOpenScriptTagPosition + 8, parser.position - 9);

		var jsValidationResults = validateJavascriptExpression(strippedJS);


		//Reset to prevent future problems
		lastOpenScriptTagPosition = null;
	}
};

function createError (shortMessage, newScxml) {
	var newError = {
		message: shortMessage + ' At: ' + currentScxml.substring(parser.startTagPosition - 1, parser.position),
		start: parser.startTagPosition - 1,
		end: parser.position,
		line: parser.line,
		col: parser.column,
		oldScxml: currentScxml.substring(parser.startTagPosition - 1, parser.position),
		newScxml: newScxml
		//TODO add reason to data.message of raise.
		//data="You can\'t change system variables. At ' +
		//currentScxml.substring(parser.startTagPosition - 1, parser.position)+ '">'
	};

	result.errors.push(newError);
}

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

function validateJavascriptExpression (js) {
	console.log(js);


	return "";
}

module.exports = scxmlAnalyzer;