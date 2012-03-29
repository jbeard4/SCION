//   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

var _ = require('underscore');

var stateKinds = require('./state-kinds-enum');

module.exports = {
    getDepth: function(s) {
        var count, state;
        if (s.depth !== undefined) {
            return s.depth;
        } else {
            count = 0;
            state = s.parent;
            while (state) {
                count = count + 1;
                state = state.parent;
            }
            return count;
        }
    },
    getAncestors: function(s, root) {
        var ancestors, index, state;
        if (s.ancestors) {
            if (_.contains(s.ancestors,root)) {
                return s.ancestors.slice(0, index);
            } else {
                return s.ancestors;
            }
        } else {
            ancestors = [];
            state = s.parent;
            while (state && !(state === root)) {
                ancestors.push(state);
                state = state.parent;
            }
            return ancestors;
        }
    },
    getAncestorsOrSelf: function(s, root) {
        return [s].concat(this.getAncestors(s, root));
    },
    getDescendants: function(s) {
        var child, descendants, queue, state, _i, _len, _ref;
        if (s.descendants) {
            return s.descendants;
        } else {
            descendants = [];
            queue = s.children.slice();
            while (queue.length) {
                state = queue.shift();
                descendants.push(state);
                queue.push.apply(queue,state.children);
            }
            return descendants;
        }
    },
    getDescendantsOrSelf: function(s) {
        return [s].concat(this.getDescendants(s));
    },
    isOrthogonalTo: function(s1, s2) {
        //Two control states are orthogonal if they are not ancestrally
        //related, and their smallest, mutual parent is a Concurrent-state.
        return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).kind === stateKinds.PARALLEL;
    },
    isAncestrallyRelatedTo: function(s1, s2) {
        //Two control states are ancestrally related if one is child/grandchild of another.
        return _.contains(this.getAncestorsOrSelf(s2), s1) || _.contains(this.getAncestorsOrSelf(s1), s2);
    },
    getLCA: function(tOrS1, s2) {
        if (tOrS1.lca) {
            return tOrS1.lca;
        } else {
            //can take one or two arguments: either 1 transition, or two states
            if (arguments.length === 1) {
                var transition = tOrS1;
                return this.getLCA(transition.source, transition.targets[0]);
            } else {
                var s1 = tOrS1;
                var commonAncestors = _.filter(this.getAncestors(s1),_.bind(function(a){
                    return _.contains(this.getDescendants(a),s2);
                },this));
                return commonAncestors[0];
            }
        }
    }
};

