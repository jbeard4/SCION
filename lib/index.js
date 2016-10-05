var KGraph = require('./KGraph'),
    SCJSONToKGraphTransformer = require('./SCJSONToKGraphTransformer'),
    SVGRenderer = require('./SVG');
    //mergeSCJSON = require('merge-scjson');

function SCHVIZ(parentNode){
  this._generatedIdCount = 0;
  this._scjsonStateToKGraphNodeMap = new Map();
  this._scjsonTransitionToKGraphNodeMap = new Map();
  this._kgraphNodeToSVGElementMap = new Map();

  this._kgraph = new KGraph(this._generateStateId.bind(this)); 
  this._svgRenderer = new SVGRenderer(parentNode, this._kgraph);
  this._scjsonToKGraphTransformer = new SCJSONToKGraphTransformer(this._generateStateId.bind(this), this._svgRenderer);
}

SCHVIZ.prototype = {

  updateLayout : function(scjson, options, cb){
    var kgraphRoot = this._scjsonToKGraphTransformer.transform(scjson);
    //delete kgraphRoot.$H;
    //console.log('kgraphRoot ', kgraphRoot );
    var options = JSON.parse(JSON.stringify(options));
    delete options.$$hashKey;
    this._kgraph.updateKgraph(kgraphRoot, options, (err, graph) => {
      if(err) return cb(err);
      try {
        this._svgRenderer.render(graph);
      } catch(e){
        debugger;
        return e;
      }
    });
  },

  updateSCJSON : function(targetSCJSON, sourceSCJSON, cb){
    //merge scjson
    //var changes = mergeSCJSON(targetSCJSON, sourceSCJSON);

    
    
    //initialize states added: convert scjson to klay node
    //they get appended as _kgraphNode
    var kgraphRoot = this._scjsonToKGraphTransformer.transform(scjson);   //maybe this will work?
    this._kgraph.updateKgraph(kgraphRoot, options, (err, graph) => {      //this we need.
      if(err) return cb(err);
      try {
        this._svgRenderer.render(graph);                                  // then we need to render him, 
                                                                          // which should be done such that existing SVG nodes are animated to new positions; 
                                                                          // new ones perform enter animations; and old ones perform exit animations

        //changes.states.removed                                          //TODO: exit changes.states._klayNode._graphNode
        //changes.transitions.removed 
      } catch(e){
        debugger;
        return e;
      }
    });
  },
  renderSCJSON : function(scjson, options, cb){
    this._svgRenderer.clear();
    var kgraphRoot = this._scjsonToKGraphTransformer.transform(scjson);
    this._kgraph.updateKgraph(kgraphRoot, options, (err, graph) => {
      if(err) return cb(err);
      try {
        this._svgRenderer.render(graph);
      } catch(e){
        console.log('error', e);
        return e;
      }
    });
  },

  _generateStateId : function(){
    return '$generated-' + this._generatedIdCount++;
  }
};

module.exports = SCHVIZ;
