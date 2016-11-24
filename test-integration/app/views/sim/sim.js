'use strict';

angular.module('schviz2.testSim', ['ngRoute', 'schviz2.components.selectSim'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sim', {
    templateUrl: 'app/views/sim/sim.html',
    controller: 'SimCtrl',
    controllerAs: '$ctrl'
  });
}])

.controller('SimCtrl', function() {});
