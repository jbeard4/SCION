module.exports = function(grunt){
  var patterns = require('../../scxml-tests.json');
  grunt.log.debug('patterns',patterns);
  var tests = grunt.file.expand(patterns );
  grunt.log.debug('scxml tests',tests);
  return {
    unit: {
      configFile: 'grunt/config/karma/karma.conf.js',
      singleRun: false,
      browsers: ['Chrome'],
      client: {
        args: tests
      }
    }
  };
}
