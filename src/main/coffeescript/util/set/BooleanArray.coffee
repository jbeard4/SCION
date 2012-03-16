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
    (defaultKeyProp="basicDocumentOrder",defaultHashSize=0) ->
        class BooleanArraySet
            constructor: (l=[],@keyProp=defaultKeyProp,hashSize=defaultHashSize) ->
                #two ways to do this: static preallocation using "new Array(len)" (or array comprehension)
                #or lazy allocation by index into it whenever we need it
                #do we give all implementations their own interface, or make them have the same interface?
                @o = new Array(hashSize)
                @union(l)

            add: (x) ->
                @o[x[@keyProp]] = x

            remove: (x) ->
                delete @o[x[@keyProp]]

            union: (l) ->
                l = if l.iter then l.iter() else l
                for x in l
                    @add(x)

                return @

            difference: (l) ->
                l = if l.iter then l.iter() else l
                for x in l
                    @remove(x)

                return @

            contains: (x) -> @o[x[@keyProp]] is x

            iter: -> v for v in @o when v

            isEmpty : ->
                for v in @o when v
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

