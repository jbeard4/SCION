import ReactDOM = require('react-dom');
import * as React from "react";

import AppComponent from './components/AppComponent';

const params = getQueryParameters(); 
const pathToScxml = params.scxmlFile;

let app = ReactDOM.render(
  <AppComponent scxmlPath={pathToScxml}/>,
  document.querySelector('.app')
) as AppComponent;

function getQueryParameters() : any{
  return document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}
