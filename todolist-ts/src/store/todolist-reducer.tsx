import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodolistAT = {
    type: "REMOVE-TODOLIST"
    todolistId: string
}

export type AddTodolistAT = {
    type: "ADD-TODOLIST"
    title: string
    todolistId: string
}

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

const initialState: Array<TodoListType> = []

export type TodolistActionType = AddTodolistAT | RemoveTodolistAT | ChangeTodolistFilterAT | EditTitleAT

export const todolistReducer = (todoLists: Array<TodoListType> = initialState, action: TodolistActionType): Array<TodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            const newTodolist: TodoListType = {
                id: action.todolistId,
                title: action.title,
                filter: 'all'
            }
            return [...todoLists, newTodolist]
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        case "EDIT-TODOLIST-TITLE":
            return todoLists.map(t => t.id === action.todoListId
                ? {...t, title: action.newTitle}
                : t)
        default:
            return todoLists
    }

}

export const RemoveTodolistAC = (id: string): RemoveTodolistAT => ({
    type: 'REMOVE-TODOLIST', todolistId: id
})

export const AddTodolistAC = (todolistId: string, title: string): AddTodolistAT => ({
    type: 'ADD-TODOLIST', todolistId: v1(), title: title
})

export const ChangeTodolistAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterAT => ({
    type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter: filter
})

export const EditTodolistAC = (id: string, title: string): EditTitleAT => ({
    type: 'EDIT-TODOLIST-TITLE', todoListId: id, newTitle: title
})