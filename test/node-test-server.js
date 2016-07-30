//load statechart from scxml string; return initial state and token id

//send event to statechart with tokenid
//clean up statechart

var scxml = require('..'),
    http = require('http');

var sessionCounter = 0, sessions = {}, timeouts = {}, timeoutMs = 5000;

var PORT = process.env.PORT || 42000;

function loadScxml(scxmlStr){
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
        var sessionToken;
        try{
            var reqJson = JSON.parse(s);
            if(reqJson.load){
                scxml.urlToModel(reqJson.load,function(err,model){
                    //console.log('model',model);
                    if(err){
                        console.error(err.stack);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err.message);
                    }else{
                        try {
                            model.prepare(undefined, function(err, fnModel) {
                                if (err) {
                                    console.error('model preparation error: ' + err);
                                    res.writeHead(500, {'Content-Type': 'text/plain'});
                                    res.end(err.message);
                                    return;
                                }

                                var interpreter = new scxml.scion.Statechart(fnModel, { sessionid: sessionCounter });

                                var sessionToken = sessionCounter;
                                sessionCounter++;
                                sessions[sessionToken] = interpreter; 

                                var conf = interpreter.start(); 

                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({
                                    sessionToken : sessionToken,
                                    nextConfiguration : conf
                                }));

                                // TODO: timeout should be kicked off before fetch/compilation/preparation
                                timeouts[sessionToken] = setTimeout(function(){cleanUp(sessionToken);},timeoutMs);  
                            });
                        } catch(e) {
                          console.log(e.stack);
                          console.log(e);
                          res.writeHead(500, {'Content-Type': 'text/plain'});
                          res.end(e.message);
                        }
                    }
                });

            }else if(reqJson.event && (typeof reqJson.sessionToken === "number")){
                console.log("sending event to statechart",reqJson.event);
                sessionToken = reqJson.sessionToken;
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
            console.error(e.stack);
            console.error(e);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(e.message);
        }
    });
}).listen(PORT, '127.0.0.1');

console.log('listening on port ' + PORT);
