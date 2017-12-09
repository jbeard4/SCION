const initialState = [];

export default function smallSteps(state = initialState, action) {
  switch (action.type) {
    case 'SMALL_STEP':
      const message = action.message;
      const e = action.eventsourceEvent;
      return [{
        id : e.lastEventId, 
        name : message.meta.scName,
        docUrl : message.meta.docUrl,
        sessionid : message.meta.sessionid,
        eventName : message.data.event ? message.data.event.name : '<null>',
        snapshot : message.meta.snapshot,
        event : message.data.event,
        parentSessionIds : message.meta.parentSessionIds,
        //transitionsTaken : transitionsTaken,
        previousConfiguration : message.data.statesExited,
        defaultStatesEntered : message.data.defaultStatesEntered
      }].concat(state);
    default:
      return state;
  }
}

