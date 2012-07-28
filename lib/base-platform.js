var xmldom = require('./external/xmldom/dom-parser');

function parseDocumentFromString(str){
    return (new xmldom.DOMParser()).parseFromString(str);
}

//most shells will also at least be able to implement: getDocumentFromFilesystem and log 

exports.platform = {
    parseDocumentFromString : parseDocumentFromString
};
