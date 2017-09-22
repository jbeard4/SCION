//model accessor functions
const query = {
    isDescendant : function(s1, s2){
      //Returns 'true' if state1 is a descendant of state2 (a child, or a child of a child, or a child of a child of a child, etc.) Otherwise returns 'false'.
      return s2.descendants.indexOf(s1) > -1;
    },
    getAncestors: function(s, root) {
        var ancestors, index, state;
        index = s.ancestors.indexOf(root);
        if (index > -1) {
            return s.ancestors.slice(0, index);
        } else {
            return s.ancestors;
        }
    },
    getAncestorsOrSelf: function(s, root) {
        return [s].concat(query.getAncestors(s, root));
    },
    getDescendantsOrSelf: function(s) {
        return [s].concat(s.descendants);
    }
};

module.exports = query;
