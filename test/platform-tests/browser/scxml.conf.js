// Karma configuration
// Generated on Fri May 03 2013 22:39:17 GMT-0600 (MDT)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  QUNIT,
  QUNIT_ADAPTER,
  //JASMINE,
  //JASMINE_ADAPTER,
  //MOCHA,
  //MOCHA_ADAPTER,

  './lib/async.js',
  './lib/jquery.js',
  './lib/scxml.js',
  //'./spec.js'
  {pattern: 'scxml-test-framework/test/*/*', watched: true, included: false, served: true},
  {pattern: 'spec.js', watched: true, included: true, served: true}
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_DEBUG;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Firefox'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
