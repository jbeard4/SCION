var KGraph = require('./KGraph'),
    SCJSONToKGraphTransformer = require('./SCJSONToKGraphTransformer'),
    SVGRenderer = require('./SVG'),
    jsondiffpatch = require('jsondiffpatch');

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

  updateLayout : function(options, cb){
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
        debugger;
        return e;
      }
    });
  },

  updateSCJSON : function(sourceSCJSON, options, cb){
    //initialize states added: convert scjson to klay node
    //they get appended as _kgraphNode

    var newKgraphRoot = this._scjsonToKGraphTransformer.transform(sourceSCJSON);   //maybe this will work?
    var patch = jsondiffpatch.diff(this._kgraphRoot, newKgraphRoot);
    console.log('patch', JSON.stringify(patch,4,4));
    jsondiffpatch.patch(this._kgraphRoot, patch);
    this._kgraph.updateKgraph(this._kgraphRoot, options, (err, graph) => {      //this we need.
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
    this._scjson = scjson;
    this._svgRenderer.clear();
    this._kgraphRoot = this._scjsonToKGraphTransformer.transform(scjson);
    this._kgraph.updateKgraph(this._kgraphRoot, options, (err, graph) => {
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
