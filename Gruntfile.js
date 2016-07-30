module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  //var browsers = require('./grunt/browsers');

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'dist/scxml.js',
          dest: 'dist/scxml.min.js'
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
                  'dist/scxml.js' : 'dist/scxml.js'
              }
          }
      },
      nodeunit: {
        all : ['test/harness/node/index.js']
      },
      browserify : {
        prod : {
          options: {
            debug : true,
            browserifyOptions : {
              standalone: 'scxml'
            }
          },
          src: ['lib/runtime/platform-bootstrap/node/index.js'],
          dest: 'dist/scxml.js'
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
      /*
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
            statusCheckAttempts : -1,
            sauceConfig: {
              'video-upload-on-pass': false
            }
          }
        }
      },
      */
      gitcommit: {
          dist: {
              options: {
                  message: 'Updated dist files',
              },
              files: {
                  src: [
                    'dist/scxml.js',
                    'dist/scxml.js.map',
                    'dist/scxml.min.js'
                  ]
              }
          }
      },
      release: {
        options: {
          beforeRelease : ['build', 'gitcommit:dist'],
          additionalFiles: ['bower.json'],
          github: {
            repo: 'jbeard4/SCION', //put your user/repo here
            accessTokenVar: 'GITHUB_ACCESS_TOKEN', //ENVIRONMENT VARIABLE that contains GitHub Access Token
          }
        }
      }

  });

  grunt.registerTask('replace-reserved-words', 'String replace reserved words in built JavaScript.', function() {
    var fs = require('fs');
    var fileContents = fs.readFileSync('dist/scxml.js','utf8');
    ['return','delete'].forEach(function(s){
      fileContents = fileContents.replace(new RegExp('\\.\\b' + s + '\\b','g'), '["' + s + '"]'); 
    });
    fs.writeFileSync('dist/scxml.js', fileContents);
  });

  //TODO: copy babel-polyfill and nodeunit-browser into test/harness/browser/lib. I wish these were published via bower. 

  grunt.registerTask('build', [ 'browserify:prod', 'babel', 'replace-reserved-words', 'uglify']);
  grunt.registerTask('default', ['build']);
};

