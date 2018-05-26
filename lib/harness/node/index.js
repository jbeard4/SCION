var scion = require('../../..');
var tests = require('../common/setup-nodeunit-tests')(scion.SCInterpreter);

Object.keys(tests).forEach(function(key){
  exports[key] = tests[key];
}); 
