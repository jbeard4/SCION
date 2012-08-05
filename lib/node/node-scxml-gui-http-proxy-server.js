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

/*
 * This utility exists to provide a nice HTTP front-end to send state change
 * events from the node-listener-client or browser-listener-client to the
 * scxmlgui tcp server. this allows nice debugging in a graphical environment
 * of SCXML executing in SCION.
 */

var http = require('http'),
    url = require('url'),
    net = require('net');

var args = process.argv.slice(2);

//server port
var httpServerPort = args[0] || 1337;

//scxmlgui listener port
var scxmlGuiTCPHost = args[1] || "localhost";
var scxmlGuiTCPPort = parseInt(args[2],10) || 9999;


//start up listener
var serviceSocket = new net.Socket();

serviceSocket.connect(scxmlGuiTCPPort, scxmlGuiTCPHost, function() {
    //TODO: something goes here
});

serviceSocket.on("error", function (e) {
    console.log("Could not connect to service at host " + scxmlGuiTCPHost + ', port ' + scxmlGuiTCPPort );
    if(httpServer) httpServer.close();
});

serviceSocket.on("data", function(data) {
    //the communications protocol is one-way, so we don't expect or do anything with this
    console.log("received data from scxmlGUI socket",data);
});

serviceSocket.on("close", function(had_error) {
    console.log("scxmlGUI socket closed unexpectedly");
    if(httpServer) httpServer.close();
});


var httpServer = http.createServer(function (req, res) {
    //expect url of the form:
        //onEntry?id=<id>
        //onExit?id=<id>
        //onTransition?source=<id>&targets=<id1>,<id2>,...

    var parsedUrl = url.parse(req.url, true);

    switch(parsedUrl.pathname){
        case "/onEntry":
            serviceSocket.write("1 " + parsedUrl.query.id + "\n");
            break;
        case "/onExit":
            serviceSocket.write("0 " + parsedUrl.query.id + "\n");
            break;
        case "/onTransition":
            //TODO: this
            //parsedUrl.query.targets = parsedUrl.query.targets.split(",");
            break;
        default : 
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Unable to understand request\n');
            return;
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Request processed\n');
}).listen(httpServerPort);
