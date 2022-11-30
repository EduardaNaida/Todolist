import React, {useCallback} from 'react';
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
    RemoveTodolistAC
} from "./store/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTitleAC, removeTaskAC} from "./store/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";


export type FilterValuesType = "all" | "active" | "completed"

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [todoListId: string]: Array<TaskType>
}


function AppWithRedux() {

    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state =>
        state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state =>
        state.tasks)

    const dispatch = useDispatch();

    //Tasks
    const removeTask = useCallback((taskId: string, todoListId: string) => {

        let action = removeTaskAC(taskId, todoListId)
        dispatch(action)
    }, [dispatch])
    const editTask = useCallback((todoListId: string, taskId: string, newTitle: string) => {

        dispatch(changeTitleAC(todoListId, taskId, newTitle))
    }, [dispatch])

    const addTask = useCallback((title: string, todoListId: string) => {

        dispatch(addTaskAC(title, todoListId))
    }, [dispatch])
    const changeTaskStatus = useCallback((taskId: string, newTaskStatus: boolean, todoListId: string) => {

        dispatch(changeTaskStatusAC(taskId, newTaskStatus, todoListId))
    }, [dispatch])

    //Todolist
    const changeTodoListFilter = useCallback((filter: FilterValuesType, todoListId: string) => {
        dispatch(ChangeTodolistAC(todoListId, filter))
    }, [dispatch])
    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(RemoveTodolistAC(todoListId))
        delete tasks[todoListId]
    }, [dispatch])

    const editTodolist = useCallback((todoListId: string, newTitle: string) => {
        dispatch(EditTodolistAC(todoListId, newTitle))
    }, [dispatch])
    const addTodolist = useCallback((newTitle: string) => {
        const newTodolistId = v1();
        const action = AddTodolistAC(newTodolistId, newTitle)
        dispatch(action)
    }, [dispatch])

    //GUI:


    const todoListComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper style={{width: '250px', padding: '20px'}}>
                    <TodoList
                        // todolist={tl}
                        title={tl.title}
                        filter={tl.filter}
                        todoListId={tl.id}
                        tasks={tasks[tl.id]}

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
                    {/*<AddItemForm addItem={addTodolist}/>*/}
                </Grid>
                <Grid container spacing={5}>
                    {todoListComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;

