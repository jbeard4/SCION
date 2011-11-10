# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/model"],(model) ->
	#local imports
	SCXMLModel = model.SCXMLModel
	State = model.State
	Transition = model.Transition
	SendAction = model.SendAction
	CancelAction = model.CancelAction
	LogAction = model.LogAction
	AssignAction = model.AssignAction
	ScriptAction = model.ScriptAction

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

	jsonToModel = (json) ->
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

			for action in actions
				switch action.type
					when "script"
						action.evaluate = makeEvaluationFn action.script

					when "assign"
						action.evaluate = makeEvaluationFn action.expr,true

					when "send"
						if action.contentexpr
							action.evaluate = makeEvaluationFn action.contentexpr,true
					when "log"
						action.evaluate = makeEvaluationFn action.expr,true

				if action.type is "send" and action.delay
					action.delay = getDelayInMs action.delay


			state.initial = idToStateMap[state.initial]
			state.history = idToStateMap[state.history]

			state.children = (idToStateMap[stateId] for stateId in state.children)

			state.parent = idToStateMap[state.parent]

			for t in state.transitions
				t.source = idToStateMap[t.source]
				t.targets = (idToStateMap[stateId] for stateId in t.targets)

		json.root = idToStateMap[json.root]

		return json
