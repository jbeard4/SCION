define ->
	->
		(state,eventNames,evaluator) ->
			transitions = []

			for t in state.transitions
				if (not t.event or t.event in eventNames) and (not t.cond or evaluator(t.cond))
					transitions.push t

			return transitions
