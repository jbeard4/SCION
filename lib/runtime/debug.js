const scxml = require('./facade');
require('@jbeard/scion-sourcemap-plugin')(scxml);  //load the sourcemaps plugin
const diagnosticsClient = require('@jbeard/scion-scxml-debugger-middleware/client');

diagnosticsClient.init(scxml); 

module.exports = scxml;
