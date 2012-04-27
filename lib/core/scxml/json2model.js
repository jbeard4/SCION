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

function makeEvaluationFn(s, isExpression) {
    return new Function(
        "getData", 
        "setData", 
        "In", 
        "_events", 
        "datamodel", 
        "var _event = _events[0]; with(datamodel){" + (isExpression ? "return" : "") + " " + s + "}");
}

module.exports = function(json) {

    function stateIdToReference(stateId){
        return idToStateMap[stateId];
    }

    var idToStateMap = {};
    json.states.forEach(function(state){
        idToStateMap[state.id] = state;
    });

    json.transitions.forEach(function(transition){
        transition.evaluateCondition = makeEvaluationFn(transition.cond,true);
    });

    json.states.forEach(function(state){
        state.transitions = state.transitions.map(function(transitionNum){ return json.transitions[transitionNum];});

        var actions = state.onentry.concat(state.onexit);

        state.transitions.forEach(function(transition){
            transition.actions.forEach(function(action){
                actions.push(action);
            });

            if(transition.lca){
                transition.lca = idToStateMap[transition.lca];
            }
        });

        actions.forEach(function(action){
            switch (action.type) {
                case "script":
                    action.evaluate = makeEvaluationFn(action.script);
                    break;
                case "assign":
                    action.evaluate = makeEvaluationFn(action.expr, true);
                    break;
                case "send":
                    ['contentexpr', 'eventexpr', 'targetexpr', 'typeexpr', 'delayexpr'].
                        filter(function(attributeName){return action[attributeName];}).
                        forEach(function(attributeName){
                            action[attributeName] = {
                                evaluate: makeEvaluationFn(action[attributeName], true)
                            };
                        });

                    action.params.forEach(function(param){
                        if (param.expr) {
                            param.expr = {
                                evaluate: makeEvaluationFn(param.expr, true)
                            };
                        }
                    });
                    break;
                case "log":
                    action.evaluate = makeEvaluationFn(action.expr, true);
                    break;
                default : break;
            }

            if (action.type === "send" && action.delay) {
                action.delay = getDelayInMs(action.delay);
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

    return json;
};

