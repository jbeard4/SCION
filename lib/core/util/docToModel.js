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

var annotator = require('./annotate-scxml-json'),
    json2model = require('../scxml/json2model'),
    pm = require('../../platform');

function documentToModel(url,doc,cb){
    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(pm.platform.getResourceFromUrl){
        inlineSrcs(url,doc,function(errors){
            if(errors){
                //treat script download errors as fatal
                //pass through a single error - aggregate if there's more than one
                cb(errors.length === 1 ?
                        errors[0].err :
                        new Error(
                            'Script download errors : \n' +
                                errors.map(function(oErr){return oErr.url + ': ' + oErr.err.message;}).join('\n')));
            }else{
                //otherwise, attempt to convert document to model object
                docToModel(url,doc,cb);
            }
        });
    }else{
        docToModel(url,doc,cb);
    }
}

function docToModel(url,doc,cb){
    try {
        var annotatedScxmlJson = annotator.transform(doc);
        var model = json2model(annotatedScxmlJson,url);
        cb(null,model);
    }catch(e){
        cb(e);
    }
}

function fixupUrl(baseUrl, targetUrl) {
    var newUrl;
    if (pm.platform.url.resolve) {
        newUrl = pm.platform.url.resolve(baseUrl, targetUrl);
    } else {
        var documentUrlPath = pm.platform.url.getPathFromUrl(baseUrl);
        var documentDir = pm.platform.path.dirname(documentUrlPath);
        var scriptPath = pm.platform.path.join(documentDir,targetUrl);
        newUrl = pm.platform.url.changeUrlPath(baseUrl,scriptPath);
    }

    return newUrl;
}

function inlineSrcs(url,doc,cb){
    //console.log('inlining scripts');

    var scriptActionsWithSrcAttributes = [], errors = [];

    traverse(doc.documentElement,scriptActionsWithSrcAttributes);

    //async forEach
    function retrieveScripts(){
        var script = scriptActionsWithSrcAttributes.pop();
        if(script){
            //quick and dirty for now:
            //to be totally correct, what we need to do here is:
            //parse the url, extract the pathname, call dirname on path, and join that with the path to the file
            var scriptUrl = pm.platform.dom.getAttribute(script,"src");
            if(url){
                scriptUrl = fixupUrl(url, scriptUrl);
            }
            //platform.log('fetching script src',scriptUrl);
            pm.platform.getResourceFromUrl(scriptUrl,function(err,text){
                if(err){
                    //just capture the error, and continue on
                    pm.platform.log("Error downloading document " + scriptUrl + " : " + err.message);
                    errors.push({url : scriptUrl, err : err});
                }else{
                    pm.platform.dom.textContent(script,text);
                }
                retrieveScripts();
            });
        }else{
            cb(errors.length ? errors : null);
        }
    }
    retrieveScripts();  //kick him off
}

function traverse(node,nodeList){
    if((pm.platform.dom.localName(node) === 'script' || pm.platform.dom.localName(node) === 'data') && pm.platform.dom.hasAttribute(node,"src")){
        nodeList.push(node);
    }

    pm.platform.dom.getElementChildren(node).forEach(function(child){traverse(child,nodeList);});
}


module.exports = documentToModel;
