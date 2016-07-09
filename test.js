(function(){
var baseUrl = './bower_components/scion-core/test/tests/';
window.jQuery.getJSON(baseUrl + 'tests.json', init);


var options = {
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
};

function init(tests){

  var schviz = new window.SCHVIZ('#svg');

  var kgraphJsonTextarea = $('#kgraphJson')[0];
  var select = $('#select-layout');
  select.html(Object.keys(options).map(function(k){return '<option value="' + k + '">' + k + '</option>';}).reduce(function(a,b){return a + b;},''));
  select.on('change',function(){
    schviz.updateKgraph(cachedKgraphRoot, options[select.val()]);
  }); 

  var selectExample = $('#select-example');
  selectExample.on('change',initExample); 

  selectExample.html(
    tests.
      map(function(k){return '<option value="' + baseUrl + k + '">' + k + '</option>';}).
    concat([
        'examples/universal-morse-input-output/build/morse.scxml',
        'examples/svg-graphical-modelling-environment-framework/behaviour/default.xml',
        'examples/archive.org-twilio-browser/content/archive.xml'
      ].map(function(k){return '<option value="' + k + '">' + k + '</option>';})
    )
    .reduce(function(a,b){return a + b;},'')
  );

  //cached option, for convenience
  if(window.localStorage.exampleVal){
    selectExample.val(window.localStorage.exampleVal);
  }

  var cachedKgraphRoot;
  function initExample(){
    var exampleVal = selectExample.val(); 
    window.localStorage.exampleVal = exampleVal;
      
    var testUrl = exampleVal;
    if(testUrl.indexOf('.json') > -1){
      window.jQuery.get({
        url : testUrl,
        dataType : 'json',
        complete : function(response){
          kgraphJsonTextarea.value = JSON.stringify(response.responseJSON,4,4); 
          doLayout();
        },
        error : function(){
          console.error(arguments);
        } 
      });
    }
    else if(testUrl.indexOf('.scxml') > -1 || testUrl.indexOf('.xml') > -1){
      scxml.urlToModel(testUrl, function(err, model){
        if(err) throw err;
        console.log('model', model.toString());

        if(testUrl === 'examples/universal-morse-input-output/build/morse.scxml'){
          //setup mock require
          window.require = function(module){
            switch(module){
              case '../morse-code.json' : 
                return {};
              case '../device/util':
                return {};
              case 'mraa':
                return {
                  getVersion : function() { return 'fake' },
                  Gpio : function(){
                    this.dir = function(){}
                  }
                };
              case 'jsupm_grove':
                return {
                  GroveButton : function(){}
                };
              case 'jsupm_i2clcd':
                return {
                  Jhd1313m1 : function (){}
                }
            }
          }
        }

        var scjsonExample = model();

        kgraphJsonTextarea.value = JSON.stringify(scjsonExample,4,4); 
        doLayout();
      })
    }
    else{
      window.jQuery.get({
        url : testUrl,
        dataType : 'text',
        complete : function(response){
          var module = {};
          var scjsonExample = eval(response.responseText)();
          kgraphJsonTextarea.value = JSON.stringify(scjsonExample,4,4); 
          doLayout();
        },
        error : function(){
          console.error(arguments);
        } 
      });
    }
  }

  window.doLayout = function(){
    var optionsVal = select.val();
    var scjsonExample = JSON.parse(kgraphJsonTextarea.value);
    cachedKgraphRoot = schviz.renderSCJSON(scjsonExample, options[optionsVal]);
  }

  initExample();
}

})();

function openInNewWindow(){
  var svgText = $('#svg')[0].parentNode.innerHTML;

  jQuery.get({
    url : 'styles.css',
    dataType : 'text',
    complete : function(response){
      
      var s = 'data:image/svg+xml;charset=US-ASCII,' + 
        encodeURIComponent(
          svgText.replace('<defs></defs>', '<defs><style type="text/css"><![CDATA[' + response.responseText + ']]></style></defs>')
        );
      console.log('s',s);
      window.open(s); 
    },
    error : function(){
      console.error(arguments);
    } 
  });

}

