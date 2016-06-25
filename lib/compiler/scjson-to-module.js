/**
 * Accept a scjson document as input, either from a file or via stdin.
 * Generate a JavaScript module as output.
 * This module should be customizable:
    * plain object literal if appropriate
    * simple self-invoking function (for use in scion-scxml)
    * UMD in probably all other cases. although we could make it CommonJS/AMD/etc.
 */

var to_js_identifier = require("text-to-js-identifier"),
    pm = require('../runtime/platform-bootstrap/platform');

//TODO: optimization: if the scjson does not contain a datamodel or any actions, then just dump out the object literal as the module
//TODO: we should also encode the document name. accept as command-line argument, or embed it in the scjson itself, maybe?
var printTrace = false;

function generateFnName(actionType,action){
    return '$' + actionType + '_l' + action.$line + '_c' + action.$column;
}

var FN_ARGS = '(_event)';
var SCRIPT_SRC_FN_PREFIX = 'script_src'

var stripNsPrefixRe = /^(?:{(?:[^}]*)})?(.*)$/;
function stripAttrNsPrefix(attrName){
  var m = attrName.match(stripNsPrefixRe);
  return m[1];
}

function generateFnDeclaration(fnName,fnBody,action){
    if(printTrace) console.log('generateFnDeclaration',fnName,fnBody);

    return 'function ' + fnName + FN_ARGS + '{\n' +
        fnBody + '\n' +
    '};\n' +
    fnName + '.tagname=\'' + action.$type + '\';\n' +
    fnName + '.line=' + action.$line + ';\n' +
    fnName + '.column=' + action.$column + ';\n';
}

function generateFnCall(fnName){
    if(printTrace) console.log('generateFnCall',fnName);

    return fnName + '.apply(this, arguments)';
}

ModuleBuilder.prototype.generateActionFunction = function(action) {
    if(printTrace) console.log('generateActionFunction',action);

    var fnName = generateFnName(action.$type,action);
    var fnBody = actionTags[action.$type] ? actionTags[action.$type](action, this) : actionTags['custom'](action, this);
    var fnDec = generateFnDeclaration(fnName,fnBody,action);

    this.fnDecAccumulator.push(fnDec);

    return fnName;
}

ModuleBuilder.prototype.generateExpressionFunction = function(expressionType,exprObj){
    if(printTrace) console.log('generateExpressionFunction',expressionType,exprObj);

    var fnName = generateFnName(expressionType,exprObj);
    var fnBody = 'return ' + exprObj.expr  + ';';
    var fnDec = generateFnDeclaration(fnName,fnBody,exprObj);

    this.fnDecAccumulator.push(fnDec);

    return fnName;
}

ModuleBuilder.prototype.generateAttributeExpression = function(attrContainer,attrName){
    if(printTrace) console.log('generateAttributeExpression',attrContainer,attrName);

    return this.generateExpressionFunction(stripAttrNsPrefix(attrName), attrContainer[attrName]);
}

var REFERENCE_MARKER = '__UNQUOTE__',
    REFERENCE_MARKER_RE = new RegExp('"' + REFERENCE_MARKER + '(.*)' + REFERENCE_MARKER + '"','g') ;

//TODO: need to split this into two parts: one that declares the variables in the datamodel at the top of the module scope,
//and another single function that inits the model needs to contain a reference to this init function,
//and the interpreter must know about it. should be optional.
//call it $scion_init_datamodel.
function generateDatamodelDeclaration(datamodelAccumulator){
    if (!datamodelAccumulator.length) {
        return undefined;
    }

    return ('var ' + datamodelAccumulator.map(function(data){return data.id;}).join(", ") + ";");
}

var SERIALIZE_DATAMODEL_FN_NAME = '$serializeDatamodel';

