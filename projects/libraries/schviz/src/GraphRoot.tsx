import * as React from "react";
import {GraphRootProps, GraphRootAnimation, getDefaultLayoutOptions} from './index';
import scxml from './scxml';
import { SCState } from '@scion-scxml/core-base';    //TODO: make scxml an es6 module
import _ = require('underscore');
import Debug = require('debug');
const debug = Debug('GraphRoot');
import IdGenerator from './IdGenerator';
import SCJSONToKGraphTransformer from './SCJSONToKGraphTransformer';
import {KGraph, KGraphNode, KGraphEdge, KGraphLabel, Point} from './KGraph';
import constants from './constants';
import GraphNode from './GraphNode';

export class GraphRoot extends React.PureComponent<GraphRootProps, GraphRootAnimation> {

  private svgRootElement : SVGSVGElement;
  private htmlRootElement : HTMLDivElement;
  private virtualViewbox : SVGRect;
  private previousVirtualViewbox : SVGRect;
  public collapsedNodeMap : any;
  private lastTransitionId : string;
  private cachedLastScjson : SCState;
  private handleResize : any;

  constructor(props:GraphRootProps){
    super(props);

    this.handleResize = () => {
      this.refreshViewbox();
    }

    this.state = { 
      allEdges : [],
      enabledEdges : [],
      kgraph : null,
      progress  : [],
      selectedNodeId : null,
      selectedEdgeId : null,
      loading : false
    };
  }

  toViewportCoordinates(event){
    //convert event client coordinates (which are in screen coordinates) to viewport coordinates
    var pt = this.svgRootElement.createSVGPoint();
    pt.x = event.clientX; 
    pt.y = event.clientY;
    return pt.matrixTransform(this.svgRootElement.getScreenCTM().inverse());
  }

  handleMouseWheel(event){
    //debug('handleMouseWheel', event.clientX, event.clientY, event);
    event.preventDefault();
    event.stopPropagation();

    //let n = event.deltaY > 0 ? 1 : -1;
    //const offset = .1 * n;
    let offset = .025;
    offset = event.deltaY > 0 ? 1-offset : 1+offset;

    let fromZoom = this.virtualViewbox;
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
    toZoom.width = toZoom.width > this.state.kgraph.root.width ? this.state.kgraph.root.width : toZoom.width;
    toZoom.height = toZoom.height > this.state.kgraph.root.height ? this.state.kgraph.root.height : toZoom.height;

    this.zoomToViewbox(toZoom);

  }

  componentWillReceiveProps(props : GraphRootProps){
    this.checkProps(props);

    //make it so that transitionsEnabled can update at any time
    if(props.transitionsEnabled && 
        props.transitionsEnabled !== this.props.transitionsEnabled){
      let newState = {transitionsEnabled : props.transitionsEnabled};
      if(this.state.kgraph){
        let allEdges = this._getAllEdges(this.state.kgraph);
        let enabledEdges = this._getEnabledEdges(allEdges, props.transitionsEnabled);
        _.extend(newState,{allEdges, enabledEdges});
      }
      this.setState(newState);
    }  
    if(
      (props.pathToSCXML || props.urlToSCXML || props.scxmlDocumentString) &&
      (
       props.pathToSCXML !== this.props.pathToSCXML || 
       props.urlToSCXML !== this.props.urlToSCXML ||
       props.scxmlDocumentString !== this.props.scxmlDocumentString ||
       props.layoutOptions !== this.props.layoutOptions
      ) 
    ) return this.initSCXML(props, false);
    if(
      ( props.scjson ) &&
      (
        props.scjson !== this.props.scjson ||
        props.layoutOptions !== this.props.layoutOptions
      ) 
    ) return this.initSCJson(props, false);
    if(
      props.kgraphRoot &&
      (
        props.kgraphRoot !== this.props.kgraphRoot ||
        props.layoutOptions !== this.props.layoutOptions
      )
    ) return this.initKGraph(props, false);
  }

  eventStamp : {clientX : number, clientY : number};
  cachedClickEventTarget : SVGElement;
  didMove : boolean;

  handleMouseDown(event){
    //console.log('handleMouseDown', event, event.clientX, event.clientY);
    if(event.button !== 0) return;
    this.eventStamp = {clientX : event.clientX, clientY : event.clientY};
    this.cachedClickEventTarget = event.target;
    this.didMove = false;
  }

