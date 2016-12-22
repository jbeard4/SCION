import constants from './constants';
import events from './events';
import _ = require('underscore');
import q = require('q');

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from './KGraph';
import {VisualObject, SnapSvgCanvas, SnapSvgNode, SnapSvgEdge, SnapSvgLabel} from './snapsvg-visual-objects';

const SVGNS = 'http://www.w3.org/2000/svg';

export default class SVGRenderer{

  private _canvas: SnapSvgCanvas;
  private _kgraphNodeToVisualObject:Map<KGraphNode, VisualObject>;
  private _cachedKGraphNodeChildren:Map<KGraphNode, Array<KGraphNode>>;
  private _cachedKGraphNodeEdges:Map<KGraphNode, Array<KGraphEdge>>;
  private _cachedKGraphEdgeLabels:Map<KGraphNode, Array<KGraphLabel>>;
  private _cachedHyperlinkAnimationPromise:Map<KGraphEdge, Q.Promise<KGraphEdge>>;
  private _cachedHyperlinkAnimationDeferred:Map<KGraphEdge, Q.Deferred<KGraphEdge>>;
  private _edgeIdToEdgeMap:Map<string, KGraphEdge>;
  private _firstRender:boolean;
  private _kgraph:KGraph;
  private _allEdges:Array<KGraphEdge>;

  public constructor(parentNode:SVGElement){
    this._kgraphNodeToVisualObject = new Map<KGraphNode, VisualObject>();
    this._cachedKGraphNodeChildren = new Map<KGraphNode, Array<KGraphNode>>();
    this._cachedKGraphNodeEdges = new Map<KGraphNode, Array<KGraphEdge>>();
    this._cachedKGraphEdgeLabels = new Map<KGraphNode, Array<KGraphLabel>>();
    this._canvas = new SnapSvgCanvas(parentNode);
    this._cachedHyperlinkAnimationPromise = null;
    this._cachedHyperlinkAnimationDeferred = null;
    this._edgeIdToEdgeMap = null;
    this._firstRender = true;
  }

  public clear(){
    this._canvas.clear();
    this._firstRender = true;
  }

  public highlightState(stateId){
    this._canvas.highlightState(stateId);
  }

  public unhighlightState(stateId){
    this._canvas.unhighlightState(stateId);
  }

  public unhighlightAllStates(){
    this._canvas.unhighlightAllStates();
  }

  public highlightTransition(sourceStateId, targetStateIds){
    this._canvas.highlightTransition(sourceStateId, targetStateIds);
  }

  public measureTextDimensions (text){
    return this._canvas.measureTextDimensions (text);
  }

  private _traverseGraphForHyperEdges(node : KGraphNode){
    if(node.edges) node.edges.forEach(function(edge : KGraphEdge){
      if(edge.$type === 'hyperlink'){
        var dfd = q.defer();
        this._cachedHyperlinkAnimationDeferred.set(edge, dfd);
        this._cachedHyperlinkAnimationPromise.set(edge, dfd.promise);
        this._edgeIdToEdgeMap.set(edge.id, edge);
      }
    },this);
    if(node.children) node.children.forEach(this._traverseGraphForHyperEdges.bind(this));
  }

  public render(kgraph){
    this._kgraph = kgraph;
    var graphRoot = this._kgraph.root;
    this._kgraphNodeToVisualObject.set(graphRoot, this._canvas);
    this._edgeIdToEdgeMap = new Map<string, KGraphEdge>();
    this._cachedHyperlinkAnimationPromise = new Map<KGraphEdge, Q.Promise<KGraphEdge>>();
    this._cachedHyperlinkAnimationDeferred = new Map<KGraphEdge, Q.Deferred<KGraphEdge>>();
    this._traverseGraphForHyperEdges(graphRoot);

    this._allEdges = [];
    if(this._firstRender){
      this._canvas.enter(graphRoot);
      this._firstRender = false;
    } else{
      this._canvas.update(graphRoot);
    }

    if(graphRoot.edges){
      this._allEdges.push.apply(this._allEdges, graphRoot.edges);
    }

    //perform exit animation
    this._exitNodeChildren(graphRoot);
    this._exitEdges(graphRoot);

    graphRoot.children.forEach(this._renderGraphNode.bind(this,graphRoot));
     
  }

  //trigger exit animation
  private _exitNodeChildren(node:KGraphNode, recursiveDelete?:boolean):void{
    this._exitKGraphObject(node, 'children', recursiveDelete);
  }

