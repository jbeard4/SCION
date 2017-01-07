import constants from './constants';
import $ = require('jquery');
import q = require('q');
import events from './events';
import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, IKGraphNode} from './KGraph';

const SVGNS = 'http://www.w3.org/2000/svg';

export abstract class VisualObject {
  displayNode : Snap.Element;
  parent : VisualObject;

  constructor(parent : VisualObject){
    this.parent = parent;
  }

  public exit(graphNode : IKGraphNode){
    //default exit behavior
    this.displayNode.animate({opacity : 0}, constants.ANIM_DURATION, mina.easein, function(){
      this.displayNode.remove();
    }.bind(this))
  }
}

export class SnapSvgCanvas extends VisualObject {

  private _paper : Snap.Paper;

  constructor(parentNode : SVGElement){
    super(null);
    this._paper = Snap(parentNode);
    var oldEl = this._paper.el;
    this._paper.el = (name, attr) => {
      var el = oldEl.call(this._paper, name, attr);
      el.node.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
      return el;
    };
    this._initDefs(this._paper.node);
  }

  public enter(graphRoot : KGraphNode){
    this._paper.attr('viewBox','0 0 ' + graphRoot.width + ' ' + graphRoot.height);
    if(!this.displayNode) this.displayNode = this._paper.group();
    var rect = this.displayNode.rect(graphRoot.x, graphRoot.y, graphRoot.width, graphRoot.height);
    this.displayNode.addClass('node');
    this.displayNode.addClass('compound');
  }

  public measureTextDimensions (text){
    var txt = this._paper.text(0,0,text);
    var bbox = txt.getBBox();
    txt.remove(); 
    return bbox; 
  }

  public update(graphRoot : KGraphNode){
    Snap.animate(
      this._paper.attr("viewBox").vb.split(' ').map( (d:string) => parseInt(d) ), 
      [ 0, 0, graphRoot.width, graphRoot.height ], 
      function(values){ this._paper.attr("viewBox", values.join(" ")); }.bind(this), 
      constants.ANIM_DURATION, 
      mina.easein);
  }

  public clear(){
    if(this.displayNode) this.displayNode.clear();
  }

  public highlightState(stateId){
    $(this.displayNode.node.ownerDocument.getElementById(stateId)).addClass('highlighted');
  }

  public unhighlightState(stateId){
    $(this.displayNode.node.ownerDocument.getElementById(stateId)).removeClass('highlighted');
  }

  public unhighlightAllStates(){
    $(this.displayNode.node).find('.highlighted').removeClass('highlighted');
  }

  public highlightTransition(sourceStateId, targetStateIds){
    if(!targetStateIds) return;
    var node = $(this.displayNode.node.ownerDocument.getElementById(sourceStateId + '->' + (targetStateIds && targetStateIds.length ? targetStateIds[0] : '')));
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

}

export class SnapSvgNode extends VisualObject {

  constructor(parent : VisualObject){
    super(parent);
  }

  private _isLeaf(graphNode : KGraphNode){
    return !(graphNode.children && graphNode.children.length);
  } 

  private _getStateLabelTextParams(graphNode : KGraphNode, isLeaf : boolean){
    var textX = graphNode.width / 2;
    var textY = isLeaf ? graphNode.height / 2 : constants.LEAF_NODE_PADDING_H;
    var textContent = graphNode.$type === 'virtual' ? graphNode.labels[0].text : graphNode.id;
    return [textX, textY, textContent];
  }

  enter(graphNode : KGraphNode){

    var isLeaf = this._isLeaf(graphNode);
    var labelTextParams = this._getStateLabelTextParams(graphNode, isLeaf);

    //enter graph node
    this.displayNode = this.parent.displayNode.group();
    this.displayNode.node.setAttributeNS(null,'id',graphNode.id);    //tag him with state id

    var rect = this.displayNode.rect(graphNode.width / 2, graphNode.height / 2, 0, 0).attr({rx : 2, ry : 2, strokeWidth : 0});
    var label = this.displayNode.text.apply(this.displayNode, labelTextParams).attr({opacity : 0});
    if(!isLeaf){
      var bbox = (<Snap.BBox> label.getBBox());
      //add a decoration
      //TODO: clean this up later
      var line = (<Snap.Element>this.displayNode.line(0, bbox.height, graphNode.width, bbox.height).attr({opacity:0}));
    }

    //start animations
    rect.animate({x : 0, y : 0, width : graphNode.width, height : graphNode.height, strokeWidth : 1}, constants.ANIM_DURATION, mina.bounce);
    label.animate({opacity : 1}, constants.ANIM_DURATION, mina.bounce);
    if(line){
      line.animate({opacity:1}, constants.ANIM_DURATION, mina.easein);
    }

    this.displayNode.transform('t' + graphNode.x + ',' + graphNode.y); 
    // By default its black, lets change its attributes
    this.displayNode.addClass('node');
    this.displayNode.addClass(isLeaf ? 'leaf' : 'compound');

    if(graphNode.$type){
      this.displayNode.addClass('type__' + graphNode.$type);
    }

    //TODO: register event handlers
    var callbacks = events.node.map(function(eventName){
      var handler = function(e){
        e.preventDefault();
        e.stopPropagation();
        graphNode.emit('node:' + eventName, e);
      };
      this.displayNode[eventName](handler);
      return handler;
    }.bind(this));
  }

