/**
 * Accept a scjson document as input, either from a file or via stdin.
 * Generate a JavaScript module as output.
 * This module should be customizable:
    * plain object literal if appropriate
    * simple self-invoking function (for use in scion-scxml)
    * UMD in probably all other cases. although we could make it CommonJS/AMD/etc.
 */

var to_js_identifier = require("text-to-js-identifier");
var SourceNode = require('source-map').SourceNode;
var esprima = require('esprima');
var util = require('../util');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var urlM = require('url');
var sax = require("sax");

const DEFAULT_INVOKE_TYPE = 'http://www.w3.org/TR/scxml/';


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

function parseJsCode(fnBody, action, docUrl, node, isExpression){
  //console.log(fnBody, action.$line);
  var tokens = esprima.tokenize(fnBody, { loc: true });
  var lastTokenEndLine = 1,
      lastTokenEndCol = 0;
  tokens.forEach(function(token, i){
    var numLinesPadding = token.loc.start.line - lastTokenEndLine,
        numColsPadding = token.loc.start.column - lastTokenEndCol;
    var whitespace = (function(){
      var s = [];
      for(var i = 0; i < numLinesPadding; i++){
        s.push('\n');
      }
      for(var j = 0; j < numColsPadding ; j++){
        s.push(' ');
      }
      return s.join('');
    })();
    if(!(isExpression && i==0)){ 
      //skip whitespace
      node.add(whitespace);
    }
    var tokenNode = new SourceNode(
      action.$line + token.loc.start.line,
      token.loc.start.line === 1 ? action.$column + token.loc.start.column :  token.loc.start.column,
      docUrl,
      token.value 
    );
    //console.log('tokenNode',tokenNode);
    node.add(tokenNode);
    lastTokenEndLine = token.loc.end.line;
    lastTokenEndCol = token.loc.end.column;
  });
}

function generateFnDeclaration(fnName,fnBody,actionOrInvoke,docUrl,isExpression,parseGeneratedCodeForSourceMap){
    if(printTrace) console.log('generateFnDeclaration',fnName,fnBody);

    var node = new SourceNode();
    node.add('function ' + fnName + FN_ARGS + '{\n');
    if(isExpression){
      var returnNode = new SourceNode(actionOrInvoke.$line + 1, actionOrInvoke.$column, docUrl, 'return ');
      node.add(returnNode);
    }
    if(parseGeneratedCodeForSourceMap){
      let action = actionOrInvoke;  //FYI, he is an action
      parseJsCode(fnBody, action, docUrl, node, isExpression);
    }else{
      node.add( 
        new SourceNode(
          actionOrInvoke.$line + 1,
          actionOrInvoke.$column,
          docUrl,
          fnBody.trim()
        )
      );
    }
    if(isExpression){
      node.add(';');
    }
    node.add(
      '\n};\n' +
      fnName + '.tagname=\'' + actionOrInvoke.$type + '\';\n' +
      fnName + '.line=' + actionOrInvoke.$line + ';\n' +
      fnName + '.column=' + actionOrInvoke.$column + ';\n'
    );
    return node;
}

function generateFnCall(fnName, ...args){
    if(printTrace) console.log('generateFnCall',fnName);

    return `${fnName}.${args.length ? 'call' : 'apply'}(this, ${args.length ? args.join(',') : 'arguments' })`;
}

