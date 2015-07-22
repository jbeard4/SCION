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
//TODO #340: check for collisions in the datamodel for all of the SCION identifiers in the same scope
var datamodelAccumulator, 
      fnDecAccumulator, 
      documentHasSendAction, 
      documentHasSendActionWithIdlocationAttribute, 
      sendIdAccumulator;

function generateFnName(actionType,action){
    return '$' + actionType + '_line_' + action.$line + '_column_' + action.$column;
}

var FN_ARGS = '(_event)';

var stripNsPrefixRe = /^(?:{(?:[^}]*)})?(.*)$/;
function stripAttrNsPrefix(attrName){
  var m = attrName.match(stripNsPrefixRe);
  return m[1];
}

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

    var fnName = generateFnName(action.$type,action);
    var fnBody = actionTags[action.$type] ? actionTags[action.$type](action) : actionTags['custom'](action);
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

    return generateExpressionFunction(stripAttrNsPrefix(attrName), attrContainer[attrName]);
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

var SERIALIZE_DATAMODEL_FN_NAME = '$serializeDatamodel';

function generateDatamodelSerializerFn(){
    return 'function ' + SERIALIZE_DATAMODEL_FN_NAME + '(){\n' +
           '   return {\n' + 
                datamodelAccumulator.map(function(data){return '    "' + data.id + '" : ' + data.id;}).join(',\n') + '\n' +
           '   };\n' +
           '}';
}

var DESERIALIZE_DATAMODEL_FN_NAME = '$deserializeDatamodel',
    DESERIALIZE_DATAMODEL_FN_ARG = '$serializedDatamodel';

function generateDatamodelDeserializerFn(){
    return 'function ' + DESERIALIZE_DATAMODEL_FN_NAME + '(' + DESERIALIZE_DATAMODEL_FN_ARG  + '){\n' +
                datamodelAccumulator.map(function(data){return '    ' + data.id + ' = ' + DESERIALIZE_DATAMODEL_FN_ARG  + '["' + data.id + '"];';}).join('\n') + '\n' +
                '    ' + EARLY_BINDING_DATAMODEL_GUARD + ' = true;\n' +     //set the guard condition to true
           '}';
}


var EARLY_BINDING_DATAMODEL_FN_NAME = '$initEarlyBindingDatamodel';
var EARLY_BINDING_DATAMODEL_GUARD = '$scion_early_binding_datamodel_has_fired';

