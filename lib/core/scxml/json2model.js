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

var platform = require('../../platform').platform;

//TODO: move all the code gen stuff out into the code generation module. 
//TODO: add main method that accepts a json document and returns the js string that will be evaluated
//TODO: write developer documentation describing this transformation. 

//this creates the string which declares the datamodel in the document scope
function makeDatamodelDeclaration(datamodel){
    var s = "var ";
    var vars = [];
    for(var id in datamodel){
        var expr = datamodel[id];
        vars.push(expr ? id + " = " + expr : id);
    }
    return vars.length ? s + vars.join(", ") + ";" : "";
}

//this exposes a getter and setter API on the datamodel in the document scope
function makeDatamodelClosures(datamodel){
    var vars = [];
    for(var id in datamodel){
        vars.push( '"' + id + '" : {\n' + 
            '"set" : function(v){ return ' + id + ' = v; },\n' + 
            '"get" : function(){ return ' + id + ';}' + 
        '\n}');
    }
    return '{\n' + vars.join(',\n') + '\n}';
}

//this function ensures that the code in each SCXML document will run in "document scope".
//SCXML embeds js code as strings in the document, hence the use of "eval" to dynamically evaluate things.
//This function ensures that eval() is only called once, when the model is parsed. It will not be called during execution of the statechart.
//However, each SCXML interpreter instance will have its own copies of the functions declared in the document. 
//This is similar to the way HTML works - each page has its own copies of evaluated scripts.
function makeActionFactory(topLevelScripts,actionStrings,datamodel,documentUrl){
    var fnBody = makeDatamodelDeclaration(datamodel) + 
                (topLevelScripts.length ? topLevelScripts.join("\n") : "") + 
                "return {\n" + 
                    "datamodel:" +  makeDatamodelClosures(datamodel) + "," + 
                    "actions:[\n" + actionStrings.join(",\n") + "\n]" +   //return all functions which get called during execution
                "\n};";

    var fnStr = "function($log,$cancel,$send,$origin,In){\n" + fnBody + "\n}";

    var requireName = documentUrl + ".jsstr";   //give him a custom extension so that it is handled correctly

    //console.log(fnStr); 
    return platform.eval(fnStr,requireName); 
}

module.exports = function(json,documentUrl) {

    function makeEvaluationFn(action,isExpression){
        return actionStrings.push( "function(getData,setData,_events,$raise){var _event = _events[0];\n" +
            (isExpression ? "return" : "") + " " + action + 
        "\n}" ) - 1;

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

            if(transition.lca){
                transition.lca = idToStateMap[transition.lca];
            }
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

    json.actionFactory = makeActionFactory(json.scripts,actionStrings,json.datamodel,documentUrl); 

    return json;
};

