//     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
//
//     Licensed under the Apache License, Version 2.0 (the "License");
//     you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
//             http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.

"use strict";

var pm = require('../../platform'),
    cg = require('../util/code-gen');

function linkReferencesAndGenerateActionFactory(json){

    function makeEvaluationFn(action,isExpression){
        return actionStrings.push(cg.gen.util.wrapFunctionBodyInDeclaration(action,isExpression)) - 1;
    }

    function stateIdToReference(stateId){
        return idToStateMap[stateId];
    }

    var actionStrings = [];
    var idToStateMap = {};
    json.states.forEach(function(state){
        idToStateMap[state.id] = state;
    });

    json.transitions.forEach(function(transition){
        if(transition.cond) transition.conditionActionRef = makeEvaluationFn(transition.cond,true);
    });

    json.states.forEach(function(state){
        state.transitions = state.transitions.map(function(transitionNum){ return json.transitions[transitionNum];});

        var actions = [];

        if(state.onentry) state.onentry = makeEvaluationFn(state.onentry); 
        if(state.onexit) state.onexit = makeEvaluationFn(state.onexit);

        state.transitions.forEach(function(transition){
            if(transition.actions) transition.actions = makeEvaluationFn(transition.actions);

            if(transition.lcca){
                transition.lcca = idToStateMap[transition.lcca];
            }

            transition.scope = idToStateMap[transition.scope];
        });

        state.initial = idToStateMap[state.initial];
        state.history = idToStateMap[state.history];
        
        state.children = state.children.map(stateIdToReference);

        state.parent = idToStateMap[state.parent];

        if (state.ancestors) {
            state.ancestors = state.ancestors.map(stateIdToReference);
        }

        if (state.descendants) {
            state.descendants = state.descendants.map(stateIdToReference);
        }

        state.transitions.forEach(function(t){
            t.source = idToStateMap[t.source];
            t.targets = t.targets && t.targets.map(stateIdToReference);
        });
    });

    json.root = idToStateMap[json.root];

    var actionFactoryString = cg.gen.util.makeActionFactory(json.scripts,actionStrings,json.datamodel); 

    return actionFactoryString;
}

function annotatedJsonToModel(json,documentUrl) {
    var actionFactoryString = linkReferencesAndGenerateActionFactory(json);
    try {
        json.actionFactory = pm.platform.eval(actionFactoryString,documentUrl); 
    }catch(e){
        pm.platform.log("Failed to evaluate action factory.");
        pm.platform.log("Generated js code to evaluate\n",actionFactoryString);
        //require('fs').writeFileSync('out.js',actionFactoryString,'utf8');
        throw e;
    }
}

module.exports = function(json,documentUrl){
    annotatedJsonToModel(json,documentUrl);
    return json;
};

//TODO: get google closure to compile this out as dead code in the browser build
if(require.main === module){
    var fileName = process.argv[2];

    //this prints out the generated code from a json file which is the output of annotate-scxml-json
    var done = function(err,annotatedJsonStr){
        if(err) throw err;
        process.stdout.write(linkReferencesAndGenerateActionFactory(JSON.parse(annotatedJsonStr)));
    };

    if(fileName === "-"){
        //read from stdin
        var s = "";
        process.stdin.resume();
        process.stdin.on("data",function(data){
            s += data;
        });
        process.stdin.on("end",function(data){
            done(null,s); 
        });
    }else{
        //read from fs
        var fs = require('fs');  
        fs.readFile(fileName,'utf8',done);
    }

}
