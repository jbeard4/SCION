/// <reference path="../tsd/smil.d.ts" />…

import * as React from "react";
import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import { SCState } from 'scion-core-base';    //TODO: make scxml an es6 module
import constants from './constants';
import IdGenerator from './IdGenerator';
import Debug = require('debug');
const debug = Debug('GraphNode');
import GraphNode from './GraphNode';
import {LayoutOptions} from './IKGraphRenderBackend';
import SCJSONToKGraphTransformer from './SCJSONToKGraphTransformer';
import {GraphRoot} from './GraphRoot';
require('../node_modules/load-awesome/css/line-spin-fade-rotating.css')
require('../test-integration/styles.css')
require('../node_modules/jquery-ui-dist/jquery-ui.css')
import _ = require('underscore');

export function getDefaultLayoutOptions(layoutOptions){
  return _.extend({}, constants.layouts.right, layoutOptions);
}


export interface GraphRootProps {
  pathToSCXML? : string;
  urlToSCXML? : string;
  scxmlDocumentString? : string;
  scjson? : SCState,  //TODO: refactor this property name to 'scState' 
  kgraphRoot? : KGraphNode,
  layoutOptions? : LayoutOptions,
  redraw? : boolean,
  configuration? : string[],
  disableAnimation? : boolean
  transitionsEnabled? : Map<string, Set<number>>;
  previousConfiguration? : string[];
  statesForDefaultEntry? : string[];
  disableZoom? : boolean;
  disableZoomAnimation? : boolean;
  hideActions? : boolean;
  expandAllStatesByDefault? : boolean;
  tabIndex? : number;
  glContainer? : any;
  id?: string;
}

export interface GraphRootAnimation {
  allEdges : KGraphEdge[];
  enabledEdges : KGraphEdge[];
  kgraph : KGraph;
  instantZoom? : boolean;
  transitionsEnabled? : Map<string, Set<number>>;
  progress : string[];
  loading : boolean;
  selectedNodeId: string;
  selectedEdgeId: string;
}

export interface SchvizState {
  layoutOptions? : LayoutOptions;
}



export default class SCHVIZ extends React.PureComponent<GraphRootProps, SchvizState> {

  private htmlRootElement : HTMLDivElement;
  public graphRoot : GraphRoot;

  public static layouts = constants.layouts;   //expose layouts

  componentDidMount(){
    const jquery = window['jQuery'] as any;
    const self = this;
    if(jquery) jquery(document).contextmenu({
      delegate: ".schviz",
      autoFocus: true,
      preventContextMenuForPopup: true,
      preventSelect: true,
      taphold: true,
      menu: [
        {
          title : 'Layout',
          children: Object.keys(constants.layouts).map((layoutName) => ({
            title : layoutName,
            cmd : 'setLayout'
          }))
        },
        {title: "----"},
        {
          title : 'Zoom to state',
          cmd : 'zoomToState'
        },
        {
          title : 'Expand/contract',
          cmd : 'toggleExpandNode'
        },
        {title: "----"},
        {
          title : 'Reset Zoom',
          cmd : 'resetZoom'
        },
      ],
      beforeOpen: function(event, ui) {
        var $menu = ui.menu,
            $target = ui.target,
            extraData = ui.extraData; // optionally passed when menu was opened by call to open()

        const node = $target.closest('.node');
        const tagName = $target.prop('tagName');
        if(tagName === 'svg' || tagName === 'DIV'){
          jquery(document).contextmenu('showEntry', "zoomToState", false);
          jquery(document).contextmenu('showEntry', "toggleExpandNode", false);
        }else{
          const id = node.attr('id');
          extraData.nodeId = id; 
          jquery(document).contextmenu('showEntry', "zoomToState");
          jquery(document).contextmenu('showEntry', "toggleExpandNode");
        }
      },
      select: function(event, ui) {
        var $target = ui.target;
        switch(ui.cmd){
          case "setLayout":
            self.setState({layoutOptions : getDefaultLayoutOptions(constants.layouts[ui.item.text()])}); 
            break;
          case 'zoomToState':
            self.graphRoot.zoomToState(ui.extraData.nodeId);
            break;
          case 'toggleExpandNode':
            self.graphRoot.toggleExpandContractState(ui.extraData.nodeId);
            break;
          case 'resetZoom':
            self.graphRoot.resetZoom();
            break;
        }
      }
    } as any);

  }

  componentWillReceiveProps(props : GraphRootProps){
    if(props.layoutOptions !== this.props.layoutOptions){
      this.setState({layoutOptions : props.layoutOptions});
    }
  }

  render(){
    const props = _.extend({},this.props,this.state);
    return <div className="schviz" ref={(e: HTMLDivElement) => { this.htmlRootElement = e; }}>
      <GraphRoot ref={e => this.graphRoot = e} {...props}/>
    </div>
  }
}

