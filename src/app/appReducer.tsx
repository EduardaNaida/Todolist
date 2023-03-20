import {authAPI} from "../api/todolist-api";
import {setIsLoggedInAC} from "../store/authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'loading' as RequestStatusType,
  error: null as null | string,
  isInitialized: false
}

export const initializeApp = createAsyncThunk(
  "app/initializeApp",
  async (payload, {dispatch, rejectWithValue}) => {

    dispatch(setAppStatusAC({value: 'loading'}))
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}));
        dispatch(setAppStatusAC({value: 'succeeded'}))
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue({})
      }
    } catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response ? error.response.data.message : error.message
        handleServerNetworkError(dispatch, err);
        return rejectWithValue({})
      }
      return rejectWithValue({})
    } finally {
      dispatch(setAppStatusAC({value: 'succeeded'}))
    }
  }
);

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ value: RequestStatusType }>) {
      state.status = action.payload.value;
    },
    setAppErrorAC(state, action: PayloadAction<{ value: string | null }>) {
      state.error = action.payload.value;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isInitialized = true;
      })
  }
})

export const {setAppStatusAC, setAppErrorAC} = slice.actions;

export const appReducer = slice.reducer;

