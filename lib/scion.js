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

var pm = require('./platform'),
    scxml = require('./core/scxml/SCXML'),
    documentToModel = require('./core/util/docToModel');

/*
  *@url URL of the SCXML document to retrieve and convert to a model
  *@cb callback to invoke with an error or the model
  *@context Optional. host-specific data passed along to the platform-specific resource-fetching API (e.g. to provide better traceability)
  */
function urlToModel(url,cb,context){
    if(!pm.platform.getDocumentFromUrl) throw new Error("Platform does not support getDocumentFromUrl");

    pm.platform.getDocumentFromUrl(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentToModel(url,doc,cb,context);
        }
    },context);
}

/*
  *@url file system path of the SCXML document to retrieve and convert to a model
  *@cb callback to invoke with an error or the model
  *@context Optional. host-specific data passed along to the platform-specific resource-fetching API (e.g. to provide better traceability)
  */
function pathToModel(url,cb,context){
    if(!pm.platform.getDocumentFromFilesystem) throw new Error("Platform does not support getDocumentFromFilesystem");

    pm.platform.getDocumentFromFilesystem(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentToModel(url,doc,cb,context);
        }
    },context);
}

/*
  *@s SCXML document string to convert to a model
  *@cb callback to invoke with an error or the model
  *@context Optional. host-specific data passed along to the platform-specific resource-fetching API (e.g. to provide better traceability)
  */
function documentStringToModel(s,cb,context){
    if(!pm.platform.parseDocumentFromString) throw new Error("Platform does not support parseDocumentFromString");

    documentToModel(null,pm.platform.parseDocumentFromString(s),cb,context);
}

//export standard interface
var scion = module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel,
    documentStringToModel : documentStringToModel,
    documentToModel : documentToModel,
    SCXML : scxml.SimpleInterpreter,
    ext : {
        platformModule : pm,
        actionCodeGeneratorModule : require('./core/util/code-gen')
    }
};
