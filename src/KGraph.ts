import $klay = require('klayjs');
import _ = require('underscore');
import SCJSONToKGraphTransformer from './SCJSONToKGraphTransformer';
import IdGenerator from './IdGenerator';
import {IKGraphRenderBackend} from './renderers/IKGraphRenderBackend';
import Debug = require('debug');
const debug = Debug('KGraph');

import {SCState} from './SCJSON';
import constants from './constants';


export class KGraph extends SCJSONToKGraphTransformer {

  _klayToScjsonMap : Map<SCState,KGraphNode>; 
  _kgraphRoot : KGraphNode;
  _idMap : Map<string, KGraphNode>;
  _childToParentMap : Map<string, KGraphNode>;
  _options : any;   //TODO: enumerate these options

  constructor(idGenerator: IdGenerator, svgRenderer : IKGraphRenderBackend, scjson: any, options : any){
    super(idGenerator, svgRenderer);
    var newKlayToScjsonMap, newKgraphRoot; 
    [newKlayToScjsonMap, newKgraphRoot] = this.transform(scjson);
    newKgraphRoot.on('update', function(){
      this.emit('update');
    }.bind(this));
    this._klayToScjsonMap = newKlayToScjsonMap; 
    this._kgraphRoot = newKgraphRoot;
    this._normalize(this._kgraphRoot);
    this._options = options;
  }

  get root (){
    return this._kgraphRoot;
  } 

  patch(newKgraph, options, cb, updateLayout){
    this._kgraphRoot = newKgraph;
    this._options = options;
    return this._updateKgraph(this._kgraphRoot, this._options, cb, updateLayout);
  }

  _normalize(kgraph){
    this._populateIdMap(kgraph);
    this._populateChildToParentMap(kgraph);

    this._normalizeKgraphTransitionTargets(kgraph);
  }

  update(options, cb){
    this._options = options;
    return this._updateKgraph(this._kgraphRoot, options, cb, false);
  }

  _processKGraphPostLayout(kgraph){
    //make sure that the width of the state is 
    function walk(node){
      if(node.labels && node.labels.length){
        var label = node.labels[0].text;
        var [minWidth, height] =  this._getStateMinDimensions(label);
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
      $klay.layout({
        graph : kgraph,
        options : constants.layouts[options],
        success : function(g){ 
          try {
            this._processKGraphPostLayout(kgraph);
            debug('Layout in %sms',Date.now() - t1);
            debug('kgraph after layout',JSON.stringify(kgraph,null,4));   //TODO: enable debug module
            this._svgRenderer.render(this, updateLayout);   //TODO: move this back out?
            cb(null, kgraph);
          } catch(e){
            cb(e); 
          }
        }.bind(this)
      });
    } catch(e){
      cb(e); 
    }
    return kgraph;
  }

  _normalizeKgraphTransitionTargets(kgraph){

    //walk through states
    walk.call(this, kgraph, kgraph);

    function walk(parentState, state){
      //look for state.transitions.targets
      if(state.edges){
        state.edges.slice().forEach(function(edge){

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

              // pass. do nothing
              if(edge.$type === 'hyperlink') delete edge.$type;
            } else if (targetIsAncestorOfSource) {
              if(!isInternal){
                // 1. A1 -> A, internal = false
                var ports = this._addPortsToState(targetState);
                this._edgeToHyperlinkAndTargetPort(edge, ports.exitPort.id);
                var selfLoopEdge = this._addSelfLoopToState(targetState, edge.target, ports, false);
                selfLoopEdge.$hyperlink = edge.id;
              } else {
                // 2. A1 -> A, internal = true
                this._resetEdgeType(edge);
              }
            } else if (sourceIsAncestorOfTarget) {
              if(!isInternal){
                // 3. A -> A1, internal = false
                
                var targetPorts = this._addPortsToState(targetState),
                    sourcePorts = this._addPortsToState(sourceState);

                edge.sourcePort = sourcePorts.entryPort.id ;
                edge.targetPort = targetPorts.entryPort.id; 

                //TODO: swap out parentState for grandparentNode, see below
                var selfLoopEdge = this._addSelfLoopToState(parentState, edge.source, sourcePorts, true);

                //swap labels
                var tmpLabels = selfLoopEdge.labels;
                selfLoopEdge.labels = edge.labels;
                edge.labels = tmpLabels;

                edge.$hyperlink = selfLoopEdge.id;
              } else {
                // 4. A -> A1, internal = true
              }
            } else if (isSelfLoop) {
              if(isInternal){
                // 5. A -> A, internal = false
                // default behavior is fine
              }else{
                // 6. A -> A, internal = true
                // FIXME: This case is not currently supported. How do we self loop inside with KlayJS? 
              }
            } else if (isTargetless){
              // 7. A (targetless transition)
            } else {
              throw new Error('Unexpected type');
            } 
          } else {
            // he is a hyperedge
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
                var selfLoop = this._addSelfLoopToState(grandparentNode, edge.source, ports, true);
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

  _addSelfLoopToState(stateToWhichEdgeShouldBeAdded, stateToAddLoop, ports, isHyperlink){
    //add a self-loop, from exit port to entry port
    var stateExitId = ports.exitPort.id, 
        stateEnterId = ports.entryPort.id;
    stateToWhichEdgeShouldBeAdded.edges = stateToWhichEdgeShouldBeAdded.edges || [];
    var loopEdge = (<KGraphEdge>{
      id : stateExitId + '_' + stateEnterId,
      source : stateToAddLoop,
      target : stateToAddLoop,
      sourcePort : stateExitId,
      targetPort : stateEnterId,
      labels : []
    });
    stateToWhichEdgeShouldBeAdded.edges.push(loopEdge);
    if(isHyperlink) loopEdge.$type = 'hyperlink';
    return loopEdge;
  }


  _edgeToHyperlinkAndTargetPort(edge, stateExitId){

    edge.targetPort = stateExitId;
    edge.$type = 'hyperlink';

  }


  _addPortsToState(state){

    state.ports = state.ports || [];
    var portCount = state.ports.length / 2,
        stateEnterId = state.id + '_enter' + portCount,
        stateExitId = state.id + '_exit' + portCount;

    state.ports = state.ports || [];
    var entryPort = { id: stateEnterId },
        exitPort = { id: stateExitId };
    state.ports.push( entryPort, exitPort);

    return {
      entryPort : entryPort, 
      exitPort: exitPort
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
}

export class KGraphEdge implements IKGraphNode {
  id : string;
  $type? : string;
  labels : KGraphLabel[];
  source: string;
  target: string;
  $hyperlink? : string;
  bendPoints? : Point[];
}

export class KGraphLabel implements IKGraphNode {
  text : string;
  x?:number;
  y?:number;
  width? : number;
  height? : number;
  $meta? : KGraphLabelMeta;
}

interface KGraphLabelMeta {
  textAnchor?: string;
  dominantBaseline?: string;
}

export interface Point {
  x?:number;
  y?:number;
}

