import React from 'react'
import cooking from './cooking.jpg'
import idle from './idle.jpg'
import unplugged from './unplugged.jpg'
import '../common.css';

const MicrowaveDemo = ({configuration}) => (
  <div 
    className="fill-image"
    style={{
      backgroundImage:`url(${
        (() => {
          switch(configuration && configuration[0]){
            case 'cooking': return cooking;
            case 'idle': return idle;
            case 'unplugged': return unplugged;
            default: return '';
          }
        })()
      })`
    }}/>
);

export default MicrowaveDemo; 
