// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '../../../',
    frameworks: ['nodeunit'],
    files : ['dist/test/*/*.js']
  });
};
