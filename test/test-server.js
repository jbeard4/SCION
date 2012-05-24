//load statechart from scxml string; return initial state and token id

//send event to statechart with tokenid
//clean up statechart

var xml2jsonml = require('xml2jsonml'),
    scion = require('../lib/core/scion'),
    http = require('http');

var sessionCounter = 0, sessions = {}, timeouts = {}, timeoutMs = 5000;

function loadScxml(scxmlStr,cb){
    xml2jsonml.parseString(scxmlStr,function(err,scxmlJson){
        if(err){
            throw err;
        }

        //console.log(JSON.stringify(scxmlJson,4,4));

        var annotatedScxmlJson = scion.annotator.transform(scxmlJson);
        var model = scion.json2model(annotatedScxmlJson); 
        var interpreter = new scion.scxml.NodeInterpreter(model);
        interpreter.start();

        var sessionToken = sessionCounter;
        sessionCounter++;
        sessions[sessionToken] = interpreter; 

        cb(sessionToken,interpreter);
    });
}

function cleanUp(sessionToken){
    delete sessions[sessionToken];
}

http.createServer(function (req, res) {
    //TODO: set a timeout to clean up if we don't hear back for a while
    var s = "";
    req.on("data",function(data){
        s += data;
    });
    req.on("end",function(){
        try{
            var reqJson = JSON.parse(s);
            if(reqJson.load){
                console.log("Loading new statechart");
                loadScxml(reqJson.load,function(sessionToken,interpreter){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        sessionToken : sessionToken,
                        nextConfiguration : interpreter.getConfiguration()
                    }));

                    timeouts[sessionToken] = setTimeout(function(){cleanUp(sessionToken);},timeoutMs);  
                });
            }else if(reqJson.event && (typeof reqJson.sessionToken === "number")){
                console.log("sending event to statechart",reqJson.event);
                var sessionToken = reqJson.sessionToken;
                var nextConfiguration = sessions[sessionToken].gen(reqJson.event);
                console.log('nextConfiguration',nextConfiguration);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    nextConfiguration : nextConfiguration
                }));

                clearTimeout(timeouts[sessionToken]);
                timeouts[sessionToken] = setTimeout(function(){cleanUp(sessionToken);},timeoutMs);  
            }else{
                //unrecognized. send back an error
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end("Unrecognized request.\n");
            }
        }catch(e){
            console.error(e);
            console.error(e.stack);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(e.message);
        }
    });
}).listen(42000, '127.0.0.1');

