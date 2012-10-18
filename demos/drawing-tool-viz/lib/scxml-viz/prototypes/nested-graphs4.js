var STATE_NAMES = ['scxml','state','parallel','initial','final'];

var BBOX_PADDING = 10,
    INITIAL_LINK_DISTANCE = 20,
    LINK_DISTANCE_PADDING = 10 + BBOX_PADDING * 2;

function generateStronglyConnectedLinks(nodes){
    return nodes.map(function(node){
        return nodes.map(function(node2){
            return {
                source : node,
                target : node2
            };
        });
    }).reduce(function(a,b){return a.concat(b);},[]);
}

function toGraph(graphContainerNode,scxmlNode,parentTick,size){

    console.log('toGraph',graphContainerNode,scxmlNode);

    var bboxes = [], maxDimension = INITIAL_LINK_DISTANCE;

    function updateMaxDimension(dim){
        //console.log('updating max dimension from', maxDimension, 'to',dim); 
        maxDimension = dim;
        force.linkDistance(maxDimension + LINK_DISTANCE_PADDING);
        force.start();
    }

    var childScxmlNodes = d3.selectAll(scxmlNode.childNodes)[0].
                            filter(function(n){return n.nodeType === 1;}).
                            filter(function(n){return STATE_NAMES.indexOf(n.localName) > -1;});

    var links = childScxmlNodes.
            map(function(node){return node.childNodes;}).
            map(function(domNodeList){return Array.prototype.slice.call(domNodeList);}).
            reduce(function(a,b){return a.concat(b);},[]).
            filter(function(node){return node.localName === 'transition';}).
            map(function(transitionNode){return {source : transitionNode.parentNode, target : transitionNode.ownerDocument.getElementById(transitionNode.getAttribute('target'))};});


    console.log('childScxmlNodes',childScxmlNodes);
    console.log('links',links);

    //create the DOM
    var graphContainers = graphContainerNode.selectAll('g.graphContainer').
            data(childScxmlNodes).
        enter().append('g')
                .attr('class','graphContainer');


    var transitionPaths = graphContainerNode.selectAll('path.transition').
            data(links).
        enter().append('path')
                .attr('class','transition')
                .attr("marker-end", function(d) { return "url(#transitionMarker)"; });

    console.log('transitionPaths');
    
    //create the layout
    function tick(){
        graphContainers.attr('transform',function(d) { 
            //console.log(d.x,d.y,d);
            return "translate(" + d.x + "," + d.y + ")"; 
        });

        transitionPaths.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

        bboxRect[0].forEach(function(rect,i){
            var bbox = graphContents[0][i].getBBox();

            var maxDim = Math.ceil(bbox.width > bbox.height ? bbox.width : bbox.height) + LINK_DISTANCE_PADDING;
            if(maxDim > maxDimension){
                //if we're greater than the maxDim, then update the maxDim
                updateMaxDimension(maxDim);
            }else if(maxDim < maxDimension){
                var prevMaxDim = bboxes[i];
                if(prevMaxDim === maxDimension){
                    bboxes[i] = maxDim;     //update here, now, so we can just do Math.max.apply
                    //otherwise, if he had the max dimension, so update the max dimension
                    updateMaxDimension(Math.max.apply(null,bboxes));
                }
            }

            //update bboxes[i]
            bboxes[i] = maxDim;

            //update the bboxRect
            rect.setAttribute('x',bbox.x - BBOX_PADDING);
            rect.setAttribute('y',bbox.y - BBOX_PADDING);
            rect.setAttribute('width',bbox.width + BBOX_PADDING * 2);
            rect.setAttribute('height',bbox.height + BBOX_PADDING * 2);
        });

        if(parentTick) parentTick();
    }

    if(childScxmlNodes.length){

        var force = d3.layout.force()
            .charge(-8000)
            .linkDistance(INITIAL_LINK_DISTANCE)
            .nodes(childScxmlNodes)
            .size(size ? size : [1,1])
            .links(links)
            .on("tick", tick)
            .start();

        graphContainers.call(force.drag);

        var bboxRect = graphContainers.append('rect').attr('class','graphBBox').attr('width',20).attr('height',20).attr('rx',10).attr('ry',10);
        var graphContents = graphContainers.append('g').attr('class','graphContents');

        //recursive call to create children
        graphContainers.each(function(d,i){
            toGraph(d3.select(graphContents[0][i]),d,tick);
        });

    }else{
        //just create a circle for a basic state. this might not quite be correct, though...
        graphContainerNode.append('circle').attr('class','graphContents').attr('r',10);
    }
}

d3.xml('test.scxml','application/xml',function(doc){
    console.log('doc',doc);

    var width = 5000,
        height = 5000;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    //marker
    svg.append("svg:defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
      .enter().append("svg:marker")
        .attr("id", 'transitionMarker')
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    toGraph(svg,doc.documentElement,null,[width,height]);
});

