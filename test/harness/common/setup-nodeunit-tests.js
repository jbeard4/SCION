var async = require('async');

//if we've specified individual tests via argv, get them
//otherwise, pull it from the registry
var tests = require('../../tests/tests.js');

var testSerialization = false;

module.exports = function(scion){

  var fixtures = {};

  tests.forEach(function(test){
      //console.log(test);
      fixtures[test.name] = function(t){
          //console.log('Running test',test.name);

          //t.plan(test.test.events.length + 1);

          var sc = new scion.Statechart(test.sc);

          var actualInitialConf = sc.start();

          //console.log('initial configuration',actualInitialConf);

          t.deepEqual(actualInitialConf.sort(),test.test.initialConfiguration.sort(),'initial configuration');

          var mostRecentSnapshot;

          async.eachSeries(test.test.events,function(nextEvent,cb){

              function ns(){

                  if(testSerialization && mostRecentSnapshot){
                    //load up state machine state
                    sc = new scion.Statechart(test.sc,{snapshot : JSON.parse(mostRecentSnapshot)});
                  }

                  //console.log('sending event',nextEvent.event);

                  var actualNextConf = sc.gen(nextEvent.event);

                  //console.log('next configuration',actualNextConf);

                  t.deepEqual(actualNextConf.sort(),nextEvent.nextConfiguration.sort(),'next configuration after sending event ' + nextEvent.event.name);
                  //dump state machine state

                  if(testSerialization){
                    mostRecentSnapshot = JSON.stringify(sc.getSnapshot());
                    //console.log('mostRecentSnapshot',mostRecentSnapshot);
                    sc = null;  //clear the statechart in memory, just because
                  }

                  cb();
              }

              if(nextEvent.after){
                  //console.log('Test harness waiting',nextEvent.after,'ms before sending next event');
                  setTimeout(ns,nextEvent.after);
              }else{
                  ns();
              }
          },function(){
              //we could explicitly end here by calling t.end(), but we don't need to - t.plan() should take care of it automatically
              t.done();
          });
      };
  });

  return fixtures;
}
