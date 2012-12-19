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

//a small DOM helper/compatibility layer

module.exports = {

    getChildren : function(node){
        return Array.prototype.slice.call(node.childNodes);
    },

    localName : function(node){
        return node.localName;
    },

    getAttribute : function(node,attribute){
        return node.getAttribute(attribute);  
    },

    hasAttribute : function(node,attribute){
        return node.hasAttribute(attribute);
    },

    namespaceURI : function(node){
        return node.namespaceURI;
    },

    createElementNS : function(doc,ns,localName){
        return doc.createElementNS(ns,localName); 
    },

    setAttribute : function(node,name,value){
        return node.setAttribute(name,value);
    },

    appendChild : function(parent,child){
        return parent.appendChild(child);
    },

    textContent : function(node,txt){
        if(txt === undefined){
            if(node.nodeType === 1){
                //element
                if(node.textContent !== undefined){
                    return node.textContent;
                }else{
                    //IE
                    return this.getChildren(node).
                                map(function(textNode){return this.textContent(textNode);},this).join("");
                }
            }else if(node.nodeType === 3 || node.nodeType === 4){
                //textnode
                return node.data;
            }
            return "";
        }else{
            if(node.nodeType === 1){
                //element node
                if(node.textContent !== undefined){
                    return node.textContent = txt;
                }else{
                    //IE
                    var textNode = node.ownerDocument.createTextNode(txt);
                    node.appendChild(textNode); 
                    return txt;
                }
            }else if(node.nodeType === 3){
                //textnode
                return node.data = txt;
            }
        }
    },

    getElementChildren : function(node){
        return this.getChildren(node).filter(function(c){return c.nodeType === 1;});
    }

};
