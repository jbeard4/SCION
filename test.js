(function(){
window.jQuery.getJSON('./test/scion-core/test/tests.json', init);


var options = {
    right: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      borderSpacing : 10,
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
};

function init(tests){

  var schviz = new window.SCHVIZ('#svg');

  var select = $('#select-layout');
  select.html(Object.keys(options).map(function(k){return '<option value="' + k + '">' + k + '</option>';}).reduce(function(a,b){return a + b;},''));
  select.on('change',function(){
    schviz.updateKgraph(cachedKgraphRoot, options[select.val()]);
  }); 

  var selectExample = $('#select-example');
  selectExample.on('change',initExample); 
  selectExample.html(tests.map(function(k){return '<option value="' + k + '">' + k + '</option>';}).reduce(function(a,b){return a + b;},''));

  var cachedKgraphRoot;
  function initExample(){
    var testUrl = './test/scion-core/test/' + selectExample.val().split('/').slice(1).join('/');
    if(testUrl.indexOf('.json') > -1){
      window.jQuery.get({
        url : testUrl,
        dataType : 'json',
        complete : function(response){
          cachedKgraphRoot = schviz.renderSCJSON(response.responseJSON, options[select.val()]);
        },
        error : function(){
          console.error(arguments);
        } 
      });
    }else{
      window.jQuery.get({
        url : testUrl,
        dataType : 'text',
        complete : function(response){
          var module = {};
          var scjsonExample = eval(response.responseText)();
          cachedKgraphRoot = schviz.renderSCJSON(scjsonExample, options[select.val()]);
        },
        error : function(){
          console.error(arguments);
        } 
      });
    }
  }

  initExample();
}

})();
