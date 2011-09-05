# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ->
	class ArraySet
		constructor: (l=[]) ->
			@o = []

			for x in l
				@add x

		add: (x) ->
			if not @contains x
				@o.push x

		remove: (x) ->
			for i in [0...@o.length]
				if @o[i] is x
					@o.splice i,1
					return true
			return false

		union: (l) ->
			l = if l.iter then l.iter() else l

			for i in l
				@add(i)

			return @

		difference: (l) ->
			l = if l.iter then l.iter() else l

			for i in l
				@remove(i)

			return @

		contains: (x) -> x in @o

		iter: -> @o

		isEmpty : -> !@o.length

		equals : (s2) ->
			l2 = s2.iter()
			
			for v in @o
				if not s2.contains(v)
					return false

			for v in l2
				if not @contains(v)
					return false

			return true

		toString : -> "Set(" + @o.toString() + ")"
