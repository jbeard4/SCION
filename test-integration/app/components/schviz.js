angular.module('schviz2.viz', []).component('schviz', {
  template: '<svg xmlns="http://www.w3.org/2000/svg" id="svg" width="100%" height="100%" ng-dblclick="$ctrl.openInNewWindow()">',
  controller: SCHVIZController,
  bindings: {
    modelUrl : '<',
    layout : '<'
  }
});


function SCHVIZController($element, $scope, $http){

  var schviz = new window.SCHVIZ($element.find('svg')[0]);

  var cachedKgraphRoot;

  var $ctrl = this;
  $scope.$watch('$ctrl.layout',function(){
    if(cachedKgraphRoot) schviz.updateKgraph(cachedKgraphRoot, $ctrl.layout);
  });

  $scope.$watch('$ctrl.modelUrl', initExample);

  function initExample(){
    var testUrl = $ctrl.modelUrl;

    console.log('testUrl ', testUrl );

    if(!testUrl) return;

    $http.get(testUrl).then(function(response){
        console.log('response', response);
        var contentType = response.headers('content-type');
        switch(contentType){
          case 'application/scxml+xml':
          case 'text/xml':
          case 'application/xml':
            doLayout(scxml.ext.compilerInternals.scxmlToScjson(response.data));
            break;
          case 'application/json':
            doLayout(response.data);
            break;
          default:
            throw new Error('Unrecognized mime type in response');
            break;
        }
    });
  }

  function doLayout(scjson){
    //this is so we can do queries on him later. 
    var layout = JSON.parse(JSON.stringify($ctrl.layout));
    delete layout.$$hashKey; 
    cachedKgraphRoot = schviz.renderSCJSON(scjson, layout);
  }

  $ctrl.openInNewWindow = function(){
    var svgText = $element[0].innerHTML;

    $http.get('app/css/styles.css').then(function(response){
      var s = 'data:image/svg+xml;charset=US-ASCII,' + 
        encodeURIComponent(
          svgText.replace('<defs></defs>', '<defs><style type="text/css"><![CDATA[' + response.data + ']]></style></defs>')
        );
      console.log('s',s);
      window.open(s); 
    });
  }
}
