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
    vm = require('vm'),
    url = require('./url'),
    _module = require('./module');

module.exports = {

    //used in parsing
    http : {
        get : function(url,cb){
            get.httpGet(url,cb);
        }
    },

    fs : {
        get : function(path,cb){
            fs.readFile(path,'utf8',cb);
        }
    },

    getResourceFromUrl : get.getResource,

    getScriptFromUrl: function(script, cb, context) {
        get.getResource(script.src, function(err, content) {
            if (err) {
                cb(err);
                return;
            }

            try {
                script.content = content;
                cb(undefined, content);
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

        createLocalExecutionContext : _module.createLocalExecutionContext,

        eval: _module.eval,

        /**
         * create a context in which to execute javascript
         * @param  {object} [sandbox] An object to contextify
         * @return {object} An execution context
         * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/vm.html#vm_vm_createcontext_sandbox}
         */
        createExecutionContext: function(sandbox) {
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
        }

    },

    dom : {
        serializeToString : function(){
            throw new Error('Platform method dom.serializeToString is not supported.');
            //return (new xmldom.XMLSerializer()).serializeToString(node);
        }
    },

    log : console.log

};
