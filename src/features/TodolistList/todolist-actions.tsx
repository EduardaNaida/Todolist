import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../app/appReducer";
import {todolistAPI, TodoListType} from "../../api/todolist-api";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {changeTodolistEntityStatusAC} from "./todolist-reducer";

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