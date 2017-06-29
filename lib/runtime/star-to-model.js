const documentStringToModel = require('./document-string-to-model'),
      platform = require('./platform-bootstrap/node/platform'),
      path = require('path');

/**
 * Includes options passed to the model compiler as well as 
 *   data passed along to the platform-specific resource-fetching API. 
 * @typedef {object} ModelContext
 * @property {boolean} [reportAllErrors=false] Indicates whether or not data model (aka JavaScript) 
 *   compilation errors cause the callback to be invoked with errors. By default these errors
 *   are raised to the offending document as error.execution events.
 */

/**
  * @param {string} url URL of the SCXML document to retrieve and convert to a model
  * @param {function} cb callback to invoke with an error or the model
  * @param {ModelContext} [context] The model compiler context
  */
function urlToModel(url,cb,context){
    platform.http.get(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentStringToModel(url,doc,cb,context);
        }
    },context);
}

/**
  * @param {string} url file system path of the SCXML document to retrieve and convert to a model
  * @param {function} cb callback to invoke with an error or the model
  * @param {ModelContext} [context] The model compiler context
  */
function pathToModel(url,cb,context){
    context = context || {};
    context.isLoadedFromFile = true;    //this is useful later on for setting up require() when eval'ing the generated code 

    if(!path.isAbsolute(url) && process.env.PWD){
      url = path.join(process.env.PWD,url);
    } 
    platform.fs.get(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentStringToModel(url,doc,cb,context);
        }
    },context);
}

/**
  * @param document SCXML document to convert to a model
  * @param {function} cb callback to invoke with an error or the model
  * @param {ModelContext} [context] The model compiler context
  */
function documentToModel(doc,cb,context){
    var s = platform.dom.serializeToString(doc);
    documentStringToModel(null,s,cb,context);
}

module.exports = {
  urlToModel : urlToModel,
  pathToModel : pathToModel,
  documentToModel : documentToModel
};
