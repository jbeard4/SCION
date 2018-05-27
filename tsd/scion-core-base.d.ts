export type ModelFactory = () => SCState;
type Configuration = string[];
type FullConfiguration = string[];

export interface InterpreterOpts {
  /** Used to populate SCXML _sessionid. */
  sessionid?: string;  
  /** Factory used to generate sessionid if sessionid keyword is not specified */
  generateSessionid?: () => any; 
  /** Map used to map sessionid strings to Statechart instances. */
  sessionRegistry?: Map<string, BaseInterpreter>; 
  /** Class to use as an ArraySet. Defaults to ES6 Set. */
  Set?: any; 
  /** Used to pass params from invoke. Sets the datamodel when interpreter is instantiated. */
  params?: any;  
  /** State machine snapshot. Used to restore a serialized state machine. */
  snapshot?: Snapshot; 
  /** Used to pass parent session during invoke. */
  parentSession?: BaseInterpreter; 
  /** Support for id of invoke element at runtime. */
  invokeid?: string; 
  /** Custom function to use for logging. Defaults to console.log. */
  console?: (string) => void;
  /** Custom function used to select transitions. */
  transitionSelector?: any;
  /** Custom code for <cancel> tag */
  customCancel?: any;
  /** Custom code for <send> tag */
  customSend?: any;
  /** Should <send> use method gen or genAsync to pass event back into state machine? */
  sendAsync?: boolean;
  /** Custom code for actually sending the <send> tag */
  doSend?: any;
  /** Custom invokers */
  invokers?: any;
  /** Custom xml parser */
  xmlParser?: any;
  /** Custom objects exposed to the interpreter scripting context */
  interpreterScriptingContext?: any;
}

export class BaseInterpreter extends EventEmitter {
  constructor(model : ModelFactory | SCState, opts? : InterpreterOpts);
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
