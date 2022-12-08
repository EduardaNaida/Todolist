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


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c13fa168-cea5-4630-847d-9c0d00665f01',
    },
})


export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return  instance.put<ResponseType<{}>>(`todo-lists/${todolistId}`, { title: title })
    },
    getTodolist() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todolistId}`)
    },
    createTodolist(title: string){
        return instance.post<ResponseType<{item: TodolistType}>>(`todo-lists/`,
            {title},
        )
    }
}
