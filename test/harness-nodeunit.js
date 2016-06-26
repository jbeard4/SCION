var scion = require('../lib/scion');
var path = require('path');
var async = require('async');

var testSerialization = process.env.TEST_SERIALIZATION;

//path to test cases is passed in via argv
var statechartModulePaths = require('./tests.json');      //assume these are of the form *.test.json

//console.log('statechartModulePaths',statechartModulePaths); 

var swallowErrors = false;

//if we've specified individual tests via argv, get them
//otherwise, pull it from the registry
var tests = statechartModulePaths.length ? 
        statechartModulePaths.map(function(statechartModulePath){

            //try to find a .test.json file
            var testModulePath = statechartModulePath.replace(/\.sc\.js(on)?$/,'.test.json');
            var sc = require(path.join(__dirname,statechartModulePath));

            return {
                name : testModulePath,
                sc : sc,
                test : require(path.join(__dirname,testModulePath))
            };
        }) : require('./tests.js');

tests.forEach(function(test){
    //console.log(test);
    exports[test.name] = function(t){
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
