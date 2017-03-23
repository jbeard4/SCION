/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from '../../KGraph';
import * as React from "react";
import constants from '../../constants';
import GraphEdge from './GraphEdge';
import EventEmitter = require('events');
import _ = require('underscore');
import Q = require('q');
let ReactTransitionGroup = require('react-addons-transition-group');
import Debug = require('debug');
const debug = Debug('GraphNode');
import electron = require('electron');

const remote = electron.remote;
const {Menu, MenuItem} = remote;

interface GraphRootProps {
  allEdges : KGraphEdge[];
  kgraph : KGraph;
  semaphore : any;
  updateLayout : boolean;
  parentIsExiting : boolean;
  app : EventEmitter;
}

interface GraphNodeProps extends GraphRootProps {
  node : KGraphNode;
  isRoot : boolean;
  graphRoot : GraphRoot;
}

interface KGraphNodeAnimation {
  node : KGraphNode;
  translate : {
    x : number;
    y : number;
  },
}

interface GraphNodeAnimation {
  from : KGraphNodeAnimation;
  to : KGraphNodeAnimation;
  exiting? : boolean
}

interface GraphRootAnimation {
  fromNode : KGraphNode;
  toNode : KGraphNode;
  fromZoom : SVGRect;
  toZoom : SVGRect;
  fastZoom? : boolean;
}

export default class GraphRoot extends React.Component<GraphRootProps, GraphRootAnimation> {

  private svgRootElement : SVGSVGElement;
  private viewBoxAnimation : SVGAnimationElement;
  private defaultRect : SVGRect;

  constructor(props:GraphRootProps){
    super(props);
    let node = props.kgraph.root;
    this.defaultRect = {x:0, y:0, width:0,height:0};
    this.state = {
      fromZoom : this.defaultRect,
      toZoom : this.defaultRect,
      toNode : node,
      fromNode : node
    };
    props.semaphore[node.id] = true;

    /*
    document.addEventListener('keydown', (e) => {
      this.setState({
        fromZoom : this.state.toZoom,
        toZoom : this.defaultRect,
        fromNode : this.state.toNode,
        toNode : this.state.toNode
      }, () => {
        setTimeout(this.beginAnimation(false),1);
      });
      
    });
    */
  }

  public pauseAnimation(){
    debug('pauseAnimation');
    this.svgRootElement.pauseAnimations();
  }

  public beginAnimation(updateLayout : boolean){
    debug('beginAnimation');

    let resetAnimationsAndUnpause = () => {
      Array.from(this.svgRootElement.querySelectorAll('animateTransform.beginOnStart, animate.beginOnStart')).forEach( (e : SVGAnimationElement) => e.beginElement() );
      this.svgRootElement.unpauseAnimations();
    }

    if(updateLayout){
      setTimeout(resetAnimationsAndUnpause);
    } else {
      resetAnimationsAndUnpause();
    }

  }

  handleMouseWheel(event){
    debug('handleMouseWheel', event.clientX, event.clientY, event);
    event.preventDefault();
    event.stopPropagation();

    let n = event.deltaY > 0 ? 1 : -1;
    let delta = 10 * n;
    
    let fromZoom = this.svgRootElement.viewBox.animVal;
    //aspect ratio
    let aspectRatio = fromZoom.width / fromZoom.height; 

    //convert event client coordinates (which are in screen coordinates) to viewport coordinates
    var pt = this.svgRootElement.createSVGPoint();
    pt.x = event.clientX; 
    pt.y = event.clientY;
    let pt2 = pt.matrixTransform(this.svgRootElement.getScreenCTM().inverse());

    //compute toZoom viewBox coordinates
    //first compute height
    let height = this.state.toZoom.height - delta;
    let width = aspectRatio * height;
    let x = pt2.x - (width / 2);
    let y = pt2.y - (height / 2);

    let toZoom = {
      x : x,
      y : y,
      width : width,
      height : height
    };
    toZoom.x = toZoom.x < 0 ? 0 : toZoom.x;
    toZoom.y = toZoom.y < 0 ? 0 : toZoom.y;
    toZoom.width = toZoom.width > this.state.toNode.width ? this.state.toNode.width : toZoom.width;
    toZoom.height = toZoom.height > this.state.toNode.height ? this.state.toNode.height : toZoom.height;

    this.pauseAnimation();
    this.setState({
      fromZoom : fromZoom,
      toZoom : toZoom,
      fromNode : this.state.toNode,
      toNode : this.state.toNode, 
      fastZoom : true
    }, () => {
      setTimeout(this.beginAnimation(false),1);
    });
  }

  componentWillReceiveProps(props : GraphRootProps){
    let node = props.kgraph.root;
    if(props.semaphore[node.id]) return;

    props.semaphore[node.id] = true;

    this.setState({ 
      fromZoom : this.state.fromZoom,
      toZoom : this.state.toZoom,
      fromNode : this.state.toNode,
      toNode : node
    });
  }

