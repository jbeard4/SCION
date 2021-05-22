const fs = require('fs')
const core = require('@scion-scxml/core')
const util = require('util')

function serializeInvokeMap(invokeMap){
  const invokeIds = Object.keys(invokeMap)
  return Promise.all(
    invokeIds.map( invokeId => 
      invokeMap[invokeId]
    )
  ).then(invokedSessions => {
    const o = {}
    invokedSessions.forEach( (session, index) => o[invokeIds[index]] = session.opts.sessionid )
    return o
  })
}

function handleInterpreterBigStepEnd(interpreter, dbAdapter){
  interpreter.on('onBigStepEnd',(e) => {
    if((e && e.name === "done.state.$generated-scxml-0") || interpreter.isFinal()) return;
    // persist the state machine state
    const sessionid = interpreter.opts.sessionid,
      invokeid = interpreter.opts.invokeid,
      snapshot = interpreter.getSnapshot(),
      docUrl = interpreter._model.docUrl;

    console.log(sessionid, invokeid, interpreter.opts._invokeMap)
    //console.log('persist state machine snapshot', snapshot)

    //upsert
    const query = { sessionid };
    const update = { $set: {
      sessionid,
      invokeid,
      snapshot,
      docUrl,
      invokeMap : null  // invokeMap will be updated in onInvokedSessionInitialized
    }};
    const options = { upsert: true };
    dbAdapter.updateOne(query, update, options, (err, result) => {if(err) throw err;});
  })
}

function handleInvokedSessionInitialized(rootSession, dbAdapter, invokedInterpreter){

  //clear the serialized session on exit
  invokedInterpreter.on('onExitInterpreter', () => {
    const sessionid = invokedInterpreter.opts.sessionid;

    dbAdapter.deleteOne({sessionid}, (err, result) => {if(err) throw err;});
  });

  process.nextTick(() => {
    serializeInvokeMap(rootSession._scriptingContext._invokeMap).then(serializedInvokeMap => {

      const sessionid = rootSession.opts.sessionid,
        invokeid = rootSession.opts.invokeid,
        snapshot = rootSession.getSnapshot(),
        docUrl = rootSession._model.docUrl;


      //update invokeMap on the root session
      const query1 = { sessionid: rootSession.opts.sessionid };
      const update1 = { $set: { invokeMap : serializedInvokeMap }};
      dbAdapter.updateOne(query1, update1, {}, (err, result) => {if(err) throw err;});

      //upsert a session
      const query2 = { sessionid };
      const update2 = { $set: {
        sessionid,
        invokeid,
        snapshot,
        docUrl,
        invokeMap : serializedInvokeMap
      }};
      const options = { upsert: true };
      dbAdapter.updateOne(query2, update2, options, (err, result) => {if(err) throw err;});
    })
  })

  handleInterpreterBigStepEnd(invokedInterpreter, dbAdapter)
}

function initializeRootSessionToSerializeAutomaticallyOnBigStepEndAndInvokedSessionInitialized(rootSession, dbAdapter){
  handleInterpreterBigStepEnd(rootSession, dbAdapter);
  rootSession.on('onInvokedSessionInitialized', handleInvokedSessionInitialized.bind(this, rootSession, dbAdapter));
}

module.exports = {
  initializeRootSessionToSerializeAutomaticallyOnBigStepEndAndInvokedSessionInitialized
}

