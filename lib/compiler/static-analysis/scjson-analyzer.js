'use strict';

var esprima = require('esprima');
var fileUtils = require('./file-utils');

var systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];

var scJsonAnalyzer = {
	analyze: function(scJson, docUrl, context, done) {
		var changes = [],
			asyncCount = 0,
			waitingForAsync = false;

		function processState(state) {
			if(state.datamodel) processActions(state, 'datamodel');
			if(state.onExit) processActions(state, 'onExit');
			if(state.onEntry) processActions(state, 'onEntry');
			if(state.transitions) {
				processActions(state, 'transitions', state);

				state.transitions.forEach(function(transition, i){
					if(transition.onTransition) {
						processActions(transition, 'onTransition'); 	
					}
				});
			}

			if(state.rootScripts) {
				processActions(state, 'rootScripts');
			}

			if(state.states) state.states.forEach(function(substate, i){ processState(substate); });
		}

		function processActions(actionContainer, name, state){
			if(Array.isArray(actionContainer[name])) {

				Object.keys(actionContainer[name]).forEach(function(i) {
					checkAction(actionContainer[name], i, actionContainer[name][i].$type || name, state);

					if(actionContainer[name][i].actions) processActions(actionContainer[name][i], 'actions');
				});
			} else {
				checkAction(actionContainer, name, name, state);
			}
		}

		function checkAction(action, propertyName, $type, state) {
		    if(actionTags[$type]) {

		    	var errors = actionTags[$type](action[propertyName], function (errors, override) {
		    		if(override) {
		    			handleError(action, propertyName, errors, $type, state, override);
			    	} else if(errors.length > 0) {
						handleError(action, propertyName, errors, $type, state);
			    	}

		    		asyncDone();
		    	});

		    	if(errors) {
		    		if(errors.override) {
			    		handleError(action, propertyName, errors.errors, $type, state, errors.override);
			    	} else if(errors.length > 0) {
						handleError(action, propertyName, errors, $type, state);
			    	}
		    	}
			}
		}

		var actionTags = {
			'data': function (node, done) {
				//If there is an external file and
				//src attribute starting exactly with "file:"
				if(node.src && node.src.indexOf('file:') === 0) {
					asyncStarted();

					getFileContents(node.src.substring(5), function (error, content) {
						if(error) {
							done([error]);
						} else {
							delete node.src;
							node.expr = { 	$column: node.$column,
											$line: node.$line,
											expr: normalizeWhitespace(content)
										};

							done(null, node);
						}
					});
				} else if(node.content) {
					var errors = validateJavascriptAssignment(node.id, node.content);

					if(errors.length > 0) {
						node.content.expr = normalizeWhitespace(node.content.expr);
					}

					node.expr = node.content;
					delete node.content;

					return { override: node, errors: errors };
				} else {
					return validateJavascriptAssignment(node.id, node.expr);
				}
			},
			'assign': function (node) {
				if(node.location && node.expr) {
					return validateJavascriptAssignment(node.location, node.expr);
				}

				return [];
			},
			'transitions': function (node) {
				if(node.cond) {
					// return validateJavascriptCondition(node.cond);
					var errors = validateJavascriptCondition(node.cond);

					if(errors.length) {
						//Assume illegal booleans as false, send override
						//https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/w3c-ecma/test309.txml.scxml
						node.cond.expr = 'false';

						return { override: node, errors: errors };
					}
				}

				return [];
			},
			'if': function (node) {
				return validateJavascriptCondition(node.cond);
			},
			'ifelse': function (node) {
				return validateJavascriptCondition(node.cond);
			},
			'script': function (node, done) {
				if(node.src) {
					asyncStarted();

					getFileContents(node.src, function (error, content) {
						if(error) {
							done([error]);
						} else {
							var errors = validateArbitraryJavascript(content);

							if(errors.length > 0) {
								done(errors);
							} else {
								delete node.src;
								node.content = content;
								done(null, node);
							}
						}
					});
				}

				if(node.content) {
					return validateArbitraryJavascript(node.content);
				}
			},
			'log': function (node) {
				if(node.expr) {
					return validateJavascriptExpression(node.expr);
				}

				return [];
			},
			'send': function (node) {
				if(node.$type) {
					return validateJavascriptExpression(node.expr);
				}

				return [];
			},
			'foreach': function (node) {
				var errors = [];

				if(node.item) {
					var results = validateJavascriptIdentifier(node.item);

					if(results && results.length > 0)
					{
						errors = errors.concat(results);	
					}
				}

				if(node.index) {
					var results = validateJavascriptIdentifier(node.index);

					if(results && results.length > 0)
					{
						errors = errors.concat(results);	
					}
				}

				if(node.array) {
					var results = validateJavascriptExpression(node.array);

					if(results && results.length > 0)
					{
						errors = errors.concat(results);	
					}
				}

				return errors;
			}
		};

		function validateJavascriptAssignment(leftHand, rightHand) {
			var errors = [];

			var leftHandCheck = validateArbitraryJavascript(leftHand);
			var rightHandCheck = validateArbitraryJavascript(rightHand);

			if(leftHandCheck.length) {
				errors.push(leftHandCheck);
			} else if(rightHandCheck.length) {
				errors.push(rightHandCheck);
			} else if(systemVariables.indexOf(extractJavascript(leftHand)) !== -1) {
				errors.push('You can\'t change system variables: ' + leftHand);
			}

			return errors;
		}

		function validateJavascriptCondition(condition) {
			return validateArbitraryJavascript(condition);
		}

		function validateJavascriptExpression (js) {
			return validateArbitraryJavascript(js);
		}

		function validateJavascriptIdentifier (js) {
			js = extractJavascript(js);

			var errors = validateArbitraryJavascript(js);

			if(errors.length) return errors;

			var syntaxTree = esprima.parse(js, {});

			if(syntaxTree.body[0].expression.type !== 'Identifier') {
				return ['Illegal identifier: ' + js];
			}
		}

		function validateArbitraryJavascript (js) {
			js = extractJavascript(js);

			var errors = [];

			try {
				var syntaxTree = esprima.parse(js, {});

				traverseSyntaxTree(syntaxTree, errors);
			} catch (e) {
				errors.push(e.description);
		    }

			return errors;
		}

		var treeTypes = {
			"AssignmentExpression": function(tree, errors) {
                //Check if assignee is a system variable in for statement
                if(tree.init && systemVariables.indexOf(tree.init.left.name) !== -1) {
                	errors.push('You can\'t change system variables: ' + tree.init.left.name);
                }

                //Check if assignee is a system variable in expressions
                if(tree.expression && systemVariables.indexOf(tree.expression.left.name) !== -1) {
                	errors.push('You can\'t change system variables: ' + tree.expression.left.name);
                }
            }
		};

		function traverseSyntaxTree(tree, errors) {
			Object.keys(tree).forEach(function(i){
		        if (tree[i] && typeof(tree[i]) === 'object') {
		        	if (tree[i].type && treeTypes[tree[i].type]) {
		        		 treeTypes[tree[i].type](tree, errors);
		        	}

		        	//Go deeper into the child nodes
		            traverseSyntaxTree(tree[i], errors);
		        }
		    });
		}

		function getFileContents(filePath, done) {
			//docUrl and context are coming from top function.
            fileUtils.read(filePath, docUrl, context, function (fileContent) {
            	done(fileContent.error, fileContent.content);
            });
        }

		function handleError (node, property, errors, $type, state, override) {
			var errorNode = {
				$line : node[property].$line,
				$column : node[property].$column,
				$type: 'raise',
				event: 'error.execution',
				data: {
					message: errors ? errors.join(', ') : ''
				}
			};

			changes.push({
				old: node,
				prop: property,
				$type: $type,
				new: override,
				state: state,
				error: errorNode
			});
		}

		function extractJavascript (attribute) {
			//Just a workaround for esprima parsing.
			if (typeof(attribute) === 'object') {
				attribute = attribute.expr;
			}

			return attribute;
		}

		function normalizeWhitespace (str) {
			return JSON.stringify(str.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(/\s/g, " "));
		}

		function commitChanges (scJson) {
			changes.forEach(function (change) {

				if(change.$type === 'data' && !change.new) {
					delete scJson.datamodel;
					scJson.onEntry = [ change.new || change.error ];
				} else if(change.$type === 'script' && !change.new && scJson.rootScripts) {
					delete scJson.rootScripts;
					scJson.onEntry = [ change.error ];
				} else if(change.$type === 'transitions') {
					if(!change.state.onEntry) change.state.onEntry = [];

					change.state.onEntry.push(change.error);

					change.old[change.prop] = change.new;
				} else {
					change.old[change.prop] = change.new || change.error;
				}
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
			done({ scJson: scJson, errors: [] });
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
