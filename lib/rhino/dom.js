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

var baseDom = require('../base-platform/dom');

var dom = Object.create(baseDom);

dom.getChildren = function(node){
    var toReturn = [];
    for(var i = 0; i < node.childNodes.length; i++){
        toReturn.push(node.childNodes.item(i));
    }
    return toReturn;
};

["localName","getAttribute","namespaceURI","textContent"].forEach(function(methodName){
    //pass through to baseDom, but convert return values to js strings.
    //would be nice if I could just refer to this.__proto__, rather than use a closure, 
    //but that's what happens when you use anonymous objects for everything, rather than objects created with constructor functions
    var f = baseDom[methodName];
    dom[methodName] = function(){
        return String(f.apply(this,arguments));
    };
});


dom.serializeToString = function(node){
    var baos = new Packages.java.io.ByteArrayOutputStream();
    var serializer = new Packages.org.apache.xml.serialize.XMLSerializer(
                baos,
                new Packages.org.apache.xml.serialize.OutputFormat());

    serializer.asDOMSerializer().serialize(node);

    var toReturn = String(new Packages.java.lang.String(baos.toByteArray()));
    return toReturn;
};

module.exports = dom;
