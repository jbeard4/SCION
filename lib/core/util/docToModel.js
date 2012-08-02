var annotator = require('./annotate-scxml-json'),
    json2model = require('../scxml/json2model'),
    pm = require('../../platform'),
    dom = require('./dom');

function documentToModel(url,doc,cb){
    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(pm.platform.getResourceFromUrl){
        inlineSrcs(url,doc,function(errors){
            if(errors){ 
                //I think we should probably just log any of these errors
                pm.platform.log("Errors downloading src attributes",errors);
            }
            docToModel(doc,url,cb);
        });
    }else{
        docToModel(doc,url,cb);
    }
}

function docToModel(doc,url,cb){
    try {
        var annotatedScxmlJson = annotator.transform(doc);
        var model = json2model(annotatedScxmlJson,url); 
        cb(null,model);
    }catch(e){
        cb(e);
    }
}

function inlineSrcs(url,doc,cb){
    //console.log('inlining scripts');
    
    var scriptActionsWithSrcAttributes = [], errors = [];

    traverse(doc.documentElement,scriptActionsWithSrcAttributes); 

    //async forEach
    function retrieveScripts(){
        var script = scriptActionsWithSrcAttributes.pop();
        if(script){
            //quick and dirty for now:
            //to be totally correct, what we need to do here is: 
            //parse the url, extract the pathname, call dirname on path, and join that with the path to the file
            var scriptUrl = dom.getAttribute(script,"src");
            if(url){
                var documentUrlPath = pm.platform.url.getPathFromUrl(url);
                var documentDir = pm.platform.path.dirname(documentUrlPath);
                var scriptPath = pm.platform.path.join(documentDir,scriptUrl);
                scriptUrl = pm.platform.url.changeUrlPath(url,scriptPath);
            }
            //platform.log('fetching script src',scriptUrl);
            pm.platform.getResourceFromUrl(scriptUrl,function(err,text){
                if(err){
                    //just capture the error, and continue on
                    errors.push(err); 
                }

                dom.textContent(script,text);
                retrieveScripts();
            });
        }else{
            cb(errors.length ? errors : null);
        }
    }
    retrieveScripts();  //kick him off
}

function traverse(node,nodeList){
    if((dom.localName(node) === 'script' || dom.localName(node) === 'data') && node.hasAttribute("src")){
        nodeList.push(node); 
    } 

    dom.getElementChildren(node).forEach(function(child){traverse(child,nodeList);});
}


module.exports = documentToModel;
