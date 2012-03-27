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

stateKinds = require 'state-kinds-enum'

return {

	getDepth: (s) ->
        if s.depth isnt undefined then return s.depth
        else
            count = 0
            state = s.parent
            while state
                count = count + 1
                state = state.parent

            return count

	getAncestors: (s,root) ->
        if s.ancestors
			index = s.ancestors.indexOf(root)
			if index is -1
				s.ancestors
			else
				s.ancestors.slice(0,index)
        else
            ancestors = []

            state = s.parent
            while state and not (state is root)
                ancestors.push(state)
                state = state.parent

            return ancestors

	getAncestorsOrSelf: (s,root) -> [s].concat @getAncestors(s,root)

	getDescendants: (s) ->
        if s.descendants then return s.descendants
        else
            descendants = []
            queue = s.children.slice()

            while queue.length
                state = queue.shift()
                descendants.push(state)

                for child in state.children
                    queue.push(child)

            return descendants

	getDescendantsOrSelf: (s) -> [s].concat @getDescendants(s)

	isOrthogonalTo: (s1,s2) ->
		#Two control states are orthogonal if they are not ancestrally
		#related, and their smallest, mutual parent is a Concurrent-state.
		return not @isAncestrallyRelatedTo(s1,s2) and @getLCA(s1,s2).kind is stateKinds.PARALLEL

	isAncestrallyRelatedTo: (s1,s2) ->
		#Two control states are ancestrally related if one is child/grandchild of another.
		return s1 in @getAncestorsOrSelf(s2) or s2 in @getAncestorsOrSelf(s1)

	getLCA: (tOrS1,s2) ->
        if tOrS1.lca then return tOrS1.lca
        else
            #can take one or two arguments: either 1 transition, or two states
            if arguments.length is 1
                transition = tOrS1
                return @getLCA transition.source,transition.targets[0]
            else
                s1 = tOrS1
                commonAncestors = (a for a in @getAncestors(s1) when s2 in @getDescendants(a))
                return commonAncestors[0]

}
