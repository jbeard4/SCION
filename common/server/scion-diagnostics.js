const restify = require('restify');
const util = require('util');
const scxml = require('@jbeard/scxml');
const path = require('path');
const log = require('./util').log;

function init(server,sessionStore,srcDir,options){

  let responses = new Set();
  let messageCount = 0;

  //serve static files
  //TODO: factor this out
  server.get(/.*\.scxml/, restify.serveStatic({
    'directory': srcDir
  }));
  server.get(/\/dashboard.*/, restify.serveStatic({
    'directory': path.join(__dirname, 'static'),
    'default': 'index.html'
  }));

  server.get('/api/update-stream', function(req, res){
     res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    responses.add(res);
    req.on("close", function() {
      responses.delete(res);
    });
  });

  scxml.scion.on('new', function(interpreter){
    initSession(interpreter);
  });

  function broadcast(interpreter, eventName, event){
    for(let res of responses){
      res.write('id: ' + (messageCount++) + '\n');
      res.write('event: ' + eventName + '\n');
      res.write("data: " + JSON.stringify({
        name : path.parse(interpreter._model.docUrl).name, 
        docUrl : path.relative(srcDir, interpreter._model.docUrl),
        sessionid : interpreter.opts.sessionid,
        snapshot : interpreter.getSnapshot(), 
        event : event
      }) + '\n\n'); // Note the extra newline
    }
  }

  function initSession(interpreter){
    interpreter.on('onError',log.bind(this, interpreter, 'onError'));
    interpreter.on('onExitInterpreter',function(lastEvent){
      broadcast(interpreter, 'onExitInterpreter',lastEvent);
    })
    interpreter.on('onEntry',log.bind(this, interpreter, 'onEntry'));
    interpreter.on('onExit',log.bind(this, interpreter, 'onExit'));
    interpreter.on('onBigStepBegin',function(event){
      broadcast(interpreter, 'onBigStepBegin',event);
    });
    interpreter.on('onTransition',function(transitionSourceId, transitionTargetIds, transitionIndex){
      broadcast(interpreter, 'onTransition', 
        [transitionSourceId, transitionTargetIds, transitionIndex]
      );
    });
    interpreter.on('onDefaultEntry',function(initialStateId){
      broadcast(interpreter, 'onDefaultEntry',initialStateId);
    });

    interpreter.on('onBigStepEnd',function(){
      broadcast(interpreter, 'onBigStepEnd');
      log(interpreter, 'onBigStepEnd', interpreter.getConfiguration());
    })
    interpreter.on('onSmallStepBegin',function(event){
      broadcast(interpreter, 'onSmallStepBegin',event);
    });
    interpreter.on('onSmallStepEnd',function(){
      broadcast(interpreter, 'onSmallStepEnd');
    });
    interpreter.on('onInvokedSessionInitialized', function(invokedInterpreter){
      initSession(messageBuffer, invokedInterpreter);
    });
    //TODO: on done, remove event listeners, to avoid memory leaks
  }
}

module.exports.init = init;
