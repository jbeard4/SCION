module.exports = {
  unit: {
    configFile: 'grunt/config/karma/karma.conf.js',
    singleRun: true,
    browsers: ['Chrome'],
    client: {
      args: require('./grunt/scxml-tests.json')
    }
  }
};
