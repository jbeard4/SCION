/**
 * This contains some functions for getting stuff in the browser.
 * Right now, this is just a thin wrapper around jquery.
 * The idea is that the user should be able to override these functions using their preferred ajax lib.
 */

function defaultAjaxGet(url,cb,type){
    //by default, assume jQuery loaded
    window.jQuery.get(url,function(r){
        cb(null,r);
    },type).error(function(e){
        cb(e);
    });
}

//same idea as get. Post may be used for Send.
function defaultAjaxPost(url,data,cb,type){
    //by default, assume jQuery loaded
    window.jQuery.post(url,data,function(r){
        cb(null,r);
    },type).error(function(e){
        cb(e);
    });
}

module.exports = {
    defaultAjaxGet : defaultAjaxGet,
    defaultAjaxPost : defaultAjaxPost,
    getResource : defaultAjaxGet
};