  handleMouseUp(event){
    debug('handleMouseUp', event);
    this.eventStamp = null;
    if(!this.didMove){
      this.handleClick();
    }
  }

  handleClick(){
    //get first ancestor with an id
    let currentTarget = this.cachedClickEventTarget;
    while(currentTarget &&
        !currentTarget.id && 
        !(
          Array.from(currentTarget.classList).indexOf('node') > -1 ||   
          Array.from(currentTarget.classList).indexOf('link') > -1 
        )
    ){
      currentTarget = currentTarget.parentNode as SVGElement; 
    }
    
    if(currentTarget){
      if(Array.from(currentTarget.classList).indexOf('node') > -1){
        this.setState({
          selectedNodeId: currentTarget.id, 
          selectedEdgeId: null
        });
      } else if(Array.from(currentTarget.classList).indexOf('link') > -1 ) {
        this.setState({
          selectedNodeId: null,
          selectedEdgeId: currentTarget.id
        });
      }
    }
  }

  handleMouseMove(event){
    if(!this.eventStamp) return;
    this.didMove = true;
    debug('handleMouseMove', this.eventStamp.clientX, this.eventStamp.clientY, event.clientX, event.clientY);
    const pt1 = this.toViewportCoordinates(this.eventStamp)
    const pt2 = this.toViewportCoordinates(event)

    //if(pt1.x !== pt2.x || pt1.y !== pt2.y) debugger;

    var tdelta = this.svgRootElement.createSVGPoint();
    tdelta.x = pt2.x - pt1.x; 
    tdelta.y = pt2.y - pt1.y;

    //compute delta

    //compute toZoom viewBox coordinates
    //first compute height
    let x = this.virtualViewbox.x - tdelta.x;
    let y = this.virtualViewbox.y - tdelta.y;

    /*
    console.log('pt1', pt1.x, pt1.y);
    console.log('pt2', pt2.x, pt2.y);
    console.log('tdelta', tdelta.x, tdelta.y);
    console.log('x', x);
    console.log('y', y);
    */

    let toZoom = {
      x : x,
      y : y,
      width : this.virtualViewbox.width,
      height : this.virtualViewbox.height
    };

    toZoom.x = toZoom.x < 0 ? 0 : (toZoom.x + toZoom.width > this.state.kgraph.root.width  ? this.virtualViewbox.x  : toZoom.x);
    toZoom.y = toZoom.y < 0 ? 0 : (toZoom.y + toZoom.height > this.state.kgraph.root.height  ? this.virtualViewbox.y  : toZoom.y);
    
    this.zoomToViewbox(toZoom);
    this.eventStamp = {clientX : event.clientX, clientY : event.clientY};
  }

  private _getEnabledEdges(allEdges, transitionsEnabled){
    let enabledEdges = allEdges.filter( edge => 
      transitionsEnabled &&
      transitionsEnabled.has(edge.source) && 
      transitionsEnabled.get(edge.source).has(parseInt(edge.id.split(':').pop())) 
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
      let scjson = scxml['ext'].compilerInternals.scxmlToScjson(text);
      this.cachedLastScjson = scjson; 
      let augmentedProps = _.extend({}, props, {scjson : scjson});
      this.setState({progress : this.state.progress.slice(0,-1).concat(this.state.progress[this.state.progress.length-1] + ` Done (${(new Date() as any) - tic}ms)`)}, () => {
        this.initSCJson(augmentedProps, initialRender);
      });
    }

    const tic = new Date() as any;
    this.setState({loading : true, progress : this.state.progress.concat('Compiling SCXML to SCJSON...' )}, () => {
      const fetchableUrl = props.urlToSCXML || props.pathToSCXML;
      if(fetchableUrl){
        fetch(fetchableUrl, {
          method: "GET",
          headers: [],
          credentials: "same-origin",
          mode:"cors"
        }).then(function(response) {
          return response.text();
        }).then(handler);
      }else if(props.scxmlDocumentString){
        handler(props.scxmlDocumentString);
      }else {
        throw new Error('TODO');
      }
    })
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
  }

