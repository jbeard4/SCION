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

function generateFnName(actionType,action){
    return '$' + actionType + '_line_' + action.$line + '_column_' + action.$column;
}

function generateFnDeclaration(fnName,fnBody){
    if(printTrace) console.log('generateFnDeclaration',fnName,fnBody);

    return 'function ' + fnName + '(_event, In, _sessionId, _name, _ioprocessors, _x){\n' +
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
    var fnBodyAndDecsObj = actionTags[action.type](action);
    var fnBody = fnBodyAndDecsObj.fnBody;
    var fnDec = generateFnDeclaration(fnName,fnBody);
    var fnDecs = [fnDec].concat(fnBodyAndDecsObj.fnDecs);

    return {
        fnName : fnName,
        fnDecs : fnDecs 
    };
}

function generateExpressionFunction(expressionType,exprObj){
    if(printTrace) console.log('generateExpressionFunction',expressionType,exprObj);

    var fnName = generateFnName(expressionType,exprObj);
    var fnBody = 'return ' + exprObj.expr  + ';';
    var fnDec = generateFnDeclaration(fnName,fnBody);

    return {
        fnName : fnName,
        fnDec : fnDec
    };
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
function generateDatamodelDeclaration(datamodelAccumulator,fnDecAccumulator){
    var s = "var ";
    var vars = [];

    function processDataElement(data){
        var s = data.id;

        if(data.expr){
            var dataExpr = generateExpressionFunction('data',data);
            fnDecAccumulator.push(dataExpr.fnDec);
            s += ' = ' + dataExpr.fnName + '()';
        }

        return s;
    }

    vars = datamodelAccumulator.map(processDataElement);

    return vars.length ? (s + vars.join(", ") + ";") : "";
}

function generateSmObjectLiteral(rootState){
    //pretty simple
    return JSON.stringify(rootState,4,4).replace(REFERENCE_MARKER_RE,'$1');
}

function dumpFunctionDeclarations(fnDecAccumulator){
    //simple
    return fnDecAccumulator.join('\n\n');
}

function dumpHeader(){
    var d = new Date();
    return '//Generated on ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ' by the SCION SCXML compiler';
}

function generateModule(rootState,datamodelAccumulator,fnDecAccumulator){
    //only commonjs module for now
    var sm = [
        dumpHeader(),
        getDelayInMs.toString(),
        generateDatamodelDeclaration(datamodelAccumulator,fnDecAccumulator),
        dumpFunctionDeclarations(fnDecAccumulator),
        'module.exports = ' + generateSmObjectLiteral(rootState) + ';'];

    return sm.join('\n\n');
}

function markAsReference(o){
    return  REFERENCE_MARKER + o.fnName + REFERENCE_MARKER;
}

function replaceActions(actionContainer,actionPropertyName,fnDecAccumulator){
    if(actionContainer[actionPropertyName]){
        var actions = Array.isArray(actionContainer[actionPropertyName]) ? actionContainer[actionPropertyName] : [actionContainer[actionPropertyName]] ;
        
        var actionDescriptors = actions.map(generateActionFunction);
        actionContainer[actionPropertyName] = actionDescriptors.map(markAsReference);
        fnDecAccumulator.push.apply(fnDecAccumulator,actionDescriptors.map(function(o){return o.fnDecs;}).reduce(function(a,b){return a.concat(b);},[]));

        if(actionContainer[actionPropertyName].length === 1){
            actionContainer[actionPropertyName] = actionContainer[actionPropertyName][0];
        }
    }
}

function visitState(state,datamodelAccumulator,fnDecAccumulator){
    //accumulate datamodels
    if(state.datamodel){
        datamodelAccumulator.push.apply(datamodelAccumulator,state.datamodel);
    }

    if(state.onExit) replaceActions(state,'onExit',fnDecAccumulator);
    if(state.onEntry) replaceActions(state,'onEntry',fnDecAccumulator);

    if(state.transitions){
        state.transitions.forEach(function(transition){
            replaceActions(transition,'onTransition',fnDecAccumulator);

            //replaceActions(transition,'cond',fnDecAccumulator);
            if(transition.cond){
                var condExpr = generateAttributeExpression(transition,'cond');
                transition.cond = markAsReference(condExpr);
                fnDecAccumulator.push(condExpr.fnDec);
            }
        });
    }

    //clean up as we go
    delete state.datamodel;

    if(state.states) state.states.forEach(function(substate){ visitState(substate,datamodelAccumulator,fnDecAccumulator); });
}

function startTraversal(rootState){
    var datamodelAccumulator = [], fnDecAccumulator = [];
    visitState(rootState,datamodelAccumulator,fnDecAccumulator);
    return generateModule(rootState,datamodelAccumulator,fnDecAccumulator);
}

var actionTags = {
    "script" : function(action){
        return {
            fnBody : action.content,
            fnDecs : []
        };
    },

    "assign" : function(action){
        var expr = generateAttributeExpression(action,'expr');
        return {
            fnBody : action.location + " = " + generateFnCall(expr.fnName) + ";",
            fnDecs : [expr.fnDec]
        };
    },

    "log" : function(action){
        var params = [],
            fnDecs = [];

        if(action.label) params.push(JSON.stringify(action.label));
        if(action.expr){ 
            var expr = generateAttributeExpression(action,'expr');
            params.push(generateFnCall(expr.fnName));
            fnDecs.push(expr.fnDec);
        }

        return {
            fnBody : "console.log(" + params.join(",") + ");",
            fnDecs : fnDecs
        };
    },

    "if" : function(action){
        var s = "", fnDecs = [];

        var ifCondExpr = generateAttributeExpression(action,'cond');

        fnDecs.push(ifCondExpr.fnDec);

        s += "if(" + generateFnCall(ifCondExpr.fnName)  + "){\n";

        var childNodes = action.actions;

        function processChild(child){
            var nameDecObj = generateActionFunction(child);
            s += '    ' + generateFnCall(nameDecObj.fnName) + ';\n';

            fnDecs.push.apply(fnDecs,nameDecObj.fnDecs);
        }


        for(var i = 0; i < childNodes.length; i++){
            var child = childNodes[i];

            if(child.type === "elseif" || child.type === "else"){
                break;
            }else{
                processChild(child);
            }
        }

        //process if/else-if, and recurse
        for(; i < childNodes.length; i++){
            child = childNodes[i];

            if(child.type === "elseif"){

                var elseIfExpr = generateAttributeExpression(child,'cond');
                fnDecs.push(elseIfExpr.fnDec); 

                s+= "}else if(" + generateFnCall(elseIfExpr.fnName)  + "){\n";
            }else if(child.type === "else"){
                s += "}";
                break;
            }else{
                processChild(child);
            }
        }

        for(; i < childNodes.length; i++){
            child = childNodes[i];

            //this should get encountered first
            if(child.type === "else"){
                s+= "else{\n";
            }else{
                processChild(child);
            }
        }
        s+= "}";

        return {
            fnBody : s, 
            fnDecs : fnDecs
        };
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

        //TODO: make fnDecAccumulator global so we can create one or two functions that write to it and cut down on this boilerplate
        var fnDecs = [];

        function processAttr(container,attr){

            var exprName = attr === 'id' ? 'idlocation' : attr + 'expr';  //the conditional is for send/@id vs. send/@idlocation. all others are just attr + 'expr'

            if(container[exprName]){
                var o = generateAttributeExpression(container, exprName);
                fnDecs.push(o.fnDec);
                return generateFnCall(o.fnName);
            }else if(container[attr]){
                return JSON.stringify(container[attr]);
            }else{
                return null;
            }
        }

        function constructSendEventData(action){

            function processSendAttr(container,attr){
                var o = generateAttributeExpression(container, attr);
                fnDecs.push(o.fnDec);
                return generateFnCall(o.fnName);
            }

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
                            props.push('"' + param.name + '"' + ":" + processSendAttr(param,'expr'));
                        }else if(param.location){
                            props.push('"' + param.name + '"' + ":" + processSendAttr(param,'location'));
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


        return {
            fnBody : send,
            fnDecs : fnDecs
        };
    },

    "foreach" : function(action){
        var isIndexDefined = action.index,
            needsToDeclareIndex = !action.index,
            index = action.index || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
            item = action.item,
            arr = action.array.expr,
            foreachNameDecObjs = action.actions.map(generateActionFunction);

        var forEachContents = 
            (needsToDeclareIndex ? 'var ' + index + ';\n' : '') +
            'if(Array.isArray(' + arr + ')){\n' +
            '    for(' + index + ' = 0; ' + index + ' < ' + arr + '.length;' + index + '++){\n' + 
            '       ' + item + ' = ' + arr + '[' + index + '];\n' + 
                        foreachNameDecObjs.map(function(o){return '       ' + generateFnCall(o.fnName) + ';';}).join('\n') + '\n' +
            '    }\n' +
            '} else{\n' + 
            '    for(' + index + ' in ' + arr + '){\n' + 
            '        if(' + arr + '.hasOwnProperty(' + index + ')){\n' +
            '           ' + item + ' = ' + arr + '[' + index + '];\n' + 
                            foreachNameDecObjs.map(function(o){return '           ' + generateFnCall(o.fnName) + ';';}).join('\n') + '\n' +
            '        }\n' + 
            '    }\n' +
            '}';

        //FIXME: we probably do not actually need to delcare a local scope for these variable, as they should be in the datamodel, thus should be in global datamodel definition. this actually means we can move all other functions up into the global scope - they don't need to be nested as they are here. although i'd be surprised if anyone relied on this feature. 
        return {
            fnBody : forEachContents,
            fnDecs : foreachNameDecObjs.map(function(o){return o.fnDecs;}).reduce(function(a,b){return a.concat(b);},[])
        };
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


