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
    });
}

function documentStringToModel(s){
    var dp = new xmldom.DOMParser();
    console.log(s);
    var doc = dp.parseFromString(s);
    console.log( (new xmldom.XMLSerializer()).serializeToString(doc) );

    return documentToModel(doc);
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
    SCXML : scxml.SimpleInterpreter
};
