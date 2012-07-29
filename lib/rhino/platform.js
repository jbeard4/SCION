var timeout = require('./timeout'),
    get = require('./get'),
    path = require('./path'),
    urlModule = require('./url');

function getDb(){
    var dbf = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
    dbf.setNamespaceAware(true);
    return dbf.newDocumentBuilder();
}

exports.platform = {

    //used in parsing
    getDocumentFromUrl : function(url,cb){
        try {
            var doc = getDb().parse(url);
            cb(null,doc);
        }catch(e){
            cb(e);
        }
    },

    parseDocumentFromString : function(str){
        var db = getDb();
        var is = new Packages.org.xml.sax.InputSource();
        is.setCharacterStream(new Packages.java.io.StringReader(str));

        return db.parse(is);
    },

    getDocumentFromFilesystem : function(url,cb){
        this.getDocumentFromUrl(url,cb);
    },

    getResourceFromUrl : get.getResource,

    //used at runtime
    postDataToUrl : function(url,data,cb){
        //TODO
    },

    setTimeout : timeout.setTimeout,

    clearTimeout : timeout.clearTimeout,

    log : function(){
        for(var i=0; i < arguments.length; i++){
            Packages.java.lang.System.out.println(String(arguments[i]));
        }
    },

    eval : function(content,name){
        //Set up execution context.
        var rhinoContext = Packages.org.mozilla.javascript.ContextFactory.getGlobal().enterContext();

        return rhinoContext.evaluateString(this, "(" + content + ")", name, 0, null);
    },

    path : path,
    url : urlModule 
};
