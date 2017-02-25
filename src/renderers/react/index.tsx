/// <reference path="./intrinsics.d.ts" />…
/// <reference path="../../smil.d.ts" />…

import constants from '../../constants';
import events from '../../events';
import q = require('q');
import ReactDOM = require('react-dom');
import * as React from "react";
import GraphRoot from './GraphNode';

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from '../../KGraph';

import {IKGraphRenderBackend, LayoutOptions} from '../IKGraphRenderBackend';

export default class SVGRenderer implements IKGraphRenderBackend {

  _parentNode:SVGElement;
  _root : GraphRoot;
  _kgraphRoot : KGraphNode;

  public constructor(parentNode:SVGElement){
    this._parentNode = parentNode;
  }
  public clear(){
    this._root = null;
    this._kgraphRoot = null;
    this._parentNode.innerHTML = '';
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
    console.log('render',kgraph);
    var allEdges = this._getAllEdges(kgraph);
    var t1 = Date.now();
    let semaphore = {};
    if(!this._root) {
      var root = <GraphRoot node={kgraph.root} allEdges={allEdges} kgraph={kgraph} isRoot={true} semaphore={semaphore} updateLayout={false} parentIsExiting={false}/>;
      this._root = ReactDOM.render(root, this._parentNode, () => {
        console.log('Rendered in %sms',Date.now() - t1);
        setTimeout(() => {this._root.beginAnimation();},1);
      }) as GraphRoot;
      this._root.pauseAnimation();
    }else {
      this._root.pauseAnimation();
      this._root.setState({
          node:kgraph.root, 
          fromNode: this._kgraphRoot,    //not yet updated. use as prev kgraph root
          allEdges:allEdges, 
          kgraph:kgraph,
          isRoot:true,
          semaphore : semaphore,
          updateLayout : updateLayout,
          parentIsExiting : false
      }, () => {
        this._root.beginAnimation();
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

