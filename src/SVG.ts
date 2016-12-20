import constants from './constants';
import events from './events';
import pathseg = require('pathseg');
import _ = require('underscore');
import q = require('q');
import $ = require('jquery');

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from './types';

const SVGNS = 'http://www.w3.org/2000/svg';

export default class SVGRenderer{

  private _s: Snap.Paper;
  private _root: Snap.Element;
  private _generatedIdCount:number;
  private _kgraphNodeToSVGNode:Map<KGraphNode, Snap.Element>;
  private _cachedKGraphNodeChildren:Map<KGraphNode, Array<KGraphNode>>;
  private _cachedKGraphNodeEdges:Map<KGraphNode, Array<KGraphEdge>>;
  private _cachedKGraphEdgeLabels:Map<KGraphNode, Array<KGraphLabel>>;
  private _cachedHyperlinkAnimationPromise:Map<KGraphEdge, Q.Promise<KGraphEdge>>;
  private _cachedHyperlinkAnimationDeferred:Map<KGraphEdge, Q.Deferred<KGraphEdge>>;
  private _edgeIdToEdgeMap:Map<string, KGraphEdge>;
  private _firstRender:boolean;
  private _kgraph:KGraph;
  private _allEdges:Array<KGraphEdge>;

  public constructor(parentNode){
    this._s = Snap(parentNode);
    this._root = this._s.group();
    this._initDefs(this._s.node);
    this._generatedIdCount = 0;
    this._kgraphNodeToSVGNode = new Map<KGraphNode, Snap.Element>();
    this._cachedKGraphNodeChildren = new Map<KGraphNode, Array<KGraphNode>>();
    this._cachedKGraphNodeEdges = new Map<KGraphNode, Array<KGraphEdge>>();
    this._cachedKGraphEdgeLabels = new Map<KGraphNode, Array<KGraphLabel>>();
    this._cachedHyperlinkAnimationPromise = null;
    this._cachedHyperlinkAnimationDeferred = null;
    this._edgeIdToEdgeMap = null;
    this._firstRender = true;
  }

  public measureTextDimensions (text){
    var txt = this._s.text(0,0,text);
    var bbox = txt.getBBox();
    txt.remove(); 
    return bbox; 
  }

  public clear(){
    this._s.clear();
    this._firstRender = true;
  }

  public highlightState(stateId){
    $(this._s.node.ownerDocument.getElementById(stateId)).addClass('highlighted');
  }

  public unhighlightState(stateId){
    $(this._s.node.ownerDocument.getElementById(stateId)).removeClass('highlighted');
  }

  public unhighlightAllStates(){
    $(this._s.node).find('.highlighted').removeClass('highlighted');
  }

  public highlightTransition(sourceStateId, targetStateIds){
    if(!targetStateIds) return;
    var node = $(this._s.node.ownerDocument.getElementById(sourceStateId + '->' + (targetStateIds && targetStateIds.length ? targetStateIds[0] : '')));
    node.addClass('highlighted');
    //TODO: listen for animation end event
    setTimeout(function(){
      node.removeClass('highlighted');
    },constants.HIGHLIGHT_ANIM_DURATION);
  }

  private _initDefs(svg){

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

    ['','Highlighted'].forEach(function(idSuffix){
      var radialGradient = document.createElementNS(SVGNS,'radialGradient'); 
      radialGradient.setAttributeNS(null,'id',constants.finalStateGradientId + idSuffix);
      var c = (constants.INITIAL_RADIUS/2).toString();
      var r = (constants.INITIAL_RADIUS/4).toString();
      radialGradient.setAttributeNS(null,'cx',c);
      radialGradient.setAttributeNS(null,'cy',c);
      radialGradient.setAttributeNS(null,'fx',c);
      radialGradient.setAttributeNS(null,'fy',c);
      radialGradient.setAttributeNS(null,'r',r);
      radialGradient.setAttributeNS(null,'gradientUnits','userSpaceOnUse');

      [
        "0",
        "0.85576922",
        "0.85576922",
        "1"
      ].forEach(function(offset){
        var stop = document.createElementNS(SVGNS,'stop'); 
        stop.setAttributeNS(null, 'offset', offset);
        radialGradient.appendChild(stop);
      });
      defs.appendChild(radialGradient);
    });

    svg.appendChild(defs);
    defs.appendChild(marker);
    marker.appendChild(path);
  }

  //TODO: update

