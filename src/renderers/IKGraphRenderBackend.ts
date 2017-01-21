import {KGraph, KGraphNode, KGraphEdge, KGraphLabel} from '../KGraph';

interface IKGraphRenderBackend {
  clear();
  highlightState(stateId:string);
  unhighlightState(stateId:string);
  unhighlightAllStates();
  highlightTransition(sourceStateId:string, targetStateIds:string[]);
  measureTextDimensions(text:string);
  render(kgraph:KGraph);
}

export default IKGraphRenderBackend;
