var esprima = require('esprima');

var moduleAnalyzer = {
	analyze: function (js) {
		var analyzedJs = esprima.parse(js);

		//console.log(JSON.stringify(analyzedJs, null, 4));

		return js;
	}
};


module.exports = moduleAnalyzer;