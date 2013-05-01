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

var urlModule = require('url');

module.exports = {
    getPathFromUrl : function(url){
        var oUrl = urlModule.parse(url);
        return oUrl.pathname;
    },

    changeUrlPath : function(url,newPath){
        var oUrl = urlModule.parse(url);

        oUrl.path = oUrl.pathname = newPath;

        return urlModule.format(oUrl);
    },

    resolve: function(base, target) {
        return urlModule.resolve(base, target);
    }
};

