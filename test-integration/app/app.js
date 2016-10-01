angular.module('schviz2', ['schviz2.testViz']).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viz'});
}]).
run(function($rootScope, $location){
    $rootScope.$location = $location;
    $rootScope.links = [
      [ '#!/viz','Viz' ],
      [ '#!/merge','Merge' ],
      [ '#!/sim','Sim' ]
    ];
});
