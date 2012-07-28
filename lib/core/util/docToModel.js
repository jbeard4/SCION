var annotator = require('./annotate-scxml-json'),
    json2model = require('../scxml/json2model'),
    platform = require('../../platform').platform,
    dom = require('./dom');

function documentToModel(url,doc,cb){
    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(platform.getResourceFromUrl && platform.pathSeparator){
        inlineSrcs(url,doc,function(errors){
            if(errors){ 
                //I think we should probably just log any of these errors
                platform.log("Errors downloading src attributes",errors);
            }
            docToModel(doc,cb);
        });
    }else{
        docToModel(doc,cb);
    }
}

function docToModel(doc,cb){
    try {
        var annotatedScxmlJson = annotator.transform(doc);
        console.log(require('util').inspect(annotatedScxmlJson,false,null,true)); 
        var model = json2model(annotatedScxmlJson); 
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
            if(url){
                var root = url.split(platform.pathSeparator).slice(0,-1).join(platform.pathSeparator);
                var src = root  + platform.pathSeparator + script.getAttribute("src");
            }else{
                src = script.getAttribute("src");
            }
            //console.log('fetching script src',src);
            platform.getResourceFromUrl(src,function(err,text){
                if(err){
                    //just capture the error, and continue on
                    errors.push(err); 
                }

                script.textContent = text;
                retrieveScripts();
            });
        }else{
            cb(errors.length ? errors : null);
        }
    }
    retrieveScripts();  //kick him off
}

function traverse(node,nodeList){
    if((node.localName === 'script' || node.localName === 'data') && node.hasAttribute("src")){
        nodeList.push(node); 
    } 

    dom.getElementChildren(node).forEach(function(child){traverse(child,nodeList);});
}


module.exports = documentToModel;
