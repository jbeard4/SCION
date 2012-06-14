function ObjectSet(l,keyProp){
    this.keyProp = keyProp;
    this.o = {};
    this.union(l);
}

ObjectSet.prototype = {
    add : function(x){
        this.o[x[this.keyProp]] = x;
    },

    remove : function(x){
        delete this.o[x[this.keyProp]];
    },

    union : function(l){
        if(l instanceof ObjectSet){
            for(var k in l.o){
                this.add(l.o[k]);
            }
        }else{
            l = l.iter ? l.iter() : l;
            l.forEach(function(x){
                this.add(x);
            },this);
        }

        return this;
    },

    difference : function(l){
        if(l instanceof ObjectSet){
            for(var k in l.o){
                this.remove(l.o[k]);
            }
        }else{
            l = l.iter ? l.iter() : l;
            l.forEach(function(x){
                this.remove(x);
            },this);
        }

        return this;
    },

    contains : function(x){
        return this.o[x[this.keyProp]] === x;
    },

    iter : function(){
        var toReturn = [];
        for(var k in this.o){
            toReturn.push(this.o[k]);
        }

        return toReturn;
    },

    isEmpty : function(){
        for(var k in this.o){
            return false;
        }

        return true;
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

module.exports = ObjectSet;
