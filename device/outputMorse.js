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
    str.split(/\b\s+(?!$)/g).map(function(word){
      console.log('word',word);
      return {
        original : word,
        morse : 
          word.split('').map(function(c){
            return textToMorse[c].split('');
          }).filter(function(str){
            return str;
          })
       };
    });

  async.eachSeries(words, function(word, wordCb){

    console.log('word.original',word.original);
    hardware.lcd.write(word.original);

    async.eachSeries(word.morse, function(morseSequence, sequenceCb){

      async.eachSeries(morseSequence, function(morseChar, charCb){
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
