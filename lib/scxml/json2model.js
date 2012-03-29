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

var _ = require('underscore');

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
    _.forEach(json.states,function(state){
        idToStateMap[state.id] = state;
    });

    _.forEach(json.transitions,function(transition){
        transition.evaluateCondition = makeEvaluationFn(transition.cond,true);
    });

    _.forEach(json.states,function(state){
        state.transitions = _.map(state.transitions,function(transitionNum){ return json.transitions[transitionNum];});

        var actions = state.onentry.concat(state.onexit);

        _.forEach(state.transitions,function(transition){
            _.forEach(transition.actions,function(action){
                actions.push(action);
            });

            if(transition.lca){
                transition.lca = idToStateMap[transition.lca];
            }
        });

        _.forEach(actions,function(action){
            switch (action.type) {
                case "script":
                    action.evaluate = makeEvaluationFn(action.script);
                    break;
                case "assign":
                    action.evaluate = makeEvaluationFn(action.expr, true);
                    break;
                case "send":
                    _.forEach(['contentexpr', 'eventexpr', 'targetexpr', 'typeexpr', 'delayexpr'],function(attributeName){
                        if (action[attributeName]) {
                            action[attributeName] = {
                                evaluate: makeEvaluationFn(action[attributeName], true)
                            };
                        }
                    });

                    _.forEach(action.params,function(param){
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
        
        state.children = _.map(state.children,stateIdToReference);

        state.parent = idToStateMap[state.parent];

        if (state.ancestors) {
            state.ancestors = _.map(state.ancestors,stateIdToReference);
        }

        if (state.descendants) {
            state.descendants = _.map(state.descendants,stateIdToReference);
        }

        _.forEach(state.transitions,function(t){
            t.source = idToStateMap[t.source];
            t.targets = t.targets && _.map(t.targets,stateIdToReference);
        });
    });

    json.root = idToStateMap[json.root];

    return json;
};

