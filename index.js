const scxml = require('@scion-scxml/scxml');
require('@scion-scxml/sourcemap-plugin')(scxml);  //load the sourcemaps plugin
const diagnosticsClient = require('scion-scxml-monitor-middleware/client');

diagnosticsClient.init(scxml); 

module.exports = scxml;
