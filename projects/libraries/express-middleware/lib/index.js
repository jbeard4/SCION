const path = require('path');
const express = require('express')
const monitorMiddlewareClient = require('@scion-scxml/monitor-middleware/client')
const uuid = require('uuid')

const mockDb = require('./mock-db')

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

  const modelCache = {}
  const fnModelCache = {}

  function initModel(scxmlName, cb){
    scxml.pathToModel(`${pathToScxmlSrcDir}/${scxmlName}.scxml`, function(err, model){
      if(err){ 
        return cb(err);
      }
      modelCache[scxmlName] = model
      model.prepare(function(err, fnModel) {
        if(err){ 
          return cb(err);
        }
        fnModelCache[scxmlName] = fnModel
        return cb(null, fnModel)
      })
    })
  }

  function initModelOrFetchFromCache(scxmlName, cb){
    if(!fnModelCache[scxmlName]){
      initModel(scxmlName, (err, fnModel) => {
        if(err) {
          return cb(err)
        }
        cb(null, fnModel)
      })
    } else {
      cb(null, fnModelCache[scxmlName])
    }
  }

  function generateSessionid(){
    return uuid.v4()
  }


  // API to init new session
  app.post('/scion/:scxmlName', (req, res, next) => {
    const scxmlName = req.params.scxmlName

    initModelOrFetchFromCache(scxmlName, (err, fnModel) => {

      if(err) throw err;

      //instantiate the interpreter
      const sc1 = new scxml.core.Statechart(fnModel, {generateSessionid});

      sc1.start();

      //save the snapshot to the database
      const snapshot = sc1.getSnapshot()
      const sessionId = sc1.opts.sessionid
      mockDb.persistSession(sessionId, snapshot)

      res.json({
        sessionId,
        snapshot 
      })
    })
  });

  // API to send event to session
  app.post('/scion/:scxmlName/:sessionId', (req, res) => {

    const scxmlName = req.params.scxmlName,
      sessionId = req.params.sessionId;

    const evt = req.body

    console.log('evt ', evt )

    //read the sessionId
    // TODO: handle error where sessionId does not exist
    const savedSnapshot = mockDb.getSession(sessionId)

    //rehydrate the session
    initModelOrFetchFromCache(scxmlName, (err, fnModel) => {
      
      if(err) throw err;

      //instantiate the interpreter
      const sc1 = new scxml.core.Statechart(fnModel, {generateSessionid, snapshot : savedSnapshot});

      sc1.gen(evt)

      //save the snapshot to the database
      const newSnapshot = sc1.getSnapshot()
      mockDb.persistSession(sessionId, newSnapshot)

      res.json({
        sessionId,
        snapshot : newSnapshot
      })
    })
  })
}

