var request = require('request');
var EventSource = require('eventsource');
var validUrl = require('valid-url');
var util = require('./util');
var outputMorse = require('./outputMorse');
var hardware = require('./initHardware');

module.exports = function init(swagger, instanceId, hostUrl){

  // Read the input and print, waiting one second between readings
  var previousButtonState, currentButtonState;
  function readButtonValue() {
    currentButtonState = hardware.button.value();
    hardware.led.write(currentButtonState);
    
    if(currentButtonState !== previousButtonState){
      var eventName = currentButtonState ? 'device.press' : 'device.release';

      swagger.apis.default.sendEvent(
        {  
          InstanceId: instanceId,
          Event: {name : eventName }
        }, function (data) {
          setTimeout(readButtonValue,10);
          previousButtonState = currentButtonState;
          hardware.led.write(currentButtonState);
        }, function (data) {
          console.log('error response');
        });
    }else{
      setTimeout(readButtonValue,10);
      previousButtonState = currentButtonState;
    }
  }

  var es = new EventSource(hostUrl + '/api/v3/' + instanceId + '/_changes');
  var buffer = '';
  hardware.lcd.write(buffer);  
  es.on('character',function(e){
    var c = e.data;
    console.log('c',c);
    if(c === ' '){
      util.fetchPage(buffer, function(text){
        outputMorse(text, function(){
          buffer = '';
          hardware.lcd.write(buffer); //clear the lcd
        });
      });
    } else{
      buffer += c;
      hardware.lcd.write(c);  
    }
  });
  es.onerror = function() {
    console.log('ERROR!');
  };

  readButtonValue();
};
