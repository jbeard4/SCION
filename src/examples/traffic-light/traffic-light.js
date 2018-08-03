import React from 'react'
import green from './Traffic_lights_dark_green.svg';
import red from './Traffic_lights_dark_red.svg';
import yellow from './Traffic_lights_dark_yellow.svg';

const TrafficLight = ({configuration}) => (
  <div style={{
    width: '100%', 
    height: '100%', 
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundImage:`url(${
      (() => {
        switch(configuration && configuration[0]){
          case 'stop': return red;
          case 'warn': return yellow;
          case 'go': return green;
          default: return null;
        }
      })()
    })`}}/>
)

export default TrafficLight; 
