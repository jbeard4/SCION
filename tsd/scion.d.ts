export type FnModel = () => SCState;
type Configuration = string[];
type FullConfiguration = string[];

export class BaseInterpreter {
  constructor(model : FnModel | SCState, opts? : any);
  start : () => void;
  startAsync : (cb: (Configuration) => void) => void;
  getConfiguration : () => Configuration;
  getFullConfiguration : () => FullConfiguration;
  isIn : (stateName : string) => boolean;
  isFinal : () => boolean;
  registerListener : (listener) => void;
  unregisterListener : (listener) => void;
  getAllTransitionEvents : () => string[];
  getSnapshot : () => Snapshot;
}

export class Statechart extends BaseInterpreter {
  gen(evtObjOrName : string | Event, optionalData? : any);
  genAsync(currentEvent : Event, cb : (Configuration) => void);
}

export interface Event {
  name : string;
  data : any;
}

export interface SCState {
  states? : SCState[];
  transitions? : SCTransition[];
  id? : string;
  $type? : string;
  $meta? : {
    isCollapsed? : boolean
  }
}

interface SCTransition{
}

interface Listener {
    onEntry : (stateId : string) => void,
    onExit : (stateId : string) => void,
    onTransition : (sourceStateId : string, targetStatesIds : string[], transitionIndex : number) => void,
    onError: (errorInfo : Error) => void,
    onBigStepBegin: () => void,
    onBigStepResume: () => void,
    onBigStepSuspend: () => void,
    onBigStepEnd: () => void
    onSmallStepBegin: (event : Event) => void,
    onSmallStepEnd: () => void
}

type Snapshot = [
  Configuration,
  any,
  boolean,
  any
];
