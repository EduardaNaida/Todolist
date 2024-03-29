import React, {useEffect} from "react";
import "../../app/App.css";
import {Input} from "../../components/Input";
import {Grid, Paper} from "@material-ui/core";
import {
  TodolistDomainType,
} from "./todolist-reducer";
import {AppRootStateType, useActions, UseAppSelector} from "../../app/store";
import {TodoList} from "./Todolist/";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {todolistActions} from "./index";

export type FilterValuesType = "all" | "active" | "completed";

function TodolistList() {

  const {
    getTodolist,
    createTodolist,
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
  }, [getTodolist]);

  const tasks = UseAppSelector((state) => state.tasks);

  const todoListComponents = todoLists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <div style={{width: "300px"}}>
          <TodoList
            title={tl.title}
            filter={tl.filter}
            todoListId={tl.id}
            tasks={tasks[tl.id]}
            entityStatus={tl.entityStatus}
          />
        </div>
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
      <Grid container spacing={5} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
        {todoListComponents}
      </Grid>
    </div>
  );
}

export default TodolistList;
