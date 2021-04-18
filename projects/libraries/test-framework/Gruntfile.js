module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      release: {
        options: {
          github: {
            repo: 'jbeard4/scxml-test-framework', //put your user/repo here
            accessTokenVar: 'GITHUB_ACCESS_TOKEN', //ENVIRONMENT VARIABLE that contains GitHub Access Token
          }
        }
      }
  });
};
