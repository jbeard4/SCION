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
            if(res.statusCode === 200){
                cb(null,s);
            }else{
                cb(new Error('HTTP code ' + res.statusCode + ' : ' + s));
            }
        });
    }).on('error', function(e) {
        cb(e);
    });
}

//TODO: write a little httpPost abstraction
function httpPost(url,data,cb){
}

function getResource(url,cb,context){
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
