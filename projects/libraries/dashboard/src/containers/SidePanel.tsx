import * as React from "react";
import { connect } from 'react-redux';
import {
  getCurrentRow, 
  getSessionTable,
  getPreviousSessionDatamodel,
  getCurrentRowDatamodel 
} from '../selectors'
import SidePanel from '../components/SidePanel';
import events = require('events');

interface SidePanelContainerProps {
  smallSteps: Array<any>;
  onSelectedRowChange: any;
  selectedRowIndex: number;
  onTriggerClick: any;
  collapsible: any;
  currentRow: any;
  sessionTable: any;
  currentRowDatamodel: any;
  previousSessionDatamodel: any;
  onSmallStep: any;
  inputEventEmitter? : events.EventEmitter;
}

class SidePanelContainer extends React.PureComponent<SidePanelContainerProps> {

  smallStepHandler: any;

  constructor(props){
    super(props);

    this.smallStepHandler = (message) => {
      this.props.onSmallStep(
        null,
        message
      )
    }

  }

  render(){
    const {
      currentRow,
      sessionTable,
      currentRowDatamodel,
      previousSessionDatamodel,
      collapsible,
      inputEventEmitter,
      onTriggerClick,
    } = this.props;

    return <SidePanel 
      currentRow={currentRow} 
      sessionTable={sessionTable} 
      currentRowDatamodel={currentRowDatamodel}
      previousSessionDatamodel={previousSessionDatamodel}
      collapsible={collapsible}
      inputEventEmitter={inputEventEmitter}
      onTriggerClick={onTriggerClick}
      />;
  }

  componentDidMount(){
    if(this.props.inputEventEmitter){
      this.props.inputEventEmitter.on('onSmallStepEnd',this.smallStepHandler);
    }
  }

  componentWillUnmount(){
    if(this.props.inputEventEmitter){
      this.props.inputEventEmitter.removeListener('onSmallStepEnd',this.smallStepHandler);
    }
  }
}

function mapStateToProps(state, ownProps) {
  const currentRow = getCurrentRow(state);
  return {
    currentRow: currentRow,
    sessionTable: getSessionTable(state),
    currentRowDatamodel: getCurrentRowDatamodel(state),
    previousSessionDatamodel: getPreviousSessionDatamodel(state),
    collapsible : state.collapsible,
    inputEventEmitter : ownProps.inputEventEmitter 
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSmallStep : (lastEventId, message) => {
      dispatch({
        type : 'SMALL_STEP',
        message, 
        lastEventId
      })
    },
    onTriggerClick: (title) => {
      dispatch({
        type : 'COLLAPSIBLE_TRIGGER_CLICK',
        title : title
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {withRef: true}
)(SidePanelContainer);