ModuleBuilder.prototype.generateInvokeFunction = function(invoke, parentState) {
    if(printTrace) console.log('generateActionFunction',invoke);

    const processAttr = processSendOrInvokeAttr.bind(this, invoke, this);
    var fnName = generateFnName('invoke',invoke);

    var invokeId;
    if(invoke.id){
      invokeId = processAttr('id', parentState);
    } else if(invoke.idlocation){
      invokeId = processAttr('idlocation', parentState);
    } else{
      //generate a new id
      do{
        invokeId = `${parentState.id}.invokeid_${this.invokeIdCounter++}`;    //make sure we dont clobber an existing invokeid
      } while(this.invokeIdAccumulator.indexOf(invokeId) > -1)
      invokeId = JSON.stringify(invokeId);
    }
    if(invoke.finalize && invoke.finalize.actions) this.replaceActions(invoke.finalize,'actions');
    const autoforward = invoke.autoforward === 'true';
    var fnBody = `
      ${invoke.idlocation ? `${fnName}.id = ${invokeId};` : ''}      //dynamic idlocation
      console.log('invoke id', ${fnName}.id);
      this.invoke({
        "autoforward" : ${autoforward},
        "type" : ${processAttr('type', parentState)} || ${JSON.stringify(DEFAULT_INVOKE_TYPE)},
        "src" : ${processAttr('src', parentState)},
        "id" : ${fnName}.id,
        ${
          invoke.expr || invoke.content ? 
            `"content" : ${generateFnCall(this.generateAttributeExpression(invoke, invoke.expr ? 'expr' : 'content', invoke.$type))},` : 
            ''
        }
        ${
          (invoke.namelist || (invoke.params && invoke.params.length)) ? 
            `"params" : ${generateFnCall(actionWithNamelistAndParamsToProps(invoke, this))},` : 
            ''
        }
        "docUrl" : ${JSON.stringify(this.docUrl)},
        "docOffsetLine" : ${invoke.$line},
        "docOffsetColumn" : ${invoke.$column}
      });
    `;

    var fnDec = generateFnDeclaration(fnName,fnBody,invoke,this.docUrl,false,false);

    fnDec += `
      ${fnName}.autoforward = ${autoforward};
    `;

    if(!invoke.idlocation) {
      fnDec += `
        ${fnName}.id = ${invokeId};
      `;
    }

    if(invoke.finalize && invoke.finalize.actions){
      fnDec += `
        ${fnName}.finalize = ${JSON.stringify(invoke.finalize.actions).replace(REFERENCE_MARKER_RE,'$1')};
      `;
    }

    this.fnDecAccumulator.push(fnDec);

    return fnName;
}

ModuleBuilder.prototype.generateActionFunction = function(action) {
    if(printTrace) console.log('generateActionFunction',action);

    var fnName = generateFnName(action.$type,action);
    var fnBody = actionTags[action.$type] ? actionTags[action.$type](action, this) : actionTags['custom'](action, this);
    var fnDec = generateFnDeclaration(fnName,fnBody,action,this.docUrl,false,action.$type === 'script');

    this.fnDecAccumulator.push(fnDec);

    return fnName;
}

function normalizeWhitespace (str) {
  return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(/\s/g, " ");
}

function parseContentAsString(content){
  return  JSON.stringify(normalizeWhitespace(content))
}

function parseContentAsXml(content){
  let toReturn;
  try { 
    //then try to detect if he is an XML document 
    //FIXME: we probably want to defer normalizing whitespace until this point so that the XML doc can preserve whitespace, while the below string has whitespace normalized
    var parser = sax.parser(true, {trim : false, xmlns : true});
    parser.onerror = function (e) {
      // an error happened.
      toReturn = parseContentAsString(content);
    };

    parser.onend = function () {
      //do the thing   
       toReturn = `this.parseXmlStringAsDOM(${JSON.stringify(content)})`;
    };
    
    parser.write(content).close();
  } catch (e) {

  }
  return toReturn;
}

ModuleBuilder.prototype.generateExpressionFunction = function(expressionType,exprObj,isContent,containerType){
    if(printTrace) console.log('generateExpressionFunction',expressionType,exprObj);

    var fnName = generateFnName(expressionType,exprObj);
    var fnBody; 
    if(isContent){
      //slightly complicated rules for interpreting the values of content tags, and contents of <data> and <assign>
      if(containerType === 'send' || containerType === 'donedata'){
        //try xml, then fall back to string
        //note: we COULE interpret as JSON, but shouldn't. see for example test529 - interprets JSON number as string. 
        fnBody = parseContentAsXml(exprObj.content);
      }else if(containerType === 'invoke'){
        //interpret as string only. the invoker only wants a string. 
        fnBody = parseContentAsString(exprObj.content);
      }else{
        //for <data> and <assign>
        //try to parse as JSON, then, xml, then fall back to string
        try {
          //first try to detect if he is a JSON object
          var o = JSON.parse(exprObj.content);
          fnBody = exprObj.content;
        } catch (e) {
          fnBody = parseContentAsXml(exprObj.content);
        }
      }
    } else {
      fnBody = exprObj.expr
    }
    var fnDec = generateFnDeclaration(fnName,fnBody,exprObj,this.docUrl,true,true);

    this.fnDecAccumulator.push(fnDec);

    return fnName;
}

ModuleBuilder.prototype.generateAttributeExpression = function(attrContainer, attrName, containerType){
    if(printTrace) console.log('generateAttributeExpression',attrContainer,attrName);

    return this.generateExpressionFunction(stripAttrNsPrefix(attrName), attrContainer[attrName], attrName === 'content', containerType);
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
           '}\n';
}

