import {asyncTaskActions as taskAsyncActions} from './Todolist/tasks-reducer'
import {asyncActions as todolistAsyncActions} from './todolist-reducer'
import {slice} from "./todolist-reducer";
import TodolistList from './TodolistList'

const todolistActions = {
  ...todolistAsyncActions,
  ...slice.actions
}

const taskActions = {
  ...taskAsyncActions,
}

export {
  taskActions,
  todolistActions,
  TodolistList
}