  private _traverseGraphForHyperEdges(node : KGraphNode){
    if(node.edges) node.edges.forEach(function(edge : KGraphEdge){
      if(edge.$type === 'hyperlink'){
        var dfd = q.defer();
        this._cachedHyperlinkAnimationDeferred.set(edge, dfd);
        this._cachedHyperlinkAnimationPromise.set(edge, dfd.promise);
        this._edgeIdToEdgeMap.set(edge.id, edge);
      }
    },this);
    if(node.children) node.children.forEach(this._traverseGraphForHyperEdges.bind(this));
  }

  public render(kgraph){
    this._kgraph = kgraph;
    var graphRoot = this._kgraph.root;
    this._edgeIdToEdgeMap = new Map<string, KGraphEdge>();
    this._cachedHyperlinkAnimationPromise = new Map<KGraphEdge, Q.Promise<KGraphEdge>>();
    this._cachedHyperlinkAnimationDeferred = new Map<KGraphEdge, Q.Deferred<KGraphEdge>>();
    this._traverseGraphForHyperEdges(graphRoot);

    this._allEdges = [];
    if(this._firstRender){
      this._s.attr('viewBox','0 0 ' + graphRoot.width + ' ' + graphRoot.height);
      this._firstRender = false;
    } else{
      Snap.animate(
        this._s.attr("viewBox").vb.split(' ').map( (d:string) => parseInt(d) ), 
        [ 0, 0, graphRoot.width, graphRoot.height ], 
        function(values){ this._s.attr("viewBox", values.join(" ")); }.bind(this), 
        constants.ANIM_DURATION, 
        mina.easein);
    }

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
     
  }

  //trigger exit animation
  private _exitNodeChildren(node:KGraphNode, recursiveDelete?:boolean):void{
    this._exitKGraphObject(node, 'children', recursiveDelete);
  }

  private _exitEdges(node:KGraphNode, recursiveDelete?:boolean):void{
    this._exitKGraphObject(node, 'edges', recursiveDelete);
  }

  private _exitLabels(node:KGraphNode, recursiveDelete?:boolean):void{
    this._exitKGraphObject(node, 'labels', recursiveDelete);
  }

