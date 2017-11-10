/// <reference path="../tsd/smil.d.ts" />…

import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import * as React from "react";
import constants from './constants';
import IdGenerator from './IdGenerator';
import Debug = require('debug');
import scxml = require('@jbeard/scxml');    //TODO: make scxml an es6 module
const debug = Debug('GraphNode');
import GraphNode from './GraphNode';
import _ = require('underscore');
import {LayoutOptions} from './IKGraphRenderBackend';
import {SCState, SCTransition, findStateById} from './SCJSON';
import SCJSONToKGraphTransformer from './SCJSONToKGraphTransformer';

export interface GraphRootProps {
  pathToSCXML? : string;
  urlToSCXML? : string;
  scxmlDocumentString? : string;
  scjson? : scxml.scion.SCState,  //TODO: refactor this property name to 'scState' 
  kgraphRoot? : KGraphNode,
  layoutOptions? : LayoutOptions,
  redraw? : boolean,
  configuration? : string[],
  disableAnimation? : boolean
  transitionsEnabled? : Map<string, Set<number>>;
  previousConfiguration? : string[];
  statesForDefaultEntry? : string[];
  disableZoom? : boolean
}

export interface GraphRootAnimation {
  allEdges : KGraphEdge[];
  enabledEdges : KGraphEdge[];
  kgraph : KGraph;
  fromNode : KGraphNode;
  toNode : KGraphNode;
  fromZoom : SVGRect;
  toZoom : SVGRect;
  fastZoom? : boolean;
  instantZoom? : boolean;
}

export default class SCHVIZ extends React.PureComponent<GraphRootProps, GraphRootAnimation> {

  private svgRootElement : SVGSVGElement;
  private viewBoxAnimation : SVGAnimationElement;
  private defaultRect : SVGRect;
  public collapsedNodeMap : Map<string, boolean>;

  public static layouts = constants.layouts;   //expose layouts

  constructor(props:GraphRootProps){
    super(props);
    this.collapsedNodeMap = new Map<string, boolean>();   //TODO: save in localStorage
    this.state = { 
      allEdges : [],
      enabledEdges : [],
      kgraph : null,
      fromZoom : {x : 0, y : 0, width : 0, height : 0},
      toZoom : {x : 0, y : 0, width : 0, height : 0},
      fromNode : null,
      toNode : null
    };
  }

  private getDefaultLayoutOptions(layoutOptions){
    return _.extend({}, constants.layouts.right, layoutOptions);
  }

  toViewportCoordinates(event){
    //convert event client coordinates (which are in screen coordinates) to viewport coordinates
    var pt = this.svgRootElement.createSVGPoint();
    pt.x = event.clientX; 
    pt.y = event.clientY;
    return pt.matrixTransform(this.svgRootElement.getScreenCTM().inverse());
  }

  handleMouseWheel(event){
    debug('handleMouseWheel', event.clientX, event.clientY, event);
    event.preventDefault();
    event.stopPropagation();

    //let n = event.deltaY > 0 ? 1 : -1;
    //const offset = .1 * n;
    let offset = .4;
    offset = event.deltaY > 0 ? 1-offset : 1+offset;
    
    let fromZoom = this.svgRootElement.viewBox.animVal;
    let pt2 = this.toViewportCoordinates(event);

    let eastLength = (fromZoom.x + fromZoom.width) - pt2.x;
    eastLength *= offset; //compute new length
    let east = { x : pt2.x + eastLength, y : pt2.y };

    let westLength = pt2.x - fromZoom.x;
    westLength *= offset; //compute new length
    let west = { x : pt2.x - westLength, y : pt2.y };

    let southLength = (fromZoom.y + fromZoom.height) - pt2.y;
    southLength *= offset; //compute new length
    let south = { x : pt2.x, y : pt2.y + southLength };

    let northLength = pt2.y - fromZoom.y;
    northLength *= offset; //compute new length
    let north = { x : pt2.x, y : pt2.y - northLength };

    let toZoom = {
      x : west.x,
      y : north.y,
      width : east.x - west.x,
      height : south.y - north.y
    };
    if(toZoom.width < 10 || toZoom.height < 10) return;

    toZoom.x = toZoom.x < 0 ? 0 : toZoom.x;
    toZoom.y = toZoom.y < 0 ? 0 : toZoom.y;
    toZoom.width = toZoom.width > this.state.toNode.width ? this.state.toNode.width : toZoom.width;
    toZoom.height = toZoom.height > this.state.toNode.height ? this.state.toNode.height : toZoom.height;

    if(!this.props.disableAnimation){
      this.viewBoxAnimation.setAttributeNS(null, 'from', this.svgRectToViewBox(fromZoom));
      this.viewBoxAnimation.setAttributeNS(null, 'to', this.svgRectToViewBox(toZoom));
      this.viewBoxAnimation.setAttributeNS(null, 'dur', '250ms');
      this.viewBoxAnimation.beginElement();
    } else{
      this.svgRootElement.setAttributeNS(null, 'viewBox', this.svgRectToViewBox(toZoom));
    }

    _.extend(
      this.state,
      {
        toZoom : toZoom,
        fromZoom : toZoom
      }
    );
  }

