var MAX_STATES_PER_INT, decimalToBinary;
decimalToBinary = function(x) {
    var answer, l2, log2, power, x2;
    answer = [];
    x2 = x;
    log2 = 0;
    while (x2 >= 2) {
        x2 = x2 / 2;
        log2 = log2 + 1;
    }
    for (l2 = log2; log2 <= 0 ? l2 <= 0 : l2 >= 0; log2 <= 0 ? l2++ : l2--) {
        power = Math.pow(2, l2);
        if (x >= power) {
            answer.push(1);
            x = x - power;
        } else {
            answer.push(0);
        }
    }
    return answer.reverse().join("");
};
MAX_STATES_PER_INT = 32;

function BitVectorSet(l,keyProp,keyValueMap) {
    l = l || [];

    this.keyProp = keyProp;
    this.keyValueMap = keyValueMap;
    this.useArray = keyValueMap.length > MAX_STATES_PER_INT;

    if(this.useArray){
        //initialize array of zeros, of the appropriate length
        var arrayLength = Math.ceil(keyValueMap.length / MAX_STATES_PER_INT);
        this.o = [];
        for(var i = 0; i < arrayLength; i++){
            this.o.push(0);
        }
    }else{
        this.o = 0;
    }

    //add everything in l
    l.forEach(function(x){
        this.add(x);
    },this);
}

BitVectorSet.prototype = {

    getIndexAndHashAtIndex : function(x){
            var b, h, i, k;
            k = x[this.keyProp];
            i = Math.floor(k / MAX_STATES_PER_INT);
            b = k % MAX_STATES_PER_INT;
            h = 1 << b;
            return [i, h];
    },

    hash : function(x){
        return 1 << x[this.keyProp];
    },

    add : function(x) {
        if(this.useArray){
            var _ref = this.getIndexAndHashAtIndex(x), i = _ref[0], h = _ref[1];
            this.o[i] |= h;
        }else{
            this.o |= this.hash(x);
        }
    },

    remove : function(x) {
        if(this.useArray){
            var _ref = this.getIndexAndHashAtIndex(x), i = _ref[0], h = _ref[1];
            this.o[i] &= ~h;
        }else{
            this.o &= ~(this.hash(x));
        }
    },

    union : function(l){
        if(this.useArray){
            //assume s2.@o array is the same size
            //we would probably want to generalize this in the future, 
            //so that if we accept larget sets, we can deal with them
            if(l instanceof BitVectorSet){
                var t = l.o;
                for(var i = 0; i < t.length; i++){
                    this.o[i] |= t[i];
                }
            }else{
                l = l.iter ? l.iter() : l;

                l.forEach(function(n){
                    this.add(n);
                },this);
            }
        }else{
            if(l instanceof BitVectorSet){
                t = l.o;
            }else{
                t = 0;

                l = l.iter ? l.iter() : l;

                l.forEach(function(i){
                    t |= this.hash(i);
                });
            }

            this.o |= t;
        }
        return this;
    },

    difference : function(l){
        if(this.useArray){
            if(l instanceof BitVectorSet){
                var t = l.o;
                
                for(var i = 0; i < t.length; i++){
                    this.o[i] &= ~t[i];
                }
           }else{
                l = l.iter ? l.iter() : l;

                l.forEach(function(n){
                    this.remove(n);
                },this);
           }
        }else{
            if(l instanceof BitVectorSet){
                t = l.o;
           }else{
                t = 0;
            
                l = l.iter ? l.iter() : l;

                t |= this.hash(i);
           }
           this.o &= ~t;
        }
        return this;
    },

    contains : function(x){
        if(this.useArray){
            var _ref = this.getIndexAndHashAtIndex(x), i = _ref[0], h = _ref[1];
            return this.o[i] & h;
        }else{
            return this.o & this.hash(x);
        }
    },

    iter : function(){
        if(this.useArray){
            var toReturn = [];

            for(var i = 0; i < this.o.length; i++){
                var t1 = this.o[i];
                for(var j = 0; j < MAX_STATES_PER_INT; j++){
                    var mask = 1 << j;
                    if(mask & t1){
                        var x = MAX_STATES_PER_INT * i + j;
                        toReturn.push(this.keyValueMap[x]);
                    }
                }
            }
        }else{
            toReturn = [];
            t1 = this.o;
            i = 0;
            while(t1){
                if(t1 & 1){
                    if(!this.keyValueMap[i]){
                        throw new Error("undefined value in keyvaluemap");
                    }
                    toReturn.push(this.keyValueMap[i]);
                }

                t1 = t1 >>> 1;
                i++;
            }
        }

        return toReturn;
    },

    isEmpty : function(){
        if(this.useArray){
            return !this.o.some(function(n){return n;});
        }else{
            return !this.o;
        }
    },


    equals : function(s2){
        if(this.useArray){
            var o2 = s2.o;
            for(var i =0; i < this.o.length; i++){
                if(this.o[i] !== o2[i]){ return false; }
            }
            return true;
        }else{
            return s2.o === this.o;
        }
    },

    toString : function(){
        if(this.useArray){
            return "Set(" + this.o.map(decimalToBinary).join() + ")";
        }else{
            return "Set(" + decimalToBinary(this.o) + ")";
        }
    }
};

module.exports = BitVectorSet;
