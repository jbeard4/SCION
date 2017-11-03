//import ELK from 'elkjs'
import klayjs = require('klayjs');
import _ = require('underscore');
import IdGenerator from './IdGenerator';
import Debug = require('debug');
import GraphRoot from './index'
const debug = Debug('KGraph');

import {SCState} from './SCJSON';
import constants from './constants';


export class KGraph {

  _kgraphRoot : KGraphNode;
  _idMap : Map<string, KGraphNode>;
  _childToParentMap : Map<string, KGraphNode>;
  _idGenerator : IdGenerator; 
  _svgRenderer : GraphRoot;

  constructor(idGenerator: IdGenerator, svgRenderer : GraphRoot, kgraphRoot: KGraphNode){
    this._idGenerator = idGenerator;
    this._svgRenderer = svgRenderer;
    this._kgraphRoot = kgraphRoot;
    this._normalize(this._kgraphRoot);
  }

  get root (){
    return this._kgraphRoot;
  } 

  _normalize(kgraph){
    this._populateIdMap(kgraph);
    this._populateChildToParentMap(kgraph);

    this._normalizeKgraphTransitionTargets(kgraph);
  }

  updateLayout(options, cb){
    return this._updateKgraph(this._kgraphRoot, options, cb, false);
  }

  _processKGraphPreLayout(kgraph){
    //make sure that the width of the state is 
    function walk(node){
      if(node.$type === 'initial' || node.$type === 'final'){
        _.extend(node, { 
          "width" : constants.INITIAL_RADIUS,
          "height" : constants.INITIAL_RADIUS
        });
      } else if (node.labels && node.labels.length) {
        var [width, height] =  this._svgRenderer.getStateMinDimensions(node.labels[0].text, node.$type);
        _.extend(node, { 
          "width" : width,
          "height" : height
        });
      }
      if(node.edges && node.edges.length){
        node.edges.forEach( edge => {
          if(edge.labels && edge.labels.length){
            edge.labels.forEach( label => {
              var {width, height} =  this._svgRenderer.measureTextDimensions(label.text);
              _.extend(label, { 
                "width" : width,
                "height" : height
              });
            });
          }
        }) 
      }
      if(node.children) node.children.forEach(walk.bind(this));
    }
    walk.call(this, kgraph);
  }

  _processKGraphPostLayout(kgraph){
    //make sure that the width of the state is 
    function walk(node){
      if(node.labels && node.labels.length){
        var label = node.labels[0].text;
        var [minWidth, height] =  this._svgRenderer.getStateMinDimensions(label, node.$type);
        if(node.width < minWidth){
          node.width = minWidth; 
        }
      }
      if(node.children) node.children.forEach(walk.bind(this));
    }
    walk.call(this, kgraph);
  }

  _updateKgraph(kgraph, options, cb, updateLayout){
    this._populateIdMap(kgraph);
    this._populateChildToParentMap(kgraph);

    this._applyInitialCoordinates(kgraph);
    debug('kgraph before layout',JSON.stringify(kgraph,null,4));   //TODO: enable debug module
    var t1 = Date.now();
    try {
      this._processKGraphPreLayout(kgraph);
      klayjs.layout({
        graph : kgraph, 
        options : options,
        success : ( g => {
          this._processKGraphPostLayout(g);
          debug('Layout in %sms',Date.now() - t1);
          debug('kgraph after layout',JSON.stringify(g,null,4));   //TODO: enable debug module
          cb(null, g);
        }),
        error : (error) => cb(error)
      });
    } catch(e){
      cb(e); 
    }
    return kgraph;
  }