  componentWillReceiveProps(props : GraphRootProps){
    this.checkProps(props);
    if(
      (props.pathToSCXML || props.urlToSCXML || props.scxmlDocumentString) &&
      (
       props.pathToSCXML !== this.props.pathToSCXML || 
       props.urlToSCXML !== this.props.urlToSCXML ||
       props.scxmlDocumentString !== this.props.scxmlDocumentString ||
       props.layoutOptions !== this.props.layoutOptions
      ) 
    ) this.initSCXML(props, false);
    if(
      ( props.scjson ) &&
      (
        props.scjson !== this.props.scjson ||
        props.layoutOptions !== this.props.layoutOptions
      ) 
    ) this.initSCJson(props, false);
    if(
      props.kgraphRoot &&
      (
        props.kgraphRoot !== this.props.kgraphRoot ||
        props.layoutOptions !== this.props.layoutOptions
      )
    ) this.initKGraph(props, false);
  }

  //later, try handleMouseClick
  handleClick(event){
    debug('handleClick', event);
  }

  eventStamp : SVGPoint;
  eventBuffer : Array<SVGPoint>;
  deltaBuffer : Array<SVGPoint>;
  initialZoom : SVGRect;

  handleMouseDown(event){
    debug('handleMouseDown', event);
    if(event.button !== 0) return;
    this.eventBuffer = [];
    this.deltaBuffer = [];
    this.eventStamp = this.svgRootElement.createSVGPoint();
    this.eventStamp.x = event.clientX;
    this.eventStamp.y = event.clientY;
    this.initialZoom = this.state.toZoom;
  }

  handleMouseUp(event){
    debug('handleMouseUp', event);
    this.eventStamp = null;
    this.eventBuffer = null;
    this.deltaBuffer = null;
    this.initialZoom = null;
  }

  handleMouseMove(event){
    if(!this.eventStamp) return;

    debug('handleMouseMove', event.clientX, event.clientY);
    let pt1 = this.eventStamp;
    let pt2 = this.svgRootElement.createSVGPoint();
    pt2.x = event.clientX;
    pt2.y = event.clientY;

    //if(pt1.x !== pt2.x || pt1.y !== pt2.y) debugger;

    var tdelta = this.svgRootElement.createSVGPoint();
    tdelta.x = pt2.x - pt1.x ; 
    tdelta.y = pt2.y - pt1.y;

    let ctm = this.svgRootElement.getScreenCTM()
    tdelta.x /= ctm.a;
    tdelta.y /= ctm.d;

    //compute delta
    debug('tdelta', tdelta.x, tdelta.y);

    //compute toZoom viewBox coordinates
    //first compute height
    let x = this.initialZoom.x - tdelta.x;
    let y = this.initialZoom.y - tdelta.y;

    let toZoom = {
      x : x,
      y : y,
      width : this.initialZoom.width,
      height : this.initialZoom.height
    };
    
    let viewBox = `${toZoom.x} ${toZoom.y} ${toZoom.width} ${toZoom.height}`;

    if(!this.props.disableAnimation){
      this.viewBoxAnimation.setAttributeNS(null, 'from', viewBox);
      this.viewBoxAnimation.setAttributeNS(null, 'to', viewBox);
      this.viewBoxAnimation.setAttributeNS(null, 'dur', '0ms');
      this.viewBoxAnimation.beginElement();
    } else{
      this.svgRootElement.setAttributeNS(null, 'viewBox', viewBox);
    }

    _.extend(
      this.state,
      {
        toZoom : toZoom,
        fromZoom : toZoom
      }
    );
  }

  private _getEnabledEdges(allEdges, transitionsEnabled){
    let enabledEdges = allEdges.filter( edge => 
      transitionsEnabled &&
      transitionsEnabled.has(edge.source) && 
      transitionsEnabled.get(edge.source).has(parseInt(edge.id.split(':')[1])) 
    );
    let edgeIds = allEdges.map(edge => edge.id);
    let enabledHyperedges = enabledEdges.
      filter( edge => edge.$hyperlink ).
      map( edge => { 
        let idx = edgeIds.indexOf(edge.$hyperlink);
        return allEdges[idx];
      });

    return enabledEdges.concat( enabledHyperedges );
  }

