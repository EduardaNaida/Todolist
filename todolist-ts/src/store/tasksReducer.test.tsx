import { removeTaskAC, tasksReducer} from './tasks-reducer'
import {AddTodolistAC, RemoveTodolistAC} from "./todolist-reducer";
import {TasksStateType} from "../AppWithRedux";
import {v1} from "uuid";

let startState: TasksStateType;

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS',
                description: 'string',
                completed: true,
                status: 0,
                priority: 0,
                startDate: 'string',
                deadline: 'string',
                todoListId: 'string',
                order: 1,
                addedDate: 'string'
            },
            {
                id: '2', title: 'JS',
                description: 'string',
                completed: true,
                status: 0,
                priority: 0,
                startDate: 'string',
                deadline: 'string',
                todoListId: 'string',
                order: 1,
                addedDate: 'string'
            },
            {
                id: '3', title: 'REACT',
                description: 'string',
                completed: true,
                status: 0,
                priority: 0,
                startDate: 'string',
                deadline: 'string',
                todoListId: 'string',
                order: 1,
                addedDate: 'string'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', description: 'string',
                completed: false,
                status: 0,
                priority: 0,
                startDate: 'string',
                deadline: 'string',
                todoListId: 'string',
                order: 1,
                addedDate: 'string'
            },
            {
                id: '2', title: 'milk', description: 'string',
                completed: true,
                status: 0,
                priority: 0,
                startDate: 'string',
                deadline: 'string',
                todoListId: 'string',
                order: 1,
                addedDate: 'string'
            },
            {
                id: '3', title: 'tea', description: 'string',
                completed: false,
                status: 0,
                priority: 0,
                startDate: 'string',
                deadline: 'string',
                todoListId: 'string',
                order: 1,
                addedDate: 'string'
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('2', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '3', title: 'tea', isDone: false}
        ]
    })
})

// test('correct task should be added to correct array', () => {
//
//     const action = addTaskAC('juice')
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState['todolistId1'].length).toBe(3)
//     expect(endState['todolistId2'].length).toBe(4)
//     expect(endState['todolistId2'][0].id).toBeDefined()
//     expect(endState['todolistId2'][0].title).toBe('juice')
//     expect(endState['todolistId2'][0].isDone).toBe(false)
// })
//
// test('status of specified task should be changed', () => {
//
//     const action = changeTaskStatusAC('2', false, 'todolistId2')
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState['todolistId2'][1].isDone).toBe(false)
//     expect(endState['todolistId1'][1].isDone).toBe(true)
// })

// test('correct title should be deleted from correct array', () => {
//
//     const action = changeTitleAC('todolistId2', '2', 'hello')
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState['todolistId2'][1].title).toBe('hello')
//     expect(endState['todolistId1'][1].title).toBe('JS')
// })

//Todolist
/*
test('new array should be added when new todolist is added', () => {

    const action = AddTodolistAC('new todolist', v1())

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
*/


test('property with todolistId should be deleted', () => {

    const action = RemoveTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})
