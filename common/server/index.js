const util = require('util');
const builder = require('botbuilder');
const restify = require('restify');
const scxml = require('@jbeard/scxml');
const path = require('path');
const _ = require('underscore');
let fnModel;

function init(srcDir,mainScxmlFile, options){

  let recognizerType = options && options.recognizer && options.recognizer.type;
  let recognizerModelUrl = options && options.recognizer && options.recognizer.modelUrl

  const sessionStore = {};

  // Setup Restify Server
  let server = restify.createServer();
  server.listen(process.env.port || process.env.PORT || 3978, function () {
      console.log('%s listening to %s', server.name, server.url);
  });

  // Create chat bot and listen to messages
  let connector = new builder.ChatConnector({
      appId: process.env.MICROSOFT_APP_ID,
      appPassword: process.env.MICROSOFT_APP_PASSWORD
  });
  server.post('/api/messages', connector.listen());

  let responses = new Set();
  let messageCount = 0;

  //serve static files
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

  connector.onEvent(function(events){
    events.forEach(processEvent)
  })

  scxml.pathToModel(path.join(srcDir,mainScxmlFile), function(err, model){
    if(err) throw err;
    model.prepare(function(err, fn){
      if(err) throw err;
      fnModel = fn;
    },{console : console, util : require('util'), builder : builder, _  : _ });
  });

  function processEvent(event){
    //console.log(util.inspect(event, { depth: null }));
    //we can run event.text through the luisrecognizer here
    let interpreter = lazyInitSession(event)
    let scxmlEvent;

    switch(recognizerType){
      case 'luis' : 
        scxmlEvent = luisRecognizer(event, ns);
        break;
      default : 
        scxmlEvent = textRecognizer(event);
        ns(null,scxmlEvent); 
    }

    function ns(err, scxmlEvent){
      if(err) throw err;

      let configuration = interpreter.gen(scxmlEvent);
    }

  }

  //convert the message to an event
  function textRecognizer(message){
    return { name : message.type, data: message};
  }

  function luisRecognizer(message, cb){
    console.log('message.text', message.text);
    builder.LuisRecognizer.recognize(message.text, recognizerModelUrl, function(err, intents, entities){
      if(err) cb(err);
      console.log('recognizer.recognize result', err, intents, entities);
      //do some logic to get intent with the highest score
      let scores = intents.map( intent => intent.score )
      let maxScore = Math.max.apply(Math, scores);
      let maxScoreIdx = scores.indexOf(maxScore);
      let rankingIntent = intents[maxScoreIdx];
      let scxmlEvent = {
        name : `message.intent.${rankingIntent.intent}`,
        data  : {
          message : message,
          rankingIntent : rankingIntent,
          intents : intents,
          entities : entities
        }
      };
      cb(null, scxmlEvent); 
    })
  }

  function lazyInitSession(event){
    const id = event.address.conversation.id;
    if(!sessionStore[id]){
      let messageBuffer = [];
      let interpreter = initNewInterpreter(id, messageBuffer);
    }
    return sessionStore[id];
  }

  function initNewInterpreter(id, messageBuffer){
    let interpreter = sessionStore[id] = new scxml.scion.Statechart(fnModel, {sessionid : id, params : { messageBuffer } });
    initSession(messageBuffer, interpreter);
    interpreter.start();
    return interpreter;
  }

  function log(interpreter, eventName, value){
    console.log(path.parse(interpreter._model.docUrl).name, interpreter.opts.sessionid, eventName, value);
  }

  function initSession(messageBuffer, interpreter){
    interpreter.on('onError',log.bind(this, interpreter, 'onError'));
    interpreter.on('onExitInterpreter',function(lastEvent){
      broadcast(interpreter, 'onExitInterpreter',lastEvent);
      log(interpreter, 'onExitInterpreter', lastEvent.name);
      let sessionId = interpreter.opts.sessionid;
      if(sessionStore[sessionId]){
        //unregister
        interpreter.off();    //remove all event listeners
        delete sessionStore[sessionId];
        initNewInterpreter(sessionId, messageBuffer);    //TODO: provide a method to reset state machine
      }
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

      //reset the buffer
      messageBuffer.length = 0;     //this is the ugliest part of this - manipulating the SCXML datamodel from outside the state machine
    });
    interpreter.on('onSmallStepEnd',function(){
      broadcast(interpreter, 'onSmallStepEnd');
      //flush the buffer
      //console.log('onSmallStepEnd', messageBuffer);
      if(messageBuffer.length) {
        connector.send(messageBuffer.slice(),function(err, addresses){
          if(err) console.log('botbuilder error on send', err);
        }.bind(this));
      }
    });
    interpreter.on('onInvokedSessionInitialized', function(invokedInterpreter){
      initSession(messageBuffer, invokedInterpreter);
    });
    //TODO: on done, remove event listeners, to avoid memory leaks
  }
}

module.exports.init = init;
