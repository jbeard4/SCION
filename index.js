#!/usr/bin/env node
'use strict';

var path = require('path');
var microexpresscion = require('microexpresscion'),
    SwaggerClient = require('swagger-client');

var express = require('express');

var PORT = process.env.PORT || 3000;
var INSTANCEID = '_singleton';
var hostUrl = 'http://localhost:' + PORT;

//start the server programmatically
microexpresscion.initExpress(__dirname + '/build/morse.scxml', function (err, app) {
  app.listen(PORT, function(){
    //use the swagger js client library to set up singleton instance
    var swagger = new SwaggerClient({
      url: hostUrl + '/api/v3/smaas.json',
      success: function(){
        swagger.apis.scxml.createNamedInstance(
          { InstanceId: INSTANCEID },
          function onInstanceSuccess (data) {
            console.log('Created singleton instance:', data.headers.location);

            //initialize the instance
            swagger.apis.scxml.sendEvent(
              {  
                InstanceId: INSTANCEID,
                Event: {name : 'system.start'}
              }, function (response) {
                console.log('data',response.data);
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
