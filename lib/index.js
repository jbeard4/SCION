var KGraph = require('./KGraph'),
    SCJSONToKGraphTransformer = require('./SCJSONToKGraphTransformer'),
    SVGRenderer = require('./SVG');

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
  renderSCJSON : function(scjson, options, cb){
    this._svgRenderer.clear();
    var kgraphRoot = this._scjsonToKGraphTransformer.transform(scjson);
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

  _generateStateId : function(){
    return '$generated-' + this._generatedIdCount++;
  }
};

module.exports = SCHVIZ;
