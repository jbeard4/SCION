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

var scxmlToScjson = require('../compiler/scxml-to-scjson'),
    scjsonToModule = require('../compiler/scjson-to-module'),
    scJsonAnalyzer = require('../compiler/static-analysis/scjson-analyzer'),
    pm = require('./platform-bootstrap/platform'),
    fs = require('fs');

/**
 * Compile the raw scxml document into a compiled JS module
 * Top-level scripts are extracted so that they can be compiled and executed independently
 * @param  {string}   url       The url of the scxml document
 * @param  {string}   docString The raw scxml document to be parsed
 * @param  {Function} cb        The callback to invoke once the document has been parsed
 * @param  {object}   context   Context provided by the interpreter context
 */
function documentStringToModel(url,docString,cb,context){
    if (typeof context !== 'object' || context === null) {
        context = {};
    }

    var scJson = scxmlToScjson(docString);

    scJsonAnalyzer.analyze(scJson, url, context, function (result) {
        if (result.errors.length) {
            cb(result.errors);
            return;
        };

        createModule(url, result.scJson, context, cb);
    });
}

function fetchScript(scriptInfo, moduleContext) {
    return new Promise(function(resolve, reject) {
        pm.platform.getScriptFromUrl(scriptInfo.src,
            function(err, compiledScript, mimeType) {
                if (err) {
                    reject(err);
                } else {
                    scriptInfo.compiled = compiledScript;
                    resolve(scriptInfo);
                }
            },
            moduleContext,
            {
                lineOffset: scriptInfo.$line,
                columnOffset: scriptInfo.$column
            });
    });
}

/**
 * Compile the generated scxml module and any embedded or external scripts
 * @param  {string}   docUrl        The scxml document url
 * @param  {object}   rawModule      The raw scion module created by scjson-to-module
 * @param  {object}   moduleContext Host-provided context
 * @param  {Function} cb            Callback to invoke with the compiled module or an error
 */
function compileModule(docUrl, rawModule, moduleContext, cb) {
    var promiseOffset = 2;
    var rootScripts = rawModule.rootScripts;
    var scriptCount = rootScripts.length;
    var promises = new Array(scriptCount + promiseOffset);

    for (var i = 0; i < scriptCount; i++) {
        var curScript = rootScripts[i];
        if (curScript.src) {
            curScript.src = pm.platform.url.resolve(docUrl, curScript.src);
            promises[i+promiseOffset] = fetchScript(curScript, moduleContext);
        } else {
            promises[i+promiseOffset] = new Promise(function(resolve, reject) {
                try {
                    var content = curScript.content;
                    delete curScript.content;
                    var compiledScript = pm.platform.module.compileScript(content, {
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
            var compiledModule = pm.platform.module.compileScript(rawModule.module, {
                filename: docUrl
            });

            resolve(compiledModule);
        } catch(e) {
            reject(e);
        }
    });

    promises[1] = new Promise(function(resolve, reject) {
        if (!rawModule.datamodel) {
            resolve(undefined);
        } else {
            try {
                var compiledDatamodel = pm.platform.module.compileScript(rawModule.datamodel, {
                    filename: docUrl
                });

                resolve(compiledDatamodel);
            } catch(e) {
                reject(e);
            }
        }
    })

    Promise.all(promises).then(function fetchSuccess(scripts) {
        var compiledModule = scripts.shift();
        var datamodelDecl = scripts.shift();
        var model = new SCModel(
            rawModule.name,
            datamodelDecl,
            rootScripts,
            compiledModule
        );

        cb(null, model);
    }, function fetchError(err) {
        cb(err);
    });
}

function SCModel(name, datamodel, rootScripts, scxmlModule) {
    this.name = name;
    this.datamodel = datamodel;
    this.rootScripts = rootScripts;
    this.module = scxmlModule;
}

/**
 * Prepares an scxml model for execution by binding it to an execution context
 * @param  {object} [executionContext] The execution context  (e.g. v8 VM sandbox).
 *   If not provided, a bare bones context is constructed
 * @param  {Function} cb  Callback to execute with the prepared model or an error
 *   The prepared model is a function to be passed into a SCION StateChart object
 */
SCModel.prototype.prepare = function(executionContext, cb) {
    if (!executionContext) {
        executionContext = pm.platform.module.createExecutionContext();
    }

    try {
        if (this.datamodel) {
            this.datamodel.runInContext(executionContext);
        }

        for (let i = 0, len = this.rootScripts.length; i < len; i++) {
            this.rootScripts[i].compiled.runInContext(executionContext);
        }

        let modelFn = this.module.runInContext(executionContext);
        cb(undefined, modelFn);
    } catch (e) {
        cb(e);
    }
}

function createModule(url,scJson,context,cb){
    if (pm.platform.debug) {
        console.log('scjson',JSON.stringify(scJson, undefined, 2));
        if (!context.hasOwnProperty('debug')) {
            context.debug = true;
        }
    }

    scjsonToModule(scJson, context).then(function resolved(rawModule) {
        if (pm.platform.debug && rawModule.name) {
            fs.writeFileSync('/var/tmp/' + rawModule.name + '.scion', rawModule.module);
        }

        compileModule(url, rawModule, context, cb);
    }, function rejected(err) {
        cb(err);
    });
}

module.exports = documentStringToModel;
