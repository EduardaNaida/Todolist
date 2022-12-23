import {todolistAPI, TodoListType} from "../api/todolist-api";
import {FilterValuesType} from "../AppWithRedux";
import {Dispatch} from "redux";
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
}
const initialState: Array<TodolistDomainType> = []

export type TodolistActionType =
    AddTodolistAT
    | RemoveTodolistAT
    | ChangeTodolistFilterAT
    | EditTitleAT
    | setTodolistType

export const todolistReducer = (todoLists: Array<TodolistDomainType> = initialState, action: TodolistActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...todoLists]
        }
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        case "EDIT-TODOLIST-TITLE":
            return todoLists.map(t => t.id === action.todoListId
                ? {...t, title: action.newTitle}
                : t)
        case "SET-TODOLIST":
            return action.todos.map(el => ({
                ...el, filter: 'all'
            }))

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
    return {
        type: 'SET-TODOLIST',
        todos
    } as const
}

type setTodolistType = ReturnType<typeof setTodolist>

export const getTodosThunk = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolist()
        .then((r) => {
            dispatch(setTodolist(r.data))
        })
}

export const createTodosThunk = (title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title)
        .then((r) => {
            const item = r.data.data.item
            dispatch(AddTodolistAC(item))
        })
}

export const removeTodosThunk = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTodolist(todolistId)
        .then((r) => {
            dispatch(RemoveTodolistAC(todolistId))
        })
}

export const changeTodosTitleThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.updateTodolist(todolistId, title)
        .then((r) => {
            dispatch(EditTodolistAC(todolistId, title))
        })
}

