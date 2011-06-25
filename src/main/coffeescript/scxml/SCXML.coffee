define ["scxml/model","util/set/ArraySet","scxml/event","scxml/evaluator"],(model,ArraySet,Event,evaluator) ->
	#imports

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
		if model.getDepth(t1.source) < model.getDepth(t2.source)
			return t2
		else if model.getDepth(t2.source) < model.getDepth(t1.source)
			return t1
		else
			if t1.documentOrder < t2.documentOrder
				return t1
			else
				return t2

	#we make this parameterizable, not due to varying semantics, 
	#but due to possible optimizations with respect to fast, compiled data structures, e.g. state table
	#also, possible to make further optimizations based on what we assume the Priority funciton will be
	defaultTransitionSelector = (states,events,evaluator) ->
		transitions = []

		eventNames = (e.name for e in events)

		for state in states
			for t in state.transitions
				if (not t.event or t.event in eventNames) and (not t.cond or evaluator(t.cond))
					transitions.push t

		return transitions

	class SCXMLInterpreter

		constructor : (@model,@opts={}) ->
			#default args
			@opts.transitionSelector=defaultTransitionSelector
			@opts.onlySelectFromBasicStates=false
			#@opts.TransitionSet
			#@opts.StateSet
			#@opts.BasicStateSet
			@opts.StateIdSet=ArraySet
			@opts.EventSet=ArraySet
			@opts.TransitionPairSet=ArraySet
			@opts.priorityComparisonFn=getTransitionWithHigherSourceChildPriority
			@opts.printTrace=false

			@_configuration = new @opts.BasicStateSet()	#full configuration, or basic configuration? what kind of set implementation?
			@_historyValue = {}
			@_innerEventQueue = []
			@_isInFinalState = false
			@_datamodel = {}		#FIXME: should these be global, or declared at the level of the big step, like the eventQueue?
			@_timeoutMap = {}

		
		start: ->
			#perform big step without events to take all default transitions and reach stable initial state
			if @opts.printTrace then console.debug("performing initial big step")
			@_configuration.add(@model.root.initial)
			@_performBigStep()

		getConfiguration: -> new @opts.StateIdSet(s.id for s in @_configuration.iter())

		getFullConfiguration: -> new @opts.StateIdSet(s.id for s in (flatten([s].concat model.getAncestors(s) for s in @_configuration.iter())))

		isIn: (stateName) -> @getFullConfiguration().contains(stateName)

		_performBigStep: (e) ->
			if e then @_innerEventQueue.push(new @opts.EventSet([e]))

			keepGoing = true

			while keepGoing
				eventSet = if @_innerEventQueue.length then @_innerEventQueue.shift() else new @opts.EventSet()

				#create new datamodel cache for the next small step
				datamodelForNextStep = {}

				selectedTransitions = @_performSmallStep(eventSet,datamodelForNextStep)

				keepGoing = not selectedTransitions.isEmpty()

			nonFinalStates = (s for s of @_configuration.iter() when s.kind is not model.FINAL)

			if nonFinalStates.length is 0
				@_isInFinalState = true

		_performSmallStep: (eventSet,datamodelForNextStep) ->

			if @opts.printTrace then console.debug("selecting transitions with eventSet: " , eventSet)

			selectedTransitions = @_selectTransitions(eventSet,datamodelForNextStep)

			if @opts.printTrace then console.debug("selected transitions: " , selectedTransitions)

			if selectedTransitions

				if @opts.printTrace then console.debug("sorted transitions: ", selectedTransitions)

				[basicStatesExited,statesExited] = @_getStatesExited(selectedTransitions)
				[basicStatesEntered,statesEntered] = @_getStatesEntered(selectedTransitions)

				if @opts.printTrace then console.debug("basicStatesExited " , basicStatesExited)
				if @opts.printTrace then console.debug("basicStatesEntered " , basicStatesEntered)
				if @opts.printTrace then console.debug("statesExited " , statesExited)
				if @opts.printTrace then console.debug("statesEntered " , statesEntered)

				eventsToAddToInnerQueue = new @opts.EventSet()

				#operations will be performed in the order described in Rhapsody paper

				#update history states

				if @opts.printTrace then console.debug("executing state exit actions")
				for state in statesExited
					if @opts.printTrace then console.debug("exiting " , state)

					#peform exit actions
					for action in state.onexit
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

					#update history
					if state.history
						if state.history.isDeep
							f = (s0) -> s0.kind is model.BASIC and s0 in model.getDescendants(state)
						else
							f = (s0) -> s0.parent is state
						
						@_historyValue[state.history.id] = (s for s in statesExited when f(s))

				# -> Concurrency: Number of transitions: Multiple
				# -> Concurrency: Order of transitions: Explicitly defined
				sortedTransitions = selectedTransitions.iter().sort( (t1,t2) -> t1.documentOrder > t2.documentOrder)

				if @opts.printTrace then console.debug("executing transitition actions")
				for transition in sortedTransitions
					if @opts.printTrace then console.debug("transitition " , transition)
					for action in transition.actions
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

				if @opts.printTrace then console.debug("executing state enter actions")
				for state in statesEntered
					if @opts.printTrace then console.debug("entering " , state)
					for action in state.onentry
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

				#update configuration by removing basic states exited, and adding basic states entered
				if @opts.printTrace then console.debug("updating configuration ")
				if @opts.printTrace then console.debug("old configuration " , @_configuration)

				@_configuration.difference basicStatesExited
				@_configuration.union basicStatesEntered

				if @opts.printTrace then console.debug("new configuration " , @_configuration)
				
				#add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
				if not eventsToAddToInnerQueue.isEmpty()
					if @opts.printTrace then console.debug("adding triggered events to inner queue " , eventsToAddToInnerQueue)

					@_innerEventQueue.push(eventsToAddToInnerQueue)

				#update the datamodel
				if @opts.printTrace then console.debug("updating datamodel for next small step :")
				for own key of datamodelForNextStep
					if @opts.printTrace then console.debug("key " , key)
					if key of @_datamodel
						if @opts.printTrace then console.debug("old value " , @_datamodel[key])
					else
						if @opts.printTrace then console.debug("old value is null")
					if @opts.printTrace then console.debug("new value " , datamodelForNextStep[key])
						
					@_datamodel[key] = datamodelForNextStep[key]

			#if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
			return selectedTransitions


		_evaluateAction: (action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue) ->
			switch action.type
				when "send"
					if @opts.printTrace then console.debug "sending event",action.event,"with content",action.contentexpr
					data = if action.contentexpr then @_eval action.contentexpr,datamodelForNextStep,eventSet else null

					eventsToAddToInnerQueue.add new Event action.event,data
				when "assign"
					datamodelForNextStep[action.location] = @_eval action.expr,datamodelForNextStep,eventSet
				when "script"
					@_eval action.script,datamodelForNextStep,eventSet,true
				when "log"
					log = @_eval action.expr,datamodelForNextStep,eventSet
					if @opts.printTrace then console.log(log)	#the one place where we use straight console.log

		_eval : (code,datamodelForNextStep,eventSet,allowWrite) ->
			#get the scripting interface
			n = @_getScriptingInterface(datamodelForNextStep,eventSet,allowWrite)

			evaluator(code,n.getData,n.setData,n.In,n.events)

		_getScriptingInterface: (datamodelForNextStep,eventSet,allowWrite=false) ->
			setData : if allowWrite then (name,value) -> datamodelForNextStep[name] = value else ->
			getData : (name) => @_datamodel[name]
			In : (s) => @isIn(s)
			events : eventSet.iter()

		_getStatesExited: (transitions) ->
			statesExited = new @opts.StateSet()
			basicStatesExited = new @opts.BasicStateSet()

			for transition in transitions.iter()
				lca = model.getLCA(transition.source,transition.targets[0])
				desc = model.getDescendants(lca)
			
				for state in @_configuration.iter()
					if state in desc
						basicStatesExited.add(state)
						statesExited.add(state)
						for anc in model.getAncestors(state,lca)
							statesExited.add(anc)

			sortedStatesExited = statesExited.iter().sort((s1,s2) -> model.getDepth(s1) < model.getDepth(s2))

			return [basicStatesExited,sortedStatesExited]

		_getStatesEntered: (transitions) ->
			statesToRecursivelyAdd = flatten((state for state in transition.targets) for transition in transitions.iter())
			if @opts.printTrace then console.debug "statesToRecursivelyAdd :",statesToRecursivelyAdd
			statesToEnter = new @opts.StateSet()
			basicStatesToEnter = new @opts.BasicStateSet()

			while statesToRecursivelyAdd.length
				for state in statesToRecursivelyAdd
					@_recursiveAddStatesToEnter(state,statesToEnter,basicStatesToEnter)
				
				statesToRecursivelyAdd = @_getChildrenOfParallelStatesWithoutDescendantsInStatesToEnter(statesToEnter)

			sortedStatesEntered = statesToEnter.iter().sort((s1,s2) -> model.getDepth(s1) > model.getDepth(s2))

			return [basicStatesToEnter,sortedStatesEntered]

		_getChildrenOfParallelStatesWithoutDescendantsInStatesToEnter: (statesToEnter) ->
			childrenOfParallelStatesWithoutDescendantsInStatesToEnter = new @opts.StateSet()

			#get all descendants of states to enter
			descendantsOfStatesToEnter = new @opts.StateSet()
			for state in statesToEnter.iter()
				for descendant in model.getDescendants(state)
					descendantsOfStatesToEnter.add(descendant)

			for state in statesToEnter.iter()
				if state.kind is model.PARALLEL
					for child in state.children
						if not descendantsOfStatesToEnter.contains(child)
							childrenOfParallelStatesWithoutDescendantsInStatesToEnter.add(child)

			return childrenOfParallelStatesWithoutDescendantsInStatesToEnter
				

		_recursiveAddStatesToEnter: (s,statesToEnter,basicStatesToEnter) ->
			if s.kind is model.HISTORY
				if s.id of @_historyValue
					for historyState in @_historyValue[s.id]
						@_recursiveAddStatesToEnter(historyState,statesToEnter,basicStatesToEnter)
				else
					statesToEnter.add(s)
					basicStatesToEnter.add(s)
			else
				statesToEnter.add(s)

				if s.kind is model.PARALLEL
					for child in s.children
						if not (child.kind is model.HISTORY)		#don't enter history by default
							@_recursiveAddStatesToEnter(child,statesToEnter,basicStatesToEnter)

				else if s.kind is model.COMPOSITE

					#FIXME: problem: this doesn't check cond of initial state transitions
					#also doesn't check priority of transitions (problem in the SCXML spec?)
					#TODO: come up with test case that shows other is broken
					#what we need to do here: select transitions...
					#for now, make simplifying assumption. later on check cond, then throw into the parameterized choose by priority
					@_recursiveAddStatesToEnter(s.initial,statesToEnter,basicStatesToEnter)

				else if s.kind is model.INITIAL or s.kind is model.BASIC or s.kind is model.FINAL
					basicStatesToEnter.add(s)

			
		_selectTransitions: (eventSet,datamodelForNextStep) ->

			if @opts.onlySelectFromBasicStates
				states = @_configuration.iter()
			else
				statesAndParents = new @opts.StateSet

				#get full configuration, unordered
				#this means we may select transitions from parents before children
				for basicState in @_configuration.iter()
					statesAndParents.add(basicState)

					for ancestor in model.getAncestors(basicState)
						statesAndParents.add(ancestor)

				states = statesAndParents.iter()

			n = @_getScriptingInterface(datamodelForNextStep,eventSet)
			e = (cond) -> evaluator(cond,n.getData,n.setData,n.In,n.events)

			events = eventSet.iter()

			#debugger
			allTransitions = new @opts.TransitionSet @opts.transitionSelector states,events,e

			if @opts.printTrace then console.debug("allTransitions",allTransitions)
			consistentTransitions = @_makeTransitionsConsistent allTransitions
			if @opts.printTrace then console.debug("consistentTransitions",consistentTransitions)
			return consistentTransitions

		_makeTransitionsConsistent: (transitions) ->
			consistentTransitions = new @opts.TransitionSet()

			[transitionsNotInConflict, transitionsPairsInConflict] = @_getTransitionsInConflict transitions
			consistentTransitions.union transitionsNotInConflict

			if @opts.printTrace then console.debug "transitions",transitions
			if @opts.printTrace then console.debug "transitionsNotInConflict",transitionsNotInConflict
			if @opts.printTrace then console.debug "transitionsPairsInConflict",transitionsPairsInConflict
			if @opts.printTrace then console.debug "consistentTransitions",consistentTransitions

			while not transitionsPairsInConflict.isEmpty()

				transitions = new @opts.TransitionSet(@opts.priorityComparisonFn t for t in transitionsPairsInConflict.iter())

				[transitionsNotInConflict, transitionsPairsInConflict] = @_getTransitionsInConflict transitions

				consistentTransitions.union transitionsNotInConflict

				if @opts.printTrace then console.debug "transitions",transitions
				if @opts.printTrace then console.debug "transitionsNotInConflict",transitionsNotInConflict
				if @opts.printTrace then console.debug "transitionsPairsInConflict",transitionsPairsInConflict
				if @opts.printTrace then console.debug "consistentTransitions",consistentTransitions

			return consistentTransitions
				
		_getTransitionsInConflict: (transitions) ->

			allTransitionsInConflict = new @opts.TransitionSet()
			transitionsPairsInConflict = new @opts.TransitionPairSet() 	#set of tuples

			#better to use iterators, because not sure how to encode "order doesn't matter" to list comprehension
			transitionList = transitions.iter()
			if @opts.printTrace then console.debug("transitions",transitionList)

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
		
		_isArenaOrthogonal: (t1,t2) -> model.isOrthogonalTo(model.getLCA(t1.source,t1.targets[0]),model.getLCA(t2.source,t2.targets[0]))


	class SimpleInterpreter extends SCXMLInterpreter

		constructor: (model,@setTimeout,@clearTimeout,opts) ->

			#FIXME: is there a way to clean some of this up?
			super model,opts
			
		_evaluateAction: (action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue) ->
			if action.type is "send" and action.delay
				if @setTimeout
					if @opts.printTrace then console.debug "sending event",action.event,"with content",action.contentexpr,"after delay",action.delay
					data = if action.contentexpr then @_eval(action.contentexpr,datamodelForNextStep,eventSet) else null

					callback = => @gen new Event(action.event,data)
					timeoutId = @setTimeout callback,action.delay

					if action.id
						@_timeoutMap[action.id] = timeoutId
				else
					throw new Error("setTimeout function not set")

			else if action.type is "cancel"
				if @clearTimeout
					if action.sendid of @_timeoutMap
						if @opts.printTrace then console.debug "cancelling ",action.id," with timeout id ",@_timeoutMap[action.id]
						@clearTimeout @_timeoutMap[action.id]
				else
					throw new Error("clearTimeout function not set")
			else
				super action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue

		#External Event Communication: Asynchronous
		gen: (e) ->
			#pass it straight through	
			if @opts.printTrace then console.debug("received event " + e)
			@_performBigStep(e)

	SCXMLInterpreter:SCXMLInterpreter
	SimpleInterpreter:SimpleInterpreter