var DESERIALIZE_DATAMODEL_FN_NAME = '$deserializeDatamodel',
    DESERIALIZE_DATAMODEL_FN_ARG = '$serializedDatamodel';

function generateDatamodelDeserializerFn(datamodelAccumulator){
    return 'function ' + DESERIALIZE_DATAMODEL_FN_NAME + '(' + DESERIALIZE_DATAMODEL_FN_ARG  + '){\n' +
                datamodelAccumulator.map(function(data){return '  ' + data.id + ' = ' + DESERIALIZE_DATAMODEL_FN_ARG  + '["' + data.id + '"];';}).join('\n') + '\n' +
                '    ' + EARLY_BINDING_DATAMODEL_GUARD + ' = true;\n' +     //set the guard condition to true
           '}\n';
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
                            filter(function(data){return data.expr || data.content;}).
                            map(function(data){
                              return 'if(!' + data.id + ')  ' + data.id + ' = ' + 
                                generateFnCall(data.expr ? 
                                  this.generateExpressionFunction('data',  data.expr, false, 'data') : 
                                  this.generateExpressionFunction('data',  data.content, true, 'data') 
                                ) + ';\n';
                            }, builder).join('') +
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
    return '//Generated on ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ' by the SCION SCXML compiler\n' + 
            (strict ? "'use strict';\n" : "");
}

function generateFactoryFunctionWrapper(o, name, options){
    
    var root = new SourceNode(null,null,null,[
              //o.headerString + '\n' ,
              '(function (_x,_sessionid,_ioprocessors,In){\n' ,
              '   var _name = \'' + name + '\';\n',
              new SourceNode(null,null,null,""),    //create a dummy node at index 2, which we might use to inject datamodel and scripts
              o.sendString,
              o.sendIdLocationString,
              o.invokeIdLocationString,
              o.earlyBindingFnDeclaration,
              o.datamodelDeserializerFnDeclaration,
              o.datamodelSerializerFnDeclaration,
      ].concat(
              o.actionFunctionDeclarations
      )
      .concat([
              'return ' + o.objectLiteralString + ';\n',
        '})\n'
      ])
    );

    return root;
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
                sendString : (this.documentHasSendAction ? getDelayInMs.toString() + '\n' : ''),
                sendIdLocationString : (this.documentHasSendActionWithIdlocationAttribute  ? generateIdlocationGenerator('send', GENERATE_SENDID_FN_NAME, this.sendIdAccumulator) : ''),
                invokeIdLocationString : (this.documentHasInvokeActionWithIdlocationAttribute  ? generateIdlocationGenerator('invoke', GENERATE_INVOKEID_FN_NAME, this.invokeIdAccumulator) : ''),
                earlyBindingFnDeclaration : generateEarlyBindingDatamodelInitFn(this),
                datamodelDeserializerFnDeclaration : generateDatamodelDeserializerFn(this.datamodelAccumulator),
                datamodelSerializerFnDeclaration : generateDatamodelSerializerFn(this.datamodelAccumulator),
                actionFunctionDeclarations : this.fnDecAccumulator
            };

    delete rootState.rootScripts;            //this doesn't need to be in there

    o.objectLiteralString = generateSmObjectLiteral(rootState);

    var s = generateFactoryFunctionWrapper(o, rootState.name, options);

    return s;
}

function markAsReference(fnName){
    return  REFERENCE_MARKER + fnName + REFERENCE_MARKER;
}


ModuleBuilder.prototype.replaceActionCode = function(actionContainer, actionPropertyName, functionGenerator){
    functionGenerator = functionGenerator || this.generateActionFunction; //default arg
    if(actionContainer[actionPropertyName]){
        var actions = Array.isArray(actionContainer[actionPropertyName]) ? actionContainer[actionPropertyName] : [actionContainer[actionPropertyName]] ;

        actionContainer[actionPropertyName] = actions.map(function(action){ return functionGenerator.call(this, action, actionContainer)  }, this).map(markAsReference);

        if(actionContainer[actionPropertyName].length === 1){
            actionContainer[actionPropertyName] = actionContainer[actionPropertyName][0];
        }
    }
}

ModuleBuilder.prototype.replaceActions = ModuleBuilder.prototype.replaceActionCode;

