import React from 'react'
import dead from './dead.png';
import disabled from './disabled.png';
import intact from './intact.png';
import torpor from './torpor.png';

const VampireImg = ({configuration}) => (
  <div style={{
    width: '100%', 
    height: '100%', 
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundImage:`url(${
      (() => {
        switch(configuration && configuration[0]){
          case 'dead': return dead;
          case 'disabled': return disabled;
          case 'intact': return intact;
          case 'torpor': return torpor;
          default: return '';
        }
      })()
    })`}}/>
)

export default VampireImg; 
