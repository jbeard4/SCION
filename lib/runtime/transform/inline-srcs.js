var pm = require('../platform-bootstrap/platform'),
    util = require('./util');

function inlineSrcs(docUrl,scjson,context,cb){
    //console.log('inlining scripts');

    var nodesWithSrcAttributes = [], errors = [], resultCount = 0;

    util.traverseAndCollectAllScriptAndDataNodesWithSrcAttr(scjson,nodesWithSrcAttributes);

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
                    pm.platform.log("Error downloading document " + nodeUrl + " : " + (err.message || err));
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

module.exports = inlineSrcs;
