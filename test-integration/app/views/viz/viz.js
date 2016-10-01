'use strict';

angular.module('schviz2.testViz', ['ngRoute', 'schviz2.viz'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viz', {
    templateUrl: 'app/views/viz/viz.html',
    controller: 'VizCtrl',
    controllerAs: '$ctrl'
  });
}])

.constant('scxmlExamples', [
  '/examples/universal-morse-input-output/build/morse.scxml',
  '/examples/svg-graphical-modelling-environment-framework/behaviour/default.xml',
  '/examples/archive.org-twilio-browser/content/archive.xml'
])

.constant('klayOptions',
{
    right: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      borderSpacing : 10,
      labelSpacing : 1,
      layoutHierarchy: true,
      intCoordinates: true,
      edgeRouting: "ORTHOGONAL"
    },
    auto: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      borderSpacing : 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL"
    },
    layer: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      cycleBreaking: "INTERACTIVE",
      nodeLayering: "INTERACTIVE"
    }/*,
    order: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      crossMin: "INTERACTIVE",
    },
    layerOrder: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      cycleBreaking: "INTERACTIVE",
      nodeLayering: "INTERACTIVE",
      crossMin: "INTERACTIVE",
    }*/
})


.controller('VizCtrl', function($http, $q, scxmlExamples, klayOptions) {

  var $ctrl = this;

  $ctrl.layout = klayOptions.right;

  $ctrl.klayOptions = klayOptions;
  var scionCoreBaseUrl= '/node_modules/scion-core/test/tests/';
  $q.all([
    $http.get('/scxml-tests').then(function(response){
      return response.data.map(function(pair){ return '/' + pair[0]; });
    }),
    $http.get(scionCoreBaseUrl+ 'tests.json').then(function(response){
        return response.data.map(function(testUrl){ return scionCoreBaseUrl + testUrl;});
    })
  ]).then(function(responses){
    var scxmlTestUrls = responses[0],
        jsonTestUrls = responses[1];

    $ctrl.testUrl = scxmlTestUrls[0];
    $ctrl.allTests = scxmlTestUrls.concat(jsonTestUrls).concat(scxmlExamples);
  });

});
