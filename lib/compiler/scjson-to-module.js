/**
 * Accept a scjson document as input, either from a file or via stdin.
 * Generate a JavaScript module as output.
 * This module should be customizable: 
    * plain object literal if appropriate
    * simple self-invoking function (for use in scion-scxml)
    * UMD in probably all other cases. although we could make it CommonJS/AMD/etc.
 */ 

//TODO: optimization: if the scjson does not contain a datamodel or any actions, then just dump out the object literal as the module
//TODO: we should also encode the document name. accept as command-line argument, or embed it in the scjson itself, maybe?

var printTrace = false;

//global accumulators
var datamodelAccumulator, fnDecAccumulator, documentHasSendAction;

function generateFnName(actionType,action){
    return '$' + actionType + '_line_' + action.$line + '_column_' + action.$column;
}

var FN_ARGS = '(_event, In, _sessionId, _name, _ioprocessors, _x)';

function generateFnDeclaration(fnName,fnBody){
    if(printTrace) console.log('generateFnDeclaration',fnName,fnBody);

    return 'function ' + fnName + FN_ARGS + '{\n' +
        fnBody.split('\n').map(function(line){return '    ' + line;}).join('\n') + '\n' +   //do some lightweight formatting
    '}';
}

function generateFnCall(fnName){
    if(printTrace) console.log('generateFnCall',fnName);

    return fnName + '.apply(this, arguments)';
}

function generateActionFunction(action){
    if(printTrace) console.log('generateActionFunction',action);

    var fnName = generateFnName(action.type,action);
    var fnBody = actionTags[action.type](action);
    var fnDec = generateFnDeclaration(fnName,fnBody);

    fnDecAccumulator.push(fnDec);

    return fnName;
}

function generateExpressionFunction(expressionType,exprObj){
    if(printTrace) console.log('generateExpressionFunction',expressionType,exprObj);

    var fnName = generateFnName(expressionType,exprObj);
    var fnBody = 'return ' + exprObj.expr  + ';';
    var fnDec = generateFnDeclaration(fnName,fnBody);

    fnDecAccumulator.push(fnDec);

    return fnName;
}

function generateAttributeExpression(attrContainer,attrName){
    if(printTrace) console.log('generateAttributeExpression',attrContainer,attrName);

    return generateExpressionFunction(attrName,attrContainer[attrName]);
}

var REFERENCE_MARKER = '__xx__DELETE_ME__xx__',
    REFERENCE_MARKER_RE = new RegExp('"' + REFERENCE_MARKER + '(.*)' + REFERENCE_MARKER + '"','g') ;

//TODO: need to split this into two parts: one that declares the variables in the datamodel at the top of the module scope, 
//and another single function that inits the model needs to contain a reference to this init function, 
//and the interpreter must know about it. should be optional. 
//call it $scion_init_datamodel. 
function generateDatamodelDeclaration(){
    return datamodelAccumulator.length ? ('var ' + datamodelAccumulator.map(function(data){return data.id;}).join(", ") + ";") : '';
}

var EARLY_BINDING_DATAMODEL_FN_NAME = '$initEarlyBindingDatamodel';

//TODO: make this function more clever and accept the datamodel as an action
function generateEarlyBindingDatamodelInitFn(){
    return  datamodelAccumulator.length ? 
                'var $scion_early_binding_datamodel_has_fired = false;\n' +     //this guard guarantees it will only fire once
                'function ' + EARLY_BINDING_DATAMODEL_FN_NAME + FN_ARGS + '{\n' +
                '    if(!$scion_early_binding_datamodel_has_fired){\n' + 
                         //invoke all datamodel expresions
                         datamodelAccumulator.
                            filter(function(data){return data.expr;}).
                            map(function(data){return '        ' + data.id + ' = ' + generateFnCall(generateExpressionFunction('data',data)) + ';\n';}).join('') + 
                '        $scion_early_binding_datamodel_has_fired = true; ' + '\n' +
                '    }\n' +
                '}' : '';
}


function generateSmObjectLiteral(rootState){
    //pretty simple
    return JSON.stringify(rootState,4,4).replace(REFERENCE_MARKER_RE,'$1');
}

function dumpFunctionDeclarations(){
    //simple
    return fnDecAccumulator.join('\n\n');
}

function dumpHeader(){
    var d = new Date();
    return '//Generated on ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ' by the SCION SCXML compiler';
}


function generateAmdModule(o){

    return 'define' + 
                generateSelfInvokingFunctionInvocationModule(o).slice(0,-2);
}


function generateSelfInvokingFunctionInvocationModule(o){


    return o.headerString + '\n' +
              '(function(){\n' + 
                    [
                        o.sendString,
                        o.rootScript,
                        o.datamodelDeclaration,
                        o.earlyBindingFnDeclaration,
                        o.actionFunctionDeclarations,
                        'return ' + o.objectLiteralString + ';'
                    ].join('\n\n').
                        split('\n').map(function(line){return '    ' + line;}).join('\n') +      //indent
                '})()';
}

