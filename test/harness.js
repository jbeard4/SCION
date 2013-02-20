var scion = require('../lib/scion');
var addTest = require('tape');
var path = require('path');
var async = require('async');

//path to test cases is passed in via argv
var statechartModulePaths = process.argv.slice(2);      //assume these are of the form *.test.json

//console.log('statechartModulePaths',statechartModulePaths); 

var swallowErrors = false;

//if we've specified individual tests via argv, get them
//otherwise, pull it from the registry
var tests = statechartModulePaths.length ? 
        statechartModulePaths.map(function(statechartModulePath){

            //try to find a .test.json file
            var testModulePath = statechartModulePath.replace(/\.sm\.js(on)?$/,'.test.json');
            var sm = require(path.resolve('.',statechartModulePath));

            return {
                name : testModulePath,
                sm : sm,
                test : require(path.resolve('.',testModulePath))
            };
        }) : require('./tests.js');

tests.forEach(function(test){
    addTest(test.name,function(t){

        t.plan(test.test.events.length + 1);

        var sc = new scion.Statechart(test.sm);

        var actualInitialConf = sc.start();

        console.log('initial configuration',actualInitialConf);

        t.deepEqual(actualInitialConf.sort(),test.test.initialConfiguration.sort(),'initial configuration');

        async.eachSeries(test.test.events,function(nextEvent,cb){

            function ns(){
                console.log('sending event',nextEvent.event);

                var actualNextConf = sc.gen(nextEvent.event);

                console.log('next configuration',actualNextConf);

                t.deepEqual(actualNextConf.sort(),nextEvent.nextConfiguration.sort(),'next configuration after sending event ' + JSON.stringify(nextEvent));

                cb();
            }

            if(nextEvent.after){
                console.log('Test harness waiting',nextEvent.after,'ms before sending next event');
                setTimeout(ns,nextEvent.after);
            }else{
                ns();
            }
        },function(){
            //we could explicitly end here by calling t.end(), but we don't need to - t.plan() should take care of it automatically
        });
    });
});
