const scxml = require('../../../../..');
const viz = document.getElementById("viz");
import fnModel from '../../dist/drag-and-drop'

const handleAction = (state, action) => {
  if(action.type && !action.name){
    action.name = action.type;
  }
  
  let interpreter
  if(!state){
    //instantiate the interpreter
    interpreter = new scxml.scion.Statechart(fnModel);
    //start the interpreter
    interpreter.start();
  }else{
    //instantiate the interpreter
    interpreter = new scxml.scion.Statechart(fnModel, {snapshot : state});
  }

  interpreter.gen(action); 

  return interpreter.getSnapshot();
}

export default handleAction 
