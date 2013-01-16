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

var xmldom = require('xmldom'),
    fs = require('fs'),
    get = require('./get'),
    pathModule = require('path'),
    url = require('./url'),
    vm = require('vm');

function parseDocumentFromString(str){
    return (new xmldom.DOMParser()).parseFromString(str);
}

function onModelCb(cb){
    return function(err,s){
        if(err){
            cb(err);
        }else{
            try {
                var doc = parseDocumentFromString(s);
                cb(null,doc);
            }catch(e){
                cb(e);
            }
        }
    };
}

exports.platform = {

    //used in parsing
    getDocumentFromUrl : function(url,cb){
        get.httpGet(url,onModelCb(cb));
    },

    parseDocumentFromString : parseDocumentFromString,

    //TODO: the callback is duplicate code. move this out.
    getDocumentFromFilesystem : function(path,cb,context){
        fs.readFile(path,'utf8',onModelCb(cb));
    },

    getResourceFromUrl : get.getResource,

    //used at runtime
    postDataToUrl : function(url,data,cb){
        //TODO
    },

    setTimeout : setTimeout,

    clearTimeout : clearTimeout,

    log : console.log,

    eval : function(content,name){
        function cloneGlobal(){
            var o = {};
            for(var k in global){
                o[k] = global[k];
            }
            return o;
        }
        //we clone the global object to try to create as familiar an execution environment as possible
        return vm.runInNewContext('(' + content + ');', cloneGlobal(), name);
    },

    path : require('path'),     //same API

    url : url,
    dom : require('./dom')

};
