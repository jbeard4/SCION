const restify = require('restify');
const builder = require('botbuilder');
const scxml = require('@jbeard/scxml');
const path = require('path');
const _ = require('underscore');
const recognizers = require('./recognizers');
const scionDiagnostics = require('@jbeard/scion-scxml-debugger-middleware');
const diagnosticsClient = require('@jbeard/scion-scxml-debugger-middleware/client');
require('@jbeard/scion-sourcemap-plugin')(scxml);
const log = require('./util').log;

function init(srcDir,mainScxmlFile,options){

  let recognizerType = options && options.recognizer && options.recognizer.type;
  let recognizerModelUrl = options && options.recognizer && options.recognizer.modelUrl

  const sessionStore = {};

  let fnModel;

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

  function processEvent(event){
    //console.log(util.inspect(event, { depth: null }));
    //we can run event.text through the luisrecognizer here
    let interpreter = lazyInitSession(event)
    let scxmlEvent;

    switch(recognizerType){
      case 'luis' : 
        scxmlEvent = recognizers.luisRecognizer(event, ns, { recognizerModelUrl : recognizerModelUrl });
        break;
      default : 
        scxmlEvent = recognizers.textRecognizer(event);
        ns(null,scxmlEvent); 
    }

    function ns(err, scxmlEvent){
      if(err) throw err;

      let configuration = interpreter.gen(scxmlEvent);
    }

  }


  function initSession(messageBuffer, interpreter){
    interpreter.on('onSmallStepBegin',function(event){
      //reset the buffer
      messageBuffer.length = 0;     //this is the ugliest part of this - manipulating the SCXML datamodel from outside the state machine
    });

    interpreter.on('onExitInterpreter',function(lastEvent){
      log(interpreter, 'onExitInterpreter', lastEvent.name);
      let sessionId = interpreter.opts.sessionid;
      if(sessionStore[sessionId]){
        //unregister
        interpreter.off();    //remove all event listeners
        delete sessionStore[sessionId];
        initNewInterpreter(sessionId, messageBuffer);    //TODO: provide a method to reset state machine
      }
    });

    interpreter.on('onSmallStepEnd',function(){
      //flush the buffer
      if(messageBuffer.length) {
        connector.send(messageBuffer.slice(),function(err, addresses){
          if(err) console.log('botbuilder error on send', err);
        }.bind(this));
      }
    });

    interpreter.on('onInvokedSessionInitialized', function(invokedInterpreter){
      initSession(messageBuffer, invokedInterpreter);
    });
  }

  connector.onEvent(function(events){
    events.forEach(processEvent)
  });

  scxml.pathToModel(path.join(srcDir,mainScxmlFile), function(err, model){
    if(err) throw err;
    model.prepare(function(err, fn){
      if(err) throw err;
      fnModel = fn;
    },{console : console, util : require('util'), builder : builder, _  : _ });
  });

  const broadcast = scionDiagnostics.init({server});
  diagnosticsClient.init(scxml,{broadcast});
}

module.exports.init = init;
