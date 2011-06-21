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

	jsonToModel = (json) ->
		#build up map of state ids to state objects
		idToStateMap = {}
		for state in json.states
			idToStateMap[state.id] = state

		for state in json.states
			state.transitions = (json.transitions[transitionNum] for transitionNum in state.transitions)

			#TODO: move this block out, make it cleaner
			actions = state.onentry.concat state.onexit
			for transition in state.transitions
				for action in transition.actions
					actions.push action

			for action in actions when action.type is "send" and action.delay
				action.delay = getDelayInMs action.delay

			state.initial = idToStateMap[state.initial]
			state.history = idToStateMap[state.history]

			state.children = (idToStateMap[stateId] for stateId in state.children)

			state.parent = idToStateMap[state.parent]

			for t in state.transitions
				t.source = idToStateMap[t.source]
				t.targets = (idToStateMap[stateId] for stateId in t.targets.split(" "))

		json.root = idToStateMap[json.root]

		return json
