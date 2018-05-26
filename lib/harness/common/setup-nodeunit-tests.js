var async = require('async');
var _ = require('underscore');

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
        testSerialization : testSerialization,
        testGenAsync : testGenAsync,
        test : test,
        name : test.name + (testSerialization ? '(serialization)' : '') + (testGenAsync ? '(async)' : '')
      });
    });
  });
})

module.exports = function(Statechart){

  var fixtures = {};

  testOptions.forEach(function(test){
      //console.log(test);
      fixtures[test.name] = function(t){
          //console.log('Running test',test.name);

          //t.plan(test.test.events.length + 1);

          var options = {};
          if(test.testSerialization || test.testGenAsync){
            options.doSend = doSend; //add a hook to intercept the event dispatch
          }

          var sc = new Statechart(test.test.sc, options);

          var actualInitialConf = sc.start();

          //console.log('initial configuration',actualInitialConf);

          t.deepEqual(actualInitialConf.sort(),test.test.test.initialConfiguration.sort(),'initial configuration');

          var mostRecentSnapshot;

          //console.log('test.test.test.events', test.test.test.events);
          async.eachSeries(test.test.test.events,function(nextEvent,cb){
              //console.log('nextEvent', nextEvent);

              function ns(){

                  if(test.testSerialization && mostRecentSnapshot){
                    //load up state machine state
                    sc = new Statechart(test.test.sc,_.extend({snapshot : JSON.parse(mostRecentSnapshot)},options));
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

          //this is a hook to handle tests with options serialization and async
          function doSend(session, event){
            if(test.testSerialization && mostRecentSnapshot){
              sc = new Statechart(test.test.sc,_.extend({
                sessionid : session.opts.sessionid,   //reuse existing sessionid
                snapshot : JSON.parse(mostRecentSnapshot)
              }, options));
            }
            if(test.testGenAsync){
              sc.genAsync(event, eventProcessed);
            } else {
              try {
                var conf = sc.gen(event);
                eventProcessed(null, conf);
              } catch (e){
                eventProcessed(e);
              }
            }
            function eventProcessed(err, actualNextConf){
              if(test.testSerialization){
                mostRecentSnapshot = JSON.stringify(sc.getSnapshot());
              }
            }
          }
      };
  });

  return fixtures;
}
