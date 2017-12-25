var constants = require('../constants');

module.exports = {
  [constants.SCXMLNS] : {
    "script" : function(action, builder){
        if (action.src) {
            return builder.handleExternalActionScript(action);
        } else {
            return action.content;
        }
    },

    "assign" : function(action, builder){
        return action.location.expr + " = " + 
          builder.generateFnCall(builder.generateAttributeExpression(action, action.expr ? 'expr' : 'content', action.$type)) + ";";
    },

    "log" : function(action, builder){
        var params = [];

        if(action.label) {
            params.push(JSON.stringify(action.label));
        } else if (action.labelexpr) {
            // extends SCXML 1.0
            params.push(builder.generateFnCall(builder.generateAttributeExpression(action,'labelexpr')));
        } else {
            // always push *something* so the interpreter context
            // can differentiate between label and message
            params.push('null');
        }

        if(action.expr){
            params.push(builder.generateFnCall(builder.generateAttributeExpression(action,'expr')));
        }

        return "this.log(" + params.join(",") + ");";
    },

    "if" : function(action, builder){
        var s = "";
        var ifCondExprName = builder.generateAttributeExpression(action,'cond');

        s += "if(" + builder.generateFnCall(ifCondExprName)  + "){\n";

        var childNodes = action.actions;

        for(var i = 0; i < childNodes.length; i++){
            var child = childNodes[i];

            if(child.$type === "elseif" || child.$type === "else"){
                break;
            }else{
                s += '    ' + builder.generateFnCall(builder.generateActionFunction(child)) + ';\n';
            }
        }

        //process if/else-if, and recurse
        for(; i < childNodes.length; i++){
            child = childNodes[i];

            if(child.$type === "elseif"){

                s+= "}else if(" + builder.generateFnCall(builder.generateAttributeExpression(child,'cond'))  + "){\n";
            }else if(child.$type === "else"){
                s += "}";
                break;
            }else{
                s += '    ' + builder.generateFnCall(builder.generateActionFunction(child)) + ';\n';
            }
        }

        for(; i < childNodes.length; i++){
            child = childNodes[i];

            //this should get encountered first
            if(child.$type === "else"){
                s+= "else{\n";
            }else{
                s += '    ' + builder.generateFnCall(builder.generateActionFunction(child)) + ';\n';
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

    "raise" : function(action){
        return "this.raise({ name:" + JSON.stringify(action.event) + ", data : null});";
    },

    "cancel" : function(action, builder){
        return "this.cancel(" + (action.sendid ? JSON.stringify(action.sendid) : builder.generateFnCall(builder.generateAttributeExpression(action, 'sendidexpr', 'cancel'))) + ");";
    },

    "send" : function(action, builder){

        builder.documentHasSendAction = true;           //set the global flag

        const processAttr = builder.processSendOrInvokeAttr.bind(builder, action);

        var target = processAttr( 'target'),
            targetVariableName = '_scionTargetRef',
            targetDeclaration = 'var ' + targetVariableName + ' = ' + target + ';\n';


        var sendId;
        if(action.id){
          sendId = processAttr('id');
        } else if(action.idlocation){
          sendId = processAttr('idlocation');
        } else{
          sendId = 'undefined';
        }

        var event =
        "{\n" +
         "  target: " + targetVariableName + ",\n" +
         "  name: " + processAttr( 'event') + ",\n" +
         "  data: " + builder.generateFnCall(builder.constructSendEventData(action, builder)) + ",\n" +
         "  sendid: " + sendId  + ",\n" +
         "  origin: _sessionid\n" +
         "}"

        var send =
            targetDeclaration +
            "     this.send(\n" +
                    event + ", \n" +
            "       {\n" +
            "           delay: getDelayInMs(" + processAttr( 'delay') + "),\n" +       //TODO: delay needs to be parsed at runtime
            ((action.type || action.typeexpr) ? ( "  type: " + processAttr( 'type') + ",\n" ) : '') +

            "       });";


        return send;
    },

    "foreach" : function(action, builder){
        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
        var index = action.index || "$i",
            item = action.item,
            arr = action.array.expr,
            foreachFnNames = action.actions ? action.actions.map(builder.generateActionFunction, builder) : [];

        [action.item, action.index, action.array.expr].forEach(function(variableNameToDeclare){
          if(variableNameToDeclare){
            builder.safelyAddVariableToDatamodelAccumulator(variableNameToDeclare, action.$line, action.$column);
          }
        });

        var shallowArrayName = getVariableNameForShallowCopy(builder);

        var forEachContents =
            (!action.index ? 'var ' + index + ';\n' : '') + 
            'var ' + shallowArrayName + ' = ' + arr + ';\n'+
            'if(Array.isArray(' + shallowArrayName + ')){\n' +
            '    for(' + index + ' = 0; ' + index + ' < ' + shallowArrayName + '.length;' + index + '++){\n' +
            '       ' + item + ' = ' + shallowArrayName + '[' + index + '];\n' +
                        foreachFnNames.map(function(fnName){return '       ' + builder.generateFnCall(fnName) + ';';}).join('\n') + '\n' +
            '       if(' + index + ' === (' + shallowArrayName + '.length - 1)) break;\n' +
            '    }\n' +
            '} else if (typeof ' + shallowArrayName + ' === "object"){\n' +
            '    for(' + index + ' in ' + shallowArrayName + '){\n' +
            '        if(' + shallowArrayName + '.hasOwnProperty(' + index + ')){\n' +
            '           ' + item + ' = ' + shallowArrayName + '[' + index + '];\n' +
                            foreachFnNames.map(function(fnName){return '           ' + builder.generateFnCall(fnName) + ';';}).join('\n') + '\n' +
            '        }\n' +
            '    }\n' +
            '} else {\n' +
            '   throw new Error("Variable ' + arr + ' does not contain a legal array value");\n' + 
            '}\n';

        return forEachContents;
    },
    "custom": function (action) {
        var customTagConfig = {
            name : 'Sandbox.action',
            data : action
        };

        return "postMessage(" + JSON.stringify(customTagConfig, null, 4) + ");"
    }
  }
};


function getVariableNameForShallowCopy(builder) {
    //Assign a number higher than current total number of variables in accumulator
    return '$scionArray_' + builder.datamodelAccumulator.length + 1;
}

