import 'babel-polyfill';
import * as React from "react";
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';
require("../node_modules/font-awesome/css/font-awesome.css")
require("../node_modules/slickgrid/slick.grid.css")
require("../node_modules/slickgrid/slick-default-theme.css")
require("../node_modules/@scion-scxml/jsondiffpatch/public/formatters-styles/html.css")

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
