//this model handles code generation for action code
//it should be possible to extend this to support custom actions

var dom = require('./dom'),
    platform = require('../../platform');

function generateCode(action){
    return dom.getElementChildren(action).map(_generateCode).join("\n;;\n");
}

function _generateCode(action){

    var generator = codeGenerators[dom.localName(action)];

    if(!generator) throw new Error("Element " + dom.localName(action) + " not yet supported");

    return generator(action); 
}

var codeGenerators = {
    "script" : function(action){
        return dom.map(action,function(c){return c.textContent;}).join("\n;;\n");
    },

    "assign" : function(action){
        return dom.getAttribute(action,"location") + " = " + dom.getAttribute(action,"expr") + ";";
    },

    "if" : function(action){
        var s = "";
        s += "if(" + dom.getAttribute(action,"cond") + "){\n";

        for(var i = 0; i < action.childNodes.length; i++){
            var child = action.childNodes[i];

            if(dom.localName(child) === "elseif" || dom.localName(child) === "else"){ 
                break;
            }else if(child.nodeType === 1){
                s += _generateCode(child) + "\n;;\n";
            }
        }

        //process if/else-if, and recurse
        for(; i < action.childNodes.length; i++){
            child = action.childNodes[i];

            if(dom.localName(child) === "elseif"){
                s+= "}else if(" + dom.getAttribute(child,"cond") + "){\n";
            }else if(dom.localName(child) === "else"){
                s += "}";
                break;
            }else if(child.nodeType === 1){
                s+= _generateCode(child)  + "\n;;\n";
            }
        }

        for(; i < action.childNodes.length; i++){
            child = action.childNodes[i];

            //this should get encountered first
            if(dom.localName(child) === "else"){
                s+= "else{\n";
            }else if(child.nodeType === 1){
                s+= _generateCode(child)  + "\n;;\n";
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
                dom.getElementChildren(action).map(_generateCode).join("\n;;\n") + 
            "\n}\n" + 
        "})();";
    }
};

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

function constructSendEventData(action){

    var namelist = action.hasAttribute("namelist") ? dom.getAttribute(action,"namelist").trim().split(/ +/) : null,
        params = dom.filter(action,function(child){return dom.localName(child) === 'param';}),
        content = dom.filter(action,function(child){return dom.localName(child) === 'content';});
        
    console.log("namelist",namelist);
    console.log("params",params);
    console.log("content",content);

    if(content.length){
        //TODO: instead of using textContent, serialize the XML
        return JSON.stringify(content.map(function(child){return child.textContent;})[0]);
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
    generateCode : generateCode,
    codeGenerators : codeGenerators 
};