  private initCollapsedNodeMap(scjson){
      function traverse(state, depth, accumulator){
        if(depth >= 1) accumulator[state.id] = true;
        if(state.states){
          state.states.forEach( child => traverse(child, depth+1, accumulator));
        }
        return accumulator;
      }

      return window.localStorage && window.localStorage.collapsedNodeMap ? 
        JSON.parse(window.localStorage.collapsedNodeMap) : 
        (!this.props.expandAllStatesByDefault  ?
          traverse(scjson, 0, {}) : 
          {});
  }

  private initSCJson(props : GraphRootProps , initialRender : boolean){
    //if scjson is not the same, create a new kgraph
    //TODO: memoize
    if(props.scjson){
      const tic = new Date() as any;
      this.setState({loading : true, progress : this.state.progress.concat('Compiling SCJSON to KLay JSON...' )}, () => {
        //init collapsedNodeMap
        this.collapsedNodeMap = this.initCollapsedNodeMap(props.scjson);
        let idGenerator = new IdGenerator();
        let transformer = new SCJSONToKGraphTransformer(idGenerator, this);
        var newKlayToScjsonMap, newKgraphRoot; 
        newKgraphRoot = transformer.transform(props.scjson, {hideActions : props.hideActions, hideTransitionConditions: props.hideTransitionConditions, idPrefix: props.id});
        this.setState({progress : this.state.progress.slice(0,-1).concat(this.state.progress[this.state.progress.length-1] + ` Done (${(new Date() as any) - tic}ms)`)}, () => {
          this.initKGraph(props, initialRender, idGenerator, newKgraphRoot);
        });
      })
    }
  }


