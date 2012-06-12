var scxml = require('../core/scxml/SCXML'),
    JsonML = require('../external/jsonml/jsonml-dom'),
    annotator = require('../core/util/annotate-scxml-json'),
    json2model = require('../core/scxml/json2model');

function recursiveConvertJavaStringsToJsStrings(o){
    for(var k in o){
        if(o.hasOwnProperty(k)){
            var v = o[k];
            if(v instanceof Packages.java.lang.String){
                o[k] = String(v);   
            }else if(typeof v === 'object'){
                recursiveConvertJavaStringsToJsStrings(v);
            }
        }
    }
}

function getDb(){
    var dbf = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
    dbf.setNamespaceAware(true);
    return dbf.newDocumentBuilder();
}

function urlToModel(url,cb){
    try {
        var doc = getDb().parse(url);
        cb(null,documentToModel(doc));
    }catch(e){
        cb(e);
    }
}

function parseDocumentString(s){
    var db = getDb();
    var is = new Packages.org.xml.sax.InputSource();
    is.setCharacterStream(new Packages.java.io.StringReader(s));

    return db.parse(is);
}

function documentStringToModel(s){
    return documentToModel(parseDocumentString(s));
}

//TODO: move this out, as it is shared code
function documentToModel(doc){
    var arr = JsonML.parseDOM(doc);

    recursiveConvertJavaStringsToJsStrings(arr);

    var scxmlJson = arr[1];

    var annotatedScxmlJson = annotator.transform(scxmlJson);

    var model = json2model(annotatedScxmlJson); 

    return model;
}

//setup environment
(function(){
    var timer = new Packages.java.util.Timer();
    var counter = 1; 
    var ids = {};

    scxml.SimpleInterpreter.prototype._setTimeout = function (fn,delay) {
        var id = counter++;
        ids[id] = new Packages.java.util.TimerTask({run: fn});
        timer.schedule(ids[id],delay);
        return id;
    };

    scxml.SimpleInterpreter.prototype._clearTimeout = function (id) {
        ids[id].cancel();
        timer.purge();
        delete ids[id];
    };
})();

scxml.SimpleInterpreter.prototype._log = function(){
    for(var i=0; i < arguments.length; i++){
        Packages.java.lang.System.out.println(arguments[i]);
    }
};

module.exports = {
    pathToModel : urlToModel,
    urlToModel : urlToModel, 
    documentStringToModel : documentStringToModel, 
    documentToModel : documentToModel,
    parseDocumentString : parseDocumentString,
    SCXML : scxml.SimpleInterpreter
};
