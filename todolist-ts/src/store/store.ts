import { tasksReducer } from './tasks-reducer'
import { todolistReducer } from './todolist-reducer'
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import thunk, {ThunkDispatch} from 'redux-thunk';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todolistReducer
})

// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const UseAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export const AppDispatch = () => useDispatch<AppDispatchType>()
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
