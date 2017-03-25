/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from '../../KGraph';
import * as React from "react";
import constants from '../../constants';
import GraphEdge from './GraphEdge';
import EventEmitter = require('events');
let ReactTransitionGroup = require('react-addons-transition-group');
import Debug = require('debug');
const debug = Debug('GraphNode');
import electron = require('electron');
import GraphNode from './GraphNode';

export interface GraphRootProps {
  allEdges : KGraphEdge[];
  kgraph : KGraph;
  semaphore : any;
  updateLayout : boolean;
  parentIsExiting : boolean;
  app : EventEmitter;
}

interface GraphRootAnimation {
  fromNode : KGraphNode;
  toNode : KGraphNode;
  fromZoom : SVGRect;
  toZoom : SVGRect;
  fastZoom? : boolean;
  instantZoom? : boolean;
}

export class GraphRoot extends React.Component<GraphRootProps, GraphRootAnimation> {

  private svgRootElement : SVGSVGElement;
  private viewBoxAnimation : SVGAnimationElement;
  private defaultRect : SVGRect;

  constructor(props:GraphRootProps){
    super(props);
    let node = props.kgraph.root;
    this.state = {
      fromZoom : {x : 0, y : 0, width : node.width, height : node.height},
      toZoom : {x : 0, y : 0, width : node.width, height : node.height},
      toNode : node,
      fromNode : node
    };
    props.semaphore[node.id] = true;
  }

  public pauseAnimation(){
    debug('pauseAnimation');
    this.svgRootElement.pauseAnimations();
  }

  public beginAnimation(updateLayout : boolean, animateViewboxOnly? : boolean){
    debug('beginAnimation');

    let resetAnimationsAndUnpause = () => {
      if(animateViewboxOnly){
        this.viewBoxAnimation.beginElement();
      } else {
        Array.from(this.svgRootElement.querySelectorAll('animateTransform.beginOnStart, animate.beginOnStart')).forEach( (e : SVGAnimationElement) => e.beginElement() );
      }
      this.svgRootElement.unpauseAnimations();
    }

    if(updateLayout){
      setTimeout(resetAnimationsAndUnpause);
    } else {
      resetAnimationsAndUnpause();
    }

  }

