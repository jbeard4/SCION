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
    var txt = document.createElementNS(SVGNS,'text');
    txt.textContent = text; 
    this._parentNode.appendChild(txt);
    var bbox = txt.getBBox();
    this._parentNode.removeChild(txt);
    return bbox; 
  }
  public render(kgraph:KGraph){
    var allEdges = this._getAllEdges(kgraph);
    console.log('allEdges ', allEdges );
    var t1 = Date.now();
    var root = <GraphRoot node={kgraph.root} allEdges={allEdges} kgraph={kgraph} isRoot={true}/>;
    var x = ReactDOM.render(root, this._parentNode);
    console.log('Rendered in %sms',Date.now() - t1);
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
      <GraphNode node={this.props.node} allEdges={this.props.allEdges} kgraph={this.props.kgraph} isRoot={true}/>
    </svg>;
  }

}

class GraphNode extends React.Component<GraphNodeProps, {}> {

  render(){
    var isLeaf = !(this.props.node.children && this.props.node.children.length);

    let edgesOriginatingFromThisStateAndNotTargetingDescendant = [];

    let edgesOriginatingFromChildStateAndNotTargetingDescendant = 
      !this.props.node.children ? [] : 
      this.props.node.children.map((child) => 
        this.props.allEdges.
          filter(
            (edge) => (child.id === edge.source)
          )
        ).reduce( ((a,b) => a.concat(b) ), []);

    let myEdges = edgesOriginatingFromThisStateAndNotTargetingDescendant.concat(
                      edgesOriginatingFromChildStateAndNotTargetingDescendant); 

    return <g id={this.props.node.id} 
            className={'node ' + 
                        (isLeaf ? 'leaf' : 'compound') + ' ' + 
                        (this.props.node.$type ? 'type__' + this.props.node.$type : '')} 
            transform={'translate(' + (this.props.node.x || 0) + ',' + (this.props.node.y || 0) + ')'}>
      <rect x="0" y="0" width={this.props.node.width} height={this.props.node.height} visibility={this.props.isRoot ? 'hidden' : 'visible'}/>
      <text   
        x={this.props.node.width / 2} 
        y={isLeaf ? this.props.node.height / 2 : constants.LEAF_NODE_PADDING_H}  
        visibility={this.props.isRoot ? 'hidden' : 'visible'}>
        {this.props.node.$type === 'virtual' ? this.props.node.labels[0].text : this.props.node.id}
      </text>
      {
        this.props.node.children && this.props.node.children.map(child => (
          <GraphNode node={child} key={child.id} allEdges={this.props.allEdges} kgraph={this.props.kgraph} isRoot={false}/>
        ))
      }
      {
        myEdges.map((edge) => (
          <GraphEdge edge={edge} key={edge.source + '->' + edge.target} />
        ))
      }
    </g>;
  }
}


interface GraphEdgeProps {
  edge : KGraphEdge;
}

export class GraphEdge extends React.Component<GraphEdgeProps, {}> {

  public render(){
    return <path 
      className={'link ' + (this.props.edge.$type || '')} 
      id={this.props.edge.source + '->' + this.props.edge.target}
      d={this._getDAtLength(this._edgeToPoints(this.props.edge), this._computeEdgeLength(this.props.edge))}
      />
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
/*

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
*/
