var repl = require('repl'),
    xml2jsonml = require('xml2jsonml'),
    scion = require('scion'),
    request = require('request');

var atom3serverUrl = "http://localhost:12345";

//1 - 2. get the xml file and convert it to jsonml
xml2jsonml.parseFile(process.argv[2],function(err,scxmlJson){

    if(err){
        throw err;
    }

    //3. annotate jsonml
    var annotatedScxmlJson = scion.annotator.transform(scxmlJson,true,true,true,true);

    //4. Convert the SCXML-JSON document to a statechart object model. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as js functions, and does some validation for correctness. 
    var model = scion.json2model(annotatedScxmlJson); 

    //5. Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
    var interpreter = new scion.scxml.NodeInterpreter(model);

    interpreter.registerListener({
        onEntry : function(id){
            request.post({
                url : atom3serverUrl,
                body : "stateid=" + id + "&command=" + "enter"
            },function(){})
        },
        onExit : function(id){
            request.post({
                url : atom3serverUrl,
                body : "stateid=" + id + "&command=" + "exit"
            },function(){})
        },
        onTransition : function(){}   
    });

    interpreter.start();

    console.log(interpreter.getConfiguration()); 

    var parseRE = /\((.*)\n\)/;

    function processEvent(cmd,dontKnow,alsoDontKnow,callback){
        var e = cmd.match(parseRE)[1];
        interpreter.gen({name : e});
        conf = interpreter.getConfiguration();
        callback(null,conf);
    }
        
    //start 
    repl.start('#',process.stdin,processEvent);
    
});

