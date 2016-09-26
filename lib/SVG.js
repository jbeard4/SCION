var constants = require('./constants'),
    Snap = require('snapsvg'),
    pathseg = require('pathseg'),
    $ = require('jquery');


function SVGRenderer(parentNode, kgraphUtil){
  this._s = window.Snap(parentNode);
  this._root = this._s.group();
  this._initDefs(this._s.node);
  this._generatedIdCount = 0;
  this._kgraphUtil = kgraphUtil;
}

SVGRenderer.prototype = {
  clear : function(){
    this._root.clear();
  },

  highlightState : function(stateId){
    $(this._s.node.getElementById(stateId)).addClass('highlighted');
  },

  unhighlightState : function(stateId){
    $(this._s.node.getElementById(stateId)).removeClass('highlighted');
  },

  highlightTransition : function(sourceStateId, targetStateIds){
    var node = $(this._s.node.getElementById(sourceStateId + '->' + targetStateIds[0]));
    node.addClass('highlighted');
    //TODO: listen for animation end event
    setTimeout(function(){
      node.removeClass('highlighted');
    },250);
  },

  _initDefs : function(svg){

    var SVGNS = 'http://www.w3.org/2000/svg';
    var defs = document.createElementNS(SVGNS,'defs'); 
    var marker = document.createElementNS(SVGNS,'marker'); 
    var path = document.createElementNS(SVGNS,'path'); 
    marker.setAttributeNS(null, 'id','end');
    marker.setAttributeNS(null, 'viewBox','0 -5 10 10');
    marker.setAttributeNS(null, 'refX','10');
    marker.setAttributeNS(null, 'refY','0');
    marker.setAttributeNS(null, 'markerWidth','3');
    marker.setAttributeNS(null, 'markerHeight','5');
    marker.setAttributeNS(null, 'orient','auto');
    path.setAttributeNS(null, 'd', 'M0,-5L10,0L0,5');

    svg.appendChild(defs);
    defs.appendChild(marker);
    marker.appendChild(path);
  },

  //TODO: update

  measureTextDimensions : function (text){
    var txt = this._s.text(0,0,text);
    var bbox = txt.getBBox();
    txt.remove(); 
    return bbox; 
  },

  render : function(graphRoot){
    this._allEdges = [];
    this._s.attr('viewBox','0 0 ' + graphRoot.width + ' ' + graphRoot.height);

    if(!graphRoot._displayNode){
      var group = this._root.group();
      var rect = group.rect(graphRoot.x, graphRoot.y, graphRoot.width, graphRoot.height);

      graphRoot._displayNode = group;
      group.addClass('node');
      group.addClass('compound');
    }

    if(graphRoot.edges){
      this._allEdges.push.apply(this._allEdges, graphRoot.edges);
    }

    graphRoot.children.forEach(this._renderGraphNode.bind(this,graphRoot));
     
  },

  _selectNode : function(group){
    if(this._selectedNode){
      this._selectedNode.removeClass('selected');
    } 
    
    //deselect others
    group.addClass('selected');
    this._selectedNode = group;
  },

  _renderGraphNode : function(parentGraphNode, graphNode){

    if(!graphNode._displayNode){
      var isLeaf = !graphNode.children;
      var group = parentGraphNode._displayNode.group();
      group.node.setAttributeNS(null,'id',graphNode.id);    //tag him with state id
      var rect = group.rect(0, 0, graphNode.width, graphNode.height).attr({rx : 2, ry : 2});
      var textX = isLeaf ? graphNode.width / 2 : constants.LEAF_NODE_PADDING_W;
      var textY = isLeaf ? graphNode.height / 2 : constants.LEAF_NODE_PADDING_H;
      var label = group.text(textX, textY, graphNode.id);
      group.transform('t' + graphNode.x + ',' + graphNode.y); 
      // By default its black, lets change its attributes
      group.addClass('node');
      group.addClass(isLeaf ? 'leaf' : 'compound');

      if(graphNode.$type){
        group.addClass(graphNode.$type);
      }

      graphNode._displayNode = group;

      group.click(function(e){
        e.preventDefault();
        e.stopPropagation();
        this._selectNode(group);
      }.bind(this));
    } else {
      //animate
      graphNode._displayNode.animate({transform : 't' + graphNode.x + ',' + graphNode.y}, constants.ANIM_DURATION);
      graphNode._displayNode.select('rect').animate({width : graphNode.width, height : graphNode.height}, constants.ANIM_DURATION);
    }

    if(graphNode.children){
      graphNode.children.forEach(this._renderGraphNode.bind(this,graphNode));
    }

    if(graphNode.edges){
      //add this node's edges to allEdges
      this._allEdges.push.apply(this._allEdges, graphNode.edges);

      //add matching edges
      this._allEdges.filter(function(edge){
        return graphNode.id === edge.source;
      }).forEach(function(edge){
        if( this._kgraphUtil.isSourceAncestorOfTarget(edge.source, edge.target) ){
          this._renderEdge(graphNode, edge);
        } else {
          this._renderEdge(parentGraphNode, edge);
        }

        //remove edge from allEdges
        this._allEdges.splice(this._allEdges.indexOf(edge), 1);
      }.bind(this));
    }
  },

  _renderEdge : function(parentGraphNode, edge){
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
      if(edge.$type) path.addClass(edge.$type);

      edge._displayNode = path;
      path.node.setAttributeNS(null, 'id', edge.source + '->' + edge.target);
    } else {
      if(edge._displayNode.numberOfItems == ((edge.bendPoints ? edge.bendPoints.length : 0) + 2)){
        //animate
        edge._displayNode.animate({d : path}, constants.ANIM_DURATION);
      } else {
        //remove and rebuild
        edge._displayNode.remove();
        path = parentGraphNode._displayNode.path(d);
        path.addClass('link');
        edge._displayNode = path;

        if(edge.$type) path.addClass(edge.$type);
      }
    }

    if(edge.labels && edge.labels.length){
      edge.labels.forEach(function(label){

        //fix edge label coordinates. Workaround for issue OpenKieler/klayjs#8
        if(edge.source === edge.target){
          //debugger;
          label.x = edge.bendPoints[1].x;
          label.y = edge.bendPoints[1].y;
          label.textAnchor = 'end';

          //does the self edge loop up or down?
          if(edge.bendPoints[0].y < edge.bendPoints[1].y){
            //line has positive slope
            //goes below the slope
            label.dominantBaseline = 'text-before-edge';
          }else {
            //line has negative slope
            //goes above the slope
            label.dominantBaseline = 'text-after-edge';
          }
        }

        //render labels
        if(!label._displayNode){
          label._displayNode = parentGraphNode._displayNode.text(label.x, label.y, label.text);
          label._displayNode.addClass('edge-label');
        }else{
          //update label displayNode
          label._displayNode.animate({x: label.x, y : label.y});
        }
      });
    }
  }
}

module.exports = SVGRenderer;
