import {
  TaskType,
} from "../../../api/todolist-api";
import {RequestStatusType} from "../../../app/appReducer";

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createTodolist, getTodolist, removeTodolist} from "../todolist-actions";
import {addTasks, fetchTasks, removeTasks, updateTask} from "../tasks-actions";

export enum Result_Code {
  SUCCESS = 0,
  ERROR = 1,
  CAPTCHA = 10,
}

export type TaskDomainType = TaskType & {
  entityStatus?: RequestStatusType;
};

export type TasksStateType = {
  [key: string]: TaskDomainType[];
};

const initialState: TasksStateType = {};


export const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeTaskEntityStatusAC(
      state,
      action: PayloadAction<{
        todoListId: string;
        taskId: string;
        entityStatus: RequestStatusType;
      }>
    ) {
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].map((t) =>
          t.id === action.payload.taskId
            ? {...t, entityStatus: action.payload.entityStatus}
            : t
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(getTodolist.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl: any) => {
          state[tl.id] = [];
        });
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTasks.fulfilled, (state, action) => {
        if (action.payload) {
          const tasks = state[action.payload.todolistId];
          const index = tasks.findIndex(
            (task) => task.id === action.payload?.taskId
          );
          if (index > -1) {
            tasks.splice(index, 1);
          }
        }
      })
      .addCase(addTasks.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state[action.payload.todoListId] = state[action.payload.todoListId].map((t) =>
          t.id === action.payload.taskId
            ? {...t, ...action.payload.task}
            : t
        )
      })
  },
});

export const tasksReducer = slice.reducer;
export const {changeTaskEntityStatusAC} = slice.actions;

