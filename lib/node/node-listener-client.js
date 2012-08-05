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

var http = require('http');

function HTTPClientListener(options){
    this.options = options;

    var agent = new http.Agent();
    agent.maxSockets = 1;     //serialize all requests

    this.defaultOptions = {
        host : "localhost",
        port : "1337",
        agent : agent 
    };

}

function extend(o){
    for(var i = 1; i < arguments.length; i++){
        for(var k in arguments[i]){
            var v = arguments[i][k];
            o[k] = v;
        }
    }
}

HTTPClientListener.prototype = {
    onEntry : function(id){
        http.get(extend(
            { path : "/onEntry?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                //ignore the result
            });
    },
    onExit : function(id){
        http.get(extend(
            { path : "/onExit?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                //ignore the result
            });
    },
    onTransition : function(sourceId,targetIds){
        //TODO
    }
};

module.exports = HTTPClientListener;
