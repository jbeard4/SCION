import React from 'react'

const Switch = ({configuration}) => (
  <rect 
    transform={`translate(-3.54e-6, ${configuration && configuration[0] === 'on' ? 0 : 57})`} 
    x="149.15" 
    y="165.42" 
    width="55.864" 
    height="110.64" 
    rx="2.04" 
    ry="1.875" 
    fill="#fff" 
    style={{transition:'transform .5s ease-out'}} />
)

const LampSwitch = ({sc, configuration}) => (
  <svg 
    onClick={(e) => { sc.gen('touch') }}
    style={{position: 'absolute'}} width="100%" height="100%" id="svg2" enableBackground="new 0 0 356.251 512" version="1.1" viewBox="0 0 356.25 512">
    <path d="m178.39 100.6c9.886 0 17.973-8.088 17.973-17.965 0-9.965-8.087-17.965-17.973-17.965-9.965 0-18.053 8-18.053 17.965 0 9.877 8.088 17.965 18.053 17.965z" fill="#231f20"/>
    <path d="m178.39 406.01c-9.965 0-18.053 7.991-18.053 17.965 0 9.877 8.088 17.965 18.053 17.965 9.886 0 17.973-8.088 17.973-17.965 0-9.974-8.086-17.965-17.973-17.965z" fill="#231f20"/>
    <path d="m302.36 0h-248.46c-29.72 0-53.896 24.176-53.896 53.896v404.21c0 29.719 24.176 53.895 53.896 53.895h248.46c29.72 0 53.896-24.176 53.896-53.896v-404.21c-1e-3 -29.72-24.177-53.896-53.897-53.896zm35.931 458.1c0 19.817-16.114 35.93-35.93 35.93h-248.46c-19.812 0-35.93-16.114-35.93-35.93v-404.21c0-19.817 16.118-35.93 35.93-35.93h248.46c19.817 0 35.93 16.114 35.93 35.93v404.21z" fill="#231f20"/>
    <rect x="131.8" y="148.61" width="91.119" height="203.93" rx="2.04" ry="1.875" fill="#231f20"/>
    <rect transform="translate(-3.54e-6)" x="149.15" y="165.42" width="55.864" height="110.64" rx="2.04" ry="1.875" fillOpacity="0"/>
    <Switch configuration={configuration} />
  </svg>
);

export default LampSwitch; 
