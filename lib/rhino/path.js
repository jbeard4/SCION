//some useful functions for manipulating paths

module.exports = {

    join : function(path1,path2){
        return new Packages.java.io.File(path1,path2).path;
    },

    dirname : function(path){
        return new Packages.java.io.File(path).parent;
    },

    basename : function(path,ext){
        var name = Packages.java.io.File(path).name;
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
