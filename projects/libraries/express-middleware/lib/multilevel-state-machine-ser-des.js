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
    invokedSessions.forEach( (session, index) => o[invokeIds[index]] = { 
      opts : {
        sessionid : session.opts.sessionid,
      },
      _model : { 
        docUrl : session._model.docUrl
      }
    })
    return o
  })
}

function handleInterpreterBigStepEnd(parentSession, interpreter, dbAdapter, method, cb){
  interpreter[method || 'on']('onBigStepEnd',(e) => {
    if((e && e.name === "done.state.$generated-scxml-0") || interpreter.isFinal()) return;
    // persist the state machine state
    const sessionid = interpreter.opts.sessionid,
      invokeid = interpreter.opts.invokeid,
      snapshot = interpreter.getSnapshot(),
      docUrl = interpreter._model.docUrl;

    //console.log(sessionid, invokeid, interpreter.opts._invokeMap)
    //console.log('persist state machine snapshot', snapshot)

    //upsert
    const query = { sessionid };
    const update = { $set: {
      parentSession: parentSession && {
        opts : {
          sessionid : parentSession.opts.sessionid,
        },
        _model : { 
          docUrl : parentSession._model.docUrl
        }
      },
      sessionid,
      invokeid,
      snapshot,
      docUrl,
    }};
    const options = { upsert: true };
    console.log('upsert onBigStepEnd', query, JSON.stringify(update, 4, 4))
    dbAdapter.updateOne(query, JSON.parse(JSON.stringify(update)), options, cb || ((err, result) => {if(err) throw err;}));
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
      dbAdapter.updateOne(query1, JSON.parse(JSON.stringify(update1)), {}, (err, result) => {if(err) throw err;});
      //console.log('upsert 1 onInvokedSessionInitialized', query1, util.inspect(update1, {depth: null}))

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
      //console.log('upsert 2 onInvokedSessionInitialized', query2, util.inspect(update2, {depth: null}))
      dbAdapter.updateOne(query2, JSON.parse(JSON.stringify(update2)), options, (err, result) => {if(err) throw err;});
    })
  })

  handleInterpreterBigStepEnd(rootSession, invokedInterpreter, dbAdapter)
}

function initializeRootSessionToSerializeAutomaticallyOnBigStepEndAndInvokedSessionInitialized(parentSession, session, dbAdapter, handleParentSession){
  if(handleParentSession) handleInterpreterBigStepEnd(parentSession, session, dbAdapter);
  session.on('onInvokedSessionInitialized', handleInvokedSessionInitialized.bind(this, session, dbAdapter));
}

module.exports = {
  initializeRootSessionToSerializeAutomaticallyOnBigStepEndAndInvokedSessionInitialized,
  handleInterpreterBigStepEnd
}

