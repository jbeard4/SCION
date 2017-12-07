const fs = require('fs');
const restify = require('restify');
const util = require('util');
const path = require('path');
const log = require('./util').log;

function init(scxml, options){

  options = options || {};

  let server = options.server;

  if(!server){
    server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, function () {
        console.log('SCION debugging server %s listening to %s', server.name, server.url);
    });
  }

  let responses = new Set();
  let messageCount = 0;

  //serve static files
  //TODO: factor this out
  server.get(/\/?.*\.scxml/, function(req, res){
    let p = req.path();
    fs.readFile(p, function(err, contents){
      if(err){
        console.error(err);
        return res.status(500).end();
      }
      return res.send(200,contents, {"Content-Type" : "application/scxml+xml"});
    })
  });

  server.get(/\/dashboard.*/, restify.plugins.serveStatic({
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

  function getParentSessionIds(interpreter){
    var arr = [];
    var parentSession = interpreter.opts.parentSession;
    while(parentSession){
      arr.push(parentSession.opts.sessionid);
      parentSession = parentSession.opts.parentSession;
    }
    return arr;
  }

  function broadcast(interpreter, messageName, messageData){
    const url = interpreter._model.docUrl;
    const absPath = path.isAbsolute(url) ? url : path.resolve(url);
    for(let res of responses){
      res.write('id: ' + (messageCount++) + '\n');
      res.write('event: ' + messageName + '\n');
      res.write("data: " + JSON.stringify({
        meta : {
          scName : path.parse(interpreter._model.docUrl).name, 
          docUrl : absPath,
          sessionid : interpreter.opts.sessionid,
          parentSessionIds : getParentSessionIds(interpreter),
          snapshot : interpreter.getSnapshot()
        },
        data : messageData
      }) + '\n\n'); // Note the extra newline
    }
  }

  function initSession(interpreter){

    let statesEnteredDuringBigStep,
        statesEnteredDuringSmallStep,
        statesExitedDuringBigStep,
        statesExitedDuringSmallStep,
        defaultStatesEnteredDuringBigStep,
        defaultStatesEnteredDuringSmallStep,
        transitionsTakenDuringBigStep,
        transitionsTakenDuringSmallStep;

    interpreter.on('onBigStepBegin',function(event){
      //reset
      statesEnteredDuringBigStep = [];
      statesExitedDuringBigStep = [];
      defaultStatesEnteredDuringBigStep = [];
      transitionsTakenDuringBigStep = [];

      broadcast(interpreter, 'onBigStepBegin', event);
    });

    interpreter.on('onSmallStepBegin',function(event){
      //reset
      statesEnteredDuringSmallStep = [];
      statesExitedDuringSmallStep = [];
      defaultStatesEnteredDuringSmallStep = [];
      transitionsTakenDuringSmallStep = [];

      broadcast(interpreter, 'onSmallStepBegin', event);
    });

    interpreter.on('onEntry',function(stateId){
      statesEnteredDuringBigStep.push(stateId);
      statesEnteredDuringSmallStep.push(stateId); 
    });

    interpreter.on('onExit',function(stateId){
      statesExitedDuringBigStep.push(stateId);
      statesExitedDuringSmallStep.push(stateId);
    });

    interpreter.on('onTransition',function(transitionSourceId, transitionTargetIds, transitionIndex){
      const args = [transitionSourceId, transitionTargetIds, transitionIndex];
      transitionsTakenDuringBigStep.push(args); 
      transitionsTakenDuringSmallStep.push(args); 
    });

    interpreter.on('onDefaultEntry',function(initialStateId){
      defaultStatesEnteredDuringBigStep.push(initialStateId);
      defaultStatesEnteredDuringSmallStep.push(initialStateId);
    });

    interpreter.on('onSmallStepEnd',function(event){
      broadcast(interpreter, 'onSmallStepEnd', {
        event : event,
        statesEntered : statesEnteredDuringSmallStep,
        statesExited : statesExitedDuringSmallStep,
        defaultStatesEntered : defaultStatesEnteredDuringSmallStep,
        transitionsTaken : transitionsTakenDuringSmallStep
      });
    });

    interpreter.on('onBigStepEnd',function(event){
      broadcast(interpreter, 'onBigStepEnd', {
        event : event,
        statesEntered : statesEnteredDuringBigStep,
        statesExited : statesExitedDuringBigStep,
        defaultStatesEntered : defaultStatesEnteredDuringBigStep,
        transitionsTaken : transitionsTakenDuringBigStep
      });
    });

    interpreter.on('onError',function(error){
      broadcast(interpreter, 'onError', {
        name : error.name,
        message : error.message,
        stack : error.stack
      });
    });

    interpreter.on('onExitInterpreter',function(lastEvent){
      broadcast(interpreter, 'onExitInterpreter', lastEvent);
    });

    //TODO: on done, remove event listeners, to avoid memory leaks
    //interpreter.on('onInvokedSessionInitialized', function(invokedInterpreter){
    //  initSession(invokedInterpreter);
    //});
  }
}


module.exports.init = init;
