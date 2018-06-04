import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import ScionMonitor from 'redux-devtools-scion-schviz-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import SliderMonitor from 'redux-slider-monitor';
import ChartMonitor from 'redux-devtools-chart-monitor';
import scjson from '../../dist/drag-and-drop.json'

export default createDevTools(
  <DockMonitor 
    changeMonitorKey='ctrl-m'
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'>
    <ScionMonitor scjson={scjson}/>
    <ChartMonitor />
    <LogMonitor />
    <SliderMonitor keyboardEnabled />
  </DockMonitor>
);
