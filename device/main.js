var request = require('request');
var EventSource = require('eventsource');
var util = require('./util');
var outputMorse = require('./outputMorse');
var hardware = require('./initHardware');

module.exports = function init(swagger, instanceId, hostUrl){

  if(!hardware) return;

  // Read the input and print, waiting one second between readings
  var previousButtonState, currentButtonState;
  function readButtonValue() {
    currentButtonState = hardware.button.value();
    
    if(currentButtonState !== previousButtonState){
      var eventName = currentButtonState ? 'device.press' : 'device.release';
      hardware.led.write(currentButtonState);
      hardware.buzzer.write(currentButtonState);

      swagger.apis.default.sendEvent(
        {  
          InstanceId: instanceId,
          Event: {name : eventName }
        }, function (data) {
          readButtonValueTimeoutHandle = setTimeout(readButtonValue,10);
          previousButtonState = currentButtonState;
        }, function (data) {
          console.log('error response');
        });
    }else{
      readButtonValueTimeoutHandle = setTimeout(readButtonValue,10);
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
      //ignore space for this application
    } else{
      buffer += c;
      hardware.lcd.write(c);  
    }
  });
  es.on('onEntry',function(e){
    if(e.data === 'long_press'){
      hardware.lcd.clear();  
      hardware.lcd.write('Fetching page...');  
      util.fetchPage(buffer, function(err, text){
        if(err){ 
          buffer = '';
          hardware.lcd.clear(); //clear the lcd
          hardware.lcd.write(err.message);
          //TODO: move this logic into the state machine
          setTimeout(function(){
            hardware.lcd.clear(); //clear the lcd
          },1000);
          return;
        }
        outputMorse(hardware, text, function(){
          readButtonValue();
          buffer = '';
          hardware.lcd.clear(); //clear the lcd
        });
      });
    }
  });
  es.onerror = function() {
    console.log('ERROR!');
  };

  readButtonValue();
};
