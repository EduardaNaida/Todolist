import React, {useCallback, useEffect} from "react";
import "../../app/App.css";
import { Input } from "../../components/Input";
import { Grid, Paper } from "@material-ui/core";
import {
  ChangeTodolistAC,
  TodolistDomainType,
} from "./todolist-reducer";
import {AppDispatch, AppRootStateType, useActions, UseAppSelector} from "../../app/store";
import TodoList from "./Todolist/TodoList";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {taskActions, todolistActions} from "./index";

export type FilterValuesType = "all" | "active" | "completed";

function TodolistList() {
  const dispatch = AppDispatch();

  const {removeTasks, addTasks} = useActions(taskActions)
  const {removeTodolist, getTodolist, createTodolist, changeTodolistTitle} = useActions(todolistActions)

  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const todoLists = UseAppSelector<Array<TodolistDomainType>>(
    (state) => state.todoLists
  );

  useEffect(() => {
    if (isLoggedIn) {
      getTodolist();
    }
  }, []);

  const tasks = UseAppSelector((state) => state.tasks);

  //Tasks
  const removeTask = useCallback((taskId: string, todolistId: string) => {
    removeTasks({ taskId, todolistId });
  }, []);


  const addTask = useCallback((title: string, todoListId: string) => {
    addTasks({ todolistId: todoListId, title: title });
  }, []);

  //TodolistList
  const changeTodoListFilter = useCallback(
    (filter: FilterValuesType, todoListId: string) => {
      dispatch(ChangeTodolistAC({ id: todoListId, filter }));
    },
    [dispatch]
  );
  const removeTodoList = useCallback(
    (todolistId: string) => {
      removeTodolist({todolistId});
      delete tasks[todolistId];
    },
    []
  );

  const editTodolist = useCallback(
    (todolistId: string, title: string) => {
      changeTodolistTitle({todolistId, title});
    },
    []
  );

  const addTodolist = useCallback(
    (newTitle: string) => {
      createTodolist({title: newTitle});
    },
    []
  );

  //GUI:

  const todoListComponents = todoLists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{ width: "250px", padding: "20px" }}>
          <TodoList
            title={tl.title}
            filter={tl.filter}
            todoListId={tl.id}
            tasks={tasks[tl.id]}
            entityStatus={tl.entityStatus}
            addTask={addTask}
            removeTask={removeTask}
            removeTodoList={removeTodoList}
            changeTodoListFilter={changeTodoListFilter}
            editTodolist={editTodolist}
          />
        </Paper>
      </Grid>
    );
  });

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <Grid container style={{ padding: "20px" }}>
        <Input callback={addTodolist} />
      </Grid>
      <Grid container spacing={5}>
        {todoListComponents}
      </Grid>
    </div>
  );
}

export default TodolistList;
