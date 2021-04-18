import ReactDOM = require('react-dom');
import * as React from "react";

import AppComponent from './components/AppComponent';

let app = ReactDOM.render(
  <AppComponent/>,
  document.querySelector('.app')
) as AppComponent;

