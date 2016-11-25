angular.module('schviz2.components.selectSim', ['schviz2.service', 'schviz2.constants','schviz2.viz']).component('selectSim', {
  templateUrl: 'app/components/select-sim/select-sim.html',
  controller: SelectSimController,
  bindings: {
    allTests : '<'
    ,onUpdate : '<'
    ,name : '<'
  }
});

function SelectSimController(klayOptions, scxmlTestPairs, $scope, $window){

  var $ctrl = this;
  $ctrl.layout = klayOptions.right;
  $ctrl.klayOptions = klayOptions;
  scxmlTestPairs.then(function(tests){
      $ctrl.allTestPairs = tests;
      console.log('$ctrl.allTestPairs', $ctrl.allTestPairs);
      $ctrl.testPair = $window.localStorage[$ctrl.name + '.testPair']  ?  
         tests[tests.map(function(pair){return pair[0]}).indexOf($window.localStorage[$ctrl.name + '.testPair'])] : 
         $ctrl.allTestPairs[0];
  });

  var listener, sc;
  $ctrl.startOrStopMachine = function($event){
    $event.preventDefault();
    $event.stopPropagation();
    
    if(!$ctrl.sc){
      startMachine();
    }else{
      stopMachine();
    }
  };

  function stopMachine(){
    //dispose the state machine
    $ctrl.sc.unregisterListener(listener);
    listener = null;
    $ctrl.sc = null;
    $scope.$broadcast('scxml.sim.machine.stop');
  }

  function startMachine(cb){
    //start scion
    scxml.urlToModel('/' + $ctrl.testPair[0],function(err,model){

      if(err) throw err;

      model.prepare(function(err, fnModel) {

        if(err) throw err;

        //instantiate the interpreter
        $ctrl.sc = new $window.scxml.scion.Statechart(fnModel);

        listener = {
          onEntry: function(stateId) { 
            $scope.$broadcast('scxml.sim.onEntry', stateId);
          },
          onExit: function(stateId) { 
            $scope.$broadcast('scxml.sim.onExit', stateId);
          },
          onTransition: function(sourceStateId, targetIds) {
            $scope.$broadcast('scxml.sim.onTransition', [sourceStateId, targetIds]);
          }
        };
        $ctrl.sc.registerListener(listener);

        //start the interpreter
        $ctrl.sc.start();

        $scope.$apply(function(){
          if(cb) cb($ctrl.sc);
        });
      });
    })
  }

  $ctrl.runTestScript = function(){
    var test = $ctrl.testPair[1];
    if(!test) return;

    if($ctrl.sc){
      stopMachine();
    }

    startMachine(runTest.bind(this, test));
  };

  function runTest(test, sc){
    //TODO: run tests on this
    if(!test) return;
    checkConfiguration(sc, test.initialConfiguration);
    var events = test.events.slice();
    function nextStep(event){
      sc.gen(event.event);
      checkConfiguration(sc, event.nextConfiguration);
    }
    function poll(){
      var event = events.shift();
      if(event){
        nextStep(event)
        setTimeout(poll, 250);
      }
    }

    setTimeout(poll, 250);
  }

  function checkConfiguration(sc, expectedConfiguration){
    var actualConfiguration = sc.getConfiguration()
    var pass = expectedConfiguration.every(function(s){
        return actualConfiguration.indexOf(s) > -1;
    });
    if(!pass){
      return console.error('Unexpected initial configuration');
    }
  }

  $ctrl.formatTestScript = function(testScript){
    if(testScript) return JSON.stringify(testScript,4,4);
  };

  $ctrl.sendEvent = function($event){
    $event.preventDefault();
    $event.stopPropagation();
    if($ctrl.event) $ctrl.sc.gen($ctrl.event);
    $ctrl.event = '';
  };
  
  $scope.$watch('$ctrl.testPair',function(){
    if($ctrl.testPair) $window.localStorage[$ctrl.name + '.testPair'] = $ctrl.testPair[0];
  });
}
