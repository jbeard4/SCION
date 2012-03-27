eventNameReCache = {}

#this will convert, e.g. "foo.bar.bat" to RegExp "^foo\.bar\.bat(\.[0-9a-zA-Z]+)*$"
eventNameToRe = (name) -> new RegExp "^#{name.replace(/\./g,"\\.")}(\\.[0-9a-zA-Z]+)*$"

retrieveEventRe = (name) -> eventNameReCache[name] ?= eventNameToRe name

nameMatch = (t,eventNames) ->
    tEvents = t.events
    f = if "*" in tEvents then -> true else (name) -> (tEvent for tEvent in tEvents when retrieveEventRe(tEvent).test(name)).length
    (name for name in eventNames when f name).length

module.exports = (state,eventNames,evaluator) -> (t for t in state.transitions when (not t.events or nameMatch t,eventNames) and (not t.cond or evaluator(t)))
