const get = require('../node/get');

module.exports = {
  readFile : function(path, encoding, cb){
    get.httpGet(path, cb);
  }
};
