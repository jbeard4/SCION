import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import SliderMonitor from 'redux-slider-monitor';
import ChartMonitor from 'redux-devtools-chart-monitor';

export default createDevTools(
  <DockMonitor 
    changeMonitorKey='ctrl-m'
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'>
    <ChartMonitor />
    <LogMonitor />
    <SliderMonitor keyboardEnabled />
  </DockMonitor>
);
