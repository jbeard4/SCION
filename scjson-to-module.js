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

function generateActionFunction(action){
    var isExpression = !action.type;

    //TODO: pretty-print the generated code? might be a good command-line option
    var fnName = '$' + (isExpression  ? 'expression' : action.type) + '_line_' + action.$line + '_column_' + action.$column;
    var fnBody = isExpression ? action.expr : actionTags[action.type](action);
    var fullFnBody = 
        (isExpression ? 'return ' : '' ) + 
            fnBody  + 
            (isExpression ? ';' : '' );
    var fnDec = 'function ' + fnName + '(){\n' +
        fullFnBody.split('\n').map(function(line){return '    ' + line;}).join('\n') + '\n' +   //do some lightweight formatting
    '}';

    return {
        fnName : fnName,
        fnDec : fnDec 
    };
}

function generateExpressionFunction(expr){
    //TODO
    //return reference string
}

var REFERENCE_MARKER = '__xx__DELETE_ME__xx__',
    REFERENCE_MARKER_RE = new RegExp('"' + REFERENCE_MARKER + '(.*)' + REFERENCE_MARKER + '"','g') ;

function generateDatamodelDeclaration(datamodelAccumulator){
    var s = "var ";
    var vars = [];
    datamodelAccumulator.forEach(function(data){
        //FIXME: each of these with an expression needs a fn declaration which will get called here
        vars.push(data.id + (data.expr ? (' = ' + data.expr) : ''));
    });
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

function generateModule(rootState,datamodelAccumulator,fnDecAccumulator){
    //only commonjs module for now
    var sm = [
        generateDatamodelDeclaration(datamodelAccumulator),
        '',
        dumpFunctionDeclarations(fnDecAccumulator),
        '',
        'module.exports = ' + generateSmObjectLiteral(rootState) + ';'];

    return sm.join('\n');
}

function markAsReference(fnName){
    //FIXME: do we need this fn?
}

function replaceActions(actionContainer,actionPropertyName,fnDecAccumulator){
    if(actionContainer[actionPropertyName]){
        var actions = Array.isArray(actionContainer[actionPropertyName]) ? actionContainer[actionPropertyName] : [actionContainer[actionPropertyName]] ;
        
        var actionDescriptors = actions.map(generateActionFunction);
        actionContainer[actionPropertyName] = actionDescriptors.map(function(o){return  REFERENCE_MARKER + o.fnName + REFERENCE_MARKER;});
        fnDecAccumulator.push.apply(fnDecAccumulator,actionDescriptors.map(function(o){return o.fnDec;}));

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

            replaceActions(transition,'cond',fnDecAccumulator);
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
        return action.content;
    },

    "assign" : function(action){
        return action.location + " = " + action.expr.expr + ";";
    },

    "log" : function(action){
        var params = [];

        if(action.label) params.push(JSON.stringify(action.label));
        if(action.label) params.push(action.expr.expr);

        return "console.log(" + params.join(",") + ");";
    },

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
    */

    "foreach" : function(action){
        var isIndexDefined = action.index,
            index = action.index || "$i",        //FIXME: the index variable could shadow the datamodel. We should pick a unique temperorary variable name
            item = action.item,
            arr = action.array.expr,
            foreachNameDecObjs = action.actions.map(generateActionFunction);

        var loopContents = foreachNameDecObjs.map(function(o){return o.fnName + '();';}).join('\n');

        var forEachContents = 
            'if(Array.isArray(' + arr + ')){\n' +
            '    for(' + index + ' = 0; ' + index + ' < ' + arr + '.length;' + index + '++){\n' + 
            '       ' + item + ' = ' + arr + '[' + index + '];\n' + 
            '       ' + loopContents + '\n' +
            '    }\n' +
            '} else{\n' + 
            '    for(' + index + ' in ' + arr + '){\n' + 
            '        if(' + arr + '.hasOwnProperty(' + index + ')){\n' +
            '           ' + item + ' = ' + arr + '[' + index + '];\n' + 
            '           ' + loopContents + '\n' +
            '        }\n' + 
            '    }\n' +
            '}';

        return [
                'var ' + [item,index].join(' ,') + ';',      
                foreachNameDecObjs.map(function(o){return o.fnDec;}).join('\n'),
                forEachContents  
            ].join('\n\n');
    }
};


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


