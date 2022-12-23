import {v1} from "uuid";

import {
    AddTodolistAC,
    ChangeTodolistAC,
    EditTodolistAC,
    RemoveTodolistAC,
    TodolistDomainType,
    todolistReducer
} from "./todolist-reducer";
import {FilterValuesType} from "../AppWithRedux";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType>;

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 1},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 2}
    ]
})

test('correct todolist should be removed', () => {

    //
    const endState = todolistReducer(startState, RemoveTodolistAC(todolistId1))
    //
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

/*
test('correct todolist should be added', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todolistReducer(startState, AddTodolistAC(v1(), newTodolistTitle))
    //
    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});
*/

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todolistReducer(startState, ChangeTodolistAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todolistReducer(startState, EditTodolistAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});