const scion = require('scion-core');
import fnModel from '../../dist/drag-and-drop'

const handleAction = (state, action) => {
  if(action.type && !action.name){
    action.name = action.type;
  }
  
  let interpreter
  if(!state){
    //instantiate the interpreter
    interpreter = new scion.Statechart(fnModel);
    //start the interpreter
    interpreter.start();
  }else{
    //instantiate the interpreter
    interpreter = new scion.Statechart(fnModel, {snapshot : state});
  }

  interpreter.gen(action); 

  return interpreter.getSnapshot();
}

export default handleAction 
