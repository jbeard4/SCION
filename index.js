const scxml = require('scxml');
require('scxml-sourcemap-plugin')(scxml);  //load the sourcemaps plugin
const diagnosticsClient = require('scion-scxml-monitor-middleware/client');

diagnosticsClient.init(scxml); 

module.exports = scxml;