  private _exitKGraphObject(kgraphNode, property, recursiveDelete){
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

    var cachedNodes = cache.get(kgraphNode) || [];
    var nodesToExit = recursiveDelete ? kgraphNode[property] || [] : _.difference(cachedNodes, kgraphNode[property]);

    if(nodesToExit.length) console.log('nodesToExit ', property, nodesToExit );

    //recurse on sub-properties
    if(property === 'children'){
      //recurse on any substates
      nodesToExit.forEach(function(nodeToExit){
        //recurse
        this._exitNodeChildren(nodeToExit, true);
        this._exitEdges(nodeToExit, true);
      }, this);
    } else if(property === 'edges'){
      nodesToExit.forEach(function(nodeToExit){
        //recurse
        this._exitLabels(nodeToExit, true);
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
    var nodesToCache = (kgraphNode[property] || []).slice();
    cache.set(kgraphNode, nodesToCache);  //keep a copy so that we can animate node exit
  }

  private _renderGraphNode(parentGraphNode, graphNode){

    var isLeaf = !graphNode.children;
    var labelTextParams = getStateLabelTextParams();
    if(!this._kgraphNodeToSVGNode.has(graphNode)){
      //enter graph node
      var group = this._kgraphNodeToSVGNode.get(parentGraphNode).group();
      group.node.setAttributeNS(null,'id',graphNode.id);    //tag him with state id

      var rect = group.rect(graphNode.width / 2, graphNode.height / 2, 0, 0).attr({rx : 2, ry : 2, strokeWidth : 0});
      var label = group.text.apply(group, labelTextParams).attr({opacity : 0});
      if(!isLeaf){
        var bbox = (<Snap.BBox> label.getBBox());
        //add a decoration
        //TODO: clean this up later
        var line = (<Snap.Element>group.line(0, bbox.height, graphNode.width, bbox.height).attr({opacity:0}));
      }

      //start animations
      rect.animate({x : 0, y : 0, width : graphNode.width, height : graphNode.height, strokeWidth : 1}, constants.ANIM_DURATION, mina.bounce);
      label.animate({opacity : 1}, constants.ANIM_DURATION, mina.bounce);
      if(line){
        line.animate({opacity:1}, constants.ANIM_DURATION, mina.easein);
      }

      group.exit = function(){
        rect.animate({x : graphNode.width / 2, y : graphNode.height / 2, width : 0, height : 0, strokeWidth : 0, opacity : 0}, constants.ANIM_DURATION, mina.easein, function(){
          group.remove();
        });
        label.animate({opacity : 0}, constants.ANIM_DURATION, mina.easein);
      };

      group.transform('t' + graphNode.x + ',' + graphNode.y); 
      // By default its black, lets change its attributes
      group.addClass('node');
      group.addClass(isLeaf ? 'leaf' : 'compound');

      if(graphNode.$type){
        group.addClass('type__' + graphNode.$type);
      }

      this._kgraphNodeToSVGNode.set(graphNode, group);

      //TODO: register event handlers
      var callbacks = events.node.map(function(eventName){
        var handler = function(e){
          e.preventDefault();
          e.stopPropagation();
          graphNode.emit('node:' + eventName, e);
        };
        group[eventName](handler);
        return handler;
      });
    } else {
      //animate
      var displayNode = this._kgraphNodeToSVGNode.get(graphNode);

      var text = displayNode.select('text')
        .attr({'text': labelTextParams[2]})
        .animate({x : labelTextParams[0], y: labelTextParams[1]}, constants.ANIM_DURATION);
      displayNode.addClass(isLeaf ? 'leaf' : 'compound');
      displayNode.removeClass(!isLeaf ? 'leaf' : 'compound');
      displayNode.node.setAttributeNS(null,'id',graphNode.id);    //update state id
      displayNode.animate({transform : 't' + graphNode.x + ',' + graphNode.y}, constants.ANIM_DURATION);
      displayNode.select('rect').animate({width : graphNode.width, height : graphNode.height}, constants.ANIM_DURATION);
      var line = displayNode.select('line');
      if(line){
        var bbox = text.getBBox();
        line.animate({x1:0, y1: bbox.height, x2:graphNode.width, y2:bbox.height}, constants.ANIM_DURATION);
      }

      //update type class
      constants.STATE_TYPES.forEach(function(type){
        displayNode.removeClass('type__' + type);
      });
      if(graphNode.$type){
        displayNode.addClass('type__' + graphNode.$type);
      }
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
        if( this._kgraph.isSourceAncestorOfTarget(edge.source, edge.target) ){
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
      var textX = graphNode.width / 2;
      var textY = isLeaf ? graphNode.height / 2 : constants.LEAF_NODE_PADDING_H;
      var textContent = graphNode.$type === 'virtual' ? graphNode.labels[0].text : graphNode.id;
      return [textX, textY, textContent];
    }
  }

  private _computeEdgeLength(edge){
    var length = 0;
    var lastPoint = edge.sourcePoint;
    (edge.bendPoints || []).concat(edge.targetPoint).forEach(function(nextPoint){
      length += this._computeDistance(nextPoint, lastPoint);
      lastPoint = nextPoint;
    }, this);
    return length;
  }

  private _computeDistance(nextPoint, lastPoint){
    return Math.sqrt(
          Math.pow(nextPoint.y - lastPoint.y, 2) + 
          Math.pow(nextPoint.x - lastPoint.x, 2));
  }

  private _getDAtLength(points, length){

    var sourcePoint = points[0];
    var d = 'M'+ sourcePoint.x + ' ' + sourcePoint.y,
        cumulativeLength = 0;

    for(var i = 1; i < points.length && cumulativeLength < length; i++){
      var p1 = points[i], p2 = points[i-1];
      var segmentDistance = this._computeDistance(p1, p2);
      var newCumulativeLength = cumulativeLength + segmentDistance; 
      var x = p1.x, y = p1.y;
      if(newCumulativeLength > length){
        var overflow = newCumulativeLength - length;
        if(p1.x === p2.x){
          if(p1.y > p2.y){
            y -= overflow; 
          }else{
            y += overflow; 
          }
        } else if(p1.y === p2.y){
          if(p1.x > p2.x){
            x -= overflow; 
          }else{
            x += overflow; 
          }
        } else {
          throw new Error('Not horizontal or vertical');
        }
      }

      d += ' L' + x + ' ' + y;
      cumulativeLength = newCumulativeLength;
    }

    return d;
  }

  private _edgeToPoints(edge){
    return [edge.sourcePoint].
            concat(edge.bendPoints || []).
            concat([edge.targetPoint]);
  }

  private _renderEdge(parentGraphNode, edge){
    if(!this._kgraphNodeToSVGNode.has(edge)){
      var path = this._kgraphNodeToSVGNode.get(parentGraphNode).path();
      path.addClass('link');
      if(edge.$type) path.addClass(edge.$type);
      path.node.setAttributeNS(null, 'id', edge.source + '->' + edge.target);

      if(edge.$hyperlink){
        var associatedHyperlinkEdge = this._edgeIdToEdgeMap.get(edge.$hyperlink);
        var animationPromise = this._cachedHyperlinkAnimationPromise.get(associatedHyperlinkEdge);
        animationPromise.then(beginEntryAnimation.bind(this, true));
      }else{
        beginEntryAnimation.call(this, edge.$type === 'hyperlink');
      }

      this._kgraphNodeToSVGNode.set(edge, path);

    } else {
      var edgeDisplayNode = this._kgraphNodeToSVGNode.get(edge);
      edgeDisplayNode.remove(); 
      this._kgraphNodeToSVGNode.get(parentGraphNode).append(edgeDisplayNode);

      //update edge segments
      var newPointList = this._edgeToPoints(edge);
      var pathNode = (<SVGPathElement>edgeDisplayNode.node);
      var pathSegList = pathNode.pathSegList;
      var mSeg = (<SVGPathSegMovetoAbs>pathSegList.getItem(0));

      //normalize segments
      if(newPointList.length > pathSegList.numberOfItems){
        //create some new dummy segments
        var numberOfNewPoints = newPointList.length - pathSegList.numberOfItems;
        for(var i = 0; i < numberOfNewPoints; i++){
          var newSeg = pathNode.createSVGPathSegLinetoAbs(mSeg.x, mSeg.y);
          pathSegList.insertItemBefore(newSeg,1)
        }
      } else {
        //exit out some segments. TODO: animate exit.
        var pointsToRemove = pathSegList.numberOfItems - newPointList.length;
        for(var i = 0; i < pointsToRemove; i++){
          pathSegList.removeItem(1);
        }
      }

      var promises = [];
      for(var i = 0; i < pathSegList.numberOfItems; i++){
        promises.push( 
          (function(i){
            var seg = (<SVGPathSegMovetoAbs>pathSegList.getItem(i)),
                point = newPointList[i],
                dfd = q.defer();

            //animate segments
            Snap.animate(
              [seg.x, seg.y], 
              [point.x, point.y], 
              function(values){ seg.x = values[0]; seg.y = values[1]; }, 
              constants.ANIM_DURATION, 
              mina.easein,
              function(){
                dfd.resolve();
              });
              return dfd.promise;
          })(i)
        );
      }
      q.all(promises).then(function(){
        var deferred = this._cachedHyperlinkAnimationDeferred.get(edge);
        if(deferred) deferred.resolve(); 
      }.bind(this));

      edgeDisplayNode.node.setAttributeNS(null, 'id', edge.source + '->' + edge.target);
      if(edge.$type === 'hyperlink'){ 
        edgeDisplayNode.addClass(edge.$type);
      } else {
        edgeDisplayNode.removeClass('hyperlink');
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

          //reparent
          //TODO: it would be better to move the label into its own layer so that we we can animate the reparenting
          labelDisplayNode.remove(); 
          this._kgraphNodeToSVGNode.get(parentGraphNode).append(labelDisplayNode);

          //update text, if it has changed
          if(label.text !== labelDisplayNode.attr('text')){
            labelDisplayNode.animate({'opacity' : 0}, constants.ANIM_DURATION/2, function(){
              labelDisplayNode.attr({text : label.text});
              labelDisplayNode.animate({'opacity' : 1}, constants.ANIM_DURATION/2);
            });
          }

          //move
          labelDisplayNode.animate({x: label.x, y : label.y}, constants.ANIM_DURATION);
        }
      }, this);
    }

    this._exitLabels(edge);

    function beginEntryAnimation(halfTime){
      var _getDAtLength = this._getDAtLength.bind(this, this._edgeToPoints(edge));
      //animate
      Snap.animate(
        0, 
        this._computeEdgeLength(edge), 
        function(length){ path.attr('d', _getDAtLength(length)); }.bind(this), 
        constants.ANIM_DURATION / ( halfTime ? 2 : 1),
        function(){
          var deferred = this._cachedHyperlinkAnimationDeferred.get(edge);
          if(deferred) deferred.resolve(); 
        }.bind(this));
    }
  }
}
