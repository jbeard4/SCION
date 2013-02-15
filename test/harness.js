var scion = require('../lib/scion');
var assert = require('assert'), path = require('path');

//path to test cases is passed in via argv
var testModulePaths = process.argv.slice(2);      //assume these are of the form *.test.json

console.log('testModulePaths',testModulePaths); 

var tests = testModulePaths.map(function(testModulePath){

    return function(){

        var report = { name : testModulePath};

        console.log('Running test',testModulePath);

        var stateMachineModulePath = testModulePath.replace('.test.json','.sm.json');        //TODO: later, we will also look for a .js file, which will be a regular js module

        var smModule = require(path.resolve('.',stateMachineModulePath)),
            testModule = require(path.resolve('.',testModulePath));

        try {
            var sc = new scion.Statechart(smModule);

            sc.start();

            var actualInitialConf = sc.getConfiguration();

            assert.deepEqual(actualInitialConf,testModule.initialConfiguration,'initial configuration');

            testModule.events.forEach(function(nextEvent){
                var actualNextConf = sc.gen(nextEvent.event);

                assert.deepEqual(actualNextConf,nextEvent.nextConfiguration,'next configuration after sending event ' + nextEvent.event);
            });

            report.result = 'success';
        }catch(e){
            if(e.name === 'AssertionError'){
                report.result = 'failure';
            }else{
                report.result = 'error';
            }
            report.exception = e;
        }

        return report;
    };
}); 

console.log('tests',tests);

var reports = tests.map(function(test){return test();});

var 
    testsPassed = reports.filter(function(report){
        return report.result === 'success';
    }), 
    testsFailed = reports.filter(function(report){
        return report.result === 'failure';
    }), 
    testsErrored = reports.filter(function(report){
        return report.result === 'error';
    });

process.stdout.write('tests passed\n');
process.stdout.write(JSON.stringify(testsPassed,4,4) + '\n');

process.stdout.write('tests failed\n');
process.stdout.write(JSON.stringify(testsFailed,4,4) + '\n');

process.stdout.write('tests errored\n');
process.stdout.write(JSON.stringify(testsErrored,4,4) + '\n');

process.exit(testsFailed.length + testsErrored.length);
