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
    
    if(!$ctrl.isStarted){
      //start scion
      scxml.urlToModel('/' + $ctrl.testPair[0],function(err,model){

        if(err) throw err;

        model.prepare(function(err, fnModel) {

          if(err) throw err;

          //instantiate the interpreter
          sc = new $window.scxml.scion.Statechart(fnModel);

          listener = {
            onEntry: function(stateId) { 
              $scope.$broadcast('scxml.sim.onEntry', stateId);
            },
            onExit: function(stateId) { 
              $scope.$broadcast('scxml.sim.onExit', stateId);
            },
            onTransition: function(sourceStateId, targetIds) {
              $scope.$broadcast('scxml.sim.onTransition', sourceStateId, targetIds);
            }
          };
          sc.registerListener(listener);

          //start the interpreter
          sc.start();

          $scope.$apply(function(){
            $ctrl.isStarted = true;
          });
        });
      })
    }else{
      //dispose the state machine
      sc.unregisterListener(listener);
      $ctrl.isStarted = false;
      listener = null;
      sc = null;
    }
  };

  $ctrl.sendEvent = function($event){
    $event.preventDefault();
    $event.stopPropagation();
    if($ctrl.event) sc.gen($ctrl.event);
    $ctrl.event = '';
  };
  
  $scope.$watch('$ctrl.testPair',function(){
    if($ctrl.testPair) $window.localStorage[$ctrl.name + '.testPair'] = $ctrl.testPair[0];
  });
}
