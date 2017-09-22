/* begin ArraySet */

/** @constructor */
function ArraySet(l) {
    l = l || [];
    this.o = new Set(l);        
}

ArraySet.prototype = {

    add : function(x) {
        this.o.add(x);
    },

    remove : function(x) {
        return this.o.delete(x);
    },

    union : function(l) {
        for (var v of l.o) {
            this.o.add(v);
        }
        return this;
    },

    difference : function(l) {
        for (var v of l.o) {
            this.o.delete(v);
        }
        return this;
    },

    contains : function(x) {
        return this.o.has(x);
    },

    iter : function() {
        return Array.from(this.o);
    },

    isEmpty : function() {
        return !this.o.size;
    },

    size: function() {
        return this.o.size;
    },

    equals : function(s2) {
        if (this.o.size !== s2.size()) {
            return false;
        }

        for (var v of this.o) {
            if (!s2.contains(v)) {
                return false;
            }
        }

        return true;
    },

    toString : function() {
        return this.o.size === 0 ? '<empty>' : Array.from(this.o).join(',\n');
    }
};

module.exports = ArraySet;
