var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

//TODO: move pin configuration into environment variables

var groveSensor = require('jsupm_grove');

var myLed = new m.Gpio(4); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen1 & Gen2)
myLed.dir(m.DIR_OUT); //set the gpio direction to output

var myBuzzer = new m.Gpio(2); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen1 & Gen2)
myBuzzer.dir(m.DIR_OUT); //set the gpio direction to output

// Create the button object using GPIO pin 0
var button = new groveSensor.GroveButton(3);

// Load lcd module on I2C
var LCD = require('jsupm_i2clcd');

// Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

module.exports = {
  led : myLed,
  buzzer : myBuzzer,
  lcd : myLcd,
  button : button
};
