/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import constants from '../../constants';
import events from '../../events';
import _ = require('underscore');
import q = require('q');
import ReactDOM = require('react-dom');
import * as React from "react";

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from '../../KGraph';

import IKGraphRenderBackend from '../IKGraphRenderBackend';

const SVGNS = 'http://www.w3.org/2000/svg';

export default class SVGRenderer implements IKGraphRenderBackend {

  _parentNode:SVGElement;

  public constructor(parentNode:SVGElement){
    this._parentNode = parentNode;
  }
  public clear(){
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
    var x = ReactDOM.render(root, this._parentNode, () => {
      console.log('Rendered in %sms',Date.now() - t1);
      //this._beginAnimation();
      setTimeout(this._beginAnimation.bind(this), 100);
    });
  }
  private _beginAnimation(){
    var arr = Array.from(document.querySelectorAll('path > animate.firstPathSegment, text > animate, rect > animate'));
    arr.forEach( 
      (e:SVGAnimationElement) => e.beginElement()
    );
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

class GraphRoot extends React.Component<GraphNodeProps, {}> {

  render(){
    return <svg width="100%" height="100%" viewBox={'0 0 ' + this.props.node.width + ' ' + this.props.node.height}>
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
      <GraphNode node={this.props.node} allEdges={this.props.allEdges} kgraph={this.props.kgraph} isRoot={true}/>
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
        <marker key={id} id={id} viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="3" markerHeight="5" orient={90 * i}><path d="M0,-5L10,0L0,5"></path></marker>
      );
      i++;
    }
    return toReturn;
  }

}

class GraphNode extends React.Component<GraphNodeProps, {}> {

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

    return <g id={this.props.node.id} 
            className={'node ' + 
                        (isLeaf ? 'leaf' : 'compound') + ' ' + 
                        (this.props.node.$type ? 'type__' + this.props.node.$type : '')} 
            transform={'translate(' + (this.props.node.x || 0) + ',' + (this.props.node.y || 0) + ')'}>
      <rect visibility={this.props.isRoot ? 'hidden' : 'visible'} rx="2" ry="2">
        <animate attributeName="x" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={constants.ANIM_DURATION + 'ms'} 
                 from={this.props.node.width / 2} to={0} />
        <animate attributeName="y" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={constants.ANIM_DURATION + 'ms'} 
                 from={this.props.node.height / 2} to={0} />
        <animate attributeName="width" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={constants.ANIM_DURATION + 'ms'} 
                 from={0} to={this.props.node.width} />
        <animate attributeName="height" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 dur={constants.ANIM_DURATION + 'ms'} 
                 from={0} to={this.props.node.height} />
      </rect>
      <text   
        x={this.props.node.width / 2} 
        y={isLeaf ? this.props.node.height / 2 : constants.LEAF_NODE_PADDING_H}  
        visibility={this.props.isRoot ? 'hidden' : 'visible'}>
        {this.props.node.$type === 'virtual' ? this.props.node.labels[0].text : this.props.node.id}
        <animate attributeName="opacity" attributeType="CSS"
                 fill="freeze" 
                 begin="indefinite"
                 dur={constants.ANIM_DURATION + 'ms'} 
                 from={0} to={1} />
      </text>
      {
        this.props.node.children && this.props.node.children.map(child => (
          <GraphNode node={child} key={child.id} allEdges={this.props.allEdges} kgraph={this.props.kgraph} isRoot={false}/>
        ))
      }
      {
        myEdges.map((edge) => (
          <GraphEdge edge={edge} key={edge.source + '_' + edge.target} />
        ))
      }
    </g>;
  }
}


interface GraphEdgeProps {
  edge : KGraphEdge;
}

class GraphEdge extends React.Component<GraphEdgeProps, {}> {

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

  private _toAnimationSegments(edge){
    //start point
    var allSegments = [];
    var targetPoints = (edge.bendPoints || []).concat(edge.targetPoint);
    allSegments.push(this._edgeToD({
      sourcePoint: edge.sourcePoint,
      targetPoints: [edge.sourcePoint],
      fillLength : targetPoints.length 
    }));
    for(var i = 0; i < targetPoints.length; i++){
      allSegments.push(this._edgeToD({
        sourcePoint: edge.sourcePoint,
        targetPoints: targetPoints.slice(0,i+1),
        fillLength : targetPoints.length 
      }));
    }
    return allSegments;
  }

  public render(){
    var edgeId = this.props.edge.id;
    var animationSegments = this._toAnimationSegments(this.props.edge);
    var animationSegmentPairs = (function(){
      var toReturn = [];
      for(var i = 1; i < animationSegments.length; i++){
        toReturn.push([animationSegments[i-1],animationSegments[i]]);
      }
      return toReturn;
    })();
    var animDurSlice = constants.ANIM_DURATION/animationSegmentPairs.length;

    var firstSegmentOfHyperlink = (function(i){ 
      return this.props.edge.$hyperlink && i === 0;
    }.bind(this));

    var points = this._edgeToPoints(this.props.edge);

    return <g>
      <path 
        className={'link ' + (this.props.edge.$type || '')} 
        id={edgeId}
        >
          <animate attributeName="marker-end" attributeType="CSS" fill="freeze" 
                  className={this.props.edge.$hyperlink ? '' : 'firstPathSegment'}
                  dur={constants.ANIM_DURATION + 'ms'}
                  values={
                    (function(){
                      var arr = [];
                      var from, to;
                      function add(type){
                        arr.push(`url(#${type})`); 
                      }
                      for(var i = 1; i < points.length; i++){
                        [from, to] = points.slice(i-1, i+1);
                        if(!to) continue;
                        if(from.x <= to.x && from.y == to.y){
                          add('right');
                        } else if(from.x >= to.x && from.y == to.y){
                          add('left');
                        } else if(from.x == to.x && from.y <= to.y){
                          add('down');
                        } else if(from.x == to.x && from.y >= to.y){
                          add('up');
                        } else {
                          add('right');
                        }
                      }
                      if(this.props.edge.$type === 'hyperlink') arr.push('none');
                      return arr.join(';');
                    }.bind(this)())
                  }
                  begin={
                    this.props.edge.$hyperlink ? 
                      this.props.edge.$hyperlink + '_last' + '.end' : 
                      'indefinite' 
                  }
                  />
          {
            animationSegmentPairs.map( ([fromD, toD], i) => (
                <animate attributeName="d" attributeType="XML" fill="freeze" 
                         key={i}
                         id={ i === (animationSegmentPairs.length - 1) ? edgeId + '_last' : edgeId + i.toString() }
                         begin={
                             firstSegmentOfHyperlink(i) ? 
                              this.props.edge.$hyperlink + '_last' + '.end' : 
                              (
                                i === 0 ? 
                                  'indefinite' : 
                                  edgeId  + (i-1).toString() +'.end'
                              )
                         } 
                         className={ i === 0 && !firstSegmentOfHyperlink(i) ? 'firstPathSegment' : '' }
                         dur={animDurSlice + 'ms'}
                         from={fromD} 
                         to={toD} />
            ))
          }
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
