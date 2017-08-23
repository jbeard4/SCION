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
    util = require('../util'),
    scion = require('@jbeard/scion-core'),
    starToModel = require('./star-to-model'),
    documentStringToModel = require('./document-string-to-model'),
    jsdom = require("jsdom"),
    invokers = require('./invokers');

const JSDOM = jsdom.JSDOM;

scion.InterpreterScriptingContext.invokers = invokers.invokeTypes;    //set up default invokers
scion.InterpreterScriptingContext.xmlParser = {
  parse : (xmlString) => {      //TODO: probably move this into node platform
    let dom = new JSDOM(xmlString, {contentType : 'text/xml'});
    return dom.window.document;
  }
};

//export standard interface
module.exports = {
    pathToModel : starToModel. pathToModel,
    urlToModel : starToModel.urlToModel,
    documentToModel : starToModel.documentToModel,
    documentStringToModel : documentStringToModel,
    ext : {
        platform : platform,
        compilerInternals : require('./compiler-internals')   //expose
    },
    scion : scion,
    invoke : invokers.invoke, //expose new API
    invokeContent : invokers.invokeContent
};

if(util.IS_INSPECTING){
  global.scxml = module.exports;    //this is so that the debugger can access a global registry of state machine instances
}