function generateDatamodelSerializerFn(datamodelAccumulator){
    return 'function ' + SERIALIZE_DATAMODEL_FN_NAME + '(){\n' +
           '   return {\n' +
                datamodelAccumulator.map(function(data){return '  "' + data.id + '" : ' + data.id;}).join(',\n') + '\n' +
           '   };\n' +
           '}';
}

var DESERIALIZE_DATAMODEL_FN_NAME = '$deserializeDatamodel',
    DESERIALIZE_DATAMODEL_FN_ARG = '$serializedDatamodel';

function generateDatamodelDeserializerFn(datamodelAccumulator){
    return 'function ' + DESERIALIZE_DATAMODEL_FN_NAME + '(' + DESERIALIZE_DATAMODEL_FN_ARG  + '){\n' +
                datamodelAccumulator.map(function(data){return '  ' + data.id + ' = ' + DESERIALIZE_DATAMODEL_FN_ARG  + '["' + data.id + '"];';}).join('\n') + '\n' +
                '    ' + EARLY_BINDING_DATAMODEL_GUARD + ' = true;\n' +     //set the guard condition to true
           '}';
}


var EARLY_BINDING_DATAMODEL_FN_NAME = '$initEarlyBindingDatamodel';
var EARLY_BINDING_DATAMODEL_GUARD = '$scion_early_binding_datamodel_has_fired';

//TODO: make this function more clever and accept the datamodel as an action
function generateEarlyBindingDatamodelInitFn(builder){
    //this guard guarantees it will only fire once
    return 'var ' + EARLY_BINDING_DATAMODEL_GUARD + ' = false;\n' +
    (builder.datamodelAccumulator.length ?
                'function ' + EARLY_BINDING_DATAMODEL_FN_NAME + FN_ARGS + '{\n' +
                '    if(!' + EARLY_BINDING_DATAMODEL_GUARD + '){\n' +
                         //invoke all datamodel expresions
                         builder.datamodelAccumulator.
                            filter(function(data){return data.expr;}).
                            map(function(data){return '  ' + data.id + ' = ' + generateFnCall(builder.generateExpressionFunction('data',data.expr)) + ';\n';}, builder).join('') +
                '        ' + EARLY_BINDING_DATAMODEL_GUARD + ' = true; ' + '\n' +
                '    }\n' +
                '}' : '');
}

function generateSmObjectLiteral(rootState){
    //pretty simple
    return JSON.stringify(rootState, undefined, 1).replace(REFERENCE_MARKER_RE,'$1');
}

function dumpFunctionDeclarations(fnDecAccumulator){
    //simple
    return fnDecAccumulator.join('\n');
}

function dumpHeader(strict){
    var d = new Date();
    var strictStr = (strict ? "'use strict';\n" : "");
    return strictStr + '//Generated on ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ' by the SCION SCXML compiler';
}

function generateFactoryFunctionWrapper(o, name, options){
    var parts = [
        o.sendString,
        o.sendIdLocationString,
        o.earlyBindingFnDeclaration,
        o.datamodelDeserializerFnDeclaration,
        o.datamodelSerializerFnDeclaration,
        o.actionFunctionDeclarations,
        'return ' + o.objectLiteralString + ';'
    ];

    var program;
    if (options.debug) {
        program = parts.join('\n\n').
            split('\n').map(function(line){return '    ' + line;}).join('\n')
    } else {
        program = parts.join('\n');
    }

    return '(function (_x,_sessionid,_ioprocessors,In){\n' +
            '   var _name = \'' + name + '\';' +
                    //'console.log(_x,_sessionid,_name,_ioprocessors,In);\n' +
                    program +
                '})';
}

