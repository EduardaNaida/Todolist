import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {EditItem} from "../../../../components/EditItem";
import BackspaceIcon from "@material-ui/icons/Backspace";
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {useActions} from "../../../../app/store";
import {taskActions} from "../../index";

export type TaskPropsTypeRedux = {
  tasks: TaskType
  todolistId: string

}
export const TaskRedux: FC<TaskPropsTypeRedux> = ({
                                                    tasks,
                                                    todolistId,
                                                  }) => {


  const {entityStatus} = tasks;

  const {updateTask, removeTasks} = useActions(taskActions)

  const onClickHandler = () => removeTasks({taskId: tasks.id, todolistId})

  const editTask = useCallback(
    (newTitle: string) => {
      const newTask = {...tasks, title: newTitle};
      updateTask(newTask);
    },
    [updateTask, tasks]
  );
  const changeTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {

      const newTask = {
        ...tasks,
        status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New,
      };

      updateTask(newTask);
    },
    [updateTask, tasks]
  );
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
          onChange={changeTaskStatus}
          checked={tasks.status === TaskStatuses.Completed}
          disabled={entityStatus === 'loading'}
        />
        <EditItem title={tasks.title} callback={editTask} disabled={entityStatus === 'loading'}/>
        <IconButton size={'small'} onClick={onClickHandler} disabled={entityStatus === 'loading'}>
          <BackspaceIcon/>
        </IconButton>
      </ListItem>
    </div>
  );
};
