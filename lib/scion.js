var pm = require('./platform'),
    scxml = require('./core/scxml/SCXML'),
    documentToModel = require('./core/util/docToModel');

function urlToModel(url,cb){
    if(!pm.platform.getDocumentFromUrl) throw new Error("Platform does not support getDocumentFromUrl");

    pm.platform.getDocumentFromUrl(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentToModel(url,doc,cb);
        }
    });
}

function pathToModel(url,cb){
    if(!pm.platform.getDocumentFromFilesystem) throw new Error("Platform does not support getDocumentFromFilesystem");

    pm.platform.getDocumentFromFilesystem(url,function(err,doc){
        if(err){
            cb(err,null);
        }else{
            documentToModel(url,doc,cb);
        }
    });
}

function documentStringToModel(s,cb){
    if(!pm.platform.parseDocumentFromString) throw new Error("Platform does not support parseDocumentFromString");

    documentToModel(null,pm.platform.parseDocumentFromString(s),cb);
}

//export standard interface
var scion = module.exports = {
    pathToModel : pathToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    SCXML : scxml.SimpleInterpreter,
    ext : {
        platformModule : pm,
        actionCodeGeneratorModule : require('./core/util/code-gen')
    }
};
