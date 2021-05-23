const path = require('path');
const express = require('express')
const monitorMiddlewareClient = require('@scion-scxml/monitor-middleware/client')
const {
  deserializeAllSerializedSessions,
  initializeRootSessionToSerializeAutomaticallyOnBigStepEndAndInvokedSessionInitialized
} = require('./multilevel-state-machine-ser-des')
const uuid = require('uuid')

/*
 * options: 
 */
module.exports = function ({
  app,
  scxml,
  pathToScxmlSrcDir,
  db
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

  scxml.core.BaseInterpreter.generateSessionid = uuid.v4

  // TODO write a custom invoker based on invokeNewSession
  //core.InterpreterScriptingContext.invokers = customInvokeTypes;    //TODO: set up default invokers

  function invokeNewSession(scxmlName, cb){
    initModelOrFetchFromCache(scxmlName, (err, fnModel) => {

      if(err) return cb(err);

      //instantiate the interpreter
      const sc1 = new scxml.core.Statechart(fnModel, {doSend});
      initializeRootSessionToSerializeAutomaticallyOnBigStepEndAndInvokedSessionInitialized(sc1, db)

      sc1.start();

      //save the snapshot to the database
      const snapshot = sc1.getSnapshot()
      const sessionId = sc1.opts.sessionid

      cb(null, {sessionId, snapshot})
    })
  }

  // API to init new session
  app.post('/scion/:scxmlName', (req, res, next) => {
    const scxmlName = req.params.scxmlName
    invokeNewSession(scxmlName, (err, {sessionId, snapshot}) => {
      res.json({
        sessionId,
        snapshot 
      })
    })
  });


  function doSend(session, event){
    console.log('session', session)
    const scxmlName = path.basename(session._model.docUrl, '.scxml')
    handleScxmlEvent(scxmlName, session.opts.sessionid, event, (err, newSnapshot) => {
      if(err) throw err
      console.log('new snapshot for event', event, newSnapshot)
    })
  }

  //TODO: use the database as an event queue to support multi-tenancy (horizontal scaling)
  function handleScxmlEvent(scxmlName, sessionId, evt, cb){
    initModelOrFetchFromCache(scxmlName, (err, fnModel) => {
      
      if(err) return cb(err)

      db.findOne({sessionid: sessionId}, (err, {
          sessionid, 
          docUrl, 
          invokeid, 
          parentSession : parentSessionStub,
          snapshot,
          invokeMap : serializedInvokeMap,
        }) => {

        console.log('scxmlName, sessionId, docUrl, snapshot', scxmlName, sessionId, docUrl, snapshot)

        if(err) return cb(err)
          
        const invokeMap = {}
        if(serializedInvokeMap){
          Object.entries(serializedInvokeMap).map( ([key, value]) => {
            invokeMap[key] = new Promise((resolve, reject) => {
              console.log('value', value)
              resolve(value);
            });
          })
        }

        //instantiate the interpreter
        const sc1 = new scxml.core.Statechart(fnModel, {
          snapshot, 
          sessionid: sessionId, 
          doSend,
          parentSession: parentSessionStub,
          _invokeMap : invokeMap,
          invokeid
        });
        initializeRootSessionToSerializeAutomaticallyOnBigStepEndAndInvokedSessionInitialized(sc1, db)

        sc1.gen(evt)

        //save the snapshot to the database
        const newSnapshot = sc1.getSnapshot()

        cb(null, newSnapshot)
      })
    })
  }

  // API to send event to session
  app.post('/scion/:scxmlName/:sessionId', (req, res) => {

    const scxmlName = req.params.scxmlName,
      sessionId = req.params.sessionId;

    const evt = req.body

    //read the sessionId
    // TODO: handle error where sessionId does not exist
    handleScxmlEvent(scxmlName, sessionId, evt, (err, newSnapshot) => {

      if(err) throw err;

      res.json({
        sessionId,
        snapshot : newSnapshot
      })
    })

    //rehydrate the session
  })
}

