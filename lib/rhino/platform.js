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

var timeout = require('./timeout'),
    get = require('./get'),
    path = require('./path'),
    urlModule = require('./url');

function getDb(){
    var dbf = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
    dbf.setNamespaceAware(true);
    return dbf.newDocumentBuilder();
}

exports.platform = {

    //used in parsing
    getDocumentFromUrl : function(url,cb,context){
        try {
            var doc = getDb().parse(url);
            cb(null,doc);
        }catch(e){
            cb(e);
        }
    },

    parseDocumentFromString : function(str){
        var db = getDb();
        var is = new Packages.org.xml.sax.InputSource();
        is.setCharacterStream(new Packages.java.io.StringReader(str));

        return db.parse(is);
    },

    getDocumentFromFilesystem : function(url,cb,context){
        this.getDocumentFromUrl(url,cb,context);
    },

    getResourceFromUrl : get.getResource,

    //used at runtime
    postDataToUrl : function(url,data,cb){
        //TODO
    },

    setTimeout : timeout.setTimeout,

    clearTimeout : timeout.clearTimeout,

    log : function(){
        for(var i=0; i < arguments.length; i++){
            Packages.java.lang.System.out.println(String(arguments[i]));
        }
    },

    eval : function(content,name){
        //Set up execution context.
        var rhinoContext = Packages.org.mozilla.javascript.ContextFactory.getGlobal().enterContext();

        return rhinoContext.evaluateString(this, "(" + content + ")", name, 0, null);
    },

    path : path,
    url : urlModule ,
    dom : require('./dom')
};
