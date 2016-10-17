'use strict';

angular.module('schviz2.testViz', ['ngRoute', 'schviz2.components.selectViz'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viz', {
    templateUrl: 'app/views/viz/viz.html',
    controller: 'VizCtrl',
    controllerAs: '$ctrl'
  });
}])

.controller('VizCtrl', function() {});
