import {todolistAPI, TodoListType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../app/appReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {FilterValuesType} from "../features/TodolistList/TodolistList";

export type RemoveTodolistAT = {
    type: "REMOVE-TODOLIST"
    todolistId: string
}

export type AddTodolistAT = ReturnType<typeof AddTodolistAC>

type ChangeTodolistFilterAT = {
    type: "CHANGE-TODOLIST-FILTER"
    filter: FilterValuesType
    todoListId: string
}

type EditTitleAT = {
    type: "EDIT-TODOLIST-TITLE"
    todoListId: string
    newTitle: string
}

export type TodolistDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

export type TodolistActionType =
    AddTodolistAT
    | RemoveTodolistAT
    | ChangeTodolistFilterAT
    | EditTitleAT
    | setTodolistType
    | changeTodolistEntityStatusType

export const todolistReducer = (todoLists: Array<TodolistDomainType> = initialState, action: TodolistActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...todoLists]
        }
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter,  entityStatus: 'idle'} : tl)
        case "EDIT-TODOLIST-TITLE":
            return todoLists.map(t => t.id === action.todoListId
                ? {...t, title: action.newTitle}
                : t)
        case "SET-TODOLIST":
            return action.todos.map(el => ({
                ...el, filter: 'all', entityStatus: 'idle'
            }))
        case "CHANGE-ENTITY-STATUS":
            return todoLists.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return todoLists
    }

}

export const RemoveTodolistAC = (id: string): RemoveTodolistAT => ({
    type: 'REMOVE-TODOLIST', todolistId: id
})

export const AddTodolistAC = (todolist: TodoListType) => ({
    type: 'ADD-TODOLIST', todolist
} as const)

export const ChangeTodolistAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterAT => ({
    type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter: filter
})

export const EditTodolistAC = (id: string, title: string): EditTitleAT => ({
    type: 'EDIT-TODOLIST-TITLE', todoListId: id, newTitle: title
})

export const setTodolist = (todos: TodoListType[]) => {
    return {type: 'SET-TODOLIST', todos} as const
}

export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {type: 'CHANGE-ENTITY-STATUS', id, status} as const
}

type changeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>
type setTodolistType = ReturnType<typeof setTodolist>

export const getTodosThunk = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    todolistAPI.getTodolist()
        .then((r) => {
            dispatch(setTodolist(r.data))
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
                dispatch(AddTodolistAC(item))
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
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then((r) => {
            dispatch(RemoveTodolistAC(todolistId))
            dispatch(setAppStatusAC({value: 'succeeded'}))
        })
        .catch((e: AxiosError<ErrorResponseType>) => {
            const error = e.response ? e.response.data.message : e.message
            dispatch(changeTodolistEntityStatusAC(todolistId, 'idle'))
            handleServerNetworkError(dispatch, error)
        })
}
type ErrorResponseType = {
    message: string,
    field: string
}
export const changeTodosTitleThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    dispatch(setAppStatusAC({value: 'loading'}))
    todolistAPI.updateTodolist(todolistId, title)
        .then((r) => {
            dispatch(EditTodolistAC(todolistId, title))
            dispatch(setAppStatusAC({value: 'succeeded'}))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        })
        .catch((e: AxiosError<ErrorResponseType>) => {
            const error = e.response ? e.response.data.message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

