var JsonML = require('../../external/jsonml/jsonml-dom'),
    annotator = require('./annotate-scxml-json'),
    json2model = require('../scxml/json2model'),
    platform = require('../../platform'),
    util = require('./jsonml');

function documentToModel(url,doc,cb){
    var arr = JsonML.parseDOM(doc);
    var scxmlJson = arr[1];

    //do whatever transforms
    //inline script tags
    //platformGet may be undefined, and we can continue without it, hence the guard
    if(platform && platform.getResourceFromUrl){
        inlineSrcs(url,scxmlJson,function(errors){
            if(errors){ 
                //I think we should probably just log any of these errors
                platform.log("Errors downloading src attributes",errors);
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

function inlineSrcs(url,jsonml,cb){
    //console.log('inlining scripts');
    
    var scriptActionsWithSrcAttributes = [], errors = [];

    traverse(jsonml,scriptActionsWithSrcAttributes); 

    //async forEach
    function retrieveScripts(){
        var script = scriptActionsWithSrcAttributes.pop();
        if(script){
            //quick and dirty for now:
            if(url){
                var root = url.split(platform.pathSeparator).slice(0,-1).join(platform.pathSeparator);
                var src = root  + platform.pathSeparator + script[1].src;
            }else{
                src = script[1].src;
            }
            //console.log('fetching script src',src);
            platform.getResourceFromUrl(src,function(err,text){
                if(err){
                    //just capture the error, and continue on
                    errors.push(err); 
                }

                script.push(text);  //this is how we append a text node
                retrieveScripts();
            });
        }else{
            cb(errors.length ? errors : null);
        }
    }
    retrieveScripts();  //kick him off
}

function traverse(node,nodeList){
    var tuple = util.deconstructNode(node, true), tagName = tuple[0], attrs = tuple[1], children = tuple[2];
    if((tagName === 'script' || tagName === 'data') && attrs && attrs.src){
        nodeList.push(node); 
    } 

    children.forEach(function(child){traverse(child,nodeList);});
}


module.exports = documentToModel;
