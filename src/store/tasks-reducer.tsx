import {
  taskAPI,
  TaskType,
  UpdateTaskModelType,
} from "../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "../app/appReducer";
import axios, {AxiosError} from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import {
  createTodolist, getTodolist, removeTodolist,
} from "./todolist-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

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

export const fetchTasksThunk = createAsyncThunk(
  "tasks/fetchTasksThunk",
  async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({value: "loading"}));

    try {
      const response = await taskAPI.getTask(todolistId)
      dispatch(setAppStatusAC({value: "succeeded"}));
      return {tasks: response.data.items, todolistId};
    } catch (e) {
      return rejectWithValue(null)
    } finally {
      dispatch(setAppStatusAC({value: "succeeded"}));
    }
  }
);

export const removeTasksThunk = createAsyncThunk(
  "tasks/removeTasksThunk",
  async (payload: { taskId: string; todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({value: "loading"}));
    thunkAPI.dispatch(
      changeTaskEntityStatusAC({
        todoListId: payload.todolistId,
        taskId: payload.taskId,
        entityStatus: "loading",
      })
    );
    try {
      const response = await taskAPI.deleteTask(
        payload.todolistId,
        payload.taskId
      );
      if (response.data.resultCode === Result_Code.SUCCESS) {
        thunkAPI.dispatch(setAppStatusAC({value: "succeeded"}));
        return {taskId: payload.taskId, todolistId: payload.todolistId};
      }
    } catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response
          ? error.response.data.message
          : error.message;
        handleServerNetworkError(thunkAPI.dispatch, err);
        return thunkAPI.rejectWithValue(null)
      }
      return thunkAPI.rejectWithValue(null)
    } finally {
      thunkAPI.dispatch(
        changeTaskEntityStatusAC({
          todoListId: payload.todolistId,
          taskId: payload.taskId,
          entityStatus: "succeeded",
        })
      );
    }
  }
);

export const addTaskThunk = createAsyncThunk(
  "tasks/addTaskThunk",
  async (payload: { todolistId: string; title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({value: "loading"}));

    try {
      const res = await taskAPI.createTask(payload.todolistId, payload.title);
      if (res.data.resultCode === Result_Code.SUCCESS) {
        thunkAPI.dispatch(setAppStatusAC({value: "succeeded"}));
        //return {task: {...res.data.data.item}, entityStatus: 'succeeded'};
        return res.data.data.item
      } else {
        handleServerAppError<{ item: TaskType }>(thunkAPI.dispatch, res.data);
        thunkAPI.dispatch(setAppStatusAC({value: "failed"}));
        return thunkAPI.rejectWithValue(null)
      }
    } catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response
          ? error.response.data.message
          : error.message;
        handleServerNetworkError(thunkAPI.dispatch, err);
        return thunkAPI.rejectWithValue(null)
      }
      return thunkAPI.rejectWithValue(null)
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  "tasks/updateTaskThunk",
  async (payload: TaskType, {dispatch, rejectWithValue}) => {

    const model: UpdateTaskModelType = {
      title: payload.title,
      description: payload.description,
      deadline: payload.deadline,
      startDate: payload.startDate,
      priority: payload.priority,
      status: payload.status,
    };
    try {
      dispatch(setAppStatusAC({value: "loading"}));
      const response = await taskAPI.updateTask(payload.todoListId, payload.id, model)

      if (response.data.resultCode === Result_Code.SUCCESS) {
        dispatch(setAppStatusAC({value: "succeeded"}));
        return {taskId: payload.id, task: model, todoListId: payload.todoListId};

      } else {
        handleServerAppError<{ item: TaskType }>(dispatch, response.data);
        dispatch(setAppStatusAC({value: "failed"}));
        return rejectWithValue(null)
      }
    } catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response
          ? error.response.data.message
          : error.message;
        handleServerNetworkError(dispatch, err);
        return rejectWithValue(null)
      }
      return rejectWithValue(null)
    } finally {
      dispatch(setAppStatusAC({value: "succeeded"}))
    }
  }
);
const slice = createSlice({
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
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTasksThunk.fulfilled, (state, action) => {
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
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload)
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
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

