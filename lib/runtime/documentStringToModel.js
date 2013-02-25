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
    pm = require('./platform/platform');

function documentStringToModel(url,docString,cb,context){

    var scJson = scxmlToScjson(docString);

    try {

        //do whatever transforms
        //inline script tags
        //platformGet may be undefined, and we can continue without it, hence the guard
        if(pm.platform.getResourceFromUrl){
            inlineSrcs(url,scJson,context,function(errors){
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
                    createModule(scJson,cb);
                }
            });
        }else{
            createModule(scJson,cb);
        }
    }catch(e){
        cb(e);
    }
}

function createModule(scJson,cb){
    console.log('scjson',JSON.stringify(scJson,4,4)); 
    var jsModule = scjsonToModule(scJson);
    console.log('jsModule\n',jsModule); 
    var model = eval(jsModule);     //TODO: use a platform-native eval? 
    console.log('model',model);
    cb(null,model);
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

function inlineSrcs(docUrl,scjson,context,cb){
    //console.log('inlining scripts');

    var nodesWithSrcAttributes = [], errors = [], resultCount = 0;

    traverse(scjson,nodesWithSrcAttributes);

    if (nodesWithSrcAttributes.length) {

        // kick off fetches in parallel
        nodesWithSrcAttributes.forEach(function(node, idx) {

            var nodeUrl = node.src;

            if(docUrl) {
                nodeUrl = fixupUrl(docUrl, nodeUrl);
            }

           /* TBD: For data elements, use mimeType (aka Content-Type returned by HTTP server (if any))
                     *  to determine how to process the external resource.
                     *  e.g. treat application/json as JSON per hint in C.2.1 of http://www.w3.org/TR/scxml/#profiles
                     */
            pm.platform.getResourceFromUrl(nodeUrl,function(err,text,mimeType){
                if(err){
                    //just capture the error, and continue on
                    pm.platform.log("Error downloading document " + nodeUrl + " : " + err.message);
                    errors.push({url : nodeUrl, err : err});
                }else{
                    node.content = text;
                }
                ++resultCount;
                if (resultCount == nodesWithSrcAttributes.length) {
                    cb(errors.length ? errors : null);
                }
            },context);
        });
    } else {
        cb();
    }
}

function traverse(state,allScriptAndDataNodesWithSrcAttr){
    function addNodesToNodeList(actionNodes){
        var actionNodesWithSrcAttr = 
                actionNodes.filter(function(actionNode){return (actionNode.type === 'script' || actionNode.type === 'data') && actionNode.src;});

        allScriptAndDataNodesWithSrcAttr.push.apply(allScriptAndDataNodesWithSrcAttr,actionNodesWithSrcAttr);
    }

    if(state.type === 'scxml' && state.rootScript) addNodesToNodeList([state.rootScript]);
    if(state.onEntry) addNodesToNodeList(state.onEntry);
    if(state.onExit) addNodesToNodeList(state.onExit);
    if(state.transitions){
        state.transitions.
            filter(function(t){
                return t.onTransition;
            }).
            map(function(t){
                return t.onTransition;
            }).
            forEach(function(transitionActions){
                addNodesToNodeList(transitionActions);
            });
    }

    if(state.states){
        state.states.forEach(function(childState){traverse(childState,allScriptAndDataNodesWithSrcAttr);});
    }
}


module.exports = documentStringToModel;
