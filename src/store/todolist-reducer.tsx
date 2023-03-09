import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { Dispatch } from "redux";
import { todolistAPI, TodoListType } from "../api/todolist-api";
import { RequestStatusType, setAppStatusAC } from "../app/appReducer";
import { FilterValuesType } from "../features/TodolistList/TodolistList";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";

export type TodolistDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []


const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        RemoveTodolistAC(state, action: PayloadAction<{todolistId: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        AddTodolistAC(state, action: PayloadAction<{todolist: TodoListType}>){
            state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        ChangeTodolistAC(state, action: PayloadAction<{id: string, filter: FilterValuesType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        EditTodolistAC(state, action: PayloadAction<{id: string, title: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].title = action.payload.title
        },
        setTodolist(state, action: PayloadAction<{todos: TodoListType[]}>){
            return action.payload.todos.map(el => ({
                ...el, filter: 'all', entityStatus: 'idle'
            }))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.status
    }}
})

export const {RemoveTodolistAC, AddTodolistAC, ChangeTodolistAC, EditTodolistAC, setTodolist, changeTodolistEntityStatusAC} = slice.actions;

export const todolistReducer = slice.reducer;

export const getTodosThunk = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    todolistAPI.getTodolist()
        .then((r) => {
            dispatch(setTodolist({todos: r.data}))
            dispatch(setAppStatusAC({value: 'succeeded'}))
        })
        .catch((e: AxiosError<ErrorResponseType>) => {
            const error = e.response ? e.response.data.message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

export const createTodosThunk = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    todolistAPI.createTodolist(title)
        .then((r) => {
            if (r.data.resultCode === 0) {
                const item = r.data.data.item
                dispatch(AddTodolistAC({todolist: item}))
                dispatch(setAppStatusAC({value: 'succeeded'}))
            } else {
                handleServerAppError<{ item: TodoListType }>(dispatch, r.data)
                dispatch(setAppStatusAC({value: 'failed'}))
            }
        })
        .catch((e: AxiosError<ErrorResponseType>) => {
            const error = e.response ? e.response.data.message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTodosThunk = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    todolistAPI.deleteTodolist(todolistId)
        .then((r) => {
            dispatch(RemoveTodolistAC({todolistId}))
            dispatch(setAppStatusAC({value: 'succeeded'}))
        })
        .catch((e: AxiosError<ErrorResponseType>) => {
            const error = e.response ? e.response.data.message : e.message
            dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'idle'}))
            handleServerNetworkError(dispatch, error)
        })
}
type ErrorResponseType = {
    message: string,
    field: string
}
export const changeTodosTitleThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    dispatch(setAppStatusAC({value: 'loading'}))
    todolistAPI.updateTodolist(todolistId, title)
        .then((r) => {
            dispatch(EditTodolistAC({id: todolistId, title}))
            dispatch(setAppStatusAC({value: 'succeeded'}))
            dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
        })
        .catch((e: AxiosError<ErrorResponseType>) => {
            const error = e.response ? e.response.data.message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

