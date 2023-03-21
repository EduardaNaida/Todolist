import {setAppStatusAC} from "../../app/appReducer";
import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolist-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


export const login = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>(
  "auth/login",
  async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({value: "loading"}));

    try {
      const response = await authAPI.login(data);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({value: "succeeded"}));
        return;
      } else {
        handleServerAppError<{ userId: number }>(thunkAPI.dispatch, response.data);
        thunkAPI.dispatch(setAppStatusAC({value: "failed"}));
        console.log(response.data.fieldsErrors)
        return thunkAPI.rejectWithValue({errors: response.data.messages, fieldsErrors: response.data.fieldsErrors})
      }
    } catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response
          ? error.response.data.message
          : error.message;
        handleServerNetworkError(thunkAPI.dispatch, err);
        return thunkAPI.rejectWithValue({errors: [err], fieldsErrors: undefined})
      } else {
        return thunkAPI.rejectWithValue({errors: ['error'], fieldsErrors: undefined})
      }
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
        return;
      } else {
        handleServerAppError(dispatch, response.data);
        return rejectWithValue({})
      }
    } catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response
          ? error.response.data.message
          : error.message;
        handleServerNetworkError(dispatch, err);
        return rejectWithValue({})
      }
      return rejectWithValue({})
    }
  })

export const asyncActions = {
  login,
  logoutTC
}
export const slice = createSlice({
  name: "auth",
  initialState: {isLoggedIn: false},
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logoutTC.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
  }
});

export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;
