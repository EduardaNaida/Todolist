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

export const initializeAppTC = createAsyncThunk(
  "app/initializeAppTC",
  async (payload, {dispatch, rejectWithValue}) => {

    dispatch(setAppStatusAC({value: 'loading'}))
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}));
        dispatch(setAppStatusAC({value: 'succeeded'}))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    }
    catch (error) {
      if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
        const err = error.response ? error.response.data.message : error.message
        handleServerNetworkError(dispatch, err);
      }
    }
    finally {
      dispatch(setIsInitializedAC({value: true}))
      dispatch(setAppStatusAC({value: 'succeeded'}))
    }
  }
);

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{value: RequestStatusType}>){
      state.status = action.payload.value;
    },
    setAppErrorAC(state, action: PayloadAction<{value: string | null}>) {
      state.error = action.payload.value;
    },
    setIsInitializedAC(state, action: PayloadAction<{value: boolean}>) {
      state.isInitialized = action.payload.value;
    }
  }
})

export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions;

export const appReducer = slice.reducer;

