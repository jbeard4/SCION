/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from '../../KGraph';
import * as React from "react";
import constants from '../../constants';
import GraphEdge from './GraphEdge';
import EventEmitter = require('events');
import _ = require('underscore');
let ReactTransitionGroup = require('react-addons-transition-group');

const beginAnimationId = constants.beginAnimationId;

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

export default class GraphRoot extends React.Component<GraphNodeProps, GraphRootAnimation> {

  private svgRootElement : SVGSVGElement;
  private viewBoxAnimation : SVGAnimationElement;

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

  public pauseAnimation(){
    console.log('pauseAnimation');
    this.svgRootElement.pauseAnimations();
  }

  public beginAnimation(){
    console.log('beginAnimation');
    this.viewBoxAnimation.beginElement();    
    this.svgRootElement.unpauseAnimations();    
  }

  render(){
    return <svg width="100%" height="100%" 
      ref={(e: SVGSVGElement) => { this.svgRootElement = e; }}
      >
      <animate 
        ref={(e: SVGAnimationElement) => { this.viewBoxAnimation = e; }}
        id={constants.VIEWBOX_ANIM_ID} attributeName="viewBox" fill="freeze" 
        dur={constants.ANIM_DURATION} 
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
      <ReactTransitionGroup component="g">
        <GraphNode node={this.state.node} allEdges={this.state.allEdges} kgraph={this.state.kgraph} isRoot={true} />
      </ReactTransitionGroup>
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
        <marker key={id} id={id} viewBox="0 -5 10 10" refX="0" refY="0" markerWidth={constants.ARROW_WIDTH} markerHeight={constants.ARROW_HEIGHT} orient={90 * i}><path d="M0,-5L10,0L0,5"></path></marker>
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

  shouldComponentUpdate(nextProps, nextState){
    //TODO: also do shallow compare of current and previous?
    return nextProps.kgraph.getKgraphNodeById(nextProps.node.id) !== undefined;   //verify that node exists on the given kgraph
  }

  componentWillUnmount () {
    console.log('componentWillUnmount', this.props.node.id);
  }

  componentWillAppear (callback) {
    console.log('componentWillAppear', this.props.node.id);
    setTimeout(callback,1);
  }

  componentWillEnter (callback) {
    console.log('componentWillEnter', this.props.node.id);
    setTimeout(callback,1);
  }

  componentWillLeave (callback) {
    console.log('componentWillLeave', this.props.node.id);
    setTimeout(callback,1);
  }

  componentWillMount(){
    console.log('componentWillMount', this.props.node.id);
  }

  componentDidMount() {
    console.log('componentDidMount', this.props.node.id);
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
    console.log('componentWillReceiveProps', this.props.node.id);

    if(JSON.stringify(props.node) === JSON.stringify(this.props.node)) return;
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

    var edgeKeys = {};

    //if(this.state.to.node.id === 'P') console.log('this.state.to.node', this.state.to.node);
    //TODO: animate transform. 
    return <g id={this.state.to.node.id} 
            className={'node ' + 
                        (isLeaf ? 'leaf' : 'compound') + ' ' + 
                        (this.state.to.node.$type ? 'type__' + this.state.to.node.$type : '')} >
      <animateTransform attributeName="transform" attributeType="XML"
               type="translate"
               fill="freeze" 
               begin={constants.beginAnimationId}
               dur={constants.ANIM_DURATION} 
               from={this.state.from.translate.x + ',' + this.state.from.translate.y} 
               to={this.state.to.translate.x + ',' + this.state.to.translate.y} />
      <rect visibility={this.props.isRoot ? 'hidden' : 'visible'} rx="2" ry="2">
        <animate attributeName="x" attributeType="XML"
                 fill="freeze" 
                 begin={constants.beginAnimationId}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.x} 
                 to={this.state.to.node.x} />
        <animate attributeName="y" attributeType="XML"
                 fill="freeze" 
                 begin={constants.beginAnimationId}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.y}
                 to={this.state.to.node.y} />
        <animate attributeName="width" attributeType="XML"
                 fill="freeze" 
                 begin={constants.beginAnimationId}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.width} 
                 to={this.state.to.node.width} />
        <animate attributeName="height" attributeType="XML"
                 fill="freeze" 
                 begin={constants.beginAnimationId}
                 dur={constants.ANIM_DURATION} 
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
                 begin={constants.beginAnimationId}
                 dur={constants.ANIM_DURATION} 
                 from={0} to={1} />
      </text>

      <ReactTransitionGroup component="g">
        { 
          this.props.node.children && this.props.node.children.map(child => (
            <GraphNode node={child} key={child.id} allEdges={this.props.allEdges} kgraph={this.props.kgraph} isRoot={false}/>
          ))
        }
      </ReactTransitionGroup>
      <ReactTransitionGroup component="g">
        { 
          myEdges.map((edge) => (
            <GraphEdge edge={edge} key={`${edge.id}_${edgeKeys[edge.id] === undefined ? edgeKeys[edge.id] = 0 : edgeKeys[edge.id]++}`}/>
          )) 
        }
      </ReactTransitionGroup>
    </g>;
  }
}
