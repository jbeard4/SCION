angular.module('schviz2.components.selectViz', ['schviz2.service', 'schviz2.constants','schviz2.viz']).component('selectViz', {
  templateUrl: 'app/components/select-viz/select-viz.html',
  controller: SelectVizController,
  bindings: {
    allTests : '<'
    ,onUpdate : '<'
    ,name : '<'
  }
});

function SelectVizController(klayOptions, allTests, $scope, $window){

  var $ctrl = this;
  $ctrl.layout = 'right';
  $ctrl.klayOptions = klayOptions;
  allTests.then(function(tests){
      $ctrl.allTests = tests;
      $ctrl.testUrl = $window.localStorage[$ctrl.name + '.testUrl']  ?  JSON.parse($window.localStorage[$ctrl.name + '.testUrl']) : tests[0];
  });

  
  ['testUrl'].forEach(function(prop){
    
    $scope.$watch('$ctrl.' + prop,function(){
      if($ctrl[prop]) $window.localStorage[$ctrl.name + '.' + prop] = JSON.stringify($ctrl[prop]);
    });
  });
}
