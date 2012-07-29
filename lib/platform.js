function isRhino(){
    return typeof Packages !== "undefined";
}

function isNode(){
    return typeof process !== "undefined" && typeof module !== "undefined";
}

function isBrowser(){
    return typeof window !== "undefined" && typeof document !== "undefined";
}

var platform;

if(isRhino()){
    module.exports = require('./rhino/platform');
}else if(isNode()){
    module.exports = require('./node/platform');
}else if(isBrowser()){
    module.exports = require('./browser/platform');
}else{
    module.exports = require('./embedded/platform');
}
