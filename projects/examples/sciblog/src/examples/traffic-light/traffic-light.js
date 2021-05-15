import React from 'react'
import green from './Traffic_lights_dark_green.svg';
import red from './Traffic_lights_dark_red.svg';
import yellow from './Traffic_lights_dark_yellow.svg';
import '../common.css';
import './traffic-light.css';

const TrafficLight = ({configuration, datamodel}) => (
  <div className="traffic-light-example">
    <div>
      <div 
        className="fill-image"
        style={{
          backgroundImage:`url(${
            (() => {
              switch(configuration && configuration[0]){
                case 'stop': return red;
                case 'warn': return yellow;
                case 'go': return green;
                default: return null;
              }
            })()
          })`
        }}/>
    </div>
    <div>Interval: {datamodel && datamodel.interval}</div>
  </div>
)

export default TrafficLight; 
