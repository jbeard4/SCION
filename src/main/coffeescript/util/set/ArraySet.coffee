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
