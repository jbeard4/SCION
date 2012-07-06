module.exports = {

    ajax : window.jQuery,

    //used in parsing
    getDocumentFromUrl : function(url,cb){
        this.ajax.get(url,function(r){
            cb(null,r);
        },url).error(function(e){
            cb(e);
        });
    },

    parseDocumentFromString : function(str){
        return (new window.DOMParser()).parseFromString(str,"application/xml");
    },

    getDocumentFromFilesystem : function(url,cb){
        this.getDocumentFromUrl(url,cb); 
    },

    //TODO: the callback is duplicate code. move this out.
    getResourceFromUrl : function(url,cb){
        this.ajax.get(url,function(r){
            cb(null,r);
        }).error(function(e){
            cb(e);
        });
    },

    //used at runtime
    postDataToUrl : function(url,data,cb){
        //by default, assume jQuery loaded
        this.ajax.post(url,data,function(r){
            cb(null,r);
        }).error(function(e){
            cb(e);
        });
    },

    setTimeout : function(f,d){
        return window.setTimeout(f,d);
    },

    clearTimeout : function(timeoutId){
        window.clearTimeout(timeoutId);
    }

};
