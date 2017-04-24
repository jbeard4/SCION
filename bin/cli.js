#!/usr/bin/env node

const scxml = require('..');
const fs = require('fs');
const repl = require('repl');

var argv = require('optimist')
    .alias('c', 'compile')
    .boolean('c')
    .demand('i')
    .alias('i', 'input')
    .alias('o', 'output')
    .default('o', '-')
    .alias('r', 'repl')
    .boolean('b')
    .argv;

if(argv.compile){
  var options = {deferCompilation : true};
} 
scxml.pathToModel(argv.input, function(err, model){
  if(err) throw err;
  if(argv.compile){
    model.prepareModuleString(function(err, moduleString){
      if(err) throw err;
      if(argv.output === '-'){
        console.log(moduleString);
      } else {
        fs.writeFileSync(argv.output, moduleString); 
      }
    }, {moduleFormat : 'commonjs'});
  } else if(argv.repl){
    model.prepare(function(err, fnModel){
      if(err) throw err;
      startRepl(fnModel);
    },{console : console});
  }
}, options); 


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

function startRepl(fnModel){

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
}
