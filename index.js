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
    ANIM_DURATION = 250;
    
function init(klayExample){

  $(document).keypress(handleKeypress);

  s = Snap("#svg");

  var select = $('#select-layout');
  select.on('change',layout); 
  select.html(Object.keys(options).map(function(k){return '<option value="' + k + '">' + k + '</option>';}).reduce(function(a,b){return a + b;},''));

  function layout(){

    applyInitialCoordinates(klayExample);

    var graph;
    $klay.layout({
      graph : klayExample,
      options : options['auto'],
      success : function(g){ 
        graph = g;
      }
    });

    render(graph);
  }

  layout();
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



function render(graphRoot){
  s.attr('viewBox','0 0 ' + graphRoot.width + ' ' + graphRoot.height);
  if(!graphRoot._displayNode){
    var group = s.group();
    var rect = group.rect(graphRoot.x, graphRoot.y, graphRoot.width, graphRoot.height);

    graphRoot._displayNode = group;
    group.addClass('node');
    group.addClass('compound');
  } else {
    //animate
    var rect = graphRoot._displayNode.select('rect');
    rect.animate({x : graphRoot.x, y: graphRoot.y, width : graphRoot.width, height : graphRoot.height}, ANIM_DURATION);
  }

  graphRoot.children.forEach(renderGraphNode.bind(this,graphRoot));
  graphRoot.edges.forEach(renderEdge.bind(this,graphRoot));
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
    graphNode.edges.forEach(renderEdge.bind(this,graphNode));
  }
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
