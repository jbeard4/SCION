var util = require('./util');
var outputMorse = require('./outputMorse');

util.fetchPage('http://slashdot.org/',function(err, pageContents){
  var hardware = require('./initHardware');
  outputMorse(hardware,pageContents,function(){
    console.log('done');
  });
});
