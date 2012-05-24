var Executors = Packages.java.util.concurrent.Executors,
    InetSocketAddress = Packages.java.net.InetSocketAddress,
    Headers = Packages.com.sun.net.httpserver.Headers,
    HttpExchange = Packages.com.sun.net.httpserver.HttpExchange,
    HttpHandler = Packages.com.sun.net.httpserver.HttpHandler,
    HttpServer = Packages.com.sun.net.httpserver.HttpServer;


var scion = require('core/scion'),
    console = require('rhino/util/console'),    //define global console
    xml2jsonml = require('rhino/util/xml2jsonml');

var port = 42000;
var addr = new InetSocketAddress(port);
var server = HttpServer.create(addr, 0);

var sessionCounter = 0, sessions = {}, timeouts = {}, timeoutMs = 5000;

function createModelFromString(str){


    var doc = xml2jsonml.loadDOMFromString(str);
    var scxmlJson = xml2jsonml.xmlDocToJsonML(doc); 
    //console.log("scxmlJson",JSON.stringify(scxmlJson,4,4));

    //3. annotate jsonml
    var annotatedScxmlJson = scion.annotator.transform(scxmlJson);
    //console.log("annotatedScxmlJson",JSON.stringify(annotatedScxmlJson,4,4));

    //4. Convert the SCXML-JSON document to a statechart object model. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as js functions, and does some validation for correctness. 
    var model = scion.json2model(annotatedScxmlJson); 
    //console.log("model",model);

    return model;

}

function loadScxml(scxmlStr,cb){
    //TODO: change this to use rhino-specific way
    //FIXME: how do we parse a document from a string in Java?
    
    var model = createModelFromString(scxmlStr);
    var interpreter = new scion.scxml.SimpleInterpreter(model,{log : console.log});

    interpreter.start();

    var sessionToken = sessionCounter;
    sessionCounter++;
    sessions[sessionToken] = interpreter; 

    return [sessionToken,interpreter];
}

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
            console.log("Loading new statechart");
            var tmp = loadScxml(reqJson.load), sessionToken = tmp[0], interpreter = tmp[1];

            responseHeaders.set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, 0);
            responseBody.write(toBytes({
                sessionToken : sessionToken,
                nextConfiguration : interpreter.getConfiguration()
            }));

            responseBody.close();

            //timeouts[sessionToken] = setTimeout(function(){cleanUp(sessionToken);},timeoutMs);  
        }else if(reqJson.event && (typeof reqJson.sessionToken === "number")){
            console.log("sending event to statechart",JSON.stringify(reqJson.event,4,4));
            sessionToken = reqJson.sessionToken;
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
        console.error(e);
        console.error(e.stack);

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

