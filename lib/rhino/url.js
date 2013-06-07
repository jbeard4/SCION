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

//some useful functions for manipulating urls

module.exports = {
    getPathFromUrl : function(url){
        //parse url
        var urlObject = new Packages.java.net.URL(url);

        //extract path
        return urlObject.path; 
    },

    changeUrlPath : function(url,newPath){
        //parse url again
        var urlObject = new Packages.java.net.URL(url);

        //create a new url, and return a string
        return String((new Packages.java.net.URL(urlObject.protocol, urlObject.host, urlObject.port, newPath)).toString());
    },

    resolve: function(base, target) {
        var newUrl = new Packages.java.net.URL(new Packages.java.net.URL(base), target);
        return newUrl.toString();
    }
};
