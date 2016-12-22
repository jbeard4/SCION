import EventEmitter = require('events');

export class KGraph{
  root : KGraphNode;
}

export interface IKGraphNode {
}

export class KGraphNode extends EventEmitter implements IKGraphNode {
  id : string;
  labels : KGraphLabel[];
  edges? : KGraphEdge[];
  children? : KGraphNode[];
  width?:number;
  height?:number;
  x?:number;
  y?:number;
  $type? : string;
}

export class KGraphEdge implements IKGraphNode {
  id : string;
  $type? : string;
  labels : KGraphLabel[];
  source: string;
  target: string;
  $hyperlink? : string;
  bendPoints? : Point[];
}

export class KGraphLabel implements IKGraphNode {
  text : string;
  x?:number;
  y?:number;
  width? : number;
  height? : number;
  $meta? : KGraphLabelMeta;
}

interface KGraphLabelMeta {
  textAnchor?: string;
  dominantBaseline?: string;
}

export interface Point {
  x?:number;
  y?:number;
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
