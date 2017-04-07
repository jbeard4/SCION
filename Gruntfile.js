module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
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
          files:  [ 'src/*.js', 'test-integration/**/*.{html,ts}', 'dist/schviz.js' ],
          tasks : [],
          options: {
            spawn: false
          }
        },
        public: {
          files: [""]
        }
      }
  });

  grunt.registerTask('mywatch',['express:dev:start','open:dev','watch:express']);
};
