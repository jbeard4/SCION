module.exports = {
  unit: {
    configFile: 'grunt/config/karma/karma.conf.js',
    singleRun: false,
    browsers: ['Chrome'],
    client: {
      args: require('../../scxml-tests.json')
    }
  }
};
