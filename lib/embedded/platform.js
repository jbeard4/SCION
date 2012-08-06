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

//this provides an incomplete base platform implementation
//other platform implementations can optionally extend it. 

function parseDocumentFromString(str){
    var xmldom = require('../../external/xmldom/dom-parser');
    return (new xmldom.DOMParser()).parseFromString(str);
}

//most shells will also at least be able to implement: getDocumentFromFilesystem and log 

exports.platform = {
    parseDocumentFromString : parseDocumentFromString,

    eval : function(content,name){
        //JScript doesn't return functions from evaled function expression strings, 
        //so we wrap it here in a trivial self-executing function which gets eval'd
        return eval('(function(){\nreturn ' + content + ';})()');
    },

    path : require('./path'),

    url : require('./url'),

    dom : require('./dom')
    
};