  update(graphNode : KGraphNode){
    //animate
    var displayNode = this.displayNode;
    var isLeaf = this._isLeaf(graphNode);
    var labelTextParams = this._getStateLabelTextParams(graphNode, isLeaf);
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

  exit(graphNode : KGraphNode){
    var rect = this.displayNode.select('rect');
    rect.animate({x : graphNode.width / 2, y : graphNode.height / 2, width : 0, height : 0, strokeWidth : 0, opacity : 0}, constants.ANIM_DURATION, mina.easein, function(){
      this.displayNode.remove();
    }.bind(this));
    var text = this.displayNode.select('text') .animate({opacity : 0}, constants.ANIM_DURATION, mina.easein);
  }
}

export class SnapSvgEdge extends VisualObject {

  //TODO: maybe refactor out shared memory
  private _cachedHyperlinkAnimationPromise:Map<KGraphEdge, Q.Promise<KGraphEdge>>;
  private _cachedHyperlinkAnimationDeferred:Map<KGraphEdge, Q.Deferred<KGraphEdge>>;
  private _edgeIdToEdgeMap:Map<string, KGraphEdge>;

  constructor(parent : VisualObject,
              cachedHyperlinkAnimationPromise,
              cachedHyperlinkAnimationDeferred,
              edgeIdToEdgeMap){
    super(parent);
    this._cachedHyperlinkAnimationPromise = cachedHyperlinkAnimationPromise;
    this._cachedHyperlinkAnimationDeferred = cachedHyperlinkAnimationDeferred;
    this._edgeIdToEdgeMap = edgeIdToEdgeMap;
  }

  public enter(edge : KGraphEdge){
    this.displayNode = this.parent.displayNode.path();
    this.displayNode.addClass('link');
    if(edge.$type) this.displayNode.addClass(edge.$type);
    this.displayNode.node.setAttributeNS(null, 'id', edge.source + '->' + edge.target);

    if(edge.$hyperlink){
      var associatedHyperlinkEdge = this._edgeIdToEdgeMap.get(edge.$hyperlink);
      var animationPromise = this._cachedHyperlinkAnimationPromise.get(associatedHyperlinkEdge);
      animationPromise.then(beginEntryAnimation.bind(this, true));
    }else{
      beginEntryAnimation.call(this, edge.$type === 'hyperlink');
    }

    function beginEntryAnimation(halfTime){
      var _getDAtLength = this._getDAtLength.bind(this, this._edgeToPoints(edge));
      //animate
      Snap.animate(
        0, 
        this._computeEdgeLength(edge), 
        function(length){ this.displayNode.attr('d', _getDAtLength(length)); }.bind(this), 
        constants.ANIM_DURATION / ( halfTime ? 2 : 1),
        function(){
          var deferred = this._cachedHyperlinkAnimationDeferred.get(edge);
          if(deferred) deferred.resolve(); 
        }.bind(this));
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


  public update(edge : KGraphEdge, newParent : VisualObject){
    //reparent the edge
    this.displayNode.remove(); 
    this.parent = newParent;
    this.parent.displayNode.append(this.displayNode);

    //update edge segments
    var newPointList = this._edgeToPoints(edge);
    var pathNode = (<SVGPathElement>this.displayNode.node);
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

    this.displayNode.node.setAttributeNS(null, 'id', edge.source + '->' + edge.target);
    if(edge.$type === 'hyperlink'){ 
      this.displayNode.addClass(edge.$type);
    } else {
      this.displayNode.removeClass('hyperlink');
    }
  }
}

export class SnapSvgLabel extends VisualObject {

  public enter(label : KGraphLabel,  edge: KGraphEdge){
    this._normalizeSelfLoopEdgeCoordinates(label, edge);
    this.displayNode = this.parent.displayNode.text(label.x, -10, label.text).attr({opacity : 0});
    if(label.$meta) this.displayNode.attr(label.$meta);
    this.displayNode.addClass('edge-label');

    //animate
    this.displayNode.animate({opacity : 1}, constants.ANIM_DURATION, mina.easein);
    this.displayNode.animate({y : label.y}, constants.ANIM_DURATION, mina.bounce);
  }

  public update(label : KGraphLabel, edge: KGraphEdge, newParent : VisualObject){
    this._normalizeSelfLoopEdgeCoordinates(label, edge);
    //reparent
    //TODO: it would be better to move the label into its own layer so that we we can animate the reparenting
    this.displayNode.remove(); 
    this.parent = newParent;
    this.parent.displayNode.append(this.displayNode);

    if(label.$meta) this.displayNode.attr(label.$meta);

    //update text, if it has changed
    if(label.text !== this.displayNode.attr('text')){
      this.displayNode.animate({'opacity' : 0}, constants.ANIM_DURATION/2, function(){
        this.displayNode.attr({text : label.text});
        this.displayNode.animate({'opacity' : 1}, constants.ANIM_DURATION/2);
      }.bind(this));
    }

    //move
    this.displayNode.animate({x: label.x, y : label.y}, constants.ANIM_DURATION);
  }

  private _normalizeSelfLoopEdgeCoordinates(label : KGraphLabel, edge : KGraphEdge){
    //fix edge label coordinates. Workaround for issue OpenKieler/klayjs#8
    if(edge.source === edge.target){
      //debugger;
      label.x = edge.bendPoints[1].x;
      label.y = edge.bendPoints[1].y;
      label.$meta = {};
      label.$meta.textAnchor = 'end';

      //does the self edge loop up or down?
      if(edge.bendPoints[0].y < edge.bendPoints[1].y){
        //line has positive slope
        //goes below the slope
        label.$meta.dominantBaseline = 'text-before-edge';
      }else {
        //line has negative slope
        //goes above the slope
        label.$meta.dominantBaseline = 'text-after-edge';
      }
    }
  }

}
