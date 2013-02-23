var scion = require('scion'),
    repl = require('repl');

//1 - 2. get the xml file and convert it to jsonml
scion.pathToModel(process.argv[2],function(err,model){

    if(err){
        throw err;
    }

    //Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
    var interpreter = new scion.SCXML(model);

    interpreter.start();

    console.log(interpreter.getConfiguration()); 

    var parseRE = /\((.*)\n\)/;

    function processEvent(cmd,dontKnow,alsoDontKnow,callback){
        var e = cmd.match(parseRE)[1];
        interpreter.gen({name : e});
        var conf = interpreter.getConfiguration();
        callback(null,conf);
    }
        
    //start 
    repl.start('#',process.stdin,processEvent);
    
});

