define ->
	BASIC : 0
	COMPOSITE : 1
	PARALLEL : 2
	#AND : 3
	HISTORY : 4
	INITIAL : 5
	FINAL : 6

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
		return not @isAncestrallyRelatedTo(s1,s2) and @getLCA(s1,s2).kind is @PARALLEL

	isAncestrallyRelatedTo: (s1,s2) ->
		#Two control states are ancestrally related if one is child/grandchild of another.
		return s1 in @getAncestorsOrSelf(s2) or s2 in @getAncestorsOrSelf(s1)

	getLCA: (s1,s2) ->
		commonAncestors = (a for a in @getAncestors(s1) when s2 in @getDescendants(a))
		return commonAncestors[0]
