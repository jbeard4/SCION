const resolveUri = require('./url-resolver'),
      starToModel = require('./star-to-model'),
      documentStringToModel = require('./document-string-to-model'),
      scion = require('@jbeard/scion-core'),
      xmlserializer = require('xmlserializer'),
      urlM = require('url');

const invokeTypes = {
  "http://www.w3.org/TR/scxml/" : function(invokingSession, invokeObj, cb){
    //we are now going to introduce a runtime dependency on scxml module into the generated code...
    //should consider how to expose this to both code paths.
    //assume we introduce a global variable 'scxml', so that we do not need to use require
    
    //put invoke logic here: 
    let method, arg, options;
    if(invokeObj.constructorFunction){
      method = startSession;
      arg = invokeObj.constructorFunction;
    }else if(invokeObj.content){
      method = invokeContent;
      arg = typeof invokeObj.content === 'string' ? 
              invokeObj.content : 
              xmlserializer.serializeToString(invokeObj.content);      //FIXME: use browser-native data structure in browser environment
    } else if(invokeObj.src){
      //TODO: handle attribute lookup: srcexpr
      method = invoke;
      arg = resolveUri(invokeObj.docUrl, invokeObj.src);
    } else{
      throw new Error('Unable to find one of the following required attributes or children on <invoke> element: <content>, @src, @srcexpr' );
    }

    return method(arg,
        cb,
        {
          invokeid : invokeObj.id,
          params : invokeObj.params,
          parentSession : invokingSession,
          docUrl : invokeObj.docUrl
          //sessionid : //TODO: construct or generate a sessionid for invoked session
        });
  }
  //TODO: implement other invoke types
  //http://www.w3.org/TR/ccxml/
  //http://www.w3.org/TR/voicexml30/
  //http://www.w3.org/TR/voicexml21/ 
};
invokeTypes['scxml'] = invokeTypes["http://www.w3.org/TR/scxml/"];
invokeTypes['http://www.w3.org/TR/scxml'] = invokeTypes["http://www.w3.org/TR/scxml/"];

const invokeCache = {};

/**
 * New front-end for starting a session.
 * options: 
 *    parentSession
 *    params
 */
function invoke(scxmlUrl, cb, options){
  let cached = invokeCache[scxmlUrl];
  if(cached){
    let fnModel = cached[0], model = cached[1];
    return startSession(fnModel, cb, options, model);
  }
  let urlObj = urlM.parse(scxmlUrl);
  switch(urlObj.protocol){
    case 'http:':
    case 'https:':
      doInvoke(starToModel.urlToModel.bind(this, scxmlUrl), cb, options, scxmlUrl);
      break;
    //case 'data' //TODO
    case 'file:':
    default:
      doInvoke(starToModel.pathToModel.bind(this, urlObj.pathname), cb, options, scxmlUrl);
      break;
  }
}

/**
 *
 * Options:
 *    docUrl
 *    docOffsetLine
 *    docOffsetColumn
 */
function invokeContent(scxmlString, cb, options){
  let cached = invokeCache[scxmlString];
  if(cached){
    let fnModel = cached[0], model = cached[1];
    return startSession(fnModel, cb, options, model);
  }
  doInvoke(documentStringToModel.bind(this, options.docUrl, scxmlString), cb, options, scxmlString);
}

function doInvoke(handler, cb, options, stringOrUrl){
  handler(function(err, model){
    //FIXME: how to handle errors? expose as error.communications, external event?
    if(err) return cb(err);
    model.prepare(function(err, fnModel){
      if(err) return cb(err);
      invokeCache[stringOrUrl] = [fnModel, model];
      startSession(fnModel, cb, options, model)
    });
  }, {console : console});  //FIXME: I'm not sure if we can get context object here
}

function startSession(fnModel, cb, options, model){
  var interpreter = new scion.Statechart(fnModel, options);
  cb(null, interpreter, fnModel, model);
  //we introduce a delay here before starting the interpreter to give clients that are subscribed to onInvokedSessionInitialized event a chance to subscribe to events on the newly instantiated interpreter
  setImmediate( () => interpreter.start() );    
}


module.exports = {
  invokeTypes : invokeTypes,
  invoke : invoke,
  invokeContent : invokeContent
};
