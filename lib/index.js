var KGraph = require('./KGraph'),
    constants = require('./constants'),
    SVGRenderer = require('./SVG');

class SCHVIZ {

  constructor(parentNode){
    this._generatedIdCount = 0;
    this._scjsonStateToKGraphNodeMap = new Map();
    this._scjsonTransitionToKGraphNodeMap = new Map();
    this._kgraphNodeToSVGElementMap = new Map();

    this._svgRenderer = new SVGRenderer(parentNode);
  }

  updateLayout(options, cb){
    if(!this._kgraphRoot) return;
    //delete kgraphRoot.$H;
    //console.log('kgraphRoot ', kgraphRoot );
    var options = JSON.parse(JSON.stringify(options));
    delete options.$$hashKey;
    this._kgraph.updateKgraph(this._kgraphRoot, options, (err, graph) => {
      if(err) return cb(err);
      try {
        this._svgRenderer.render(graph);
      } catch(e){
        console.error(e.stack);
        return e;
      }
    });
  }


  updateSCJSON(sourceSCJSON, options, cb){
    //initialize states added: convert scjson to klay node
    //they get appended as _kgraphNode
    
    var newKgraph = new KGraph(this._generateStateId.bind(this), this._svgRenderer, sourceSCJSON); 
    this._kgraph.patch(newKgraph);
  }


  renderSCJSON(scjson, options, cb){
    var newKlayToScjsonMap, newKgraphRoot;
    this._scjson = scjson;
    this._svgRenderer.clear();
    this._kgraph = new KGraph(this._generateStateId.bind(this), this._svgRenderer, scjson); 
    this._kgraph.update(options, (err, graph) => {
      if(err) return cb(err);
    });
  }


  _generateStateId(){
    return '$generated-' + this._generatedIdCount++;
  }


  highlightState(stateId){
    this._svgRenderer.highlightState(stateId);
  }


  unhighlightState(stateId){
    this._svgRenderer.unhighlightState(stateId);
  }


  highlightTransition(sourceStateId, targetStateIds){
    this._svgRenderer.highlightTransition(sourceStateId, targetStateIds);
  }

}

SCHVIZ.layouts = constants.layouts;

module.exports = SCHVIZ;