ModuleBuilder.prototype.generateModule = function(){
    var rootState = this.rootState;
    var options = this.options;

    //TODO: enumerate these module types

    if(this.datamodelAccumulator.length){
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
                headerString : dumpHeader(options.strict),
                sendString : (this.documentHasSendAction ? getDelayInMs.toString() : ''),
                sendIdLocationString : (this.documentHasSendActionWithIdlocationAttribute  ? generateIdlocationGenerator(this.sendIdAccumulator) : ''),
                earlyBindingFnDeclaration : generateEarlyBindingDatamodelInitFn(this),
                datamodelDeserializerFnDeclaration : generateDatamodelDeserializerFn(this.datamodelAccumulator),
                datamodelSerializerFnDeclaration : generateDatamodelSerializerFn(this.datamodelAccumulator),
                actionFunctionDeclarations : dumpFunctionDeclarations(this.fnDecAccumulator)
            };

    delete rootState.rootScripts;            //this doesn't need to be in there

    o.objectLiteralString = generateSmObjectLiteral(rootState);

    var s =
        o.headerString + '\n' +
        generateFactoryFunctionWrapper(o, rootState.name, options);

    return s;
}

function markAsReference(fnName){
    return  REFERENCE_MARKER + fnName + REFERENCE_MARKER;
}

ModuleBuilder.prototype.replaceActions = function(actionContainer,actionPropertyName){
    if(actionContainer[actionPropertyName]){
        var actions = Array.isArray(actionContainer[actionPropertyName]) ? actionContainer[actionPropertyName] : [actionContainer[actionPropertyName]] ;

        actionContainer[actionPropertyName] = actions.map(this.generateActionFunction, this).map(markAsReference);

        if(actionContainer[actionPropertyName].length === 1){
            actionContainer[actionPropertyName] = actionContainer[actionPropertyName][0];
        }
    }
}

ModuleBuilder.prototype.visitState = function(){
    var genValue = this.stateGen.next();
    if (genValue.done) {
        this._finish();
        return;
    }

    var state = genValue.value;
    //accumulate datamodels
    if (state.datamodel) {
        this.datamodelAccumulator.push.apply(this.datamodelAccumulator,state.datamodel);
    }

    if(state.onExit) this.replaceActions(state,'onExit');
    if(state.onEntry) this.replaceActions(state,'onEntry');

    if(state.transitions) {
        for (var i = 0, len = state.transitions.length; i < len; i++) {
            var transition = state.transitions[i];
            this.replaceActions(transition,'onTransition');
            if(transition.cond){
                transition.cond = markAsReference(this.generateAttributeExpression(transition,'cond'));
            }
        }
    }

    //clean up as we go
    delete state.datamodel;

    setImmediate(function(self) {
        self.visitState();
    }, this);
}

/**
 * The uncooked SCION module
 * @param {string} [name]  The name of the module derived from the scxml root element's name attribute
 * @param {string} datamodel The raw datamodel declarations
 * @param {Array<ScriptNode>} rootScripts A collection of 0 or more script nodes
 *   Each node contains a src property which references an external js resource
 *   or a content property which references a string containing the uncooked js
 * @param {string} scxmlModule A massive string containing the generated scxml program
 *   less the parts enumerated above
 */
function SCJsonRawModule(name, datamodel, rootScripts, scxmlModule) {
    this.name = name;
    this.datamodel = datamodel;
    this.rootScripts = rootScripts;
    this.module = scxmlModule;
}

function* genStates(state) {
    yield (state);

    if (state.states) {
      for (var j = 0, len = state.states.length; j < len; j++) {
        yield* genStates(state.states[j]);
      }
    }
}

function ModuleBuilder(docUrl, rootState, options) {
    this.docUrl = docUrl;
    this.rootState = rootState;
    if (!rootState.rootScripts) {
        rootState.rootScripts = [];
    }

    this.externalActionScripts = new Set();
    this.options = options;
    this.datamodelAccumulator = [];
    this.fnDecAccumulator = [];
    this.sendIdAccumulator = [];
    this.documentHasSendAction = false;
    this.documentHasSendActionWithIdlocationAttribute = false;
    this.resolve = undefined;
    this.reject = undefined;
    this.stateGen = genStates(this.rootState);
}

