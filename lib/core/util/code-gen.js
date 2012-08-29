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

//this model handles code generation for action code
//it should be possible to extend this to support custom actions

"use strict";

var pm = require('../../platform'),
    constants = require('../constants');

function parentToFnBody(action){
    return pm.platform.dom.getElementChildren(action).map(actionTagToFnBody).join("\n;;\n");
}

function actionTagToFnBody(action){

    var generator = actionTags[pm.platform.dom.namespaceURI(action)];
    var generatorFn = generator && generator[pm.platform.dom.localName(action)];

    if(!(generator && generatorFn)) throw new Error("Element " + pm.platform.dom.namespaceURI(action) + ':' + pm.platform.dom.localName(action) + " not yet supported");

    return generatorFn(action); 
}

var actionTags = {
    "" : {
        "script" : function(action){
            return pm.platform.dom.getChildren(action).map(function(c){return pm.platform.dom.textContent(c);}).join("\n;;\n");
        },

        "assign" : function(action){
            return pm.platform.dom.getAttribute(action,"location") + " = " + pm.platform.dom.getAttribute(action,"expr") + ";";
        },

        "if" : function(action){
            var s = "";
            s += "if(" + pm.platform.dom.getAttribute(action,"cond") + "){\n";

            var childNodes = pm.platform.dom.getElementChildren(action);

            for(var i = 0; i < childNodes.length; i++){
                var child = childNodes[i];

                if(pm.platform.dom.localName(child) === "elseif" || pm.platform.dom.localName(child) === "else"){ 
                    break;
                }else{
                    s += actionTagToFnBody(child) + "\n;;\n";
                }
            }

            //process if/else-if, and recurse
            for(; i < childNodes.length; i++){
                child = childNodes[i];

                if(pm.platform.dom.localName(child) === "elseif"){
                    s+= "}else if(" + pm.platform.dom.getAttribute(child,"cond") + "){\n";
                }else if(pm.platform.dom.localName(child) === "else"){
                    s += "}";
                    break;
                }else{
                    s+= actionTagToFnBody(child)  + "\n;;\n";
                }
            }

            for(; i < childNodes.length; i++){
                child = childNodes[i];

                //this should get encountered first
                if(pm.platform.dom.localName(child) === "else"){
                    s+= "else{\n";
                }else{
                    s+= actionTagToFnBody(child)  + "\n;;\n";
                }
            }
            s+= "}";

            return s;
        },

        "elseif" : function(){
            throw new Error("Encountered unexpected elseif tag.");
        },

        "else" : function(){
            throw new Error("Encountered unexpected else tag.");
        },

        "log" : function(action){
            var params = [];

            if(pm.platform.dom.hasAttribute(action,"label")) params.push( JSON.stringify(pm.platform.dom.getAttribute(action,"label")));
            if(pm.platform.dom.hasAttribute(action,"expr")) params.push( pm.platform.dom.getAttribute(action,"expr"));

            return "$log(" + params.join(",") + ");";
        },

        "raise" : function(action){
            return "$raise(" + JSON.stringify(pm.platform.dom.getAttribute(action,"event")) + ");";
        },

        "cancel" : function(action){
            return "$cancel(" + JSON.stringify(pm.platform.dom.getAttribute(action,"sendid")) + ");";
        },

        "send" : function(action){
            return "$send({\n" + 
                "target: " + (pm.platform.dom.hasAttribute(action,"targetexpr") ? pm.platform.dom.getAttribute(action,"targetexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"target"))) + ",\n" +
                "name: " + (pm.platform.dom.hasAttribute(action,"eventexpr") ? pm.platform.dom.getAttribute(action,"eventexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"event"))) + ",\n" + 
                "type: " + (pm.platform.dom.hasAttribute(action,"typeexpr") ? pm.platform.dom.getAttribute(action,"typeexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"type"))) + ",\n" +
                "data: " + constructSendEventData(action) + ",\n" +
                "origin: $origin\n" +
            "}, {\n" + 
                "delay: " + (pm.platform.dom.hasAttribute(action,"delayexpr") ? pm.platform.dom.getAttribute(action,"delayexpr") : getDelayInMs(pm.platform.dom.getAttribute(action,"delay"))) + ",\n" + 
                "sendId: " + (pm.platform.dom.hasAttribute(action,"idlocation") ? pm.platform.dom.getAttribute(action,"idlocation") : JSON.stringify(pm.platform.dom.getAttribute(action,"id"))) + "\n" + 
            "});";
        },

        "foreach" : function(action){
            var isIndexDefined = pm.platform.dom.hasAttribute(action,"index"),
                index = pm.platform.dom.getAttribute(action,"index") || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
                item = pm.platform.dom.getAttribute(action,"item"),
                arr = pm.platform.dom.getAttribute(action,"array"),
                foreachBody = pm.platform.dom.getElementChildren(action).map(actionTagToFnBody).join("\n;;\n");

            return "(function(){\n" + 
                "if(Array.isArray(" + arr + ")){\n" +
                    arr + ".forEach(function(" + item + "," + index + "){\n" +
                        foreachBody +
                    "\n});\n" + 
                "}else{\n" +
                    //assume object
                    "Object.keys(" + arr + ").forEach(function(" + index + "){\n" +
                        item + " = " + arr + "[" + index + "];\n" + 
                        foreachBody +
                    "\n});\n" + 
                "}\n" + 
            "})();";
        }
    }
};

actionTags[constants.SCXML_NS] = actionTags[""];   //alias SCXML namespace to default namespace

function getDelayInMs(delayString){
    if (!delayString) {
        return 0;
    } else {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else {
            return parseFloat(delayString);
        }
    }
}

//utility functions
//this creates the string which declares the datamodel in the document scope
function makeDatamodelDeclaration(datamodel){
    var s = "var ";
    var vars = [];
    for(var id in datamodel){
        var expr = datamodel[id];
        vars.push(expr ? id + " = " + expr : id);
    }
    return vars.length ? (s + vars.join(", ") + ";") : "";
}

//this exposes a getter and setter API on the datamodel in the document scope
function makeDatamodelClosures(datamodel){
    var vars = [];
    for(var id in datamodel){
        vars.push( '"' + id + '" : {\n' + 
            '"set" : function(v){ return ' + id + ' = v; },\n' + 
            '"get" : function(){ return ' + id + ';}' + 
        '\n}');
    }
    return '{\n' + vars.join(',\n') + '\n}';
}

function wrapFunctionBodyInDeclaration(action,isExpression){
    return "function(getData,setData,_events,$raise){var _event = _events[0];\n" +
        (isExpression ? "return" : "") + " " + action + 
    "\n}";
}


function makeTopLevelFunctionBody(datamodelDeclaration,topLevelScripts,datamodelClosures,actionStrings){
    return  datamodelDeclaration + 
            (topLevelScripts.length ? topLevelScripts.join("\n") : "") + 
            "return {\n" + 
                "datamodel:" + datamodelClosures + "," + 
                "actions:[\n" + actionStrings.join(",\n") + "\n]" +   //return all functions which get called during execution
            "\n};";
}

function wrapTopLevelFunctionBodyInDeclaration(fnBody){
    return "function($log,$cancel,$send,$origin,In,require){\n" + fnBody + "\n}";
}

//this function ensures that the code in each SCXML document will run in "document scope".
//SCXML embeds js code as strings in the document, hence the use of "eval" to dynamically evaluate things.
//This function ensures that eval() is only called once, when the model is parsed. It will not be called during execution of the statechart.
//However, each SCXML interpreter instance will have its own copies of the functions declared in the document. 
//This is similar to the way HTML works - each page has its own copies of evaluated scripts.
function makeActionFactory(topLevelScripts,actionStrings,datamodel){
    var datamodelDeclaration = makeDatamodelDeclaration(datamodel);
    var datamodelClosures = makeDatamodelClosures(datamodel);
    var topLevelFnBody = makeTopLevelFunctionBody(datamodelDeclaration,topLevelScripts,datamodelClosures,actionStrings);
    var fnStr = wrapTopLevelFunctionBodyInDeclaration(topLevelFnBody);
    return fnStr; 
}


function constructSendEventData(action){

    var namelist = pm.platform.dom.hasAttribute(action,"namelist") ? pm.platform.dom.getAttribute(action,"namelist").trim().split(/ +/) : null,
        params = pm.platform.dom.getChildren(action).filter(function(child){return pm.platform.dom.localName(child) === 'param';}),
        content = pm.platform.dom.getChildren(action).filter(function(child){return pm.platform.dom.localName(child) === 'content';});
        
    if(content.length){
        //TODO: instead of using textContent, serialize the XML
        content = content[0];
        if(pm.platform.dom.getAttribute(content,'type') === 'application/json'){
            return pm.platform.dom.textContent(content);
        }else{
            return JSON.stringify(pm.platform.dom.textContent(content));
        }
    }else if(pm.platform.dom.hasAttribute(action,"contentexpr")){
        return pm.platform.dom.getAttribute(action,"contentexpr");
    }else{
        var s = "{";
        //namelist
        if(namelist){
            namelist.forEach(function(name){
                s += '"' + name + '"' + ":" + name + ",\n";
            });
        }

        //params
        if(params.length){
            params.map(function(child){return processParam(child);}).forEach(function(param){
                if(param.expr){
                    s += '"' + param.name + '"' + ":" + param.expr + ",\n";
                }else if(param.location){
                    s += '"' + param.name + '"' + ":" + param.location + ",\n";
                }
            });
        }

        s += "}";
        return s;
    }
}

function processParam(param) {
    return {
        name: pm.platform.dom.getAttribute(param,"name"),
        expr: pm.platform.dom.getAttribute(param,"expr"),
        location: pm.platform.dom.getAttribute(param,"location")
    };
}


module.exports = {
    gen : {
        parentToFnBody : parentToFnBody,
        actionTagToFnBody  : actionTagToFnBody,
        actionTags : actionTags,
        util : {
            makeDatamodelDeclaration : makeDatamodelDeclaration,
            makeDatamodelClosures : makeDatamodelClosures,
            wrapFunctionBodyInDeclaration : wrapFunctionBodyInDeclaration,
            makeTopLevelFunctionBody : makeTopLevelFunctionBody,
            wrapTopLevelFunctionBodyInDeclaration : wrapTopLevelFunctionBodyInDeclaration,
            makeActionFactory : makeActionFactory
        }
    }
};
