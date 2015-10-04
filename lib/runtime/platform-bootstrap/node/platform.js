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

    path : require('path'),     //same API

    url : {
        resolve : url.resolve
    },

    module : {
        eval : function(s,fileName,context){

            context = context || {};
            fileName = fileName || '';

            var ctx = vm.createContext(global);

            ctx.require = 
                context.require ||                      //user-specified require
                    (require.main &&                    //main module's require
                        require.main.require &&
                        require.main.require.bind(require.main)) ||     
                    require;                            //this module's require

            //set up default require and module.exports
            Object.keys(context.customRuntimeGlobals || {}).forEach(function(k){
              ctx[k] = context.customRuntimeGlobals[k];
            });

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
