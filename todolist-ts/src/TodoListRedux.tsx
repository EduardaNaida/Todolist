import React, {ChangeEvent, FC} from 'react';
import {TodoListType} from "./AppWithRedux";
import {Button, Checkbox, IconButton, List, ListItem, Typography} from "@material-ui/core";
import {EditItem} from "./components/EditItem";
import BackspaceIcon from "@material-ui/icons/Backspace";
import {FilterValuesType} from "./App";
import {Input} from "./components/Input";
import {TaskType} from "./TodoList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";
import {addTaskAC, changeTaskStatusAC, changeTitleAC, removeTaskAC} from "./store/tasks-reducer";
import {ChangeTodolistAC, EditTodolistAC, RemoveTodolistAC} from "./store/todolist-reducer";


export type TodoListReduxPropsType = {
    todolist: TodoListType
}

const TodoListRedux: FC<TodoListReduxPropsType> = ({todolist}) => {

    const {id, title, filter} = todolist;

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id]);

    const dispatch = useDispatch();

    const onAllClickHandler = () => dispatch(ChangeTodolistAC(id, "all"))
    const onActiveClickHandler = () => dispatch(ChangeTodolistAC(id, "active"))
    const onCompletedClickHandler = () => dispatch(ChangeTodolistAC(id, "completed"))
    // const handlerCreator = (filter: FilterValuesType) => () => dispatch(ChangeTodolistAC(id, filter))

    if (filter === "active") {
        tasks = tasks.filter(t => !t.isDone)
    }
    if (filter === "completed") {
        tasks = tasks.filter(t => t.isDone)
    }

    const getTasksListItem = (t: TaskType) => {

        const removeTask = () => dispatch(removeTaskAC(t.id, id))
        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(t.id, e.currentTarget.checked, id))
        const changeItem = (newTitle: string) => dispatch(changeTitleAC(id, t.id, newTitle))
        return (
            <ListItem
                key={t.id}
                style={{
                    padding: '0px',
                    justifyContent: 'space-between',
                    textDecoration: t.isDone ? "line-through" : "none"
                }}
                className={t.isDone ? "isDone" : "notIsDone"}>
                <Checkbox
                    color={'primary'}
                    onChange={changeTaskStatus}
                    // type={"checkbox"}
                    checked={t.isDone}
                />
                {/*<span>{t.title}</span>*/}
                <EditItem title={t.title} callback={changeItem}/>
                <IconButton size={'small'} onClick={removeTask}>
                    <BackspaceIcon/>
                </IconButton>
            </ListItem>
        )
    }

    const tasksList = tasks.length
        ? <List>{tasks.map(getTasksListItem)}</List>
        : <span>Your taskslist is empty :(</span>


    const removeTodoList = () => dispatch(RemoveTodolistAC(id))

    const addTaskHandler = (title: string) => {
        dispatch(addTaskAC(title, id))
    }
    const editTodolist = (title: string) => {
        dispatch(EditTodolistAC(id, title))
    }


    return (
        <div style={{width: '250px'}}>
            <Typography
                variant={'h5'}
                align={'center'}
                style={{fontWeight: 'bold'}}
                color={'primary'}
            >
                <EditItem title={title} callback={editTodolist}/>
                <IconButton size={'small'} onClick={removeTodoList}>
                    <BackspaceIcon/>
                </IconButton>
            </Typography>
            <Input callback={addTaskHandler}/>
            {tasksList}
            <div>
                <Button
                    variant={'contained'}
                    color={filter === "all" ? "secondary" : 'primary'}
                    size={'small'}
                    style={{marginRight: '3px'}}
                    onClick={onAllClickHandler}
                >All
                </Button>
                <Button
                    variant={'contained'}
                    color={filter === "active" ? "secondary" : 'primary'}
                    size={'small'}
                    style={{marginRight: '3px'}}
                    onClick={onActiveClickHandler}
                >Active
                </Button>
                <Button
                    variant={'contained'}
                    color={filter === "completed" ? "secondary" : 'primary'}
                    size={'small'}
                    onClick={onCompletedClickHandler}
                >Completed
                </Button>
            </div>
        </div>
    );
}
export default TodoListRedux;