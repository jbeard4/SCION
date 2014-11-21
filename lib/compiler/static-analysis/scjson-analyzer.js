'use strict';

var esprima = require('esprima');
var fileUtils = require('./file-utils');
var changes = [];

var scJsonAnalyzer = {
	analyze: function(scJson, docUrl, context, callback) {
		changes = [];
		traverseNodes(scJson);

		var newScJson = JSON.parse(commitChanges(scJson));

		callback({ scJson: newScJson, errors: [] });
	}
};

function traverseNodes(node) {
	Object.keys(node).forEach(function(i){
    	var currentNode = node[i];

    	if (currentNode === null)
    		return;
    	
        if (typeof(currentNode) === 'object') {
        	if(currentNode.type) {
        		processNodes(currentNode);
        	}

        	//Go deeper into the child nodes
            traverseNodes(currentNode);
        }
    });
}

function processNodes(node) {
    if(actionTags[node.type]) {
		actionTags[node.type](node, function done (error) {
			if(error) {
				handleError(node, error);
			}
		});
	}
}

var actionTags = {
	"data": function (node, cb) {
		validateJavascriptAssignment(node.id, node.expr, cb);
	},
	"assign": function (node, cb) {
		validateJavascriptAssignment(node.location, node.expr, cb);
	},
	"transition": function (node, cb) {
		validateJavascriptCondition(node.cond, cb);
	},
	"if": function (node, cb) {
		validateJavascriptCondition(node.cond, cb);
	},
	"ifelse": function (node, cb) {
		validateJavascriptCondition(node.cond, cb);
	}
};

function validateJavascriptAssignment(leftHand, rightHand, cb) {
	if(!leftHand || !rightHand) {
		cb();
	}

	if (typeof(leftHand) === 'object') {
		leftHand = leftHand.expr;
	}

	if (typeof(rightHand) === 'object') {
		rightHand = rightHand.expr;
	}

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
	if(!condition) {
		cb();
	}

	if (typeof(condition) === 'object') {
		condition = condition.expr;
	}

	var result = checkJavascript(condition);

	if(result.error) {
		cb(result.error);
	} else if(result.syntax.body[0].type !== 'BinaryExpression') {
		cb('Not a condition');
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

function handleError (node, error) {
	var newNode = {
		$line : node.$line,
		$column : node.$column,
		type: 'raise',
		event: 'error.execution',
		data: {
			message: error
		}
	};

	changes.push({
		old: node,
		new: newNode
	});

	// console.log(mainName);
	// console.log(JSON.stringify(oldNode));
	// console.log(JSON.stringify(node));
}

function commitChanges (scJson) {
	var scJsonString = JSON.stringify(scJson);

	changes.forEach(function (change) {
		scJsonString = scJsonString.replace(JSON.stringify(change.old), JSON.stringify(change.new));
	});

	return scJsonString;
}

module.exports = scJsonAnalyzer;