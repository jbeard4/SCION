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
    }
};

