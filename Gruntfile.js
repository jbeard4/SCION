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
      express: {
        options: {
          script: 'grunt/server.js',
          port: 3000
        },
        dev: {
          options: {
            node_env: 'development'
          }
        },
        prod: {
          options: {
            node_env: 'production'
          }
        },
        "prod-require": {
          options: {
            node_env: 'production-require'
          }
        }
      },
      'saucelabs-custom': {
        all: {
          options: {
            urls: [
              'http://127.0.0.1:3000/'
            ],
            browsers: browsers,
            build: process.env.TRAVIS_JOB_ID,
            testname: 'custom tests',
            throttled: 5,
            statusCheckAttempts : 180,
            sauceConfig: {
              'video-upload-on-pass': false
            }
          }
        }
      },
      gitcommit: {
          dist: {
              options: {
                  message: 'Updated dist files',
              },
              files: {
                  src: [
                    'dist/scion.js',
                    'dist/scion.js.map',
                    'dist/scion.min.js'
                  ]
              }
          }
      },
      release: {
        options: {
          beforeRelease : ['build', 'gitcommit:dist'],
          additionalFiles: ['bower.json'],
          github: {
            repo: 'jbeard4/SCION-CORE', //put your user/repo here
            accessTokenVar: 'GITHUB_ACCESS_TOKEN', //ENVIRONMENT VARIABLE that contains GitHub Access Token
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
  grunt.registerTask('run-tests', ['nodeunit']);
  grunt.registerTask('run-browser-tests', [ 'run-browser-tests-dev', 'run-browser-tests-prod', 'run-browser-tests-prod-require']);
  grunt.registerTask('run-browser-tests-dev', ['express:dev', 'saucelabs-custom', 'express:dev:stop' ]);
  grunt.registerTask('run-browser-tests-prod', ['express:prod', 'saucelabs-custom', 'express:prod:stop' ]);
  grunt.registerTask('run-browser-tests-prod-require', ['express:prod-require', 'saucelabs-custom','express:prod-require:stop' ]);
  grunt.registerTask('build', ['browserify', 'babel', 'replace-reserved-words', 'uglify']);
  grunt.registerTask('default', ['build']);
};