  _normalizeKgraphTransitionTargets(kgraph){

    const edgesAdded = new Set<KGraphEdge>();

    //walk through states
    walk.call(this, kgraph, kgraph);

    function walk(parentState, state){
      //look for state.transitions.targets
      if(state.edges){
        state.edges.slice().forEach(function(edge){
          if(edgesAdded.has(edge)) return;    //avoid processing an edge that has been artifically created and added

          //Tranistion types: 
          // 0. A -> B
          // 1. A1 -> A, internal = false
          // 2. A1 -> A, internal = true
          // 3. A -> A1, internal = false
          // 4. A -> A1, internal = true
          // 5. A -> A, internal = false
          // 6. A -> A, internal = true
          // 7. A (targetless transition)
          // 8. A -> [ A1, A2 ]
          // 9. A -> [ B1, B2 ]

          var isTargetless = !edge.target,
              isInternal = edge.$type === 'internal';
              
          if(!Array.isArray(edge.target)){

            var sourceIsAncestorOfTarget = this.isSourceAncestorOfTarget(edge.source, edge.target),
                targetIsAncestorOfSource = this.isSourceAncestorOfTarget(edge.target, edge.source),
                isSelfLoop = edge.source === edge.target,
                isOrthogonal = !sourceIsAncestorOfTarget && !targetIsAncestorOfSource && !isSelfLoop,
                sourceState = this._idMap.get(edge.source),
                targetState = this._idMap.get(edge.target);

            if(isOrthogonal){
              // 0. A -> B
              if(isInternal){
                throw new Error('Unexpected internal transition');
              }

              var exitPort = this._addExitPortToState(sourceState);
              edge.sourcePort = exitPort.id;
              var entryPort = this._addEntryPortToState(targetState);
              edge.targetPort = entryPort.id;
              if(edge.$type === 'hyperlink') delete edge.$type;
            } else if (targetIsAncestorOfSource) {
              if(!isInternal){
                // 1. A1 -> A, internal = false
                var ports = this._addPortsToState(targetState);
                var selfLoopEdge = this._addSelfLoopToState(targetState, edge.target, ports, false, edgesAdded);
                selfLoopEdge.$hyperlink = edge.id;

                edge.targetPort = ports.exitPort.id;
                edge.$type = 'hyperlink';
              } else {
                // 2. A1 -> A, internal = true
                this._resetEdgeType(edge);

                var port = this._addExitPortToState(targetState);
                edge.targetPort = [port.id];
              }
            } else if (sourceIsAncestorOfTarget) {
              if(!isInternal){
                // 3. A -> A1, internal = false
                
                var ports = this._addPortsToState(sourceState);

                //TODO: swap out parentState for grandparentNode, see below
                var selfLoopEdge = this._addSelfLoopToState(parentState, edge.source, ports, true, edgesAdded);

                //swap labels
                var tmpLabels = selfLoopEdge.labels;
                selfLoopEdge.labels = edge.labels;
                edge.labels = tmpLabels;

                edge.$hyperlink = selfLoopEdge.id;

                var port = this._addExitPortToState(targetState);
                edge.sourcePort = [ports.entryPort.id];

              } else {
                // 4. A -> A1, internal = true
                var port = this._addExitPortToState(sourceState);
                edge.sourcePort = [port.id];
              }
            } else if (isSelfLoop) {
              if(isInternal){
                // 5. A -> A, internal = true
                // FIXME: This case is not currently supported. How do we self loop inside with KlayJS? 
                //var ports = this._addPortsToState(targetState);
                //edge.sources = [ports.exitPort.id];
                //edge.targets = [ports.entryPort.id];
                //edge.$source = edge.source;
                //edge.$target = edge.target;
                //delete edge.source;
                //delete edge.target;
                //TODO: figure out how to map this property : 
                //org.eclipse.elk.insideSelfLoops.yo
                //http://www.eclipse.org/elk/reference/options/org-eclipse-elk-insideselfloops-yo.html
              }else{
                // 6. A -> A, internal = false
                var ports = this._addPortsToState(targetState);
                edge.sourcePort = ports.exitPort.id;
                edge.targetPort = ports.entryPort.id;
              }
            } else if (isTargetless){
              // 7. A (targetless transition)
            } else {
              throw new Error('Unexpected type');
            } 
          } else {
            // he is a hyperedge
            // TODO: use elkjs native support for hyperedges
            sourceIsAncestorOfTarget = edge.target.some(function(target){ return this.isSourceAncestorOfTarget(edge.source, target); }, this);
            targetIsAncestorOfSource = edge.target.some(function(target){ return this.isSourceAncestorOfTarget(target, edge.source); }, this);
            sourceState = this._idMap.get(edge.source);
            var targetStates = edge.target.map(function(target){return this._idMap.get(target);}, this);

            //we'll add our edges to the parent of the source state
            var grandparentNode = this.getKgraphNodeById(this._getParentKGraphNode(sourceState.id));
            if(!grandparentNode) grandparentNode = parentState;

            if(sourceIsAncestorOfTarget) {

              ports = this._addPortsToState(sourceState);
              if(!isInternal){
                // 8. A -> [ A1, A2 ], internal = false
                
                //create self loop on A.
                var selfLoop = this._addSelfLoopToState(grandparentNode, edge.source, ports, true, edgesAdded);
                selfLoop.labels.push.apply(selfLoop.labels, edge.labels);
              } 

              // 9. A -> [ A1, A2 ], internal = true | false. default case

              //remove old edge 
              state.edges.splice(state.edges.indexOf(edge),1);

              // create two new edges 
              //  A.entry_port -> A1, A.entry_port -> A2
              //    sourceState.entryPort.id -> targets[0].entryPort
              //    sourceState.entryPort.id -> targets[1].entryPort
              targetStates.forEach(function(targetState){
                var targetPorts = this._addPortsToState(targetState);

                grandparentNode.edges = grandparentNode.edges || [];
                var innerEdge = (<KGraphEdge>{
                  id : edge.source + '_' + targetState.id,
                  source : edge.source,
                  target : targetState.id,
                  sourcePort : ports.entryPort.id,
                  targetPort : targetPorts.entryPort.id,
                  labels : []
                });
                if(selfLoop) innerEdge.$hyperlink = selfLoop.id;
                edgesAdded.add(innerEdge);
                grandparentNode.edges.push(innerEdge);
                return innerEdge;

              }, this);

            } else {
              // 10. A -> [ B1, B2 ]

              // Becomes A -> P.entryPort, P.entryPort -> B1.entryPort, P.entryPort -> B2.entryPort

              var sourcePorts = this._addPortsToState(sourceState);

              //get their common parallel ancestor
              var commonParallelAncestor = this._getLCA(edge.target);
              debug('commonParallelAncestor',commonParallelAncestor); 

              var lcaPorts = this._addPortsToState(commonParallelAncestor);

              //repurpose the old edge
              this._edgeToHyperlinkAndTargetPort(edge, lcaPorts.entryPort.id);
              edge.target = commonParallelAncestor.id; 
              edge.sourcePort = sourcePorts.exitPort.id;

              targetStates.forEach(function(targetState){
                var targetPorts = this._addPortsToState(targetState);

                grandparentNode.edges = grandparentNode.edges || [];
                var innerEdge = {
                  id : edge.source + '_' + targetState.id,
                  source : commonParallelAncestor.id,
                  target : targetState.id,
                  sourcePort : lcaPorts.entryPort.id,
                  targetPort : targetPorts.entryPort.id,
                  $hyperlink : edge.id,
                  labels : []
                };
                edgesAdded.add(innerEdge);
                debug('innerEdge.$hyperlink', innerEdge.$hyperlink);
                grandparentNode.edges.push(innerEdge);
                return innerEdge;
              }, this);
            }
          } 
        }, this);
      }

      //recurse
      if(state.children){
        state.children.forEach(walk.bind(this, state));
      }
    }
  }


