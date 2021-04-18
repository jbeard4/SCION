// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '../../../',
    frameworks: ['jasmine-jquery', 'jasmine'],
    preprocessors: {
      'dist/*.js': ['sourcemap']
    },
    files : [
      {pattern: 'test/scxml-test-framework/test/*/*.scxml', watched: true, served: true, included: false},
      {pattern: 'test/scxml-test-framework/test/*/*.json', watched: true, served: true, included: false},
      {pattern: 'dist/scxml.js.map', watched: true, served: true, included: false},
      'test/nodeunit-test-harness/harness/browser/lib/polyfill.js',
      'dist/scxml.js',
      'test/nodeunit-test-harness/harness/browser/runner.js'
    ]
  });
};
