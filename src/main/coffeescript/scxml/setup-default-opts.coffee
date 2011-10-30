define ["scxml/default-transition-selector","util/set/ArraySet","scxml/model"],(defaultTransitionSelector,ArraySet,m) ->
	(opts={}) ->
		opts.TransitionSet ?= ArraySet
		opts.StateSet ?= ArraySet
		opts.BasicStateSet ?= ArraySet
		opts.transitionSelector ?= defaultTransitionSelector()
		opts.model  ?= m

		return opts
