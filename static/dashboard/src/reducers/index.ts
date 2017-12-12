import { combineReducers, AnyAction } from 'redux';
import {smallSteps, selectedSmallStep, collapsible} from './smallSteps';

const rootReducer = combineReducers({
  smallSteps,
  selectedSmallStep,
  collapsible
});

export default rootReducer;
