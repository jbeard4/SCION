import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';

export interface GraphNodeLabelProps{
  node : KGraphNode;
  isRoot : boolean;
  disableAnimation? : boolean;
}

export interface GraphNodeLabelAnimation {
  from : KGraphNode;
  initialRender : boolean;
}

export default class GraphNodeLabel extends React.PureComponent<GraphNodeLabelProps, GraphNodeLabelAnimation> {

  svgTextElement : SVGTextElement;
  animateXElement : SVGAnimationElement;
  animateYElement : SVGAnimationElement;
  animateOpacityElement : SVGAnimationElement;

  constructor(){
    super();
    this.state = { 
      from : null,
      initialRender : true
    };
  }

  componentWillReceiveProps(props : GraphNodeLabelProps){
    this.state = {
      from : this.props.node,
      initialRender : false
    };
  }

  componentDidUpdate(){
    //console.log('GraphLabel: componentDidUpdate',this.props.label);
    this.animate();
  }

  componentDidMount(){
    this.animate();
  }

  private animate(){
    if(!this.props.disableAnimation) {
      [
        this.animateXElement,
        this.animateYElement,
        this.animateOpacityElement 
      ].forEach( animation => animation.beginElement() );
    }
  }

  renderAsSingleLine(node){
    return node.labels[0] && node.labels[0].text.trim().split('\n').length === 1;
  }

  toX(node){
    return node.$type === 'contentContainer' && !this.renderAsSingleLine(node)  ? 0 : node.width / 2;
  }

  toY(node){
    const isLeaf = !(node.children && node.children.length);
    return node.$type === 'contentContainer' && !this.renderAsSingleLine(node)  ? 0 : (isLeaf ? node.height / 2 : constants.LEAF_NODE_PADDING_H);
  }

  render(){
    const fromX = this.toX(this.state.from || this.props.node);
    const fromY = this.toY(this.state.from || this.props.node);
    const toX = this.toX(this.props.node);
    const toY = this.toY(this.props.node);
    return <text   
      ref={(e: SVGTextElement) => { this.svgTextElement = e; }}
      x={this.props.disableAnimation ? toX : undefined}
      y={this.props.disableAnimation ? toY : undefined}
      visibility={this.props.isRoot ? 'hidden' : 'visible'}
      opacity={this.props.disableAnimation ? 1 : 0}
      >
      {
        this.props.node.labels[0] && this.props.node.labels[0].text &&
        (
         this.props.node.$type === 'contentContainer' ? 
          (
            this.renderAsSingleLine(this.props.node) ? 
            this.props.node.labels[0].text.trim() : 
             this.props.node.labels[0].text.replace(/ /g,`\u00A0`)
               .split('\n')
               .map( (line,i) => <tspan textAnchor="start" key={i} x={0} dy={i===0 ? undefined : "1em"}>{i === 0 ? line : line.slice(0) }</tspan> ) 
          ) : this.props.node.labels[0].text
        )
      }
      {
        !this.props.disableAnimation && 
          [
            <animate attributeName="x" attributeType="XML" fill="freeze" 
                     begin="indefinite"
                     key="0"
                     from={fromX}
                     to={toX}
                     dur={constants.ANIM_DURATION}
                     ref={(e: SVGAnimationElement) => { this.animateXElement = e; }}
                     />,
            <animate attributeName="y" attributeType="XML" fill="freeze" 
                     begin="indefinite"
                     key="1"
                     from={fromY}
                     to={toY}
                     dur={constants.ANIM_DURATION}
                     ref={(e: SVGAnimationElement) => { this.animateYElement = e; }}
                     />,
            <animate attributeName="opacity" attributeType="XML"
                     key="2"
                     ref={(e: SVGAnimationElement) => { this.animateOpacityElement = e; }}
                     fill="freeze" 
                     begin="indefinite"
                     className={constants.START}
                     dur={constants.ANIM_DURATION} 
                     from={this.state.initialRender ? 0 : 1} 
                     to="1" />
          ]
      }
    </text>;
  }
}
