var xmldom = require('xmldom'),
    fs = require('fs'),
    get = require('./get'),
    pathModule = require('path'),
    Module = require('module'),
    url = require('./url');

//extend Module to support programmatic creation of modules from strings
//this ties into the implementation of eval below
Module._jsStrings = {};
Module._extensions['.jsstr'] = function(module,filename){
    var content = Module._jsStrings[filename];
    //console.log(content); 
    if(!content) throw new Error("Couldn't find string content for name",filename);
    module._compile(content,filename);
};

function parseDocumentFromString(str){
    return (new xmldom.DOMParser()).parseFromString(str);
}

function onModelCb(cb){
    return function(err,s){
        if(err){
            cb(err);
        }else{
            try {
                var doc = parseDocumentFromString(s);
                cb(null,doc);
            }catch(e){
                cb(e);
            }
        }
    };
}

exports.platform = {

    //used in parsing
    getDocumentFromUrl : function(url,cb){
        get.httpGet(url,onModelCb(cb));
    },

    parseDocumentFromString : parseDocumentFromString,

    //TODO: the callback is duplicate code. move this out.
    getDocumentFromFilesystem : function(path,cb){
        fs.readFile(path,'utf8',onModelCb(cb));
    },

    getResourceFromUrl : get.getResource,

    //used at runtime
    postDataToUrl : function(url,data,cb){
        //TODO
    },

    setTimeout : setTimeout,

    clearTimeout : clearTimeout,

    log : console.log,

    eval : function(content,name){
        var moduleContents = "module.exports = " + content + ";";
        Module._jsStrings[name] = moduleContents;
        var module = new Module(name,null);
        module.load(name); 
        return module.exports;
    },

    path : require('path'),     //same API

    url : url

};
