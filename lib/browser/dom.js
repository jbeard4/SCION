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

function getItem(nodeList,index){
    return "item" in nodeList ? nodeList.item(index) : nodeList[index];
} 

var dom = Object.create(baseDom);

dom.hasAttribute = function(node,attribute){
    return node.hasAttribute ? node.hasAttribute(attribute) : node.getAttribute(attribute);
};

dom.localName = function(node){
    return node.localName || node.tagName;
};

dom.createElementNS = function(doc,ns,localName){
    return doc.createElementNS ? doc.createElementNS(ns,localName) : doc.createElement(localName);
};

dom.getChildren = function(node){
    var toReturn = [];
    for(var i = 0; i < node.childNodes.length; i++){
        toReturn.push(getItem(node.childNodes,i));
    }
    return toReturn;
};

dom.serializeToString = function(node){
    return node.xml || (new XMLSerializer()).serializeToString(node);
};

module.exports = dom;