  private initSCXML(props : GraphRootProps , initialRender : boolean){

    const handler = (text) => {
      let scjson = scxml.ext.compilerInternals.scxmlToScjson(text);
      let augmentedProps = _.extend({}, props, {scjson : scjson});
      this.initSCJson(augmentedProps, initialRender);
    }

    if(props.pathToSCXML){
      fetch(props.pathToSCXML).then(function(response) {
        return response.text();
      }).then(handler);
    }else if(props.urlToSCXML){
      fetch(props.urlToSCXML).then(function(response) {
        return response.text();
      }).then(handler);
    }else if(props.scxmlDocumentString){
      handler(props.scxmlDocumentString);
    }else {
      throw new Error('TODO');
    }

  }

  private initSCJson(props : GraphRootProps , initialRender : boolean){
    //if scjson is not the same, create a new kgraph
    //TODO: memoize
    if(props.scjson){
      let idGenerator = new IdGenerator();
      let transformer = new SCJSONToKGraphTransformer(idGenerator, this);
      var newKlayToScjsonMap, newKgraphRoot; 
      newKgraphRoot = transformer.transform(props.scjson);
      this.initKGraph(props, initialRender, idGenerator, newKgraphRoot);
    }
  }


  private initKGraph(props : GraphRootProps , initialRender : boolean, idGen?: IdGenerator, kgRoot? : KGraphNode){
    let idGenerator = idGen || new IdGenerator(); 
    let kgraphRoot = props.kgraphRoot || kgRoot;
    let kgraph = new KGraph(idGenerator, this.svgRootElement, kgraphRoot);
    let allEdges = kgraph ? this._getAllEdges(kgraph) : [];
    let enabledEdges = this._getEnabledEdges(allEdges, props.transitionsEnabled);
    const options = this.getDefaultLayoutOptions(props.layoutOptions)
    if(!this.props.disableAnimation) this.svgRootElement.pauseAnimations();
    kgraph.updateLayout(options, (err, rootNode) => {
      console.log('kgraph rootNode',rootNode);
      if(err) throw err;
      let toZoom = {x : 0, y : 0, width : rootNode.width, height : rootNode.height};
      this.setState({ 
        allEdges : allEdges,   //TODO: this is likely to be a hotspot. we probably want to move this search logic inside of the kgraph data structure
        enabledEdges : enabledEdges,
        kgraph : kgraph,
        fromZoom : initialRender || props.redraw ? toZoom : this.svgRootElement.viewBox.animVal,
        toZoom : toZoom,
        fromNode : this.state.toNode,
        toNode : rootNode
      }, () => {
        //add a timeout to let the thread settle before starting animations
        //without this, on large models, we lose the first few animation frames
        if(!this.props.disableAnimation) setTimeout( () => {
          this.svgRootElement.unpauseAnimations();
        })
      });
    })  
  }

  componentDidUpdate(){
    this.animate();
  }

  private checkProps(props){
    var propNames = [
      'pathToSCXML',
      'urlToSCXML',
      'scxmlDocumentString',
      'scjson',
      'kgraphRoot'
    ]
    let namesInProps = propNames.filter( n => props[n] )
    if(namesInProps.length !== 1) throw new Error('SCHVIZ must have exactly one of the following properties: ' + propNames.join(', '));
    return true;
  }

  componentDidMount(){
    this.checkProps(this.props);
    if( this.props.pathToSCXML ||
          this.props.urlToSCXML ||
          this.props.scxmlDocumentString) { 
      this.initSCXML(this.props, true);
    } else if(this.props.scjson){
      this.initSCJson(this.props, true);
    } else if (this.props.kgraphRoot ){
      this.initKGraph(this.props, true);
    } 

    this.animate();
  }

  public toggleExpandContractState(nodeId : string){
    this.collapsedNodeMap.set(nodeId, !this.collapsedNodeMap.get(nodeId)); //toggle contracted
    this.initSCJson(this.props, false);
  }

  private animate(){
    if(!this.props.disableAnimation) this.viewBoxAnimation.beginElement();  //reset animation
  }

