selector = require 'scxml-dynamic-name-match-transition-selector'
ArraySet = require 'set/ArraySet'
m = require 'model'

module.exports = (opts={}) ->
    opts.TransitionSet ?= ArraySet
    opts.StateSet ?= ArraySet
    opts.BasicStateSet ?= ArraySet
    opts.transitionSelector ?= selector
    opts.model  ?= m

    return opts
