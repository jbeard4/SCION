/*
     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
*/

"use strict";

const platform = require('./platform-bootstrap/node/platform'),
    path = require('path'),
    urlM = require('url'),
    scion = require('scion-core'),
    documentStringToModel = require('./document-string-to-model');

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
      doInvoke(urlToModel.bind(this, scxmlUrl), cb, options);
      break;
    //case 'data' //TODO
    case 'file:':
    default:
      doInvoke(pathToModel.bind(this, urlObj.pathname), cb, options);
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

//export standard interface
module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel,
    documentStringToModel : documentStringToModel,
    documentToModel : documentToModel,
    ext : {
        platform : platform,
        compilerInternals : require('./compiler-internals')   //expose
    },
    scion : scion,
    invoke : invoke, //expose new API
    invokeContent : invokeContent
};


