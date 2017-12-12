import _ = require('underscore');

const initialState = {
  selectedSmallStep : null,
  smallSteps : [],
  collapsible : {}
};

export function smallSteps(state = initialState.smallSteps, action) {
  switch (action.type) {
    case 'SMALL_STEP':
      const message = action.message;
      return [{
        id : action.lastEventId, 
        name : message.meta.scName,
        docUrl : message.meta.docUrl,
        sessionid : message.meta.sessionid,
        eventName : message.data.event ? message.data.event.name : '<null>',
        snapshot : message.meta.snapshot,
        event : message.data.event,
        parentSessionIds : message.meta.parentSessionIds,
        transitionsTaken : message.data.transitionsTaken,
        previousConfiguration : message.data.statesExited,
        defaultStatesEntered : message.data.defaultStatesEntered
      }].concat(state);
    default:
      return state;
  }
}

export function selectedSmallStep(state = initialState.selectedSmallStep, action) {
  switch (action.type) {
    case 'SELECT_SMALL_STEP':
      return action.index;
    default:
      return state;
  }
}

export function collapsible(state = initialState.collapsible, action) {
  switch (action.type) {
    case 'COLLAPSIBLE_TRIGGER_CLICK':
      return _.extend(JSON.parse(JSON.stringify(state)), {[action.title] : !state[action.title]})
    default:
      return state;
  }
}
