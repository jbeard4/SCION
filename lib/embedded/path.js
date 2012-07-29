//these are quick-and-dirty implementations
//there may be missing edge cases
module.exports = {

    sep : "/",

    join : function(path1,path2){
        return path1 + "/" + path2;
    },

    dirname : function(path){
        path.split(this.sep).slice(0,-1).join(this.sep);
    },

    basename : function(path,ext){
        var name = path.split(this.sep).slice(-1);
        if(ext){
            var names = this.extname(name);
            if(names[1] === ext){
                name = names[1];
            }
        }

        return name;
    },

    extname : function(path){
        //http://stackoverflow.com/a/4546093/366856
        return path.split(/\\.(?=[^\\.]+$)/)[1];
    }
};
