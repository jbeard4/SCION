import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DraggableRect from '../containers/DnD';

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
        </div>
      </Provider>
    );
  }
}
