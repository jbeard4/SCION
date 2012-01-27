#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

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
