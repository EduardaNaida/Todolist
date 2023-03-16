import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import {Dispatch} from "redux";
import {taskAPI, todolistAPI, TodoListType} from "../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "../app/appReducer";
import {FilterValuesType} from "../features/TodolistList/TodolistList";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type TodolistDomainType = TodoListType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []


export const getTodosThunk = createAsyncThunk(
  "todolist/getTodosThunk",
  async (payload, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({value: 'loading'}))

    try {
      dispatch(setAppStatusAC({value: 'loading'}))
      const response = await todolistAPI.getTodolist();

      return {todolists: response.data};
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
      dispatch(setAppStatusAC({value: 'succeeded'}))
    }
  }
);

export const createTodosThunk = createAsyncThunk(
  "todolist/createTodosThunk",
  async (payload: { title: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({value: 'loading'}))

    try {
      dispatch(setAppStatusAC({value: 'loading'}))
      const response = await todolistAPI.createTodolist(payload.title);
      if (response.data.resultCode === 0) {
        const item = response.data.data.item
        dispatch(setAppStatusAC({value: 'succeeded'}))
        // dispatch(AddTodolistAC({todolist: item}))
        return {todolist: item}
      } else {
        handleServerAppError<{ item: TodoListType }>(dispatch, response.data)
        dispatch(setAppStatusAC({value: 'failed'}))
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
      dispatch(setAppStatusAC({value: 'succeeded'}))
    }
  }
);

export const removeTodosThunk = createAsyncThunk(
  "todolist/removeTodosThunk",
  async (payload: { todolistId: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: payload.todolistId, status: 'loading'}))

    try {
      dispatch(setAppStatusAC({value: 'loading'}))
      const response = await todolistAPI.deleteTodolist(payload.todolistId);
      dispatch(setAppStatusAC({value: 'succeeded'}))
      return {todolistId: payload.todolistId}
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
      dispatch(setAppStatusAC({value: 'succeeded'}))
    }
  }
);

export const changeTodosTitleThunk = createAsyncThunk(
  "todolist/changeTodosTitleThunk",
  async (payload: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({value: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: payload.todolistId, status: 'loading'}))

    try {
      dispatch(setAppStatusAC({value: 'loading'}))
      const response = await todolistAPI.updateTodolist(payload.todolistId, payload.title);
      dispatch(setAppStatusAC({value: 'succeeded'}))
      dispatch(changeTodolistEntityStatusAC({id: payload.todolistId, status: 'succeeded'}))
      return {id: payload.todolistId, title: payload.title}
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
      dispatch(setAppStatusAC({value: 'succeeded'}))
    }
  }
);

const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    ChangeTodolistAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodosThunk.fulfilled, (state, action) => {
        return action.payload.todolists.map((el: TodoListType) => ({
          ...el, filter: 'all', entityStatus: 'idle'
        }))
      })
      .addCase(createTodosThunk.fulfilled, (state, action) => {
        state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
      })
      .addCase(removeTodosThunk.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.todolistId);
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(changeTodosTitleThunk.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        state[index].title = action.payload.title
      })

  }
})

export const {
  ChangeTodolistAC,
  changeTodolistEntityStatusAC
} = slice.actions;

export const todolistReducer = slice.reducer;