  private _exitEdges(node:KGraphNode, recursiveDelete?:boolean):void{
    this._exitKGraphObject(node, 'edges', recursiveDelete);
  }

  private _exitLabels(node:KGraphNode, recursiveDelete?:boolean):void{
    this._exitKGraphObject(node, 'labels', recursiveDelete);
  }

  private _exitKGraphObject(kgraphNode, property, recursiveDelete){
    var cache;
    switch(property){
      case 'children': 
        cache = this._cachedKGraphNodeChildren;
        break;
      case 'edges': 
        cache = this._cachedKGraphNodeEdges;
        break;
      case 'labels': 
        cache = this._cachedKGraphEdgeLabels;
        break;
      default :
        break;
    }

    var cachedNodes = cache.get(kgraphNode) || [];
    var nodesToExit = recursiveDelete ? kgraphNode[property] || [] : _.difference(cachedNodes, kgraphNode[property]);

    //recurse on sub-properties
    if(property === 'children'){
      //recurse on any substates
      nodesToExit.forEach(function(nodeToExit){
        //recurse
        this._exitNodeChildren(nodeToExit, true);
        this._exitEdges(nodeToExit, true);
      }, this);
    } else if(property === 'edges'){
      nodesToExit.forEach(function(nodeToExit){
        //recurse
        this._exitLabels(nodeToExit, true);
      }, this);
    }

    nodesToExit.forEach(function(nodeToExit){
        var svgNode = this._kgraphNodeToVisualObject.get(nodeToExit);
        svgNode.exit(nodeToExit);
    },this);
    
    // bookkeeping
    nodesToExit.forEach(function(node){
        this._kgraphNodeToVisualObject.delete(node);
    }, this);
    var nodesToCache = (kgraphNode[property] || []).slice();
    cache.set(kgraphNode, nodesToCache);  //keep a copy so that we can animate node exit
  }

  private _renderGraphNode(parentGraphNode, graphNode){
    if(!this._kgraphNodeToVisualObject.has(graphNode)){
      var parentVO = (<SnapSvgNode>this._kgraphNodeToVisualObject.get(parentGraphNode));
      var vo = new SnapSvgNode(parentVO); 
      vo.enter(graphNode);
      this._kgraphNodeToVisualObject.set(graphNode, vo);
    } else {
      vo = (<SnapSvgNode> this._kgraphNodeToVisualObject.get(graphNode));
      vo.update(graphNode);
    }

    if(graphNode.children){
      graphNode.children.forEach(this._renderGraphNode.bind(this,graphNode));
    }

    if(graphNode.edges){
      //add this node's edges to allEdges
      this._allEdges.push.apply(this._allEdges, graphNode.edges);

      //add matching edges
      this._allEdges.filter(function(edge){
        return graphNode.id === edge.source;
      }).forEach(function(edge){
        if( this._kgraph.isSourceAncestorOfTarget(edge.source, edge.target) ){
          this._renderEdge(graphNode, edge);
        } else {
          this._renderEdge(parentGraphNode, edge);
        }

        //remove edge from allEdges
        this._allEdges.splice(this._allEdges.indexOf(edge), 1);
      }.bind(this));
    }

    this._exitNodeChildren(graphNode);
    this._exitEdges(graphNode);

  }

  private _renderEdge(parentGraphNode, edge){
    var parentVO = this._kgraphNodeToVisualObject.get(parentGraphNode);
    if(!this._kgraphNodeToVisualObject.has(edge)){
      var vo = new SnapSvgEdge(
                                parentVO,
                                this._cachedHyperlinkAnimationPromise,
                                this._cachedHyperlinkAnimationDeferred,
                                this._edgeIdToEdgeMap);
      vo.enter(edge);
      this._kgraphNodeToVisualObject.set(edge, vo);
    } else {
      var vo = (<SnapSvgEdge>this._kgraphNodeToVisualObject.get(edge));
      vo.update(edge, parentVO);
    }

    if(edge.labels && edge.labels.length){
      edge.labels.forEach(function(label){

        //render labels
        if(!this._kgraphNodeToVisualObject.has(label)){
          var vo = new SnapSvgLabel(parentVO); 
          vo.enter(label, edge);
          this._kgraphNodeToVisualObject.set(label, vo);
        }else{
          //update label displayNode
          var labelDisplayNode = this._kgraphNodeToVisualObject.get(label);
          labelDisplayNode.update(label, edge, parentVO); 
        }
      }, this);
    }

    this._exitLabels(edge);

  }
}
