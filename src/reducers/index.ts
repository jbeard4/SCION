import { combineReducers, AnyAction } from 'redux';
import {smallSteps, selectedSmallStep} from './smallSteps';

const rootReducer = combineReducers({
  smallSteps,
  selectedSmallStep
});

export default rootReducer;