  private initKGraph(props : GraphRootProps , initialRender : boolean, idGen?: IdGenerator, kgRoot? : KGraphNode){
    const tic = new Date() as any;
    this.setState({loading : true, progress : this.state.progress.concat('Layouting KLay JSON...' )}, () => {
      let idGenerator = idGen || new IdGenerator(); 
      let kgraphRoot = props.kgraphRoot || kgRoot;
      let kgraph = new KGraph(idGenerator, this.svgRootElement, kgraphRoot);
      let allEdges = kgraph ? this._getAllEdges(kgraph) : [];
      let enabledEdges = this._getEnabledEdges(allEdges, props.transitionsEnabled);
      const options = getDefaultLayoutOptions(props.layoutOptions, props.id)
      if(!this.props.disableAnimation) this.svgRootElement.pauseAnimations();
      //wait a tick here to give him time to render.
      //TODO: would be better to fix this by performing layout in a webworker thread.
      setTimeout( () => {
        kgraph.updateLayout(options, (err, rootNode) => {
          //console.log('kgraph rootNode',rootNode);
          if(err) throw err;
          this.virtualViewbox = this.getOriginalViewbox(kgraph);
          this.setState({ 
            allEdges : allEdges,   //TODO: this is likely to be a hotspot. we probably want to move this search logic inside of the kgraph data structure
            enabledEdges : enabledEdges,
            kgraph : kgraph,
            progress : this.state.progress.slice(0,-1).concat(this.state.progress[this.state.progress.length-1] + ` Done (${(new Date() as any) - tic}ms)`),
            loading : false
          }, () => {
            //add a timeout to let the thread settle before starting animations
            //without this, on large models, we lose the first few animation frames
            if(!this.props.disableAnimation) setTimeout( () => {
              this.svgRootElement.unpauseAnimations();
            })
          });
        })  
      });
    })
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

  selectChildNode(kgraphNodeId : string){
    const kgraphNode : KGraphNode = this.state.kgraph.getKgraphNodeById(GraphNode.extractNodeIdFromFullNodeId(kgraphNodeId)); 
    //select first child
    //TODO: maybe select the initial state, if he has one?
    if(kgraphNode.children && kgraphNode.children.length){
      const initialStateIdx = kgraphNode.children.map( c => c.$type).indexOf('initial');
      this.setState({
        selectedEdgeId : null,
        selectedNodeId : 
          GraphNode.getPrefixedNodeId(
            this.props.id,
            initialStateIdx > -1 ? 
            kgraphNode.children[initialStateIdx].id :
            kgraphNode.children[0].id
          )
      });
    }
  }

  selectParentNode(kgraphNodeId : string){
    //select first child
    this.setState({
      selectedEdgeId : null,
      selectedNodeId : 
        GraphNode.getPrefixedNodeId(
          this.props.id,
          this.state.kgraph._childToParentMap.get(
            GraphNode.extractNodeIdFromFullNodeId(kgraphNodeId) 
          )
        )
    });
  }

  selectNextOrPrevState(next:boolean){
    const simpleNodeId = GraphNode.extractNodeIdFromFullNodeId(this.state.selectedNodeId);
    const parentKgraphNode : KGraphNode = 
      this.state.kgraph.getKgraphNodeById(this.state.kgraph._childToParentMap.get(simpleNodeId)); 

    const idx = parentKgraphNode.children.map( child => child.id ).indexOf(simpleNodeId)
    const tmp = (idx+(next ? 1 : -1)) 
    const nextIdx = tmp >= 0 ? tmp % parentKgraphNode.children.length : parentKgraphNode.children.length + tmp;
    const nextChild = parentKgraphNode.children[nextIdx];
    this.setState({
      selectedEdgeId : null,
      selectedNodeId : 
        GraphNode.getPrefixedNodeId(
          this.props.id,
          nextChild.id
        )
    });
  }

  selectNextOrPrevTransition(next : boolean){
    const sourceId = this.state.kgraph.getKgraphEdgeById(this.state.selectedEdgeId).source
    const edges = this.state.allEdges.filter( edge => edge.source === sourceId)
    const idx = edges.map( edge => edge.id ).indexOf(this.state.selectedEdgeId)
    const tmp = (idx+(next ? 1 : -1)) 
    const nextIdx = tmp >= 0 ? tmp % edges.length : edges.length + tmp;
    const nextEdge = edges[nextIdx];
    this.setState({
      selectedEdgeId : nextEdge.id,
      selectedNodeId : null
    });
  }

  handleKeypress(event){
    //console.log(event.key, event);
    if(event.target !== this.htmlRootElement) return;
    switch(event.key){
      case ' ':
        //toggle expand/collapse
        if(this.state.selectedNodeId) this.toggleExpandContractState(this.state.selectedNodeId);
        break;
      case 'h':
        if(this.state.selectedNodeId === null && this.state.selectedEdgeId === null){
          //do nothing
        }else if (this.state.selectedNodeId){  
          //TODO: remember last transition that we used to enter this state. if it's populated, then return to that transition
          //navigate to first transition targeting this state
          const simpleNodeId = GraphNode.extractNodeIdFromFullNodeId(this.state.selectedNodeId);
          const edges = this.state.allEdges.filter( edge => edge.target === simpleNodeId)
          if(edges.length){
            this.setState({
              selectedNodeId: null,
              selectedEdgeId: edges[0].id
            });
          }
        }else if(this.state.selectedEdgeId){
          //go to source state
          this.setState({
            selectedNodeId: 
              GraphNode.getPrefixedNodeId(
                this.props.id,
                this.state.kgraph.getKgraphEdgeById(this.state.selectedEdgeId).source,
              ),
            selectedEdgeId: null
          });
        }
        break;
      case 'j':
        if(this.state.selectedNodeId === null && this.state.selectedEdgeId === null){
          //do nothing
        }else if (this.state.selectedNodeId){  
          //go to next state
          this.selectNextOrPrevState(true);
        }else if(this.state.selectedEdgeId){
          //go to next transition of source state
          this.selectNextOrPrevTransition(true);
        }
        break;
      case 'k':
        if(this.state.selectedNodeId === null && this.state.selectedEdgeId === null){
          //do nothing
        }else if (this.state.selectedNodeId){  
          //go to previous state
          this.selectNextOrPrevState(false);
        }else if(this.state.selectedEdgeId){
          //go to previous transition of source state
          this.selectNextOrPrevTransition(false);
        }
        break;
      case 'l':
        if(this.state.selectedNodeId === null && this.state.selectedEdgeId === null){
          //do nothing
        }else if (this.state.selectedNodeId){  
          //navigate to first transition
          const simpleNodeId = GraphNode.extractNodeIdFromFullNodeId(this.state.selectedNodeId);
          const edges = this.state.allEdges.filter( edge => edge.source === simpleNodeId )
          if(edges && edges.length){
            this.setState({
              selectedNodeId: null,
              selectedEdgeId: edges[0].id
            });
          }
        }else if(this.state.selectedEdgeId){
          //go to target state
          this.setState({
            selectedNodeId: 
              GraphNode.getPrefixedNodeId(
                this.props.id,
                this.state.kgraph.getKgraphEdgeById(this.state.selectedEdgeId).target,
              ),
            selectedEdgeId: null
          });
        }
        break;
      case 'o':
        if(this.state.selectedNodeId === null && this.state.selectedEdgeId === null){
          //go down level in the hierarchy. 
          this.selectChildNode(this.state.kgraph.root.id);
        }else if (this.state.selectedNodeId){  
          this.selectChildNode(this.state.selectedNodeId);
        }else if(this.state.selectedEdgeId){
          //get source state,
          //go down in hierarchy
          this.selectChildNode(this.state.kgraph.getKgraphEdgeById(this.state.selectedEdgeId).source);
        }
        break;
      case 'O':
        if(this.state.selectedNodeId === null && this.state.selectedEdgeId === null){
          //do nothing
        }else if (this.state.selectedNodeId){  
          //get parent  
          this.selectParentNode(this.state.selectedNodeId);
        }else if(this.state.selectedEdgeId){
          this.selectParentNode(this.state.kgraph.getKgraphEdgeById(this.state.selectedEdgeId).source);
        }
        break;
      case 'z':
        if(this.state.selectedNodeId === null && this.state.selectedEdgeId === null){
          //do nothing
        }else if (this.state.selectedNodeId){  
          //get parent  
          if(event.ctrlKey){
            this.zoomToViewbox(this.previousVirtualViewbox);
          }else{
            this.zoomToState(this.state.selectedNodeId);
          }
        }else if(this.state.selectedEdgeId){
          this.zoomToEdge(this.state.selectedEdgeId);
        }
        break;
      case 'Z':
        this.zoomToViewbox(this.getOriginalViewbox(this.state.kgraph));
        break;
      default:
        break;
    }
  }

  getOriginalViewbox(kgraph): DOMRect{
    return {x : 0, y : 0, width : kgraph.root.width, height : kgraph.root.height} as DOMRect
  }

  public refreshViewbox(){
    this.zoomToViewbox(this.virtualViewbox);
  }

  componentDidMount(){
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keypress', this.handleKeypress.bind(this));

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
  }

  public toggleExpandContractState(nodeId : string){
    this.collapsedNodeMap[nodeId] = !this.collapsedNodeMap[nodeId]; //toggle contracted
    window.localStorage.collapsedNodeMap = JSON.stringify(this.collapsedNodeMap);   //persist
    let props = this.props;
    if(this.cachedLastScjson){
      props = _.extend({}, props, {scjson : this.cachedLastScjson});
    }
    this.initSCJson(props, false);
  }

  render(){
    const viewBox = this.state.kgraph ? 
                        this.getOriginalViewbox(this.state.kgraph) : 
                        {x : 0, y : 0, width : 0, height : 0} as DOMRect
    const transform = this.getTransformString(viewBox, viewBox, this.htmlRootElement ? this.htmlRootElement.getBoundingClientRect() : {x : 0, y : 0, width : 0, height : 0})
    return <div style={{width:'100%', height:'100%'}} ref={(e: HTMLDivElement) => { this.htmlRootElement = e; }} tabIndex={this.props.tabIndex || 0}>
        {  
          this.state.loading && 
            <div style={{position:'absolute'}}>
              <div className="la-line-spin-fade-rotating la-dark">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
              </div>
            </div>

        }
        {  
            <div style={{position:'absolute', display : 'none' }}>
              <div>Loading:</div>
              <ul>
                {this.state.progress.map( (progressText,i) => <li key={i}>{progressText}</li>)}
              </ul>
            </div>
        }
        <svg width="100%" height="100%" 
          style={{transformOrigin : '0 0', transition : this.props.disableZoomAnimation ? undefined : 'transform .1s linear', transform }}
          ref={(e: SVGSVGElement) => { this.svgRootElement = e; }}
          onWheel={this.props.disableZoom ? null : this.handleMouseWheel.bind(this)}
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          viewBox={this.svgRectToViewBox(viewBox)}
          preserveAspectRatio="none"
        >
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
                selectedNodeId={this.state.selectedNodeId}
                selectedEdgeId={this.state.selectedEdgeId}
                id={this.props.id}
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

  fetchEdgeDOMElement(edgeId){
    return document.querySelector(`path#${this.escapeIdStringForQuerySelector(edgeId)}.link`) as SVGPathElement;
  }

  fetchNodeDOMElement(nodeId){
    return document.querySelector(`g#${this.escapeIdStringForQuerySelector(nodeId)} > rect`) as SVGGElement;
  }

  escapeIdStringForQuerySelector(nodeOrEdgeId){
    return nodeOrEdgeId.replace(/([:$])/g,'\\$1')
  }

  zoomToEdge(edgeId){
    const edge = this.state.allEdges.filter( edge => edge.id === edgeId)[0]

    //zoom to source state, target state, and the edge itself
    const e1 = this.fetchNodeDOMElement(GraphNode.getPrefixedNodeId(this.props.id, edge.source));
    const e2 = this.fetchNodeDOMElement(GraphNode.getPrefixedNodeId(this.props.id, edge.target));
    const e3 = this.fetchEdgeDOMElement(edgeId);

    //get bbox in canvas coordinates
    const bbox1 = this.getBoundingBoxInCanvasCoordinates(e1)
    const bbox2 = this.getBoundingBoxInCanvasCoordinates(e2)
    const bbox3 = this.getBoundingBoxInCanvasCoordinates(e3)

    //compute the aggregate bbox
    const xmin = Math.min( bbox1.x, bbox2.x, bbox3.x);
    const ymin = Math.min(bbox1.y, bbox2.y, bbox3.y); 
    const xmax = Math.max(bbox1.x + bbox1.width, bbox2.x + bbox2.width, bbox3.x + bbox3.width);
    const ymax = Math.max(bbox1.y + bbox1.height, bbox2.y + bbox2.height, bbox3.y + bbox3.height);

    const viewbox = {
      x : xmin,
      y : ymin,
      width : xmax - xmin,   
      height : ymax - ymin
    };

    this.zoomToViewbox(viewbox);
  }

  zoomToState(stateId){
    const e = this.fetchNodeDOMElement(stateId);

    //get bbox in canvas coordinates
    const bbox = this.getBoundingBoxInCanvasCoordinates(e)

    this.zoomToViewbox(bbox);
  }

  getBoundingBoxInArbitrarySpace(element,mat){
      var svgRoot = element.ownerSVGElement;
      var bbox = element.getBBox();

      var xs = [];
      var ys = [];

      function calc(){
          var cPtTr = cPt.matrixTransform(mat);
          xs.push(cPtTr.x);
          ys.push(cPtTr.y);
      }

      var cPt =  svgRoot.createSVGPoint();
      cPt.x = bbox.x;
      cPt.y = bbox.y;
      calc();
          
      cPt.x += bbox.width;
      calc();

      cPt.y += bbox.height;
      calc();

      cPt.x -= bbox.width;
      calc();
      
      var minX=Math.min.apply(this,xs);
      var minY=Math.min.apply(this,ys);
      var maxX=Math.max.apply(this,xs);
      var maxY=Math.max.apply(this,ys);

      return {
          "x":minX,
          "y":minY,
          "width":maxX-minX,
          "height":maxY-minY
      };
  }

  getBoundingBoxInCanvasCoordinates (rawNode){
      return this.getBoundingBoxInArbitrarySpace(rawNode,this.getTransformToElement(rawNode, rawNode.ownerSVGElement));
  }

  getTransformToElement(fromElement, toElement) {
    return toElement.getScreenCTM().inverse().multiply(fromElement.getScreenCTM());  
  }


  getTransformString(viewbox, svgViewportDimensions, screenDimensions){
    if(!viewbox || !svgViewportDimensions || !screenDimensions.width) return `translate(0px,0px) scale(1)`;
    const svgViewportWidth = svgViewportDimensions.width, 
          svgViewportHeight = svgViewportDimensions.height;
    const screenAspectRatio = screenDimensions.width / screenDimensions.height; 
    const svgViewportAspectRatio = svgViewportWidth / svgViewportHeight; 

    let svgScreenWidth, 
        svgScreenHeight, 
        svgScreenOffsetX, 
        svgScreenOffsetY,
        aspectRatioScaleFactor,
        aspectRatioTransform,
        ratioOfScreenWidthToViewportWidth,
        ratioOfScreenHeightToViewportHeight;
    if(screenAspectRatio < svgViewportAspectRatio){
      //fit to the screen width
      //we will have a y offset
      svgScreenHeight = screenDimensions.width / svgViewportAspectRatio; 
      svgScreenWidth = screenDimensions.width;
      svgScreenOffsetX = 0;
      svgScreenOffsetY = (screenDimensions.height - svgScreenHeight) / 2; 
      aspectRatioScaleFactor = screenDimensions.height / svgScreenHeight;
      aspectRatioTransform = `scaleY(${1/aspectRatioScaleFactor})`
      ratioOfScreenWidthToViewportWidth = (screenDimensions.width / svgViewportWidth); 
      ratioOfScreenHeightToViewportHeight = (screenDimensions.height / svgViewportHeight) / aspectRatioScaleFactor; 
    } else if (screenAspectRatio > svgViewportAspectRatio){
      //fit to the screen height
      //we will have an x offset
      svgScreenHeight = screenDimensions.height;
      svgScreenWidth = screenDimensions.height * svgViewportAspectRatio; 
      svgScreenOffsetX = (screenDimensions.width - svgScreenWidth) / 2; 
      svgScreenOffsetY = 0;
      aspectRatioScaleFactor = screenDimensions.width / svgScreenWidth;
      aspectRatioTransform = `scaleX(${1/aspectRatioScaleFactor})`
      ratioOfScreenWidthToViewportWidth = (screenDimensions.width / svgViewportWidth) / aspectRatioScaleFactor; 
      ratioOfScreenHeightToViewportHeight = (screenDimensions.height / svgViewportHeight); 
    } else {
      //aspect ratio is the same!
      //aspect ratio scaling will be 1
      //x and y offsets will be 0
      svgScreenHeight = screenDimensions.height; 
      svgScreenWidth = screenDimensions.width;
      svgScreenOffsetX = 0;
      svgScreenOffsetY = 0;
      aspectRatioScaleFactor = 1;
      aspectRatioTransform = ''
      ratioOfScreenWidthToViewportWidth = (screenDimensions.width / svgViewportWidth); 
      ratioOfScreenHeightToViewportHeight = (screenDimensions.height / svgViewportHeight); 
    }

    /*
    console.log('svgScreenHeight',svgScreenHeight);  
    console.log('svgScreenWidth',svgScreenWidth); 
    console.log('svgScreenOffsetX',svgScreenOffsetX);  
    console.log('svgScreenOffsetY',svgScreenOffsetY);
    */

    //these appear correct. now how do we incorporate them into the point projection?

    //compute scale transform as ratio of svg viewport w or h, and svg viewport w or h 
    //take into account the aspect ratio scaling.
    //const scale = svgViewportWidth/viewbox.width; 
    const scale = viewbox.width > viewbox.height ? svgViewportWidth/viewbox.width : svgViewportHeight/viewbox.height; 

    //compute translate transform as: ratio of viewport width/height to screen width/height. 
    //project (multiply) points in space by this ratio.
    //same thing here, take into account aspect ratio scale and translate transforms.
    const x = viewbox.x * ratioOfScreenWidthToViewportWidth;
    const y = viewbox.y * ratioOfScreenHeightToViewportHeight; 

    /*
    console.log('viewbox', viewbox);
    console.log('svgRootWidth',svgViewportWidth); 
    console.log('scale',scale); 
    console.log('screenDimensions',screenDimensions);
    console.log('ratioOfScreenWidthToViewportWidth',ratioOfScreenWidthToViewportWidth); 
    console.log('ratioOfScreenHeightToViewportHeight',ratioOfScreenHeightToViewportHeight); 
    console.log('x',x); 
    console.log('y',y); 
    */
    
    return `translate(${svgScreenOffsetX}px,${svgScreenOffsetY}px) translate(${-1 * x * scale}px,${-1 * y * scale}px) scale(${scale}) ${aspectRatioTransform}`;
  }

  zoomToViewbox(viewbox){
    this.previousVirtualViewbox = this.virtualViewbox;
    this.virtualViewbox = viewbox;
    const transform = this.getTransformString(viewbox, this.svgRootElement.viewBox.baseVal, this.htmlRootElement.getBoundingClientRect());

    this.svgRootElement.style.transform = transform;
  }

  resetZoom(){
    this.zoomToViewbox(this.getOriginalViewbox(this.state.kgraph));
  }

  private svgRectToViewBox(rect : DOMRect){
    return `${rect.x} ${rect.y} ${rect.width} ${rect.height}`;
  }
}

