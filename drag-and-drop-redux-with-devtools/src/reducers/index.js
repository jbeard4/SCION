const scion = require('@scion-scxml/core');
import modelFactory from '../../dist/drag-and-drop'

const initialState = { snapshot: null };

const handleAction = ({ snapshot } = initialState, action) => {
  if(action.type && !action.name){
    action.name = action.type;
  }
  
  let interpreter
  if(!snapshot){
    //instantiate the interpreter
    interpreter = new scion.Statechart(modelFactory);
    //start the interpreter
    interpreter.start();
  }else{
    //instantiate the interpreter
    interpreter = new scion.Statechart(modelFactory, { snapshot });
  }

  interpreter.gen(action); 

  return { snapshot: interpreter.getSnapshot() };
}

export default handleAction 
