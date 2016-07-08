module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var browsers = require('./grunt/browsers');

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
          src: ['test/harness/common/setup-nodeunit-tests.js'],
          dest: 'test/harness/browser/build/nodeunit-tests-bundle.js'
        }
      },
      connect: {
        server: {
          options: {
            base: '',
            port: 9999
          }
        }
      },
      'saucelabs-custom': {
        all: {
          options: {
            urls: [
              'http://127.0.0.1:9999/test/harness/browser/harness.html'
            ],
            browsers: browsers,
            build: process.env.TRAVIS_JOB_ID,
            testname: 'custom tests',
            throttled: 5,
            statusCheckAttempts : -1,
            sauceConfig: {
              'video-upload-on-pass': false
            }
          }
        }
      }
  });

  grunt.registerTask('replace-reserved-words', 'String replace reserved words in built JavaScript.', function() {
    var fs = require('fs');
    var fileContents = fs.readFileSync('dist/scion.js','utf8');
    ['return','delete'].forEach(function(s){
      fileContents = fileContents.replace(new RegExp('\\.\\b' + s + '\\b','g'), '["' + s + '"]'); 
    });
    fs.writeFileSync('dist/scion.js', fileContents);
  });

  //TODO: copy babel-polyfill and nodeunit-browser into test/harness/browser/lib. I wish these were published via bower. 

  grunt.registerTask('build-tests', ['browserify:dev']);
  grunt.registerTask('test', ['build', 'build-tests', 'run-tests']);
  grunt.registerTask('run-tests', ['nodeunit', 'run-browser-tests' ]);
  grunt.registerTask('run-browser-tests', ['connect', 'saucelabs-custom' ]);
  grunt.registerTask('build', ['babel', 'replace-reserved-words', 'uglify']);
  grunt.registerTask('default', ['build']);
};
