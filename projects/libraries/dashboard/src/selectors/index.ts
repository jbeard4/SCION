export const getSmallSteps = (state) => state.smallSteps 

export const getSelectedRowIndex = (state) => state.selectedSmallStep 

export const getCurrentRow = (state) => {
  const smallSteps = getSmallSteps(state)
  const selectedRowIndex = getSelectedRowIndex(state)
  return smallSteps && smallSteps.length &&
    typeof selectedRowIndex === 'number' &&
    smallSteps[selectedRowIndex];
}

export const getTransitionsTaken = (state) => {
  let transitionsTaken  = new Map<string, Set<number>>();
  const currentRow = getCurrentRow(state);
  currentRow && currentRow.transitionsTaken && currentRow.transitionsTaken.forEach( transitionInfo => {
    let transitionSourceId, transitionTargetIds, transitionIndex;
    [transitionSourceId, transitionTargetIds, transitionIndex] = transitionInfo;
    let enabledTransitionIndexes;
    if(transitionsTaken.has(transitionSourceId)){
      enabledTransitionIndexes = transitionsTaken.get(transitionSourceId)
    } else {
      enabledTransitionIndexes = new Set();
      transitionsTaken.set(transitionSourceId, enabledTransitionIndexes);
    }
    enabledTransitionIndexes.add(transitionIndex);
  });
  return transitionsTaken;
}

export const getSessionTable = (state) => {
  const currentRow = getCurrentRow(state);
  const smallSteps = getSmallSteps(state);
  const sessionIdList = currentRow ? [currentRow.sessionid].concat(currentRow.parentSessionIds).reverse() : [];

  //look up associated scxmlName for each sessionId in the hierarchy
  const sessionTable = sessionIdList 
    .map(parentSessionId => ({sessionid : parentSessionId}))
    .map(o => {
      let sessionIds = smallSteps.map(smallStep => smallStep.sessionid);
      let idx = sessionIds.indexOf(o.sessionid);
      if(idx > -1){
        let lastSmallStepForSessionId = smallSteps[idx];
        return {
          sessionid : lastSmallStepForSessionId.sessionid,
          name : lastSmallStepForSessionId.name
        }
      }else{
        return {
          sessionid : null,
          name : null
        }
      }
    });
  return sessionTable;
}

export const getCurrentRowDatamodel = (state) => {
  const currentRow = getCurrentRow(state);
  const currentRowDatamodel = currentRow ? currentRow.snapshot[3] : null;
  return currentRowDatamodel; 
}

export const getPreviousSessionDatamodel  = (state) => {
  const currentRow = getCurrentRow(state);
  const smallSteps = getSmallSteps(state);

  //look up previous row with same session id 
  const previousSessionRow = (() => {
    let idx = smallSteps.map(smallStep => smallStep.sessionid).indexOf(currentRow.sessionid);
    if(idx > -1){
      let lastSmallStepForSessionId = smallSteps[idx];
      return lastSmallStepForSessionId;
    }else{
      return null;
    }
  })();

  const previousSessionDatamodel = currentRow  ? previousSessionRow.snapshot[3] : null; 
  return previousSessionDatamodel; 
}
