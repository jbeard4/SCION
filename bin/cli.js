#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

require('yargs') // eslint-disable-line
  .command('init [filename]', 'initialize a new SCXML file', (yargs) => {
    setupArgumentsForOutputCommand(yargs);
  }, (argv) => {
    // TODO: parameterize @name parameter of the SCXML
    const templateScxml = fs.readFileSync(path.join(__dirname, 'template.ejs.scxml'), 'utf8');
    writeOutput(argv, templateScxml);
  })
  .command('viz [filename]', 'visualize an SCXML file', (yargs) => {
    yargs
      .positional('filename', {
        describe: 'name of SCXML file to visualize'
      });
  }, (argv) => {
    const electron = require('electron');
    const proc = require('child_process');

    var child = proc.spawn(electron, [path.join(__dirname,'..')].concat(argv.filename), {stdio: 'inherit'})
    child.on('close', function (code) {
      process.exit(code)
    })
  })
  .command('compile [filename]', 'compile an SCXML file to JSON or JavaScript', (yargs) => {
    setupArgumentsForOutputCommand(
      yargs
        .positional('filename', {
          describe: 'name of SCXML file to compile'
        })
        .option('format', {
          describe: 'Compile to JSON or JavaScript module',
          default: 'module',
          choices: ['scjson', 'json', 'module']
        })
    )
  }, (argv) => {
    if(argv.format === 'module'){
      const scxml = require('@scion-scxml/scxml'); 
      require('@scion-scxml/sourcemap-plugin')(scxml);  //load the sourcemaps plugin

      scxml.pathToModel(argv.filename, function(err, model){
        if(err) return console.error(err);
        model.prepareModuleString(function(err, moduleString){
          if(err) return console.error(err);
          writeOutput(argv, moduleString);
        }, {moduleFormat : 'commonjs'});
      });
    } else {
      const scxmlToScjson = require('scxml/lib/compiler/scxml-to-scjson');
      const scjson = scxmlToScjson(fs.readFileSync(argv.filename,'utf8'));
      writeOutput(argv, JSON.stringify(scjson,null, 4));
    }
  })
  .command('run [filename]', 'run an SCXML file, and connect a repl to send it events', (yargs) => {
    setupArgumentsForExecutableCommand(yargs, 'name of SCXML file to interpret');
  }, (argv) => {
    const repl = require('repl');

    setupInterpreterForExecutableCommand(argv, (modelFactory, Statechart) => {
      startRepl(modelFactory, Statechart);
    })

    function startRepl(modelFactory, Statechart){
      const interpreter = new Statechart(modelFactory);
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
  })
  .command('execute [filename]', 'execute an SCXML file (without the repl)', (yargs) => {
    setupArgumentsForExecutableCommand(yargs, 'name of SCXML file to execute');
  }, (argv) => {
    setupInterpreterForExecutableCommand(argv, (modelFactory, Statechart) => {
      const interpreter = new Statechart(modelFactory);
      interpreter.registerListener(listeners);
      interpreter.start();
    });
  })
  .command('lint', 'lint an SCXML file (this is an alias for "eslint --plugin scharpie")', (yargs) => {
  }, (argv) => {
    const proc = require('child_process');
    const filenames = argv._.slice(1);
    var child = proc.spawn('npx', ['eslint', '--plugin', 'scharpie'].concat(filenames), {stdio: 'inherit'})
    child.on('close', function (code) {
      process.exit(code)
    })
  })
  .command('monitor', 'start a monitor server', (yargs) => {
  }, (argv) => {
    startMonitorServer();
  })
  .help()
  .argv


function startMonitorServer(){
  return require('@scion-scxml/monitor-middleware').init({'serve-scxml-from-root-fs':true});  //load the debug server plugin
}

function setupArgumentsForExecutableCommand(yargs, description){
  yargs
    .positional('filename', {
      describe: description
    })
    .option('legacy-semantics', {
      describe: 'Run with legacy semantics',
      type: 'boolean'
    })
    .option('monitor-server', {
      describe: 'Start monitor server, and connect run SCXML with monitor client',
      type: 'boolean'
    });
}

function setupInterpreterForExecutableCommand(argv, cb){
  const scxml = require('@scion-scxml/scxml');

  const Statechart = argv['legacy-semantics'] ? 
    require('@scion-scxml/core-legacy').Statechart :
    scxml.scion.Statechart;

  if(require('@scion-scxml/scxml/lib/util').IS_INSPECTING){
    require('@scion-scxml/sourcemap-plugin')(scxml);  //load the sourcemaps plugin
  }

  if(argv['monitor-server']){
    const broadcast = startMonitorServer();
    const client = require('@scion-scxml/monitor-middleware/client')
    client.init(scxml,{broadcast})
  }

  scxml.pathToModel(argv.filename, function(err, modelFactoryFactory){
    if(err) return console.error(err);
    modelFactoryFactory.prepare(function(err, modelFactory){
      if(err) return console.error(err);
      cb(modelFactory, Statechart);
    },{console : console});
  });
}

function setupArgumentsForOutputCommand(yargs){
  yargs.option('o', {
    alias: 'output',
    demandOption: true,
    default: '-',
    describe: 'output file name (or "-" for stdout)',
    type: 'string'
  })
}

function writeOutput(argv, s){
  if(!argv.output || argv.output === '-'){
    console.log(s);
  } else {
    fs.writeFileSync(argv.output, s); 
  }
}

const listeners = {
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
