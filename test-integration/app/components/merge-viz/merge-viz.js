angular.module('schviz2.mergeViz', ['schviz2.constants']).component('mergeViz', {
  templateUrl: 'app/components/merge-viz/merge-viz.html',
  controller: MergeSCHVIZController,
  bindings: {
    sourceScjson : '<'
    ,targetScjson : '<'
    ,klayOptions : '<'
  }
});


function MergeSCHVIZController($element, $scope, $http, klayOptions){

  var schviz = new window.SCHVIZ($element.find('svg')[0]);

  var $ctrl = this;
  //$scope.$watch('$ctrl.layout',function(){
  //  if($ctrl.scjson) schviz.updateLayout($ctrl.scjson, $ctrl.layout, function(){
  //    console.log('finished layout');
  //  });
  //});

  $scope.$watch('$ctrl.sourceScjson',function(sourceScjson){
    console.log('sourceScjson', sourceScjson);
  });

  $scope.$watch('$ctrl.targetScjson',function(targetScjson){
    //render target
    if(targetScjson) render(targetScjson); 
  });

  $ctrl.merge = merge;

  function merge(){
    var layout = JSON.parse(JSON.stringify(klayOptions.right));
    delete layout.$$hashKey; 
    schviz.updateSCJSON($ctrl.targetScjson, $ctrl.sourceScjson, layout, function(){
      console.log('update complete');
    });
  }

  function render(scjson){
    //this is so we can do queries on him later. 
    var layout = JSON.parse(JSON.stringify(klayOptions.right));
    delete layout.$$hashKey; 
    console.log('scjson', scjson, 'layout', layout);
    schviz.renderSCJSON(scjson, layout);
  }
}
