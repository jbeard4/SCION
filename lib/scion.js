//this module provides a single point of access to all important user-facing modules in scion,
//and detects the environment, exposing an environment-specific module.

//FIXME: this might be a good candidate to apply inversion of control, 
//to facilitate extension by the user without patching this file.

function isRhino(){
    return typeof Packages !== "undefined";
}

function isNode(){
    return typeof process !== "undefined" && typeof module !== "undefined";
}

function isBrowser(){
    return typeof window !== "undefined" && typeof document !== "undefined";
}

if(isRhino()){
    module.exports = require('./rhino/SCXML');
}else if(isNode()){
    module.exports = require('./node/SCXML');
}else if(isBrowser()){
    module.exports = require('./browser/SCXML');
}else{
    //something else, perhaps a spartan shell environment
    module.exports = {
        annotator : require('./util/annotate-scxml-json'),
        json2model : require('./scxml/json2model'),
        scxml : require('./scxml/SCXML')
    };
}
