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

var get = require('./get'),
    path = require('./path'),
    urlModule = require('./url');

function getDb(){
    var dbf = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
    dbf.setNamespaceAware(true);
    return dbf.newDocumentBuilder();
}

module.exports = {

    //used in parsing
    http : {
        get : function(url,cb,context){
            try {
                var doc = getDb().parse(url);
                cb(null,doc);
            }catch(e){
                cb(e);
            }
        }
    },

    fs : {
        get : function(url,cb,context){
            this.getDocumentFromUrl(url,cb,context);
        }
    },

    getResourceFromUrl : get.getResource,

    url : {
        resolve : function(baseUrl,targetUrl){
            var documentUrlPath = urlModule.getPathFromUrl(baseUrl);
            var documentDir = path.dirname(documentUrlPath);
            var scriptPath = path.join(documentDir,targetUrl);
            var newUrl = urlModule.changeUrlPath(baseUrl,scriptPath);
            return newUrl;
        }
    },

    dom : {
        serializeToString : function(node){
            var baos = new Packages.java.io.ByteArrayOutputStream();
            var serializer = new Packages.org.apache.xml.serialize.XMLSerializer(
                        baos,
                        new Packages.org.apache.xml.serialize.OutputFormat());

            serializer.asDOMSerializer().serialize(node);

            var toReturn = String(new Packages.java.lang.String(baos.toByteArray()));
            return toReturn;
        }
    },

    log : function(){
        for(var i=0; i < arguments.length; i++){
            Packages.java.lang.System.out.println(String(arguments[i]));
        }
    }
};
