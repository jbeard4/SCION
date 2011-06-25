#this module relies on extra information being compiled into the json in order to speed certain methods
#here, we just overwrite methods on model
define ->
	(json) ->
		#build up map of state ids to state objects
		idToStateMap = {}
		for state in json.states
			idToStateMap[state.id] = state

		for transition in json.transitions
			transition.lca = idToStateMap[transition.lca]

		for state in json.states
			state.ancestors = (idToStateMap[stateId] for stateId in state.ancestors)
			state.descendants = (idToStateMap[stateId] for stateId in state.descendants)

		return json