function generateCommonJsModule(o){


    return [
            o.headerString,
            o.rootScript,
            o.sendString,
            o.datamodelDeclaration,
            o.earlyBindingFnDeclaration,
            o.actionFunctionDeclarations,
            'module.exports = ' + o.objectLiteralString + ';'
        ].join('\n\n');
}

function generateModule(rootState, moduleType){

    //TODO: enumerate these module types

    if(datamodelAccumulator.length){
        //generalize him as an entry action on the root state
        rootState.onEntry = rootState.onEntry || [];
        //make sure that datamodel initialization fn comes before all other entry actions
        rootState.onEntry = [markAsReference(EARLY_BINDING_DATAMODEL_FN_NAME)].concat(rootState.onEntry);
    }

    //TODO: support other module formats (AMD, UMD, module pattern)
    var o = {
                headerString : dumpHeader(),
                rootScript : (rootState.rootScript && rootState.rootScript.content) || '',
                sendString : (documentHasSendAction ? getDelayInMs.toString() : ''),
                datamodelDeclaration : generateDatamodelDeclaration(),
                earlyBindingFnDeclaration : generateEarlyBindingDatamodelInitFn(),
                actionFunctionDeclarations : dumpFunctionDeclarations()
            };

    delete rootState.rootScript;            //this doesn't need to be in there

    o.objectLiteralString = generateSmObjectLiteral(rootState);
        
    var s;

    switch(moduleType){
        case 'amd':
            s = generateAmdModule(o);
            break;
        case 'umd':
            //TODO
            break;
        case 'commonjs':
            s = generateCommonJsModule(o);
            break;
        default:
            s = generateSelfInvokingFunctionInvocationModule(o);
            break;
    }

    return s;
}

function markAsReference(fnName){
    return  REFERENCE_MARKER + fnName + REFERENCE_MARKER;
}

function replaceActions(actionContainer,actionPropertyName){
    if(actionContainer[actionPropertyName]){
        var actions = Array.isArray(actionContainer[actionPropertyName]) ? actionContainer[actionPropertyName] : [actionContainer[actionPropertyName]] ;
        
        actionContainer[actionPropertyName] = actions.map(generateActionFunction).map(markAsReference);

        if(actionContainer[actionPropertyName].length === 1){
            actionContainer[actionPropertyName] = actionContainer[actionPropertyName][0];
        }
    }
}

function visitState(state){
    //accumulate datamodels
    if(state.datamodel){
        datamodelAccumulator.push.apply(datamodelAccumulator,state.datamodel);
    }

    if(state.onExit) replaceActions(state,'onExit');
    if(state.onEntry) replaceActions(state,'onEntry');

    if(state.transitions){
        state.transitions.forEach(function(transition){
            replaceActions(transition,'onTransition');

            if(transition.cond){
                transition.cond = markAsReference(generateAttributeExpression(transition,'cond'));
            }
        });
    }

    //clean up as we go
    delete state.datamodel;

    if(state.states) state.states.forEach(function(substate){ visitState(substate); });
}

function startTraversal(rootState, moduleType){
    moduleType = moduleType || 'siaf';

    datamodelAccumulator = [];      //init the accumulators
    fnDecAccumulator = [];
    documentHasSendAction = false;

    visitState(rootState);
    return generateModule(rootState,moduleType);
}

