import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from './KGraph';
import SVGRenderer from './renderers/react/index';
import constants from './constants';
import IdGenerator from './IdGenerator';
import {SCState, SCTransition, findStateById} from './SCJSON';
import Debug = require('debug');
import EventEmitter = require('events');
const debug = Debug('SCHVIZ');
require('../test-integration/app/css/styles.css');

export default class SCHVIZ extends EventEmitter {

  static layouts = constants.layouts;
  static events = require('./events').node;

  _scjsonStateToKGraphNodeMap: Map<SCState,KGraphNode>;
  _scjsonTransitionToKGraphNodeMap: Map<SCTransition,KGraphNode>;
  _kgraphNodeToSVGElementMap: Map<KGraphNode,SVGElement>;
  _svgRenderer: SVGRenderer;
  _kgraph: KGraph;
  _scjson: SCState;
  _idGenerator: IdGenerator; 
  _options : any;

  constructor(parentNode){
    super();
    this._scjsonStateToKGraphNodeMap = new Map<SCState,KGraphNode>();
    this._scjsonTransitionToKGraphNodeMap = new Map<SCTransition,KGraphNode>();
    this._kgraphNodeToSVGElementMap = new Map<KGraphNode,SVGElement>();
    this._idGenerator = new IdGenerator();

    this._svgRenderer = new SVGRenderer(this, parentNode);
    this._initializeListeners();
  }

  _initializeListeners(){
    this.on('state:dblclick', this.handleStateDblClick.bind(this));
  }

  private handleStateDblClick(nodeId, event){
    debug('handled state dblclick', nodeId, event);
    //look up scjson
    let state:SCState = findStateById(this._scjson, nodeId);
    //transform model
    state.$meta = state.$meta || {};
    state.$meta.isCollapsed = !state.$meta.isCollapsed;   //toggle contracted
    this.updateSCJSON(this._scjson, this._options, () => {
      debug('updateSCJSON complete');
    });
  }

  updateLayout(options, cb){
    if(!this._kgraph) return;
    this._idGenerator.reset();
    var newKgraph = new KGraph(this._idGenerator, this._svgRenderer, this._scjson, options); 
    this._kgraph.patch(newKgraph.root, options, cb, true);
  }


  updateSCJSON(sourceSCJSON, options, cb){
    this._options = options;
    //initialize states added: convert scjson to klay node
    //they get appended as _kgraphNode
    
    this._scjson = sourceSCJSON;
    this._idGenerator.reset();
    var newKgraph = new KGraph(this._idGenerator, this._svgRenderer, this._scjson, options); 
    this._kgraph.patch(newKgraph.root, options, cb, false);
  }


  renderSCJSON(scjson, options, cb){
    this._options = options;
    var newKlayToScjsonMap, newKgraphRoot;
    this._scjson = scjson;
    this._svgRenderer.clear();
    this._kgraph = new KGraph(this._idGenerator, this._svgRenderer, this._scjson, options); 
    this._kgraph.update(options, function(){
      debug('Update complete');
      cb();
    });
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

  highlightTransition(sourceStateId : string, transitionIndex : number){
    this._svgRenderer.highlightTransition(sourceStateId, transitionIndex);
  }

}


module.exports = SCHVIZ;
