//this model handles code generation for action code
//it should be possible to extend this to support custom actions

var dom = require('./dom'),
    platform = require('../../platform'),
    constants = require('../constants');

function parentToFnBody(action){
    return dom.getElementChildren(action).map(actionTagToFnBody).join("\n;;\n");
}

function actionTagToFnBody(action){

    var generator = actionTags[dom.namespaceURI(action)];
    var generatorFn = generator && generator[dom.localName(action)];

    if(!(generator && generatorFn)) throw new Error("Element " + dom.namespaceURI(action) + ':' + dom.localName(action) + " not yet supported");

    return generatorFn(action); 
}

var actionTags = {
    "" : {
        "script" : function(action){
            return dom.map(action,function(c){return dom.textContent(c);}).join("\n;;\n");
        },

        "assign" : function(action){
            return dom.getAttribute(action,"location") + " = " + dom.getAttribute(action,"expr") + ";";
        },

        "if" : function(action){
            var s = "";
            s += "if(" + dom.getAttribute(action,"cond") + "){\n";

            for(var i = 0; i < action.childNodes.length; i++){
                var child = dom.getItem(action.childNodes,i);

                if(dom.localName(child) === "elseif" || dom.localName(child) === "else"){ 
                    break;
                }else if(child.nodeType === 1){
                    s += actionTagToFnBody(child) + "\n;;\n";
                }
            }

            //process if/else-if, and recurse
            for(; i < action.childNodes.length; i++){
                child = dom.getItem(action.childNodes,i);

                if(dom.localName(child) === "elseif"){
                    s+= "}else if(" + dom.getAttribute(child,"cond") + "){\n";
                }else if(dom.localName(child) === "else"){
                    s += "}";
                    break;
                }else if(child.nodeType === 1){
                    s+= actionTagToFnBody(child)  + "\n;;\n";
                }
            }

            for(; i < action.childNodes.length; i++){
                child = dom.getItem(action.childNodes,i);

                //this should get encountered first
                if(dom.localName(child) === "else"){
                    s+= "else{\n";
                }else if(child.nodeType === 1){
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

            if(action.hasAttribute("label")) params.push( JSON.stringify(dom.getAttribute(action,"label")));
            if(action.hasAttribute("expr")) params.push( dom.getAttribute(action,"expr"));

            return "$log(" + params.join(",") + ");";
        },

        "raise" : function(action){
            return "$raise(" + JSON.stringify(dom.getAttribute(action,"event")) + ");";
        },

        "cancel" : function(action){
            return "$cancel(" + JSON.stringify(dom.getAttribute(action,"sendid")) + ");";
        },

        "send" : function(action){
            return "$send({\n" + 
                "target: " + (action.hasAttribute("targetexpr") ? dom.getAttribute(action,"targetexpr") : JSON.stringify(dom.getAttribute(action,"target"))) + ",\n" +
                "name: " + (action.hasAttribute("eventexpr") ? dom.getAttribute(action,"eventexpr") : JSON.stringify(dom.getAttribute(action,"event"))) + ",\n" + 
                "type: " + (action.hasAttribute("typeexpr") ? dom.getAttribute(action,"typeexpr") : JSON.stringify(dom.getAttribute(action,"type"))) + ",\n" +
                "data: " + constructSendEventData(action) + ",\n" +
                "origin: $origin\n" +
            "}, {\n" + 
                "delay: " + (action.hasAttribute("delayexpr") ? dom.getAttribute(action,"delayexpr") : getDelayInMs(dom.getAttribute(action,"delay"))) + ",\n" + 
                "sendId: " + (action.hasAttribute("idlocation") ? dom.getAttribute(action,"idlocation") : JSON.stringify(dom.getAttribute(action,"id"))) + "\n" + 
            "});";
        },

        "foreach" : function(action){
            var isIndexDefined = action.hasAttribute("index"),
                index = dom.getAttribute(action,"index") || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
                item = dom.getAttribute(action,"item"),
                arr = dom.getAttribute(action,"array");

            return "(function(){\n" + 
                "for(" + (isIndexDefined  ? "" : "var " + index + " = 0") + "; " + index + " < " + arr + ".length; " + index + "++){\n" + 
                    item + " = " + arr + "[" + index + "];\n" + 
                    dom.getElementChildren(action).map(actionTagToFnBody).join("\n;;\n") + 
                "\n}\n" + 
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
    return "function($log,$cancel,$send,$origin,In){\n" + fnBody + "\n}";
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

    var namelist = action.hasAttribute("namelist") ? dom.getAttribute(action,"namelist").trim().split(/ +/) : null,
        params = dom.filter(action,function(child){return dom.localName(child) === 'param';}),
        content = dom.filter(action,function(child){return dom.localName(child) === 'content';});
        
    if(content.length){
        //TODO: instead of using textContent, serialize the XML
        return JSON.stringify(content.map(function(child){return dom.textContent(child);})[0]);
    }else if(action.hasAttribute("contentexpr")){
        return dom.getAttribute(action,"contentexpr");
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
        name: dom.getAttribute(param,"name"),
        expr: dom.getAttribute(param,"expr"),
        location: dom.getAttribute(param,"location")
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
