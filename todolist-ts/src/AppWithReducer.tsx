import React, {Reducer, useReducer} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";
import {Input} from "./components/Input";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeTodolistAC,
    EditTodolistAC,
    RemoveTodolistAC, TodolistActionType,
    todolistReducer
} from "./store/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTitleAC, removeTaskAC, tasksReducer} from "./store/tasks-reducer";


export type FilterValuesType = "all" | "active" | "completed"

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [todoListId: string]: Array<TaskType>
}


function AppWithReducer() {
    // BLL:
    const todoListId_1 = v1()
    const todoListId_2 = v1()

    const [todoLists, dispatchTodoLists] = useReducer<Reducer<TodoListType[], TodolistActionType>>(todolistReducer,[
        {id: todoListId_1, title: "What to learn", filter: "all"},
        {id: todoListId_2, title: "What to buy", filter: "all"},
    ])
    const [tasks, dispatchTasks] = useReducer(tasksReducer,{
        [todoListId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS/TS", isDone: true},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Redux", isDone: false},
            {id: v1(), title: "RTK", isDone: false},
        ],
        [todoListId_2]: [
            {id: v1(), title: "Water", isDone: true},
            {id: v1(), title: "Beer", isDone: true},
            {id: v1(), title: "Toilet paper", isDone: false},
            {id: v1(), title: "Buckwheat", isDone: false},
            {id: v1(), title: "Meet", isDone: false},
        ]
    })

    //Tasks
    const removeTask = (taskId: string, todoListId: string) => {

        let action = removeTaskAC(taskId, todoListId)
        dispatchTasks(action)
    }
    const editTask = (todoListId: string, taskId: string, newTitle: string) => {

        dispatchTasks(changeTitleAC(todoListId, taskId, newTitle))
    }

    const addTask = (title: string, todoListId: string) => {

        dispatchTasks(addTaskAC(title, todoListId))
    }
    const changeTaskStatus = (taskId: string, newTaskStatus: boolean, todoListId: string) => {

        dispatchTasks(changeTaskStatusAC(taskId, newTaskStatus, todoListId))
    }

    //Todolist
    const changeTodoListFilter = (filter: FilterValuesType, todoListId: string) => {
        dispatchTodoLists(ChangeTodolistAC(todoListId, filter))
    }
    const removeTodoList = (todoListId: string) => {
        dispatchTodoLists(RemoveTodolistAC(todoListId))
        delete tasks[todoListId]
    }

    const editTodolist = (todoListId: string, newTitle: string) => {
        // setTodoLists(todoLists.map(t => t.id === todoListId
        //     ? {...t, title: newTitle}
        //     : t))
        dispatchTodoLists(EditTodolistAC(todoListId, newTitle))
    }
    const addTodolist = (newTitle: string) => {
        const newTodolistId = v1();
        const action = AddTodolistAC(newTodolistId, newTitle)
        dispatchTasks(action)
        dispatchTodoLists(action)
    }

    //GUI:
    const getFilteredTasks = (t: Array<TaskType>, f: FilterValuesType) => {
        let tasksForTodoList = t;
        if (f === "active") {
            tasksForTodoList = t.filter(t => !t.isDone)
        }
        if (f === "completed") {
            tasksForTodoList = t.filter(t => t.isDone)
        }
        return tasksForTodoList
    }

    const todoListComponents = todoLists.map(tl => {
        const filteredTasks = getFilteredTasks(tasks[tl.id], tl.filter)
        return (
            <Grid item key={tl.id}>
                <Paper style={{width: '250px', padding: '20px'}}>
                    <TodoList
                        title={tl.title}
                        filter={tl.filter}
                        todoListId={tl.id}
                        tasks={filteredTasks}

                        addTask={addTask}
                        removeTask={removeTask}
                        removeTodoList={removeTodoList}
                        changeTaskStatus={changeTaskStatus}
                        changeTodoListFilter={changeTodoListFilter}
                        editTask={editTask}
                        editTodolist={editTodolist}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <Input callback={addTodolist}/>

                </Grid>
                <Grid container spacing={5}>
                    {todoListComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducer;

