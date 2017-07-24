'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');
var fileUtils = require('./file-utils');
var assert = require('assert');

var systemVariables = ["_event", "_sessionid", "_name", "_ioprocessors", "_x"];
var scJsonAnalyzer = {
  analyze: function(scJson, docUrl, context, done) {
    var changes = [],
      syntaxErrors = [],
      asyncCount = 0,
      waitingForAsync = false,
      reportCompileErrors = (context.reportAllErrors === true),
      datamodelAccumulator = [];

    //traverse and accumulate datamodel declarations
    //traverse, and find all assign/@location
    //send/@namelist, donedata/@namelist
    //we could also traverse inside of js expressions, and look for identifiers. but we would then also need to accumulate variable declarations.
    function traverseAndAccumulateDatamodelDeclarations(state){
      if(state.datamodel) datamodelAccumulator.push.apply(datamodelAccumulator, state.datamodel.declarations);
      
      if(state.states) state.states.forEach(function(substate, i){ traverseAndAccumulateDatamodelDeclarations(substate); });
    }

    function processState(state) {
      if(state.datamodel) processActions(state.datamodel, 'declarations');
      if(state.onExit) processActions(state, 'onExit');
      if(state.onEntry) processActions(state, 'onEntry');
      if(state.donedata) processActions(state, 'donedata',state);
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
      let blocks = actionContainer[name];
      if(Array.isArray(blocks)) {
        blocks.forEach(function(block, i) {
          if(Array.isArray(block)){
            block.forEach(function(action, j){
              checkAction(block, j, block[j].$type || name, state);
              if(block[j].actions) processActions(block[j], 'actions');
            });
          } else {
            checkAction(blocks, i, blocks[i].$type || name, state);
            if(blocks[i].actions) processActions(blocks[i], 'actions');
          }
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

    function checkLocationExistsInDatamodel(node){
      let syntaxTree = esprima.parse(node.location.expr, {});
      let ids = datamodelAccumulator.map( data => data.id )

      //retrieve the first identifier:
      //we expect top-level ExpressionStatement
      //recurse 0-to-many MemberExpression all the way down
      //until we hit the inner-most identifier
      //then peel off the name property
      assert.equal(syntaxTree.body[0].type, "ExpressionStatement");
      let o = syntaxTree.body[0].expression;
      while(o.type !== "Identifier"){
        assert.equal(o.type, "MemberExpression");
        o = o.object;
      }
      assert.equal(o.type, "Identifier");
      let id = o.name;

      return ids.indexOf(id) === -1;
    }

    function convertLocalVariableDeclarationsToAssignmentExpression(scriptNode){
      let script = scriptNode.content;
      //traverse syntax tree, and look for variable declarations
      let syntaxTree = esprima.parse(script,  { loc: true, range: true, comment: true });
      let arraysToSplice = [];
      traverse(syntaxTree,'body');
      if(arraysToSplice.length){
        arraysToSplice.forEach(function(arr){
          let parentNode = arr[0], nodeToReplace = arr[1];
          let i = parentNode.indexOf(nodeToReplace);
          parentNode.splice.apply(parentNode, 
            [i, 1].concat( 
              nodeToReplace.declarations
                .map(function(declaration){
                  //TODO: does expression statement need line/col?
                  return declaration.init &&
                    datamodelAccumulator.map( data => data.id ).indexOf(declaration.id.name) > -1 ?
                    {
                      "type": "ExpressionStatement",
                      "expression": {
                          "type": "AssignmentExpression",
                          "operator": "=",
                          "left": declaration.id,
                          "right": declaration.init,
                          "range": declaration.range,
                          "loc": declaration.loc
                      }
                    } :
                    {
                      "type": "VariableDeclaration",
                      "kind": nodeToReplace.kind,
                      "declarations": [ declaration ]
                    };
                })
            )
          );
        });
        let x = escodegen.generate(syntaxTree,
          {
            sourceMap: 'x',
            sourceMapWithCode: true
          }
        );
        scriptNode.content = x.code;
        scriptNode.rawSourceMap = x.map.toJSON();
      }

      function traverse(parentNode,property){
        const node = parentNode[property];
        //VariableDeclaration.declarations[VariableDeclarator] -> ExpressionStatement.expression.expressions[AssignmentExpression]
        if(node.type === 'VariableDeclaration'){
          //prepare replacement data structure
          if(node.declarations.some(function(declaration){
            return datamodelAccumulator.map( data => data.id ).indexOf(declaration.id.name) > -1;
          })){
            //remember this position, so that we can replace
            arraysToSplice.push([parentNode, node]);
          }
        } else if(node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
          //allow variable shadowing inside of functions 
          //do not traverse inside function declarations, as this creates a new scope 
          return;
        } else {
          Object.keys(node).forEach(function(key){
            let o = node[key];
            if(Array.isArray(o)){
              for(let i = 0; i < o.length; i++){ 
                traverse(o, i);
              }
            } else if(typeof o === 'object' && o.type){
              traverse(node, key); 
            } else {
              //ignore
            }
          });
        }
      }
    }

    var actionTags = {
      'donedata' : function(node){
        if(node.expr){   //content
          return validateJavascriptExpression(node.expr, true);
        }else if(node.params){    //params
          return node.params.map(function(param){

            if(param.location && checkLocationExistsInDatamodel(param)){
              //return error 
              return ['Param references location not declared in the datamodel:' + param.location.expr];
            }

            return validateJavascriptExpression(param.expr, true);
          }).reduce(function(a,b){return a.concat(b)},[]);
        }   //TODO: namelist?
      },
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
              node.content = {   $column: node.$column,
                $line: node.$line,
                content: normalizeWhitespace(content)
              };

              done(null, node);
            }
          });
        } else if(node.content) {
          var errors = validateJavascriptAssignment(node.id, node.content);
           node.content.content = normalizeWhitespace(node.content.content);

          if(errors.length > 0) {
            //node.expr = node.content;
            //delete node.content;
            //TODO: handle this case
          }


          return { override: node, errors: errors };
        } else {
          return validateJavascriptAssignment(node.id, node.expr);
        }
      },
      'assign': function (node) {
        if(checkLocationExistsInDatamodel(node) && systemVariables.indexOf(node.location.expr) === -1){
          //return error 
          return ['Assignment to location not declared in the datamodel:' + node.location.expr];
        }
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
          // DO NOT inline the external script here. that MUST be done
          // each time the parent document is requested
        } else if(node.content) {
          convertLocalVariableDeclarationsToAssignmentExpression(node);
          return validateArbitraryJavascript(node.content);
        }
      },
      'log': function (node) {
        if(node.expr) {
          return validateJavascriptExpression(node.expr, true);
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
      var rightHandCheck = validateArbitraryJavascript(extractJavascript(leftHand) + ' = ' + extractJavascript(rightHand));

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

    function validateJavascriptExpression (js, allowLiteral) {
      return validateArbitraryJavascript(js, allowLiteral);
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

    function validateArbitraryJavascript (js, allowLiteral) {
      js = extractJavascript(js);

      if (allowLiteral) {
        js = '_lhs = ' + js;
      }

      var errors = [];

      try {
        var syntaxTree = esprima.parse(js, {});

        traverseSyntaxTree(syntaxTree, errors);
      } catch (e) {
        errors.push(e.message);
      }

      return errors;
    }

    var treeTypes = {
      "AssignmentExpression": function(tree, errors) {
        //Check if assignee is a system variable in for statement
        if(tree.init && tree.init.left && systemVariables.indexOf(tree.init.left.name) !== -1) {
          errors.push('You can\'t change system variables: ' + tree.init.left.name);
        }

        //Check if assignee is a system variable in expressions
        if(tree.expression && tree.expression.left && systemVariables.indexOf(tree.expression.left.name) !== -1) {
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
      if (reportCompileErrors && errors && errors.length) {
        var n = node[property];
        syntaxErrors.push({
          tagname: n.$type,
          line: n.$line,
          column: n.$column,
          reason: errors.join('; ')
        });
      }


      let message = errors ? errors.join(', ') : '';
      var errorNode = {
        $line : node[property].$line,
        $column : node[property].$column,
        $type: 'script',
        content : `throw new Error(${JSON.stringify(message)})`
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
      return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(/\s/g, " ");
    }

    function commitChanges (scJson, errors) {
      changes.forEach(function (change) {
        if(change.$type === 'donedata') {
          delete change.state.donedata;
          change.state.onEntry = change.state.onEntry || [];
          change.state.onEntry.push(change.error);
        }else if(change.$type === 'data' && !change.new) {
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
      if (syntaxErrors.length) {
        scJson = undefined;
      } else {
        commitChanges(scJson);
      }

      done({ scJson: scJson, errors: syntaxErrors });
    }

    traverseAndAccumulateDatamodelDeclarations(scJson);
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
