//TODO: default send implementation
//TODO: default script
//TODO: anything else platform dependent in the interpreter

//construct can take path, url, doc, or model

var scxml = require('../core/scxml/SCXML'),
    JsonML = require('../external/jsonml/jsonml-dom'),
    annotator = require('../core/util/annotate-scxml-json'),
    json2model = require('../core/scxml/json2model');

function urlToModel(url,cb){
    window.jQuery.get(url,function(doc){
        cb(null,documentToModel(doc));
    },"xml").error(function(e){
        cb(e);
    });
}

function parseDocumentString(s){
    return (new window.DOMParser()).parseFromString(s,"application/xml");
}

function documentStringToModel(s){
    return documentToModel(parseDocumentString(s));
}

function documentToModel(doc){
    var arr = JsonML.parseDOM(doc);
    var scxmlJson = arr[1];

    var annotatedScxmlJson = annotator.transform(scxmlJson);

    var model = json2model(annotatedScxmlJson); 

    return model;
}

//setup environment
scxml.SimpleInterpreter.prototype._setTimeout = function(callback, timeout) {
    return window.setTimeout(callback, timeout);
};

scxml.SimpleInterpreter.prototype._clearTimeout = function(timeoutId) {
    return window.clearTimeout(timeoutId);
};

scxml.SimpleInterpreter.prototype._log = window.console.log || function(){};

module.exports = {
    pathToModel : urlToModel,   //alias pathToModule to urlToModel for browser
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter
};
