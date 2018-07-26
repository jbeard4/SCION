/// <reference path="../tsd/smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';
import GraphEdge from './GraphEdge';
import EventEmitter = require('events');
import _ = require('underscore');
import Debug = require('debug');
import classNames = require('classnames');
import {GraphRoot} from './GraphRoot';
import GraphNodeLabel from './GraphNodeLabel';

const debug = Debug('GraphNode');

export interface GraphNodeProps {
  schviz : GraphRoot;
  node : KGraphNode;
  isRoot : boolean;
  graphRoot : GraphRoot;
  allEdges : KGraphEdge[];
  kgraph : KGraph;
  redraw? : boolean;
  configuration? : string[];
  disableAnimation? : boolean;
  enabledEdges : KGraphEdge[];
  previousConfiguration? : string[];
  statesForDefaultEntry : string[];
  selectedNodeId:string;
  selectedEdgeId:string;
  id?: string;
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
  svgRectElement : SVGRectElement;
  svgGElement : SVGGElement;
  animateTransformElement : SVGAnimationElement;
  animateXElement : SVGAnimationElement;
  animateYElement : SVGAnimationElement;
  animateWidthElement : SVGAnimationElement;
  animateHeightElement : SVGAnimationElement;
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
        nextProps.selectedNodeId !== this.props.selectedNodeId ||
        nextProps.selectedEdgeId !== this.props.selectedEdgeId ||
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
  }

  private animate(){
    if(!this.props.disableAnimation) [
      this.animateTransformElement,
      this.animateXElement,
      this.animateYElement,
      this.animateWidthElement,
      this.animateHeightElement,
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

    let exitInitialState;
    if(this.props.node.$type === 'initial'){
      //is transition originating from this state targeting stateForDefaultEntry?
      exitInitialState = 
        this.props.allEdges.
          filter( edge => this.state.to.node.id === edge.source && 
                          this.props.statesForDefaultEntry &&
                          this.props.statesForDefaultEntry.indexOf(edge.target) > -1 ).length;
    }

    let toReturn = <g id={`${this.props.id}:${this.state.to.node.id}`} 
            className={
              classNames({
                "node" : true,
                "leaf" : isLeaf,
                "compound" : !isLeaf,
                [`type__${this.props.node.$type}`] : 
                  this.props.node.$type !== 'final' ||
                    (
                      this.props.node.$type === 'final' && 
                      !( this.props.node.children && this.props.node.children.length && this.props.node.children.filter( childNode => childNode.$type === 'actionContainer' ))
                    ),
                "highlighted" : this.props.configuration && this.props.configuration.indexOf(this.state.to.node.id) > -1,
                "exited" : exitInitialState || (this.props.previousConfiguration && this.props.previousConfiguration.indexOf(this.state.to.node.id) > -1),
                "selected" : this.props.node.id === this.props.selectedNodeId
              })
            }
            ref={(e: SVGGElement) => { this.svgGElement = e; }}
            onDoubleClick={ this.handleDoubleClick.bind(this) }
            transform={this.props.disableAnimation && this.state.to.translate.x && this.state.to.translate.y ? ('translate(' + this.state.to.translate.x + ',' + this.state.to.translate.y + ')') : undefined}
            >
        {
          !this.props.disableAnimation && 
            <animateTransform attributeName="transform" attributeType="XML"
                     ref={(e: SVGAnimationElement) => { this.animateTransformElement = e; }}
                     type="translate"
                     fill="freeze" 
                     begin="indefinite"
                     className={constants.START}
                     dur={constants.ANIM_DURATION} 
                     from={this.state.from.translate.x + ',' + this.state.from.translate.y} 
                     to={this.state.to.translate.x + ',' + this.state.to.translate.y} />
        }
      <rect visibility={this.props.isRoot ? 'hidden' : 'visible'} rx="2" ry="2"
        ref={(e: SVGRectElement) => { this.svgRectElement = e; }}
        x={this.props.disableAnimation ? this.state.to.node.x : undefined}
        y={this.props.disableAnimation ? this.state.to.node.y : undefined}
        width={this.props.disableAnimation ? this.state.to.node.width : undefined}
        height={this.props.disableAnimation ? this.state.to.node.height : undefined}
        >
        {
          !this.props.disableAnimation && [
            <animate attributeName="x" attributeType="XML"
                     key="0"
                     ref={(e: SVGAnimationElement) => { this.animateXElement = e; }}
                     fill="freeze" 
                     begin="indefinite"
                     className={constants.START}
                     dur={constants.ANIM_DURATION} 
                     from={this.state.from.node.x} 
                     to={this.state.to.node.x} />,
            <animate attributeName="y" attributeType="XML"
                     key="1"
                     ref={(e: SVGAnimationElement) => { this.animateYElement = e; }}
                     fill="freeze" 
                     begin="indefinite"
                     className={constants.START}
                     dur={constants.ANIM_DURATION} 
                     from={this.state.from.node.y}
                     to={this.state.to.node.y} />,
            <animate attributeName="width" attributeType="XML"
                     key="2"
                     ref={(e: SVGAnimationElement) => { this.animateWidthElement = e; }}
                     fill="freeze" 
                     begin="indefinite"
                     className={constants.START}
                     dur={constants.ANIM_DURATION} 
                     from={this.state.from.node.width} 
                     to={this.state.to.node.width} />,
            <animate attributeName="height" attributeType="XML"
                     key="3"
                     ref={(e: SVGAnimationElement) => { this.animateHeightElement = e; }}
                     fill="freeze" 
                     begin="indefinite"
                     className={constants.START}
                     dur={constants.ANIM_DURATION} 
                     from={this.state.from.node.height} 
                     to={this.state.to.node.height} />
            ]
        }
      </rect>
      <GraphNodeLabel 
        node={this.props.node}
        isRoot={this.props.isRoot}
        disableAnimation={this.props.disableAnimation}
        />
      <g className="childNodes" transform={`translate(0,${this.props.node.$type === 'actionContainer' || this.props.node.$type === 'action' || this.props.node.$type === 'invoke' ? 2 : 0})`}>
        { 

            (this.props.node.children && this.props.node.children.map(child => (
              <GraphNode
                schviz={this.props.schviz}
                node={child}
                key={child.id}
                allEdges={this.props.allEdges}
                kgraph={this.props.kgraph}
                isRoot={false}
                graphRoot={this.props.graphRoot}
                redraw={this.props.redraw}
                configuration={this.props.configuration}
                disableAnimation={this.props.disableAnimation}
                enabledEdges={this.props.enabledEdges}
                previousConfiguration={this.props.previousConfiguration}
                statesForDefaultEntry={this.props.statesForDefaultEntry}
                selectedNodeId={this.props.selectedNodeId}
                selectedEdgeId={this.props.selectedEdgeId}
                id={this.props.id}
                />
          )))
        }
      </g>
      <g className="edges">
        { 
            myEdges.map((edge, idx) => (
              <GraphEdge edge={edge} key={`${this.props.node.id}_${idx}`} 
                redraw={this.props.redraw}
                disableAnimation={this.props.disableAnimation}
                selected={edge.id === this.props.selectedEdgeId}
                highlighted={ 
                  (
                    //the transition has been explicitly enabled
                    this.props.enabledEdges.indexOf(edge) > -1
                  ) || 
                  (
                    //handle transitions originating from initial states:
                    //the edge targets a state set for default entry
                    this.props.statesForDefaultEntry &&
                    this.props.statesForDefaultEntry.indexOf(edge.target) > -1 &&
                    //the edge originates from an initial state
                    this.props.kgraph.getKgraphNodeById(edge.source).$type === 'initial' 
                  ) 
                }
                id={this.props.id}
                />
            )) 
        }
      </g>
    </g>;

    this.initialRender = true;

    return toReturn;

  }


}
