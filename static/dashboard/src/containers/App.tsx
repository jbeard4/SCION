import * as React from "react";
import Collapsible from 'react-collapsible';
import SCHVIZ from '@jbeard/schviz2';
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import { connect } from 'react-redux';
import {SlickgridComponent} from '../components/Slickgrid';
import EventSourceContainer from '../containers/EventSource';
import Header from '../components/Header';
import MainSection from '../components/MainSection';

export interface AppProps {
  smallSteps: Array<any>;
  onSelectedRowChange: any;
  selectedRowIndex: number;
};


export interface AppState {
  minHeight : number;
  rows : Array<Row>;
};

export interface Row {
  name : string;
  sessionid : number;
  eventName : string;
}

export interface Column {
  id : string;
  name : string;
  key : string;
  width : number;
  resizable : boolean;
}


class App extends React.Component<AppProps, AppState> {

  private rootElement : HTMLDivElement;

  constructor() {
    super();
    this.state = {
      minHeight : 200,
      rows : [
        {
          "name" : "foo",
          "sessionid" : 1,
          "eventName" : "bar"
        }
      ]
    };
  }

  render() {

    const columns = [
        { id: "scxmlName", name: "SCXML Name", key: "name", width: 120, resizable: true },
        //{ id: "docUrl", name: "URL", key: "docUrl", width: 120 },
        { id: "sessionid", name: "Sesssionid", key: "sessionid", width: 120, resizable: true },
        { id: "eventName", name: "Event Name", key: "eventName", width: 120, resizable: true },
        
    ];

    //TODO: move these into reducers, or maybe props
    const currentRow = 
            this.props.smallSteps && this.props.smallSteps.length &&
            typeof this.props.selectedRowIndex === 'number' &&
            this.props.smallSteps[this.props.selectedRowIndex];

    let transitionsTaken  = new Map<string, Set<number>>();
    currentRow && currentRow.transitionsTaken && currentRow.transitionsTaken.forEach( transitionInfo => {
      let transitionSourceId, transitionTargetIds, transitionIndex;
      [transitionSourceId, transitionTargetIds, transitionIndex] = transitionInfo;
      let enabledTransitionIndexes;
      if(transitionsTaken.has(transitionSourceId)){
        enabledTransitionIndexes = transitionsTaken.get(transitionSourceId)
      } else {
        enabledTransitionIndexes = new Set();
        transitionsTaken.set(transitionSourceId, enabledTransitionIndexes);
      }
      enabledTransitionIndexes.add(transitionIndex);
    });

    return (
      <div  style={{width:'100%',height:'100%'}} 
            ref={(e: HTMLDivElement) => { this.rootElement = e; }}>
        <div className="ui-layout-center">
          {
            currentRow ?
            <SCHVIZ 
              disableAnimation={true}
              urlToSCXML={currentRow.docUrl} 
              layoutOptions={SCHVIZ.layouts.right} 
              configuration={currentRow.snapshot[0]}
              previousConfiguration={currentRow.previousConfiguration}
              statesForDefaultEntry={currentRow.defaultStatesEntered }
              transitionsEnabled={transitionsTaken}
              /> : 
            null
          }
        </div>
        <div className="ui-layout-south">
          <SlickgridComponent
            data={this.props.smallSteps}
            onSelectedRowChange={this.props.onSelectedRowChange}
            selectedRowIndex={this.props.selectedRowIndex}/>
        </div>
        <div className="ui-layout-east">
          <EventSourceContainer />
          <Collapsible trigger="Session Hierarchy">Session Hierarchy</Collapsible>
          <Collapsible trigger="Input Event">Input Event</Collapsible>
          <Collapsible trigger="Datamodel">Datamodel</Collapsible>
          <Collapsible trigger="Datamodel Diff">Datamodel Diff</Collapsible>
          <Collapsible trigger="Inner Queue">Inner Queue</Collapsible>
          <Collapsible trigger="Inner Queue Diff">Inner Queue</Collapsible>
        </div>
      </div>
    );
  }

  /*
  handleGridRowsUpdated(e){
    const { fromRow, toRow, updated } = e;
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      rows = rows.update(i, r => r.merge(updated));
    }

    this.setState({ rows });
  }
  */

  getRowAt(index) {
    if (index < 0 || index > this.getSize()) {
      return undefined;
    }
    return this.state.rows[index];
  }

  getSize(){
    return this.state.rows.length;
  }

  componentDidMount(){
    let myLayout = window['jQuery'](this.rootElement).layout({ 
      applyDefaultStyles: true, 
      south__size: this.state.minHeight,
      east__size: 300,
		  stateManagement__enabled:	true
    });
  }
}

function mapStateToProps(state) {
  return {
    smallSteps: state.smallSteps,
    selectedRowIndex: state.selectedSmallStep
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectedRowChange : (rowIndex) => {
      dispatch({
        type : 'SELECT_SMALL_STEP',
        index : rowIndex
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
