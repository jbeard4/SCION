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
//tested on node xmldom, rhino JDK 6 native DOM, and various browser DOMs (Firefox, Chrome, IE6+)

function getItem(nodeList,index){
    return "item" in nodeList ? nodeList.item(index) : nodeList[index];
} 

//fixme: may need to wrap APIs that return strings in String constructor for Java

module.exports = {
    getItem : getItem, 

    localName : function(node){
        return String(node.localName || node.tagName);
    },

    getAttribute : function(node,attribute){
        return String(node.getAttribute(attribute));  
    },

    namespaceURI : function(node){
        return String(node.namespaceURI);
    },

    textContent : function(node,txt){
        if(txt === undefined){
            if(node.nodeType === 1){
                //element node
                if(node.textContent){
                    return String(node.textContent);
                }else{
                    //combine his text node children
                    return this.filter(node,function(c){return c.nodeType === 3;}).  //textNode
                                map(function(c){return c.data;}).join("");
                }
            }else if(node.nodeType === 3){
                //textnode
                return node.data;
            }
            return "";
        }else{
            if(node.nodeType === 1){
                //element node
                if(node.textContent !== undefined){
                    return String(node.textContent = txt);
                }else{
                    //clear out existing child nodes
                    this.forEach(node,function(c){node.removeChild(c);});
                    var tn = node.ownerDocument.createTextNode(txt);
                    node.appendChild(tn);
                    return txt;
                }
            }else if(node.nodeType === 3){
                //textnode
                return node.data = txt;
            }
        }
    },

    getElementChildren : function(node){
        return this.filter(node,function(child){
            return child.nodeType === 1;    //element
        });
    },

    forEach : function(elem,fn){
        for (var i=0; i<elem.childNodes.length; i++) {
            fn(getItem(elem.childNodes,i));
        }
    },

    filter : function(elem,fn){
        var r = [];
        for (var i=0; i<elem.childNodes.length; i++) {
            var o = getItem(elem.childNodes,i);
            if(fn(o)){r.push(o);}
        }

        return r;
    },

    map : function(elem,fn){
        var r = [];
        for (var i=0; i<elem.childNodes.length; i++) {
            r.push(fn(getItem(elem.childNodes,i)));
        }

        return r;
    }
};
