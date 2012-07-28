//this model handles code generation for action code
//it should be possible to extend this to support custom actions

var dom = require('./dom'),
    platform = require('../../platform');

function generateCode(action){
    return dom.getElementChildren(action).map(_generateCode).join("\n;;\n");
}

function _generateCode(action){

    var generator = codeGenerators[action.localName];

    if(!generator) throw new Error("Element " + action.localName + " not yet supported");

    return generator(action); 
}

var codeGenerators = {
    "script" : function(action){
        return dom.map(action,function(c){return c.textContent;}).join("\n;;\n");
    },

    "assign" : function(action){
        return action.getAttribute("location") + " = " + action.getAttribute("expr") + ";";
    },

    "if" : function(action){
        var s = "";
        s += "if(" + action.getAttribute("cond") + "){\n";

        for(var i = 0; i < action.childNodes.length; i++){
            var child = action.childNodes[i];

            if(child.localName === "elseif" || child.localName === "else"){ 
                break;
            }else if(child.nodeType === 1){
                s += _generateCode(child) + "\n;;\n";
            }
        }

        //process if/else-if, and recurse
        for(; i < action.childNodes.length; i++){
            child = action.childNodes[i];

            if(child.localName === "elseif"){
                s+= "}else if(" + child.getAttribute("cond") + "){\n";
            }else if(child.localName === "else"){
                s += "}";
                break;
            }else if(child.nodeType === 1){
                s+= _generateCode(child)  + "\n;;\n";
            }
        }

        for(; i < action.childNodes.length; i++){
            child = action.childNodes[i];

            //this should get encountered first
            if(child.localName === "else"){
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

        if(action.hasAttribute("label")) params.push( JSON.stringify(action.getAttribute("label")));
        if(action.hasAttribute("expr")) params.push( action.getAttribute("expr"));

        return "$log(" + params.join(",") + ");";
    },

    "raise" : function(action){
        return "$raise(" + JSON.stringify(action.getAttribute("event")) + ");";
    },

    "cancel" : function(action){
        return "$cancel(" + JSON.stringify(action.getAttribute("sendid")) + ");";
    },

    "send" : function(action){
        return "$send({\n" + 
            "target: " + (action.hasAttribute("targetexpr") ? action.getAttribute("targetexpr") : JSON.stringify(action.getAttribute("target"))) + ",\n" +
            "name: " + (action.hasAttribute("eventexpr") ? action.getAttribute("eventexpr") : JSON.stringify(action.getAttribute("event"))) + ",\n" + 
            "type: " + (action.hasAttribute("typeexpr") ? action.getAttribute("typeexpr") : JSON.stringify(action.getAttribute("type"))) + ",\n" +
            "data: " + constructSendEventData(action) + ",\n" +
            "origin: $origin\n" +
        "}, {\n" + 
            "delay: " + (action.hasAttribute("delayexpr") ? action.getAttribute("delayexpr") : getDelayInMs(action.getAttribute("delay"))) + ",\n" + 
            "sendId: " + (action.hasAttribute("idlocation") ? action.getAttribute("idlocation") : JSON.stringify(action.getAttribute("id"))) + "\n" + 
        "});";
    },

    "foreach" : function(action){
        var isIndexDefined = action.hasAttribute("index"),
            index = action.getAttribute("index") || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
            item = action.getAttribute("item"),
            arr = action.getAttribute("array");

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

    var namelist = action.hasAttribute("namelist") ? action.getAttribute("namelist").trim().split(/ +/) : null,
        params = dom.filter(action,function(child){return child.localName === 'param';}),
        content = dom.filter(action,function(child){return child.localName === 'content';});
        
    console.log("namelist",namelist);
    console.log("params",params);
    console.log("content",content);

    if(content.length){
        //TODO: instead of using textContent, serialize the XML
        return JSON.stringify(content.map(function(child){return child.textContent;})[0]);
    }else if(action.hasAttribute("contentexpr")){
        return action.getAttribute("contentexpr");
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
        name: param.getAttribute("name"),
        expr: param.getAttribute("expr"),
        location: param.getAttribute("location")
    };
}


module.exports = {
    generateCode : generateCode,
    codeGenerators : codeGenerators 
};
