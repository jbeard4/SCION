module.exports = {
    merge : function(target){
        for(var i=1; i < arguments.length; i++){
            var from = arguments[i];
            for(var k in from){
                if(from.hasOwnProperty(k)){
                    target[k] = from[k];
                }
            }
        }
        return target;
    }
};
