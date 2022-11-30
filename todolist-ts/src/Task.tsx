import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import {EditItem} from "./components/EditItem";
import BackspaceIcon from "@material-ui/icons/Backspace";
import {TaskType} from "./TodoList";

export type TaskPropsType = {
    tasks: TaskType,
    removeTask: (taskId: string) => void,
    editTask: (taskId: string, newTitle: string) => void,
    changeTaskStatus: (taskId: string, isDone: boolean) => void
}
export const Task = memo(({tasks, removeTask, editTask, changeTaskStatus }: TaskPropsType) => {

    const onClickHandler = () => removeTask(tasks.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(tasks.id, e.currentTarget.checked)
    const onTitleChangeHandler = useCallback((newTitle: string) => editTask( tasks.id, newTitle), [editTask, tasks.id])
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
});
