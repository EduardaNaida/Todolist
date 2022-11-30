import {TasksStateType} from "../App";
import {TaskType} from "../TodoList";
import {v1} from "uuid";
import {AddTodolistAT, RemoveTodolistAT} from "./todolist-reducer";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

type AddTaskActionType = ReturnType<typeof addTaskAC>

type ChangeStatusActionType = ReturnType<typeof changeTaskStatusAC>

type ChangeTitleActionType = ReturnType<typeof changeTitleAC>

type ActionType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeStatusActionType
    | ChangeTitleActionType
    | AddTodolistAT
    | RemoveTodolistAT

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        }
        case 'ADD-TASK':
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            return {
                ...state,
                [action.todolistId]: [newTask, ...state[action.todolistId]]

            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, isDone: action.newTaskStatus}
                    : t)
            }
        case 'CHANGE-TITLE-STATUS':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, title: action.newTitle}
                    : t)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolistId]: []
            }
        case "REMOVE-TODOLIST":
            let copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        default:
            return state

    }

}


export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}

export const addTaskAC = (title: string, todoListId: string) => {
    return {type: 'ADD-TASK', title: title, todolistId: todoListId} as const
}

export const changeTaskStatusAC = (taskId: string, newTaskStatus: boolean, todoListId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, newTaskStatus: newTaskStatus, todoListId} as const
}

export const changeTitleAC = (todoListId: string, taskId: string, newTitle: string) => {
    return {type: 'CHANGE-TITLE-STATUS', todoListId, taskId, newTitle: newTitle,} as const
}