'use strict';

var esprima = require('esprima');
var _ = require('underscore');
var fileUtils = require('./file-utils');

var scJsonAnalyzer = {
	analyze: function(scJson, docUrl, context, callback) {
		var changes = [],
			asyncCount = 0,
			waitingForAsync = false;

		function processState(state, path) {
			if(state.datamodel) processActions(state, path, 'datamodel');
			if(state.onExit) processActions(state, path, 'onExit');
			if(state.onEntry) processActions(state, path, 'onEntry');
			if(state.transitions) {
				processActions(state, path, 'transitions');

				state.transitions.forEach(function(transition, i){
					if(transition.onTransition) {
						processActions(transition, path + '.transitions[' + i + ']', 'onTransition'); 	
					}
				});
			}

			if(state.rootScripts) {
				processActions(state, path, 'rootScripts');
				// state.rootScripts.forEach(function(script, i){
				// 	processActions(script, path + '.rootScripts[' + i + ']', 'script');
				// });
			}

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
					if(overrideNode) {
						handleError(action, path, error, overrideNode);
					} else if(error) {
						handleError(action, path, error);
					}
				});
			}
		}

		var actionTags = {
			'data': function (node, done) {
				validateJavascriptAssignment(node.id, node.expr, done);
			},
			'assign': function (node, done) {
				if(node.location && node.expr) {
					validateJavascriptAssignment(node.location, node.expr, done);
				}
			},
			'transitions': function (node, done) {
				if(node.cond) {
					validateJavascriptCondition(node.cond, function (error, overrideVal) {
						if(typeof overrideVal !== 'undefined' && overrideVal !== null) {
							var newNode = _.clone(node);
							newNode.cond = overrideVal;

							done(error, newNode);
						} else {
							done(error);
						}
					});	
				}
			},
			'if': function (node, done) {
				validateJavascriptCondition(node.cond, done);
			},
			'ifelse': function (node, done) {
				validateJavascriptCondition(node.cond, done);
			},
			'script': function (node, done) {
				if(node.src) {
		    		
		    		//We are telling the code that we started an async process
					asyncStarted();

					getFileContents(node.src, function (error, content) {
						//Remove file path
						delete node.src;
						
						//Set file contents as script tag content
						node.content = content;

						done(error, node);

						//We are done with this async, carry on.
						asyncDone();
					});
				}
			}
		};

		function validateJavascriptAssignment(leftHand, rightHand, done) {
			leftHand = extractJavascript(leftHand);
			rightHand = extractJavascript(rightHand);

			var leftHandCheck = checkJavascript(leftHand);
			var rightHandCheck = checkJavascript(rightHand);

			if(leftHandCheck.error) {
				done(leftHandCheck.error);
			} else if(rightHandCheck.error) {
				done(rightHandCheck.error);
			} else {
				done();
			}
		}

		function validateJavascriptCondition(condition, done) {
			condition = extractJavascript(condition);

			var result = checkJavascript(condition);

			if(result.error) {
				//Assume illegal booleans as false, send override
				//https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/w3c-ecma/test309.txml.scxml

				done(result.error, false);
			} else {
				done();
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

		function getFileContents(filePath, done) {
			//docUrl and context are coming from top function.
            fileUtils.read(filePath, docUrl, context, function (fileContent) {
                done(fileContent.error, fileContent.content);
            });
        }

		function handleError (node, path, error, override) {
			var newNode;

			if(override) {
				//Put a custom tag replacement instead of raise error.
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

		function asyncStarted () {
			asyncCount++;
		}

		function asyncDone () {
			asyncCount--;

			//If we are only waiting for async processes
			if(waitingForAsync && asyncCount === 0) {
				completeAnalysis();
			}
		}

		function completeAnalysis () {
			commitChanges(scJson);
			callback({ scJson: scJson, errors: [] });
		}

		processState(scJson, 'scJson');
		
		if(asyncCount === 0) {
			completeAnalysis();
		} else {
			//Wait for async processes to end
			waitingForAsync = true;
		}
	}
};

module.exports = scJsonAnalyzer;