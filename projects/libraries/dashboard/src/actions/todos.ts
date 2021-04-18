import * as types from '../constants/ActionTypes';
import { ActionCreatorsMapObject } from 'redux';

function addTodo(text) {
  return { type: types.ADD_TODO, text };
}

function deleteTodo(id) {
  return { type: types.DELETE_TODO, id };
}

function editTodo(id, text) {
  return { type: types.EDIT_TODO, id, text };
}

function completeTodo(id) {
  return { type: types.COMPLETE_TODO, id };
}

function completeAll() {
  return { type: types.COMPLETE_ALL };
}

function clearCompleted() {
  return { type: types.CLEAR_COMPLETED };
}

export default {
  addTodo,
  deleteTodo,
  editTodo,
  completeTodo,
  completeAll,
  clearCompleted
} as ActionCreatorsMapObject; 
