const http = require('http');
const path = require('path');

function defaultBroadcast(messageName, messageData){
  const postData = JSON.stringify({messageName, messageData});
  const options = {
    hostname: 'localhost',
    port: process.env.port || process.env.PORT || 3978,
    path: '/api/event',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      //console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      //console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

function init(scxml, options){
  options = options || {};
  const networkBroadcast = options.broadcast || defaultBroadcast;
  function broadcast(interpreter, messageName, messageData){
    const url = interpreter._model.docUrl;
    const absPath = path.isAbsolute(url) ? url : path.resolve(url);
    networkBroadcast(
      messageName,
      {
        meta : {
          scName : path.basename(interpreter._model.docUrl, path.extname(interpreter._model.docUrl)), 
          docUrl : absPath,
          sessionid : interpreter.opts.sessionid,
          parentSessionIds : getParentSessionIds(interpreter),
          snapshot : interpreter.getSnapshot()
        },
        data : messageData
      }
    );
  }

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
};

module.exports.init = init;
