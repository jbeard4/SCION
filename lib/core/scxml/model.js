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

var stateKinds = require('./state-kinds-enum');

module.exports = {
    getDepth : function(s){
		var count = 0
		var state = s.parent
		while(state)
			count++;
			state = state.parent
        }

		return count;
    },
    getAncestors: function(s, root) {
        var ancestors, index, state;
        if(s.ancestors){
            index = s.ancestors.indexOf(root);
            if (index > -1) {
                return s.ancestors.slice(0, index);
            } else {
                return s.ancestors;
            }
        }else{
            var ancestors = []

            state = s.parent;
            while(state && state !== root){
                ancestors.push(state)
                state = state.parent;
            }

            return ancestors;
        }
    },
    getAncestorsOrSelf: function(s, root) {
        return [s].concat(this.getAncestors(s, root));
    },
	getDescendants: function(s){
        if(s.descendants){
            return s.descendants;
        }else{
            var descendants = [];
            var queue = s.children.slice();

            while(queue.length){
                var state = queue.shift();
                descendants.push(state);

                state.children.forEach(function(child){
                    queue.push(child);
                });
            }

            return descendants
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
        return this.getAncestorsOrSelf(s2).indexOf(s1) > -1 || this.getAncestorsOrSelf(s1).indexOf(s2) > -1;
    },
    getLCA: function(tOrS1, s2) {
		if(arguments.length === 1){
			var transition = tOrS1
			return this.getLCA(transition.source,transition.targets[0]);
        }else{
            var commonAncestors = this.getAncestors(s1).filter(function(a){
                return this.getDescendants(a).indexOf(s2) > -1;
            },this);
            return commonAncestors[0];
        }
    }
};

