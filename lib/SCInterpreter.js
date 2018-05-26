const base = require('./scion-core-base'),
      helpers = require('./helpers'),
      query = require('./query'),
      transitionComparator = helpers.transitionComparator;

/** 
 * @description Implements semantics described in Algorithm D of the SCXML specification. 
 * See {@link scion.BaseInterpreter} for information on the constructor arguments.
 * @class SCInterpreter 
 * @extends BaseInterpreter
 */
class SCInterpreter extends base.BaseInterpreter {

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

base.SCInterpreter = SCInterpreter;
module.exports = base;
