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
        return eval('(function(){\nreturn ' + content + '\n};)()');
    },

    path : require('./path'),

    url : require('./url')
    
};
