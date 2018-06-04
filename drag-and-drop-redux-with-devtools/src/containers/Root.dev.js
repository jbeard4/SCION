import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import DraggableRect from '../containers/DnD';
import InteractiveSCHVIZ from '../containers/SCHVIZ';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div style={{width:'100%', height:'100%'}}>
          <div style={{width:'100%', height:'100%'}}>
            <svg width="100%" height="100%">
              <DraggableRect/>
            </svg>
          </div>
          <DevTools />
        </div>
      </Provider>
    );
  }
}
