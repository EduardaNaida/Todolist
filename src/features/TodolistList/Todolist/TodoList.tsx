import React, {useCallback, memo, useEffect} from 'react';
import {Button, IconButton, Typography, PropTypes} from "@material-ui/core";
import BackspaceIcon from '@material-ui/icons/Backspace';
import {EditItem} from "../../../components/EditItem";
import {AddItemForm} from "../../../components/AddItemForm";
import {TaskRedux} from "./Task/TaskRedux";
import {AppDispatch, UseAppSelector} from "../../../app/store";
import {TaskStatuses} from "../../../api/todolist-api";
import {fetchTasksThunk, TaskDomainType, TasksStateType} from "../../../store/tasks-reducer";
import {RequestStatusType} from "../../../app/appReducer";
import {FilterValuesType} from "../TodolistList";

type TodoListPropsType = {
  todoListId: string
  title: string
  tasks: Array<TaskDomainType>
  filter: FilterValuesType
  removeTask: (taskId: string, todoListId: string) => void
  changeTodoListFilter: (filter: FilterValuesType, todoListId: string) => void
  addTask: (title: string, todoListId: string) => void
  removeTodoList: (todoListId: string) => void
  editTodolist: (todoListId: string, newTitle: string) => void
  entityStatus: RequestStatusType
}


const TodoList = React.memo(function (props: TodoListPropsType) {

  const dispatch = AppDispatch();


  useEffect(() => {
    dispatch(fetchTasksThunk(props.todoListId))
  }, [fetchTasksThunk, props.todoListId])

  let tasks = props.tasks;

  if (props.filter === "completed") {
    tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
  }

  if (props.filter === "active") {
    tasks = tasks.filter(t => t.status === TaskStatuses.New);
  }

  const onAllClickHandler = useCallback(() => props.changeTodoListFilter("all", props.todoListId), [])
  const onActiveClickHandler = useCallback(() => props.changeTodoListFilter("active", props.todoListId), [])
  const onCompletedClickHandler = useCallback(() => props.changeTodoListFilter("completed", props.todoListId), [])


  const removeTodoList = () => props.removeTodoList(props.todoListId)

  const addTaskHandler = useCallback((title: string) => {
    props.addTask(title, props.todoListId)
  }, [props.addTask, props.todoListId])

  const editTodolist = useCallback((title: string) => {
    props.editTodolist(props.todoListId, title)
  }, [props.editTodolist, props.todoListId])



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
                          removeTask={props.removeTask}
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