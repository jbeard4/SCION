/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import constants from '../../constants';
import events from '../../events';
import ReactDOM = require('react-dom');
import * as React from "react";
import {GraphRoot} from './GraphRoot';
import EventEmitter = require('events');

import Debug = require('debug');
const debug = Debug('react renderer index');

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from '../../KGraph';

import {IKGraphRenderBackend, LayoutOptions} from '../IKGraphRenderBackend';

export default class SVGRenderer implements IKGraphRenderBackend {

  _parentNode:SVGElement;
  _root : SCHVIZVisualization;
  _kgraphRoot : KGraphNode;
  _app : EventEmitter;

  public constructor(app:EventEmitter, parentNode:SVGElement){
    this._app = app;
    this._parentNode = parentNode;
  }
  public clear(){
    this._root = null;
    this._kgraphRoot = null;
    this._parentNode.innerHTML = '';
  }

  private filterById(nodes, id){
    return nodes.filter((e) => e.getAttributeNS(null,'id') === id)
  }

  private getStateNode(id){
    return this.filterById(Array.from(document.querySelectorAll(`g.node`)), id).pop();
  }

  public highlightState(stateId:string){
    let e = this.getStateNode(stateId);
    if(e) e.classList.add('highlighted');
  }
  public unhighlightState(stateId:string){
    let e = this.getStateNode(stateId);
    if(e) e.classList.remove('highlighted');
  }
  public unhighlightAllStates(){
    Array.from(document.querySelectorAll(`g.node`)).forEach( (e:Element) => e.classList.remove('highlighted') );
  }
  public highlightTransition(sourceStateId:string, transitionIndex:number){
    let id = `${sourceStateId}:${transitionIndex}`;
    let transition = this.filterById(Array.from(document.querySelectorAll(`path.link`)), id).pop();
    if(!transition) return console.warn(`Couldn't find transition at index ${transitionIndex}`);

    transition.classList.add('highlighted');
    setTimeout(() => { transition.classList.remove('highlighted') }, 100);
  }
  public measureTextDimensions(text:string){
    var svg = document.createElementNS(constants.SVGNS,'svg');
    var txt:SVGTextElement = document.createElementNS(constants.SVGNS,'text') as SVGTextElement;
    txt.textContent = text; 
    this._parentNode.appendChild(svg);
    svg.appendChild(txt);
    var bbox = txt.getBBox();
    this._parentNode.removeChild(svg);
    return bbox; 
  }
  public render(kgraph:KGraph, updateLayout){
    debug('render',kgraph);
    var allEdges = this._getAllEdges(kgraph);
    var t1 = Date.now();
    let semaphore = {};
    if(!this._root) {
      var root = <SCHVIZVisualization app={this._app} allEdges={allEdges} kgraph={kgraph} semaphore={semaphore} updateLayout={false} parentIsExiting={false}/>;
      this._root = ReactDOM.render(root, this._parentNode, () => {
        debug('Rendered in %sms',Date.now() - t1);
        setTimeout(() => {this._root.beginAnimation(false);},1);
      }) as SCHVIZVisualization;
      this._root.pauseAnimation();
    }else {
      this._root.pauseAnimation();
      //console.time('update');
      this._root.setState({
          app:this._app,
          allEdges:allEdges, 
          kgraph:kgraph,
          semaphore : semaphore,
          updateLayout : updateLayout,
          parentIsExiting : false
      }, () => {
        //console.time('update');
        this._root.beginAnimation(updateLayout);
      });
    }
    this._kgraphRoot = kgraph.root;
  }

  private _getAllEdges(kgraph:KGraph){
    let allEdges = [];
    function walk(s:KGraphNode){
      if(s.edges) s.edges.forEach((edge) => allEdges.push(edge));
      if(s.children) s.children.forEach(walk);
    }
    walk(kgraph.root);
    return allEdges;
  }

}

interface SCHVIZVisualizationProps  {
  allEdges : KGraphEdge[];
  kgraph : KGraph;
  semaphore : any;
  updateLayout : boolean;
  parentIsExiting : boolean;
  app : EventEmitter;
}

class SCHVIZVisualization extends React.Component<SCHVIZVisualizationProps, SCHVIZVisualizationProps>{
  _root : GraphRoot;
  constructor(props){
    super(props);
  }
  pauseAnimation(){
    this._root.pauseAnimation();
  }
  beginAnimation(updateLayout:boolean){
    this._root.beginAnimation(updateLayout);
  }
  render(){
    return <GraphRoot 
      ref={(e: GraphRoot) => { this._root = e; }}
      app={(this.state && this.state.app) || this.props.app}
      allEdges={(this.state && this.state.allEdges) || this.props.allEdges}
      kgraph={(this.state && this.state.kgraph) || this.props.kgraph}
      semaphore={(this.state && this.state.semaphore) || this.props.semaphore}
      updateLayout={(this.state && this.state.updateLayout) || this.props.updateLayout}
      parentIsExiting={(this.state && this.state.parentIsExiting) || this.props.parentIsExiting}/>;
  }
}
