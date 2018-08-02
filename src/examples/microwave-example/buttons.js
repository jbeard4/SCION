import React from 'react'

const Buttons = ({sc}) => (
  <ul>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('plug-in')}}> Plug In </button> </li>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('start')}}> Start </button> </li>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('stop')}}> Stop </button> </li>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('unplug')}}> Unplug </button> </li>
  </ul>
);

export default Buttons 
