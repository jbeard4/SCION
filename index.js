(function(){

var ANIM_DURATION = 250,
    LEAF_NODE_PADDING_W = 2.5, LEAF_NODE_PADDING_H = 2.5;

function SCHVIZ(parentNode){
  this._s = window.Snap(parentNode);
  this._root = this._s.group();
  this._initDefs(this._s.node);
  this._generatedIdCount = 0;
}

SCHVIZ.prototype = {

  highlightState : function(stateId){
    $(this._s.node.getElementById(stateId)).addClass('highlighted');
  },

  unhighlightState : function(stateId){
    $(this._s.node.getElementById(stateId)).removeClass('highlighted');
  },

  highlightTransition : function(sourceStateId, targetStateIds){
    var node = $(this._s.node.getElementById(sourceStateId + '->' + targetStateIds[0]));
    node.addClass('highlighted');
    //TODO: listen for animation end event
    setTimeout(function(){
      node.removeClass('highlighted');
    },250);
  },

  renderSCJSON : function(scjson, options, cb){
    this._root.clear();
    this._normalizeStateIds(scjson);
    scjson.id = 'root';
    var kgraphRoot = this._scjsonStateToKlayNode(scjson, scjson);
    console.log('kgraphRoot',JSON.stringify(kgraphRoot,4,4));
    return this.updateKgraph(kgraphRoot, options, cb);

  },

  updateKgraph : function(kgraph, options, cb){
    this._applyInitialCoordinates(kgraph);
    window.$klay.layout({
      graph : kgraph,
      options : options,
      success : function(g){ 
        console.log('render kgraph',JSON.stringify(kgraph,4,4));
        this._render(g);
      }.bind(this)
    });
    return kgraph;
  },

  _initDefs : function(svg){

    var SVGNS = 'http://www.w3.org/2000/svg';
    var defs = document.createElementNS(SVGNS,'defs'); 
    var marker = document.createElementNS(SVGNS,'marker'); 
    var path = document.createElementNS(SVGNS,'path'); 
    marker.setAttributeNS(null, 'id','end');
    marker.setAttributeNS(null, 'viewBox','0 -5 10 10');
    marker.setAttributeNS(null, 'refX','10');
    marker.setAttributeNS(null, 'refY','0');
    marker.setAttributeNS(null, 'markerWidth','3');
    marker.setAttributeNS(null, 'markerHeight','5');
    marker.setAttributeNS(null, 'orient','auto');
    path.setAttributeNS(null, 'd', 'M0,-5L10,0L0,5');

    svg.appendChild(defs);
    defs.appendChild(marker);
    marker.appendChild(path);
  },

  //TODO: update

  _measureTextDimensions : function (text){
    var txt = this._s.text(0,0,text);
    var bbox = txt.getBBox();
    txt.remove(); 
    return bbox; 
  },

  _scjsonStateToKlayNode : function (parentState, state){

    var bbox = this._measureTextDimensions(state.id);
    state._klayNode = {
      "id" : state.id,
      "labels" : [ { text : state.id || '' } ],
      "edges" : [],
      "width" : bbox.width + LEAF_NODE_PADDING_W * 2,
      "height" : bbox.height + LEAF_NODE_PADDING_H * 2
    };
    if(state.$type){
      state._klayNode.$type = state.$type;  //copy in type information
    }
    if(state.transitions){
      parentState._klayNode.edges.push.apply(parentState._klayNode.edges, 
        state.transitions.filter(function(transition){return transition.target;})
          .map(function(transition){
            var klayTransition = {
              id : state.id + '_' + transition.target,
              source : state.id,
              target : transition.target,
              labels : []
            };

            var event = transition.event;
            if(event){
              var eventBBox = this._measureTextDimensions(event); 
              klayTransition.labels.push({ text : event, width : eventBBox.width, height : eventBBox.height });
            }
            return klayTransition;
          }.bind(this)));
    }
    if(state.states){
      state._klayNode.children = state.states.map(this._scjsonStateToKlayNode.bind(this,parentState));
    }

    return state._klayNode;
  },

  _clearBendpoints : function(parent) {
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
  },

  _applyInitialCoordinates : function(parent) {
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
  },


  _populateIdMap : function(graphRoot){

    this._idMap = {};
    var walk = (function(graphNode){
      this._idMap[graphNode.id] = graphNode;
      if(graphNode.children) graphNode.children.forEach(walk);
    }.bind(this));

    walk(graphRoot);
    
  },

  _normalizeStateIds : function(scjson){
    var walk = (function(node){
      node.id = node.id || ('$generated-' + this._generatedIdCount++);
      if(node.states) node.states.forEach(walk.bind(this));
    }.bind(this));
    walk(scjson);
  },

  _render : function(graphRoot){
    this._allEdges = [];
    this._populateIdMap(graphRoot);
    this._s.attr('viewBox','0 0 ' + graphRoot.width + ' ' + graphRoot.height);

    if(!graphRoot._displayNode){
      var group = this._root.group();
      var rect = group.rect(graphRoot.x, graphRoot.y, graphRoot.width, graphRoot.height);

      graphRoot._displayNode = group;
      group.addClass('node');
      group.addClass('compound');
    }

    if(graphRoot.edges){
      this._allEdges.push.apply(this._allEdges, graphRoot.edges);
    }

    graphRoot.children.forEach(this._renderGraphNode.bind(this,graphRoot));
     
  },

  _selectNode : function(group){
    if(this._selectedNode){
      this._selectedNode.removeClass('selected');
    } 
    
    //deselect others
    group.addClass('selected');
    this._selectedNode = group;
  },

  _renderGraphNode : function(parentGraphNode, graphNode){

    if(!graphNode._displayNode){
      var group = parentGraphNode._displayNode.group();
      group.node.setAttributeNS(null,'id',graphNode.id);    //tag him with state id
      var rect = group.rect(0, 0, graphNode.width, graphNode.height);
      var label = group.text(LEAF_NODE_PADDING_W, LEAF_NODE_PADDING_H, graphNode.id).attr('dominant-baseline','text-before-edge');
      group.transform('t' + graphNode.x + ',' + graphNode.y); 
      // By default its black, lets change its attributes
      group.addClass('node');
      group.addClass(graphNode.children ? 'compound' : 'leaf');

      if(graphNode.$type){
        group.addClass(graphNode.$type);
      }

      graphNode._displayNode = group;

      group.click(function(e){
        e.preventDefault();
        e.stopPropagation();
        this._selectNode(group);
      }.bind(this));
    } else {
      //animate
      graphNode._displayNode.animate({transform : 't' + graphNode.x + ',' + graphNode.y}, ANIM_DURATION);
      graphNode._displayNode.select('rect').animate({width : graphNode.width, height : graphNode.height},ANIM_DURATION);
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
        if( this._isSourceAncestorOfTarget(edge.source, edge.target) ){
          this._renderEdge(graphNode, edge);
        } else {
          this._renderEdge(parentGraphNode, edge);
        }

        //remove edge from allEdges
        this._allEdges.splice(this._allEdges.indexOf(edge), 1);
      }.bind(this));
    }
  },

  _isSourceAncestorOfTarget : function(sourceId, targetId){
    var foundTargetInSourceDescendants = false;
    function walk(currentNode){
      foundTargetInSourceDescendants = currentNode.id === targetId;
      if(foundTargetInSourceDescendants) return;
      else if(currentNode.children) currentNode.children.forEach(walk);
    }

    var sourceNode = this._idMap[sourceId];
    if(sourceNode.children) sourceNode.children.forEach(walk);
    return foundTargetInSourceDescendants; 
  },

  _renderEdge : function(parentGraphNode, edge){
    var d = 
      'M' + edge.sourcePoint.x + ' ' + edge.sourcePoint.y + ' ' +
        (edge.bendPoints ? edge.bendPoints.map(function(bp){
          return 'L' +  bp.x + ' ' + bp.y + ' ';
        }).reduce(function(a,b){
          return a + b;  
        },'') : '') + 
        ' L' + edge.targetPoint.x + ' ' + edge.targetPoint.y;
    if(!edge._displayNode){
      var path = parentGraphNode._displayNode.path(d);
      path.addClass('link');

      edge._displayNode = path;
      path.node.setAttributeNS(null, 'id', edge.source + '->' + edge.target);
    } else {
      if(edge._displayNode.numberOfItems == ((edge.bendPoints ? edge.bendPoints.length : 0) + 2)){
        //animate
        edge._displayNode.animate({d : path}, ANIM_DURATION);
      } else {
        //remove and rebuild
        edge._displayNode.remove();
        path = parentGraphNode._displayNode.path(d);
        path.addClass('link');
        edge._displayNode = path;
      }
    }

    if(edge.labels && edge.labels.length){
      edge.labels.forEach(function(label){

        //fix edge label coordinates. Workaround for issue OpenKieler/klayjs#8
        if(edge.source === edge.target){
          //debugger;
          label.x = edge.bendPoints[1].x;
          label.y = edge.bendPoints[1].y;
          label.textAnchor = 'end';

          //does the self edge loop up or down?
          if(edge.bendPoints[0].y < edge.bendPoints[1].y){
            //line has positive slope
            //goes below the slope
            label.dominantBaseline = 'text-before-edge';
          }else {
            //line has negative slope
            //goes above the slope
            label.dominantBaseline = 'text-after-edge';
          }
        }

        //render labels
        if(!label._displayNode){
          label._displayNode = parentGraphNode._displayNode.text(label.x, label.y, label.text);
          label._displayNode.node.setAttributeNS(null,'dominant-baseline', label.dominantBaseline || 'text-before-edge');
          label._displayNode.node.setAttributeNS(null,'text-anchor',label.textAnchor || 'start');
        }else{
          //update label displayNode
          label._displayNode.animate({x: label.x, y : label.y});
        }
      });
    }

  }

};

window.SCHVIZ = SCHVIZ; 

})();
