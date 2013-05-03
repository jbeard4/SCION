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

var url = require('./url'),
    path = require('./path');

//browser mostly just inherits path from basePlatform
var platform = module.exports = {

    /** @expose */
    ajax : window.jQuery,   //this can be overridden

    /** @this {platform} */
    http : {
        get : function(url,cb,context){
            platform.ajax.get(url,function(r){
                cb(null,r);
            }).error(function(e){
                cb(e);
            });
        }
    },

    /** @this {platform} */
    fs : {
        get : function(url,cb,context){
            this.getDocumentFromUrl(url,cb,context);
        }
    },

    module : {
        eval : function(s,fileName,context){
            return eval(s);     //pretty simple
        }
    },

    /** @this {platform} */
    getResourceFromUrl : function(url,cb,context){
        this.http.get.apply(this,arguments);
    },

    url : {
        resolve : function(baseUrl,targetUrl){
            var documentUrlPath = url.getPathFromUrl(baseUrl);
            var documentDir = path.dirname(documentUrlPath);
            var scriptPath = path.join(documentDir,targetUrl);
            var newUrl = url.changeUrlPath(baseUrl,scriptPath);
            return newUrl; 
        }
    },

    dom : {
        serializeToString : function(node){
            return node.xml || (new window.XMLSerializer()).serializeToString(node);
        }
    }

};
