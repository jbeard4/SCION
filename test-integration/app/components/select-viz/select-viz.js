angular.module('schviz2.components.selectViz', ['schviz2.service', 'schviz2.constants','schviz2.viz']).component('selectViz', {
  templateUrl: 'app/components/select-viz/select-viz.html',
  controller: SelectVizController,
  bindings: {
    allTests : '<'
    ,onUpdate : '<'
  }
});

function SelectVizController(klayOptions, allTests){

  var $ctrl = this;
  $ctrl.layout = klayOptions.right;
  $ctrl.klayOptions = klayOptions;
  allTests.then(function(tests){
      $ctrl.allTests = tests;
      $ctrl.testUrl = tests[0];
  });
}
