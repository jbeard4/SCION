/**
 * This module implements the standard API for "blessed environments" for the browser.
 */

var scxml = require('../core/scxml/SCXML'),
    documentToModel = require('../core/util/jsonml-to-model'),
    get = require('./get');

//curry the platform getResource
function browserDocumentToModel(doc,cb){
    documentToModel(get.getResource,doc,cb);
}

function urlToModel(url,cb){
    scion.ajax.get(url,function(e,doc){
        if(e){
            cb(e);
        }else{
            browserDocumentToModel(doc,cb);
        }
    },"xml");
}

function parseDocumentString(s){
    //FIXME: I should make this more cross-browser compatible. DOMParser doesn't exist in early IE.
    //Just borrow that chunk of code from jQuery.
    return (new window.DOMParser()).parseFromString(s,"application/xml");
}

function documentStringToModel(s,cb){
    browserDocumentToModel(parseDocumentString(s),cb);
}

//setup environment
scxml.SimpleInterpreter.prototype._setTimeout = function(callback, timeout) {
    return window.setTimeout(callback, timeout);
};

scxml.SimpleInterpreter.prototype._clearTimeout = function(timeoutId) {
    return window.clearTimeout(timeoutId);
};

scxml.SimpleInterpreter.prototype._log = window.console.log || function(){};

var scion = module.exports = {
    pathToModel : urlToModel,   //alias pathToModule to urlToModel for browser
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : browserDocumentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter,
    ajax : {                        //the user should be able to override this API if they want
        get : get.defaultAjaxGet,
        post : get.defaultAjaxPost
    }
};
