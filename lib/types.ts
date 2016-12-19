import EventEmitter = require('events');

export class KGraph{
  root : KGraphNode;
}

export class KGraphNode extends EventEmitter {
  id : string;
  edges? : KGraphEdge[];
  children? : KGraphNode[];
  width?:number;
  height?:number;
  x?:number;
  y?:number;
  $type? : string;
}

export class KGraphEdge{
  id : string;
  $type? : string;
  labels : KGraphLabel[];
  source: string;
  target: string;
  $hyperlink? : string;
}

export class KGraphLabel{
  text : string;
  width : number;
  height : number;
}

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