  render(){
    //modify transitionsEnabled to support hyperlinks
    let from = `${[this.state.fromZoom.x, this.state.fromZoom.y, this.state.fromZoom.width,this.state.fromZoom.height].join(' ')}`;
    let to = `${[this.state.toZoom.x, this.state.toZoom.y, this.state.toZoom.width, this.state.toZoom.height].join(' ')}`;
    let viewBoxValues = `${from};${to}`;
    debug('viewBoxValues ', viewBoxValues );
    return <div style={{width:'100%', height:'100%',position:'absolute'}}>
        <svg width="100%" height="100%" 
          ref={(e: SVGSVGElement) => { this.svgRootElement = e; }}
          onWheel={this.props.disableZoom ? null : this.handleMouseWheel.bind(this)}
          onClick={this.handleClick.bind(this)}
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          viewBox={this.props.disableAnimation ? to : undefined}
        >
        {
          !this.props.disableAnimation && 
            <animate 
              className={constants.START}
              ref={(e: SVGAnimationElement) => { this.viewBoxAnimation = e; }}
              attributeName="viewBox" fill="freeze" begin="indefinite"
              dur={this.state.instantZoom ? '0ms' : ( this.state.fastZoom ? '250ms' : constants.ANIM_DURATION ) } 
              from={from}
              to={to}/>
        }
        <defs>
          { 
            ['','Highlighted'].map( (s) => (
              <radialGradient id={'finalStateGradient' + s} cx="2" cy="2" fx="2" fy="2" r="1" gradientUnits="userSpaceOnUse" key={s}>
                <stop offset="0"></stop>
                <stop offset="0.85576922"></stop>
                <stop offset="0.85576922"></stop>
                <stop offset="1"></stop>
              </radialGradient>
            ))
          }
          {
            this._markers()
          }
        </defs>
        <g>
          { 
            this.state.kgraph &&
              <GraphNode
                schviz={this}
                node={this.state.kgraph.root}
                allEdges={this.state.allEdges}
                kgraph={this.state.kgraph}
                isRoot={true}
                graphRoot={this}
                redraw={this.props.redraw}
                configuration={this.props.configuration}
                disableAnimation={this.props.disableAnimation}
                enabledEdges={this.state.enabledEdges}
                previousConfiguration={this.props.previousConfiguration}
                statesForDefaultEntry={this.props.statesForDefaultEntry}
                />
          }
        </g>
      </svg>
    </div>;
  }

  private _getAllEdges(kgraph:KGraph){
    let allEdges = [];
    function walk(s:KGraphNode){
      if(s.edges) s.edges.forEach((edge) => allEdges.push(edge));
      if(s.children) s.children.forEach(walk);
    }
    walk(kgraph.root);
    return allEdges;
  }

  private _markers(){
    var toReturn = [];
    var ids = {
      'right' : 10,
      'down' : 10,
      'left' : 0,
      'up' : 0
    };
    
    var id;
    var i = 0;
    for(id in ids){
      toReturn.push(
        <marker key={id} id={id} viewBox="0 -5 10 10" refX="0" refY="0" markerWidth={constants.ARROW_WIDTH} markerHeight={constants.ARROW_HEIGHT} orient={90 * i}><path d="M0,-5L10,0L0,5"></path></marker>
      );
      i++;
    }
    return toReturn;
  }

  zoomToState(stateId){
    let e = (document.getElementById(stateId)) as any as SVGGElement;
    let bbox:SVGRect = e.getBBox();
    let m0:SVGMatrix = this.svgRootElement.getCTM();
    let m1:SVGMatrix = e.getCTM();
    let m = m0.inverse().multiply(m1);
    let x = m.e,
        y = m.f,
        width = bbox.width,
        height = bbox.height;

    let toZoom = {
      x : m.e,
      y : m.f,
      width : bbox.width,
      height : bbox.height
    };

    let fromZoom = this.svgRootElement.viewBox.animVal;

    let fromViewBox = this.svgRectToViewBox(fromZoom);
    let toViewBox = this.svgRectToViewBox(toZoom);

    if(!this.props.disableAnimation){
      this.viewBoxAnimation.setAttributeNS(null, 'from', fromViewBox);
      this.viewBoxAnimation.setAttributeNS(null, 'to', toViewBox);
      this.viewBoxAnimation.setAttributeNS(null, 'dur', '250ms');
      this.viewBoxAnimation.beginElement();
    } else{
      this.svgRootElement.setAttributeNS(null, 'viewBox', toViewBox);
    }

    _.extend(
      this.state,
      {
        toZoom : toZoom,
        fromZoom : toZoom
      }
    );
  }

  private svgRectToViewBox(rect : SVGRect){
    return `${rect.x} ${rect.y} ${rect.width} ${rect.height}`;
  }
}

