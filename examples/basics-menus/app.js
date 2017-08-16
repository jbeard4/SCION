const util = require('util');
const builder = require('botbuilder');
const restify = require('restify');
const scxml = require('scxml');
const path = require('path');
let fnModel;

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
connector.onEvent(function(events){
  events.forEach(processEvent)
})

scxml.pathToModel('./app.scxml', function(err, model){
  if(err) throw err;
  model.prepare(function(err, fn){
    if(err) throw err;
    fnModel = fn;
  },{console : console, util : require('util')});
});

function processEvent(event){
  //console.log(util.inspect(event, { depth: null }));
  let interpreter = lazyInitSession(event)
  let scxmlEvent = { name : event.type, data: event};
  let configuration = interpreter.gen(scxmlEvent);
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
  interpreter.on('onExitInterpreter',function(lastEvent){
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
  interpreter.on('onBigStepEnd',function(){
    log(interpreter, 'onBigStepEnd', interpreter.getConfiguration());
  })
  interpreter.on('onSmallStepBegin',function(){
    //reset the buffer
    messageBuffer.length = 0;     //this is the ugliest part of this - manipulating the SCXML datamodel from outside the state machine
  });
  interpreter.on('onSmallStepEnd',function(){
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
