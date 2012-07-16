var Executors = Packages.java.util.concurrent.Executors,
    InetSocketAddress = Packages.java.net.InetSocketAddress,
    Headers = Packages.com.sun.net.httpserver.Headers,
    HttpExchange = Packages.com.sun.net.httpserver.HttpExchange,
    HttpHandler = Packages.com.sun.net.httpserver.HttpHandler,
    HttpServer = Packages.com.sun.net.httpserver.HttpServer;


var scion = require('scion');

var port = 42000;
var addr = new InetSocketAddress(port);
var server = HttpServer.create(addr, 0);

var sessionCounter = 0, sessions = {}, timeouts = {}, timeoutMs = 5000;


function cleanUp(sessionToken){
    delete sessions[sessionToken];
}

function toBytes(s){
    if(typeof s === "object"){
        s = JSON.stringify(s);
    }
    return (new Packages.java.lang.String(s)).getBytes();
}

var handler = new HttpHandler({handle : function(exchange){
    var reqBody = exchange.getRequestBody();
    var bodyArr = [], c;
    while((c = reqBody.read()) !== -1){
        bodyArr.push(String.fromCharCode(c));
    } 
    var s = bodyArr.join("");
    //print("body",s);

    var responseHeaders = exchange.getResponseHeaders();
    var responseBody = exchange.getResponseBody();

    try{
        var reqJson = JSON.parse(s);
        if(reqJson.load){
            print("Loading new statechart");

            scion.urlToModel(reqJson.load,function(err,model){

                if(err){
                    exchange.sendResponseHeaders(500, 0);
                    responseBody.write(toBytes(err.message));
                }else{
                    var interpreter = new scion.SCXML(model);

                    var sessionToken = sessionCounter;
                    sessionCounter++;
                    sessions[sessionToken] = interpreter; 

                    var conf = interpreter.start(); 

                    responseHeaders.set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, 0);
                    responseBody.write(toBytes({
                        sessionToken : sessionToken,
                        nextConfiguration : conf 
                    }));

                }
                responseBody.close();

                //timeouts[sessionToken] = setTimeout(function(){cleanUp(sessionToken);},timeoutMs);  
            });
        }else if(reqJson.event && (typeof reqJson.sessionToken === "number")){
            print("sending event to statechart",JSON.stringify(reqJson.event,4,4));
            var sessionToken = reqJson.sessionToken;
            var nextConfiguration = sessions[sessionToken].gen(reqJson.event);
            responseHeaders.set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, 0);
            responseBody.write(toBytes({
                nextConfiguration : nextConfiguration
            }));

            //clearTimeout(timeouts[sessionToken]);
            //timeouts[sessionToken] = setTimeout(function(){cleanUp(sessionToken);},timeoutMs);  
        }else{
            //unrecognized. send back an error
            responseHeaders.set("Content-Type", "text/plain");
            exchange.sendResponseHeaders(400, 0);
            responseBody.write(toBytes("Unrecognized request.\n"));
        }
    }catch(e){
        print(e);
        print(e.stack);

        responseHeaders.set("Content-Type", "text/plain");
        exchange.sendResponseHeaders(500, 0);
        responseBody.write(toBytes(e.message));
    }


    responseBody.close();
}});
server.createContext("/", handler);
server.setExecutor(Executors.newCachedThreadPool());
server.start();
print("Server is listening on port " + port );

