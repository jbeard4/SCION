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
      scripts: {
        files: [
          'lib/**/*.js',                        //Watch SCION changes
          'test/*.js',                          //Watch test server changes
          'test/scxml-test-framework/lib/*.js', //Watch test client changes
        ],
        tasks: ['jshint']
      },
      test: {
        files: [
          'test/scxml-test-framework/test/**/*.scxml',  //Watch test content changes
          'test/scxml-test-framework/test/**/*.json'    //Watch test configuration changes
        ],
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