module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'dist/scion.js',
          dest: 'dist/scion.min.js'
        }
      },
      babel: {
          options: {
              sourceMap: true,
              presets: ['es2015'],
              plugins : ['transform-es2015-modules-umd']
          },
          dist: {
              files: {
                  'dist/scion.js' : 'lib/scion.js'
              }
          }
      },
      nodeunit: {
        all : ['test/harness/node/index.js']
      },
      browserify : {
        dev: {
          options: {
            debug : true,
            browserifyOptions : {
              standalone: 'scion_tests'
            }
          },
          src: ['test/setup-nodeunit-tests.js'],
          dest: 'test/harness/browser/build/nodeunit-tests-bundle.js'
        }
      }
  });

  grunt.registerTask('build-tests', ['browserify:dev']);
  grunt.registerTask('test', ['build', 'build-tests', 'run-tests']);
  grunt.registerTask('run-tests', ['nodeunit']);
  grunt.registerTask('build', ['babel', 'uglify']);
};
