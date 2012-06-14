function BooleanArray(l,keyProp,keyValueMap){
    this.keyProp = keyProp;
    this.keyValueMap = keyValueMap;
    this.o = new Array(keyValueMap.length);
    this.union(l);
}

BooleanArray.prototype = {
    add : function(x){
        this.o[x[this.keyProp]] = x;
    },

    remove : function(x){
        delete this.o[x[this.keyProp]];
    },

    union : function(l){
        l = l.iter ? l.iter() : l;
        l.forEach(function(x){
            this.add(x);
        },this);

        return this;
    },

    difference : function(l){
        l = l.iter ? l.iter() : l;
        l.forEach(function(x){
            this.remove(x);
        },this);

        return this;
    },

    contains : function(x){
        return this.o[x[this.keyProp]] === x;
    },

    iter : function(){
        return this.o.filter(function(x){return x;});
    },

    isEmpty : function(){
        return !this.iter().length;
    },

    equals : function(s2){
        var l1 = this.iter();
        var l2 = s2.iter();

        if(!l1.every(function(v){return s2.contains(v);})){
            return false;
        }


        if(!l2.every(function(v){return this.contains(v);},this)){
            return false;
        }

        return true;
    }
};

module.exports = BooleanArray;
