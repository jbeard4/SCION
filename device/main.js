var m = require('mraa'); //require mraa
var groveSensor = require('jsupm_grove');
var request = require('request');
var EventSource = require('eventsource');

console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

module.exports = function init(swagger, instanceId){
  var myLed = new m.Gpio(3); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen1 & Gen2)
  myLed.dir(m.DIR_OUT); //set the gpio direction to output

  // Create the button object using GPIO pin 0
  var button = new groveSensor.GroveButton(2);

  // Read the input and print, waiting one second between readings
  var previousButtonState, currentButtonState;
  function readButtonValue() {
    currentButtonState = button.value();
    
    if(currentButtonState !== previousButtonState){
      var eventName = currentButtonState ? 'device.press' : 'device.release';

      swagger.apis.default.sendEvent(
        {  
          InstanceId: instanceId,
          Event: {name : eventName }
        }, function (data) {
          console.log('response body',body);
          setTimeout(readButtonValue,100);
          previousButtonState = currentButtonState;
          myLed.write(currentButtonState);
        }, function (data) {
          console.log('error response');
        });
    }else{
      setTimeout(readButtonValue,100);
      previousButtonState = currentButtonState;
    }
  }

  // Load lcd module on I2C
  var LCD = require('jsupm_i2clcd');

  // Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
  var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

  var es = new EventSource(SCXML_URL + '/_changes');
  var buffer = '';
  myLcd.write(buffer);  
  es.on('character',function(e){
    console.log('character',e);	
    var c = JSON.parse(e.data);
    buffer += c;
    myLcd.write(c);  
  });
  es.onerror = function() {
    console.log('ERROR!');
  };

  readButtonValue();
};
