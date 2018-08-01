import React from 'react'

const Buttons = ({sc}) => (
  <ul>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('staked')}}> Staked </button> </li>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('un-staked')}}> Un-staked </button> </li>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('chopped-up')}}> Chopped Up </button> </li>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('healed')}}> Healed </button> </li>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('burned')}}> Burned </button> </li>
  </ul>
)

export default Buttons; 
