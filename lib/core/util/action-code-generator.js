//this model handles code generation for action code
//it should be possible to extend this to support custom actions

var util = require('./jsonml');

function generateCode(actions){
    return actions.map(_generateCode).join("\n;;\n");
}

function _generateCode(action){
    var tuple = util.deconstructNode(action), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];

    var generator = codeGenerators[tagName];

    if(!generator) throw new Error("Element " + tagName + " not yet supported");

    return generator(attributes,children); 
}

var codeGenerators = {
    "script" : function(attributes,children){
        return children.join("\n;;\n");
    },

    "assign" : function(attributes,children){
        return attributes.location + " = " + attributes.expr + ";";
    },

    "if" : function(attributes,children){
        var s = "";
        s += "if(" + attributes.cond + "){\n";

        for(var i = 0; i < children.length; i++){
            var child = children[i];

            if(child[0] === "elseif" || child[0] === "else"){ 
                break;
            }else if(Array.isArray(child)){
                s += _generateCode(child) + "\n;;\n";
            }
        }

        //process if/else-if, and recurse
        for(; i < children.length; i++){
            child = children[i];

            if(child[0] === "elseif"){
                s+= "}else if(" + child[1].cond + "){\n";
            }else if(child[0] === "else"){
                s += "}";
                break;
            }else if(Array.isArray(child)){
                s+= _generateCode(child)  + "\n;;\n";
            }
        }

        for(; i < children.length; i++){
            child = children[i];

            //this should get encountered first
            if(child[0] === "else"){
                s+= "else{\n";
            }else if(Array.isArray(child)){
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

    "log" : function(attributes,children){
        var params = [];

        if(attributes.label) params.push( JSON.stringify(attributes.label));
        if(attributes.expr) params.push( attributes.expr);

        return "$log(" + params.join(",") + ");";
    },

    "raise" : function(attributes,children){
        return "$raise(" + JSON.stringify(attributes.event) + ");";
    },

    "cancel" : function(attributes,children){
        return "$cancel(" + JSON.stringify(attributes.sendid) + ");";
    },

    "send" : function(attributes,children){
        return "$send({\n" + 
            "target: " + (attributes.targetexpr ? attributes.targetexpr : JSON.stringify(attributes.target)) + ",\n" +
            "name: " + (attributes.eventexpr ? attributes.eventexpr : JSON.stringify(attributes.event)) + ",\n" + 
            "type: " + (attributes.typeexpr ? attributes.typeexpr : JSON.stringify(attributes.type)) + ",\n" +
            "data: " + constructSendEventData(attributes,children) + ",\n" +
            "origin: $origin\n" +
        "}, {\n" + 
            "delay: " + (attributes.delayexpr ? attributes.delayexpr : getDelayInMs(attributes.delay)) + ",\n" + 
            "sendId: " + (attributes.idlocation ? attributes.idlocation : JSON.stringify(attributes.id)) + "\n" + 
        "});";
    },

    "foreach" : function(attributes,children){
        var isIndexDefined = attributes.index,
            index = attributes.index || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
            item = attributes.item,
            arr = attributes.array;

        return "(function(){\n" + 
            "for(" + (isIndexDefined  ? "" : "var " + index + " = 0") + "; " + index + " < " + arr + ".length; " + index + "++){\n" + 
                item + " = " + arr + "[" + index + "];\n" + 
                children.filter(Array.isArray).map(_generateCode).join("\n;;\n") + 
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

function constructSendEventData(attributes,children){

    var namelist = attributes && attributes.namelist && attributes.namelist.trim().split(/ +/),
        params = children.filter(function(child){return child[0] === 'param';}).map(function(child){return processParam(child);}),
        content = children.filter(function(child){return child[0] === 'content';}).map(function(child){return util.deconstructNode(child)[2][0];})[0];

    if(content){
        return JSON.stringify(content);
    }else if(attributes.contentexpr){
        return attributes.contentexpr;
    }else{
        var s = "{";
        //namelist
        if(namelist){
            namelist.forEach(function(name){
                s += '"' + name + '"' + ":" + name + ",\n";
            });
        }

        //params
        if(params){
            params.forEach(function(param){
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
    var tuple = util.deconstructNode(param), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];
    return {
        name: attributes.name,
        expr: attributes.expr,
        location: attributes.location
    };
}


module.exports = {
    generateCode : generateCode,
    codeGenerators : codeGenerators 
};
