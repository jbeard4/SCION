import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import reducer from './reducers'
import configureStore from './store/configureStore';

const store = configureStore();

render(
  <AppContainer>
    <Root
      store={ store }
    />
  </AppContainer>,
  document.getElementById('app-root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const RootContainer = require('./containers/Root').default;
    render(
      <AppContainer>
        <RootContainer
          store={ store }
        />
      </AppContainer>,
      document.getElementById('app-root')
    );
  });
}

