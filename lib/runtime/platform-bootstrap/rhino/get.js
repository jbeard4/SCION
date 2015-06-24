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
 * This contains some functions for getting stuff in Rhino.
 */

function httpGet(url){
    var urlObject = new Packages.java.net.URL(url);
    var conn = urlObject.openConnection();
    conn.setRequestMethod("GET");
    var rd = new Packages.java.io.BufferedReader(
                new Packages.java.io.InputStreamReader(
                    conn.getInputStream()));
    var line;
    var result = "";
    /*jsl:ignore*/
    while (line = rd.readLine()) {
    /*jsl:end*/
        result += line;
    }
    rd.close();
    return result;
}

//TODO
function httpPost(url,data,cb){
}

function readFile(file){
    var br = new Packages.java.io.BufferedReader(
                new Packages.java.io.InputStreamReader(
                new Packages.java.io.DataInputStream(
                new Packages.java.io.FileInputStream(file))));
    var result = "";
    var strLine;
    /*jsl:ignore*/
    while (strLine = br.readLine()){
    /*jsl:end*/
        result += strLine;
    }
    br.close();
    return result;
}

function getResource(url,cb,context){
    try {
        if(url.match(/^http(s?):/)){
            var result = httpGet(url);
            cb(null,result);
        }else{
            //assume filesystem
            result = readFile(url);
            cb(null,result);
        }
    }catch(e){
        cb(e);
    }
}

module.exports = {
    httpGet : httpGet,
    httpPost : httpPost,
    readFile : readFile,
    getResource : getResource
};
