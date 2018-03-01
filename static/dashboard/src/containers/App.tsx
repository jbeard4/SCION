import * as React from "react";
import Collapsible from '@jbeard/react-collapsible';
import SCHVIZ from '@jbeard/schviz2';
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import { connect } from 'react-redux';
import {SlickgridComponent} from '../components/Slickgrid';
import {DiffComponent} from '../components/Diff';
import EventSourceContainer from '../containers/EventSource';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import {TableInspector, ObjectInspector} from 'react-inspector';
import events = require('events');

export interface AppProps {
  smallSteps: Array<any>;
  onSelectedRowChange: any;
  selectedRowIndex: number;
  onTriggerClick: any;
  collapsible: any;
  inputEventEmitter? : events.EventEmitter;
  baseUrl? : string;
  onSmallStep : any;
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
  private slickgridComponent : SlickgridComponent;
  private schvizComponent : SCHVIZ;
  private lastEventId;

  constructor() {
    super();
    this.lastEventId = 1;
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

    const sessionIdList = currentRow ? [currentRow.sessionid].concat(currentRow.parentSessionIds).reverse() : [];

    //look up associated scxmlName for each sessionId in the hierarchy
    const sessionTable = sessionIdList 
      .map(parentSessionId => ({sessionid : parentSessionId}))
      .map(o => {
        let sessionIds = this.props.smallSteps.map(smallStep => smallStep.sessionid);
        let idx = sessionIds.indexOf(o.sessionid);
        if(idx > -1){
          let lastSmallStepForSessionId = this.props.smallSteps[idx];
          return {
            sessionid : lastSmallStepForSessionId.sessionid,
            name : lastSmallStepForSessionId.name
          }
        }else{
          return {
            sessionid : null,
            name : null
          }
        }
      });

    //look up previous row with same session id 
    const previousSessionRow = (() => {
      let idx = this.props.smallSteps.map(smallStep => smallStep.sessionid).indexOf(currentRow.sessionid);
      if(idx > -1){
        let lastSmallStepForSessionId = this.props.smallSteps[idx];
        return lastSmallStepForSessionId;
      }else{
        return null;
      }
    })();

    const currentRowDatamodel = currentRow ? currentRow.snapshot[3] : null;
    const previousSessionDatamodel = currentRow  ? previousSessionRow.snapshot[3] : null; 

    return (
      <div  style={{width:'100%',height:'100%'}} 
            ref={(e: HTMLDivElement) => { this.rootElement = e; }}>
        <div className="ui-layout-center">
          {
            currentRow ?
            <SCHVIZ 
              ref={(e: SCHVIZ) => { this.schvizComponent = e; }}
              expandAllStatesByDefault={true}
              disableAnimation={true}
              urlToSCXML={`${this.props.baseUrl || ''}${currentRow.docUrl}`} 
              layoutOptions={SCHVIZ.layouts.right} 
              configuration={currentRow.snapshot[0]}
              previousConfiguration={currentRow.previousConfiguration}
              statesForDefaultEntry={currentRow.defaultStatesEntered }
              transitionsEnabled={transitionsTaken}
              hideActions={true}
              /> : 
            null
          }
        </div>
        <div className="ui-layout-south">
          <SlickgridComponent
            ref={(e: SlickgridComponent) => { this.slickgridComponent = e; }}
            data={this.props.smallSteps}
            onSelectedRowChange={this.props.onSelectedRowChange}
            selectedRowIndex={this.props.selectedRowIndex}/>
        </div>
        <div className="ui-layout-east">
          {
            !this.props.inputEventEmitter && <EventSourceContainer />
          }
          <Collapsible 
            trigger="Session Hierarchy"
            open={this.props.collapsible['sessionHierarchy']}
            handleTriggerClick={this.props.onTriggerClick.bind(this,'sessionHierarchy')}
            >
            {
              currentRow ? 
                <TableInspector 
                  columns={['name', 'sessionid']}
                  data={sessionTable}/> : 
                null
            }
          </Collapsible>
          <Collapsible 
            trigger="Input Event"
            open={this.props.collapsible['inputEvent']}
            handleTriggerClick={this.props.onTriggerClick.bind(this,'inputEvent')}
            >
            {
              currentRow ? 
                <ObjectInspector data={currentRow.event}/> : 
                null
            }
          </Collapsible>
          <Collapsible 
            trigger="Datamodel" 
            open={this.props.collapsible['datamodel']}
            handleTriggerClick={this.props.onTriggerClick.bind(this,'datamodel')}
            >
            {
              currentRow ? 
                <ObjectInspector data={currentRowDatamodel}/> : 
                null
            }
          </Collapsible>
          <Collapsible 
            trigger="Datamodel Diff"
            open={this.props.collapsible['datamodelDiff']}
            handleTriggerClick={this.props.onTriggerClick.bind(this,'datamodelDiff')}
            >
            <DiffComponent left={currentRowDatamodel} right={previousSessionDatamodel}/>
          </Collapsible>
          <Collapsible 
            trigger="Inner Queue" 
            open={this.props.collapsible['innerQueue']}
            handleTriggerClick={this.props.onTriggerClick.bind(this,'innerQueue')}
            >
            {
              currentRow ? 
                <TableInspector data={currentRow.snapshot[4]}/> : 
                null
            }
          </Collapsible>
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
      south__onresize: (() => { 
        this.slickgridComponent.grid.resizeCanvas()
      }),
      center__onresize:	(() => { 
        setTimeout( () => {
          this.schvizComponent.graphRoot.refreshViewbox();
        })
      }),
      stateManagement__enabled:	true
    });

    if(this.props.inputEventEmitter){
      this.props.inputEventEmitter.on('onSmallStepEnd',this.smallStepHandler.bind(this));
    }
  }

  smallStepHandler(message){
    this.props.onSmallStep(
      this.lastEventId++,
      message
    )
  }

  componentWillUnmount(){
    this.props.inputEventEmitter.off('onSmallStepEnd',this.smallStepHandler);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    smallSteps: state.smallSteps,
    selectedRowIndex: state.selectedSmallStep,
    collapsible : state.collapsible,
    inputEventEmitter : ownProps.inputEventEmitter,
    baseUrl : ownProps.baseUrl
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSelectedRowChange : (rowIndex) => {
      dispatch({
        type : 'SELECT_SMALL_STEP',
        index : rowIndex
      })
    },
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
  mapDispatchToProps
)(App);