ModuleBuilder.prototype.build = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
        self.visitState();
    });
}

ModuleBuilder.prototype._finish = function() {
    // grab the root scripts before generateDatamodelDeclaration hackily deletes them
    var rootScripts = this.rootState.rootScripts;
    var dataModel = generateDatamodelDeclaration(this.datamodelAccumulator);
    var scxmlModule = this.generateModule();

    var jsModule = new SCJsonRawModule(
        this.rootState.name,
        dataModel,
        rootScripts,
        scxmlModule
    );

    this.resolve(jsModule);
}


function startTraversal(docUrl, rootState, options){
    if (!options) {
        options = {};
    }

    var moduleBuilder = new ModuleBuilder(docUrl, rootState, options);
    return moduleBuilder.build();
}

ModuleBuilder.prototype.safelyAddVariableToDatamodelAccumulator = function(variableName,lineNum,colNum){
    if(!this.datamodelAccumulator.some(function(data){ return data.id === variableName;})){
        // add datamodel declaration to the accumulator
        this.datamodelAccumulator.push({
          $line : lineNum,
          $col : colNum,
          id : variableName
        });
    }
}

/**
 * Handles an externally referenced script within an executable content block
 * @param  {object} action The script action
 * @return {string} A call to the named function that will be injected at model preparation time
 * @see document-string-to-model#prepare
 */
ModuleBuilder.prototype.handleExternalActionScript = function(action) {
    // base the generated function name on the fully-qualified url, NOT on its position in the file
    action.src = pm.platform.url.resolve(this.docUrl, action.src);
    var fnName = to_js_identifier(action.src);
    // Only load the script once. It will be evaluated as many times as it is referenced.
    if (!this.externalActionScripts.has(action.src)) {
        this.externalActionScripts.add(action.src);
        action.$wrap = function(body) {
            return generateFnDeclaration(fnName, body, action);
        }

        this.rootState.rootScripts.push(action);
    }

    return generateFnCall(fnName);
}

function getVariableNameForShallowCopy (builder) {
    //Assign a number higher than current total number of variables in accumulator
    return '$scionArray_' + builder.datamodelAccumulator.length + 1;
}

