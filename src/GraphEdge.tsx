/// <reference path="./intrinsics.d.ts" />…
/// <reference path="./smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';
import GraphLabel from './GraphLabel';
import Debug = require('debug');
const debug = Debug('GraphEdge');

export interface GraphEdgeProps {
  edge : KGraphEdge;
  redraw? : boolean;
}

export interface GraphEdgeAnimation {
  keyTimes : string,
  marker : string[],
  path : PathSegment[],
  begin : {
    marker : string,
    path : string,
    dashOffset : string
  },
  pathLength : number,
  exiting : boolean
}

export interface PathSegment {
  sourcePoint: Point;
  targetPoints: Point[];
  fillLength: number;
}

export default class GraphEdge extends React.Component<GraphEdgeProps, GraphEdgeAnimation> {

  componentHasRendered : boolean;
  svgPathAnimation : SVGAnimationElement;
  svgMarkerAnimation : SVGAnimationElement;
  svgPathElement : SVGPathElement;
  svgMarkerElement : SVGMarkerElement;

  constructor(props){
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState(props){
    var animationSegments = this._toAnimationSegments(props.edge);
    var points = this._edgeToPoints(props.edge);

    let begin = this._toBegin(props);
    return {
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
        for(var i = 1; i < points.length; i++){
          [from, to] = points.slice(i-1, i+1);
          if(!to) continue;
          arr.push(this._getBendpointDirection(from, to));
        }
        arr.push(arr[arr.length - 1]);
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
      begin : {
        marker : begin,
        path : begin,
        dashOffset : 'indefinite'
      },
      pathLength : this._computeEdgeLength(props.edge),
      exiting : false
    }
  }

  _toBegin(props){
    return props.edge.$hyperlink && (!this.componentHasRendered || props.redraw) ? 
      `${props.edge.$hyperlink}_last.endEvent` : 
      'indefinite'; 
  }

  componentWillReceiveProps(props : GraphEdgeProps){
    if(props.redraw){
      this.state = this.getInitialState(props);
      return;
    }
    var animationSegments = this._toAnimationSegments(props.edge);
    var points = this._edgeToPoints(props.edge);
    let begin = this._toBegin(props);
    this.state = {
      keyTimes : '0; 1',
      marker : (() => {
        //get the last segment and find out what direction he's facing
        var markers = [];
        var from, to;
        [from, to] = points.slice(points.length-2);
        var angle = this._getBendpointDirection(from, to);
        markers.push(angle, angle);
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
      begin : {
        marker : begin,
        path : begin,
        dashOffset : 'indefinite'
      },
      pathLength : this._computeEdgeLength(props.edge),
      exiting : false
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
    //debug('lastSegmentDirection ',lastSegmentDirection);
    switch(lastSegmentDirection){
      case 0:
        var markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
        var x = edge.targetPoint.x - markerOffset;
        var y = edge.targetPoint.y;
        break;
      case -180:
        markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
        x = edge.targetPoint.x + markerOffset;
        y = edge.targetPoint.y;
        break;
      case -90:
        markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
        x = edge.targetPoint.x;
        y = edge.targetPoint.y + markerOffset;
        break;
      case -270:
        markerOffset = this._isHyperlink(edge) ? 0 : constants.ARROW_WIDTH;
        x = edge.targetPoint.x;
        y = edge.targetPoint.y - markerOffset;
        break;
      default:
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
      toReturn = 0;
    } else if(from.x >= to.x && from.y == to.y){
      toReturn = -180;
    } else if(from.x == to.x && from.y <= to.y){
      toReturn = -270;
    } else if(from.x == to.x && from.y >= to.y){
      toReturn = -90;
    } else {
      toReturn = 0;
    }
    return toReturn;
  }

  public render(){
    var edgeId = this.props.edge.id;
    var markerId = `${edgeId}:marker`;
    let toReturn = <g>
      <marker viewBox="0 -5 10 10" refX="0" refY="0" markerWidth="3" markerHeight="5"
          id={markerId} 
          ref={(e: SVGMarkerElement) => { this.svgMarkerElement = e; }}
          >
        <path d="M0,-5L10,0L0,5"/>
        <animate 
          attributeName="orient" attributeType="XML" fill="freeze" calcMode="discrete"
          ref={(e: SVGAnimationElement) => { this.svgMarkerAnimation = e; }}
          dur={constants.ANIM_DURATION}
          keyTimes={ this.state.keyTimes }
          begin={ this.state.begin.marker }
          values={this.state.marker.join(';')}
          />
      </marker>
      <path 
        className={'link ' + (this.props.edge.$type || '')} 
        id={edgeId}
        ref={(e: SVGPathElement) => { this.svgPathElement = e; }}
        strokeDasharray={this.state.pathLength.toString()}
        markerEnd={`url(#${markerId})`}
        >
          <animate attributeName="d" attributeType="XML" fill="freeze" 
                   ref={(e: SVGAnimationElement) => { this.svgPathAnimation = e; }}
                   id={ edgeId + '_last' }
                   keyTimes={ this.state.keyTimes }
                   values={ this.state.path.map(this._edgeToD.bind(this)).join(';') }
                   begin={ this.state.begin.path }
                   dur={constants.ANIM_DURATION} />
          {
            this.state.begin.path !== 'indefinite' &&
              [
                <animate attributeName="visibility"  attributeType="XML" fill="freeze" 
                         to="hidden"
                         begin={ `${this.props.edge.$hyperlink}_last.begin` }/>,
                <animate attributeName="visibility"  attributeType="XML" fill="freeze" 
                         to="visible"
                         begin={ this.state.begin.path }/>
              ]
          }

      </path>
      <g>
        {
          this.props.edge.labels && this.props.edge.labels.map((label, i) => (
            <GraphLabel
              edge={this.props.edge}
              key={i}
              label={label}
              redraw={this.props.redraw}
              />
          ))
        }
      </g>
    </g>;

    this.componentHasRendered = true;

    return toReturn;
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

  componentWillUnmount () {
    debug('componentWillUnmount', this.props.edge.id);
  }

  componentWillAppear (callback) {
    debug('componentWillAppear', this.props.edge.id);
    setTimeout(callback,1);
  }

  componentWillEnter (callback) {
    debug('componentWillEnter', this.props.edge.id);
    setTimeout(callback,1);
  }

  componentWillMount(){
    debug('componentWillMount', this.props.edge.id);
  }

  componentWillUpdate(){
    debug('componentWillUpdate', this.props.edge.id);
  }

  componentDidUpdate(prevProps:GraphEdgeProps, prevState: GraphEdgeAnimation) {
    //This is a workaround for bug where removing element that precedes this element in the timegraph
    //will cause this element to visually disappear.
    //Calling setAttributeNS(null, 'begin', 'indefinite') will cause this element to reappear.
    if(
      prevState.begin.marker !== this.state.begin.marker &&
        this.state.begin.marker === 'indefinite' 
      ){
      this.svgMarkerAnimation.setAttributeNS(null, 'begin', 'indefinite');
    }

    if(prevState.begin.path !== this.state.begin.path &&
        this.state.begin.path === 'indefinite' ){
      this.svgPathAnimation.setAttributeNS(null, 'begin', 'indefinite');
    }

    //force update id of marker element to workaround bug where marker element would disappear
    this.svgMarkerElement.setAttributeNS(null, "id", this.svgMarkerElement.getAttributeNS(null, "id")); 

    this.animate();
  }

  componentDidMount() {
    debug('componentDidMount', this.props.edge.id);
    this.animate();
  }


  private animate(){
    if(this.state.begin.path === 'indefinite'){
      [
        this.svgPathAnimation,
        this.svgMarkerAnimation
      ].forEach(e => e.beginElement());
    }
  }
}

