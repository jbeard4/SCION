const sourcemap = require('source-map');
const SourceNode = sourcemap.SourceNode;
const SourceMapConsumer = sourcemap.SourceMapConsumer;
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const util = require('@jbeard/scxml/lib/util');
const scjsonToModule = require('@jbeard/scxml/lib/compiler/scjson-to-module');
const esprima = require('esprima');

//patch
require('@jbeard/scxml/lib/runtime/document-string-to-model').handleRawModule = function(url, rawModule, hostContext, cb){
  cb(null, rawModule);
};

//patch
const SCJsonRawModule = scjsonToModule.SCJsonRawModule;

SCJsonRawModule.prototype.prepareModuleString = function(cb, options){
  return Promise.all(this.invokeConstructors.map( constructor => constructor.prepareModuleRootNode() )).then( function(rootNodes){
    var rootNode = new SourceNode(null, null, null);

    rootNode.add(scjsonToModule.dumpHeader(options.strict));

    if(!scjsonToModule.isCommonjs(options)){
      rootNode.add('(function(){\n');
    }

    //aggregate modules
    for(let node of rootNodes){
      rootNode.add(node);
    }

    if(scjsonToModule.isCommonjs(options)) {
      rootNode.add(`module.exports = ${scjsonToModule.getConstructorFunctionName(this.rootState)};`);
    } else {
      rootNode.add('   return ' + scjsonToModule.getConstructorFunctionName(this.rootState) + ';\n');
      rootNode.add('})();');
    }


    let s = rootNode.toStringWithSourceMap();
    let generatedCode = s.code + '\n' +
          '//' + '#' + ' sourceMappingURL' + '=' + 'data' + ':' + 'application/json' + ';charset=utf-8;base64,' + //we split this string up so that we don't hit the source map regex on sourcemap-processing tools like sorcery
          new Buffer(s.map.toString()).toString('base64');
    
    cb(null, generatedCode);
  }.bind(this), ( error => cb(error) ));
}

/**
 * Generate JavaScript module that can be executed by SCION-CORE StateCharts runtime
 * @param  {Function} cb  Callback to execute with the prepared module string.
 */
SCJsonRawModule.prototype.prepare = function(cb, executionContext, hostContext){
    [executionContext, hostContext] = util.initContexts(executionContext, hostContext);

    if(util.IS_INSPECTING){
      //workaround for https://github.com/nodejs/node/issues/7593
      hostContext.writeModuleToDisk = true;
    } 

    if(hostContext.writeModuleToDisk){
      hostContext.moduleFormat = 'commonjs'; 
    }

    this.prepareModuleString(function(err, generatedCode){
      if(err) return cb(err);
      if(hostContext.writeModuleToDisk){
        fs.mkdtemp('/tmp/foo-', (err, folder) => {
          if (err) return cb(err);
          var modulePath = folder + path.sep + 'sc.js';
          //console.log('modulePath ', modulePath );
          fs.writeFile(modulePath, generatedCode, function(err){
            if (err) return cb(err);
            //Copy the execution context into the global context.
            //This is terrible, but seems to be the most reliable way to get --inspect support working with source maps and chrome for node v7.
            //Support for --inspect is still pretty unstable.
            //Fortunately, this code will only be used in development.
            //One day I may patch require so that it takes an executionContext argument.
            Object.keys(executionContext).forEach( (k) => {
              global[k] = executionContext[k];
            });
            var fnModel = require(modulePath);
            cb(null, fnModel); 
          });
        });
      } else {
        var fnModel = vm.runInContext(generatedCode, executionContext);
        cb(null, fnModel); 
      }
    }, hostContext);
}


scjsonToModule.parseJsCode = function(fnBody, action, docUrl, node, isExpression){
  let sourceMapConsumer;


  if(typeof action.$column === 'undefined' || typeof action.$line === 'undefined'){
    return node.add(fnBody);  //no line/column. do not generate a sourcemap for this expression
  }

  if(action.rawSourceMap){
    sourceMapConsumer = new sourcemap.SourceMapConsumer(action.rawSourceMap);
  }

  //console.log(fnBody, action.$line);
  var tokens = esprima.tokenize(fnBody, { loc: true });
  var lastTokenEndLine = 1,
      lastTokenEndCol = 0;
  tokens.forEach(function(token, i){
    var numLinesPadding = token.loc.start.line - lastTokenEndLine,
        numColsPadding = token.loc.start.column - lastTokenEndCol;
    var whitespace = (function(){
      var s = [];
      for(var i = 0; i < numLinesPadding; i++){
        s.push('\n');
      }
      for(var j = 0; j < numColsPadding ; j++){
        s.push(' ');
      }
      return s.join('');
    })();
    if(!(isExpression && i==0)){ 
      //skip whitespace
      node.add(whitespace);
    }

    let generatedPosition = {line : token.loc.start.line, column : token.loc.start.column};
    let originalPosition = sourceMapConsumer ? 
        sourceMapConsumer.originalPositionFor(generatedPosition) : 
        generatedPosition;
    let line = action.$line + originalPosition.line;
    let column = originalPosition.line === 1 ? action.$column + originalPosition.column :  originalPosition.column;

    var tokenNode = new SourceNode(
      line,
      column,
      docUrl,
      token.value 
    );
    //console.log('tokenNode',tokenNode);
    node.add(tokenNode);
    lastTokenEndLine = token.loc.end.line;
    lastTokenEndCol = token.loc.end.column;
  });
};

scjsonToModule.SourceNode = SourceNode;
