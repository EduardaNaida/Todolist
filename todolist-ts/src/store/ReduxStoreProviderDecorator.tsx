import {Provider} from "react-redux";
import {AppRootStateType, store} from "./store";
import React from "react";
import { combineReducers, createStore } from 'redux'
import { v1 } from 'uuid'
import {tasksReducer} from "./tasks-reducer";
import {todolistReducer} from "./todolist-reducer";


const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todolistReducer
})

const initialGlobalState = {
  todoLists: [
    {id: 'todolistId1', title: 'What to learn', filter: 'all'},
    {id: 'todolistId2', title: 'What to buy', filter: 'all'}
  ],
  tasks: {
    ['todolistId1']: [
      {id: v1(), title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true}
    ],
    ['todolistId2']: [
      {id: v1(), title: 'Milk', isDone: true},
      {id: v1(), title: 'React Book', isDone: true}
    ]
  }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as unknown as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}