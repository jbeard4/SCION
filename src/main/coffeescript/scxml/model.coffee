define ->
	class SCXMLModel
		constructor: (@root,@profile) ->

	class State
		@BASIC = 0
		@COMPOSITE = 1
		@PARALLEL = 2
		#AND = 3
		@HISTORY = 4
		@INITIAL = 5
		@FINAL = 6

		constructor: (@name,@kind,@documentOrder,@isDeep,@transitions = [],@children = [],@parent,@initial,@history,@exitActions = [],@enterActions = []) ->

		toString: -> @name

		hashCode: -> @name

		getDepth: ->
			count = 0
			state = @parent
			while state
				count = count + 1
				state = state.parent

			return count

		getAncestors: (root) ->
			ancestors = []

			state = @parent
			while state and not (state is root)
				ancestors.push(state)
				state = state.parent

			return ancestors

		getAncestorsOrSelf: (root) -> [@].concat @getAncestors(root)

		getDescendants: ->
			descendants = []
			queue = @children.slice()

			while queue.length
				state = queue.shift()
				descendants.push(state)

				for child in state.children
					queue.push(child)

			return descendants

		getDescendantsOrSelf: -> [@].concat @getDescendants()

		isOrthogonalTo: (s) ->
			#Two control states are orthogonal if they are not ancestrally
			#related, and their smallest, mutual parent is a Concurrent-state.
			return not @isAncestrallyRelatedTo(s) and @getLCA(s).kind is State.PARALLEL

		isAncestrallyRelatedTo: (s) ->
			#Two control states are ancestrally related if one is child/grandchild of another.
			s.getAncestorsOrSelf()
			return @ in s.getAncestorsOrSelf() or s in @getAncestorsOrSelf()

		getLCA: (s) ->
			commonAncestors = (a for a in @getAncestors() when s in a.getDescendants())
			return commonAncestors[0]

	class Transition
		constructor: (@id,@event=null,@documentOrder=0,@cond=null,@source = null,@targets = null,@actions = []) ->


		toString: -> @source.name + " -> " + (target.name for target in @targets)

		hashCode: -> @id

		getLCA: -> @source.getLCA(@targets[0])

	class SendAction
		constructor: (@eventName="",@timeout=0,@sendid,@contentexpr) ->

	class CancelAction
		constructor: (@sendid) ->

	class LogAction
		constructor: (@expr) ->

	class AssignAction
		constructor: (@location="",@expr="") ->

	class ScriptAction
		constructor: (@code="") ->

	#return the interface to this module
	SCXMLModel : SCXMLModel
	State : State
	Transition : Transition
	SendAction : SendAction
	CancelAction : CancelAction
	LogAction : LogAction
	AssignAction : AssignAction
	ScriptAction : ScriptAction
