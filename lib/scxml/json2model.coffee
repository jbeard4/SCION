#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

#TODO:move this out
getDelayInMs = (delayString) ->
    if not delayString
        return 0
    else
        if delayString[-2..] == "ms"
            return parseFloat(delayString[..-3])
        else if delayString[-1..] == "s"
            return parseFloat(delayString[..-2]) * 1000
        else
            #assume milliseconds
            return parseFloat(delayString)

#we alias _event to _events[0] here for convenience
makeEvaluationFn = (s,isExpression) -> new Function("getData","setData","In","_events","datamodel","var _event = _events[0]; with(datamodel){#{if isExpression then "return" else ""} #{s}}")

stateToString = -> @id

transitionToString = -> "#{@source.id} -> [#{target.id for target in @targets}]"

module.exports = (json) ->
    #build up map of state ids to state objects
    idToStateMap = {}
    for state in json.states
        idToStateMap[state.id] = state

    for transition in json.transitions
        transition.toString = transitionToString 	#tag him with a toString method for more readable trace
        transition.evaluateCondition = makeEvaluationFn transition.cond,true

    for state in json.states
        state.toString = stateToString 	#tag him with a toString method for more readable trace

        state.transitions = (json.transitions[transitionNum] for transitionNum in state.transitions)

        #TODO: move this block out, make it cleaner
        actions = state.onentry.concat state.onexit
        for transition in state.transitions
            for action in transition.actions
                actions.push action

            if transition.lca
                transition.lca = idToStateMap[transition.lca]

        for action in actions
            switch action.type
                when "script"
                    action.evaluate = makeEvaluationFn action.script

                when "assign"
                    action.evaluate = makeEvaluationFn action.expr,true

                when "send"

                    for attributeName in ['contentexpr', 'eventexpr', 'targetexpr', 'typeexpr', 'delayexpr']
                        if action[attributeName]
                            action[attributeName] = { evaluate : makeEvaluationFn action[attributeName],true }

                    for param in action.params
                        if param.expr
                            param.expr = { evaluate : makeEvaluationFn param.expr,true }
                when "log"
                    action.evaluate = makeEvaluationFn action.expr,true

            if action.type is "send" and action.delay
                action.delay = getDelayInMs action.delay


        state.initial = idToStateMap[state.initial]
        state.history = idToStateMap[state.history]

        state.children = (idToStateMap[stateId] for stateId in state.children)

        state.parent = idToStateMap[state.parent]

        if state.ancestors
            state.ancestors = (idToStateMap[stateId] for stateId in state.ancestors)

        if state.descendants
            state.descendants = (idToStateMap[stateId] for stateId in state.descendants)

        for t in state.transitions
            t.source = idToStateMap[t.source]
            t.targets = t.targets and (idToStateMap[stateId] for stateId in t.targets)

    json.root = idToStateMap[json.root]

    return json
