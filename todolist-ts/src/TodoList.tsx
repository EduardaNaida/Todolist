import React, {useState, KeyboardEvent, ChangeEvent, useCallback, memo} from 'react';
import {FilterValuesType} from "./App";
import {Input} from "./components/Input";
import {Button, IconButton, List, ListItem, Typography, Checkbox, PropTypes} from "@material-ui/core";
import BackspaceIcon from '@material-ui/icons/Backspace';
import {EditItem} from "./components/EditItem";
import {AddItemForm} from "./components/AddItemForm";
import {ChangeTodolistAC} from "./store/todolist-reducer";
import {Task} from "./Task";
import {TaskRedux} from "./TaskRedux";

type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (taskId: string, todoListId: string) => void
    changeTodoListFilter: (filter: FilterValuesType, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    editTask: (todoListId: string, taskId: string, newTitle: string) => void
    editTodolist: (todoListId: string, newTitle: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


const TodoList = memo((props: TodoListPropsType) => {

    const removeTask = useCallback((taskId: string) => props.removeTask(taskId, props.todoListId),
        [props.removeTask, props.todoListId ])
    const changeTaskStatus = useCallback((taskId: string, status: boolean) => props.changeTaskStatus(taskId, status, props.todoListId),
        [props.changeTaskStatus, props.todoListId])
    const editItem = useCallback((taskId: string, newTitle: string) =>
            props.editTask(props.todoListId, taskId, newTitle),
        [props.editTask, props.todoListId])

    // const getTasksListItem = (t: TaskType) => {
    //     const removeTask = (taskId: string) => props.removeTask(t.id, taskId)
    //     const changeTaskStatus = (taskId: string, status: boolean) => props.changeTaskStatus(taskId, status, props.todoListId)
    //     const editItem = useCallback((taskId: string, newTitle: string) =>
    //         props.editTask(taskId, t.id, newTitle),
    //         [props.editTask, props.todoListId, t.id])
    //     return (
    //         <ListItem
    //             key={t.id}
    //             style={{
    //                 padding: '0px',
    //                 justifyContent: 'space-between',
    //                 textDecoration: t.isDone ? "line-through" : "none"
    //             }}
    //             className={t.isDone ? "isDone" : "notIsDone"}>
    //             <Checkbox
    //                 color={'primary'}
    //                 onChange={changeTaskStatus}
    //                 // type={"checkbox"}
    //                 checked={t.isDone}
    //             />
    //             <EditItem title={t.title} callback={editItem}/>
    //             <IconButton size={'small'} onClick={removeTask}>
    //                 <BackspaceIcon/>
    //             </IconButton>
    //         </ListItem>
    //     )
    // }

    let tasks = props.tasks;

    if (props.filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }

    if (props.filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }

    const onAllClickHandler = useCallback(() => props.changeTodoListFilter("all", props.todoListId), [])
    const onActiveClickHandler = useCallback(() => props.changeTodoListFilter("active", props.todoListId), [])
    const onCompletedClickHandler = useCallback(() => props.changeTodoListFilter("completed", props.todoListId), [])


    // const tasksList = tasks.length
    //     ? <List>{tasks.map(getTasksListItem)}</List>
    //     : <span>Your taskslist is empty :(</span>
    //

    //const handlerCreator = (filter: FilterValuesType) => () => props.changeTodoListFilter(filter, props.todoListId)

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
                <EditItem title={props.title} callback={editTodolist}/>
                <IconButton size={'small'} onClick={removeTodoList}>
                    <BackspaceIcon/>
                </IconButton>
            </Typography>
            {/*<Input callback={addTaskHandler}/>*/}
            <AddItemForm addItem={addTaskHandler}/>

            {tasks.map(t => {
                return <TaskRedux todolistId={props.todoListId}
                                  key={t.id}
                             tasks={t}
                />
                             // editTask={editItem}
                             // changeTaskStatus={changeTaskStatus}
                             // removeTask={removeTask}
            })}
            <div>
                <ButtonWithMemo
                    variant={'contained'}
                    color={props.filter === "all" ? "secondary" : 'primary'}
                    size={'small'}
                    style={{marginRight: '3px'}}
                    //className={props.filter === "all" ? "active-btn btn" : "btn"}
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