var actionTags = {
    "script" : function(action){
        return action.content;
    },

    "assign" : function(action){
        return action.location.expr + " = " + generateFnCall(generateAttributeExpression(action,'expr')) + ";";
    },

    "log" : function(action){
        var params = [];

        if(action.label) params.push(JSON.stringify(action.label));

        if(action.expr){ 
            params.push(generateFnCall(generateAttributeExpression(action,'expr')));
        }

        return "console.log(" + params.join(",") + ");";
    },

    "if" : function(action){
        var s = "";

        var ifCondExprName = generateAttributeExpression(action,'cond');

        s += "if(" + generateFnCall(ifCondExprName)  + "){\n";

        var childNodes = action.actions;

        for(var i = 0; i < childNodes.length; i++){
            var child = childNodes[i];

            if(child.type === "elseif" || child.type === "else"){
                break;
            }else{
                s += '    ' + generateFnCall(generateActionFunction(child)) + ';\n';
            }
        }

        //process if/else-if, and recurse
        for(; i < childNodes.length; i++){
            child = childNodes[i];

            if(child.type === "elseif"){

                s+= "}else if(" + generateFnCall(generateAttributeExpression(child,'cond'))  + "){\n";
            }else if(child.type === "else"){
                s += "}";
                break;
            }else{
                s += '    ' + generateFnCall(generateActionFunction(child)) + ';\n';
            }
        }

        for(; i < childNodes.length; i++){
            child = childNodes[i];

            //this should get encountered first
            if(child.type === "else"){
                s+= "else{\n";
            }else{
                s += '    ' + generateFnCall(generateActionFunction(child)) + ';\n';
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
        return "this.raise({ name:" + JSON.stringify(action.event) + ", data : {}});";
    },

    "cancel" : function(action){
        return "this.cancel(" + JSON.stringify(action.sendid) + ");";
    },

    "send" : function(action){

        documentHasSendAction = true;           //set the global flag

        function processAttr(container,attr){

            var exprName = attr === 'id' ? 'idlocation' : attr + 'expr';  //the conditional is for send/@id vs. send/@idlocation. all others are just attr + 'expr'

            if(container[exprName]){
                var fnName = generateAttributeExpression(container, exprName);
                return generateFnCall(fnName);
            }else if(container[attr]){
                return JSON.stringify(container[attr]);
            }else{
                return null;
            }
        }

        function constructSendEventData(action){

            //content and @contentexpr has priority over namelist and params
            if(action.content){
                return '            ' + JSON.stringify(action.content);     //TODO: inline it if content is pure JSON. call custom attribute 'contentType'?
            }else if(action.contentexpr){
                return generateAttributeExpression(action,'contentexpr');
            }else{
                var s = "{\n";
                var props = [];
                //namelist
                if(action.namelist){
                    action.namelist.expr.trim().split(/ +/).forEach(function(name){
                        props.push('"' + name + '"' + ":" + name);          //FIXME: should add some kind of stack trace here. this is hard, though, because it aggregates multiple expressions to a single line/column 
                    });
                }

                //params
                if(action.params && action.params.length){
                    action.params.forEach(function(param){
                        if(param.expr){
                            props.push('"' + param.name + '"' + ":" + generateFnCall(generateAttributeExpression(param, 'expr')));
                        }else if(param.location){
                            props.push('"' + param.name + '"' + ":" + generateFnCall(generateAttributeExpression(param, 'location')));
                        }
                    });
                }

                s += props.map(function(line){return '    ' + line;}).join(',\n');

                s += "\n}";

                s = s.split('\n').map(function(line){return '            ' + line;}).join('\n');

                return s;
            }
        }



        var target = processAttr(action, 'target'),
            targetVariableName = '_scionTargetRef',
            targetDeclaration = 'var ' + targetVariableName + ' = ' + target + ';\n';

        var event = 
        ["{", 
         "   target: " + targetVariableName + ",", 
         "   name: " + processAttr(action, 'event') + ",", 
         "   type: " + processAttr(action, 'type') + ",", 
         "   data: \n" + constructSendEventData(action) + ",", 
         "   origin: _sessionId", 
         "}"].map(function(line){return '     ' + line;}).join('\n');   //lightweight formatting

        var send =
            targetDeclaration +
            "if(" + targetVariableName + " === '#_internal'){\n" +
            "     this.raise(\n" + 
                      event + ");\n" +
            "}else{\n" +
            "     this.send(\n" + 
                    event + ", \n" +
            "       {\n" + 
            "           delay: getDelayInMs(" + processAttr(action, 'delay') + "),\n" +       //TODO: delay needs to be parsed at runtime
            "           sendId: " + processAttr(action,'id') + "\n" +
            "       });\n" +
            "}";


        return send;
    },

    "foreach" : function(action){
        var isIndexDefined = action.index,
            needsToDeclareIndex = !action.index,
            index = action.index || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
            item = action.item,
            arr = action.array.expr,
            foreachFnNames = action.actions.map(generateActionFunction);

        var forEachContents = 
            (needsToDeclareIndex ? 'var ' + index + ';\n' : '') +
            'if(Array.isArray(' + arr + ')){\n' +
            '    for(' + index + ' = 0; ' + index + ' < ' + arr + '.length;' + index + '++){\n' + 
            '       ' + item + ' = ' + arr + '[' + index + '];\n' + 
                        foreachFnNames.map(function(fnName){return '       ' + generateFnCall(fnName) + ';';}).join('\n') + '\n' +
            '    }\n' +
            '} else{\n' + 
            '    for(' + index + ' in ' + arr + '){\n' + 
            '        if(' + arr + '.hasOwnProperty(' + index + ')){\n' +
            '           ' + item + ' = ' + arr + '[' + index + '];\n' + 
                            foreachFnNames.map(function(fnName){return '           ' + generateFnCall(fnName) + ';';}).join('\n') + '\n' +
            '        }\n' + 
            '    }\n' +
            '}';

        return forEachContents;
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

module.exports = startTraversal;

//for executing directly under node.js
if(require.main === module){
    //read from stdin or file
    //TODO: optionally read from file
    process.stdin.setEncoding('utf8');
    process.stdin.resume();

    var jsonString = '';
    process.stdin.on('data',function(s){
        jsonString  += s;
    });

    process.stdin.on('end',function(){
        var moduleString = startTraversal(JSON.parse(jsonString));
        console.log(moduleString); 
    });

    /*
    var sm = require('./test0.json');
    var moduleString = startTraversal(sm);
    console.log(moduleString); 
    */
}

