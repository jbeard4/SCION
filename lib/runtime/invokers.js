const resolveUri = require('./url-resolver'),
      starToModel = require('./star-to-model'),
      documentStringToModel = require('./document-string-to-model'),
      scion = require('scion-core'),
      urlM = require('url');

const invokeTypes = {
  "http://www.w3.org/TR/scxml/" : function(invokingSession, invokeObj){
    //we are now going to introduce a runtime dependency on scxml module into the generated code...
    //should consider how to expose this to both code paths.
    //assume we introduce a global variable 'scxml', so that we do not need to use require
    
    //put invoke logic here: 
    let method, arg, options;
    if(invokeObj.content){
      method = invokeContent;
      arg = invokeObj.content;
    } else if(invokeObj.src){
      //TODO: handle attribute lookup: srcexpr
      method = invoke;
      arg = resolveUri(invokeObj.docUrl, invokeObj.src);
    } else{
      throw new Error('Unable to find one of the following required attributes or children on <invoke> element: <content>, @src, @srcexpr' );
    }

    return method(arg,
        function(err, session){
          console.log('invoke results', err, session);
          //we don't currently do anything with this
          //FIXME: how to handle errors? expose as error.communications, external event?
        },
        {
          invokeid : invokeObj.id,
          params : invokeObj.params,
          parentSession : invokingSession,
          docUrl : invokeObj.docUrl,
          docOffsetLine : invokeObj.docOffsetLine,
          docOffsetColumn : invokeObj.docOffsetColumn 
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

/**
 * New front-end for starting a session.
 * options: 
 *    parentSession
 *    params
 */
function invoke(scxmlUrl, cb, options){
  let urlObj = urlM.parse(scxmlUrl);
  switch(urlObj.protocol){
    case 'http:':
    case 'https:':
      doInvoke(starToModel.urlToModel.bind(this, scxmlUrl), cb, options);
      break;
    //case 'data' //TODO
    case 'file:':
    default:
      doInvoke(starToModel.pathToModel.bind(this, urlObj.pathname), cb, options);
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
  doInvoke(documentStringToModel.bind(this, options.docUrl, scxmlString), cb, options);
}

function doInvoke(handler, cb, options){
  handler(function(err, model){
    //FIXME: how to handle errors? expose as error.communications, external event?
    if(err) return cb(err);
    model.prepare(function(err, fnModel){
      if(err) return cb(err);
      var interpreter = new scion.Statechart(fnModel, options);
      interpreter.start();
      cb(null, model, fnModel, interpreter);
    });
  }, {});  //I'm not sure if we can get context object here
}


module.exports = {
  invokeTypes : invokeTypes,
  invoke : invoke,
  invokeContent : invokeContent
};
