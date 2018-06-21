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

export type onEntryListener = (stateId: string) => void;
export type onExitListener = (stateId: string) => void;
export type onTransitionListener = (sourceStateId: string, targetStateIds: string[], transitionIndex: number) => void;
export type onDefaultEntryListener = (initialStateId: string) => void;
export type onErrorListener = (errorEvent: ErrorEvent) => void;
export type onBigStepBeginListener = () => void;
export type onBigStepSuspendListener = () => void;
export type onBigStepResumeListener = () => void;
export type onSmallStepBeginListener = (currentSmallStepEvent: Event) => void;
export type onSmallStepEndListener = (currentSmallStepEvent: Event) => void;
export type onBigStepEndListener = (currentBigStepEvent: Event) => void;
export type onExitInterpreterListener = (doneEvent: Event) => void;

export class EventEmitter {
  on(type: 'onEntry', listener: onEntryListener): void;
  on(type: 'onExit', listener: onExitListener): void;
  on(type: 'onTransition', listener: onTransitionListener): void;
  on(type: 'onDefaultEntry', listener: onDefaultEntryListener): void;
  on(type: 'onError', listener: onErrorListener): void;
  on(type: 'onBigStepBegin', listener: onBigStepBeginListener): void;
  on(type: 'onBigStepSuspend', listener: onBigStepSuspendListener): void;
  on(type: 'onBigStepResume', listener: onBigStepResumeListener): void;
  on(type: 'onSmallStepBegin', listener: onSmallStepBeginListener): void;
  on(type: 'onSmallStepEnd', listener: onSmallStepEndListener): void;
  on(type: 'onBigStepEnd', listener: onBigStepEndListener): void;
  on(type: 'onExitInterpreter', listener: onExitInterpreterListener): void;

  off(type: 'onEntry', listener?: onEntryListener): void;
  off(type: 'onExit', listener?: onExitListener): void;
  off(type: 'onTransition', listener?: onTransitionListener): void;
  off(type: 'onDefaultEntry', listener?: onDefaultEntryListener): void;
  off(type: 'onError', listener?: onErrorListener): void;
  off(type: 'onBigStepBegin', listener?: onBigStepBeginListener): void;
  off(type: 'onBigStepSuspend', listener?: onBigStepSuspendListener): void;
  off(type: 'onBigStepResume', listener?: onBigStepResumeListener): void;
  off(type: 'onSmallStepBegin', listener?: onSmallStepBeginListener): void;
  off(type: 'onSmallStepEnd', listener?: onSmallStepEndListener): void;
  off(type: 'onBigStepEnd', listener?: onBigStepEndListener): void;
  off(type: 'onExitInterpreter', listener?: onExitInterpreterListener): void;

  once(type: 'onEntry', listener: onEntryListener): void;
  once(type: 'onExit', listener: onExitListener): void;
  once(type: 'onTransition', listener: onTransitionListener): void;
  once(type: 'onDefaultEntry', listener: onDefaultEntryListener): void;
  once(type: 'onError', listener: onErrorListener): void;
  once(type: 'onBigStepBegin', listener: onBigStepBeginListener): void;
  once(type: 'onBigStepSuspend', listener: onBigStepSuspendListener): void;
  once(type: 'onBigStepResume', listener: onBigStepResumeListener): void;
  once(type: 'onSmallStepBegin', listener: onSmallStepBeginListener): void;
  once(type: 'onSmallStepEnd', listener: onSmallStepEndListener): void;
  once(type: 'onBigStepEnd', listener: onBigStepEndListener): void;
  once(type: 'onExitInterpreter', listener: onExitInterpreterListener): void;

  emit(type: 'onEntry', stateId: string) : void;
  emit(type: 'onExit', stateId: string) : void;
  emit(type: 'onTransition', sourceStateId: string, targetStateIds: string[], transitionIndex: number) : void;
  emit(type: 'onDefaultEntry', initialStateId: string) : void;
  emit(type: 'onError', errorEvent: ErrorEvent) : void;
  emit(type: 'onBigStepBegin') : void;
  emit(type: 'onBigStepSuspend') : void;
  emit(type: 'onBigStepResume') : void;
  emit(type: 'onSmallStepBegin', currentSmallStepEvent: Event) : void;
  emit(type: 'onSmallStepEnd', currentSmallStepEvent: Event) : void;
  emit(type: 'onBigStepEnd', currentBigStepEvent: Event) : void;
  emit(type: 'onExitInterpreter', doneEvent: Event) : void;
}

export interface ErrorEvent {
  name:'error.execution';
  data : {
    tagname: string,
    line: number,
    column: number,
    reason: 'string'
  };
  type : 'platform'
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