ModuleBuilder.prototype.replaceInvokes = function(invokesContainer){
  this.replaceActionCode(invokesContainer,'invokes', this.generateInvokeFunction);
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

    if(state.invokes) this.replaceInvokes(state);

    if(state.onExit) this.replaceActions(state,'onExit');
    if(state.onEntry) this.replaceActions(state,'onEntry');
    if(state.$type === 'final' && state.donedata){
      state.donedata = markAsReference(constructSendEventData(state.donedata, this, 'donedata'));
    }

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
function SCJsonRawModule(name, datamodel, rootScripts, scxmlModule, docUrl) {
    this.name = name;
    this.datamodel = datamodel;
    this.rootScripts = rootScripts;
    this.module = scxmlModule;
    this.docUrl = docUrl;
}

/**
 * Generate JavaScript module that can be executed by SCION-CORE StateCharts runtime
 * @param  {Function} cb  Callback to execute with the prepared module string.
 */
SCJsonRawModule.prototype.prepare = function(cb, executionContext, hostContext){
    [executionContext, hostContext] = util.initContexts(executionContext, hostContext);

    if(util.IS_INSPECTING){
      //workaround for https://github.com/nodejs/node/issues/8369
      hostContext.writeModuleToDisk = true;
    } 

    if(hostContext.writeModuleToDisk){
      hostContext.moduleFormat = 'commonjs'; 
    }

    this.prepareModuleString(function(err, generatedCode){
      if(err) return cb(err);
      if(hostContext.writeModuleToDisk){
        fs.mkdtemp('/tmp/foo-', (err, folder) => {
          if (err) return cb(err);
          var modulePath = folder + path.sep + 'sc.js';
          //console.log('modulePath ', modulePath );
          fs.writeFile(modulePath, generatedCode, function(err){
            if (err) return cb(err);
            var fnModel = require(modulePath);
            cb(null, fnModel); 
          });
        });
      } else {
        var fnModel = vm.runInContext(generatedCode, executionContext);
        cb(null, fnModel); 
      }
    }, hostContext);
}

SCJsonRawModule.prototype.prepareModuleString = function(cb, hostContext){
    var scriptPromises = util.fetchScripts(this, hostContext);
    Promise.all(scriptPromises).then(function resolved(scripts) {
        var rootNode = new SourceNode(null, null, null);

        rootNode.add(dumpHeader(hostContext.strict));

        if(hostContext.moduleFormat === 'node' || 
            hostContext.moduleFormat === 'commonjs') {
          rootNode.add('module.exports = ');
        }

        var injectionNode = this.module.children[2];

        if(this.datamodel) {
          injectionNode.add(this.datamodel);
          injectionNode.add('\n');
        }

        this.rootScripts.forEach(function(rootScript){
          if(rootScript.$wrap){
            injectionNode.add(rootScript.$wrap(rootScript.content));
          }else{
            var scriptSrc = rootScript.src || this.docUrl;
            parseJsCode(rootScript.content, {$line : rootScript.$line || 0, $column : rootScript.$column || 0}, scriptSrc, injectionNode, false)
          }
          injectionNode.add('\n');
        },this)

        rootNode.add(this.module);

        var s = rootNode.toStringWithSourceMap();
        var generatedCode = s.code + '\n' +
              '//' + '#' + ' sourceMappingURL' + '=' + 'data' + ':' + 'application/json' + ';charset=utf-8;base64,' + //we split this string up so that we don't hit the source map regex on sourcemap-processing tools like sorcery
              new Buffer(s.map.toString()).toString('base64')

        cb(null, generatedCode); 
    }.bind(this));
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
    this.invokeIdAccumulator = [];
    this.invokeIdCounter = 0;
    this.documentHasSendAction = false;
    this.documentHasSendActionWithIdlocationAttribute = false;
    this.documentHasInvokeActionWithIdlocationAttribute = false;
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
        scxmlModule,
        this.docUrl
    );

    this.resolve(jsModule);
}


function startTraversal(docUrl, rootState, options){
    if (!options) {
        options = {};
    }

    analyze(rootState, moduleBuilder);
    var moduleBuilder = new ModuleBuilder(docUrl, rootState, options);
    return moduleBuilder.build();
}

