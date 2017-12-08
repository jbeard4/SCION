import * as React from "react";
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import TodoActions from '../actions/todos';

export interface AppProps {
  todos: Array<any>,
  actions: any
};


class App extends React.Component<AppProps, {}> {

  private rootElement : HTMLDivElement;

  render() {
    const { todos, actions } = this.props;
    return (
      <div  style={{width:'100%',height:'100%'}} 
            ref={(e: HTMLDivElement) => { this.rootElement = e; }}>
        <div className="ui-layout-center">
          <div id="schvizContainer"></div>
          <h1 id="title"></h1>
        </div>
        <div className="ui-layout-south">
          <div id="tableContainer"></div>
        </div>
        <div className="ui-layout-east">
          <div id="infoContainer">
            <div id="accordion">
              <h3>Session Hierarchy</h3>
              <div></div>
              <h3>Input Event</h3>
              <div id="events-tab"></div>
              <h3>Datamodel</h3>
              <div id="snapshot-tab"></div>
              <h3>Datamodel Diff</h3>
              <div id="diff-tab"></div>
              <h3>Inner Queue</h3>
              <div id="innerqueue-tab"></div>
              <h3>Inner Queue Diff</h3>
              <div id="innerqueue-diff-tab"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    window['jQuery'](this.rootElement).layout({ 
      applyDefaultStyles: true, 
      south__size: 200,
      east__size: 300
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
