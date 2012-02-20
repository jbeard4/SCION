define ->
	eventNameReCache = {}

	#this will convert, e.g. "foo.bar.bat" to RegExp "^foo\.bar\.bat(\.[0-9a-zA-Z]+)*$"
	eventNameToRe = (name) ->
		x = new RegExp "^#{name.replace(/\./g,"\\.")}(\\.[0-9a-zA-Z]+)*$"
		console.log x
		return x

	retrieveEventRe = (name) -> eventNameReCache[name] ?= eventNameToRe name

	nameMatch = (t,eventNames) ->
		re = retrieveEventRe t.event
		(name for name in eventNames when re.test name).length

	(state,eventNames,evaluator) -> (t for t in state.transitions when (not t.event or nameMatch t,eventNames) and (not t.cond or evaluator(t)))
