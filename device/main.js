var m = require('mraa'); //require mraa
var groveSensor = require('jsupm_grove');
var request = require('request');
var EventSource = require('eventsource');
var validUrl = require('valid-url');
var util = require('./util');
var outputMorse = require('./outputMorse');

console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

module.exports = function init(swagger, instanceId, hostUrl){
  var myLed = new m.Gpio(4); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen1 & Gen2)
  myLed.dir(m.DIR_OUT); //set the gpio direction to output

  var myBuzzer = new m.Gpio(2); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen1 & Gen2)
  myBuzzer.dir(m.DIR_OUT); //set the gpio direction to output

  // Create the button object using GPIO pin 0
  var button = new groveSensor.GroveButton(3);

  // Read the input and print, waiting one second between readings
  var previousButtonState, currentButtonState;
  function readButtonValue() {
    currentButtonState = button.value();
    myLed.write(currentButtonState);
    
    if(currentButtonState !== previousButtonState){
      var eventName = currentButtonState ? 'device.press' : 'device.release';

      swagger.apis.default.sendEvent(
        {  
          InstanceId: instanceId,
          Event: {name : eventName }
        }, function (data) {
          setTimeout(readButtonValue,10);
          previousButtonState = currentButtonState;
          myLed.write(currentButtonState);
        }, function (data) {
          console.log('error response');
        });
    }else{
      setTimeout(readButtonValue,10);
      previousButtonState = currentButtonState;
    }
  }

  // Load lcd module on I2C
  var LCD = require('jsupm_i2clcd');

  // Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
  var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

  var es = new EventSource(hostUrl + '/api/v3/' + instanceId + '/_changes');
  var buffer = '';
  myLcd.write(buffer);  
  es.on('character',function(e){
    var c = e.data;
    console.log('c',c);
    if(c === ' '){
      util.fetchPage(buffer, function(text){
        outputMorse(text, function(){
          buffer = '';
          myLcd.write(buffer); //clear the lcd
        });
      });
    } else{
      buffer += c;
      myLcd.write(c);  
    }
  });
  es.onerror = function() {
    console.log('ERROR!');
  };

  readButtonValue();
};
