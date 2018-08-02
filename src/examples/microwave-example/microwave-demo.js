import React from 'react'
import cooking from './cooking.jpg'
import idle from './idle.jpg'
import unplugged from './unplugged.jpg'

const MicrowaveDemo = ({configuration}) => (
  <div style={{
    width: '100%', 
    height: '100%', 
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundImage:`url(${
      (() => {
        switch(configuration && configuration[0]){
          case 'cooking': return cooking;
          case 'idle': return idle;
          case 'unplugged': return unplugged;
          default: return '';
        }
      })()
    })`}}/>
);

export default MicrowaveDemo; 
