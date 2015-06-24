var fs = require('fs'),
    util = require('../../transform/util'),
    path = require('path');

var scxmlToScjson = require('../../../compiler/scxml-to-scjson'),
    scjsonToModule = require('../../../compiler/scjson-to-module');

module.exports = function(module, fileName){

    var docString = fs.readFileSync(fileName,'utf8');

    console.log('docString',docString); 
      
    var scJson = scxmlToScjson(docString);

    console.log('scJson',scJson); 

    var nodesWithSrcAttributes = [];
    util.traverseAndCollectAllScriptAndDataNodesWithSrcAttr(scJson,nodesWithSrcAttributes);

    var scxmlDir = path.dirname(fileName);

    console.log('nodesWithSrcAttributes.length',nodesWithSrcAttributes);

    //inline srcs synchronously
    nodesWithSrcAttributes.forEach(function(node) {
        var scriptPath = path.resolve(scxmlDir,node.src);
        try {
            var s = fs.readFileSync(scriptPath,'utf8').toString();
            console.log('setting node with src',scriptPath,'content to',s);
            node.content = s;
        }catch(e){
            console.error('Error resolving SCXML element with src attribute',scriptPath,e.message);
        }
    });

    var jsModuleString = scjsonToModule(scJson,'commonjs');

    console.log('jsModuleString:\n',jsModuleString); 

    var m = module._compile(jsModuleString,fileName);

    console.log('m',m);

    return m;
};
