define ->
	(defaultKeyProp="id") ->
		class ObjectSet
			constructor: (l=[],@keyProp=defaultKeyProp) ->
				@o = {}
				@union(l)

			add: (x) ->
				@o[x[@keyProp]] = x

			remove: (x) ->
				delete @o[x[@keyProp]]

			union: (l) ->
				if l instanceof ObjectSet
					for k,v of l.o
						@add(v)
				else
					l = if l.iter then l.iter() else l
					for x in l
						@add(x)

				return @

			difference: (l) ->
				if l instanceof ObjectSet
					for k,v of l.o
						@remove(v)
				else
					l = if l.iter then l.iter() else l
					for x in l
						@remove(x)

				return @

			contains: (x) -> @o[x[@keyProp]] is x

			iter: -> v for own k,v of @o

			isEmpty : ->
				for own k,v of @o
					return false
				return true

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
