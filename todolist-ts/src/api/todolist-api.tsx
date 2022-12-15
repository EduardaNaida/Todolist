import axios from 'axios'
import React from 'react'

type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type ResponseType<D> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type UpdateTaskType = {
    title: string
    description: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
}

export type ResponseTaskType<D> = {
    resultCode: number
    messages: Array<string>
    data: D
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c13fa168-cea5-4630-847d-9c0d00665f01',
    },
})


export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType<{}>>(`todo-lists/${todolistId}`, {title: title})
    },
    getTodolist() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todolistId}`)
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>(`todo-lists/`,
            {title},
        )
    }
}

export const taskAPI = {
    getTask(todolistId: string) {
        return instance.get<Array<TodolistType>>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseTaskType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`,
            {title},
        )
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseTaskType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, title: string, taskId: string) {
        return instance.put<ResponseTaskType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    },
}
