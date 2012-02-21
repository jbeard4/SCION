define ->
	eventNameReCache = {}

	#this will convert, e.g. "foo.bar.bat" to RegExp "^foo\.bar\.bat(\.[0-9a-zA-Z]+)*$"
	eventNameToRe = (name) -> new RegExp "^#{name.replace(/\./g,"\\.")}(\\.[0-9a-zA-Z]+)*$"

	retrieveEventRe = (name) -> eventNameReCache[name] ?= eventNameToRe name

	nameMatch = (t,eventNames) ->
		tEvent = t.event
		f = if tEvent is "*" then -> true else (name) -> retrieveEventRe(tEvent).test(name)
		(name for name in eventNames when f name).length

	(state,eventNames,evaluator) -> (t for t in state.transitions when (not t.event or nameMatch t,eventNames) and (not t.cond or evaluator(t)))
