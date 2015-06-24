#!/usr/bin/env node
//A simple scxml interactive simulation environment
var scxml = require('..'),
    repl = require('repl');

var pathToScxml = process.argv[2];

if(!pathToScxml){
  console.log('Usage: scxml foo.scxml');
  process.exit(1);
}

//1 - 2. get the xml file and convert it to jsonml
scxml.pathToModel(pathToScxml,function(err,model){

    if(err){
        throw err;
    }

    //Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
    var interpreter = new scxml.scion.Statechart(model);

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

