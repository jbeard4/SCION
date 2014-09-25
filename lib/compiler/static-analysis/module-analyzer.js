var esprima = require('esprima');


var moduleAnalyzer = {
	analyze: function (js) {
		var analyzedJs = esprima.parse(js);

		//console.log(JSON.stringify(analyzedJs, null, 4));
		goThroughSyntaxTree(analyzedJs.body[0]);

		return js;
	}
};

var systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];

var treeTypes = {
	"BlockStatement": function (tree) {
		tree = tree.body;
		goThroughSyntaxTree(tree);
		
	},
	"FunctionExpression": function (tree) {
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
		
	},
	"ReturnStatement": function (tree) {
		
	},
	"CallExpression": function (tree) {
		
	},
	"IfStatement": function (tree) {
		
	},
	"FunctionDeclaration": function (tree) {
		
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