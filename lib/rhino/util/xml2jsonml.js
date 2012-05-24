var JsonML = require('./jsonml/jsonml-dom');

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

//convenience function to load an xml doc from a path
exports.loadDOMFromPath = function(path){
    var file = new Packages.java.io.File(path);
    var dbf = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
    var db = dbf.newDocumentBuilder();
    var doc = db.parse(file);
    return doc;
};

exports.loadDOMFromString = function(str){
    var db = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance().newDocumentBuilder();
    var is = new Packages.org.xml.sax.InputSource();
    is.setCharacterStream(new Packages.java.io.StringReader(str));

    return db.parse(is);
};

exports.xmlDocToJsonML = function(doc){
    var scxmlJson = JsonML.parseDOM(doc.documentElement);
    recursiveConvertJavaStringsToJsStrings(scxmlJson);
    return scxmlJson;
};


