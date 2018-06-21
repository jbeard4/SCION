const base = require('scion-core-base'),
      helpers = base.helpers,
      query = base.query,
      transitionComparator = base.helpers.transitionComparator;

/** 
 * @description Implements SCION legacy semantics. See {@link scion.BaseInterpreter} for information on the constructor arguments.
 * @class Statechart
 * @extends BaseInterpreter
 */
class Statechart extends base.BaseInterpreter {

  constructor(modelOrModelFactory, opts){

    opts = opts || {};
    opts.legacySemantics = true;

    super(modelOrModelFactory, opts);
  }

  /** @private */
  _selectTransitions(currentEvent, selectEventlessTransitions) {
    if (this.opts.onlySelectFromBasicStates) {
      var states = this._configuration.iter();
    } else {
      var statesAndParents = new this.opts.Set;

      //get full configuration, unordered
      //this means we may select transitions from parents before states
      var configList = this._configuration.iter();
      for (var idx = 0, len = configList.length; idx < len; idx++) {
        var basicState = configList[idx];
        statesAndParents.add(basicState);
        var ancestors = query.getAncestors(basicState);
        for (var ancIdx = 0, ancLen = ancestors.length; ancIdx < ancLen; ancIdx++) {
          statesAndParents.add(ancestors[ancIdx]);
        }
      }

      states = statesAndParents.iter();
    }

    var transitionSelector = this.opts.transitionSelector;
    var enabledTransitions = new this.opts.Set();

    var e = this._evaluateAction.bind(this,currentEvent);

    for (var stateIdx = 0, stateLen = states.length; stateIdx < stateLen; stateIdx++) {
      let transitions = states[stateIdx].transitions;
      for (var txIdx = 0, len = transitions.length; txIdx < len; txIdx++) {
        const t = transitions[txIdx];
        if(transitionSelector(t, currentEvent, e, selectEventlessTransitions)){
          enabledTransitions.add(t);
        }
      }
    }

    var priorityEnabledTransitions = this._selectPriorityEnabledTransitions(enabledTransitions);

    this._log("priorityEnabledTransitions", priorityEnabledTransitions);

    return priorityEnabledTransitions;
  }

  /** @private */
  _selectPriorityEnabledTransitions(enabledTransitions) {
    var priorityEnabledTransitions = new this.opts.Set();

    var tuple = this._getInconsistentTransitions(enabledTransitions), 
        consistentTransitions = tuple[0], 
        inconsistentTransitionsPairs = tuple[1];

    priorityEnabledTransitions.union(consistentTransitions);

    this._log("enabledTransitions", enabledTransitions);
    this._log("consistentTransitions", consistentTransitions);
    this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
    this._log("priorityEnabledTransitions", priorityEnabledTransitions);

    while (!inconsistentTransitionsPairs.isEmpty()) {
      enabledTransitions = new this.opts.Set(
          inconsistentTransitionsPairs.iter().map(function(t){return this.opts.priorityComparisonFn(t);},this));

      tuple = this._getInconsistentTransitions(enabledTransitions);
      consistentTransitions = tuple[0]; 
      inconsistentTransitionsPairs = tuple[1];

      priorityEnabledTransitions.union(consistentTransitions);

      this._log("enabledTransitions", enabledTransitions);
      this._log("consistentTransitions", consistentTransitions);
      this._log("inconsistentTransitionsPairs", inconsistentTransitionsPairs);
      this._log("priorityEnabledTransitions", priorityEnabledTransitions);

    }
    return priorityEnabledTransitions;
  }

  /** @private */
  _getInconsistentTransitions(transitions) {
    var allInconsistentTransitions = new this.opts.Set();
    var inconsistentTransitionsPairs = new this.opts.Set();
    var transitionList = transitions.iter();

    this._log("transitions", transitions);

    for(var i = 0; i < transitionList.length; i++){
      for(var j = i+1; j < transitionList.length; j++){
        var t1 = transitionList[i];
        var t2 = transitionList[j];
        if (this._conflicts(t1, t2)) {
          allInconsistentTransitions.add(t1);
          allInconsistentTransitions.add(t2);
          inconsistentTransitionsPairs.add([t1, t2]);
        }
      }
    }

    var consistentTransitions = transitions.difference(allInconsistentTransitions);
    return [consistentTransitions, inconsistentTransitionsPairs];
  }

  _conflicts(t1, t2) {
    return !this._isArenaOrthogonal(t1, t2);
  }

  /** @private */
  _isArenaOrthogonal(t1, t2) {

    this._log("transition scopes", t1.scope, t2.scope);

    var isOrthogonal;
    isOrthogonal = query.isOrthogonalTo(t1.scope || t1.source, t2.scope || t2.source)
    
    this._log("transition scopes are orthogonal?", isOrthogonal);

    return isOrthogonal;
  }
}

base.Statechart = Statechart;
module.exports = base;
