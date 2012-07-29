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
    }
};
