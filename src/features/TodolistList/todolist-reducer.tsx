import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistAPI, TodoListType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {FilterValuesType} from "./TodolistList";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export type TodolistDomainType = TodoListType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []


export const getTodolist = createAsyncThunk(
  "todolist/getTodolist",
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

export const createTodolist = createAsyncThunk(
  "todolist/createTodolist",
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

export const removeTodolist = createAsyncThunk(
  "todolist/removeTodolist",
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

export const changeTodolistTitle = createAsyncThunk(
  "todolist/changeTodolistTitle",
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

export const asyncActions = {
  getTodolist,
  createTodolist,
  removeTodolist,
  changeTodolistTitle
}

export const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    changeTodolistAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
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
      .addCase(getTodolist.fulfilled, (state, action) => {
        return action.payload.todolists.map((el: TodoListType) => ({
          ...el, filter: 'all', entityStatus: 'idle'
        }))
      })
      .addCase(createTodolist.fulfilled, (state, action) => {
        state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.todolistId);
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        state[index].title = action.payload.title
      })

  }
})

export const {
  changeTodolistAC,
  changeTodolistEntityStatusAC
} = slice.actions;

export const todolistReducer = slice.reducer;



