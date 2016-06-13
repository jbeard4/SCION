#!/usr/bin/env node
//A simple scxml interactive simulation environment
var scxml = require('..'),
    repl = require('repl');

var pathToScxml = process.argv[2];

if(!pathToScxml){
  console.log('Usage: scxml foo.scxml');
  process.exit(1);
}

function customSend(event, options) {
    console.log('SEND: ' +
        JSON.stringify(event) +
        ', options: ' +
        JSON.stringify(options));
}

var interpOpts = {
    customSend: customSend
}

var listeners = {
    onEntry: function(stateId) { console.log('entering state ' + stateId); },
    onExit: function(stateId) { console.log('exiting state ' + stateId); },
    onTransition: function(sourceStateId, targetIds) {
        if (targetIds && targetIds.length) {
            console.log('transitioning from ' + sourceStateId + ' to ' + targetIds.join(','));
        } else {
            console.log('executing target-less transition in ' + sourceStateId);
        }
    },
    onError: function(err) {
        console.log('ERROR:' + JSON.stringify(err));
    }
};

//1 - 2. get the xml file and convert it to jsonml
scxml.pathToModel(pathToScxml,function(err,model){

    if(err){
        console.error(err);
        process.exit(1);
    }

    model.prepare(undefined, function(err, fnModel) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        //Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
        var interpreter = new scxml.scion.Statechart(fnModel, interpOpts);


        interpreter.registerListener(listeners);


        interpreter.start();

        console.log(interpreter.getConfiguration());

        function processEvent(cmd,dontKnow,alsoDontKnow,callback){
            cmd = cmd.trim();
            interpreter.gen({name : cmd});
            var conf = interpreter.getConfiguration();
            callback(null,conf);
        }

        //start
        repl.start('#',process.stdin,processEvent);
    })

});

