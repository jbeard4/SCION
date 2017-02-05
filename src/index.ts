import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from './KGraph';
import SVGRenderer from './renderers/react/index';
import constants from './constants';
import IdGenerator from './IdGenerator';
import {SCState, SCTransition, SCGraph} from './SCJSON';

class SCHVIZ {

  static layouts = constants.layouts;
  static events = require('./events').node;

  _scjsonStateToKGraphNodeMap: Map<SCState,KGraphNode>;
  _scjsonTransitionToKGraphNodeMap: Map<SCTransition,KGraphNode>;
  _kgraphNodeToSVGElementMap: Map<KGraphNode,SVGElement>;
  _svgRenderer: SVGRenderer;
  _kgraph: KGraph;
  _scjson: SCGraph;
  _idGenerator: IdGenerator; 

  constructor(parentNode){
    this._scjsonStateToKGraphNodeMap = new Map<SCState,KGraphNode>();
    this._scjsonTransitionToKGraphNodeMap = new Map<SCTransition,KGraphNode>();
    this._kgraphNodeToSVGElementMap = new Map<KGraphNode,SVGElement>();
    this._idGenerator = new IdGenerator();

    this._svgRenderer = new SVGRenderer(parentNode);
  }

  updateLayout(options, cb){
    if(!this._kgraph) return;
    this._idGenerator.reset();
    var newKgraph = new KGraph(this._idGenerator, this._svgRenderer, this._scjson, options); 
    this._kgraph.patch(newKgraph.root, options, cb);
  }


  updateSCJSON(sourceSCJSON, options, cb){
    //initialize states added: convert scjson to klay node
    //they get appended as _kgraphNode
    
    this._scjson = sourceSCJSON;
    this._idGenerator.reset();
    var newKgraph = new KGraph(this._idGenerator, this._svgRenderer, this._scjson, options); 
    this._kgraph.patch(newKgraph.root, options, cb);
  }


  renderSCJSON(scjson, options, cb){
    var newKlayToScjsonMap, newKgraphRoot;
    this._scjson = scjson;
    this._svgRenderer.clear();
    this._kgraph = new KGraph(this._idGenerator, this._svgRenderer, this._scjson, options); 
    this._kgraph.on('update', this.updateSCJSON.bind(this, scjson, options, function(){
      console.log('Update complete');
    }));
    this._kgraph.update(options, cb);
  }

  highlightState(stateId){
    this._svgRenderer.highlightState(stateId);
  }


  unhighlightState(stateId){
    this._svgRenderer.unhighlightState(stateId);
  }

  unhighlightAllStates(){
    this._svgRenderer.unhighlightAllStates();
  }

  highlightTransition(sourceStateId, targetStateIds){
    this._svgRenderer.highlightTransition(sourceStateId, targetStateIds);
  }

}


module.exports = SCHVIZ;
