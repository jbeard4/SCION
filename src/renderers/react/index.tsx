/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import constants from '../../constants';
import events from '../../events';
import _ = require('underscore');
import q = require('q');
import ReactDOM = require('react-dom');
import * as React from "react";
import EventEmitter = require('events');

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from '../../KGraph';

import {IKGraphRenderBackend, LayoutOptions} from '../IKGraphRenderBackend';

const SVGNS = 'http://www.w3.org/2000/svg';
const STROKE_WIDTH = 1;
const ARROW_WIDTH = 3;
const ARROW_HEIGHT = 5;
const HYPERLINK_TYPE = 'hyperlink';

function beginAnimation(){
  var arr = Array.from(document.querySelectorAll('path > animate.firstPathSegment, text > animate, rect > animate, g > animateTransform, svg > animate'));
  arr.forEach( 
    (e:SVGAnimationElement) => e.beginElement()
  );
}

export default class SVGRenderer implements IKGraphRenderBackend {

  _parentNode:SVGElement;
  _root : GraphRoot;
  _kgraphRoot : KGraphNode;

  public constructor(parentNode:SVGElement){
    this._parentNode = parentNode;
  }
  public clear(){
    this._root = null;
    this._kgraphRoot = null;
    this._parentNode.innerHTML = '';
  }
  public highlightState(stateId:string){
  }
  public unhighlightState(stateId:string){
  }
  public unhighlightAllStates(){
  }
  public highlightTransition(sourceStateId:string, targetStateIds:string[]){
  }
  public measureTextDimensions(text:string){
    var svg = document.createElementNS(SVGNS,'svg');
    var txt = document.createElementNS(SVGNS,'text');
    txt.textContent = text; 
    this._parentNode.appendChild(svg);
    svg.appendChild(txt);
    var bbox = txt.getBBox();
    this._parentNode.removeChild(svg);
    return bbox; 
  }
  public render(kgraph:KGraph){
    console.log('render',kgraph);
    var allEdges = this._getAllEdges(kgraph);
    var t1 = Date.now();
    var root = <GraphRoot node={kgraph.root} allEdges={allEdges} kgraph={kgraph} isRoot={true}/>;
    if(!this._root) {
      this._root = ReactDOM.render(root, this._parentNode, () => {
        console.log('Rendered in %sms',Date.now() - t1);
        //this._beginAnimation();
        setTimeout(beginAnimation.bind(this), 100);
      }) as GraphRoot;
    }else {
      this._root.setState({
          node:kgraph.root, 
          fromNode: this._kgraphRoot,    //not yet updated. use as prev kgraph root
          allEdges:allEdges, 
          kgraph:kgraph,
          isRoot:true
      }, () => {
        setTimeout(beginAnimation.bind(this), 100);
      });
    }
    this._kgraphRoot = kgraph.root;
  }

  private _getAllEdges(kgraph:KGraph){
    let allEdges = [];
    function walk(s:KGraphNode){
      if(s.edges) s.edges.forEach((edge) => allEdges.push(edge));
      if(s.children) s.children.forEach(walk);
    }
    walk(kgraph.root);
    return allEdges;
  }

}

interface GraphNodeProps {
  node : KGraphNode;
  allEdges : KGraphEdge[];
  kgraph : KGraph;
  isRoot : boolean;
}

interface KGraphNodeAnimation {
  node : KGraphNode;
  translate : {
    x : number;
    y : number;
  }
}

interface GraphNodeAnimation {
  from : KGraphNodeAnimation;
  to : KGraphNodeAnimation;
}

interface GraphRootAnimation extends GraphNodeProps {
  fromNode : KGraphNode;
}

const DUR = constants.ANIM_DURATION + 'ms';

class GraphRoot extends React.Component<GraphNodeProps, GraphRootAnimation> {

  constructor(props){
    super(props);
    this.state = {
      node : props.node,
      allEdges : props.allEdges,
      kgraph : props.kgraph,
      isRoot : props.isRoot,
      fromNode : props.node
    };
  }

