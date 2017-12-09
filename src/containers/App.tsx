import * as React from "react";
import Collapsible from 'react-collapsible';
import ReactDataGrid = require('react-data-grid/packages/react-data-grid/index.js');
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import TodoActions from '../actions/todos';

export interface AppProps {
  todos: Array<any>,
  actions: any
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
  private reactDataGrid : ReactDataGrid;

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
    const { todos, actions } = this.props;

    const columns = [
        { id: "scxmlName", name: "SCXML Name", key: "name", width: 120, resizable: true },
        //{ id: "docUrl", name: "URL", key: "docUrl", width: 120 },
        { id: "sessionid", name: "Sesssionid", key: "sessionid", width: 120, resizable: true },
        { id: "eventName", name: "Event Name", key: "eventName", width: 120, resizable: true },
        
    ];

    return (
      <div  style={{width:'100%',height:'100%'}} 
            ref={(e: HTMLDivElement) => { this.rootElement = e; }}>
        <div className="ui-layout-center">
          <div id="schvizContainer"></div>
          <h1 id="title"></h1>
        </div>
        <div className="ui-layout-south">
          <ReactDataGrid
            ref={(node) => this.reactDataGrid = node}
            enableCellSelect={true}
            columns={columns}
            rowGetter={this.getRowAt.bind(this)}
            rowsCount={this.getSize()}
            minHeight={this.state.minHeight-2}
            //onGridRowsUpdated={this.handleGridRowsUpdated}
            />
        </div>
        <div className="ui-layout-east">
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
      south__onresize: (() => { console.log('myLayout.state.size', myLayout.state.south.size); this.setState({minHeight : myLayout.state.south.size })}),
    });
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions as ActionCreatorsMapObject, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
