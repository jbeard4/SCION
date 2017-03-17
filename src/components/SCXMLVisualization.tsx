import * as React from "react";
import SCHVIZ = require('SCHVIZ2');
import scxml = require('scxml');

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

  componentDidMount(){
    //render
    this.schviz = new SCHVIZ(this.rootElement);
    if(this.props.scjson){
      //TODO: parameterize layout option
      this.schviz.renderSCJSON(this.props.scjson, 'right', function(err){
        if(err) console.error(err);
      });
      this.setState({initialRender : true});
    }
  }

  componentWillReceiveProps(props : SCXMLVisualizationProps){
    if(props.scjson){
      //TODO: parameterize whether to update or redraw
      this.schviz[this.state.initialRender ? 'updateSCJSON' : 'renderSCJSON'](props.scjson, 'right', function(err){
        if(err) console.error(err);
      });
      this.setState({initialRender : true});
    }
  }
}

