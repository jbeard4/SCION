jQuery.getJSON('./test/scion-core/test/tests.json', init)


var options = {
    /*
    fix: {
      algorithm: "de.cau.cs.kieler.fixed",
      layoutHierarchy: false
    },
    */
    auto: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 20,
      borderSpacing : 20,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
    },
    layer: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      cycleBreaking: "INTERACTIVE",
      nodeLayering: "INTERACTIVE",
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


var s,
    root,
    ANIM_DURATION = 250;
    
function init(tests){

  $(document).keypress(handleKeypress);

  s = Snap("#svg");
  root = s.group();

  var select = $('#select-layout');
  select.on('change',function(){
    layout(cachedKgraphRoot);
  }); 
  select.html(Object.keys(options).map(function(k){return '<option value="' + k + '">' + k + '</option>';}).reduce(function(a,b){return a + b;},''));

  var selectExample = $('#select-example');
  selectExample.on('change',initExample); 
  selectExample.html(tests.map(function(k){return '<option value="' + k + '">' + k + '</option>';}).reduce(function(a,b){return a + b;},''));

  var cachedExample,
      cachedKgraphRoot;
  function initExample(){
    var testUrl = './test/scion-core/test/' + selectExample.val().split('/').slice(1).join('/');
    if(testUrl.indexOf('.json') > -1){
      jQuery.get({
        url : testUrl,
        dataType : 'json',
        complete : function(response){
          initScjsonExample(response.responseJSON);
        },
        error : function(){
          console.error(arguments);
        } 
      });
    }else{
      jQuery.get({
        url : testUrl,
        dataType : 'text',
        complete : function(response){
          var module = {};
          var scjsonExample = eval(response.responseText)();
          initScjsonExample(scjsonExample); 
        },
        error : function(){
          console.error(arguments);
        } 
      });
    }
  }

  function initScjsonExample(scjsonExample){
    cachedExample = scjsonExample; 

    normalizeStateIds(scjsonExample);
    scjsonExample.id = 'root';
    cachedKgraphRoot = scjsonStateToKlayNode(scjsonExample, scjsonExample);
    applyInitialCoordinates(cachedKgraphRoot);

    console.log('scjsonExample',scjsonExample);
    console.log('kgraphRoot',cachedKgraphRoot );
    root.clear();
    layout(cachedKgraphRoot); 
  }

  function layout(kgraphRoot){
    var graph;
    $klay.layout({
      graph : kgraphRoot,
      options : options[select.val()],
      success : function(g){ 
        graph = g;
      }
    });

    render(graph);
  }

  initExample();
}

function measureTextDimensions(text){
  var text = s.text(0,0,text);
  var bbox = text.getBBox();
  text.remove(); 
  return bbox; 
}

function scjsonStateToKlayNode(parentState, state){

  var bbox = measureTextDimensions(state.id);

  //TODO: edges
  //TODO: elminiate padding between child substates
  //render width/height, measure
  state._klayNode = {
    "id" : state.id,
    "labels" : [ { text : state.id || '' } ],
    "edges" : [],
    "width" : bbox.width,
    "height" : bbox.height
  };
  if(state.transitions){
    parentState._klayNode.edges.push.apply(parentState._klayNode.edges, 
      state.transitions.filter(function(transition){return transition.target})
        .map(function(transition){
          return {
            id : state.id + '_' + transition.target,
            source : state.id,
            target : transition.target,
            labels : [ { text : transition.event || ''} ]
          };
        }));
  }
  if(state.states){
    state._klayNode.children = state.states.map(scjsonStateToKlayNode.bind(this,parentState));
  }

  return state._klayNode;
}

function clearBendpoints(parent) {
  if (parent.edges) {
    parent.edges.forEach(function(e) {
      e.sourcePoint = {x:0, y:0};
      e.targetPoint = {x:0, y:0};
      e.bendPoints = [];
    });
  }
  if (parent.children) {
    parent.children.forEach(function(c) {
      clearBendpoints(c);
    });
  }
}

function applyInitialCoordinates(parent) {
  if (parent.children) {
    parent.children.forEach(function(c) {
   
      if (c.properties && c.properties["de.cau.cs.kieler.position"]) {
        var position = c.properties["de.cau.cs.kieler.position"].split(",");
        c.x = parseInt(position[0]);
        c.y = parseInt(position[1]);
      } else {
        c.x = 0;
        c.y = 0;
      }
   
      applyInitialCoordinates(c);
    });
  }
}


var allEdges, idMap;

function populateIdMap(graphRoot){

  idMap = {};
  function walk(graphNode){
    idMap[graphNode.id] = graphNode;
    if(graphNode.children) graphNode.children.forEach(walk);
  }

  walk(graphRoot);
  
}

