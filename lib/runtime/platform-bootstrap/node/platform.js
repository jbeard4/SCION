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

var fs = require('fs'),
    get = require('./get'),
    pathModule = require('path'),
    vm = require('vm'),
    url = require('./url'),
    Module = require('module');

module.exports = {

    //used in parsing
    http : {
        get : function(url,cb){
            get.httpGet(url,cb);
        }
    },

    fs : {
        get : function(path,cb,context){
            fs.readFile(path,'utf8',cb);
        }
    },

    getResourceFromUrl : get.getResource,

    getScriptFromUrl: function(url, cb, context, scriptInfo) {
        get.getResource(url, function(err, content) {
            if (err) {
                cb(err);
                return;
            }

            if (typeof scriptInfo.$wrap === 'function') {
                content = scriptInfo.$wrap(content);
            }

            var options = Object.assign({filename: url}, scriptInfo);
            try {
                var script = new vm.Script(content, options);
                cb(undefined, script);
            } catch (e) {
                cb(e);
            }
        }, context);
    },

    path : require('path'),     //same API

    url : {
        resolve : url.resolve
    },

    module : {
        createLocalExecutionContext(docPath, sandbox) {
            if (!sandbox) {
                sandbox = {console: console};
                sandbox.global = sandbox;
            }

            var ctx = vm.createContext(sandbox);

            ctx.__filename = docPath;
            ctx.__dirname = pathModule.dirname(ctx.__filename);

            //set it up so that require is relative to file
            var _module = ctx.module = new Module(docPath);
            var _require = ctx.require = function(path) {
                return Module._load(path, _module, true);
            };
            _module.filename = ctx.__filename;
            _require.paths = _module.paths = Module._nodeModulePaths(process.cwd());
            _require.resolve = function(request) {
                return Module._resolveFilename(request, _module);
            };

            return ctx;
        },

        /**
         * create a context in which to execute javascript
         * @param  {object} [sandbox] An object to contextify
         * @return {object} An execution context
         * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/vm.html#vm_vm_createcontext_sandbox}
         */
        createExecutionContext: function(sandbox, hostContext) {
            return vm.createContext(sandbox);
        },

        /**
         * Create a compiled script object
         * @param  {string} src     The js source to compile
         * @param  {object} options compilation options
         * @param  {string} options.filename The path to the file associated with the source
         * @param  {number} options.lineOffset The offset to the line number in the scxml document
         * @param  {number} options.columnOffset The offset to the column number in the scxml document
         * @return {Script} A Script object which implements a runInContext method
         * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/vm.html#vm_class_script}
         */
        compileScript: function(src, options) {
            return new vm.Script(src, options);
        },

        eval : function(s,fileName,context){

            context = context || {};
            fileName = fileName || '';

            //TODO: if filename starts with 'http', substitute a default require

            // https://247inc.atlassian.net/browse/OMNI-3
            // create an isolated sandbox per session
            var sandbox = {};
            sandbox.global = sandbox;
            var ctx = vm.createContext(sandbox);

            if(context.isLoadedFromFile){
                ctx.__filename = fileName;
                ctx.__dirname = pathModule.dirname(ctx.__filename);

                //set it up so that require is relative to file
                var _module = ctx.module = new Module(fileName);
                var _require = ctx.require = function(path) {
                    return Module._load(path, _module, true);
                };
                _module.filename = ctx.__filename;
                _require.paths = _module.paths = Module._nodeModulePaths(process.cwd());
                _require.resolve = function(request) {
                    return Module._resolveFilename(request, _module);
                };

            }else{
                //otherwise (e.g., loaded via http, or from document string), choose a sensible default
                ctx.require =
                    context.require ||                      //user-specified require
                        (require.main &&                    //main module's require
                            require.main.require &&
                            require.main.require.bind(require.main)) ||
                        require;                            //this module's require
            }

            //set up default require and module.exports
            return vm.runInContext(s,ctx,fileName);
        }
    },

    dom : {
        serializeToString : function(node){
            throw new Error('Platform method dom.serializeToString is not supported.');
            //return (new xmldom.XMLSerializer()).serializeToString(node);
        }
    },

    log : console.log

};
