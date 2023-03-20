import {v1} from "uuid";

import {
    ChangeTodolistAC,
    TodolistDomainType,
    todolistReducer
} from "../features/TodolistList/todolist-reducer";
import {FilterValuesType} from "../features/TodolistList/TodolistList";
import { changeTaskEntityStatusAC } from "../features/TodolistList/Todolist/tasks-reducer";
import { RequestStatusType } from "../app/appReducer";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType>;

// beforeEach(() => {
//     todolistId1 = v1();
//     todolistId2 = v1();
//
//     startState = [
//         {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 1},
//         {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 2}
//     ]
// })
//
// test('correct todolist should be removed', () => {
//
//     //
//     const endState = todolistReducer(startState, RemoveTodolistAC({todolistId: todolistId1}))
//     //
//     expect(endState.length).toBe(1);
//     expect(endState[0].id).toBe(todolistId2);
// });


// test('correct todolist should be added', () => {

//     let newTodolistTitle = "New TodolistList";

//     const id = v1()
//     const endState = todolistReducer(startState, AddTodolistAC({todolist: {id, title: newTodolistTitle}}))
//     //
//     expect(endState.length).toBe(3);
//     expect(endState[2].title).toBe(newTodolistTitle);
// });

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todolistReducer(startState, ChangeTodolistAC({id: todolistId2, filter: newFilter}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

// test('correct todolist should change its name', () => {
//
//     let newTodolistTitle = "New TodolistList";
//
//     const endState = todolistReducer(startState, EditTodolistAC({id: todolistId2, title: newTodolistTitle}));
//
//     expect(endState[0].title).toBe("What to learn");
//     expect(endState[1].title).toBe(newTodolistTitle);
// });

test('correct entity status of todolist should be changed', () => {
    let newStatus: RequestStatusType = 'loading'

    const action = changeTaskEntityStatusAC({todoListId: todolistId2, taskId: '', entityStatus: newStatus})

    const endState = todolistReducer(startState, action)

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newStatus)
})
