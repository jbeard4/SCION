import constants from '../../constants';
import events from '../../events';
import _ = require('underscore');
import q = require('q');
import ReactDOM = require('react-dom');
import * as React from "react";

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from '../../KGraph';

import IKGraphRenderBackend from '../IKGraphRenderBackend';

const SVGNS = 'http://www.w3.org/2000/svg';

export default class SVGRenderer implements IKGraphRenderBackend {

  _parentNode:SVGElement;

  public constructor(parentNode:SVGElement){
    this._parentNode = parentNode;
  }
  public clear(){
  }
  public highlightState(stateId:string){
  }
  public unhighlightState(stateId:string){
  }
  public unhighlightAllStates(){
  }
  public highlightTransition(sourceStateId:string, targetStateIds:string[]){
  }
  public measureTextDimensions(text:string){
    var txt = document.createElementNS(SVGNS,'text');
    txt.textContent = text; 
    this._parentNode.appendChild(txt);
    var bbox = txt.getBBox();
    this._parentNode.removeChild(txt);
    return bbox; 
  }
  public render(kgraph:KGraph){
    var root = <GraphRoot node={kgraph.root}/>;
    var x = ReactDOM.render(root, this._parentNode);
  }

}

interface GraphNodeProps {
  node : KGraphNode
}

class GraphRoot extends React.Component<GraphNodeProps, {}> {

  render(){
    return <svg width="100%" height="100%" viewBox={'0 0 ' + this.props.node.width + ' ' + this.props.node.height}>
      <g className="node compound">
        <rect x={this.props.node.x} y={this.props.node.y} width={this.props.node.width} height={this.props.node.height}/>
        {this.props.node.children && this.props.node.children.map(child => (
          <GraphNode node={child} key={child.id} />
        ))}
      </g>
    </svg>;
  }

}

class GraphNode extends React.Component<GraphNodeProps, {}> {

  render(){
    var isLeaf = !(this.props.node.children && this.props.node.children.length);
    return <g id={this.props.node.id} 
            className={'node ' + 
                        (isLeaf ? 'leaf' : 'compound') + ' ' + 
                        (this.props.node.$type ? 'type__' + this.props.node.$type : '')} 
            transform={'translate(' + this.props.node.x + ',' + this.props.node.y + ')'}>
      <rect x="0" y="0" width={this.props.node.width} height={this.props.node.height}/>
      <text x={this.props.node.width / 2} y={isLeaf ? this.props.node.height / 2 : constants.LEAF_NODE_PADDING_H}>
        {this.props.node.$type === 'virtual' ? this.props.node.labels[0].text : this.props.node.id}
      </text>
    </g>;
  }

}

