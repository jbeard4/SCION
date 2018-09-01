#!/usr/bin/env node
const fs = require('fs');
const restify = require('restify');
const util = require('util');
const path = require('path');
const log = require('./util').log;
const os = require('os');
const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  origins: ['*'],
})

const localConfigurationFile = path.join(os.homedir(),'.scion.conf.json');

function init(options){

  options = options || {};

  let server = options.server;

  if(!server){
    server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, function () {
        console.log('SCION debugging server %s listening to %s', server.name, server.url);
    });
  }

  let responses = new Set();
  let messageCount;

  //read cached configuration
  try{
    messageCount = JSON.parse(fs.readFileSync(localConfigurationFile)).messageCount;
  }catch(e){
    messageCount = 0;
  }

  //cache local configuration on exit
  function exitHandler(options, err) {
    if (err) console.log(err.stack);
    fs.writeFileSync(localConfigurationFile,JSON.stringify({messageCount : messageCount}))
    process.exit();
  }

  //do something when app is closing
  process.on('exit', exitHandler);

  //catches ctrl+c event
  process.on('SIGINT', exitHandler);

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  //catches uncaught exceptions
  process.on('uncaughtException', exitHandler);

  server.pre(cors.preflight)
  server.use(cors.actual)

  //serve static files
  //TODO: factor this out
  if(options['serve-scxml-from-root-fs'] || process.argv.indexOf('--serve-scxml-from-root-fs') > -1){
    server.get(/\/?.*\.scxml/, function(req, res){
      let p = req.path();
      fs.readFile(p, function(err, contents){
        if(err){
          console.error(err);
          return res.status(500).end();
        }
        return res.sendRaw(200,contents, {"Content-Type" : "application/scxml+xml"});
      })
    });
  }

  server.post(/\/api\/event/, function(req, res){
    let buffer = '';
    req.on('data',function(s){
      buffer += s;
    });

    req.on('end',function(){
      res.send('OK');
      const o = JSON.parse(buffer);
      broadcast(o.messageName, o.messageData);
    });
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

  server.get(/\/.*/, restify.plugins.serveStatic({
    'directory': process.env.PWD,
    'default': 'index.html'
  }));


  function broadcast(messageName, messageData){
    for(let res of responses){
      res.write('id: ' + (messageCount++) + '\n');
      res.write('event: ' + messageName + '\n');
      res.write("data: " + JSON.stringify(messageData) + '\n\n'); // Note the extra newline
    }
  }

  return broadcast;
}

if(require.main === module){
  init();
}


module.exports.init = init;