  _getAncestors(stateId){
    var ancestors = [];
    var p = stateId;
    while( p = this._getParentKGraphNode(p) ){
      ancestors.push(p); 
    }
    return ancestors; 
  }


  _getLCA(states){
    var stateAncestors = states.map(function(state){ return this._getAncestors(state); }, this);
    var lcaId = _.intersection.apply(_, stateAncestors)[0];
    return this.getKgraphNodeById(lcaId);
  }


  _resetEdgeType(edge){
    if(edge.$type === 'hyperlink') delete edge.$type;
  }

  _addSelfLoopToState(stateToWhichEdgeShouldBeAdded, stateToAddLoopId, ports, isHyperlink, edgesAdded){
    //add a self-loop, from exit port to entry port
    var stateExitId = ports.exitPort.id, 
        stateEnterId = ports.entryPort.id;
    stateToWhichEdgeShouldBeAdded.edges = stateToWhichEdgeShouldBeAdded.edges || [];
    var loopEdge = (<KGraphEdge>{
      id : stateExitId + '_' + stateEnterId,
      sourcePort : stateExitId,
      targetPort : stateEnterId,
      source : stateToAddLoopId,
      target : stateToAddLoopId, 
      labels : []
    });
    stateToWhichEdgeShouldBeAdded.edges.push(loopEdge);
    if(isHyperlink) loopEdge.$type = 'hyperlink';
    edgesAdded.add(loopEdge);
    return loopEdge;
  }


  _edgeToHyperlinkAndTargetPort(edge, stateExitId){

    edge.targetPort = stateExitId;
    edge.$type = 'hyperlink';

  }

  _addPortToState(state,enterOrExit){
    state.ports = state.ports || [];
    var portCount = state.ports.length,
        portId = `${state.id}_${enterOrExit}:${portCount}`;

    state.ports = state.ports || [];
    var port = { id: portId };
    state.ports.push(port);

    return port;
  }

  _addEntryPortToState(state){
    return this._addPortToState(state,'enter');
  }

  _addExitPortToState(state){
    return this._addPortToState(state,'exit');
  }

  _addPortsToState(state){
    return {
      entryPort : this._addEntryPortToState(state), 
      exitPort: this._addExitPortToState(state)
    };
  }


