var esprima = require('esprima');


var moduleAnalyzer = {
	analyze: function (js) {
		var analyzedJs = esprima.parse(js, { range: true });

		//console.log(JSON.stringify(analyzedJs, null, 4));
		goThroughSyntaxTree(analyzedJs.body[0]);

		return js;
	}
};

var systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];
var changes = [];

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
	"VariableDeclaration": function (tree) {
		
	},
	"AssignmentExpression": function (tree) {
		//Check if assignee is a system variable
		if(systemVariables.indexOf(tree.left.name) !== -1) {

			//Raise error.execution.
			changes.push({
				newCode: "this.raise({ name:\"error.execution\", data : {}});",
				start: tree.range[0],
				end: tree.range[1]
			});
			
			console.log(tree.left.name + ' used illegally');
		}
	},
	"ReturnStatement": function (tree) {
		
	},
	"CallExpression": function (tree) {
		
	},
	"IfStatement": function (tree) {
		
	}
};

function goThroughSyntaxTree (tree) {
	if (Array.isArray(tree)) {
		for (var i = tree.length - 1; i >= 0; i--) {
			goThroughSyntaxTree(tree[i]);
		};
	} else{
		if(tree.type) {
			treeTypes[tree.type](tree);
		}
	};
}


module.exports = moduleAnalyzer;