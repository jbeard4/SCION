var grunt   = require('grunt');
var path = require('path');

var tests = grunt.file.expand(require('./scxml-tests.json').map( p => path.join(__dirname,'..',p))).map( fullPath => path.relative(__dirname, fullPath));

var testPairs = tests.map(function(test){
  var filename = test.replace('\.scxml','.json');
  return [test, require(filename)];
});

module.exports = testPairs;

