# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ->
	->
		(state,eventNames,evaluator) ->
			transitions = []

			for t in state.transitions
				if (not t.event or t.event in eventNames) and (not t.cond or evaluator(t.cond))
					transitions.push t

			return transitions
