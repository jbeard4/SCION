const scxml = require('../../../../..');
const SCHVIZ = require('schviz2');
const viz = document.getElementById("viz");
const schviz = new SCHVIZ(viz);
import fnModel from '../../dist/drag-and-drop'

const scjson = fnModel();

schviz.renderSCJSON(scjson, 'right', function(){});

let listener = {
    onEntry: (stateId) => { 
      schviz.highlightState(stateId);
    },
    onExit: (stateId) => { 
      schviz.unhighlightState(stateId);
    },
    onTransition: (sourceStateId, targetIds, transitionIdx) => {
        if (targetIds && targetIds.length) {
            schviz.highlightTransition(sourceStateId, transitionIdx);
        } 
    },
    onError: (err) => {
        console.error('ERROR:' + JSON.stringify(err));
    }
}

const handleAction = (state, action) => {
  if(action.type && !action.name){
    action.name = action.type;
  }
  
  let interpreter
  if(!state){
    //instantiate the interpreter
    interpreter = new scxml.scion.Statechart(scjson);
    interpreter.registerListener(listener);
    //start the interpreter
    interpreter.start();
  }else{
    //instantiate the interpreter
    interpreter = new scxml.scion.Statechart(scjson, {snapshot : state});
    interpreter.registerListener(listener);
  }

  interpreter.gen(action); 

  interpreter.unregisterListener(listener);

  return interpreter.getSnapshot();
}

export default handleAction 
