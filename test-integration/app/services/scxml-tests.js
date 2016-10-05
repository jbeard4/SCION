
angular.module('schviz2.service',['schviz2.constants'])
  .service('allTests', function($http, $q, scxmlExamples){
    var scionCoreBaseUrl= '/node_modules/scion-core/test/tests/';
    return $q.all([
      $http.get('/scxml-tests').then(function(response){
        return response.data.map(function(pair){ return '/' + pair[0]; });
      }),
      $http.get(scionCoreBaseUrl+ 'tests.json').then(function(response){
          return response.data.map(function(testUrl){ return scionCoreBaseUrl + testUrl;});
      })
    ]).then(function(responses){
      var scxmlTestUrls = responses[0],
          jsonTestUrls = responses[1];
      return scxmlTestUrls.concat(jsonTestUrls).concat(scxmlExamples);
    });
  });
