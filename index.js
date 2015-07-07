#!/usr/bin/env node
'use strict';

var path = require('path');
var microexpresscion = require('microexpresscion'),
    SwaggerClient = require('swagger-client');

var express = require('express');

var PORT = process.env.PORT || 8888;
var INSTANCEID = '_singleton';
var hostUrl = 'http://localhost:' + PORT;

//start the server programmatically
microexpresscion.initExpress({ port: PORT, pathToModel : __dirname + '/build/morse.scxml' }, function (err, opts) {
  console.log('opts',opts);
  opts.app.get('/foo',function(req,res){res.send('works')});
  opts.app.use('/app',express.static(path.join(__dirname, './app')));
  opts.app.listen(PORT, function(){
    //use the swagger js client library to set up singleton instance
    var swagger = new SwaggerClient({
      url: hostUrl + '/smaas.json',
      success: function(){
        swagger.apis.default.createNamedInstance(
          { InstanceId: INSTANCEID },
          function onInstanceSuccess (data) {
            console.log('Created singleton instance:', data.headers.location);

            //initialize the instance
            swagger.apis.default.sendEvent(
              {  
                InstanceId: INSTANCEID,
                Event: {name : 'system.start'}
              }, function (response) {
                console.log('data',response.data);
                if(process.env.EDISON){
                  var initDevice = require('./device/main');
                  initDevice(swagger, INSTANCEID, hostUrl);
                }
              }, function (data) {
                console.log('error response',data);
              });
          },
          function onInstanceError (data) {
            console.log('Error on instance creation', data.data.toString());
          });
      }
    }); 
  });
});
