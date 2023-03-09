import {
    taskAPI,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    TodoListType,
    UpdateTaskModelType
} from "../api/todolist-api";
import {AppDispatchType, AppRootStateType} from "../app/store";
import {RequestStatusType, setAppStatusAC} from "../app/appReducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import { AddTodolistAC, RemoveTodolistAC, setTodolist } from "./todolist-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export enum Result_Code {
    SUCCESS = 0,
    ERROR = 1,
    CAPTCHA = 10
}


export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: TaskDomainType[]
}

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{taskId: string, todolistId: string}>){
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
      },
      addTaskAC(state, action: PayloadAction<{task: TaskDomainType}>) {
        state[action.payload.task.todoListId].unshift(action.payload.task)

      },
      changeTaskStatusAC(state, action: PayloadAction<{taskId: string, status: UpdateDomainTaskModelType, todoListId: string}>) {
        const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.status}
            }
      },
      setTasksAC(state, action: PayloadAction<{tasks: TaskDomainType[], todolistId: string}>) {
        state[action.payload.todolistId] = action.payload.tasks
    },
    changeTaskEntityStatusAC(state, action: PayloadAction<{todoListId: string, taskId: string, entityStatus: RequestStatusType}>) {
        return {
            ...state,
            [action.payload.todoListId]: state[action.payload.todoListId].map(t => t.id === action.payload.taskId
                ? {...t, entityStatus: action.payload.entityStatus}
                : t)
        }
    }    },
    extraReducers:(builder) => {
        builder.addCase(AddTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        }),
        builder.addCase(setTodolist, (state, action) => {
            action.payload.todos.forEach((tl: any) => {
                state[tl.id] = []
            })
        }),
        builder.addCase(RemoveTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        
        })
    }
 })


export const tasksReducer = slice.reducer;
export const {removeTaskAC, addTaskAC, changeTaskEntityStatusAC, changeTaskStatusAC, setTasksAC} = slice.actions;


export const removeTasksThunk = (taskId: string, todolistId: string) => (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todoListId: todolistId, taskId, entityStatus: 'loading'}))
    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC({taskId, todolistId}))
            dispatch(setAppStatusAC({value: 'succeeded'}))
        }).finally(() => {
        dispatch(changeTaskEntityStatusAC({todoListId: todolistId, taskId, entityStatus: 'succeeded'}))
    })
}

export const fetchTasksThunk = (todolistId: string) => (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    taskAPI.getTask(todolistId)
        .then((res) => {
            const tasks = res.data.items
            const domainTasks: TaskDomainType[] = tasks.map((task) => ({
                ...task,
                entityStatus: 'idle'
            }))
            dispatch(setTasksAC({tasks: domainTasks, todolistId}))
            dispatch(setAppStatusAC({value: 'succeeded'}))
        })
}

export const addTaskThunk = (todolistId: string, title: string) => async (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC({value: 'loading'}))

    try {
        const res = await taskAPI.createTask(todolistId, title);
        if (res.data.resultCode === Result_Code.SUCCESS) {
            const item = res.data.data.item
            dispatch(addTaskAC({task: {...item, entityStatus: 'idle'}}))
            dispatch(setAppStatusAC({value: 'succeeded'}))
        } else {
            handleServerAppError<{ item: TaskType }>(dispatch, res.data)
            dispatch(setAppStatusAC({value: 'failed'}))
        }
    } catch (error) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
            const err = error.response ? error.response.data.message : error.message
            handleServerNetworkError(dispatch, err);
        }
    }

}

export const updateTaskThunk = (todolistId: string, taskId: string, status: UpdateDomainTaskModelType) => (dispatch: AppDispatchType, getState: () => AppRootStateType) => {
    const tasks = getState().tasks
    const task = tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
        //throw new Error("task not found in the state");
        console.warn('task not found in the state')
        return
    }
    const model: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        startDate: task.startDate,
        priority: task.priority,
        status: task.status,
        ...status
    }

    dispatch(setAppStatusAC({value: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todoListId: todolistId, taskId, entityStatus: 'loading'}))
    taskAPI.updateTask(todolistId, taskId, model)
        .then((res) => {
            if (res.data.resultCode === Result_Code.SUCCESS) {
                dispatch(changeTaskStatusAC({taskId, status, todoListId: todolistId}))
                dispatch(setAppStatusAC({value: 'succeeded'}))
            } else {
                handleServerAppError<{ item: TaskType }>(dispatch, res.data)
                dispatch(setAppStatusAC({value: 'failed'}))
            }
        })
        .catch((e: AxiosError<{ message: string }>) => {
            const error = e.response ? e.response.data.message : e.message
            handleServerNetworkError(dispatch, error);
        })
        .finally(() => {
            dispatch(changeTaskEntityStatusAC({todoListId: todolistId, taskId, entityStatus: 'succeeded'}))
        })
}

