'use strict';

var microexpresscion = require('microexpresscion'),
    SwaggerClient = require('swagger-client');

var PORT = process.env.PORT || 8888;

//start the server programmatically
microexpresscion.initExpress({ port: PORT, pathToModel : __dirname + '/build/morse.scxml' }, function (err, express) {
  express.app.listen(PORT, function(){
    //use the swagger js client library to set up singleton instance
    var swagger = new SwaggerClient({
      url: 'http://localhost:' + PORT + '/smaas.json',
      success: function(){
        swagger.apis.default.createNamedInstance(
          { InstanceId: '_singleton' },
          function onInstanceSuccess (data) {
            console.log('Created singleton instance:', data.headers.location);
            //TODO: listen to hardware events
          },
          function onInstanceError (data) {
            console.log('Error on instance creation', data.data.toString());
          });
      }
    }); 
  });
});
