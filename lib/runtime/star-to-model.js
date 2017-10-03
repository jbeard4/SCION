const documentStringToModel = require('./document-string-to-model').documentStringToModel,
      platform = require('./platform-bootstrap/node/platform'),
      path = require('path');

/**
 * This callback is displayed as a global member.
 * @callback modelCallback
 * @param {Error} err
 * @param {scxml.ModelFactoryFactory} model 
 */

/**
 * Includes options passed to the model compiler as well as 
 *   data passed along to the platform-specific resource-fetching API. 
 * @typedef {object} HostContext
 * @property {boolean} [reportAllErrors=false] Indicates whether or not data model (aka JavaScript) 
 *   compilation errors cause the callback to be invoked with errors. By default these errors
 *   are raised to the offending document as error.execution events.
 * @property {boolean} [deferCompilation=false] Generate a single model string with the datamodel compiled in as local variables. This can be helpful for inspecting the generated code, as well as dumping a file to the filesystem that can be subsequently required. In particular, this is used to work around this nodejs <a href="https://github.com/nodejs/node/issues/7593">bug</a> related to debugging generated code.
 * @property {boolean} [strict=false] Include a "use strict" header in generated module code.
 * @property {string} [moduleFormat] Set to "node" or "commonjs" in order to generate a module in CommonJS format.
 * @property {boolean} [isLoadedFromFile=false] Experimental. Internal use only, right now.
 * @property {boolean} [writeModuleToDisk=false] Experimental. Internal use only, right now.
 */

/**
  * @memberof scxml
  * @param {string} url URL of the SCXML document to retrieve and convert to a model
  * @param {modelCallback} cb callback to invoke with an error or the model
  * @param {HostContext} [hostContext] The model compiler hostContext
  */
function urlToModel(url,cb,hostContext){
    platform.http.get(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentStringToModel(url,doc,cb,hostContext);
        }
    },hostContext);
}

/**
  * @memberof scxml
  * @param {string} url file system path of the SCXML document to retrieve and convert to a model
  * @param {modelCallback} cb callback to invoke with an error or the model
  * @param {HostContext} [hostContext] The model compiler hostContext
  */
function pathToModel(url,cb,hostContext){
    hostContext = hostContext || {};
    hostContext.isLoadedFromFile = true;    //this is useful later on for setting up require() when eval'ing the generated code 

    if(!path.isAbsolute(url) && process.env.PWD){
      url = path.join(process.env.PWD,url);
    } 
    platform.fs.get(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentStringToModel(url,doc,cb,hostContext);
        }
    },hostContext);
}

/**
  * @memberof scxml
  * @param document {XMLDocument} SCXML DOM document to convert to a model
  * @param {modelCallback} cb callback to invoke with an error or the model
  * @param {HostContext} [hostContext] The model compiler hostContext
  */
function documentToModel(doc,cb,hostContext){
    var s = platform.dom.serializeToString(doc);
    documentStringToModel(null,s,cb,hostContext);
}

module.exports = {
  urlToModel : urlToModel,
  pathToModel : pathToModel,
  documentToModel : documentToModel
};
