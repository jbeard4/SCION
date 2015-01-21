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

var scxmlToScjson = require('../compiler/scxml-to-scjson'),
    scjsonToModule = require('../compiler/scjson-to-module'),
    scJsonAnalyzer = require('../compiler/static-analysis/scjson-analyzer'),
    pm = require('./platform-bootstrap/platform');

function documentStringToModel(url,docString,cb,context){

    var scJson = scxmlToScjson(docString);

    scJsonAnalyzer.analyze(scJson, url, context, function (result) {
        if (result.errors.length) {
            //Log errors

            //TODO Value --force is set
            if (true) {

            } else {
                //TODO Throw error and kill process

            };
        };

        createModule(url, result.scJson, context, cb);
    });
}

function createModule(url,scJson,context,cb){

    if(pm.platform.debug) console.log('scjson',JSON.stringify(scJson,4,4)); 

    var jsModule = scjsonToModule(scJson);

    if(pm.platform.debug) {
        console.log('jsModuleString\n', jsModule); 
    }

    var model = pm.platform.module.eval(jsModule.module,url,context);     //TODO: use a platform-native eval? this is where we would pass in require
    model.meta = {
        name: jsModule.name
    }

    if(pm.platform.debug) console.log('model',model);

    cb(null, model);
}

module.exports = documentStringToModel;
