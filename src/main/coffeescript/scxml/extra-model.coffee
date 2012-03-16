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