//TODO: make this function more clever and accept the datamodel as an action
function generateEarlyBindingDatamodelInitFn(){
    return  datamodelAccumulator.length ? 
                'var ' + EARLY_BINDING_DATAMODEL_GUARD + '= false;\n' +     //this guard guarantees it will only fire once
                'function ' + EARLY_BINDING_DATAMODEL_FN_NAME + FN_ARGS + '{\n' +
                '    if(!' + EARLY_BINDING_DATAMODEL_GUARD + '){\n' + 
                         //invoke all datamodel expresions
                         datamodelAccumulator.
                            filter(function(data){return data.expr;}).
                            map(function(data){return '        ' + data.id + ' = ' + generateFnCall(generateExpressionFunction('data',data.expr)) + ';\n';}).join('') + 
                '        ' + EARLY_BINDING_DATAMODEL_GUARD + ' = true; ' + '\n' +
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

function generateFactoryFunctionWrapper(o, name){

    return '(function (_x,_sessionid,_ioprocessors,In){\n' + 
            '   var _name = \'' + name + '\';' +
                    //'console.log(_x,_sessionid,_name,_ioprocessors,In);\n' +
                    [
                        o.sendString,
                        o.rootScript,
                        o.datamodelDeclaration,
                        o.sendIdLocationString,
                        o.earlyBindingFnDeclaration,
                        o.datamodelDeserializerFnDeclaration,
                        o.datamodelSerializerFnDeclaration, 
                        o.actionFunctionDeclarations,
                        'return ' + o.objectLiteralString + ';'
                    ].join('\n\n').
                        split('\n').map(function(line){return '    ' + line;}).join('\n') +      //indent
                '})';
}

function generateModule(rootState, moduleType){

    //TODO: enumerate these module types

    if(datamodelAccumulator.length){
        //generalize him as an entry action on the root state
        rootState.onEntry = rootState.onEntry || [];
        //make sure that datamodel initialization fn comes before all other entry actions
        rootState.onEntry = [markAsReference(EARLY_BINDING_DATAMODEL_FN_NAME)].concat(rootState.onEntry);
    }

    //attach datamodel serialization functions
    rootState[DESERIALIZE_DATAMODEL_FN_NAME] = markAsReference(DESERIALIZE_DATAMODEL_FN_NAME);
    rootState[SERIALIZE_DATAMODEL_FN_NAME] = markAsReference(SERIALIZE_DATAMODEL_FN_NAME);

    //console.log('rootState.rootScripts',rootState.rootScripts);

    //TODO: support other module formats (AMD, UMD, module pattern)
    var o = {
                headerString : dumpHeader(),
                rootScript : rootState.rootScripts ? rootState.rootScripts.map(function(s){return s.content;}).join('\n') : '',
                sendString : (documentHasSendAction ? getDelayInMs.toString() : ''),
                sendIdLocationString : (documentHasSendActionWithIdlocationAttribute  ? generateIdlocationGenerator() : ''),
                datamodelDeclaration : generateDatamodelDeclaration(),
                earlyBindingFnDeclaration : generateEarlyBindingDatamodelInitFn(),
                datamodelDeserializerFnDeclaration : generateDatamodelDeserializerFn(),
                datamodelSerializerFnDeclaration : generateDatamodelSerializerFn(),
                actionFunctionDeclarations : dumpFunctionDeclarations()
            };

    delete rootState.rootScripts;            //this doesn't need to be in there

    o.objectLiteralString = generateSmObjectLiteral(rootState);
        
    var s = generateFactoryFunctionWrapper(o, rootState.name);

    var r;

    switch(moduleType){
        case 'amd':
            //r = 'define' + s;
            throw new Error('AMD not yet supported');
            break;
        case 'umd':
            throw new Error('UMD not yet supported');
            break;
        case 'commonjs':
            r = 'module.exports = ' + s + ';';
            break;
        default:
            r = s;
            break;
    }

    r = o.headerString + '\n' + r;

    return r;
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
    sendIdAccumulator = [];
    documentHasSendAction = false;
    documentHasSendActionWithIdlocationAttribute = false; 

    visitState(rootState);

    return { module: generateModule(rootState,moduleType), name: rootState.name }
}

function safelyAddVariableToDatamodelAccumulator(variableName,lineNum,colNum){
    if(!datamodelAccumulator.some(function(data){ return data.id === variableName;})){
        // add datamodel declaration to the accumulator  
        datamodelAccumulator.push({
          $line : lineNum,
          $col : colNum,
          id : variableName 
        });
    }
}

function getVariableNameForShallowCopy () {
    //Assign a number higher than current total number of variables in accumulator
    return '$scionArray_' + datamodelAccumulator.length + 1;
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

        return "this.log(" + params.join(",") + ");";
    },

    "if" : function(action){
        var s = "";

        var ifCondExprName = generateAttributeExpression(action,'cond');

        s += "if(" + generateFnCall(ifCondExprName)  + "){\n";

        var childNodes = action.actions;

        for(var i = 0; i < childNodes.length; i++){
            var child = childNodes[i];

            if(child.$type === "elseif" || child.$type === "else"){
                break;
            }else{
                s += '    ' + generateFnCall(generateActionFunction(child)) + ';\n';
            }
        }

        //process if/else-if, and recurse
        for(; i < childNodes.length; i++){
            child = childNodes[i];

            if(child.$type === "elseif"){

                s+= "}else if(" + generateFnCall(generateAttributeExpression(child,'cond'))  + "){\n";
            }else if(child.$type === "else"){
                s += "}";
                break;
            }else{
                s += '    ' + generateFnCall(generateActionFunction(child)) + ';\n';
            }
        }

        for(; i < childNodes.length; i++){
            child = childNodes[i];

            //this should get encountered first
            if(child.$type === "else"){
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


            if(attr === 'id'){
              sendIdAccumulator.push(container[attr]); 
            }

            var exprName = attr + 'expr';

            if(attr === 'idlocation'){
              documentHasSendActionWithIdlocationAttribute = true;
              var fakeExpr = JSON.parse(JSON.stringify(container));
              //FIXME: overwriting this variable is a bit ugly.
              //if we're going to generate this expr on the fly, it would be better to clone the container.
              container[attr].expr = container[attr].expr + '=' + generateFnCall(GENERATE_SENDID_FN_NAME);  
              var fnName = generateAttributeExpression(container, attr);
              return generateFnCall(fnName); 
            }else if(container[exprName]){
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
                return generateFnCall(generateAttributeExpression(action,'contentexpr'));
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
         "   origin: _sessionid", 
         "}"].map(function(line){return '     ' + line;}).join('\n');   //lightweight formatting

        var sendId;
        if(action.id){
          sendId = processAttr(action,'id');
        } else if(action.idlocation){
          sendId = processAttr(action,'idlocation');
        } else{
          sendId = 'null';
        }
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
            "           sendid: " + sendId  + "\n" +
            "       });\n" +
            "}";


        return send;
    },

    "foreach" : function(action){
        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
        var index = action.index || "$i",
            item = action.item,
            arr = action.array.expr,
            foreachFnNames = action.actions ? action.actions.map(generateActionFunction) : [];

        [action.item, action.index, action.array.expr].forEach(function(variableNameToDeclare){
          if(variableNameToDeclare){ 
            safelyAddVariableToDatamodelAccumulator(variableNameToDeclare, action.$line, action.$column);
          }
        });

        var shallowArrayName = getVariableNameForShallowCopy();

        var forEachContents = 
            shallowArrayName + ' = ' + arr + ';\n'+
            'if(Array.isArray(' + shallowArrayName + ')){\n' +
            '    for(' + index + ' = 0; ' + index + ' < ' + shallowArrayName + '.length;' + index + '++){\n' + 
            '       ' + item + ' = ' + shallowArrayName + '[' + index + '];\n' + 
                        foreachFnNames.map(function(fnName){return '       ' + generateFnCall(fnName) + ';';}).join('\n') + '\n' +
            '    }\n' +
            '} else{\n' + 
            '    for(' + index + ' in ' + shallowArrayName + '){\n' + 
            '        if(' + shallowArrayName + '.hasOwnProperty(' + index + ')){\n' +
            '           ' + item + ' = ' + shallowArrayName + '[' + index + '];\n' + 
                            foreachFnNames.map(function(fnName){return '           ' + generateFnCall(fnName) + ';';}).join('\n') + '\n' +
            '        }\n' + 
            '    }\n' +
            '}';

        return forEachContents;
    },
    "custom": function (action) {
        var customTagConfig = {
            name : 'Sandbox.action',
            data : action
        };

        return "postMessage(" + JSON.stringify(customTagConfig, null, 4) + ");"
    }
};

function getDelayInMs(delayString){
    if(typeof delayString === 'string') {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else if (delayString.slice(-1) === "m") {
            return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
        } else {
            return parseFloat(delayString);
        }
    }else if (typeof delayString === 'number'){
        return delayString;
    }else{
        return 0;
    }
}

//flow through the code and 
//generate idlocationGenerator if we find
var GENERATE_SENDID_FN_NAME = '$generateSendId';
function generateIdlocationGenerator(){
    return [
      'var $sendIdCounter = 0;',
      'var $sendIdAccumulator = ' + JSON.stringify(sendIdAccumulator) + ';',
      'function ' + GENERATE_SENDID_FN_NAME + '(){ ',
      '  var sendid;',
      '  do{',
      '    sendid = "$scion.sendid" + $sendIdCounter++;', //make sure we don't clobber an existing sendid
      '  } while($sendIdAccumulator.indexOf(sendid) > -1)', 
      '  return sendid;',
      '}' 
    ].join('\n');
}


module.exports = startTraversal;

//for executing directly under node.js
if(require.main === module){
    //TODO: clean up command-line interface so that we do not expose unnecessary cruft
    var usage = 'Usage: $0 --type [amd | umd | commondjs] [ FILE | - ]';
    var argv = require('optimist').
                usage(usage).
                argv;
    var moduleType = argv.type;
    var input = argv._[0];

    if(!input){
      console.error(usage);
      process.exit(1);
    } else if(input === '-'){

      //read from stdin or file
      process.stdin.setEncoding('utf8');
      process.stdin.resume();

      var jsonString = '';
      process.stdin.on('data',function(s){
          jsonString  += s;
      });

      process.stdin.on('end',go);
    } else{
      var fs = require('fs');
      jsonString = fs.readFileSync(input,'utf8'); 
      go();
    }
}

function go(){
    var o = startTraversal(JSON.parse(jsonString),moduleType);
    console.log(o.module); 
}
