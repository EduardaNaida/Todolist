import {setAppStatusAC} from "../app/appReducer";
import {authAPI, LoginParamsType} from "../api/todolist-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

export const loginTC = createAsyncThunk(
  "auth/loginTC",
  async (data: LoginParamsType, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({value: "loading"}));

    try {
      const response = await authAPI.login(data);
      if (response.data.resultCode === 0) {
        dispatch(setAppStatusAC({value: "succeeded"}));
        return {value: true}
      } else {
        handleServerAppError<{ userId: number }>(dispatch, response.data);
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
    }
  })

export const logoutTC = createAsyncThunk(
  "auth/logoutTC",
  async (payload, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({value: "loading"}));

    try {
      const response = await authAPI.logout();
      if (response.data.resultCode === 0) {
        dispatch(setAppStatusAC({value: "succeeded"}));
        return {value: false}
      } else {
        handleServerAppError(dispatch, response.data);
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
    }
  })


const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.value;
      })
      .addCase(logoutTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.value;
      })
  }
});

export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;
