import {AddTodolistAC, RemoveTodolistAC, TodolistDomainType, todolistReducer} from "../store/todolist-reducer";
import {tasksReducer} from "../store/tasks-reducer";
import {v1} from "uuid";
// import {TasksStateType} from "../app/TodolistList";

/*test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const action = AddTodolistAC('new todolist', v1())

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolistId)
    expect(idFromTodolists).toBe(action.todolistId)
})*/
