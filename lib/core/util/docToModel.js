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

function documentToModel(url,doc,cb,context){
    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(pm.platform.getResourceFromUrl){
        inlineSrcs(url,doc,context,function(errors){
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

function inlineSrcs(docUrl,doc,context,cb){
    //console.log('inlining scripts');

    var nodesWithSrcAttributes = [], errors = [], resultCount = 0;

    traverse(doc.documentElement,nodesWithSrcAttributes);

    if (nodesWithSrcAttributes.length) {
        // kick off fetches in parallel
        nodesWithSrcAttributes.forEach(function(node, idx) {
            var nodeUrl = pm.platform.dom.getAttribute(node,"src");
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
                    pm.platform.dom.textContent(node,text);
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

function traverse(node,nodeList){
    if((pm.platform.dom.localName(node) === 'script' || pm.platform.dom.localName(node) === 'data') && pm.platform.dom.hasAttribute(node,"src")){
        nodeList.push(node);
    }

    pm.platform.dom.getElementChildren(node).forEach(function(child){traverse(child,nodeList);});
}


module.exports = documentToModel;
