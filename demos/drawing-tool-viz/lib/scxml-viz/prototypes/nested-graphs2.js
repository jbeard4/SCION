var STATE_NAMES = ['scxml','state','parallel','initial','final'];

function toGraph(svgParentNode,scxmlNode){
    console.log('toGraph',svgParentNode,scxmlNode);

    //create the DOM
    var graphGroupNode = svgParentNode.append('g').attr('class','graphParent');
    var graphBoundingRectNode = graphGroupNode.append('rect').attr('class','graphBBox').attr('width',20).attr('height',20);
    var graphGroupContentsNode = graphGroupNode.append('g').attr('class','graphContents');

    var update = graphGroupNode.data(scxmlNode);

    console.log('graphGroupNode',graphGroupNode,'update',update);


    //recursive call to create children
    var childScxmlNodes = d3.selectAll(scxmlNode.childNodes)[0].
                            filter(function(n){return n.nodeType === 1;}).
                            filter(function(n){return STATE_NAMES.indexOf(n.localName) > -1;});
    var childGraphNodes = childScxmlNodes.map(toGraph.bind(null,graphGroupContentsNode));    //TODO: aggregate these a bit better
    //debugger;

    //create the layout
    function tick(){
        childGraphNodes.forEach(function(node){
            node.attr('transform',function(d) { 
                console.log(d.x,d.y,d);
                return "translate(" + d.x + "," + d.y + ")"; 
            });
        });
    }

    if(childScxmlNodes.length){
        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .nodes(childScxmlNodes)
            //.links(json.links)    //TODO
            .on("tick", tick)
            .start();
    }

    return update; 
}

d3.xml('test.scxml','application/xml',function(doc){
    console.log('doc',doc);

    var width = 960,
        height = 500;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    toGraph(svg,doc.documentElement);
});
