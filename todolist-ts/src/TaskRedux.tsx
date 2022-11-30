import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import {Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import {EditItem} from "./components/EditItem";
import BackspaceIcon from "@material-ui/icons/Backspace";
import {TaskType} from "./TodoList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";
import {changeTaskStatusAC, changeTitleAC, removeTaskAC} from "./store/tasks-reducer";

export type TaskPropsTypeRedux = {
    tasks: TaskType
    todolistId: string
    // removeTask: (taskId: string) => void
    // editTask: (taskId: string, newTitle: string) => void
    // changeTaskStatus: (taskId: string, isDone: boolean) => void
}
export const TaskRedux : FC<TaskPropsTypeRedux> = ({tasks, todolistId}) => {

    const {id} = tasks;

    //let tasksRedux = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id]);

    const dispatch = useDispatch();

    const onClickHandler = () => dispatch(removeTaskAC(tasks.id, todolistId))
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(tasks.id, e.currentTarget.checked, todolistId))
    const onTitleChangeHandler = (newTitle: string) =>
        dispatch(changeTitleAC(todolistId, tasks.id, newTitle))
    return (
        <div>
            <ListItem
                key={tasks.id}
                style={{
                    padding: '0px',
                    justifyContent: 'space-between',
                    textDecoration: tasks.isDone ? "line-through" : "none"
                }}
                className={tasks.isDone ? "isDone" : "notIsDone"}>
                <Checkbox
                    color={'primary'}
                    onChange={onChangeHandler}
                    // type={"checkbox"}
                    checked={tasks.isDone}
                />
                <EditItem title={tasks.title} callback={onTitleChangeHandler}/>
                <IconButton size={'small'} onClick={onClickHandler}>
                    <BackspaceIcon/>
                </IconButton>
            </ListItem>
        </div>
    );
};
