//this base module could be used with jsuri [http://code.google.com/p/jsuri/], a portable, pure-js URI parser implemenation
//currently, none of the "blessed" environments use it, but it could simplify things for embedding
//assume global Uri object
require('external/jsUri/dist/jsuri');   //this is just to load up a global Uri object

function parseUri(uri){
    /*jsl:ignore*/
    if(typeof Uri === undefined) throw new Error("URI parser not loaded");
    return new Uri(url);
    /*jsl:end*/
}

module.exports = {
    getPathFromUrl : function(url){
        return parseUri(url).path();
    },

    changeUrlPath : function(url,newPath){
        return parseUri(url).path(newPath).toString();
    }
};
