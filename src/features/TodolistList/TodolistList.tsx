import React, {useCallback, useEffect} from "react";
import "../../app/App.css";
import {Input} from "../../components/Input";
import {Grid, Paper} from "@material-ui/core";
import {
  TodolistDomainType,
} from "./todolist-reducer";
import {AppRootStateType, useActions, UseAppSelector} from "../../app/store";
import TodoList from "./Todolist/TodoList";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {taskActions, todolistActions} from "./index";

export type FilterValuesType = "all" | "active" | "completed";

function TodolistList() {

  const {removeTasks, addTasks} = useActions(taskActions)
  const {
    removeTodolist,
    getTodolist,
    createTodolist,
    changeTodolistTitle,
    changeTodolistAC
  } = useActions(todolistActions)

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

  const changeTodoListFilter = useCallback(
    (filter: FilterValuesType, todoListId: string) => {
      changeTodolistAC({id: todoListId, filter});
    },
    []
  );


  const todoListComponents = todoLists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{width: "250px", padding: "20px"}}>
          <TodoList
            title={tl.title}
            filter={tl.filter}
            todoListId={tl.id}
            tasks={tasks[tl.id]}
            entityStatus={tl.entityStatus}
            addTask={addTasks}
            removeTask={removeTasks}
            removeTodoList={removeTodolist}
            changeTodoListFilter={changeTodoListFilter}
            editTodolist={changeTodolistTitle}
          />
        </Paper>
      </Grid>
    );
  });

  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>;
  }

  return (
    <div>
      <Grid container style={{padding: "20px"}}>
        <Input callback={createTodolist}/>
      </Grid>
      <Grid container spacing={5}>
        {todoListComponents}
      </Grid>
    </div>
  );
}

export default TodolistList;
