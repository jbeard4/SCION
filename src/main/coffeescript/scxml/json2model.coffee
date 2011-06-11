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

	parseAction = (a) ->
		switch a.type
			when "assign"
				new AssignAction a.location,a.expr
			when "cancel"
				new CancelAction a.sendid
			when "send"
				new SendAction a.event,getDelayInMs(a.delay),a.id,a.contentexpr
			when "script"
				new ScriptAction a.script
			when "log"
				new LogAction a.expr

	jsonToModel = (json) ->
		mStates = {}

		for own stateId,state of json.states

			mTransitions = (new Transition t.id,t.event,t.documentOrder,t.cond,t.source,t.target,(parseAction a for a in t.contents) for t in state.transitions)


			mEnterActions = (parseAction a for a in state.onentry)
			mExitActions = (parseAction a for a in state.onexit)


			mState = new State state.id,state.kind,state.documentOrder,state.isDeep,mTransitions,state.children,state.parent,state.initial,state.history,mExitActions,mEnterActions


			mStates[state.id] = mState

		#second pass to hook up references
		for own id,mState of mStates
			mState.initial = mStates[mState.initial]
			mState.history = mStates[mState.history]

			mState.children = (mStates[stateId] for stateId in mState.children)

			mState.parent = mStates[mState.parent]

			for t in mState.transitions
				t.source = mStates[t.source]
				t.targets = (mStates[stateId] for stateId in t.targets.split(" "))

		rootState = mStates[json.root]

		model = new SCXMLModel rootState,json.profile

		return model
