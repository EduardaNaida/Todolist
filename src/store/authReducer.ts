import { Dispatch } from "redux";
import { setAppStatusAC } from "../app/appReducer";
import { authAPI, LoginParamsType } from "../api/todolist-api";
import { AppDispatchType } from "../app/store";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import axios, { AxiosError } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;
// actions

//thunks
export const loginTC =
  (data: LoginParamsType) => async (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC({ value: "loading" }));

    try {
      const response = await authAPI.login(data);
      if (response.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }));
        dispatch(setAppStatusAC({ value: "succeeded" }));
      } else {
        handleServerAppError<{ userId: number }>(dispatch, response.data);
        dispatch(setAppStatusAC({ value: "failed" }));
      }
    } catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response
          ? error.response.data.message
          : error.message;
        handleServerNetworkError(dispatch, err);
      }
    }
  };

export const logoutTC = () => (dispatch: AppDispatchType) => {
  dispatch(setAppStatusAC({ value: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: false }));
        dispatch(setAppStatusAC({ value: "succeeded" }));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error);
    });
};
