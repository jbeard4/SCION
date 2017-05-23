/// <reference path="./intrinsics.d.ts" />…
/// <reference path="./smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';
import GraphEdge from './GraphEdge';
import EventEmitter = require('events');
import _ = require('underscore');
import Debug = require('debug');
const debug = Debug('GraphNode');

import GraphRoot from './index';

let electron;
let Menu, MenuItem;
let remote;
try {
  electron = require('electron');
  remote = electron.remote;
  if(remote){ 
    Menu = remote.Menu;
    MenuItem = remote.MenuItem;
  }
} catch(e){
  //not in electron
}


export interface GraphNodeProps {
  node : KGraphNode;
  isRoot : boolean;
  graphRoot : GraphRoot;
  allEdges : KGraphEdge[];
  kgraph : KGraph;
  updateLayout : boolean;
  parentIsExiting : boolean;
  app : EventEmitter;
}

export interface KGraphNodeAnimation {
  node : KGraphNode;
  translate : {
    x : number;
    y : number;
  },
}

export interface GraphNodeAnimation {
  from : KGraphNodeAnimation;
  to : KGraphNodeAnimation;
  exiting? : boolean
}



export default class GraphNode extends React.Component<GraphNodeProps, GraphNodeAnimation> {

  initialRender : boolean;
  svgTextElement : SVGTextElement;
  svgRectElement : SVGRectElement;
  svgGElement : SVGGElement;
  animateTransformElement : SVGAnimationElement;
  animateXElement : SVGAnimationElement;
  animateYElement : SVGAnimationElement;
  animateWidthElement : SVGAnimationElement;
  animateHeightElement : SVGAnimationElement;
  animateOpacityElement : SVGAnimationElement;
  contextmenu : any;

  constructor(props){
    super(props);

    if(Menu) this.initContextMenu();

    let fromNode = {
      id : this.props.node.id,
      $type : this.props.node.$type,
      labels : this.props.node.labels,
      x : this.props.node.width / 2,
      y : this.props.node.height / 2,
      width : 0,
      height : 0
    };

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
    return nextProps.kgraph.getKgraphNodeById(nextProps.node.id) === nextProps.node;   //verify that node exists on the given kgraph
  }

  componentWillUnmount () {
    debug('componentWillUnmount', this.props.node.id);
  }

  componentWillAppear (callback) {
    debug('componentWillAppear', this.props.node.id);
    setTimeout(callback,1);
  }

  componentWillEnter (callback) {
    debug('componentWillEnter', this.props.node.id);
    setTimeout(callback,1);
  }

  componentWillMount(){
    debug('componentWillMount', this.props.node.id);
  }

  private initContextMenu(){
    const menu = new Menu()
    let items = [
      new MenuItem({
        label: 'Zoom to state', 
        click : () => {
          this.props.graphRoot.zoomToState(this.props.node.id);
        }
      }),
      new MenuItem({
        label: 'Expand/contract', 
        click : () => {
          console.log('Expand state/contract state');
          this.props.app.emit('state:dblclick', this.props.node.id, event);
        }
      })
    ];
    items.forEach( item => menu.append(item) );

    this.contextmenu = menu;
  }

  handleContextMenu(e){
    e.preventDefault()
    e.stopPropagation();
    this.contextmenu.popup(remote.getCurrentWindow())
  }

  _toNode(node){
    let toNode = {
      labels : node.labels,
      id : node.id,
      $type : node.$type,
      x : 0,
      y : 0,
      width : node.width,
      height : node.height
    };
    return {
      node : toNode,
      translate : {
        x : node.x,
        y : node.y
      }
    };
  }

  componentWillReceiveProps(props : GraphNodeProps){
    this.state = { 
      from : this.state.to,
      to : this._toNode(props.node)
    };
    debug('this.state', JSON.stringify(this.state));
  }

  handleDoubleClick(event){
    debug('handleDoubleClick', event, this.state.to.node);
    event.preventDefault();
    event.stopPropagation();
    
    this.props.app.emit('state:dblclick', this.props.node.id, event);
  }

  componentDidUpdate(){
    console.log('componentDidUpdate',this.props.node.id);
    //reset the timeline on all smil animations
    this.animate();
  }

  componentDidMount(){
    this.animate();
    this.svgGElement.addEventListener('contextmenu', this.handleContextMenu.bind(this))
  }

  private animate(){
    [
      this.animateTransformElement,
      this.animateXElement,
      this.animateYElement,
      this.animateWidthElement,
      this.animateHeightElement,
      this.animateOpacityElement 
    ].forEach( animation => animation.beginElement() );
  }
  
