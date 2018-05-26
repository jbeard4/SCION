var scion = require('../../..');
var tests = require('scion-core-test-framework')(scion.Statechart);

Object.keys(tests).forEach(function(key){
  exports[key] = tests[key];
}); 
