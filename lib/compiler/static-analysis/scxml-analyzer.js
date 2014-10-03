var esprima = require('esprima');
var parser = require("sax").parser(true, {
    trim: true,
    xmlns: true,
    position: true
});
var fileUtils = require('./file-utils');

var systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];

var scxmlAnalyzer = {
    analyze: function(currentScxml, docUrl, context, callback) {
        var lastOpenScriptTagPosition, currentJsScriptTag, changes = [], asyncWaiting = [], commitReady = false;

        var result = {
            errors: [],
            changes: [],
            newScxml: null
        };

        var openNodeTypes = {
            "assign": function(node) {
                if (node.attributes.location && systemVariables.indexOf(node.attributes.location.value) !== -1) {
                    //If assignee is a system variable

                    createError({
                        message: 'You can\'t change system variables.'
                    });
                };

                if (node.attributes.expr) {
                    //If assign has a javascript expression

                    validateJavascriptExpression(node.attributes.expr.value);

                    //Construct variable = something; expression.
                    var constructedExpression = node.attributes.location.value + " = " + node.attributes.expr.value;

                    validateJavascriptExpression(constructedExpression);
                }
            },
            "script": function(node) {
                //Catch opening of script tag.
                lastOpenScriptTagPosition = parser.startTagPosition - 1;
            },
            "transition": function(node) {
                if (node.attributes.cond) {
                    //If condition has a javascript expression

                    validateJavascriptExpression(node.attributes.cond.value);
                }
            }
        };

        var closedNodeTypes = {
            "script": function() {

                if (parser.tag.isSelfClosing) {
                    //Self closing script tag means it is including another document
                    if (parser.tag.attributes.src) {

                        
                        getFileContents(parser.tag.attributes.src.value, getContentBetween());
                    }
                } else {
                    //Script has js in it's body 

                    //Strip from <script></script> tags
                    var strippedJS = currentScxml.substring(lastOpenScriptTagPosition + 8, parser.position - 9);

                    var jsValidationResults = validateJavascriptExpression(strippedJS, lastOpenScriptTagPosition, parser.position);
                };

                //Reset to prevent future problems
                lastOpenScriptTagPosition = null;
            }
        };

        var treeTypes = {
            "BlockStatement": function(tree) {
                tree = tree.body;
                goThroughSyntaxTree(tree);
            },
            "FunctionExpression": function(tree) {
                tree = tree.body;
                goThroughSyntaxTree(tree);
            },
            "FunctionDeclaration": function(tree) {
                tree = tree.body;
                goThroughSyntaxTree(tree);
            },
            "ExpressionStatement": function(tree) {
                tree = tree.expression;
                goThroughSyntaxTree(tree);
            },
            // "VariableDeclaration": function (tree) {

            // },
            "AssignmentExpression": function(tree) {
                    //Check if assignee is a system variable
                    if (systemVariables.indexOf(tree.left.name) !== -1) {

                        var newError = {
                            message: 'You can\'t change system variables.',
                            start: currentJsScriptTag.start,
                            end: currentJsScriptTag.end
                        };

                        createError(newError);
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

        parser.onerror = function(e) {
            console.log(e);
        };

        parser.onopentag = function(node) {
            if (node.name && openNodeTypes[node.name]) {
                openNodeTypes[node.name](node);
            }
        };

        parser.onclosetag = function(node) {
            if (node && closedNodeTypes[node]) {
                closedNodeTypes[node]();
            }
        };

        parser.onend = function() {
            if(asyncWaiting.length === 0) {
                commitChanges();   
            } else {
                commitReady = true;
            }
        };

        function createError(error) {
            //Defaults
            error.changeType = "error";
            error.start = error.start || parser.startTagPosition - 1;
            error.end = error.end || parser.position;
            error.oldScxml = getContentBetween(error.start, error.end);
            error.message = (error.message ||  "") + ' At: ' + error.oldScxml;
            error.line = error.line ||  parser.line;
            error.col = error.col ||  parser.col;

            //TODO add reason to data.message of raise.
            if (error.addOnentry) {
                error.newScxml = '<onentry>\n   <raise event="error.execution"/>\n</onentry>';
            } else {
                error.newScxml = '<raise event="error.execution"/>';
            }

            changes.push(error);
        }

        function createReplace (oldContent, newContent) {
            var change = {
                changeType: "replace",
                oldScxml: oldContent,
                newScxml: newContent,
                line: parser.line,
                col: parser.col
            };

            changes.push(change);
        }

        function getContentBetween(start, end) {
            start = start || parser.startTagPosition - 1;
            end = end || parser.position;

            return currentScxml.substring(start, end);
        }

        //Removing content from a file more than once with indexof is a tricky thing.
        //I just took the shortcut and went with replace
        function commitChanges() {
            if(changes.length === 0) {
                result.newScxml = currentScxml;
                callback(result);
            } else {
                for (var i = changes.length - 1; i >= 0; i--) {
                    var newChange = changes[i];
                    if (newChange.changeType === "error") {
                        result.errors.push(newChange);
                    } else if (newChange.changeType === "replace") {
                        result.changes.push(newChange);
                    }
                    
                    currentScxml = currentScxml.replace(newChange.oldScxml, newChange.newScxml);

                    if(i == 0) {
                        result.newScxml = currentScxml;
                        callback(result);
                    }
                };
            }
        }

        function asyncStart (fileName) {
            asyncWaiting.push(fileName);
        }

        function asyncDone (fileName) {
            asyncWaiting.splice(asyncWaiting.indexOf(fileName), 1);

            if(asyncWaiting.length === 0 && commitReady) {
                commitChanges();
            }
        }

        function validateJavascriptExpression(js, start, end) {
            start = start || parser.startTagPosition - 1;
            end = end || parser.position;

            currentJsScriptTag = {
                start: start,
                end: end
            };

            var analyzedJs;

            try {
                analyzedJs = esprima.parse(js, {});

                goThroughSyntaxTree(analyzedJs.body[0]);
            } catch (e) {

                var newError = {
                    message: 'Syntax error. ' + e.name + ': ' + e.message,
                    start: currentJsScriptTag.start,
                    end: currentJsScriptTag.end
                };

                createError(newError);
            }

            //Reset to prevent future problems
            currentJsScriptTag = null;
            return "";
        }

        function goThroughSyntaxTree(tree) {
            if (Array.isArray(tree)) {
                //Run each children of an array separately
                for (var i = tree.length - 1; i >= 0; i--) {
                    goThroughSyntaxTree(tree[i]);
                };
            } else if (tree.type && treeTypes[tree.type]) {
                //If we support the type value
                treeTypes[tree.type](tree);
            };
        }

        function getFileContents(filePath, oldContent) {
            asyncStart(filePath);
            fileUtils.read(filePath, docUrl, context, function (fileContent) {
                if (fileContent.error) {
                    createError({
                        message: fileContent.error,
                        addOnentry: true
                    });
                } else {
                    var newScriptTag = '<script>\n    ' + fileContent.content + '\n</script>';

                    //Replace <script src="C:/foo.js" /> with a script body
                    createReplace(oldContent, newScriptTag);
                }

                asyncDone(filePath);
            });
        }

        parser.write(currentScxml).close();
    }
};

module.exports = scxmlAnalyzer;