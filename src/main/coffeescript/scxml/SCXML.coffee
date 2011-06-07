define ["scxml/model","scxml/set","scxml/event","scxml/evaluator"],(model,Set,Event,evaluator) ->

	flatten = (l) ->
		a = []
		for list in l
			a = a.concat(list)

		return a

	# -> Priority: Source-Child 
	getTransitionWithHigherSourceChildPriority = ([t1,t2]) ->
		"""
		compare transitions based first on depth, then based on document order
		"""
		if t1.source.getDepth() < t2.source.getDepth()
			return t2
		else if t2.source.getDepth() < t1.source.getDepth()
			return t1
		else
			if t1.documentOrder < t2.documentOrder
				return t1
			else
				return t2


	#we make this parameterizable, not due to varying semantics, 
	#but due to possible optimizations with respect to fast, compiled data structures, e.g. state table
	#also, possible to make further optimizations based on what we assume the Priority funciton will be
	defaultGetAllActivatedTransitions = (configuration,eventSet,n) ->
		"""
		for all states in the configuration and their parents, select transitions
		if cond had side effects, then the order in which these are executed would matter
		otherwise, should not matter.
		if cond has side effects, though, merely querying could change things. 
		so, basically, cond should not have side effects... that would make this less general
		"""

		transitions = new Set

		statesAndParents = new Set

		#get full configuration, unordered
		#this means we may select transitions from parents before children
		for basicState in configuration.iter()
			statesAndParents.add(basicState)

			for ancestor in basicState.getAncestors()
				statesAndParents.add(ancestor)


		eventNames = (e.name for e in eventSet.iter())

		#FIXME: set eliminates dups
		#we should give everything ids, use js objects
		#pdb.set_trace()
		for state in statesAndParents.iter()
			for t in state.transitions
				if (not t.event or t.event in eventNames) and (not t.cond or evaluator(t.cond,n.getData,n.setData,n.In))
					transitions.add(t)

		return transitions

	class SCXMLInterpreter

		constructor : (@model, @getAllActivatedTransitions=defaultGetAllActivatedTransitions, @priorityComparisonFn=getTransitionWithHigherSourceChildPriority) ->
			@_configuration = new Set()	#full configuration, or basic configuration? what kind of set implementation?
			@_historyValue = {}
			@_innerEventQueue = []
			@_isInFinalState = false
			@_datamodel = {}		#FIXME: should these be global, or declared at the level of the big step, like the eventQueue?
			@_timeoutMap = {}

		
		start: ->
			#perform big step without events to take all default transitions and reach stable initial state
			console.info("performing initial big step")
			@_configuration.add(@model.root.initial)
			@_performBigStep()

		getConfiguration: -> new Set(s.name for s in @_configuration.iter())

		getFullConfiguration: -> new Set(s.name for s in (flatten([s].concat s.getAncestors() for s in @_configuration.iter())))

		isIn: (stateName) -> @getFullConfiguration().contains(stateName)

		_performBigStep: (e) ->
			if e then @_innerEventQueue.push(new Set([e]))

			keepGoing = true

			while keepGoing
				eventSet = if @_innerEventQueue.length then @_innerEventQueue.shift() else new Set()

				#create new datamodel cache for the next small step
				datamodelForNextStep = {}

				selectedTransitions = @_performSmallStep(eventSet,datamodelForNextStep)

				keepGoing = not selectedTransitions.isEmpty()

			nonFinalStates = (s for s of @_configuration.iter() when s.kind is not model.State.FINAL)

			if nonFinalStates.length is 0
				@_isInFinalState = true

		_performSmallStep: (eventSet,datamodelForNextStep) ->

			console.info("selecting transitions with eventSet: " , eventSet)

			selectedTransitions = @_selectTransitions(eventSet,datamodelForNextStep)

			console.info("selected transitions: " , selectedTransitions)

			if selectedTransitions

				console.info("sorted transitions: ", selectedTransitions)

				[basicStatesExited,statesExited] = @_getStatesExited(selectedTransitions)
				[basicStatesEntered,statesEntered] = @_getStatesEntered(selectedTransitions)

				console.info("basicStatesExited " , basicStatesExited)
				console.info("basicStatesEntered " , basicStatesEntered)
				console.info("statesExited " , statesExited)
				console.info("statesEntered " , statesEntered)

				eventsToAddToInnerQueue = new Set()

				#operations will be performed in the order described in Rhapsody paper

				#update history states

				console.info("executing state exit actions")
				for state in statesExited
					console.info("exiting " , state)

					#peform exit actions
					for action in state.exitActions
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

					#update history
					if state.history
						if state.history.isDeep
							f = s0 -> s0.kind is model.State.BASIC and s0 in state.getDescendants()
						else
							f = s0 -> s0.parent is state
						
						@_historyValue[state.history] = (s for s in statesExited when f(s))

				# -> Concurrency: Number of transitions: Multiple
				# -> Concurrency: Order of transitions: Explicitly defined
				sortedTransitions = selectedTransitions.iter().sort( (t1,t2) -> t1.documentOrder > t2.documentOrder)

				console.info("executing transitition actions")
				for transition in sortedTransitions
					console.info("transitition " , transition)
					for action in transition.actions
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

				console.info("executing state enter actions")
				for state in statesEntered
					console.info("entering " , state)
					for action in state.enterActions
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

				#update configuration by removing basic states exited, and adding basic states entered
				console.info("updating configuration ")
				console.info("old configuration " , @_configuration)

				@_configuration = (@_configuration.difference basicStatesExited).union basicStatesEntered

				console.info("new configuration " , @_configuration)
				
				#add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
				if not eventsToAddToInnerQueue.isEmpty()
					console.info("adding triggered events to inner queue " , eventsToAddToInnerQueue)

					@_innerEventQueue.push(eventsToAddToInnerQueue)

				#update the datamodel
				console.info("updating datamodel for next small step :")
				for own key of datamodelForNextStep
					console.info("key " , key)
					if key of @_datamodel
						console.info("old value " , @_datamodel[key])
					else
						console.info("old value is null")
					console.info("new value " , datamodelForNextStep[key])
						
					@_datamodel[key] = datamodelForNextStep[key]

			#if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
			return selectedTransitions

		_evaluateAction: (action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue) ->
			if action instanceof model.SendAction
				data = if action.contentexpr then @_eval action.contentexpr,datamodelForNextStep else null

				eventsToAddToInnerQueue.add new Event action.eventName,data
			else if action instanceof model.AssignAction
				datamodelForNextStep[action.location] = @_eval action.expr,datamodelForNextStep
			else if action instanceof model.ScriptAction
				@_eval action.code,datamodelForNextStep,true
			else if action instanceof model.LogAction
				log = @_eval action.expr,datamodelForNextStep,false
				console.log(log)

		_eval : (code,datamodelForNextStep,allowWrite) ->
			#get the scripting interface
			n = @_getScriptingInterface(datamodelForNextStep,allowWrite)

			evaluator(code,n.getData,n.setData,n.In)

		_getScriptingInterface: (datamodelForNextStep,allowWrite=false) ->
			setData : if allowWrite then (name,value) -> datamodelForNextStep[name] = value else ->
			getData : (name) => @_datamodel[name]
			In : (s) => @isIn(s)

		_getStatesExited: (transitions) ->
			statesExited = new Set()
			basicStatesExited = new Set()

			for transition in transitions.iter()
				lca = transition.getLCA()
				desc = lca.getDescendants()
			
				for state in @_configuration.iter()
					if state in desc
						basicStatesExited.add(state)
						statesExited.add(state)
						for anc in state.getAncestors(lca)
							statesExited.add(anc)

			sortedStatesExited = statesExited.iter().sort((s1,s2) -> s1.getDepth() < s2.getDepth())

			return [basicStatesExited,sortedStatesExited]

		_getStatesEntered: (transitions) ->
			statesToRecursivelyAdd = flatten((state for state in transition.targets) for transition in transitions.iter())
			console.info "statesToRecursivelyAdd :",statesToRecursivelyAdd
			statesToEnter = new Set()
			basicStatesToEnter = new Set()

			while statesToRecursivelyAdd.length
				for state in statesToRecursivelyAdd
					@_recursiveAddStatesToEnter(state,statesToEnter,basicStatesToEnter)
				
				statesToRecursivelyAdd = @_getChildrenOfParallelStatesWithoutDescendantsInStatesToEnter(statesToEnter)

			sortedStatesEntered = statesToEnter.iter().sort((s1,s2) -> s1.getDepth() > s2.getDepth())

			return [basicStatesToEnter,sortedStatesEntered]

		_getChildrenOfParallelStatesWithoutDescendantsInStatesToEnter: (statesToEnter) ->
			childrenOfParallelStatesWithoutDescendantsInStatesToEnter = new Set()

			#get all descendants of states to enter
			descendantsOfStatesToEnter = new Set()
			for state in statesToEnter.iter()
				for descendant in state.getDescendants()
					descendantsOfStatesToEnter.add(descendant)

			for state in statesToEnter.iter()
				if state.kind is model.State.PARALLEL
					for child in state.children
						if child not in descendantsOfStatesToEnter
							childrenOfParallelStatesWithoutDescendantsInStatesToEnter.add(child)

			return childrenOfParallelStatesWithoutDescendantsInStatesToEnter
				

		_recursiveAddStatesToEnter: (s,statesToEnter,basicStatesToEnter) ->
			if s.kind is model.State.HISTORY
				if s in @_historyValue
					for historyState in @_historyValue[s]
						@_recursiveAddStatesToEnter(historyState,statesToEnter,basicStatesToEnter)
				else
					statesToEnter.add(s)
					basicStatesToEnter.add(s)
			else
				statesToEnter.add(s)

				if s.kind is model.State.PARALLEL
					for child in s.children
						if not (child.kind is model.State.HISTORY)		#don't enter history by default
							@_recursiveAddStatesToEnter(child,statesToEnter,basicStatesToEnter)

				else if s.kind is model.State.COMPOSITE

					#FIXME: problem: this doesn't check cond of initial state transitions
					#also doesn't check priority of transitions (problem in the SCXML spec?)
					#TODO: come up with test case that shows other is broken
					#what we need to do here: select transitions...
					#for now, make simplifying assumption. later on check cond, then throw into the parameterized choose by priority
					@_recursiveAddStatesToEnter(s.initial,statesToEnter,basicStatesToEnter)

				else if s.kind is model.State.INITIAL or s.kind is model.State.BASIC or s.kind is model.State.FINAL
					basicStatesToEnter.add(s)

			
		_selectTransitions: (eventSet,datamodelForNextStep) ->
			allTransitions = @getAllActivatedTransitions(@_configuration,eventSet,@_getScriptingInterface(datamodelForNextStep))
			console.info("allTransitions",allTransitions)
			consistentTransitions = @_makeTransitionsConsistent allTransitions
			console.info("consistentTransitions",consistentTransitions)
			return consistentTransitions

		_makeTransitionsConsistent: (transitions) ->
			consistentTransitions = new Set()

			[transitionsNotInConflict, transitionsPairsInConflict] = @_getTransitionsInConflict transitions
			consistentTransitions = consistentTransitions.union transitionsNotInConflict

			console.log "transitions",transitions
			console.log "transitionsNotInConflict",transitionsNotInConflict
			console.log "transitionsPairsInConflict",transitionsPairsInConflict
			console.log "consistentTransitions",consistentTransitions

			while not transitionsPairsInConflict.isEmpty()

				transitions = new Set(@priorityComparisonFn t for t in transitionsPairsInConflict.iter())

				[transitionsNotInConflict, transitionsPairsInConflict] = @_getTransitionsInConflict transitions

				consistentTransitions = consistentTransitions.union transitionsNotInConflict

				console.log "transitions",transitions
				console.log "transitionsNotInConflict",transitionsNotInConflict
				console.log "transitionsPairsInConflict",transitionsPairsInConflict
				console.log "consistentTransitions",consistentTransitions

			return consistentTransitions
				
		_getTransitionsInConflict: (transitions) ->

			allTransitionsInConflict = new Set() 	#set of tuples
			transitionsPairsInConflict = new Set() 	#set of tuples

			#better to use iterators, because not sure how to encode "order doesn't matter" to list comprehension
			transitionList = transitions.iter()
			console.info("transitions",transitionList)

			for i in [0...transitionList.length]
				for j in [i+1...transitionList.length]
					t1 = transitionList[i]
					t2 = transitionList[j]
					
					if @_conflicts(t1,t2)
						allTransitionsInConflict.add t1
						allTransitionsInConflict.add t2
						transitionsPairsInConflict.add [t1,t2]

			transitionsNotInConflict = transitions.difference allTransitionsInConflict

			return [transitionsNotInConflict,transitionsPairsInConflict]
		

		#this would be parameterizable
		# -> Transition Consistency: Small-step consistency: Source/Destination Orthogonal
		# -> Interrupt Transitions and Preemption: Non-preemptive 
		_conflicts: (t1,t2) -> not @_isArenaOrthogonal(t1,t2)
		
		_isArenaOrthogonal: (t1,t2) ->
			t1.getLCA().isOrthogonalTo t2.getLCA()


	class SimpleInterpreter extends SCXMLInterpreter

		constructor: (model,setTimeout=null,clearTimeout=null) ->
			@setTimeout = setTimeout
			@clearTimeout = clearTimeout
			super model
			
		_evaluateAction: (action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue) ->
			if action instanceof model.SendAction and action.timeout
				if @setTimeout
					data = if action.contentexpr then eval(action.contentexpr) else null

					callback = => @gen new Event(action.eventName,data)
					timeoutId = @setTimeout callback,action.timeout

					if action.sendid
						@_timeoutMap[action.sendid] = timeoutId
				else
					throw Exception("setTimeout function not set")

			else if action instanceof model.CancelAction
				if @clearTimeout
					if action.sendid of @_timeoutMap
						@clearTimeout @_timeoutMap[action.sendid]
				else
					throw Exception("clearTimeout function not set")
			else
				super action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue

		#External Event Communication: Asynchronous
		gen: (e) ->
			#pass it straight through	
			console.info("received event " + e)
			@_performBigStep(e)

	SCXMLInterpreter:SCXMLInterpreter
	SimpleInterpreter:SimpleInterpreter
