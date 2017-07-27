//load statechart from scxml string; return initial state and token id

//send event to statechart with tokenid
//clean up statechart

const scxml = require('..'),
      http = require('http');

var sessionCounter = 1, sessions = {}, timeouts = {}, timeoutMs = 5000, sessionRegistry = new Map();

const PORT = process.env.PORT || 42000;
const TEST_ASYNC = typeof process.env.TEST_ASYNC !== 'undefined';

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
                    if(err){
                        console.error(err.stack);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err.message);
                    }else{
                        try {
                            model.prepare(function(err, fnModel) {
                                if (err) {
                                    console.error('model preparation error: ' + err, err.stack);
                                    res.writeHead(500, {'Content-Type': 'text/plain'});
                                    res.end(err.message);
                                    return;
                                }

                                var interpreter = new scxml.scion.Statechart(fnModel, { 
                                  sessionid: sessionCounter,
                                  sessionRegistry : sessionRegistry,
                                  sendAsync : TEST_ASYNC 
                                });

                                var sessionToken = sessionCounter;
                                sessionCounter++;
                                sessions[sessionToken] = interpreter; 

                                if(TEST_ASYNC){
                                  interpreter.startAsync(startCb); 
                                }else{
                                  try { 
                                    let conf = interpreter.start(); 
                                    startCb(null, conf);
                                  } catch (err){
                                    startCb(err);
                                  }
                                }
                                function startCb(err, conf){
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify({
                                        sessionToken : sessionToken,
                                        nextConfiguration : conf
                                    }));

                                    // TODO: timeout should be kicked off before fetch/compilation/preparation
                                    timeouts[sessionToken] = setTimeout(function(){
                                      cleanUp(sessionToken);
                                    },timeoutMs);  
                                }
                            }, {console : console}, {writeModuleToDisk : true});
                        } catch(e) {
                          console.log(e.stack);
                          console.log(e);
                          res.writeHead(500, {'Content-Type': 'text/plain'});
                          res.end(e.message);
                        }
                    }
                }, {deferCompilation : false});

            }else if(reqJson.event && (typeof reqJson.sessionToken === "number")){
                sessionToken = reqJson.sessionToken;
                let interpreter = sessions[sessionToken];
                let event = reqJson.event;
                if(TEST_ASYNC){
                  interpreter.genAsync(event, genCb); 
                }else{
                  try { 
                    let conf = interpreter.gen(event); 
                    genCb(null, conf);
                  } catch (err){
                    genCb(err);
                  }
                }
                function genCb(err, nextConfiguration){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        nextConfiguration : nextConfiguration
                    }));

                    clearTimeout(timeouts[sessionToken]);
                    timeouts[sessionToken] = setTimeout(function(){cleanUp(sessionToken);},timeoutMs);  
                }
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
}).listen(PORT, function(){
  console.log("Express server listening on port " + PORT);
});

console.log('listening on port ' + PORT);
