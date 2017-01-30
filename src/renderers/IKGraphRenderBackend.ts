import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from '../KGraph';

export interface IKGraphRenderBackend {
  clear();
  highlightState(stateId:string);
  unhighlightState(stateId:string);
  unhighlightAllStates();
  highlightTransition(sourceStateId:string, targetStateIds:string[]);
  measureTextDimensions(text:string);
  render(kgraph:KGraph);
}

export interface LayoutOptions {
  algorithm: string;
  spacing: number;
  borderSpacing? : number;
  labelSpacing? : number;
  layoutHierarchy: boolean;
  intCoordinates: boolean;
  edgeRouting: string;
  cycleBreaking?: string;
  nodeLayering?: string;
}
