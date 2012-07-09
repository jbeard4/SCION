var platform = require('./platform'),
    scxml = require('./core/scxml/SCXML'),
    documentToModel = require('./core/util/docToModel');

if(platform){

    function urlToModel(url,cb){
        platform.getDocumentFromUrl(url,function(err,doc){
            if(err){
                cb(err);
            }else{
                documentToModel(url,doc,cb);
            }
        });
    }

    function pathToModel(url,cb){
        platform.getDocumentFromFilesystem(url,function(err,doc){
            if(err){
                cb(err);
            }else{
                documentToModel(url,doc,cb);
            }
        });
    }

    function documentStringToModel(s,cb){
        documentToModel(null,platform.parseDocumentFromString(s),cb);
    }

    //export standard interface
    var scion = module.exports = {
        pathToModel : pathToModel,
        urlToModel : urlToModel, 
        documentStringToModel : documentStringToModel, 
        documentToModel : documentToModel,
        SCXML : scxml.SimpleInterpreter
    };
    
}else{
    //export interface for something else, perhaps a spartan shell environment
    module.exports = {
        annotator : require('./util/annotate-scxml-json'),
        json2model : require('./scxml/json2model'),
        scxml : require('./scxml/SCXML')
    };
}
