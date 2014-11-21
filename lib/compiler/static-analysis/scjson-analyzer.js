"use strict";

var fileUtils = require('./file-utils');

var scJsonAnalyzer = {
	analyze: function(scJson, docUrl, context, callback) {


		callback({ scJson: scJson, errors: [] });
	}
};

module.exports = scJsonAnalyzer;