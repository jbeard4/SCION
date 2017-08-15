const platform = require('./runtime/platform-bootstrap/node/platform');
const vm = require('vm');

module.exports = {
  initContexts : initContexts,
  fetchScripts : fetchScripts,
  IS_INSPECTING : (process.execArgv && process.execArgv.map( e => e.match(/^--inspect(=\d+)?/) ).filter(e => e).length) 
};

function extend(to, from){
  Object.keys(from).forEach(function(k){
    to[k] = from[k];
  });
  return to;
}

function initContexts(executionContext, hostContext){
    if (!executionContext) {
        executionContext = platform.module.createExecutionContext();
    }

    if (!vm.isContext(executionContext)){
      executionContext = extend({}, executionContext);
      executionContext = vm.createContext(executionContext); 
    } 

    if (typeof hostContext !== 'object' || hostContext === null) {
        hostContext = {};
    }

    return [executionContext, hostContext];
}

function fetchScripts(module, hostContext){
    var scriptCount = module.rootScripts.length;
    var scriptPromises = new Array(scriptCount);
    for (let i = 0; i < scriptCount; i++) {
        let curScript = module.rootScripts[i];
        if (curScript.src) {
            // script url already resolved in compileModule
            scriptPromises[i] = fetchScript(curScript, hostContext);
        } else {
            scriptPromises[i] = Promise.resolve(curScript);
        }
    }
    return scriptPromises;
}

function fetchScript(scriptInfo, hostContext) {
    return new Promise(function(resolve, reject) {

        platform.getScriptFromUrl(scriptInfo,
            function(err, compiledScript, mimeType) {
                if (err) {
                    reject(err);
                } else {
                    resolve(scriptInfo);
                }
            },
            hostContext);
    });
}