  toViewportCoordinates(event){
    //convert event client coordinates (which are in screen coordinates) to viewport coordinates
    var pt = this.svgRootElement.createSVGPoint();
    pt.x = event.clientX; 
    pt.y = event.clientY;
    return pt.matrixTransform(this.svgRootElement.getScreenCTM().inverse());
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

    let pt2 = this.toViewportCoordinates(event);

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
    toZoom.width = toZoom.width < 10 ? 10 : toZoom.width;
    toZoom.height = toZoom.height < 10 ? 10 : toZoom.height;

    this.viewBoxAnimation.setAttributeNS(null, 'from', this.svgRectToViewBox(fromZoom));
    this.viewBoxAnimation.setAttributeNS(null, 'to', this.svgRectToViewBox(toZoom));
    this.viewBoxAnimation.setAttributeNS(null, 'dur', '250ms');
    this.state.toZoom = toZoom;
    this.state.fromZoom = toZoom;
    this.viewBoxAnimation.beginElement();
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

  //later, try handleMouseClick
  handleClick(event){
    debug('handleClick', event);
  }

  eventStamp : SVGPoint;
  eventBuffer : Array<SVGPoint>;
  deltaBuffer : Array<SVGPoint>;
  initialZoom : SVGRect;

  handleMouseDown(event){
    debug('handleMouseDown', event);
    if(event.button !== 0) return;
    this.eventBuffer = [];
    this.deltaBuffer = [];
    this.eventStamp = this.svgRootElement.createSVGPoint();
    this.eventStamp.x = event.clientX;
    this.eventStamp.y = event.clientY;
    this.initialZoom = this.state.toZoom;
  }

  handleMouseUp(event){
    debug('handleMouseUp', event);
    console.log('this.eventBuffer',this.eventBuffer);
    console.log('this.deltaBuffer',this.deltaBuffer);
    this.eventStamp = null;
    this.eventBuffer = null;
    this.deltaBuffer = null;
    this.initialZoom = null;
  }

  handleMouseMove(event){
    if(!this.eventStamp) return;

    debug('handleMouseMove', event.clientX, event.clientY);
    let pt1 = this.eventStamp;
    let pt2 = this.svgRootElement.createSVGPoint();
    pt2.x = event.clientX;
    pt2.y = event.clientY;

    //if(pt1.x !== pt2.x || pt1.y !== pt2.y) debugger;

    var tdelta = this.svgRootElement.createSVGPoint();
    tdelta.x = pt2.x - pt1.x ; 
    tdelta.y = pt2.y - pt1.y;

    let ctm = this.svgRootElement.getScreenCTM()
    tdelta.x /= ctm.a;
    tdelta.y /= ctm.d;

    //compute delta
    debug('tdelta', tdelta.x, tdelta.y);

    //compute toZoom viewBox coordinates
    //first compute height
    let x = this.initialZoom.x - tdelta.x;
    let y = this.initialZoom.y - tdelta.y;

    let toZoom = {
      x : x,
      y : y,
      width : this.initialZoom.width,
      height : this.initialZoom.height
    };
    
    let viewBox = `${toZoom.x} ${toZoom.y} ${toZoom.width} ${toZoom.height}`;
    this.viewBoxAnimation.setAttributeNS(null, 'from', viewBox);
    this.viewBoxAnimation.setAttributeNS(null, 'to', viewBox);
    this.viewBoxAnimation.setAttributeNS(null, 'dur', '0ms');
    this.state.toZoom = toZoom;
    this.state.fromZoom = toZoom;
    this.viewBoxAnimation.beginElement();

    /*
    this.pauseAnimation();
    this.setState({
      fromZoom : this.state.toZoom,
      toZoom : toZoom,
      fromNode : this.state.toNode,
      toNode : this.state.toNode, 
      fastZoom : false,
      instantZoom : true
    }, () => {
      this.beginAnimation(false, true);
    });
    */
  }

  render(){

    debug('render graphroot', this.props.updateLayout);
    
    let from = `${[this.state.fromZoom.x, this.state.fromZoom.y, this.state.fromZoom.width,this.state.fromZoom.height].join(' ')}`;
    let to = `${[this.state.toZoom.x, this.state.toZoom.y, this.state.toZoom.width, this.state.toZoom.height].join(' ')}`;
    let viewBoxValues = `${from};${to}`;
    debug('viewBoxValues ', viewBoxValues );
    return <svg width="100%" height="100%" 
      ref={(e: SVGSVGElement) => { this.svgRootElement = e; }}
      onWheel={this.handleMouseWheel.bind(this)}
      onClick={this.handleClick.bind(this)}
      onMouseDown={this.handleMouseDown.bind(this)}
      onMouseUp={this.handleMouseUp.bind(this)}
      onMouseMove={this.handleMouseMove.bind(this)}
      >
      <animate 
        className={constants.START}
        ref={(e: SVGAnimationElement) => { this.viewBoxAnimation = e; }}
        attributeName="viewBox" fill="freeze" begin="indefinite"
        dur={this.state.instantZoom ? '0ms' : ( this.state.fastZoom ? '250ms' : constants.ANIM_DURATION ) } 
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

    let toZoom = {
      x : m.e,
      y : m.f,
      width : bbox.width,
      height : bbox.height
    };

    let fromZoom = this.svgRootElement.viewBox.animVal;

    let fromViewBox = this.svgRectToViewBox(fromZoom);
    let toViewBox = this.svgRectToViewBox(toZoom);

    this.viewBoxAnimation.setAttributeNS(null, 'from', fromViewBox);
    this.viewBoxAnimation.setAttributeNS(null, 'to', toViewBox);
    this.viewBoxAnimation.setAttributeNS(null, 'dur', '250ms');
    this.state.toZoom = toZoom;
    this.state.fromZoom = toZoom;
    this.viewBoxAnimation.beginElement();
  }

  private svgRectToViewBox(rect : SVGRect){
    return `${rect.x} ${rect.y} ${rect.width} ${rect.height}`;
  }
}

