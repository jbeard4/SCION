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

var actionTags = require('./action-tags');

function generateActionFunction(action){
    //TODO: pretty-print the generated code? might be a good command-line option
    var fnName = '$' + action.type + '_line_' + action.$line + '_column_' + action.$column;
    var fnDec = 'function  ' + fnName + '(){\n' +
        actionTags[action.type](action) + '\n' +
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
        var actionDescriptors = actionContainer[actionPropertyName].map(generateActionFunction);
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

            //TODO: deal with cond
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


if(require.main === module){
    //read from stdin or file
    //TODO: read from file
    /*
    process.stdin.unpause();
    process.stdin.setEncoding('utf8');

    var jsonString = '';
    process.stdin.on('data',function(s){
        jsonString  += s;
    });

    process.stdin.on('end',function(){
        var moduleString = startTraversal(JSON.parse(jsonString));
        console.log(moduleString); 
    });
    */
    var sm = require('./test0.json');
    var moduleString = startTraversal(sm);
    console.log(moduleString); 
}
