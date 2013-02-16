module.exports = {
    "script" : function(action){
        return action.content;
    },

    "assign" : function(action){
        return action.location + " = " + action.expr.expr + ";";
    }

    //TODO: other SCXML actions
    /*
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
        return "$raise({ name:" + JSON.stringify(pm.platform.dom.getAttribute(action,"event")) + ", data : {}});";
    },

    "cancel" : function(action){
        return "$cancel(" + JSON.stringify(pm.platform.dom.getAttribute(action,"sendid")) + ");";
    },

    "send" : function(action){
        var target = (pm.platform.dom.hasAttribute(action,"targetexpr") ? pm.platform.dom.getAttribute(action,"targetexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"target"))),
            targetVariableName = '_scionTargetRef',
            targetDeclaration = 'var ' + targetVariableName + ' = ' + target + ';\n';

        var event = "{\n" +
            "target: " + targetVariableName + ",\n" +
            "name: " + (pm.platform.dom.hasAttribute(action,"eventexpr") ? pm.platform.dom.getAttribute(action,"eventexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"event"))) + ",\n" +
            "type: " + (pm.platform.dom.hasAttribute(action,"typeexpr") ? pm.platform.dom.getAttribute(action,"typeexpr") : JSON.stringify(pm.platform.dom.getAttribute(action,"type"))) + ",\n" +
            "data: " + constructSendEventData(action) + ",\n" +
            "origin: $origin\n" +
        "}";

        var send =
            targetDeclaration +
            "if(" + targetVariableName + " === '#_internal'){\n" +
                 "$raise(" + event  + ");\n" +
            "}else{\n" +
                "$send(" + event + ", {\n" +
                    "delay: " + (pm.platform.dom.hasAttribute(action,"delayexpr") ? 'getDelayInMs(' + pm.platform.dom.getAttribute(action,"delayexpr") + ')' : getDelayInMs(pm.platform.dom.getAttribute(action,"delay"))) + ",\n" +
                    "sendId: " + (pm.platform.dom.hasAttribute(action,"idlocation") ? pm.platform.dom.getAttribute(action,"idlocation") : JSON.stringify(pm.platform.dom.getAttribute(action,"id"))) + "\n" +
                "}, $raise);" +
            "}";

        return send;
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
    */
};
