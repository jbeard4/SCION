jQuery.getJSON('./example.klay.json', init)

var options = {
    fix: {
      algorithm: "de.cau.cs.kieler.fixed",
      layoutHierarchy: false
    },
    auto: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
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
    },
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
    }
};


var s,
  graphNodeToSnapNodeIdMap,
  snapNodeToGraphNodeIdMap;
    
function init(klayExample){

  // If you want to create new surface just provide dimensions
  // like s = Snap(800, 600);
  s = Snap("#svg");
  // Lets create big circle in the middle:
  //var bigCircle = s.circle(150, 150, 100);
  // By default its black, lets change its attributes
  //bigCircle.attr({
  //    fill: "#bada55",
  //    stroke: "#000",
  //    strokeWidth: 5
  //});
  // Now lets create another small circle:
  //var smallCircle = s.circle(100, 150, 70);

  console.log('$klay',$klay,'klayExample',klayExample );

  graphNodeToSnapNodeIdMap = {};
  snapNodeToGraphNodeIdMap = {};

  var graph;
  $klay.layout({
    graph : klayExample,
    options : options.auto,
    success : function(g){ 
      graph = g;
    }
  });

  render(graph);
}



function render(graphRoot){
  var group = s.group();
  var rect = group.rect(graphRoot.x, graphRoot.y, graphRoot.width, graphRoot.height, 10, 10);

  //graphNodeToSnapNodeIdMap[graphRoot.id] = rect;
  graphRoot._displayNode = group;
  group.addClass('compound');

  graphRoot.children.forEach(renderGraphNode.bind(this,graphRoot));
  graphRoot.edges.forEach(renderEdge.bind(this,graphRoot));
}


function renderGraphNode(parentGraphNode, graphNode){

  var group = parentGraphNode._displayNode.group();
  var label = group.text();
  var rect = group.rect(0, 0, graphNode.width, graphNode.height, 10, 10);
  group.transform('t' + graphNode.x + ',' + graphNode.y); 
  // By default its black, lets change its attributes
  group.addClass(graphNode.children ? 'compound' : 'leaf');

  //TODO: create an SVG G element
  //TODO: create an SVG text element

  //TODO: render leaf nodes differently. 
  
  //render node
  //graphNodeToSnapNodeIdMap[graphNode.id] = group;
  graphNode._displayNode = group;

  if(graphNode.children){
    graphNode.children.forEach(renderGraphNode.bind(this,graphNode));
  }

  if(graphNode.edges){
    graphNode.edges.forEach(renderEdge.bind(this,graphNode));
  }
}

function renderEdge(parentGraphNode, edge){
  var points = 
    [edge.sourcePoint.x, edge.sourcePoint.y].concat(
      (edge.bendPoints ? edge.bendPoints.map(function(bp){
        return [ bp.x, bp.y ];
      }).reduce(function(a,b){
        return a.concat(b);  
      },[]) : []).concat([edge.targetPoint.x, edge.targetPoint.y]));
  console.log('points', points);
  var path = parentGraphNode._displayNode.polyline(points);

  edge._displayNode = path;

  path.addClass('link');

  //graphNodeToSnapNodeIdMap[edge.id] = path;
  
}
