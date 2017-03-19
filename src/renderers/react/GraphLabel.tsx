/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from '../../KGraph';
import * as React from "react";
import constants from '../../constants';
import Debug = require('debug');
const debug = Debug('GraphLabel');

interface GraphLabelProps {
  edge : KGraphEdge; 
  label : KGraphLabel;
  updateLayout : boolean;
}

interface GraphLabelAnimation {
  from : Point;
  to : Point;
}

export default class GraphLabel extends React.Component<GraphLabelProps, GraphLabelAnimation>  {

  initialRender : boolean;

  constructor(props){
    super(props);
    this._normalizeSelfLoopEdgeCoordinates(props.label, props.edge);
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
    debug('props.updateLayout', props.updateLayout);
    this._normalizeSelfLoopEdgeCoordinates(props.label, props.edge);
    var point = {
      x : props.label.x,
      y : props.label.y,
    };
    this.state = {
      from : this.state.to,
      to : point
    };
  }

  componentWillAppear (callback) {
    debug('componentWillAppear', this.props.edge.id);
    setTimeout(callback,1);
    //TODO: start the animation now? No.... Well maybe. We could set up a listener for the end event before we call the callback, in order to make this asynchronous
    //this might have the effect of buffering animations, which might work well. 
  }

  componentWillEnter (callback) {
    debug('componentWillEnter', this.props.edge.id);
    setTimeout(callback,1);
  }

  public render(){
    let toReturn = <text className="edge-label"
        textAnchor={this.props.label.$meta && this.props.label.$meta.textAnchor}
        dominantBaseline={this.props.label.$meta && this.props.label.$meta.dominantBaseline}
        opacity="0"
      >
        <animate attributeName="opacity" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={0} to={1} />
        <animate attributeName="x" attributeType="XML" fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 from={this.state.from.x}
                 to={this.state.to.x}
                 dur={constants.ANIM_DURATION}
                 />
        <animate attributeName="y" attributeType="XML" fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 from={this.state.from.y}
                 to={this.state.to.y}
                 dur={constants.ANIM_DURATION}
                 />
        <animate attributeName="opacity" attributeType="XML"
                 fill="freeze" 
                 begin="indefinite"
                 className={constants.START}
                 dur={constants.ANIM_DURATION} 
                 from={this.initialRender ? 0 : 1} to={1} />
      {this.props.label.text}
    </text>;

  this.initialRender = true;

  return toReturn;
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

