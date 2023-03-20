import * as taskActions from './tasks-actions'
import * as todolistAsyncActions from './todolist-actions'
import {slice} from "./todolist-reducer";

const todolistActions = {
  ...todolistAsyncActions,
  ...slice.actions
}

export {
  taskActions,
  todolistActions
}