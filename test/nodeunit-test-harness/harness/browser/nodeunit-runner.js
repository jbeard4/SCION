var testSerialization = false;

//prepare test fixtures
var fixtures = {};
testPairs.forEach(function(pair){
  var scxmlTest = pair[0],
      jsonTest = pair[1];

  //console.log('scxmlTest', scxmlTest);
  fixtures[scxmlTest] = function(t){

    console.log('Parsing model');
    scxml.urlToModel(scxmlTest,function(err, model){
      if(err) throw err;
      console.log('Preparing model');
      model.prepare(function(err, fnModel) {
        //console.log('fnModel', fnModel.toString());
        if(err) throw err;
        console.log('Instantiating machine');
        var sc = new scxml.scion.Statechart(fnModel, {sessionid : scxmlTest});
        console.log('Starting machine');

        var actualInitialConf = sc.start();
        console.log('initialConfiguration', actualInitialConf); 

        t.deepEqual(actualInitialConf.sort(),jsonTest.initialConfiguration.sort(),'initial configuration');

        var mostRecentSnapshot;

        function poll(){

          var nextEvent = jsonTest.events.shift();

          if(!nextEvent) return t.done();

          function ns(){

              //if(testSerialization && mostRecentSnapshot){
                //load up state machine state
              //  sc = new scion.Statechart(sc,{snapshot : JSON.parse(mostRecentSnapshot)});
              //}
              console.log('sending event',nextEvent.event);

              var actualNextConf = sc.gen(nextEvent.event);

              console.log('next configuration',actualNextConf);

              //if(JSON.stringify(actualNextConf.sort()) !== JSON.stringify(nextEvent.nextConfiguration.sort())) debugger;

              t.deepEqual(actualNextConf.sort(),nextEvent.nextConfiguration.sort(),'next configuration after sending event ' + nextEvent.event.name);
              //dump state machine state

              //if(testSerialization){
              //  mostRecentSnapshot = JSON.stringify(sc.getSnapshot());
                //console.log('mostRecentSnapshot',mostRecentSnapshot);
              //  sc = null;  //clear the statechart in memory, just because
              //}

              poll();
          }

          if(nextEvent.after){
              //console.log('Test harness waiting',nextEvent.after,'ms before sending next event');
              setTimeout(ns,nextEvent.after);
          }else{
              ns();
          }
        }

        poll();


      });
    });
  
  };
}); 

if(!window.console){
  window.console = {
    log : function(){}
  };
}

function start(scxml){

  var moduleStartTime, moduleEndTime, testResults = {};
  nodeunit.runModules(
  {"SCXML Tests": fixtures},
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
  }
  );

}
