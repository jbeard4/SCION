var textToMorse = require('../morse-code.json');

var DIT_LENGTH = 250; //ms
function outputMorseStringToBuzzer(str, cb){
  var sentences = 
    str.split('.').map(function(sentence){
      return sentence.split(/ +/g).map(function(word){
        return word.map(function(c){
          return textToMorse[c];
        }).filter(function(str){
          return str;
        });
      });
    });

  async.eachSeries(sentences, function(sentence, sentenceCb){
    async.eachSeries(sentence, function(word, wordCb){
      async.eachSeries(word, function(morseChar, charCb){

        myLcd.write(word);

        function turnOffTheBuzzerAndNext(){
          myBuzzer.write(0);  //make some noise
                              //TODO: also write to the LCD
          setTimeout(charCb,DIT_LENGTH);
        }

        myBuzzer.write(1);  //make some noise

        switch(morseChar){
          case '.':
            setTimeout(turnOffTheBuzzerAndNext,DIT_LENGTH);
          case '-':
            setTimeout(turnOffTheBuzzerAndNext,DIT_LENGTH * 3);
          default:
            throw new Error('Unexpected morse char');
        }
        
        setTimeout(DIT_LENGTH, charCb);
      }, function(){
        //word finished
        setTimeout(DIT_LENGTH * 3, wordCb);
      });
    }, function(){
      //sentence finished
      setTimeout(DIT_LENGTH * 7, sentenceCb);
    });
  }, cb);
}

module.exports = outputMorseStringToBuzzer;
