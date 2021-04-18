/// <reference path="../tsd/smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';
import Debug = require('debug');
import classNames = require('classnames');
const debug = Debug('GraphLabel');

export interface GraphLabelProps {
  label : KGraphLabel;
  redraw? : boolean;
  disableAnimation? : boolean;
  highlighted? : boolean;
}

export interface GraphLabelAnimation {
  from : Point;
  to : Point;
}

export default class GraphLabel extends React.PureComponent<GraphLabelProps, GraphLabelAnimation>  {

  initialRender : boolean;
  animateOpacityElement : SVGAnimationElement;
  animateXElement : SVGAnimationElement;
  animateYElement : SVGAnimationElement;
  svgTextElement : SVGTextElement;

  constructor(props){
    super(props);
    var point = {
      x : props.label.x,
      y : props.label.y,
    };
    this.state = {
      from : point,
      to : point
    };
  }

  componentWillReceiveProps(props : GraphLabelProps){
    debug('componentWillReceiveProps', props);
    var point = {
      x : props.label.x,
      y : props.label.y,
    };
    this.state = {
      from : props.redraw ? point : this.state.to,
      to : point
    };
  }

  componentWillAppear (callback) {
    setTimeout(callback,1);
    //TODO: start the animation now? No.... Well maybe. We could set up a listener for the end event before we call the callback, in order to make this asynchronous
    //this might have the effect of buffering animations, which might work well. 
  }

  componentWillEnter (callback) {
    setTimeout(callback,1);
  }

  public render(){
    let toReturn = <text className={
          classNames({
            "edge-label" : true,
            "highlighted" : this.props.highlighted
          })
        }
        ref={(e: SVGTextElement) => { this.svgTextElement = e; }}
        textAnchor={this.props.label.$meta && this.props.label.$meta.textAnchor}
        dominantBaseline={(this.props.label.$meta && this.props.label.$meta.dominantBaseline) || 'text-before-edge'}
        x={this.props.disableAnimation ? this.state.to.x : undefined}
        y={this.props.disableAnimation ? this.state.to.y : undefined}
        opacity={this.props.disableAnimation ? 1 : 0}
      >
        {
          !this.props.disableAnimation && [
            <animate attributeName="x" attributeType="XML" fill="freeze" 
                     begin="indefinite"
                     key="0"
                     from={this.state.from.x}
                     to={this.state.to.x}
                     dur={constants.ANIM_DURATION}
                     ref={(e: SVGAnimationElement) => { this.animateXElement = e; }}
                     />,
            <animate attributeName="y" attributeType="XML" fill="freeze" 
                     begin="indefinite"
                     key="1"
                     from={this.state.from.y}
                     to={this.state.to.y}
                     dur={constants.ANIM_DURATION}
                     ref={(e: SVGAnimationElement) => { this.animateYElement = e; }}
                     />,
            <animate attributeName="opacity" attributeType="XML"
                     key="2"
                     fill="freeze" 
                     begin="indefinite"
                     dur={constants.ANIM_DURATION} 
                     from={this.initialRender && !this.props.redraw ? 1 : 0}  
                     to={1} 
                     ref={(e: SVGAnimationElement) => { this.animateOpacityElement = e; }}
                     />
          ]
        }
      {this.props.label.text}
    </text>;

    this.initialRender = true;

    return toReturn;
  }

  componentDidUpdate(){
    //console.log('GraphLabel: componentDidUpdate',this.props.label);
    this.animate();
  }

  componentDidMount(){
    this.animate();
  }

  private animate(){
    //reset the timeline on all smil animations
    if(!this.props.disableAnimation) [
      this.animateXElement,
      this.animateYElement,
      this.animateOpacityElement 
    ].forEach( animation => animation.beginElement() );
  }

}

