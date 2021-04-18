var m = require('mraa'); //require mraa
var groveSensor = require('jsupm_grove');
var LCD = require('jsupm_i2clcd');
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var myLed = new m.Gpio(4); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen1 & Gen2)
myLed.dir(m.DIR_OUT); //set the gpio direction to output


var myBuzzer = new m.Gpio(2); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen1 & Gen2)
myBuzzer.dir(m.DIR_OUT); //set the gpio direction to output

// Create the button object using GPIO pin 0
var button = new groveSensor.GroveButton(3);

// Read the input and print, waiting one second between readings
function readButtonValue() {
  var v = button.value();
  myLed.write(v); //if ledState is true then write a '1' (high) otherwise write a '0' (low)
  myBuzzer.write(v); //if ledState is true then write a '2' (high) otherwise write a '0' (low)
}
setInterval(readButtonValue, 10);

var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);
myLcd.write('hello world');  
