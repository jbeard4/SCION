/**
 * This module implements the standard API for "blessed environments" for node.js
 */

var scxml = require('../core/scxml/SCXML'),
    documentToModel = require('../core/util/jsonml-to-model'),
    get = require('./get');

//curry the platform getResource
function nodeDocumentToModel(doc,cb){
    documentToModel(get.getResource,doc,cb); 
}

//import node modules
var xmldom = require('xmldom'),
    fs = require('fs');

function urlToModel(url,cb){
    get.httpGet(url,function(s){
        var doc = documentStringToModel(s);
        cb(doc);
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

function documentStringToModel(s,cb){
    nodeDocumentToModel(parseDocumentString(s),cb);
}

//setup environment
scxml.SimpleInterpreter.prototype._setTimeout = setTimeout;
scxml.SimpleInterpreter.prototype._clearTimeout = clearTimeout;
scxml.SimpleInterpreter.prototype._log = console.log;

module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : nodeDocumentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter
};

