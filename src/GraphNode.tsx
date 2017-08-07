/// <reference path="./smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';
import GraphEdge from './GraphEdge';
import EventEmitter = require('events');
import _ = require('underscore');
import Debug = require('debug');
import classNames = require('classnames');
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
  redraw? : boolean;
  configuration? : string[]
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
}



export default class GraphNode extends React.PureComponent<GraphNodeProps, GraphNodeAnimation> {

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

  private getInitialFrom(props){
    return {
      node : {
        id : props.node.id,
        $type : props.node.$type,
        labels : props.node.labels,
        x : props.node.width / 2,
        y : props.node.height / 2,
        width : 0,
        height : 0,
      },
      translate : {
        x : props.node.x,
        y : props.node.y
      }
    };
  }

  constructor(props){
    super(props);

    if(Menu) this.initContextMenu();

    this.state = {
      from : this.getInitialFrom(props),
      to : this._toNode(this.props.node)
    };
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
          //this.props.app.emit('state:dblclick', this.props.node.id, event);
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
      from : props.redraw ? this.getInitialFrom(props) : this.state.to,
      to : this._toNode(props.node)
    };
    debug('this.state', JSON.stringify(this.state));
  }

  handleDoubleClick(event){
    debug('handleDoubleClick', event, this.state.to.node);
    event.preventDefault();
    event.stopPropagation();
    
    //TODO: restore this behavior
    //this.props.app.emit('state:dblclick', this.props.node.id, event);
  }

  shouldComponentUpdate(nextProps: GraphNodeProps, nextState: GraphNodeAnimation){
    let x = 
        nextProps.node !== this.props.node || 
        nextProps.isRoot  !== this.props.isRoot || 
        nextProps.graphRoot  !== this.props.graphRoot || 
        //nextProps.allEdges  !== this.props.allEdges || 
        nextProps.kgraph  !== this.props.kgraph || 
        //nextProps.redraw !== this.props.redraw || 
        (function(s1, s2){
          if(!s1 && !s2){
            return false;
          }

          const s1IsArray = Array.isArray(s1),
                s2IsArray = Array.isArray(s2);
          if((s1IsArray && !s2IsArray) || 
                (!s1IsArray && s2IsArray)){
            return true;
          }

          if (s1.length !== s2.length) {
            return true;
          }

          for (var v of s1) {
            if (s2.indexOf(v) === -1) {
                return true;
            }
          }
          for (var v of s1) {
            if (s1.indexOf(v) === -1) {
                return true;
            }
          }
          return false;
        })(nextProps.configuration, this.props.configuration)
        

    //console.log('shouldComponentUpdate', this.props.node.id, x);

    return x;
  }

  componentDidUpdate(){
    //console.log('GraphNode: componentDidUpdate',this.props.node.id);
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

    var edgeKeys = {};
    let toReturn = <g id={this.state.to.node.id} 
            className={
              classNames({
                "node" : true,
                "leaf" : isLeaf,
                "compound" : !isLeaf,
                [`type__${this.state.to.node.$type}`] : this.state.to.node.$type,
                "highlighted" : this.props.configuration && this.props.configuration.indexOf(this.state.to.node.id) > -1
              })
            }
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
                 from={this.initialRender ? 1 : 0} to={1} />
      </text>

      <g className="childNodes">
        { 

            (this.props.node.children && this.props.node.children.map(child => (
              <GraphNode
                node={child}
                key={child.id}
                allEdges={this.props.allEdges}
                kgraph={this.props.kgraph}
                isRoot={false}
                graphRoot={this.props.graphRoot}
                redraw={this.props.redraw}
                configuration={this.props.configuration}
                />
          )))
        }
      </g>
      <g className="edges">
        { 
            myEdges.map((edge, i) => (
              <GraphEdge edge={edge} key={`${this.props.node.id}_${i}`} 
                redraw={this.props.redraw}
                />
            )) 
        }
      </g>
    </g>;

    this.initialRender = true;

    return toReturn;
    
  }


}
