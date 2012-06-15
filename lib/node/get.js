/**
 * This module contains some utility functions for getting stuff in node.js.
 */

var http = require('http'),
    urlM = require('url'),
    fs = require('fs');

function httpGet(url,cb){
    var options = urlM.parse(url); 
    http.get(options, function(res) {
        var s = "";
        res.on('data',function(d){
            s += d;
        });
        res.on('end',function(){
            cb(null,s);
        });
    }).on('error', function(e) {
        cb(e);
    });
}

//TODO: write a little httpPost abstraction
function httpPost(url,data,cb){
}

function getResource(url,cb){
    var urlObj = urlM.parse(url); 
    if(urlObj.protocol === 'http:' || url.protocol === 'https:'){
        httpGet(url,cb);
    }else if(!urlObj.protocol){
        //assume filesystem
        fs.readFile(url,'utf8',cb);
    }else{
        //pass in error for unrecognized protocol
        cb(new Error("Unrecognized protocol"));
    }
}

module.exports = {
    getResource : getResource,
    httpGet : httpGet,
    httpPost : httpPost
};
