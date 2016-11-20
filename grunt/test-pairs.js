var grunt   = require('grunt');

var tests = grunt.file.expand(require('./scxml-tests.json'));

var testPairs = tests.map(function(test){
  var filename = test.replace('\.scxml','.json');
  return [test, require('../' + filename)];
});

module.exports = testPairs;

