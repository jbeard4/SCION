import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';

export interface GraphNodeLabelProps{
  node : KGraphNode;
  isRoot : boolean;
  disableAnimation? : boolean;
}

export default class GraphNodeLabel extends React.PureComponent<GraphNodeLabelProps, {}> {

  svgTextElement : SVGTextElement;
  animateOpacityElement : SVGAnimationElement;
  initialRender : boolean;

  componentDidMount(){
    this.animate();
  }

  private animate(){
    if(!this.props.disableAnimation) {
      this.animateOpacityElement.beginElement()
    }
  }

  render(){
    var isLeaf = !(this.props.node.children && this.props.node.children.length);
    const renderAsSingleLine = this.props.node.labels[0] && this.props.node.labels[0].text.trim().split('\n').length === 1;
    return <text   
      ref={(e: SVGTextElement) => { this.svgTextElement = e; }}
      x={this.props.node.$type === 'contentContainer' && !renderAsSingleLine  ? 0 : this.props.node.width / 2} 
      y={this.props.node.$type === 'contentContainer' && !renderAsSingleLine  ? 0 : (isLeaf ? this.props.node.height / 2 : constants.LEAF_NODE_PADDING_H)}  
      visibility={this.props.isRoot ? 'hidden' : 'visible'}
      opacity={this.props.disableAnimation ? 1 : 0}
      >
      {
        this.props.node.labels[0] && this.props.node.labels[0].text &&
        (
         this.props.node.$type === 'contentContainer' ? 
          (
            renderAsSingleLine ? 
            this.props.node.labels[0].text.trim() : 
             this.props.node.labels[0].text.replace(/ /g,`\u00A0`)
               .split('\n')
               .map( (line,i) => <tspan textAnchor="start" key={i} x={0} dy={i===0 ? undefined : "1em"}>{i === 0 ? line : line.slice(0) }</tspan> ) 
          ) : this.props.node.labels[0].text
        )
      }
      {
        !this.props.disableAnimation && 
          <animate attributeName="opacity" attributeType="XML"
                   ref={(e: SVGAnimationElement) => { this.animateOpacityElement = e; }}
                   fill="freeze" 
                   begin="indefinite"
                   className={constants.START}
                   dur={constants.ANIM_DURATION} 
                   from={this.initialRender ? 1 : 0} 
                   to="1" />
      }
    </text>;
  }
}
