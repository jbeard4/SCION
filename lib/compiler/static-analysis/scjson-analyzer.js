'use strict';

var esprima = require('esprima');
var _ = require('underscore');
var fileUtils = require('./file-utils');

var scJsonAnalyzer = {
	analyze: function(scJson, docUrl, context, callback) {
		var changes = [];

		var actionTags = {
			'data': function (node, cb) {
				validateJavascriptAssignment(node.id, node.expr, cb);
			},
			'assign': function (node, cb) {
				if(node.location && node.expr) {
					validateJavascriptAssignment(node.location, node.expr, cb);
				}
			},
			'transitions': function (node, cb) {
				if(node.cond) {
					validateJavascriptCondition(node.cond, function (error, override) {
						if(typeof override !== 'undefined' && override !== null) {
							var newNode = _.clone(node);
							newNode.cond = override;

							handleError(node, error, newNode);

						} else {
							cb(error);
						}
					});	
				}
			},
			'if': function (node, cb) {
				validateJavascriptCondition(node.cond, cb);
			},
			'ifelse': function (node, cb) {
				validateJavascriptCondition(node.cond, cb);
			}
		};

		function traverseNodes(node, parentId) {
			Object.keys(node).forEach(function(i){
		    	var currentNode = node[i];

		    	if (currentNode === null)
		    		return;
		    	
		        if (typeof(currentNode) === 'object') {
		        	var nodeType = currentNode.type || parentId;

		        	if(nodeType) {
		        		processNodes(nodeType, currentNode);
		        	}

		        	//Go deeper into the child nodes
		            traverseNodes(currentNode, i);
		        }
		    });
		}

		function processNodes(nodeType, node) {
		    if(actionTags[nodeType]) {
				actionTags[nodeType](node, function done (error) {
					if(error) {
						handleError(node, error);
					}
				});
			}
		}

		function validateJavascriptAssignment(leftHand, rightHand, cb) {
			leftHand = extractJavascript(leftHand);
			rightHand = extractJavascript(rightHand);

			var leftHandCheck = checkJavascript(leftHand);
			var rightHandCheck = checkJavascript(rightHand);

			if(leftHandCheck.error) {
				cb(leftHandCheck.error);
			} else if(rightHandCheck.error) {
				cb(rightHandCheck.error);
			} else {
				cb();
			}
		}

		function validateJavascriptCondition(condition, cb) {
			condition = extractJavascript(condition);

			var result = checkJavascript(condition);

			if(result.error) {
				//Assume illegal booleans as false, send override
				//https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/w3c-ecma/test309.txml.scxml

				cb(result.error, false);
			} else if(result.syntax.body[0].type !== 'BinaryExpression') {
				cb('Not a condition', false);
			} else {
				cb();
			}
		}

		function checkJavascript (js) {
			try {
				var syntaxResult = esprima.parse(js, {});

				return { syntax: syntaxResult };
			} catch (e) {
				return { error: e.description };
		    }
		}

		function handleError (node, error, override) {
			var newNode;

			if(override) {
				//Put a custom tag replacement instead of raise error.
				console.log(node);
				console.log(override);
				newNode = override;
			} else {
				newNode = {
					$line : node.$line,
					$column : node.$column,
					type: 'raise',
					event: 'error.execution',
					data: {
						message: error
					}
				};
			}

			changes.push({
				old: node,
				new: newNode
			});

			// console.log(mainName);
			// console.log(JSON.stringify(oldNode));
			// console.log(JSON.stringify(node));
		}

		function extractJavascript (attribute) {
			//Just a workaround for esprima parsing.
			if (typeof(attribute) === 'object') {
				attribute = attribute.expr;
			}

			return attribute;
		}

		function commitChanges (scJson) {
			var scJsonString = JSON.stringify(scJson);

			changes.forEach(function (change) {
				scJsonString = scJsonString.replace(JSON.stringify(change.old), JSON.stringify(change.new));
			});

			return scJsonString;
		}


		traverseNodes(scJson);

		var newScJson = JSON.parse(commitChanges(scJson));

		callback({ scJson: newScJson, errors: [] });
	}
};

module.exports = scJsonAnalyzer;