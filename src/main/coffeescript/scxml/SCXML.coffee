#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

define ["util/set/ArraySet","scxml/state-kinds-enum","scxml/event","util/reduce","scxml/setup-default-opts","logger"],(ArraySet,stateKinds,Event,reduce,setupDefaultOpts,logger) ->

	#imports

	flatten = (l) ->
		a = []
		for list in l
			a = a.concat(list)

		return a


	#technique adapted from http://javascript.crockford.com/prototypal.html
	create = (o) ->
		if Object.create
			Object.create(o)
		else
			F = ->
			F.prototype = o
			return new F()

	# -> Priority: Source-Child 
	getTransitionWithHigherSourceChildPriority = (model) ->
		([t1,t2]) ->
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

	class SCXMLInterpreter

		constructor : (@model,@opts={}) ->

			if @opts.printTrace
				logger.trace "initializing SCXML interpreter with opts:"
				for own k,v of opts
					v = if typeof v is "function" then v.toString() else v
					logger.trace k,v

			#default args
			#@opts.onlySelectFromBasicStates
			#@opts.printTrace = true
			#@opts.evaluationContext	#sets the this object for script evaluation
			#@opts.transitionSelector ?= defaultTransitionSelector()
			#@opts.model ?= m
			#@opts.TransitionSet ?= ArraySet
			#@opts.StateSet ?= ArraySet
			#@opts.BasicStateSet ?= ArraySet
			@opts.StateIdSet ?= ArraySet
			@opts.EventSet ?= ArraySet
			@opts.TransitionPairSet ?= ArraySet
			@opts.priorityComparisonFn ?= getTransitionWithHigherSourceChildPriority(@opts.model)
			@opts.globalEval ?= window?.executeScript or eval		#we parameterize this in case we want to use, e.g. jquery.globalEval

			@_configuration = new @opts.BasicStateSet()	#full configuration, or basic configuration? what kind of set implementation?
			@_historyValue = {}
			@_innerEventQueue = []
			@_isInFinalState = false
			@_datamodel = create @model.datamodel		#FIXME: should these be global, or declared at the level of the big step, like the eventQueue?
			@_timeoutMap = {}

		
		start: ->
			#perform big step without events to take all default transitions and reach stable initial state
			if @opts.printTrace then logger.trace("performing initial big step")
			@_configuration.add(@model.root.initial)

			#eval top-level scripts
			#we treat these differently than other scripts. they get evaled in global scope, and without explicit scripting interface
			#this is necessary in order to, e.g., allow js function declarations that are visible to scxml script tags later.
			for script in @model.scripts
				`with(this._datamodel){ this.opts.globalEval.call(null,script) }`

			#initialize top-level datamodel expressions. simple eval
			for k,v of @_datamodel
				if v then @_datamodel[k] = eval(v)

			@_performBigStep()

		getConfiguration: -> new @opts.StateIdSet(s.id for s in @_configuration.iter())

		getFullConfiguration: -> new @opts.StateIdSet(s.id for s in (flatten([s].concat @opts.model.getAncestors(s) for s in @_configuration.iter())))

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

			nonFinalStates = (s for s of @_configuration.iter() when s.kind is not stateKinds.FINAL)

			if nonFinalStates.length is 0
				@_isInFinalState = true

		_performSmallStep: (eventSet,datamodelForNextStep) ->

			if @opts.printTrace then logger.trace("selecting transitions with eventSet: " , eventSet)

			selectedTransitions = @_selectTransitions(eventSet,datamodelForNextStep)

			if @opts.printTrace then logger.trace("selected transitions: " , selectedTransitions)

			if not selectedTransitions.isEmpty()

				if @opts.printTrace then logger.trace("sorted transitions: ", selectedTransitions)

				[basicStatesExited,statesExited] = @_getStatesExited(selectedTransitions)
				[basicStatesEntered,statesEntered] = @_getStatesEntered(selectedTransitions)

				if @opts.printTrace then logger.trace("basicStatesExited " , basicStatesExited)
				if @opts.printTrace then logger.trace("basicStatesEntered " , basicStatesEntered)
				if @opts.printTrace then logger.trace("statesExited " , statesExited)
				if @opts.printTrace then logger.trace("statesEntered " , statesEntered)

				eventsToAddToInnerQueue = new @opts.EventSet()

				#operations will be performed in the order described in Rhapsody paper

				#update history states

				if @opts.printTrace then logger.trace("executing state exit actions")
				for state in statesExited
					if @opts.printTrace then logger.trace("exiting " , state)

					#peform exit actions
					for action in state.onexit
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

					#update history
					if state.history
						if state.history.isDeep
							f = (s0) => s0.kind is stateKinds.BASIC and s0 in @opts.model.getDescendants(state)
						else
							f = (s0) -> s0.parent is state
						
						@_historyValue[state.history.id] = (s for s in statesExited when f(s))

				# -> Concurrency: Number of transitions: Multiple
				# -> Concurrency: Order of transitions: Explicitly defined
				sortedTransitions = selectedTransitions.iter().sort( (t1,t2) -> t1.documentOrder - t2.documentOrder)

				if @opts.printTrace then logger.trace("executing transitition actions")
				for transition in sortedTransitions
					if @opts.printTrace then logger.trace("transitition " , transition)
					for action in transition.actions
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

				if @opts.printTrace then logger.trace("executing state enter actions")
				for state in statesEntered
					if @opts.printTrace then logger.trace("entering " , state)
					for action in state.onentry
						@_evaluateAction(action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue)

				#update configuration by removing basic states exited, and adding basic states entered
				if @opts.printTrace then logger.trace("updating configuration ")
				if @opts.printTrace then logger.trace("old configuration " , @_configuration)

				@_configuration.difference basicStatesExited
				@_configuration.union basicStatesEntered

				if @opts.printTrace then logger.trace("new configuration " , @_configuration)
				
				#add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
				if not eventsToAddToInnerQueue.isEmpty()
					if @opts.printTrace then logger.trace("adding triggered events to inner queue " , eventsToAddToInnerQueue)

					@_innerEventQueue.push(eventsToAddToInnerQueue)

				#update the datamodel
				if @opts.printTrace then logger.trace("updating datamodel for next small step :")
				for own key of datamodelForNextStep
					if @opts.printTrace then logger.trace("key " , key)
					if key of @_datamodel
						if @opts.printTrace then logger.trace("old value " , @_datamodel[key])
					else
						if @opts.printTrace then logger.trace("old value is null")
					if @opts.printTrace then logger.trace("new value " , datamodelForNextStep[key])
						
					@_datamodel[key] = datamodelForNextStep[key]

			#if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
			return selectedTransitions


		_evaluateAction: (action,eventSet,datamodelForNextStep,eventsToAddToInnerQueue) ->
			switch action.type
				when "raise"
					if @opts.printTrace then logger.trace "sending event",action.event,"with content",action.contentexpr
					data = if action.contentexpr then @_eval action,datamodelForNextStep,eventSet else null

					eventsToAddToInnerQueue.add new Event action.event,data
				when "assign"
					datamodelForNextStep[action.location] = @_eval action,datamodelForNextStep,eventSet
				when "script"
					@_eval action,datamodelForNextStep,eventSet,true
				when "log"
					log = @_eval action,datamodelForNextStep,eventSet
					if @opts.printTrace then logger.info(log)	#the one place where we use straight logger.info
				when "send"
					#FIXME: if send is not defined
					#we should provide a simple send handler which gets setup by default, and can be overridden.
					#this is what node- and browser-specific classes should do... is setup default delayed send
					data = if action.contentexpr then @_eval(action,datamodelForNextStep,eventSet) else null
					if @_send then @_send(
						action.target,
						{
							name : action.event
							data : data	#TODO: handle namelist,content,params
						},
						this,
						{
							delay : action.delay
							sendId : action.id
						}
					)
				when "cancel"
					if @_cancel then @_cancel action.sendid

		_eval : (action,datamodelForNextStep,eventSet,allowWrite) ->
			#get the scripting interface
			n = @_getScriptingInterface(datamodelForNextStep,eventSet,allowWrite)

			action.evaluate.call(@opts.evaluationContext,n.getData,n.setData,n.In,n.events,@_datamodel)

		_getScriptingInterface: (datamodelForNextStep,eventSet,allowWrite=false) ->
			setData : if allowWrite then (name,value) -> datamodelForNextStep[name] = value else ->
			getData : (name) => @_datamodel[name]
			In : (s) => @isIn(s)
			events : eventSet.iter()

		_getStatesExited: (transitions) ->
			statesExited = new @opts.StateSet()
			basicStatesExited = new @opts.BasicStateSet()

			for transition in transitions.iter()
				lca = @opts.model.getLCA(transition)
				desc = @opts.model.getDescendants(lca)
			
				for state in @_configuration.iter()
					if state in desc
						basicStatesExited.add(state)
						statesExited.add(state)
						for anc in @opts.model.getAncestors(state,lca)
							statesExited.add(anc)

			sortedStatesExited = statesExited.iter().sort((s1,s2) =>  @opts.model.getDepth(s2) - @opts.model.getDepth(s1))

			return [basicStatesExited,sortedStatesExited]

		_getStatesEntered: (transitions) ->
			statesToRecursivelyAdd = flatten((state for state in transition.targets) for transition in transitions.iter())
			if @opts.printTrace then logger.trace "statesToRecursivelyAdd :",statesToRecursivelyAdd
			statesToEnter = new @opts.StateSet()
			basicStatesToEnter = new @opts.BasicStateSet()

			while statesToRecursivelyAdd.length
				for state in statesToRecursivelyAdd
					@_recursiveAddStatesToEnter(state,statesToEnter,basicStatesToEnter)
				
				#add children of parallel states that are not already in statesToEnter to statesToRecursivelyAdd 
				childrenOfParallelStatesInStatesToEnter = flatten(s.children for s in statesToEnter.iter() when s.kind is stateKinds.PARALLEL)
				statesToRecursivelyAdd = (s for s in childrenOfParallelStatesInStatesToEnter when not s.kind is stateKinds.HISTORY and not statesToEnter.contains s)

			sortedStatesEntered = statesToEnter.iter().sort((s1,s2) => @opts.model.getDepth(s1) - @opts.model.getDepth(s2))

			return [basicStatesToEnter,sortedStatesEntered]

		_recursiveAddStatesToEnter: (s,statesToEnter,basicStatesToEnter) ->
			if s.kind is stateKinds.HISTORY
				if s.id of @_historyValue
					for historyState in @_historyValue[s.id]
						@_recursiveAddStatesToEnter(historyState,statesToEnter,basicStatesToEnter)
				else
					statesToEnter.add(s)
					basicStatesToEnter.add(s)
			else
				statesToEnter.add(s)

				if s.kind is stateKinds.PARALLEL
					for child in s.children
						if not (child.kind is stateKinds.HISTORY)		#don't enter history by default
							@_recursiveAddStatesToEnter(child,statesToEnter,basicStatesToEnter)

				else if s.kind is stateKinds.COMPOSITE

					#FIXME: problem: this doesn't check cond of initial state transitions
					#also doesn't check priority of transitions (problem in the SCXML spec?)
					#TODO: come up with test case that shows other is broken
					#what we need to do here: select transitions...
					#for now, make simplifying assumption. later on check cond, then throw into the parameterized choose by priority
					@_recursiveAddStatesToEnter(s.initial,statesToEnter,basicStatesToEnter)

				else if s.kind is stateKinds.INITIAL or s.kind is stateKinds.BASIC or s.kind is stateKinds.FINAL
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

					for ancestor in @opts.model.getAncestors(basicState)
						statesAndParents.add(ancestor)

				states = statesAndParents.iter()

			n = @_getScriptingInterface(datamodelForNextStep,eventSet)
			e = (t) => t.evaluateCondition.call(@opts.evaluationContext,n.getData,n.setData,n.In,n.events,@_datamodel)

			eventNames = (event.name for event in eventSet.iter())

			#debugger
			enabledTransitions = new @opts.TransitionSet
			for state in states
				for t in @opts.transitionSelector state,eventNames,e
					enabledTransitions.add t

			if @opts.printTrace then logger.trace("allTransitionsForEachState",allTransitionsForEachState)
			priorityEnabledTransitions = @_selectPriorityEnabledTransitions enabledTransitions
			if @opts.printTrace then logger.trace("priorityEnabledTransitions",priorityEnabledTransitions)
			return priorityEnabledTransitions

		_selectPriorityEnabledTransitions: (enabledTransitions) ->
			priorityEnabledTransitions = new @opts.TransitionSet()

			[consistentTransitions, inconsistentTransitionsPairs] = @_getInconsistentTransitions enabledTransitions
			priorityEnabledTransitions.union consistentTransitions

			if @opts.printTrace then logger.trace "enabledTransitions",enabledTransitions
			if @opts.printTrace then logger.trace "consistentTransitions",consistentTransitions
			if @opts.printTrace then logger.trace "inconsistentTransitionsPairs",inconsistentTransitionsPairs
			if @opts.printTrace then logger.trace "priorityEnabledTransitions",priorityEnabledTransitions

			while not inconsistentTransitionsPairs.isEmpty()

				enabledTransitions = new @opts.TransitionSet(@opts.priorityComparisonFn t for t in inconsistentTransitionsPairs.iter())

				[consistentTransitions, inconsistentTransitionsPairs] = @_getInconsistentTransitions enabledTransitions

				priorityEnabledTransitions.union consistentTransitions

				if @opts.printTrace then logger.trace "enabledTransitions",enabledTransitions
				if @opts.printTrace then logger.trace "consistentTransitions",consistentTransitions
				if @opts.printTrace then logger.trace "inconsistentTransitionsPairs",inconsistentTransitionsPairs
				if @opts.printTrace then logger.trace "priorityEnabledTransitions",priorityEnabledTransitions

			return priorityEnabledTransitions
				
		_getInconsistentTransitions: (transitions) ->

			allInconsistentTransitions = new @opts.TransitionSet()
			inconsistentTransitionsPairs = new @opts.TransitionPairSet() 	#set of tuples

			#better to use iterators, because not sure how to encode "order doesn't matter" to list comprehension
			transitionList = transitions.iter()
			if @opts.printTrace then logger.trace("transitions",transitionList)

			for i in [0...transitionList.length]
				for j in [i+1...transitionList.length]
					t1 = transitionList[i]
					t2 = transitionList[j]
					
					if @_conflicts(t1,t2)
						allInconsistentTransitions.add t1
						allInconsistentTransitions.add t2
						inconsistentTransitionsPairs.add [t1,t2]

			consistentTransitions = transitions.difference allInconsistentTransitions

			return [consistentTransitions,inconsistentTransitionsPairs]
		

		#this would be parameterizable
		# -> Transition Consistency: Small-step consistency: Source/Destination Orthogonal
		# -> Interrupt Transitions and Preemption: Non-preemptive 
		_conflicts: (t1,t2) -> not @_isArenaOrthogonal(t1,t2)
		
		_isArenaOrthogonal: (t1,t2) ->
			t1LCA = @opts.model.getLCA(t1)
			t2LCA = @opts.model.getLCA(t2)
			isOrthogonal = @opts.model.isOrthogonalTo t1LCA,t2LCA
			if @opts.printTrace
				logger.trace "transition LCAs",t1LCA.id,t2LCA.id
				logger.trace "transition LCAs are orthogonal?",isOrthogonal
			return isOrthogonal

	class SimpleInterpreter extends SCXMLInterpreter

		constructor: (model,opts) ->

			#set up send and cancel
			#these may be passed in as options if, e.g., we 're using an external communication layer
			#these are the defaults if an external communication layer is not being used.
			@_send = opts.send or (target,event,caller,options) ->
				if @opts.setTimeout
					if @opts.printTrace then logger.trace "sending event",event.name,"with content",event.data,"after delay",options.delay

					callback = => @gen event
						
					timeoutId = @opts.setTimeout callback,options.delay

					if options.sendid
						@_timeoutMap[options.sendid] = timeoutId
				else
					throw new Error("setTimeout function not set")

			@_cancel = opts.canel or (sendid) ->
				if @opts.clearTimeout
					if sendid of @_timeoutMap
						if @opts.printTrace then logger.trace "cancelling ",sendid," with timeout id ",@_timeoutMap[sendid]
						@opts.clearTimeout @_timeoutMap[sendid]
				else
					throw new Error("clearTimeout function not set")

			super model,opts
			
		#External Event Communication: Asynchronous
		gen: (e) ->
			#pass it straight through	
			if @opts.printTrace then logger.trace("received event ", e)
			@_performBigStep(e)

	class BrowserInterpreter extends SimpleInterpreter
		constructor : (model,opts={}) ->

			#defaults
			setupDefaultOpts opts

			#need to wrap setTimeout and clearTimeout, otherwise complains
			opts.setTimeout ?= (callback,timeout) -> window.setTimeout callback,timeout
			opts.clearTimeout ?= (timeoutId) -> window.clearTimeout timeoutId

			super model,opts

	class NodeInterpreter extends SimpleInterpreter
		constructor : (model,opts={}) ->


			#defaults
			setupDefaultOpts opts

			opts.setTimeout = setTimeout
			opts.clearTimeout = clearTimeout

			super model,opts

	SimpleInterpreter:SimpleInterpreter
	BrowserInterpreter:BrowserInterpreter
	NodeInterpreter:NodeInterpreter
	SCXMLInterpreter:SCXMLInterpreter
