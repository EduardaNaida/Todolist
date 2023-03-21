import {tasksReducer} from "../features/TodolistList/Todolist/tasks-reducer";
import {todolistReducer} from "../features/TodolistList/todolist-reducer";
import {ActionCreatorsMapObject, AnyAction, bindActionCreators, combineReducers,} from "redux";
import thunk, {ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "./appReducer";
import {authReducer} from "../features/Login/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {useMemo} from "react";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todolistReducer,
  app: appReducer,
  auth: authReducer,
});

// непосредственно создаём store
//export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>;

export const UseAppSelector: TypedUseSelectorHook<AppRootStateType> =
  useSelector;
export const AppDispatch = () => useDispatch<AppDispatchType>();
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
  const dispatch = AppDispatch()

  return useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, []);
}