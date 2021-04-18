import { combineReducers, AnyAction } from 'redux';
import {smallSteps, selectedSmallStep, collapsible} from './smallSteps';

export const rootReducerObj = {
  smallSteps,
  selectedSmallStep,
  collapsible
};

export default combineReducers(rootReducerObj);
