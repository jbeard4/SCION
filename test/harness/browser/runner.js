function start(scion){
  //fake a console for IE8 on sauce labs
  if(!window.console){
    window.console = {
      log : function(){}
    };
  }
  var allTests = window.scion_tests(scion);
  console.log(allTests); 
  var moduleStartTime, moduleEndTime, testResults = {};
  nodeunit.runModules({all : allTests},
    {
      moduleStart : function(name){ moduleStartTime = new Date(); }, // called before a module is tested
      //moduleDone : function(name, assertions){ console.log('moduleDone',name, assertions);}, // called once all test functions within the module have completed (see assertions object reference below) ALL tests within the module
      testStart : function(name){ 
        testResults[name] = {start : new Date()};
      }, //called before a test function is run
      //testReady : function(test){  }, // called before a test function is run with the test object that will be passed to the test function
      testDone : function(name, assertions){ 
        var currentTest = testResults[name];
        var failedAssertion = assertions.filter(function(a){ return a.failed();})[0];
        if(failedAssertion) console.log('failedAssertion ',failedAssertion, name );
        currentTest.duration = new Date() - currentTest.start;
        currentTest.result = !failedAssertion;
        console.log('currentTest.result',currentTest.result);
        currentTest.message = failedAssertion ? failedAssertion.message || failedAssertion.error.message : 'passed';
        delete currentTest.start; 
      }, //called once a test function has completed (by calling test.done())
      //log : function(assertion){console.log('log',assertion);} , //called whenever an assertion is made (see assertion object reference below)
      done : function(assertions){ 
        console.log('done', assertions);
        moduleEndTime = new Date();
        var results = Object.keys(testResults).map(function(name){
            testResults[name].name = name;
            return testResults[name];
        });
        window.global_test_results = {
          "passed": results.filter(function(a){return a.result;}).length,
          "failed": results.filter(function(a){return !a.result;}).length,
          "total": results.length,
          "duration": assertions.duration
          //,"tests": results.filter(function(test){return !test.result;})    //FIXME: bug in IE9 and grunt-saucelabs requires this to be disabled
        };
        console.log('window.global_test_results',window.global_test_results);
      } //called after all tests/modules are complete
    });
}
