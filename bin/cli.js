#!/usr/bin/env node

const scxml = require('..');
const fs = require('fs');
const repl = require('repl');
const util = require('../lib/util');

var argv = require('optimist')
    .alias('c', 'compile')
    .string('c')
    .demand('i')
    .alias('i', 'input')
    .alias('o', 'output')
    .default('o', '-')
    .alias('r', 'repl')
    .boolean('b')
    .alias('e', 'execute')
    .boolean('e')
    .alias('l', 'legacy-semantics')
    .boolean('l')
    .alias('m', 'monitor-server')
    .boolean('m')
    .argv;

let scionSourcemapPluginLoaded = false;
if(util.IS_INSPECTING || argv.compile === 'module'){ 
  try{
    require('@jbeard/scion-sourcemap-plugin')(scxml);  //load the sourcemaps plugin
    scionSourcemapPluginLoaded = true;
  }catch(e){
    console.warn('Unable to load scion-sourcemap-plugin. You will not be able to inspect SCXML source maps in the console.');
  }
}

if(argv['monitor-server']){ 
  try{
    const broadcast = require('@jbeard/scion-scxml-debugger-middleware').init({'serve-scxml-from-root-fs':true});  //load the debug server plugin
    const client = require('@jbeard/scion-scxml-debugger-middleware/client')
    client.init(scxml,{broadcast})
  }catch(e){
    console.warn('Unable to load scion-scxml-debugger-middleware.');
  }
}

const interpreterConstructor = scxml.scion[argv['legacy-semantics'] ? 'Statechart' : 'SCInterpreter'];

if(argv.compile === 'scjson' || argv.compile === 'json'){
  var scxmlToScjson = require('../lib/compiler/scxml-to-scjson');
  var scjson = scxmlToScjson(fs.readFileSync(argv.input,'utf8'));
  var s = JSON.stringify(scjson,4,4);
  if(!argv.output || argv.output === '-'){
    console.log(s);
  } else {
    fs.writeFileSync(argv.output, s); 
  }
} else {
  scxml.pathToModel(argv.input, function(err, model){
    if(err) return console.error(err);
    if(argv.compile){
      if(scionSourcemapPluginLoaded){ 
        model.prepareModuleString(function(err, moduleString){
          if(err) return console.error(err);
          if(!argv.output || argv.output === '-'){
            console.log(moduleString);
          } else {
            fs.writeFileSync(argv.output, moduleString); 
          }
        }, {moduleFormat : 'commonjs'});
      } else {
        console.error('scion-sourcemap-plugin must be loaded in order to generate module string');
      }
    } else if(argv.repl){
      model.prepare(function(err, fnModel){
        if(err) return console.error(err);
        startRepl(fnModel);
      },{console : console});
    } else if(argv.execute){
      model.prepare(function(err, fnModel){
        if(err) return console.error(err);
        //just instantiate and start him
        var interpreter = new interpreterConstructor(fnModel, interpOpts);
        interpreter.registerListener(listeners);
        interpreter.start();
      },{console : console});
    }
  }); 
}


/*
function customSend(event, options) {
    console.log('SEND: ' +
        JSON.stringify(event) +
        ', options: ' +
        JSON.stringify(options));
}
*/

var interpOpts = {
    //customSend: customSend
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

    var interpreter = new interpreterConstructor(fnModel, interpOpts);


    interpreter.registerListener(listeners);


    interpreter.start();

    console.log(interpreter.getConfiguration());

    function processEvent(cmd,dontKnow,alsoDontKnow,callback){
        cmd = cmd.trim();
        if(cmd === 'getSnapshot()'){
          callback(null,interpreter.getSnapshot());
        }else{
          interpreter.gen({name : cmd});
          var conf = interpreter.getConfiguration();
          callback(null,conf);
        }
    }

    //start
    repl.start('#',process.stdin,processEvent);
}