  render(){
    debug('render',this.state.to.node.id);

    var isLeaf = !(this.props.node.children && this.props.node.children.length);

    let myEdges;
    if(!this.state.exiting){
      let edgesOriginatingFromChildStateAndNotTargetingDescendant = 
        !this.props.node.children ? [] : 
        this.props.node.children.map((child) => 
            this.props.allEdges.
              filter( (edge) => (child.id === edge.source && !this.props.kgraph.isSourceAncestorOfTarget(edge.source, edge.target)))
          ).reduce( ((a,b) => a.concat(b) ), []);

      let edgesOriginatingFromThisStateAndTargetingDescendant = 
          this.props.allEdges.
            filter( (edge) => (this.props.node.id === edge.source && this.props.kgraph.isSourceAncestorOfTarget(edge.source, edge.target) ) )

      myEdges = edgesOriginatingFromThisStateAndTargetingDescendant.concat(
                        edgesOriginatingFromChildStateAndNotTargetingDescendant); 
    } else {
      myEdges = [];
    }

    var edgeKeys = {};

    let toReturn = <g id={this.state.to.node.id} 
            className={'node ' + 
                        (isLeaf ? 'leaf' : 'compound') + ' ' + 
                        (this.state.to.node.$type ? 'type__' + this.state.to.node.$type : '')} 
            ref={(e: SVGGElement) => { this.svgGElement = e; }}
            onDoubleClick={ this.handleDoubleClick.bind(this) }
            >
      <animateTransform attributeName="transform" attributeType="XML"
               ref={(e: SVGAnimationElement) => { this.animateTransformElement = e; }}
               type="translate"
               fill="freeze" 
               begin="indefinite"
               className={constants.START}
               dur={constants.ANIM_DURATION} 
               from={this.state.from.translate.x + ',' + this.state.from.translate.y} 
               to={this.state.to.translate.x + ',' + this.state.to.translate.y} />
      <rect visibility={this.props.isRoot ? 'hidden' : 'visible'} rx="2" ry="2"
        ref={(e: SVGRectElement) => { this.svgRectElement = e; }}
        >
        <animate attributeName="x" attributeType="XML"
                 ref={(e: SVGAnimationElement) => { this.animateXElement = e; }}
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.x} 
                 to={this.state.to.node.x} />
        <animate attributeName="y" attributeType="XML"
                 ref={(e: SVGAnimationElement) => { this.animateYElement = e; }}
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.y}
                 to={this.state.to.node.y} />
        <animate attributeName="width" attributeType="XML"
                 ref={(e: SVGAnimationElement) => { this.animateWidthElement = e; }}
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.width} 
                 to={this.state.to.node.width} />
        <animate attributeName="height" attributeType="XML"
                 ref={(e: SVGAnimationElement) => { this.animateHeightElement = e; }}
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.height} 
                 to={this.state.to.node.height} />
      </rect>
      <text   
        ref={(e: SVGTextElement) => { this.svgTextElement = e; }}
        x={this.props.node.width / 2} 
        y={isLeaf ? this.props.node.height / 2 : constants.LEAF_NODE_PADDING_H}  
        visibility={this.props.isRoot ? 'hidden' : 'visible'}
        opacity="0"
        >
        {this.props.node.$type === 'virtual' ? this.props.node.labels[0].text : this.props.node.id}
        <animate attributeName="opacity" attributeType="XML"
                 ref={(e: SVGAnimationElement) => { this.animateOpacityElement = e; }}
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.initialRender ? 1 : 0} to={this.state.exiting ? 0 : 1} />
      </text>

      <g className="childNodes">
        { 

          !this.state.exiting ? 
            (this.props.node.children && this.props.node.children.map(child => (
              <GraphNode
                app={this.props.app}
                node={child}
                key={child.id}
                allEdges={this.props.allEdges}
                kgraph={this.props.kgraph}
                isRoot={false}
                updateLayout={this.props.updateLayout}
                parentIsExiting={this.props.parentIsExiting || this.state.exiting}
                graphRoot={this.props.graphRoot}/>
          ))) : 
          []
        }
      </g>
      <g className="edges">
        { 
          !this.state.exiting ? 
            myEdges.map((edge, i) => (
              <GraphEdge edge={edge} key={`${this.props.node.id}_${i}`} updateLayout={this.props.updateLayout}/>
            ))  : 
            []
        }
      </g>
    </g>;

    this.initialRender = true;

    return toReturn;
    
  }


}
