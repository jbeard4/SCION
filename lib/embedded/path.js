/*
     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
*/

"use strict";

//these are quick-and-dirty implementations
//there may be missing edge cases
module.exports = {

    sep : "/",

    join : function(path1,path2){
        return path1 + "/" + path2;
    },

    dirname : function(path){
        return path.split(this.sep).slice(0,-1).join(this.sep);
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
