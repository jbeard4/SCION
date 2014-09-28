var esprima = require('esprima');

var changes, systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];

var currentJs;

var moduleAnalyzer = {
	analyze: function (js) {
		changes = [];
		currentJs = js;
		var analyzedJs = esprima.parse(js, { range: true });

		//console.log(JSON.stringify(analyzedJs, null, 4));
		goThroughSyntaxTree(analyzedJs.body[0]);

		// var updatedJs = js;
		// if(changes.length) {
		// 	for (var i = changes.length - 1; i >= 0; i--) {
		// 		updatedJs = replaceCode(js, changes[i].start, changes[i].end, changes[i].newCode);
		// 	};
		// }

		return currentJs;
	}
};

var treeTypes = {
	"BlockStatement": function (tree) {
		tree = tree.body;
		goThroughSyntaxTree(tree);
	},
	"FunctionExpression": function (tree) {
		tree = tree.body;
		goThroughSyntaxTree(tree);
	},
	"FunctionDeclaration": function (tree) {
		tree = tree.body;
		goThroughSyntaxTree(tree);
	},
	"ExpressionStatement": function (tree) {
		tree = tree.expression;
		goThroughSyntaxTree(tree);
	},
	// "VariableDeclaration": function (tree) {
		
	// },
	"AssignmentExpression": function (tree) {
		//Check if assignee is a system variable
		if(systemVariables.indexOf(tree.left.name) !== -1) {

			//Raise error.execution.
			applyChanges({
				newCode: "this.raise({ name:\"error.execution\", data : {}})",
				start: tree.range[0],
				end: tree.range[1]
			});

			console.log('Illegal use of ' + tree.left.name);
		}
	}
	// ,
	// "ReturnStatement": function (tree) {
		
	// },
	// "CallExpression": function (tree) {
		
	// },
	// "IfStatement": function (tree) {
		
	// }
};

function goThroughSyntaxTree (tree) {
	if (Array.isArray(tree)) {
		//Run each children of an array separately
		for (var i = tree.length - 1; i >= 0; i--) {
			goThroughSyntaxTree(tree[i]);
		};
	} else if(tree.type && treeTypes[tree.type]) {
		//If we support the type value
		treeTypes[tree.type](tree);
	};
}

function applyChanges (change) {
	currentJs = replaceCode(currentJs, change.start, change. end, change.newCode);
}

function replaceCode (original, start, end, newCode) {
	return original.substring(0, start) + newCode + original.substring(end, original.length);
}

module.exports = moduleAnalyzer;