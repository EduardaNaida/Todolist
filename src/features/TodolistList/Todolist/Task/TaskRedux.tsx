import React, {ChangeEvent, FC} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {EditItem} from "../../../../components/EditItem";
import BackspaceIcon from "@material-ui/icons/Backspace";
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {RequestStatusType} from "../../../../app/appReducer";

export type TaskPropsTypeRedux = {
    tasks: TaskType
    todolistId: string
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    entityStatus: RequestStatusType
}
export const TaskRedux: FC<TaskPropsTypeRedux> = ({
                                                      tasks,
                                                      todolistId,
                                                      changeTaskStatus,
                                                      removeTask,
                                                      changeTaskTitle,
                                                      entityStatus
                                                  }) => {



    const onClickHandler = () => removeTask(tasks.id, todolistId)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        changeTaskStatus(tasks.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, todolistId)
    }
    const onTitleChangeHandler = (newTitle: string) => changeTaskTitle(todolistId, tasks.id, newTitle)

    return (
        <div>
            <ListItem
                key={tasks.id}
                style={{
                    padding: '0px',
                    justifyContent: 'space-between',
                    textDecoration: tasks.status ? "line-through" : "none"
                }}
                className={tasks.status === TaskStatuses.Completed ? "isDone" : "notIsDone"}>
                <Checkbox
                    color={'primary'}
                    onChange={onChangeHandler}
                    checked={tasks.status === TaskStatuses.Completed}
                    disabled={entityStatus === 'loading'}
                />
                <EditItem title={tasks.title} callback={onTitleChangeHandler} disabled={entityStatus === 'loading'}/>
                <IconButton size={'small'} onClick={onClickHandler} disabled={entityStatus === 'loading'}>
                    <BackspaceIcon/>
                </IconButton>
            </ListItem>
        </div>
    );
};
