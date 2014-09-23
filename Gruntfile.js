module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      configFiles: {
        files: [ 'Gruntfile.js' ],
        options: {
          reload: true
        }
      },
      test: {
        files: [
          'lib/**/*.js', //Watch all if SCION changes
          'test/*.js', //Watch if test server changes
          'test/scxml-test-framework/lib/*.js', //Watch if test server changes
          'test/scxml-test-framework/test/**/*.scxml', //Watch if test contents changes
          'test/scxml-test-framework/test/**/*.json'], //Watch if test configuration changes
        tasks: ['runtests']
      }
    },
    jshint: {
      all: ['Gruntfile.js',
            'lib/**/*.js',
            'test/*.js',
            'test/scxml-test-framework/lib/*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['watch']);


  grunt.registerTask('runtests', ['jshint']);
};