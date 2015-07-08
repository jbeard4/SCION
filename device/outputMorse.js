var textToMorse = require('../morse-code.json');
var async = require('async');

var DIT_LENGTH = 100; //ms
function outputMorseStringToBuzzer(hardware, str, cb){

  function turnOn(){
    hardware.led.write(1);
    hardware.buzzer.write(1);
  }

  function turnOff(){
    hardware.led.write(0);
    hardware.buzzer.write(0);
  }

  var words = 
    str.split(/\s+/g).map(function(word){
      return {
        original : word,
        morse : 
          word.split('').map(function(c){
            return {
              original : c,
              morse : textToMorse[c]
            };
          }).filter(function(o){
            return o.morse;
          })
       };
    });

  async.eachSeries(words, function(word, wordCb){

    console.log('word.original',word.original);

    async.eachSeries(word.morse, function(morseSequence, sequenceCb){
      //hardware output
      hardware.lcd.clear();
      hardware.lcd.write(word.original);
      hardware.lcd.setCursor(1,0);
      hardware.lcd.write(morseSequence.original);
      hardware.lcd.write(' ');
      hardware.lcd.write(morseSequence.morse);

      async.eachSeries(morseSequence.morse, function(morseChar, charCb){
        console.log('morseChar',morseChar);
        
        function turnOffTheBuzzerAndNext(){
          turnOff();
          setTimeout(charCb,DIT_LENGTH);
        }

        turnOn();

        switch(morseChar){
          case '.':
            setTimeout(turnOffTheBuzzerAndNext,DIT_LENGTH);
            break;
          case '-':
            setTimeout(turnOffTheBuzzerAndNext,DIT_LENGTH * 3);
            break;
          default:
            throw new Error('Unexpected morse char');
        }
      }, function(){
        //word finished
        setTimeout(sequenceCb, DIT_LENGTH * 3);
      });
    }, function(){
      //sentence finished
      setTimeout(wordCb, DIT_LENGTH * 7);
    });
  }, cb);
}

module.exports = outputMorseStringToBuzzer;

if(require.main === module){
  var hardware = require('./initHardware');
  outputMorseStringToBuzzer(hardware,'hello world',function(){
    console.log('done');
  })
}
