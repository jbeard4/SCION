var constants = require('./constants'),
    Snap = require('snapsvg'),
    pathseg = require('pathseg'),
    _ = require('underscore'),
    $ = require('jquery');


function SVGRenderer(parentNode, kgraphUtil){
  this._s = window.Snap(parentNode);
  this._root = this._s.group();
  this._initDefs(this._s.node);
  this._generatedIdCount = 0;
  this._kgraphUtil = kgraphUtil;
  this._kgraphNodeToSVGNode = new Map();
  this._cachedKGraphNodeChildren = new Map();
  this._cachedKGraphNodeEdges = new Map();
  this._cachedKGraphEdgeLabels = new Map();
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

    //enter graph root
    if(!this._kgraphNodeToSVGNode.has(graphRoot)){
      var group = this._root.group();
      var rect = group.rect(graphRoot.x, graphRoot.y, graphRoot.width, graphRoot.height);

      this._kgraphNodeToSVGNode.set(graphRoot,group);
      group.addClass('node');
      group.addClass('compound');
    }

    
    if(graphRoot.edges){
      this._allEdges.push.apply(this._allEdges, graphRoot.edges);
    }

    //perform exit animation
    this._exitNodeChildren(graphRoot);
    this._exitEdges(graphRoot);

    graphRoot.children.forEach(this._renderGraphNode.bind(this,graphRoot));
     
  },

  //trigger exit animation
  _exitNodeChildren : function(node){
    this._exitKGraphObject(node, 'children');
  },

  _exitEdges : function(node){
    this._exitKGraphObject(node, 'edges');
  },

  _exitLabels : function(node){
    this._exitKGraphObject(node, 'labels');
  },

  _exitKGraphObject : function(kgraphNode, property){
    var cache;
    switch(property){
      case 'children': 
        cache = this._cachedKGraphNodeChildren;
        break;
      case 'edges': 
        cache = this._cachedKGraphNodeEdges;
        break;
      case 'labels': 
        cache = this._cachedKGraphEdgeLabels;
        break;
      default :
        break;
    }

    var nodesToExit = _.difference(cache.get(kgraphNode) || [], kgraphNode[property]);

    //recurse on sub-properties
    if(property === 'children'){
      //recurse on any substates
      nodesToExit.forEach(function(nodeToExit){
        //recurse
        this._exitNodeChildren(nodeToExit);
        this._exitEdges(nodeToExit);
      }, this);
    } else if(property === 'edges'){
      nodesToExit.forEach(function(nodeToExit){
        //recurse
        this._exitLabels(nodeToExit);
      }, this);
    }

    nodesToExit.forEach(function(nodeToExit){
        var svgNode = this._kgraphNodeToSVGNode.get(nodeToExit);
        if(svgNode.exit){
          svgNode.exit();
        }else{
          svgNode.animate({opacity : 0}, constants.ANIM_DURATION, mina.easein, function(){
            svgNode.remove();
          })
        };
    },this);
    
    // bookkeeping
    nodesToExit.forEach(function(node){
        this._kgraphNodeToSVGNode.delete(node);
    }, this);
    cache.set(kgraphNode, (kgraphNode[property] || []).slice());  //keep a copy so that we can animate node exit
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

    var isLeaf = !graphNode.children;
    var labelTextParams = getStateLabelTextParams();
    if(!this._kgraphNodeToSVGNode.has(graphNode)){
      var group = this._kgraphNodeToSVGNode.get(parentGraphNode).group();
      group.node.setAttributeNS(null,'id',graphNode.id);    //tag him with state id
graphNode.width, graphNode.height
      var rect = group.rect(graphNode.width / 2, graphNode.height / 2, 0, 0).attr({rx : 2, ry : 2, strokeWidth : 0});
      var label = group.text.apply(group, labelTextParams).attr({opacity : 0});
      group.transform('t' + graphNode.x + ',' + graphNode.y); 
      // By default its black, lets change its attributes
      group.addClass('node');
      group.addClass(isLeaf ? 'leaf' : 'compound');

      if(graphNode.$type){
        group.addClass(graphNode.$type);
      }

      //start animations
      rect.animate({x : 0, y : 0, width : graphNode.width, height : graphNode.height, strokeWidth : 1}, constants.ANIM_DURATION, mina.bounce);
      label.animate({opacity : 1}, constants.ANIM_DURATION, mina.bounce);

      group.exit = function(){
        rect.animate({x : graphNode.width / 2, y : graphNode.height / 2, width : 0, height : 0, strokeWidth : 0, opacity : 0}, constants.ANIM_DURATION, mina.easein, function(){
          group.remove();
        });
        label.animate({opacity : 0}, constants.ANIM_DURATION, mina.easein);
      };

      this._kgraphNodeToSVGNode.set(graphNode, group);

      //TODO: unregister the event listener on exit
      group.click(function(e){
        e.preventDefault();
        e.stopPropagation();
        this._selectNode(group);
      }.bind(this));
    } else {
      //animate
      var displayNode = this._kgraphNodeToSVGNode.get(graphNode);

      displayNode.select('text')
        .attr({'text': labelTextParams[2]})
        .animate({x : labelTextParams[0], y: labelTextParams[1]}, constants.ANIM_DURATION);
      displayNode.animate({transform : 't' + graphNode.x + ',' + graphNode.y}, constants.ANIM_DURATION);
      displayNode.select('rect').animate({width : graphNode.width, height : graphNode.height}, constants.ANIM_DURATION);
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

    this._exitNodeChildren(graphNode);
    this._exitEdges(graphNode);

    function getStateLabelTextParams(){
      var textX = isLeaf ? graphNode.width / 2 : constants.LEAF_NODE_PADDING_W;
      var textY = isLeaf ? graphNode.height / 2 : constants.LEAF_NODE_PADDING_H;
      return [textX, textY, graphNode.id];
    }
  },

  _computeEdgeLength : function(edge){
    var length = 0;
    var lastPoint = edge.sourcePoint;
    (edge.bendPoints || []).concat(edge.targetPoint).forEach(function(nextPoint){
      length += 
        Math.sqrt(
          Math.pow(nextPoint.y - lastPoint.y, 2) + 
          Math.pow(nextPoint.x - lastPoint.x, 2));

      lastPoint = nextPoint;
    });
    return length;
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
    if(!this._kgraphNodeToSVGNode.has(edge)){
      var length = this._computeEdgeLength(edge);
      var initialD = 
        'M' + edge.sourcePoint.x + ' ' + edge.sourcePoint.y + ' ' +
          (edge.bendPoints ? edge.bendPoints.map(function(bp){
            return 'L' +  edge.sourcePoint.x + ' ' + edge.sourcePoint.y + ' ';
          }).reduce(function(a,b){
            return a + b;  
          },'') : '') + 
          ' L' + edge.sourcePoint.x + ' ' + edge.sourcePoint.y;
      var path = this._kgraphNodeToSVGNode.get(parentGraphNode).path(initialD); //.attr({"strokeDasharray" : length + " " + length, "strokeDashoffset" : length});
      path.addClass('link');
      if(edge.$type) path.addClass(edge.$type);

      path.node.setAttributeNS(null, 'id', edge.source + '->' + edge.target);

      //animate
      path.animate({"d" : d}, constants.ANIM_DURATION, mina.bounce);

      this._kgraphNodeToSVGNode.set(edge, path);
    } else {
      var edgeDisplayNode = this._kgraphNodeToSVGNode.get(edge);
      if(edgeDisplayNode.numberOfItems == ((edge.bendPoints ? edge.bendPoints.length : 0) + 2)){
        //animate
        edgeDisplayNode.animate({d : path}, constants.ANIM_DURATION);
      } else {
        //remove and rebuild
        edgeDisplayNode.remove();
        var parentDisplayNode = this._kgraphNodeToSVGNode.get(parentGraphNode);
        path = parentDisplayNode.path(d);
        path.addClass('link');
        this._kgraphNodeToSVGNode.set(edge, path);

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
        if(!this._kgraphNodeToSVGNode.has(label)){

          var labelDisplayNode = this._kgraphNodeToSVGNode.get(parentGraphNode).text(label.x, -10, label.text).attr({opacity : 0});
          this._kgraphNodeToSVGNode.set(label, labelDisplayNode);
          labelDisplayNode.addClass('edge-label');

          //animate
          labelDisplayNode.animate({opacity : 1}, constants.ANIM_DURATION, mina.easein);
          labelDisplayNode.animate({y : label.y}, constants.ANIM_DURATION, mina.bounce);
        }else{
          //update label displayNode
          var labelDisplayNode = this._kgraphNodeToSVGNode.get(label);
          labelDisplayNode.animate({x: label.x, y : label.y}, constants.ANIM_DURATION);
        }
      }, this);
    }

    this._exitLabels(edge);
  }
}

module.exports = SVGRenderer;
