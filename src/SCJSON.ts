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
  function step(state){
    if(state.id === id){
      toReturn = state;
      return toReturn;
    } else {
      if(state.states) state.states.forEach(step.bind(this));
    }
  }
  step(sc);
  return toReturn;
}