function analyze(state, builder){

  function visitState(){
    if(state.invokes){
      (Array.isArray(state.invokes) ? state.invokes : [state.invokes]).forEach((invoke) => {
        if(invoke.id){
          // add id to idAccumulator
          builder.invokeIdAccumulator.push(invoke.id);
        }
      });
    } 
    if(state.states) state.states.forEach(visitState);
  }
  
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
    var fnName = to_js_identifier(action.src);
    // Only load the script once. It will be evaluated as many times as it is referenced.
    if (!this.externalActionScripts.has(action.src)) {
        this.externalActionScripts.add(action.src);
        action.$wrap = function(body) {
            return generateFnDeclaration(fnName,body,{$line : 0, $column:0},action.src,false,true);
        }.bind(this);

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
        return action.location.expr + " = " + 
          generateFnCall(builder.generateAttributeExpression(action, action.expr ? 'expr' : 'content', action.$type)) + ";";
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

        const processAttr = processSendOrInvokeAttr.bind(this, action, builder);

        var target = processAttr( 'target'),
            targetVariableName = '_scionTargetRef',
            targetDeclaration = 'var ' + targetVariableName + ' = ' + target + ';\n';

        var event =
        "{\n" +
         "  target: " + targetVariableName + ",\n" +
         "  name: " + processAttr( 'event') + ",\n" +
         "  type: " + processAttr( 'type') + ",\n" +
         "  data: " + constructSendEventData(action, builder) + ",\n" +
         "  origin: _sessionid\n" +
         "}"

        var sendId;
        if(action.id){
          sendId = processAttr('id');
        } else if(action.idlocation){
          sendId = processAttr('idlocation');
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
            "           delay: getDelayInMs(" + processAttr( 'delay') + "),\n" +       //TODO: delay needs to be parsed at runtime
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
            (!action.index ? 'var ' + index + ';\n' : '') + 
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

function constructSendEventData(action, builder, actionType){
    if(action.expr || action.content){
      return generateFnCall(builder.generateAttributeExpression(action, action.expr ? 'expr' : 'content', actionType || action.$type));
    } else {
        return generateFnCall(actionWithNamelistAndParamsToProps(action, builder));
    }
}

function processSendOrInvokeAttr(container, builder, attr, parentState){

    if(!(container.$type === 'send' || container.$type === 'invoke')) throw new Error('processSendOrInvokeAttr requires container of type send or invoke');

    if(attr === 'id'){
      let arr = builder[container.$type === 'invoke' ? 'invokeIdAccumulator' : 'sendIdAccumulator'];
      let val = container[attr];
      if( arr.indexOf(val) === -1 ){
        arr.push(val);
      }
    }

    var exprName = attr + 'expr';

    if(attr === 'idlocation'){
      builder[container.$type === 'invoke' ? 'documentHasInvokeActionWithIdlocationAttribute' : 'documentHasSendActionWithIdlocationAttribute'] = true;
      //FIXME: overwriting this variable is a bit ugly.
      //if we're going to generate this expr on the fly, it would be better to clone the container.
      container[attr].expr = container[attr].expr + '=' + (container.$type === 'invoke' ? generateFnCall(GENERATE_INVOKEID_FN_NAME, JSON.stringify(parentState.id)) : generateFnCall(GENERATE_SENDID_FN_NAME));   //TODO: get parent state id for invoke
      var fnName = builder.generateAttributeExpression(container, attr, container.$type);
      return generateFnCall(fnName);
    }else if(container[exprName]){
        var fnName = builder.generateAttributeExpression(container, exprName, container.$type);
        return generateFnCall(fnName);
    }else if(container[attr]){
        return JSON.stringify(container[attr]);
    }else{
        return null;
    }
}

function actionWithNamelistAndParamsToProps(action, builder){
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

    var fnBody = "{\n" +  props.join(',\n') + "}\n";
    var fnName = generateFnName('senddata',action);
    var fnDec = generateFnDeclaration(fnName,fnBody,action,builder.docUrl,true,false);

    builder.fnDecAccumulator.push(fnDec);

    return fnName;
}

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
var GENERATE_INVOKEID_FN_NAME = '$generateInvokeId';
function generateIdlocationGenerator(type, fnName, idAccumulator){
    return `
      var $${type}IdCounter = 0;
      var $${type}IdAccumulator =  ${ JSON.stringify(idAccumulator) } ;
      function ${fnName}(${type === 'invoke' ? 'parentStateId' : ''}){
        var id;
        do{
          id = ${type === 'invoke' ? 'parentStateId' : '"$scion"'} + ".${type}id_" + $${type}IdCounter++; //make sure we dont clobber an existing sendid or invokeid
        } while($${type}IdAccumulator.indexOf(id) > -1)
        return id;
      };
      `
}

module.exports = { 
  startTraversal : startTraversal, 
  parseJsCode : parseJsCode,
  dumpHeader : dumpHeader
};
