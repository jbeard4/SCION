export type ModelFactory = () => SCState;
type Configuration = string[];
type FullConfiguration = string[];

export class BaseInterpreter extends EventEmitter {
  constructor(model : ModelFactory | SCState, opts? : any);
  start : () => Configuration;
  startAsync : (cb: (Configuration) => void) => void;
  getConfiguration : () => Configuration;
  getFullConfiguration : () => FullConfiguration;
  isIn : (stateName : string) => boolean;
  isFinal : () => boolean;
  registerListener : (listener) => void;
  unregisterListener : (listener) => void;
  getAllTransitionEvents : () => string[];
  getSnapshot : () => Snapshot;
  gen(evtObjOrName : string | Event, optionalData? : any);
  genAsync(currentEvent : Event, cb : (Configuration) => void);
}

export interface Event {
  name : string;
  data : any;
}

export class EventEmitter {
  on : (type : string, listener : (...args) => void) => void;
  off : (type : string, listener? : (...args) => void) => void;
  once : (type : string, listener : (...args) => void) => void;
  emit : (type : string) => void;
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
