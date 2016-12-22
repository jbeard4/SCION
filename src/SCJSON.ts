import EventEmitter = require('events');

export interface SCGraph extends EventEmitter{
  root : SCState;
  getById(id : string):SCState;
  //TODO: CRUD operations
}

export interface SCState {
  states? : SCState[];
  transitions? : SCTransition[];
  id? : string;
  $type? : string;
}

export interface SCTransition{
}

