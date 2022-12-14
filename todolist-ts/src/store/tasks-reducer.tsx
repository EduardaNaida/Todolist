import {AddTodolistAT, RemoveTodolistAT} from "./todolist-reducer";
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

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

type AddTaskActionType = ReturnType<typeof addTaskAC>

type ChangeStatusActionType = ReturnType<typeof changeTaskStatusAC>

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

type ActionType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeStatusActionType
    | AddTodolistAT
    | RemoveTodolistAT
    | setTaskType
    | setTodolistType
    | changeTaskEntityStatusType

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: TaskDomainType[]
}

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
            // const newTask: TaskType = {
            //     id: v1(),
            //     title: action.title,
            //     isDone: false
            // }
            // return {
            //     ...state,
            //     [action.todolistId]: [newTask, ...state[action.todolistId]]
            //
            // }
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'CHANGE-TASK-STATUS' :
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, ...action.status} : t)
            }
        // case 'CHANGE-TITLE-STATUS':
        //     return {
        //         ...state,
        //         [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
        //             ? {...t, title: action.newTitle}
        //             : t)
        //     }
        case 'ADD-TODOLIST' :
            return {
                ...state,
                [action.todolist.id]: []
            }
        case 'SET-TODOLIST' : {
            const stateCopy = {...state}
            action.todos.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS': {
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        }
        case "REMOVE-TODOLIST" : {
            let copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        }
        case "TASK-CHANGE-ENTITY-STATUS":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, entityStatus: action.entityStatus}
                    : t)
            }
        default:
            return state

    }

}


export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}

export const addTaskAC = (task: TaskDomainType) => {
    return {type: 'ADD-TASK', task} as const
}

export const changeTaskStatusAC = (taskId: string, status: UpdateDomainTaskModelType, todoListId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todoListId} as const
}

// export const changeTitleAC = (todoListId: string, taskId: string, newTitle: string) => {
//     return {type: 'CHANGE-TITLE-STATUS', todoListId, taskId, newTitle: newTitle,} as const
// }

export const setTasksAC = (tasks: TaskDomainType[], todolistId: string) => {
    return {
        type: 'SET-TASKS',
        todolistId,
        tasks
    } as const
}

export const setTodolist = (todos: TodoListType[]) => {
    return {
        type: 'SET-TODOLIST',
        todos
    } as const
}

export const changeTaskEntityStatusAC = (todoListId: string, taskId: string, entityStatus: RequestStatusType) => {
    return {type: 'TASK-CHANGE-ENTITY-STATUS', todoListId, taskId, entityStatus} as const
}
type changeTaskEntityStatusType = ReturnType<typeof changeTaskEntityStatusAC>

type setTodolistType = ReturnType<typeof setTodolist>
type setTaskType = ReturnType<typeof setTasksAC>;

export const removeTasksThunk = (taskId: string, todolistId: string) => (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        }).finally(() => {
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
    })
}

export const fetchTasksThunk = (todolistId: string) => (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    taskAPI.getTask(todolistId)
        .then((res) => {
            const tasks = res.data.items
            const domainTasks: TaskDomainType[] = tasks.map((task) => ({
                ...task,
                entityStatus: 'idle'
            }))
            dispatch(setTasksAC(domainTasks, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const addTaskThunk = (todolistId: string, title: string) => async (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC('loading'))

    try {
        const res = await taskAPI.createTask(todolistId, title);
        if (res.data.resultCode === Result_Code.SUCCESS) {
            const item = res.data.data.item
            dispatch(addTaskAC({...item, entityStatus: 'idle'}))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError<{ item: TaskType }>(dispatch, res.data)
            dispatch(setAppStatusAC('failed'))
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

    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    taskAPI.updateTask(todolistId, taskId, model)
        .then((res) => {
            if (res.data.resultCode === Result_Code.SUCCESS) {
                dispatch(changeTaskStatusAC(taskId, status, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError<{ item: TaskType }>(dispatch, res.data)
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((e: AxiosError<{ message: string }>) => {
            const error = e.response ? e.response.data.message : e.message
            handleServerNetworkError(dispatch, error);
        })
        .finally(() => {
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
        })
}

