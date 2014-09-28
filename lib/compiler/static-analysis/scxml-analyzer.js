var esprima = require('esprima');

var changes, systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];

var currentScxml, originalScxml;
var scxmlAnalyzer = {
	analyze: function (scxml) {
		currentScxml = originalScxml = scxml;

		return {
			errors: [],
			newScxml: currentScxml
		};
	}
};

module.exports = scxmlAnalyzer;