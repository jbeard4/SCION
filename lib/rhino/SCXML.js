/**
 * This module implements the standard API for "blessed environments" for the rhino.
 */

var scxml = require('../core/scxml/SCXML'),
    documentToModel = require('../core/util/jsonml-to-model'),
    get = require('./get');

//curry the platform getResource
function rhinoDocumentToModel(doc,cb){
    documentToModel(get.getResource,doc,cb); 
}

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
        rhinoDocumentToModel(doc,cb);
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

function documentStringToModel(s,cb){
    rhinoDocumentToModel(parseDocumentString(s),cb);
}

//setup environment
(function(){
    var counter = 1; 
    var ids = {};

    scxml.SimpleInterpreter.prototype._setTimeout = function (fn,delay) {
        var id = counter++;
        var timer = new Packages.java.util.Timer();
        var task = new Packages.java.util.TimerTask({run: fn});
        timer.schedule(task,delay);
        ids[id] = {
            timer : timer,
            task : task
        };
        return id;
    };

    scxml.SimpleInterpreter.prototype._clearTimeout = function (id) {
        var o = ids[id],
            timer = o.timer,
            task = o.task;
        task.cancel();
        timer.purge();
        //make sure that we clean up all references to the time so it prevent the program from terminating
        delete o.timer; 
        delete o.task;
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
