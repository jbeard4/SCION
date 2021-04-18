const base = require('@scion-scxml/core-base'),
      helpers = base.helpers,
      query = base.query,
      transitionComparator = base.helpers.transitionComparator;

/** 
 * @description Implements semantics described in Algorithm D of the SCXML specification. 
 * See {@link scion.BaseInterpreter} for information on the constructor arguments.
 * @class SCInterpreter 
 * @extends BaseInterpreter
 */
class Statechart extends base.BaseInterpreter {

  constructor(modelOrModelFactory, opts){

    opts = opts || {};
    opts.legacySemantics = false;

    super(modelOrModelFactory, opts);
  }

  /** @private */
  _selectTransitions(currentEvent, selectEventlessTransitions) {
    var transitionSelector = this.opts.transitionSelector;
    var enabledTransitions = new this.opts.Set();

    var e = this._evaluateAction.bind(this,currentEvent);

    let atomicStates = this._configuration.iter().sort(transitionComparator);
    for(let state of atomicStates){
loop: for(let s of [state].concat(query.getAncestors(state))){
        for(let t of s.transitions){
          if(transitionSelector(t, currentEvent, e, selectEventlessTransitions)){
            enabledTransitions.add(t);
            break loop;
          }
        }
      }
    }

    var priorityEnabledTransitions = this._removeConflictingTransition(enabledTransitions);

    this._log("priorityEnabledTransitions", priorityEnabledTransitions);

    return priorityEnabledTransitions;
  }

  /** @private */
  _removeConflictingTransition(enabledTransitions) {
    let filteredTransitions = new this.opts.Set()
    //toList sorts the transitions in the order of the states that selected them
    for( let t1 of enabledTransitions.iter()){
      let t1Preempted = false;
      let transitionsToRemove = new Set()
      for (let t2 of filteredTransitions.iter()){
        //TODO: can we compute this statically? for example, by checking if the transition scopes are arena orthogonal?
        let t1ExitSet = this._computeExitSet([t1]);
        let t2ExitSet = this._computeExitSet([t2]);
        let hasIntersection = [...t1ExitSet].some( s => t2ExitSet.has(s) )  || [...t2ExitSet].some( s => t1ExitSet.has(s));
        this._log('t1ExitSet',t1.source.id,[...t1ExitSet].map( s => s.id ))
          this._log('t2ExitSet',t2.source.id,[...t2ExitSet].map( s => s.id ))
          this._log('hasIntersection',hasIntersection)
          if(hasIntersection){
            if(t2.source.descendants.indexOf(t1.source) > -1){    //is this the same as being ancestrally related?
              transitionsToRemove.add(t2)
            }else{ 
              t1Preempted = true;
              break
            }
          }
      }
      if(!t1Preempted){
        for(let t3 of transitionsToRemove){
          filteredTransitions.remove(t3)
        }
        filteredTransitions.add(t1)
      }
    }

    return filteredTransitions;
  }
}

base.Statechart = Statechart;
//simple default invoker
base.InterpreterScriptingContext.invokers = {
  "http://www.w3.org/TR/scxml/" : function(invokingSession, invokeObj, invokerExecutionContext, cb){
    //put invoke logic here: 
    let method, arg;
    if(invokeObj.constructorFunction){
      const fnModel = invokeObj.constructorFunction;
      const options = {
        invokeid : invokeObj.id,
        params : invokeObj.params,
        parentSession : invokingSession,
        docUrl : invokeObj.docUrl
        //sessionid : //TODO: construct or generate a sessionid for invoked session
      };
      const model = invokerExecutionContext;
      let interpreter;
      if( options.parentSession instanceof Statechart ){
        interpreter = new Statechart(fnModel, options);
      } 
      cb(null, interpreter, fnModel, model);
      //we introduce a delay here before starting the interpreter to give clients that are subscribed to onInvokedSessionInitialized event a chance to subscribe to events on the newly instantiated interpreter
      setImmediate( () => interpreter.start() );    
    } else{
      throw new Error('Invoke object needs a constructorFunction property' );
    }
  }
};
base.InterpreterScriptingContext.invokers[undefined] = 
  base.InterpreterScriptingContext.invokers[null] = 
  base.InterpreterScriptingContext.invokers['scxml'] = 
  base.InterpreterScriptingContext.invokers["http://www.w3.org/TR/scxml/"];

module.exports = base;
