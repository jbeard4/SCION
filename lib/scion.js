var platform = require('./platform').platform,
    scxml = require('./core/scxml/SCXML'),
    documentToModel = require('./core/util/docToModel');

function urlToModel(url,cb){
    if(!platform.getDocumentFromUrl) throw new Error("Platform does not support getDocumentFromUrl");

    platform.getDocumentFromUrl(url,function(err,doc){
        if(err){
            cb(err);
        }else{
            documentToModel(url,doc,cb);
        }
    });
}

function pathToModel(url,cb){
    if(!platform.getDocumentFromFilesystem) throw new Error("Platform does not support getDocumentFromFilesystem");

    platform.getDocumentFromFilesystem(url,function(err,doc){
        if(err){
            cb(err);
        }else{
            documentToModel(url,doc,cb);
        }
    });
}

function documentStringToModel(s,cb){
    if(!platform.parseDocumentFromString) throw new Error("Platform does not support parseDocumentFromString");

    documentToModel(null,platform.parseDocumentFromString(s),cb);
}

//export standard interface
var scion = module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    SCXML : scxml.SimpleInterpreter,
    ext : {
        platform : platform,
        actionCodeGenerator : require('./core/util/action-code-generator')
    }
};
