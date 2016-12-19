module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
      concat: {
        options: {
          separator: ';',
        },
        dist: {
          src: ['node_modules/babel-polyfill/dist/polyfill.js', 'dist/schviz.js'],
          dest: 'dist/scxml.js'
        },
      },
      browserify : {
        dev : {
          options: {
            plugin: ['tsify'],
            browserifyOptions : {
              debug : true,
              standalone: 'SCHVIZ',
              'no-builtins' : true
            }
          },
          src: ['lib/index.js'],
          dest: 'dist/schviz.js'
        },
        prod : {
          options: {
            plugin: ['tsify'],
            browserifyOptions : {
              standalone: 'SCHVIZ'
            }
          },
          src: ['lib/index.ts'],
          dest: 'dist/schviz.js'
        }
      },
      express: {
        dev: {
          options: {
            node_env: 'development',
            livereload: true,
            script: 'grunt/server.js',
            port: 3000
          }
        }
      },
      open : {
        dev : {
          path : 'http://127.0.0.1:3000/test-integration/index.html',
          app: 'Google Chrome'
        }
      },
      watch: {
        options: {
          livereload: true
        },
        express: {
          files:  [ 'lib/*.js', 'test-integration/**/*.{html,js}' ],
          tasks : ['browserify:dev'],
          options: {
            spawn: false
          }
        },
        browserify: {
          files:  [ 'lib/*.js' ],
          tasks: ["browserify:dev"]
        },
        public: {
          files: [""]
        }
      }
  });

  grunt.registerTask('mywatch',['express:dev:start','open:dev','watch:express']);
};
