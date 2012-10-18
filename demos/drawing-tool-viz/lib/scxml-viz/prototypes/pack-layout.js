var STATE_NAMES = ['scxml','state','parallel','initial','final'];

var width = 960,
    height = 960,
    format = d3.format(",d");

function getChildStates(state){
    return d3.selectAll(state.childNodes)[0].
        filter(function(n){return n.nodeType === 1;}).
        filter(function(n){return STATE_NAMES.indexOf(n.localName) > -1;});
}

function getLinksFromStates(childScxmlNodes){
    return childScxmlNodes.
        map(function(node){return node.childNodes;}).
        map(function(domNodeList){return Array.prototype.slice.call(domNodeList);}).
        reduce(function(a,b){return a.concat(b);},[]).
        filter(function(node){return node.localName === 'transition';}).
        map(function(transitionNode){return {source : transitionNode.parentNode, target : transitionNode.ownerDocument.getElementById(transitionNode.getAttribute('target'))};});
}


var pack = d3.layout.pack()
        .size([width - 4, height - 4])
        //.value(function(d) { return 1; })
        .value(function(d) { return d.getAttribute('id').length; })
        .children(getChildStates);

var vis = d3.select('body').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "pack")
    .append("g")
        .attr("transform", "translate(2, 2)");

d3.xml('test.scxml','application/xml',function(doc){

    var nodes = pack.nodes(doc.documentElement);
    var links = getLinksFromStates(nodes);
    pack.links(links);
        
    var node = vis.selectAll("g.node")
            .data(nodes)
        .enter().append("g")
            .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
            .text(function(d) { return d.getAttribute('id'); });

    /*
    node.append("rect")
            .attr("width", function(d) { return d.r * 2; })
            .attr("height", function(d) { return d.r * 2; });
    */

    node.append("circle")
            .attr("r", function(d) { return d.r; });

    node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .text(function(d) { return d.getAttribute('id'); });
});

