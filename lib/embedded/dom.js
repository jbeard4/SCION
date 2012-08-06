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

    namespaceURI : function(node){
        return node.namespaceURI;
    },

    textContent : function(node,txt){
        if(txt === undefined){
            if(node.nodeType === 1){
                //element
                return node.textContent;
            }else if(node.nodeType === 3){
                //textnode
                return node.data;
            }
            return "";
        }else{
            if(node.nodeType === 1){
                //element node
                return node.textContent = txt;
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
