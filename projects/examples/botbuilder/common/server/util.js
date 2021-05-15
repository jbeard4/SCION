const path = require('path');

module.exports.log = function log(interpreter, eventName, value){
  console.log(path.parse(interpreter._model.docUrl).name, interpreter.opts.sessionid, eventName, value);
};
