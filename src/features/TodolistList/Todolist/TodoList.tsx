import React, {useCallback, memo, useEffect} from 'react';
import {Button, IconButton, Typography, PropTypes} from "@material-ui/core";
import BackspaceIcon from '@material-ui/icons/Backspace';
import {EditItem} from "../../../components/EditItem";
import {AddItemForm} from "../../../components/AddItemForm";
import {TaskRedux} from "./Task/TaskRedux";
import {useActions} from "../../../app/store";
import {TaskStatuses} from "../../../api/todolist-api";
import {TaskDomainType} from "./tasks-reducer";
import {RequestStatusType} from "../../../app/appReducer";
import {FilterValuesType} from "../TodolistList";
import {taskActions, todolistActions} from "../index";

type TodoListPropsType = {
  todoListId: string
  title: string
  tasks: Array<TaskDomainType>
  filter: FilterValuesType
  entityStatus: RequestStatusType
}


const TodoList = React.memo(function (props: TodoListPropsType) {

  const {fetchTasks, addTasks, removeTasks} = useActions(taskActions)
  const {changeTodolistAC, removeTodolist, changeTodolistTitle} = useActions(todolistActions)

  useEffect(() => {
    fetchTasks(props.todoListId)
  }, [fetchTasks, props.todoListId])

  let tasks = props.tasks;

  if (props.filter === "completed") {
    tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
  }

  if (props.filter === "active") {
    tasks = tasks.filter(t => t.status === TaskStatuses.New);
  }

  const onAllClickHandler = useCallback(() => changeTodolistAC({filter: "all", id: props.todoListId}), [])
  const onActiveClickHandler = useCallback(() => changeTodolistAC({filter: "active", id: props.todoListId}), [])
  const onCompletedClickHandler = useCallback(() => changeTodolistAC({filter: "completed", id: props.todoListId}), [])


  const removeTodoList = () => removeTodolist({todolistId: props.todoListId})

  const addTaskHandler = useCallback((title: string) => {
    addTasks({title, todolistId: props.todoListId})
  }, [addTasks, props.todoListId])

  const editTodolist = useCallback((title: string) => {
    changeTodolistTitle({todolistId: props.todoListId, title: title})
  }, [changeTodolistTitle, props.todoListId])


  return (
    <div style={{width: '250px'}}>
      <Typography
        variant={'h5'}
        align={'center'}
        style={{fontWeight: 'bold'}}
        color={'primary'}
      >
        <EditItem title={props.title} callback={editTodolist} disabled={props.entityStatus === 'loading'}/>
        <IconButton size={'small'} onClick={removeTodoList} disabled={props.entityStatus === 'loading'}>
          <BackspaceIcon/>
        </IconButton>
      </Typography>

      <AddItemForm addItem={addTaskHandler} disabled={props.entityStatus === 'loading'}/>

      {tasks.map(t => {
        return <TaskRedux todolistId={props.todoListId}
                          key={t.id}
                          tasks={t}
        />

      })}
      <div>
        <ButtonWithMemo
          variant={'contained'}
          color={props.filter === "all" ? "secondary" : 'primary'}
          size={'small'}
          style={{marginRight: '3px'}}
          onClick={onAllClickHandler}
          title={'All'}
        />
        <ButtonWithMemo
          variant={'contained'}
          color={props.filter === "active" ? "secondary" : 'primary'}
          size={'small'}
          style={{marginRight: '3px'}}
          onClick={onActiveClickHandler}
          title={'Active'}
        />
        <ButtonWithMemo
          variant={'contained'}
          color={props.filter === "completed" ? "secondary" : 'primary'}
          size={'small'}
          style={{marginRight: '1px'}}
          onClick={onCompletedClickHandler}
          title={'Completed'}
        />
      </div>
    </div>
  );
});

type ButtonWithMemo = {
  variant: "text" | "outlined" | "contained",
  color: PropTypes.Color,
  style: React.CSSProperties,
  size: "small" | "medium" | "large",
  onClick: () => void,
  title: string
}

const ButtonWithMemo = memo((props: ButtonWithMemo) => {
  return <Button
    variant={props.variant}
    color={props.color}
    style={props.style}
    size={props.size}
    onClick={props.onClick}
  >{props.title}
  </Button>

})
export default TodoList;