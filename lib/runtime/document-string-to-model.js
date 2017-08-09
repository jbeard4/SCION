/*
     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
*/

"use strict";


var compilerInternals = require('./compiler-internals'),
    platform = require('./platform-bootstrap/node/platform'),
    fs = require('fs'),
    vm = require('vm'),
    SourceNode = require('source-map').SourceNode,
    assert = require('assert'),
    util = require('../util');

var scxmlToScjson = compilerInternals.scxmlToScjson, 
    scjsonToModule = compilerInternals.scjsonToModule, 
    scJsonAnalyzer = compilerInternals.scJsonAnalyzer;

/**
 * Compile the raw scxml document into a compiled JS module
 * Top-level scripts are extracted so that they can be compiled and executed independently
 * @param  {string}   url       The url of the scxml document
 * @param  {string}   docString The raw scxml document to be parsed
 * @param  {Function} cb        The callback to invoke once the document has been parsed
 * @param  {object}   [hostContext]   Context provided by the interpreter host
 */
function documentStringToModel(url,docString,cb,hostContext){
    if (typeof hostContext !== 'object' || hostContext === null) {
        hostContext = {};
    }

    
    //this will generate source maps
    if(
        (util.IS_INSPECTING                //workaround for node --inspect bug: https://github.com/nodejs/node/issues/7593
          || typeof window === 'object')   //always defer compilation in the browser, so that we get source maps
        && typeof hostContext.deferCompilation === 'undefined'
      ){
      hostContext.deferCompilation = true;
    }

    var scJson = scxmlToScjson(docString);

    scJsonAnalyzer.analyze(scJson, url, hostContext, function (result) {
        if (result.errors.length) {
            cb(result.errors);
            return;
        };

        createModule(url, result.scJson, hostContext, cb);
    });
}


/**
 * Compile the generated scxml module and any embedded or external scripts
 * @param  {string}   docUrl        The scxml document url
 * @param  {SCJsonRawModule}   rawModule      The raw SCION module created by scjson-to-module
 * @param  {object}   [hostContext]   Context provided by the interpreter host
 * @param  {Function} cb            Callback to invoke with the compiled module or an error
 */
function compileModule(docUrl, rawModule, hostContext, cb) {
    const promiseOffset = 2;
    let invokeConstructorPromises = [];
    //TODO: modules need to be evaluated in order of dependencies. we need to test recursive invoke content. 
    for(let invokeConstructor of rawModule.invokeConstructors.reverse()){

      let rootScripts = invokeConstructor.rootScripts;
      let scriptCount = rootScripts.length;
      let promises = new Array(scriptCount + promiseOffset);

      for (var i = 0; i < scriptCount; i++) {
          var curScript = rootScripts[i];
          if (curScript.src) {
              // defer the fetch until SCModel.prepare
              promises[i+promiseOffset] = Promise.resolve(curScript);
          } else {
              promises[i+promiseOffset] = new Promise(function(resolve, reject) {
                  try {
                      var content = curScript.content;
                      delete curScript.content;
                      var compiledScript = platform.module.compileScript(content, {
                          filename: docUrl,
                          lineOffset: curScript.$line,
                          columnOffset: curScript.$column
                      });
                      curScript.compiled = compiledScript;
                      resolve(curScript);
                  } catch(e) {
                      reject(e);
                  }
              });
          }
      }

      promises[0] = new Promise(function(resolve, reject) {
          try {
              var compiledModule = platform.module.compileScript('(' + invokeConstructor.module + ')', {
                  filename: docUrl
              });

              resolve(compiledModule);
          } catch(e) {
              reject(e);
          }
      });

      promises[1] = new Promise(function(resolve, reject) {
          if (!invokeConstructor.datamodel) {
              resolve(undefined);
          } else {
              try {
                  var compiledDatamodel = platform.module.compileScript(invokeConstructor.datamodel, {
                      filename: docUrl
                  });

                  resolve(compiledDatamodel);
              } catch(e) {
                  reject(e);
              }
          }
      })

      invokeConstructorPromises.push(
        Promise.all(promises).then(function compileSuccess(scripts) {
            var compiledModule = scripts.shift();
            var datamodelDecl = scripts.shift();

            return new CompiledInvokeConstructor(
                invokeConstructor.name,
                datamodelDecl,
                rootScripts,
                compiledModule
            );
        }, function compileError(err) {
          cb(err);
        })
      );
    }


    return Promise.all(invokeConstructorPromises).then(function(compiledInvokeConstructors){
        cb(null, new SCModel(compiledInvokeConstructors));
      },function compileError(err) {
        cb(err);
      });

}

