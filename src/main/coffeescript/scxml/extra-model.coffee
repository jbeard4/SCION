# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ["scxml/model"],(model) ->
	ExtraModel = ->
		@getDescendants = (s) -> s.descendants

		@getAncestors = (s,root) ->
			index = s.ancestors.indexOf(root)
			if index is -1
				s.ancestors
			else
				s.ancestors.slice(0,index)

		@getDepth = (s) -> s.depth

		@getLCA = (t) -> if arguments.length is 1 then t.lca else model.getLCA.apply this,arguments

		return @

	ExtraModel.prototype = model

	return new ExtraModel