  render(){
    return <svg width="100%" height="100%" >
      <animate attributeName="viewBox" fill="freeze" 
        dur={DUR} 
        values={
          [0,0,this.state.fromNode.width,this.state.fromNode.height].join(' ') + ';' + 
          [0,0,this.state.node.width,this.state.node.height].join(' ')
        }/>
      <defs>
        { 
          ['','Highlighted'].map( (s) => (
            <radialGradient id={'finalStateGradient' + s} cx="2" cy="2" fx="2" fy="2" r="1" gradientUnits="userSpaceOnUse" key={s}>
              <stop offset="0"></stop>
              <stop offset="0.85576922"></stop>
              <stop offset="0.85576922"></stop>
              <stop offset="1"></stop>
            </radialGradient>
          ))
        }
        {
          this._markers()
        }
      </defs>
      <GraphNode node={this.state.node} allEdges={this.state.allEdges} kgraph={this.state.kgraph} isRoot={true} />
    </svg>;
  }

  private _markers(){
    var toReturn = [];
    var ids = {
      'right' : 10,
      'down' : 10,
      'left' : 0,
      'up' : 0
    };
    
    var id;
    var i = 0;
    for(id in ids){
      toReturn.push(
        <marker key={id} id={id} viewBox="0 -5 10 10" refX="0" refY="0" markerWidth={ARROW_WIDTH} markerHeight={ARROW_HEIGHT} orient={90 * i}><path d="M0,-5L10,0L0,5"></path></marker>
      );
      i++;
    }
    return toReturn;
  }

}

class GraphNode extends React.Component<GraphNodeProps, GraphNodeAnimation> {

  constructor(props){
    super(props);

    let fromNode = Object.create(new EventEmitter()) as KGraphNode;
    _.extend(fromNode, {
      id : this.props.node.id,
      $type : this.props.node.$type,
      labels : this.props.node.labels,
      x : this.props.node.width / 2,
      y : this.props.node.height / 2,
      width : 0,
      height : 0
    });

    this.state = { 
      from : {
        node : fromNode,
        translate : {
          x : this.props.node.x,
          y : this.props.node.y
        }
      },
      to : this._toNode(this.props.node)
    };
  }

  _toNode(node){
    let toNode = Object.create(new EventEmitter()) as KGraphNode;
    _.extend(toNode, {
      labels : node.labels,
      id : node.id,
      $type : node.$type,
      x : 0,
      y : 0,
      width : node.width,
      height : node.height
    });
    return {
      node : toNode,
      translate : {
        x : node.x,
        y : node.y
      }
    };
  }

  componentWillReceiveProps(props : GraphNodeProps){
    //console.log('componentWillReceiveProps', 'this.state',this.state);
    this.state = { 
      from : this.state.to,
      to : this._toNode(props.node)
    };
  }

  render(){
    var isLeaf = !(this.props.node.children && this.props.node.children.length);

    let edgesOriginatingFromChildStateAndNotTargetingDescendant = 
      !this.props.node.children ? [] : 
      this.props.node.children.map((child) => 
          this.props.allEdges.
            filter( (edge) => (child.id === edge.source && !this.props.kgraph.isSourceAncestorOfTarget(edge.source, edge.target)))
        ).reduce( ((a,b) => a.concat(b) ), []);

    let edgesOriginatingFromThisStateAndTargetingDescendant = 
        this.props.allEdges.
          filter( (edge) => (this.props.node.id === edge.source && this.props.kgraph.isSourceAncestorOfTarget(edge.source, edge.target) ) )

    let myEdges = edgesOriginatingFromThisStateAndTargetingDescendant.concat(
                      edgesOriginatingFromChildStateAndNotTargetingDescendant); 

    //if(this.state.to.node.id === 'P') console.log('this.state.to.node', this.state.to.node);
    //TODO: animate transform. 
    return <g id={this.state.to.node.id} 
            className={'node ' + 
                        (isLeaf ? 'leaf' : 'compound') + ' ' + 
                        (this.state.to.node.$type ? 'type__' + this.state.to.node.$type : '')} >
      <animateTransform attributeName="transform" attributeType="XML"
               type="translate"
               fill="freeze" 
               begin="indefinite"
               dur={DUR} 
               from={this.state.from.translate.x + ',' + this.state.from.translate.y} 
               to={this.state.to.translate.x + ',' + this.state.to.translate.y} />
      <rect visibility={this.props.isRoot ? 'hidden' : 'visible'} rx="2" ry="2">
        <animate attributeName="x" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={DUR} 
                 from={this.state.from.node.x} 
                 to={this.state.to.node.x} />
        <animate attributeName="y" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={DUR} 
                 from={this.state.from.node.y}
                 to={this.state.to.node.y} />
        <animate attributeName="width" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={DUR} 
                 from={this.state.from.node.width} 
                 to={this.state.to.node.width} />
        <animate attributeName="height" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={DUR} 
                 from={this.state.from.node.height} 
                 to={this.state.to.node.height} />
      </rect>
      <text   
        x={this.props.node.width / 2} 
        y={isLeaf ? this.props.node.height / 2 : constants.LEAF_NODE_PADDING_H}  
        visibility={this.props.isRoot ? 'hidden' : 'visible'}>
        {this.props.node.$type === 'virtual' ? this.props.node.labels[0].text : this.props.node.id}
        <animate attributeName="opacity" attributeType="CSS"
                 fill="freeze" 
                 begin="indefinite"
                 dur={DUR} 
                 from={0} to={1} />
      </text>
      {
        this.props.node.children && this.props.node.children.map(child => (
          <GraphNode node={child} key={child.id} allEdges={this.props.allEdges} kgraph={this.props.kgraph} isRoot={false}/>
        ))
      }
      {
        myEdges.map((edge,i) => (
          <GraphEdge edge={edge} key={edge.source + '_' + edge.target + i}/>
        ))
      }
    </g>;
  }
}


