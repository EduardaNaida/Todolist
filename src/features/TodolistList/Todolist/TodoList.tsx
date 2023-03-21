import React, {useCallback, memo, useEffect} from 'react';
import {Button, IconButton, Typography, PropTypes, Paper} from "@material-ui/core";
import BackspaceIcon from '@material-ui/icons/Backspace';
import {EditItem} from "../../../components/EditItem";
import {AddItemForm} from "../../../components/AddItemForm";
import {TaskRedux} from "./Task/TaskRedux";
import {AppDispatch, useActions} from "../../../app/store";
import {TaskStatuses} from "../../../api/todolist-api";
import {TaskDomainType} from "./tasks-reducer";
import {RequestStatusType} from "../../../app/appReducer";
import {FilterValuesType} from "../TodolistList";
import {taskActions, todolistActions} from "../index";
import {login} from "../../Login/authReducer";

type TodoListPropsType = {
  todoListId: string
  title: string
  tasks: Array<TaskDomainType>
  filter: FilterValuesType
  entityStatus: RequestStatusType
}


const TodoList = React.memo(function (props: TodoListPropsType) {

  const dispatch = AppDispatch();
  const {fetchTasks, addTasks} = useActions(taskActions)
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

  const addTaskHandler = useCallback(async (title: string) => {
    const action = await dispatch(taskActions.addTasks({title, todolistId: props.todoListId}))

    if (taskActions.addTasks.rejected.match(action)) {
      if (action.payload?.fieldsErrors?.length) {
        const error = action.payload?.fieldsErrors[0]
        throw new Error(error.error)
      } else {
        throw new Error(action.payload?.errors[0])
      }
    }
  }, [addTasks, props.todoListId])

  const editTodolist = useCallback((title: string) => {
    changeTodolistTitle({todolistId: props.todoListId, title: title})
  }, [changeTodolistTitle, props.todoListId])


  return (
    <Paper style={{position: 'relative', padding: "20px"}}>
      <IconButton size={'small'} onClick={removeTodoList} disabled={props.entityStatus === 'loading'}
                  style={{position: 'absolute', right: '5px', top: '5px'}}>
        <BackspaceIcon/>
      </IconButton>

      <Typography
        variant={'h5'}
        align={'center'}
        style={{fontWeight: 'bold', marginBottom: '10px'}}
        color={'primary'}
      >
        <EditItem title={props.title} callback={editTodolist} disabled={props.entityStatus === 'loading'}/>
      </Typography>

      <AddItemForm addItem={addTaskHandler} disabled={props.entityStatus === 'loading'}/>

      {tasks.map(t => {
        return <TaskRedux todolistId={props.todoListId}
                          key={t.id}
                          tasks={t}
        />

      })}

        {!tasks.length && <div style={{margin: '15px 0 15px 4px', color: 'grey'}}>No tasks</div>}

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
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
    </Paper>
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