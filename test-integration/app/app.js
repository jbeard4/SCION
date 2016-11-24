angular.module('schviz2', ['schviz2.testViz', 'schviz2.testMerge', 'schviz2.testSim']).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viz'});
}]).
run(function($rootScope, $location){
    $rootScope.$location = $location;
    $rootScope.links = [
      [ '#!/viz','Viz' ],
      [ '#!/sim','Sim' ]
    ];
});
