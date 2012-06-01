var scxml = require('../core/scxml/SCXML'),
    JsonML = require('../external/jsonml/jsonml-dom'),
    annotator = require('../core/util/annotate-scxml-json'),
    json2model = require('../core/scxml/json2model');

//import node modules
var http = require('http'),
    urlM = require('url'),
    fs = require('fs'),
    xmldom = require('xmldom');

function urlToModel(url,cb){
    var options = urlM.parse(url); 

    http.get(options, function(res) {
        var s = "";
        res.on('data',function(d){
            s += d;
        });
        res.on('end',function(){
            var doc = documentStringToModel(s);
            cb(null,doc);
        });
    }).on('error', function(e) {
        cb(e);
    });
}

function pathToModel(path,cb){
    fs.readFile(path,function(err,s){
        if(err){
            cb(err);
        }else{
            var doc = documentStringToModel(s);
            cb(null,doc);
        }
    },'utf8');
}

function parseDocumentString(s){
    return (new xmldom.DOMParser()).parseFromString(s);
}

function documentStringToModel(s){
    return documentToModel(parseDocumentString(s));
}

//TODO: move this out, as it is shared code
function documentToModel(doc){
    var arr = JsonML.parseDOM(doc);
    var scxmlJson = arr[1];

    var annotatedScxmlJson = annotator.transform(scxmlJson);

    var model = json2model(annotatedScxmlJson); 

    return model;
}

//setup environment
scxml.SimpleInterpreter.prototype._setTimeout = setTimeout;
scxml.SimpleInterpreter.prototype._clearTimeout = clearTimeout;
scxml.SimpleInterpreter.prototype._log = console.log;

module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter
};
