var async = require('async');

//if we've specified individual tests via argv, get them
//otherwise, pull it from the registry
var tests = require('../../tests/tests.js');
var testSerializations = [true, false];
var testGenAsync = [true, false];

var testOptions = [];
testSerializations.forEach(function(testSerialization){
  testGenAsync.forEach(function(testGenAsync){
    tests.forEach(function(test){
      testOptions.push({
        testSerialization : false,
        testGenAsync : false,
        test : test,
        name : test.name + (false ? '(serialization)' : '') + (false ? '(async)' : '')
      });
    });
  });
})

module.exports = function(scion){

  var fixtures = {};

  testOptions.forEach(function(test){
      //console.log(test);
      fixtures[test.name] = function(t){
          //console.log('Running test',test.name);

          //t.plan(test.test.events.length + 1);

          var sc = new scion.Statechart(test.test.sc);

          var actualInitialConf = sc.start();

          //console.log('initial configuration',actualInitialConf);

          t.deepEqual(actualInitialConf.sort(),test.test.test.initialConfiguration.sort(),'initial configuration');

          var mostRecentSnapshot;

          async.eachSeries(test.test.test.events,function(nextEvent,cb){

              function ns(){

                  if(test.testSerialization && mostRecentSnapshot){
                    //load up state machine state
                    sc = new scion.Statechart(test.test.sc,{snapshot : JSON.parse(mostRecentSnapshot)});
                  }

                  //console.log('sending event',nextEvent.event);

                  var actualNextConf;
                  if(test.testGenAsync){
                    sc.genAsync(nextEvent.event, ns2);
                  } else {
                    try {
                      var conf = sc.gen(nextEvent.event);
                      ns2(null, conf);
                    } catch (e){
                      ns2(e);
                    }
                  }

                  function ns2(err, actualNextConf){

                    //TODO: handle err
                    //console.log('next configuration',actualNextConf);

                    t.deepEqual(actualNextConf.sort(),nextEvent.nextConfiguration.sort(),'next configuration after sending event ' + nextEvent.event.name);
                    //dump state machine state

                    if(test.testSerialization){
                      mostRecentSnapshot = JSON.stringify(sc.getSnapshot());
                      //console.log('mostRecentSnapshot',mostRecentSnapshot);
                      sc = null;  //clear the statechart in memory, just because
                    }

                    cb();

                  }

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
