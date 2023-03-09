import React, {useCallback, useEffect} from 'react';
import '../../app/App.css';
import {Input} from "../../components/Input";
import {Grid, Paper} from "@material-ui/core";
import {
  ChangeTodolistAC, changeTodosTitleThunk, createTodosThunk, getTodosThunk, removeTodosThunk, TodolistDomainType,
} from "../../store/todolist-reducer";
import {
  addTaskThunk,
  removeTasksThunk, TasksStateType,
  updateTaskThunk
} from "../../store/tasks-reducer";
import {AppDispatch, AppRootStateType, UseAppSelector} from "../../app/store";
import {TaskStatuses} from "../../api/todolist-api";
import TodoList from "./Todolist/TodoList";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";


export type FilterValuesType = "all" | "active" | "completed"


function TodolistList() {

  const dispatch = AppDispatch();

  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getTodosThunk())
    }
  }, [])

  const todoLists = UseAppSelector<Array<TodolistDomainType>>(state =>
    state.todoLists)
  const tasks = UseAppSelector<TasksStateType>(state =>
    state.tasks)


  //Tasks
  const removeTask = useCallback((taskId: string, todoListId: string) => {
    dispatch(removeTasksThunk(taskId, todoListId))
  }, [])
  const editTask = useCallback((todoListId: string, taskId: string, newTitle: string) => {
    dispatch(updateTaskThunk(todoListId, taskId, {title: newTitle}))
  }, [])

  const addTask = useCallback((title: string, todoListId: string) => {
    dispatch(addTaskThunk(todoListId, title))
  }, [])
  const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
    dispatch(updateTaskThunk(todoListId, taskId, {status}))
  }, [])

  //TodolistList
  const changeTodoListFilter = useCallback((filter: FilterValuesType, todoListId: string) => {
    dispatch(ChangeTodolistAC({id: todoListId, filter}))
  }, [dispatch])
  const removeTodoList = useCallback((todoListId: string) => {
    dispatch(removeTodosThunk(todoListId))
    delete tasks[todoListId]
  }, [dispatch])

  const editTodolist = useCallback((todoListId: string, newTitle: string) => {
    dispatch(changeTodosTitleThunk(todoListId, newTitle))
  }, [dispatch])

  const addTodolist = useCallback((newTitle: string) => {
    dispatch(createTodosThunk(newTitle))
  }, [dispatch])

  //GUI:


  const todoListComponents = todoLists.map(tl => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{width: '250px', padding: '20px'}}>
          <TodoList
            title={tl.title}
            filter={tl.filter}
            todoListId={tl.id}
            tasks={tasks[tl.id]}
            entityStatus={tl.entityStatus}
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

  if (!isLoggedIn) {
    return <Navigate to={'/login'}/>
  }

  return (
    <div>
      <Grid container style={{padding: '20px'}}>
        <Input callback={addTodolist}/>
      </Grid>
      <Grid container spacing={5}>
        {todoListComponents}
      </Grid>
    </div>
  );
}

export default TodolistList;

