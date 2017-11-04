import EventEmitter = require('events');

export interface SCState {
  states? : SCState[];
  transitions? : SCTransition[];
  id? : string;
  $type? : string;
  $meta? : {
    isCollapsed? : boolean
  }
}

export interface SCTransition{
}


export function findStateById(sc : SCState, id): SCState{
  let toReturn = null;
  const re = /^([^:]+):([^:]+):(\d+)$/;
  let prop, index;
  const m = id.match(re);
  if(m){
    id = m[1];
    prop = m[2];
    index = parseInt(m[3]);
  }
  function step(state){
    if(state.id === id){
      if(m){
        //drill down to prop
        toReturn = state[prop][index];
      } else {
        toReturn = state;
      }
      return toReturn;
    } else {
      if(state.states) state.states.forEach(step.bind(this));
    }
  }
  step(sc);
  return toReturn;
}
