const path = require('path');
const express = require('express')
const monitorMiddlewareClient = require('@scion-scxml/monitor-middleware/client')

/*
 * options: 
 */
module.exports = function ({
  app,
  scxml,
  pathToScxmlSrcDir
}){

  //set the mime type
  express.static.mime.define({"application/scxml+xml": ['scxml']});

  //serve static files
  const scxmlSrcDirExpressMountPath = '/scion/static/src'
  app.use(scxmlSrcDirExpressMountPath, express.static(pathToScxmlSrcDir))

  const pathToDashboard = path.dirname(path.dirname(path.dirname(require.resolve('@scion-scxml/dashboard'))));
  app.use('/scion/static/dashboard', express.static(pathToDashboard))

  //init sse
  monitorMiddlewareClient.init(scxml, {broadcast})

  let sseResponses = new Set();
  let messageCount = 0;

  //TODO: prefix this with "scion"
  app.get('/api/update-stream', function(req, res){
     res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    sseResponses.add(res);
    req.on("close", function() {
      sseResponses.delete(res);
    });
  });

  function broadcast(messageName, messageData){
    //rewrite the docUrl
    messageData.meta.docUrl = path.join(scxmlSrcDirExpressMountPath, path.basename(messageData.meta.docUrl))
    for(let res of sseResponses){
      res.write('id: ' + (messageCount++) + '\n');
      res.write('event: ' + messageName + '\n');
      res.write("data: " + JSON.stringify(messageData) + '\n\n'); // Note the extra newline
    }
  }
}

