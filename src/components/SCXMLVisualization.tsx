import * as React from "react";
import schviz = require('schviz2');
import {handleError, clear} from '../handle-errors';

interface SCXMLVisualizationProps {
  scjson : any;
}

interface SCXMLVisualizationState {
  initialRender : boolean;
}

export default class SCXMLVisualization extends React.Component<SCXMLVisualizationProps, SCXMLVisualizationState>{

  rootElement : HTMLElement;
  schviz : any;

  constructor(props){
    super(props);
    this.state = {initialRender : false};
  }

  render(){
    return <div id="scxml-viz"
      ref={(e: HTMLElement) => { this.rootElement = e; }}
      >
    </div>;
  } 

  highlightState(stateId){
    this.schviz.highlightState(stateId);
  }

  unhighlightState(stateId){
    this.schviz.unhighlightState(stateId);
  }

  unhighlightAllStates(){
    this.schviz.unhighlightAllStates();
  }

  highlightTransition(sourceStateId:string, transitionIndex:number){
    this.schviz.highlightTransition(sourceStateId, transitionIndex);
  }

  updateLayout(layoutName, cb){
    this.schviz.updateLayout.apply(this.schviz, arguments);    //just pass it through
  }

  componentDidMount(){
    //render
    this.schviz = new schviz(this.rootElement);
    if(this.props.scjson){
      //TODO: parameterize layout option
      this.schviz.renderSCJSON(this.props.scjson, 'right', function(err){
        if(err) handleError(err);
      });
      this.setState({initialRender : true});
    }
  }

  componentWillReceiveProps(props : SCXMLVisualizationProps){
    if(props.scjson){
      //TODO: parameterize whether to update or redraw
      this.schviz[this.state.initialRender ? 'updateSCJSON' : 'renderSCJSON'](props.scjson, 'right', function(err){
        if(err) handleError(err);
      });
      this.setState({initialRender : true});
    }
  }
}

