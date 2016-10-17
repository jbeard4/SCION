'use strict';

angular.module('schviz2.testMerge', ['schviz2.mergeViz'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/merge', {
    templateUrl: 'app/views/merge/merge.html',
    controller: 'MergeCtrl',
    controllerAs: '$ctrl'
  });
}])

.controller('MergeCtrl', function() {
  var $ctrl = this;
  $ctrl.onUpdateSource = function(sourceScjson){
    $ctrl.sourceScjson = sourceScjson;
  };

  $ctrl.onUpdateTarget = function(targetScjson){
    $ctrl.targetScjson = targetScjson;
  };
});
