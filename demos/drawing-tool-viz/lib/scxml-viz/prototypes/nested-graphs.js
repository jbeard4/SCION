function generateRandomGraph(numNodes,linkDensity){

    linkDensity = linkDensity || 1;

    var nodes = d3.range(numNodes).map(Object);
    var links = generateRandomLinkGraph(nodes,linkDensity);

    return {
        nodes : nodes,
        links : links
    };
}

function generateRandomLinkGraph(nodes,linkDensity){
    return nodes.map(function(node){
        return d3.range(linkDensity).map(function(){
            return {
                source : node,
                target :  nodes[Math.round(Math.random() * (nodes.length-1))] 
            };
        });
    }).reduce(function(a,b){return a.concat(b);},[]);
}

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

function makeSubGraph(json,parent,parentTickCb){

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30);

    var g = parent.append('g').attr('class','sub');

    var link = g.selectAll("line.sub")
            .data(json.links)
        .enter().append("line").attr('class','sub');

    var enter = g.selectAll("circle.sub")
            .data(json.nodes)
        .enter();

    console.log('subgraph enter',enter);

    var node = enter.append("circle")
            .attr("r", radius - 0.75).attr('class','sub')
            .call(force.drag);

    console.log('node',node);

    force
        .nodes(json.nodes)
        .links(json.links)
        .on("tick", tick)
        .start();

    function tick() {
        node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

        link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

        parentTickCb();
    }

    console.log('subgraph g',g);

    return g;
}

function makeParentGraph(graphs,parent,parentTickListener,r){

    var INITIAL_LINK_DISTANCE = 20,
        LINK_DISTANCE_PADDING = 10,
        BBOX_PADDING = 10;

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(INITIAL_LINK_DISTANCE)
        .size([width, height]);

    var g = parent.append('g');

    //used to cache bounding boxes to update force.linkDistance
    var bboxes = [], maxDimension = INITIAL_LINK_DISTANCE;

    function updateMaxDimension(dim){
        console.log('updating max dimension from', maxDimension, 'to',dim); 
        maxDimension = dim;
        force.linkDistance(maxDimension + LINK_DISTANCE_PADDING + BBOX_PADDING * 2);
        force.stop();
        force.start();
    }

    var graphNodes = graphs.map(function(graph,i){

        function parentTickListener(){
            //tick listener
            var bbox = subGraphContent.node().getBBox(); 
            //console.log('tick',rect); 
            
            var maxDim = Math.ceil(bbox.width > bbox.height ? bbox.width : bbox.height);
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
            boundingRect.attr("x",bbox.x - BBOX_PADDING); 
            boundingRect.attr("y",bbox.y - BBOX_PADDING); 
            boundingRect.attr("width",bbox.width + BBOX_PADDING * 2); 
            boundingRect.attr("height",bbox.height + BBOX_PADDING * 2); 
        }


        var parentGNode = g.append('g').attr('class','parent');
        var boundingRect = parentGNode.append('rect').attr('class','boundingRect');

        bboxes.push(INITIAL_LINK_DISTANCE);

        //we get back <g> containing module contents
        var subGraphContent = r ? 
                                makeParentGraph(
                                        d3.range(3).map(function(){return generateRandomGraph(5,3);}),
                                        parentGNode,
                                        parentTickListener,
                                        r - 1) : 
                                makeSubGraph(graph,parentGNode,parentTickListener);

        return parentGNode; 
    });
    //var graphNodes = graphs.map(function(graph){return {};});

    console.log('graphNodes',graphNodes);

    var updateNodes = g.selectAll('g.parent')
                        .data(graphNodes);

    //var links = generateRandomLinkGraph(graphNodes,1);
    var links = generateStronglyConnectedLinks(graphNodes);

    console.log('links',links); 

    /*
    var link = g.selectAll("line.parent")
            .data(links)
        .enter().append("line").attr('class','parent');
    */

    updateNodes.call(force.drag);

    force
        .nodes(graphNodes)
        .links(links)
        .on("tick", tick)
        .start();

    function tick() {
        updateNodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        /*
        link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        */

        parentTickListener && parentTickListener();
    }

    return g;
}

var width = 960,
    height = 500,
    radius = 6,
    fill = d3.scale.category20();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//make two subgrpahs

//create an array of graphs
var graphs = d3.range(3).map(function(){return generateRandomGraph(5,3);});
console.log('graphs',graphs);
makeParentGraph(graphs,svg,null,1);
