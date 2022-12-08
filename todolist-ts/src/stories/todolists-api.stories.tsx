import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {'API-KEY': 'c13fa168-cea5-4630-847d-9c0d00665f01'}
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistAPI.getTodolist()
            .then(res => {
                setState(res.data)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
       todolistAPI.createTodolist('title')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = ""
    useEffect(() => {
       todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = "e159b378-a137-4885-81fb-0f7520f14eaf"
    useEffect(() => {
        todolistAPI.updateTodolist(todolistId, 'title')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