function CompiledInvokeConstructor(name, datamodel, rootScripts, scxmlModule){
    this.name = name;
    this.datamodel = datamodel;
    this.rootScripts = rootScripts;
    this.module = scxmlModule;
}


function SCModel(compiledInvokeConstructors) {
  this.compiledInvokeConstructors = compiledInvokeConstructors;
}

/**
 * Prepares an scxml model for execution by binding it to an execution context
 * @param  {object} [executionContext] The execution context  (e.g. v8 VM sandbox).
 *   If not provided, a bare bones context is constructed
 * @param  {Function} cb  Callback to execute with the prepared model or an error
 *   The prepared model is a function to be passed into a SCION StateChart object
 * @param  {object} [hostContext]  Context provided by the interpreter host
 */
SCModel.prototype.prepare = function(cb, executionContext, hostContext) {


    var modelFns = []; 
    var promises = 
      this.compiledInvokeConstructors.map( (compiledInvokeConstructor, i) => {
        let execContext;
        [execContext, hostContext] = util.initContexts(executionContext, hostContext);
        let scriptPromises = util.fetchScripts(compiledInvokeConstructor, hostContext);      //FIXME: check what this is doing

        return Promise.all(scriptPromises).then(function resolved(scripts) {
            try {
                if (compiledInvokeConstructor.datamodel) {
                    compiledInvokeConstructor.datamodel.runInContext(execContext);
                }

                for (let i = 0; i < compiledInvokeConstructor.rootScripts.length; i++) {
                    var scriptInfo = compiledInvokeConstructor.rootScripts[i];
                    if(scriptInfo.src){
                      //lazily compile scripts that have been downloaded lazily
                      var content = scriptInfo.$wrap ? scriptInfo.$wrap(scriptInfo.content) : scriptInfo.content;
                      scriptInfo.compiled = new vm.Script(content, {filename: scriptInfo.src});
                    }
                    assert(scriptInfo.compiled);
                    scriptInfo.compiled.runInContext(execContext);
                }

                if(this.compiledInvokeConstructors.length === (i + 1)){
                  for(let fn of modelFns){
                    execContext[fn.name] = fn; //this should allow each FnModel to reference every other by name
                  }
                }
                let modelFn = compiledInvokeConstructor.module.runInContext(execContext);   //each iteration, add invokers to the execution context, which is shared memory
                modelFns.push(modelFn);
                return modelFn;
            } catch (e) {
                cb(e);
            }
        }.bind(this), function rejected(err) {
            cb(err);
        });
    });  

  Promise.all(promises).then(function(){
      cb(null, modelFns[modelFns.length - 1]);    //assume last modelFn will be the rootConstructor
  });
}

function createModule(url,scJson,hostContext,cb){
    if (platform.debug) {
        console.log('scjson',JSON.stringify(scJson, undefined, 2));
        if (!hostContext.hasOwnProperty('debug')) {
            hostContext.debug = true;
        }
    }

    scjsonToModule.startTraversal(url, scJson, hostContext).then(function resolved(rawModule) {
        if (platform.debug && rawModule.name) {
            fs.writeFileSync('/var/tmp/' + rawModule.name + '.scion', rawModule.module);
        }

        for (var i = 0; i < rawModule.invokeConstructors.length; i++) {
          let invokeConstructor = rawModule.invokeConstructors[i];
          for (var j = 0; j < invokeConstructor.rootScripts.length; j++) {
              var curScript = invokeConstructor.rootScripts[j];
              if (curScript.src) {
                curScript.src = platform.url.resolve(url, curScript.src);
              }
          }
        }
        

        if(hostContext.deferCompilation){
          cb(null, rawModule);
        } else {
          compileModule(url, rawModule, hostContext, cb);
        }
    }, function rejected(err) {
        cb(err);
    });
}

module.exports = documentStringToModel;
