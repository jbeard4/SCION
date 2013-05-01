var pm = require('../platform-bootstrap/platform');

function inlineSrcs(docUrl,scjson,context,cb){
    //console.log('inlining scripts');

    var nodesWithSrcAttributes = [], errors = [], resultCount = 0;

    traverse(scjson,nodesWithSrcAttributes);

    if (nodesWithSrcAttributes.length) {

        // kick off fetches in parallel
        nodesWithSrcAttributes.forEach(function(node, idx) {

            var nodeUrl = node.src;

            if(docUrl) {
                nodeUrl = pm.platform.url.resolve(docUrl, nodeUrl);
            }

           /* TBD: For data elements, use mimeType (aka Content-Type returned by HTTP server (if any))
                     *  to determine how to process the external resource.
                     *  e.g. treat application/json as JSON per hint in C.2.1 of http://www.w3.org/TR/scxml/#profiles
                     */
            pm.platform.getResourceFromUrl(nodeUrl,function(err,text,mimeType){
                if(err){
                    //just capture the error, and continue on
                    pm.platform.log("Error downloading document " + nodeUrl + " : " + err.message);
                    errors.push({url : nodeUrl, err : err});
                }else{
                    node.content = text;
                }
                ++resultCount;
                if (resultCount == nodesWithSrcAttributes.length) {
                    cb(errors.length ? errors : null);
                }
            },context);
        });
    } else {
        cb();
    }
}

function traverse(state,allScriptAndDataNodesWithSrcAttr){
    function addNodesToNodeList(actionNodes){
        var actionNodesWithSrcAttr = 
                actionNodes.filter(function(actionNode){return (actionNode.type === 'script' || actionNode.type === 'data') && actionNode.src;});

        allScriptAndDataNodesWithSrcAttr.push.apply(allScriptAndDataNodesWithSrcAttr,actionNodesWithSrcAttr);
    }

    if(state.type === 'scxml' && state.rootScript) addNodesToNodeList([state.rootScript]);
    if(state.onEntry) addNodesToNodeList(state.onEntry);
    if(state.onExit) addNodesToNodeList(state.onExit);
    if(state.transitions){
        state.transitions.
            filter(function(t){
                return t.onTransition;
            }).
            map(function(t){
                return t.onTransition;
            }).
            forEach(function(transitionActions){
                addNodesToNodeList(transitionActions);
            });
    }

    if(state.states){
        state.states.forEach(function(childState){traverse(childState,allScriptAndDataNodesWithSrcAttr);});
    }
}


module.exports = inlineSrcs;