var actionTags = {
    "script" : function(action, builder){
        if (action.src) {
            return builder.handleExternalActionScript(action);
        } else {
            return action.content;
        }
    },

    "assign" : function(action, builder){
        return action.location.expr + " = " + generateFnCall(builder.generateAttributeExpression(action,'expr')) + ";";
    },

    "log" : function(action, builder){
        var params = [];

        if(action.label) {
            params.push(JSON.stringify(action.label));
        } else if (action.labelexpr) {
            // extends SCXML 1.0
            params.push(generateFnCall(builder.generateAttributeExpression(action,'labelexpr')));
        } else {
            // always push *something* so the interpreter context
            // can differentiate between label and message
            params.push('null');
        }

        if(action.expr){
            params.push(generateFnCall(builder.generateAttributeExpression(action,'expr')));
        }

        return "this.log(" + params.join(",") + ");";
    },

    "if" : function(action, builder){
        var s = "";
        var ifCondExprName = builder.generateAttributeExpression(action,'cond');

        s += "if(" + generateFnCall(ifCondExprName)  + "){\n";

        var childNodes = action.actions;

        for(var i = 0; i < childNodes.length; i++){
            var child = childNodes[i];

            if(child.$type === "elseif" || child.$type === "else"){
                break;
            }else{
                s += '    ' + generateFnCall(builder.generateActionFunction(child)) + ';\n';
            }
        }

        //process if/else-if, and recurse
        for(; i < childNodes.length; i++){
            child = childNodes[i];

            if(child.$type === "elseif"){

                s+= "}else if(" + generateFnCall(builder.generateAttributeExpression(child,'cond'))  + "){\n";
            }else if(child.$type === "else"){
                s += "}";
                break;
            }else{
                s += '    ' + generateFnCall(builder.generateActionFunction(child)) + ';\n';
            }
        }

        for(; i < childNodes.length; i++){
            child = childNodes[i];

            //this should get encountered first
            if(child.$type === "else"){
                s+= "else{\n";
            }else{
                s += '    ' + generateFnCall(builder.generateActionFunction(child)) + ';\n';
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

    "send" : function(action, builder){

        builder.documentHasSendAction = true;           //set the global flag

        function processAttr(container,attr){


            if(attr === 'id'){
              builder.sendIdAccumulator.push(container[attr]);
            }

            var exprName = attr + 'expr';

            if(attr === 'idlocation'){
              builder.documentHasSendActionWithIdlocationAttribute = true;
              var fakeExpr = JSON.parse(JSON.stringify(container));
              //FIXME: overwriting this variable is a bit ugly.
              //if we're going to generate this expr on the fly, it would be better to clone the container.
              container[attr].expr = container[attr].expr + '=' + generateFnCall(GENERATE_SENDID_FN_NAME);
              var fnName = builder.generateAttributeExpression(container, attr);
              return generateFnCall(fnName);
            }else if(container[exprName]){
                var fnName = builder.generateAttributeExpression(container, exprName);
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
                return generateFnCall(builder.generateAttributeExpression(action,'contentexpr'));
            }else{
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
                            props.push('"' + param.name + '"' + ":" + generateFnCall(builder.generateAttributeExpression(param, 'expr')));
                        }else if(param.location){
                            props.push('"' + param.name + '"' + ":" + generateFnCall(builder.generateAttributeExpression(param, 'location')));
                        }
                    });
                }

                return "{\n" +  props.join(',\n') + "}\n";
            }
        }



        var target = processAttr(action, 'target'),
            targetVariableName = '_scionTargetRef',
            targetDeclaration = 'var ' + targetVariableName + ' = ' + target + ';\n';

        var event =
        "{\n" +
         "  target: " + targetVariableName + ",\n" +
         "  headers: " + processAttr(action, '{http://www.247-inc.com/scxml}headers') + ",\n" +
         "  enctype: " + processAttr(action, '{http://www.247-inc.com/scxml}enctype') + ",\n" +
         "  fetchtimeout: " + processAttr(action, '{http://www.247-inc.com/scxml}fetchtimeout') + ",\n" +
         "  name: " + processAttr(action, 'event') + ",\n" +
         "  type: " + processAttr(action, 'type') + ",\n" +
         "  data: \n" + constructSendEventData(action) + ",\n" +
         "  origin: _sessionid\n" +
         "}"

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
            'var ' + shallowArrayName + ' = ' + arr + ';\n'+
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
function generateIdlocationGenerator(sendIdAccumulator){
    return 'var $sendIdCounter = 0;\n' +
      'var $sendIdAccumulator = ' + JSON.stringify(sendIdAccumulator) + ';\n' +
      'function ' + GENERATE_SENDID_FN_NAME + '(){\n' +
      '  var sendid;\n' +
      '  do{\n' +
      '    sendid = "$scion.sendid" + $sendIdCounter++;\n' + //make sure we don't clobber an existing sendid
      '  } while($sendIdAccumulator.indexOf(sendid) > -1)\n' +
      '  return sendid;\n' +
      '}';
}


module.exports = startTraversal;

//for executing directly under node.js
if(require.main === module){
    //TODO: clean up command-line interface so that we do not expose unnecessary cruft
    var usage = 'Usage: $0 [ FILE | - ]';
    var argv = require('optimist').
                usage(usage).
                argv;
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
      go(input);
    }
}

function go(docUrl){
    if (!docUrl) {
        docUrl = '';
    }

    startTraversal(docUrl, JSON.parse(jsonString), {debug: true}).then(
        function resolved(jsModule) {
            console.log(jsModule.module);
        },
        function rejected(err) {
            console.error(err);
        }
    );
}
