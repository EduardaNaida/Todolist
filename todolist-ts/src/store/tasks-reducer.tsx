import {AddTodolistAT, changeTodolistEntityStatusAC, EditTodolistAC, RemoveTodolistAT} from "./todolist-reducer";
import {TasksStateType} from "../app/AppWithRedux";
import {Dispatch} from "redux";
import {
    taskAPI,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistAPI,
    TodoListType,
    UpdateTaskModelType
} from "../api/todolist-api";
import {AppRootStateType} from "../app/store";
import {setAppErrorAC, setAppStatusAC} from "../app/appReducer";
import {AxiosError} from "axios";

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

type ActionType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeStatusActionType
    // | ChangeTitleActionType
    | AddTodolistAT
    | RemoveTodolistAT
    | setTaskType
    | setTodolistType

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
        case 'CHANGE-TASK-STATUS':
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
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            }
        case 'SET-TODOLIST': {
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

export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}

export const changeTaskStatusAC = (taskId: string, status: UpdateDomainTaskModelType, todoListId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todoListId} as const
}

// export const changeTitleAC = (todoListId: string, taskId: string, newTitle: string) => {
//     return {type: 'CHANGE-TITLE-STATUS', todoListId, taskId, newTitle: newTitle,} as const
// }

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
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

type setTodolistType = ReturnType<typeof setTodolist>
type setTaskType = ReturnType<typeof setTasksAC>;

export const removeTasksThunk = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const fetchTasksThunk = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    taskAPI.getTask(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(tasks, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    taskAPI.createTask(todolistId, title)
        .then((res) => {
            if(res.data.resultCode === 0){
                const item = res.data.data.item
                dispatch(addTaskAC(item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if(res.data.messages.length){
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        }).catch((e) => {
        dispatch(setAppStatusAC('failed'))
        dispatch(setAppErrorAC(e.message))
    })
}

export const updateTaskThunk = (todolistId: string, taskId: string, status: UpdateDomainTaskModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
    taskAPI.updateTask(todolistId, taskId, model)
        .then((res) => {
            dispatch(changeTaskStatusAC(taskId, status, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

