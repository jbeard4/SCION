'use strict';

var esprima = require('esprima');
var _ = require('underscore');
var fileUtils = require('./file-utils');

var scJsonAnalyzer = {
	analyze: function(scJson, docUrl, context, callback) {
		var changes = [];

		function processState(state, path) {
			if(state.datamodel) processActions(state, path, 'datamodel');
			if(state.onExit) processActions(state, path, 'onExit');
			if(state.onEntry) processActions(state, path, 'onEntry');
			if(state.transitions) processActions(state, path, 'transitions');

			if(state.states) state.states.forEach(function(substate, i){ processState(substate, path + '.states[' + i + ']'); });
		}

		function processActions(actionContainer, path, name){
			if(Array.isArray(actionContainer[name])) {

				Object.keys(actionContainer[name]).forEach(function(i) {
					var action = actionContainer[name][i];

					checkAction(action, path + '.' + name + '[' + i + ']', action.type || name);
				});
			} else {
				checkAction(actionContainer[name], path + '.' + name, name);
			}
		}

		function checkAction(action, path, propertyName) {
		    if(actionTags[propertyName]) {
				actionTags[propertyName](action, function done (error, overrideNode) {
					console.log(path);

					if(overrideNode) {
						handleError(action, path, error, overrideNode);
					} else if(error) {
						handleError(action, path, error);
					}
				});
			}
		}

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
					validateJavascriptCondition(node.cond, function (error, overrideVal) {
						if(typeof overrideVal !== 'undefined' && overrideVal !== null) {
							var newNode = _.clone(node);
							newNode.cond = overrideVal;

							cb(error, newNode);
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

		function handleError (node, path, error, override) {
			var newNode;

			if(override) {
				//Put a custom tag replacement instead of raise error.
				// console.log(node);
				// console.log(override);
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
				path: path,
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
			changes.forEach(function (change) {
				//Example:
				//change.path: "scJson.states[0].states[2].onEntry[0]"
				//change.new: {"$line":20,"$column":44,"type":"raise","event":"error.execution","data":{"message":"Illegal return statement"}}
				
				var replaceCode = change.path + '=' + JSON.stringify(change.new);

				eval(replaceCode);
			});
		}

		processState(scJson, 'scJson');
		commitChanges(scJson);

		callback({ scJson: scJson, errors: [] });
	}
};

module.exports = scJsonAnalyzer;