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

var util = require('../core/util/util');

//browser mostly just inherits path from basePlatform
exports.platform = {

    /** @expose */
    ajax : window.jQuery,   //this can be overridden

    //used in parsing
    eval : require('../base-platform/eval'),

    /** @this {platform} */
    getDocumentFromUrl : function(url,cb,context){
        this.ajax.get(url,function(r){
            cb(null,r);
        },"xml").error(function(e){
            cb(e);
        });
    },

    parseDocumentFromString : function(str){
        return (new window.DOMParser()).parseFromString(str,"application/xml");
    },

    /** @this {platform} */
    getDocumentFromFilesystem : function(url,cb,context){
        this.getDocumentFromUrl(url,cb,context);
    },

    //TODO: the callback is duplicate code. move this out.
    /** @this {platform} */
    getResourceFromUrl : function(url,cb,context){
        this.ajax.get(url,function(r){
            cb(null,r);
        }).error(function(e){
            cb(e);
        });
    },

    //used at runtime
    /** @this {platform} */
    postDataToUrl : function(url,data,cb){
        //by default, assume jQuery loaded
        this.ajax.post(url,data,function(r){
            cb(null,r);
        }).error(function(e){
            cb(e);
        });
    },

    setTimeout : function(f,d){
        return window.setTimeout(f,d);
    },

    clearTimeout : function(timeoutId){
        window.clearTimeout(timeoutId);
    },

    log : window.console && window.console.log && (window.console.log.bind ? window.console.log.bind(window.console) : window.console.log),

    path : require('../base-platform/path'),

    url : require('./url'),
    dom : require('./dom')

};
