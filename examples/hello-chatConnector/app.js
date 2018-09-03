const util = require('util');
const builder = require('botbuilder');
const restify = require('restify');
const scxml = require('@scion-scxml/scxml');
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
  },{console : console, connector : connector});
});

function processEvent(event){
  console.log(util.inspect(event, { depth: null }));
  let interpreter = lazyInitSession(event)
  let scxmlEvent = { name : event.type, data : event };
  interpreter.gen(scxmlEvent);
}

function lazyInitSession(event){
  const id = event.address.conversation.id;
  if(!sessionStore[id]){
    let interpreter = sessionStore[id] = new scxml.scion.Statechart(fnModel, {_sessionid : id});
    interpreter.start();
  }
  return sessionStore[id];
}
