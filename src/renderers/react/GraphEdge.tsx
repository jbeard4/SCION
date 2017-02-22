/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from '../../KGraph';
import * as React from "react";
import constants from '../../constants';
import GraphLabel from './GraphLabel';

interface GraphEdgeProps {
  edge : KGraphEdge;
}

interface GraphEdgeAnimation {
  keyTimes : string,
  marker : string[],
  path : PathSegment[],
  begin : string
}

interface PathSegment {
  sourcePoint: Point;
  targetPoints: Point[];
  fillLength: number;
}

export default class GraphEdge extends React.Component<GraphEdgeProps, GraphEdgeAnimation> {

  constructor(props){
    super(props);
    //take everything currently in render, and move into the constructor to compute values for entry animation
    //subsequent updates will be simpler
    var animationSegments = this._toAnimationSegments(this.props.edge);
    var points = this._edgeToPoints(this.props.edge);

    this.state = {
      keyTimes : (() => {
        var arr = [];
        for(var i = 0; i < points.length-1; i++){
          arr.push(i/(points.length-1));
        }
        arr.push(1);
        return arr.join(';');
      })(),
      marker : (() => {
        var arr = [];
        var from, to;
        function add(type){
          arr.push(`url(#${type})`); 
        }
        for(var i = 1; i < points.length; i++){
          [from, to] = points.slice(i-1, i+1);
          if(!to) continue;
          add(this._getBendpointDirection(from, to));
        }
        if(this._isHyperlink(this.props.edge)){ 
          arr.push('none');
        } else {
          arr.push(arr[arr.length - 1]);
        }
        return arr;
      })(),
      path : (() => {
        var allSegments:PathSegment[] = [];
        var sourcePoint = animationSegments[0];
        allSegments.push({
          sourcePoint: sourcePoint,
          targetPoints: [sourcePoint],
          fillLength : animationSegments.length  - 1
        });
        for(var i = 1; i < animationSegments.length; i++){
          allSegments.push({
            sourcePoint: sourcePoint,
            targetPoints: animationSegments.slice(1,i+1),
            fillLength : animationSegments.length - 1 
          });
        }
        return allSegments;
       })(),
      begin : (
        this.props.edge.$hyperlink ? 
          this.props.edge.$hyperlink + '_last' + '.endEvent' : 
          'indefinite' 
      )
    }
  }

  componentWillReceiveProps(props : GraphEdgeProps){
    //compute updated props
    var animationSegments = this._toAnimationSegments(props.edge);
    var points = this._edgeToPoints(props.edge);
    this.state = {
      keyTimes : '0; 1',
      marker : (() => {
        //get the last segment and find out what direction he's facing
        var markers = [];
        if(props.edge.$type === 'hyperlink'){
          markers.push('none','none');  //SMIL will override the CSS class, believe it or not
        } else {
          var from, to;
          [from, to] = points.slice(points.length-2);
          var type = this._getBendpointDirection(from, to);
          var markerUrl = `url(#${type})`;
          markers.push(markerUrl, markerUrl);
        }
        return markers;
      })(),   
      path : (() => {
        //take final path of last layout
        //take final path of current layout
        var allSegments:PathSegment[]  = [];
        var sourcePoint = animationSegments[0];
        var fillLength = animationSegments.length - 1; 
        var prevPath = this.state.path[this.state.path.length - 1];
        var maxFillLength = Math.max(prevPath.fillLength, fillLength);

        prevPath.fillLength = maxFillLength;
        allSegments.push(prevPath);
        allSegments.push({
          sourcePoint: sourcePoint,
          targetPoints: animationSegments.slice(1),
          fillLength : maxFillLength
        });

        return allSegments;
       })(),
       begin : 'indefinite' 
    }
  }

  private _toPointStr(point){
    return point.x.toString() + ',' + point.y.toString();
  }

  private _edgeToD({ sourcePoint , targetPoints, fillLength }){
    var s = 'M' + this._toPointStr(sourcePoint) + ' '  + (targetPoints.map( (point) => {
              return 'L' + this._toPointStr(point);
            })).join(' ');
    for(var i=0; i <  fillLength - targetPoints.length; i++){
      s += 'L' + this._toPointStr(targetPoints[targetPoints.length - 1])
    }
    return s;
  }

  private _isHyperlink(edge){
    return edge.$type === constants.HYPERLINK_TYPE;
  }

  private _toAnimationSegments(edge){
    //start point
    var sourcePoint = {
      x : edge.sourcePoint.x,
      y : edge.sourcePoint.y
    };
    var initialFrom;
    if(edge.bendPoints && edge.bendPoints.length){
      initialFrom = edge.bendPoints[edge.bendPoints.length - 1];
    } else {
      initialFrom = sourcePoint;
    }
    var lastSegmentDirection = this._getBendpointDirection(initialFrom, edge.targetPoint);
    //console.log('lastSegmentDirection ',lastSegmentDirection);
    if(lastSegmentDirection === 'right'){
      var markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
      var x = edge.targetPoint.x - markerOffset;
      var y = edge.targetPoint.y;
    }else if(lastSegmentDirection === 'left'){
      markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
      x = edge.targetPoint.x + markerOffset;
      y = edge.targetPoint.y;
    }else if(lastSegmentDirection === 'up'){
      markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
      x = edge.targetPoint.x;
      y = edge.targetPoint.y + markerOffset;
    }else if(lastSegmentDirection === 'down'){
      markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
      x = edge.targetPoint.x;
      y = edge.targetPoint.y - markerOffset;
    } else {
      throw new Error('Layout not recognized');
    }
    var targetPoint = {
      x : x,
      y : y
    };
    return [sourcePoint].concat(edge.bendPoints || []).concat(targetPoint);
  }

  private _getBendpointDirection(from, to){
    var toReturn;
    if(from.x <= to.x && from.y == to.y){
      toReturn = 'right';
    } else if(from.x >= to.x && from.y == to.y){
      toReturn = 'left';
    } else if(from.x == to.x && from.y <= to.y){
      toReturn = 'down';
    } else if(from.x == to.x && from.y >= to.y){
      toReturn = 'up';
    } else {
      toReturn = 'right';
    }
    return toReturn;
  }

  public render(){
    var edgeId = this.props.edge.id;
    return <g>
      <path 
        className={'link ' + (this.props.edge.$type || '')} 
        id={edgeId}
        >
          <animate attributeName="marker-end" attributeType="CSS" fill="freeze" 
                  className={this.props.edge.$hyperlink ? '' : 'firstPathSegment'}
                  dur={constants.ANIM_DURATION}
                  keyTimes={ this.state.keyTimes }
                  values={ this.state.marker.join(';') }
                  begin={ this.state.begin }
                  />
          <animate attributeName="d" attributeType="XML" fill="freeze" 
                   id={ edgeId + '_last' }
                   keyTimes={ this.state.keyTimes }
                   values={ this.state.path.map(this._edgeToD.bind(this)).join(';') }
                   begin={ this.state.begin }
                   className={ !this.props.edge.$hyperlink ? 'firstPathSegment' : '' }
                   dur={constants.ANIM_DURATION} />
      </path>
      {
        this.props.edge.labels && this.props.edge.labels.map((label, i) => (
          <GraphLabel edge={this.props.edge} key={i} label={label}/>
        ))
      }
    </g>;
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
}