var generatedIdCount = 0;

function normalizeStateIds(scjson){
  function walk(node){
    node.id = node.id || ('$generated-' + generatedIdCount++);
    if(node.states) node.states.forEach(walk);
  }
  walk(scjson);
}

function render(graphRoot){
  allEdges = [];
  populateIdMap(graphRoot);
  s.attr('viewBox','0 0 ' + graphRoot.width + ' ' + graphRoot.height);

  if(!graphRoot._displayNode){
    var group = root.group();
    var rect = group.rect(graphRoot.x, graphRoot.y, graphRoot.width, graphRoot.height);

    graphRoot._displayNode = group;
    group.addClass('node');
    group.addClass('compound');
  } else {
    //animate
    var rect = graphRoot._displayNode.select('rect');
    rect.animate({x : graphRoot.x, y: graphRoot.y, width : graphRoot.width, height : graphRoot.height}, ANIM_DURATION);
  }

  if(graphRoot.edges){
    allEdges.push.apply(allEdges, graphRoot.edges);
  }

  graphRoot.children.forEach(renderGraphNode.bind(this,graphRoot));
   
}

var selectedNode;

function selectNode(group){
  if(selectedNode){
    selectedNode.removeClass('selected');
  } 
  
  //deselect others
  group.addClass('selected');
  selectedNode = group;
}

function handleKeypress(e){
  console.log('keypress',e.which);
}

function renderGraphNode(parentGraphNode, graphNode){

  if(!graphNode._displayNode){
    var group = parentGraphNode._displayNode.group();
    var rect = group.rect(0, 0, graphNode.width, graphNode.height);
    var label = group.text(2.5, 6.5, graphNode.id);
    label.attr('font-size','4px');
    group.transform('t' + graphNode.x + ',' + graphNode.y); 
    // By default its black, lets change its attributes
    group.addClass('node');
    group.addClass(graphNode.children ? 'compound' : 'leaf');

    graphNode._displayNode = group;

    group.click(function(e){
      e.preventDefault();
      e.stopPropagation();
      selectNode(group);
    });
  } else {
    //animate
    graphNode._displayNode.animate({transform : 't' + graphNode.x + ',' + graphNode.y}, ANIM_DURATION);
    graphNode._displayNode.select('rect').animate({width : graphNode.width, height : graphNode.height},ANIM_DURATION);
  }

  if(graphNode.children){
    graphNode.children.forEach(renderGraphNode.bind(this,graphNode));
  }

  if(graphNode.edges){
    //add this node's edges to allEdges
    allEdges.push.apply(allEdges, graphNode.edges);

    //add matching edges
    allEdges.filter(function(edge){
      return graphNode.id === edge.source
    }).forEach(function(edge){
      if( isSourceAncestorOfTarget(edge.source, edge.target) ){
        renderEdge(graphNode, edge);
      } else {
        renderEdge(parentGraphNode, edge);
      }

      //remove edge from allEdges
      allEdges.splice(allEdges.indexOf(edge), 1);
    });
  }
}

function isSourceAncestorOfTarget(sourceId, targetId){
  var foundTargetInSourceDescendants = false;
  function walk(currentNode){
    foundTargetInSourceDescendants = currentNode.id === targetId;
    if(foundTargetInSourceDescendants) return;
    else if(currentNode.children) currentNode.children.forEach(walk);
  }

  var sourceNode = idMap[sourceId];
  if(sourceNode.children) sourceNode.children.forEach(walk);
  return foundTargetInSourceDescendants; 
}

function renderEdge(parentGraphNode, edge){
  var d = 
    'M' + edge.sourcePoint.x + ' ' + edge.sourcePoint.y + ' ' +
      (edge.bendPoints ? edge.bendPoints.map(function(bp){
        return 'L' +  bp.x + ' ' + bp.y + ' ';
      }).reduce(function(a,b){
        return a + b;  
      },'') : '') + 
      ' L' + edge.targetPoint.x + ' ' + edge.targetPoint.y;
  if(!edge._displayNode){
    var path = parentGraphNode._displayNode.path(d);
    path.addClass('link');

    edge._displayNode = path;
  } else {
    if(edge._displayNode.numberOfItems == ((edge.bendPoints ? edge.bendPoints.length : 0) + 2)){
      //animate
      edge._displayNode.animate({d : path}, ANIM_DURATION)
    } else {
      //remove and rebuild
      edge._displayNode.remove();
      var path = parentGraphNode._displayNode.path(d);
      path.addClass('link');
      edge._displayNode = path;
    }
  }
}
