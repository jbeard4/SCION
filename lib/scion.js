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
        /** @expose */
        pathToModel : pathToModel,
        /** @expose */
        urlToModel : urlToModel, 
        /** @expose */
        documentStringToModel : documentStringToModel, 
        /** @expose */
        documentToModel : documentToModel,
        /** @expose */
        SCXML : scxml.SimpleInterpreter
    };
    
}else{
    //export interface for something else, perhaps a spartan shell environment
    module.exports = {
        /** @expose */
        annotator : require('./core/util/annotate-scxml-json'),
        /** @expose */
        json2model : require('./core/scxml/json2model'),
        /** @expose */
        scxml : require('./core/scxml/SCXML')
    };
}
