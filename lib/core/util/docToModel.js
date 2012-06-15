var JsonML = require('../../../external/jsonml/jsonml-dom'),
    annotator = require('./annotate-scxml-json'),
    json2model = require('../scxml/json2model'),
    inlineSrcs = require('./inline-src-attribute');

function documentToModel(platformGet,doc,cb){
    var arr = JsonML.parseDOM(doc);
    var scxmlJson = arr[1];

    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(platformGet){
        inlineSrcs(scxmlJson,platformGet,function(errors){
            if(errors){ 
                //I think we should probably just log any of these errors
                console.error("Errors downloading src attributes");
            }
            scxmlJsonToModel(scxmlJson,cb);
        });
    }else{
        scxmlJsonToModel(scxmlJson,cb);
    }
}

function scxmlJsonToModel(scxmlJson,cb){
    try {
        var annotatedScxmlJson = annotator.transform(scxmlJson);
        var model = json2model(annotatedScxmlJson); 
        cb(null,model);
    }catch(e){
        cb(e);
    }
}

module.exports = documentToModel;
