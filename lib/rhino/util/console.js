function p(args){
        for(var i=0; i < args.length; i++){
            //Packages.java.lang.System.out.println(arguments[i]);
            print(args[i]);
        }
}

module.exports = {
    log : function(){
        p(arguments);
    },
    error : function(){
        p(arguments);
    }
};
