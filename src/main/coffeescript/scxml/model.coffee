# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/state-kinds-enum"],(stateKinds)->

	getDepth: (s) ->
		count = 0
		state = s.parent
		while state
			count = count + 1
			state = state.parent

		return count

	getAncestors: (s,root) ->
		ancestors = []

		state = s.parent
		while state and not (state is root)
			ancestors.push(state)
			state = state.parent

		return ancestors

	getAncestorsOrSelf: (s,root) -> [s].concat @getAncestors(s,root)

	getDescendants: (s) ->
		descendants = []
		queue = s.children.slice()

		while queue.length
			state = queue.shift()
			descendants.push(state)

			for child in state.children
				queue.push(child)

		return descendants

	getDescendantsOrSelf: (s) -> [s].concat @getDescendants(s)

	isOrthogonalTo: (s1,s2) ->
		#Two control states are orthogonal if they are not ancestrally
		#related, and their smallest, mutual parent is a Concurrent-state.
		return not @isAncestrallyRelatedTo(s1,s2) and @getLCA(s1,s2).kind is stateKinds.PARALLEL

	isAncestrallyRelatedTo: (s1,s2) ->
		#Two control states are ancestrally related if one is child/grandchild of another.
		return s1 in @getAncestorsOrSelf(s2) or s2 in @getAncestorsOrSelf(s1)

	getLCA: (tOrS1,s2) ->
		#can take one or two arguments: either 1 transition, or two states
		if arguments.length is 1
			transition = tOrS1
			return @getLCA transition.source,transition.targets[0]
		else
			s1 = tOrS1
			commonAncestors = (a for a in @getAncestors(s1) when s2 in @getDescendants(a))
			return commonAncestors[0]
