// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '../../../',
    frameworks: ['nodeunit'],
    files : ['test/nodeunit-test-harness/harness/browser/runner.js']
  });
};
