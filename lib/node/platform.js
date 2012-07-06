var xmldom = require('xmldom'),
    fs = require('fs'),
    get = require('./get');

function parseDocumentFromString(str){
    return (new xmldom.DOMParser()).parseFromString(str);
}

module.exports = {

    //used in parsing
    getDocumentFromUrl : function(url,cb){
        get.httpGet(url,function(err,s){
            if(err){
                cb(err);
            }else{
                try {
                    var doc = this.parseDocumentFromString(s);
                    cb(null,doc);
                }catch(e){
                    cb(e);
                }
            }
        });
    },

    parseDocumentFromString : parseDocumentFromString,

    //TODO: the callback is duplicate code. move this out.
    getDocumentFromFilesystem : function(path,cb){
        fs.readFile(path,function(err,s){
            if(err){
                cb(err);
            }else{
                try{
                    var doc = parseDocumentFromString(s);
                    cb(null,doc);
                }catch(e){
                    cb(e);
                }
            }
        },'utf8');
    },

    getResourceFromUrl : get.getResource,

    //used at runtime
    postDataToUrl : function(url,data,cb){
        //TODO
    },

    setTimeout : setTimeout,

    clearTimeout : clearTimeout,

    log : console.log
};

