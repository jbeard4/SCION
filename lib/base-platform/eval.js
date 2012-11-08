module.exports = function(content,name){
    //JScript doesn't return functions from evaled function expression strings, 
    //so we wrap it here in a trivial self-executing function which gets eval'd
    return eval('(function(){\nreturn ' + content + ';})()');
};