interface GraphEdgeProps {
  edge : KGraphEdge;
}

interface GraphEdgeAnimation {
  keyTimes : string,
  marker : string,
  path : string,
  begin : string
}

class GraphEdge extends React.Component<GraphEdgeProps, GraphEdgeAnimation> {

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
        return arr.join(';');
      })(),
      path : (() => {
        var allSegments = [];
        var sourcePoint = animationSegments[0];
        allSegments.push(this._edgeToD({
          sourcePoint: sourcePoint,
          targetPoints: [sourcePoint],
          fillLength : animationSegments.length  - 1
        }));
        for(var i = 1; i < animationSegments.length; i++){
          allSegments.push(this._edgeToD({
            sourcePoint: sourcePoint,
            targetPoints: animationSegments.slice(1,i+1),
            fillLength : animationSegments.length - 1 
          }));
        }
        return allSegments.join(';');
       })(),
      begin : (
        this.props.edge.$hyperlink ? 
          this.props.edge.$hyperlink + '_last' + '.end' : 
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
        return markers.join(';');
      })(),   
      path : (() => {
        //take final path of last layout
        //take final path of current layout
        var allSegments = [];
        var sourcePoint = animationSegments[0];
        allSegments.push(this.state.path.split(';').pop());
        allSegments.push(this._edgeToD({
          sourcePoint: sourcePoint,
          targetPoints: animationSegments.slice(1),
          fillLength : animationSegments.length - 1 
        }));
        return allSegments.join(';');
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
    return edge.$type === HYPERLINK_TYPE;
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
      var markerOffset = this._isHyperlink(edge) ? 0 : ARROW_WIDTH;
      var x = edge.targetPoint.x - markerOffset;
      var y = edge.targetPoint.y;
    }else if(lastSegmentDirection === 'left'){
      markerOffset = this._isHyperlink(edge) ? 0 : ARROW_WIDTH;
      x = edge.targetPoint.x + markerOffset;
      y = edge.targetPoint.y;
    }else if(lastSegmentDirection === 'up'){
      markerOffset = this._isHyperlink(edge) ? 0 : ARROW_WIDTH;
      x = edge.targetPoint.x;
      y = edge.targetPoint.y + markerOffset;
    }else if(lastSegmentDirection === 'down'){
      markerOffset = this._isHyperlink(edge) ? 0 : ARROW_WIDTH;
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
                  dur={DUR}
                  keyTimes={ this.state.keyTimes }
                  values={ this.state.marker }
                  begin={ this.state.begin }
                  />
          <animate attributeName="d" attributeType="XML" fill="freeze" 
                   id={ edgeId + '_last' }
                   keyTimes={ this.state.keyTimes }
                   values={ this.state.path }
                   begin={ this.state.begin }
                   className={ !this.props.edge.$hyperlink ? 'firstPathSegment' : '' }
                   dur={DUR} />
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

interface GraphLabelProps {
  edge : KGraphEdge; 
  label : KGraphLabel;
}

class GraphLabel extends React.Component<GraphLabelProps, {}>  {

  public render(){
    this._normalizeSelfLoopEdgeCoordinates(this.props.label, this.props.edge);
    
    return <text className="edge-label" x={this.props.label.x} y={this.props.label.y}
        textAnchor={this.props.label.$meta && this.props.label.$meta.textAnchor}
        dominantBaseline={this.props.label.$meta && this.props.label.$meta.dominantBaseline}
      >
      {this.props.label.text}
    </text>;
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
