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

var pm = require('./platform-bootstrap/platform'),
    documentStringToModelFactory = require('./document-string-to-model-factory');

/*
  *@url URL of the SCXML document to retrieve and convert to a model
  *@cb callback to invoke with an error or the model
  *@context Optional. host-specific data passed along to the platform-specific resource-fetching API (e.g. to provide better traceability)
  */
function urlToModelFactory(url,cb,context){
    if(!pm.platform.http.get) throw new Error("Platform does not support http.get");

    pm.platform.http.get(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentStringToModelFactory(url,doc,cb,context);
        }
    },context);
}

/*
  *@url file system path of the SCXML document to retrieve and convert to a model
  *@cb callback to invoke with an error or the model
  *@context Optional. host-specific data passed along to the platform-specific resource-fetching API (e.g. to provide better traceability)
  */
function pathToModelFactory(url,cb,context){
    if(!pm.platform.fs.get) throw new Error("Platform does not support fs.get");

    context = context || {};
    context.isLoadedFromFile = true;    //this is useful later on for setting up require() when eval'ing the generated code 

    pm.platform.fs.get(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentStringToModelFactory(url,doc,cb,context);
        }
    },context);
}

/*
  *@document SCXML document to convert to a model
  *@cb callback to invoke with an error or the model
  *@context Optional. host-specific data passed along to the platform-specific resource-fetching API (e.g. to provide better traceability)
  */
function documentToModelFactory(doc,cb,context){
    var s = pm.platform.dom.serializeToString(doc);
    documentStringToModelFactory(null,s,cb,context);
}


//export standard interface
module.exports = {
    pathToModelFactory : pathToModelFactory,
    urlToModelFactory : urlToModelFactory,
    documentStringToModelFactory : documentStringToModelFactory.bind(this,null),
    documentToModelFactory : documentToModelFactory,
    ext : {
        platformModule : pm
    }
};