  _clearBendpoints(parent) {
    if (parent.edges) {
      parent.edges.forEach(function(e) {
        e.sourcePoint = {x:0, y:0};
        e.targetPoint = {x:0, y:0};
        e.bendPoints = [];
      });
    }
    if (parent.children) {
      parent.children.forEach(function(c) {
        this._clearBendpoints(c);
      }.bind(this));
    }
  }


  _applyInitialCoordinates(parent) {
    if (parent.children) {
      parent.children.forEach(function(c) {
     
        if (c.properties && c.properties["de.cau.cs.kieler.position"]) {
          var position = c.properties["de.cau.cs.kieler.position"].split(",");
          c.x = parseInt(position[0],10);
          c.y = parseInt(position[1],10);
        } else {
          c.x = 0;
          c.y = 0;
        }
     
        this._applyInitialCoordinates(c);
      }.bind(this));
    }
  }


  public getKgraphNodeById(kgraphNodeId){
    return this._idMap.get(kgraphNodeId);
  }


  _populateIdMap(graphRoot){

    this._idMap = new Map<string, KGraphNode>();
    var walk = (function(graphNode){
      this._idMap.set(graphNode.id, graphNode);
      if(graphNode.children) graphNode.children.forEach(walk);
    }.bind(this));

    walk(graphRoot);
    
  }


  _populateChildToParentMap(graphRoot){

    this._childToParentMap = new Map<string, KGraphNode>();
    var walk = (function(parentGraphNode, graphNode){
      if(parentGraphNode) this._childToParentMap.set(graphNode.id, parentGraphNode.id);
      if(graphNode.children) graphNode.children.forEach(walk.bind(this,graphNode));
    }.bind(this));

    walk(null, graphRoot);
  }


  _createPseudonodeAndSpliceEdge(parentState, edge){
    debug('_createPseudonodeAndSpliceEdge', 'parentState', parentState.id);
    if(!parentState.children) parentState.children = [];

    var pseudonode = this._createPseudonode(parentState);

    var grandparentNode = this.getKgraphNodeById(this._getParentKGraphNode(parentState.id));
    if(!grandparentNode) grandparentNode = parentState;

    grandparentNode.edges.push(
      {
        id : pseudonode.id + '_' + edge.target,
        source: pseudonode.id,
        target: edge.target,
        labels : []
      }
    );

    //adjust transition target to target pseudonode
    edge.target = pseudonode.id; 
    edge.$type = 'hyperlink';
  }


  isSourceAncestorOfTarget(sourceId, targetId){
    var foundTargetInSourceDescendants = false;
    function walk(currentNode){
      if(foundTargetInSourceDescendants) return;
      foundTargetInSourceDescendants = currentNode.id === targetId;
      if(currentNode.children) currentNode.children.forEach(walk);
    }

    var sourceNode = this._idMap.get(sourceId);
    if(sourceNode.children) sourceNode.children.forEach(walk);
    return foundTargetInSourceDescendants; 
  }


  _createPseudonode(parentNode){
    let $type = 'pseudonode';
    var pseudoNodeStateId = this._idGenerator.generateId(parentNode.id, $type);

    //create a pseudonode with an edge originating for each hyperedge target
    var pseudonode = <KGraphNode> {
      id :  pseudoNodeStateId,
      $type: $type,
      width : 0,
      height : 0,
      edges : []
    };

    parentNode.children.push(pseudonode);

    this._idMap.set(pseudonode.id, pseudonode);
    this._childToParentMap.set(pseudonode.id, parentNode.id);

    return pseudonode;
  }


  _getParentKGraphNode(nodeId){
    return this._childToParentMap.get(nodeId);
  }

}

export interface IKGraphNode {
}

export class KGraphNode implements IKGraphNode {
  id : string;
  labels : KGraphLabel[];
  edges? : KGraphEdge[];
  children? : KGraphNode[];
  width?:number;
  height?:number;
  x?:number;
  y?:number;
  $type? : string;
  $meta? : {
    isCollapsed? : boolean; 
  };
  properties? : any
}

export class KGraphEdge implements IKGraphNode {
  id : string;
  $type? : string;
  labels : KGraphLabel[];
  source: string;
  target?: string;
  $hyperlink? : string;
  bendPoints? : Point[];
  sourcePoint? : Point;
  targetPoint? : Point;
}

export class KGraphLabel implements IKGraphNode {
  text : string;
  x?:number;
  y?:number;
  width? : number;
  height? : number;
  $meta? : KGraphLabelMeta;
}

export interface KGraphLabelMeta {
  textAnchor?: string;
  dominantBaseline?: string;
}

export interface Point {
  x?:number;
  y?:number;
}

