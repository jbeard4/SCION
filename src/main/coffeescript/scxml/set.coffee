define ->

	class ArraySet
		constructor: (l=[]) ->
			@o = l

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

		difference: (l) ->
			l = if l.iter then l.iter() else l
			for i in l
				@remove(i)

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


	class ObjectSet
		constructor: (l=[]) ->
			@o = {}
			@union(l)

		add: (x) ->
			@o[x.hashCode()] = x

		remove: (x) ->
			delete @o[x.id]

		union: (l) ->
			for i in l
				@add(i)

		difference: (l) ->
			for i in l
				@remove(i)

		contains: (x) -> @o[x.hashCode()] is x

		containsKey: (id) -> id of @o

		iter: -> v for own k,v of @o

		isEmpty : ->
			for own k,v of @o
				return true
			return false

		equals : (s2) ->
			l1 = @iter()
			l2 = s2.iter()
			
			for v in l1
				if not s2.contains(v)
					return false

			for v in l2
				if not @contains(v)
					return false

			return true


	return ArraySet
