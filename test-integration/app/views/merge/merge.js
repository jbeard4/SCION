'use strict';

angular.module('schviz2.testMerge', ['schviz2.testViz'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/merge', {
    templateUrl: 'app/views/merge/merge.html',
    controller: 'VizCtrl',
    controllerAs: '$ctrl'
  });
}])
