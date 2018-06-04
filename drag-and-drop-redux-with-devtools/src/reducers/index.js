const scxml = require('../../../../..');
import fnModel from '../../dist/drag-and-drop'

const initialState = { snapshot: null };

const handleAction = ({ snapshot } = initialState, action) => {
  if(action.type && !action.name){
    action.name = action.type;
  }
  
  let interpreter
  if(!snapshot){
    //instantiate the interpreter
    interpreter = new scxml.scion.Statechart(fnModel);
    //start the interpreter
    interpreter.start();
  }else{
    //instantiate the interpreter
    interpreter = new scxml.scion.Statechart(fnModel, { snapshot });
  }

  interpreter.gen(action); 

  return { snapshot: interpreter.getSnapshot() };
}

export default handleAction 