  render(){

    debug('render graphroot', this.props.updateLayout);
    
    let from = `${[this.state.fromZoom.x || this.state.fromNode.x || 0, this.state.fromZoom.y || this.state.fromNode.y || 0, this.state.fromZoom.width || this.state.fromNode.width,this.state.fromZoom.height || this.state.fromNode.height].join(' ')}`;
    let to = `${[this.state.toZoom.x || this.state.toNode.x || 0, this.state.toZoom.y || this.state.toNode.y || 0, this.state.toZoom.width || this.state.toNode.width, this.state.toZoom.height || this.state.toNode.height].join(' ')}`;
    let viewBoxValues = `${from};${to}`;
    debug('viewBoxValues ', viewBoxValues );
    return <svg width="100%" height="100%" 
      ref={(e: SVGSVGElement) => { this.svgRootElement = e; }}
      onWheel={this.handleMouseWheel.bind(this)}
      >
      <animate 
        className={constants.START}
        ref={(e: SVGAnimationElement) => { this.viewBoxAnimation = e; }}
        attributeName="viewBox" fill="freeze" begin="indefinite"
        dur={this.state.fastZoom ? '250ms' : constants.ANIM_DURATION} 
        from={from}
        to={to}/>
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
        <GraphNode
          app={this.props.app}
          node={this.props.kgraph.root}
          allEdges={this.props.allEdges}
          kgraph={this.props.kgraph}
          isRoot={true}
          semaphore={this.props.semaphore}
          updateLayout={this.props.updateLayout}
          parentIsExiting={this.props.parentIsExiting}
          graphRoot={this}/>
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

  zoomToState(stateId){
    let e = (document.getElementById(stateId)) as any as SVGGElement;
    let bbox:SVGRect = e.getBBox();
    let m0:SVGMatrix = this.svgRootElement.getCTM();
    let m1:SVGMatrix = e.getCTM();
    let m = m0.inverse().multiply(m1);
    let x = m.e,
        y = m.f,
        width = bbox.width,
        height = bbox.height;
    this.setState({
      fromZoom : this.state.toZoom,
      toZoom : {
        x : m.e,
        y : m.f,
        width : bbox.width,
        height : bbox.height
      },
      fromNode : this.state.fromNode,
      toNode : this.state.toNode
    }, () => {
      setTimeout(this.beginAnimation(false),1);
    });
  }

}


class GraphNode extends React.Component<GraphNodeProps, GraphNodeAnimation> {

  initialRender : boolean;
  svgTextElement : SVGTextElement;
  svgRectElement : SVGRectElement;
  svgGElement : SVGGElement;
  rectXAnimationElement : SVGAnimationElement;
  contextmenu : any;

  constructor(props){
    super(props);

    this.initContextMenu();

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

  _exit(callback?){

    /* FIXME: I would prefer to use SMIl for exit animation, but this is not possible,
 *            as render will never be called after componentWillLeave.
 *            TODO: see if I can force re-render.
 *  */
    let toNode = Object.create(new EventEmitter()) as KGraphNode;
    _.extend(toNode, {
      id : this.state.to.node.id,
      $type : this.state.to.node.$type,
      labels : this.state.to.node.labels,
      x : this.state.to.node.width / 2,
      y : this.state.to.node.height / 2,
      width : 0,
      height : 0
    });

    this.state = { 
      from : this.state.to,
      to : {
        node : toNode,
        translate : this.state.to.translate
      },
      exiting : true
    };

    debug('exit animation for node', this.state.to.node.id, this.state);

    this.forceUpdate();   //it seems to be always necessary to force an update here

    if(callback) this.rectXAnimationElement.addEventListener('endEvent', callback);
  }

  componentWillLeave (callback) {
    debug('componentWillLeave', this.props.node.id);
    this._exit(callback);
  }

  componentWillMount(){
    debug('componentWillMount', this.props.node.id);
  }

  componentDidMount() {
    debug('componentDidMount', this.props.node.id);
    this.svgGElement.addEventListener('contextmenu', this.handleContextMenu.bind(this))
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
    debug('componentWillReceiveProps', this.props.node.id, props.semaphore[this.props.node.id], props);
    debug('props.updateLayout', props.updateLayout);
    debug('props.parentIsExiting', props.parentIsExiting);

    if(props.parentIsExiting){
      this._exit();
      return;   //we probably don't need to force him to update
    }

    if(props.semaphore[this.props.node.id]) return;

    props.semaphore[this.props.node.id] = true;

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
            onDoubleClick={this.handleDoubleClick.bind(this)}
            ref={(e: SVGGElement) => { this.svgGElement = e; }}
            >
      <animateTransform attributeName="transform" attributeType="XML"
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
                 ref={(e: SVGAnimationElement) => { this.rectXAnimationElement = e; }}
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.x} 
                 to={this.state.to.node.x} />
        <animate attributeName="y" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.y}
                 to={this.state.to.node.y} />
        <animate attributeName="width" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.state.from.node.width} 
                 to={this.state.to.node.width} />
        <animate attributeName="height" attributeType="XML"
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
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.initialRender ? 1 : 0} to={this.state.exiting ? 0 : 1} />
      </text>

      <ReactTransitionGroup component="g" className="childNodes">
        { 
          this.props.node.children && this.props.node.children.map(child => (
            <GraphNode
              app={this.props.app}
              node={child}
              key={child.id}
              allEdges={this.props.allEdges}
              kgraph={this.props.kgraph}
              isRoot={false}
              semaphore={this.props.semaphore}
              updateLayout={this.props.updateLayout}
              parentIsExiting={this.props.parentIsExiting || this.state.exiting}
              graphRoot={this.props.graphRoot}/>
          ))
        }
      </ReactTransitionGroup>
      <ReactTransitionGroup component="g" className="edges">
        { 
          myEdges.map((edge, i) => (
            <GraphEdge edge={edge} key={`${this.props.node.id}_${i}`} semaphore={this.props.semaphore} updateLayout={this.props.updateLayout}/>
          )) 
        }
      </ReactTransitionGroup>
    </g>;

    this.initialRender = true;

    return toReturn;
    
  }


}
