import React from 'react'
import './buttons.css'

const LampSwitchButtons = ({sc}) => (
  <ul className="buttons">
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('switch-on')}}> Switch On </button> </li>
    <li> <button className="btn btn-secondary" onClick={(e) => {sc.gen('switch-off')}}> Switch Off </button> </li>
  </ul>
);

export default LampSwitchButtons 
