import {authAPI} from "../api/todolist-api";
import {AppDispatchType} from "./store";
import {setIsLoggedInAC, SetIsLoggedInType} from "../store/authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'loading' as RequestStatusType,
  error: null as null | string,
  isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    case "APP/SET-ERROR":
      return {...state, error: action.error}
    case "APP/SET-INITIALIZED":
      return {...state, isInitialized: action.value}
    default:
      return state
  }
}
export const setAppStatusAC = (status: RequestStatusType) => {
  return {type: 'APP/SET-STATUS', status} as const
}

export const setAppErrorAC = (error: string | null) => {
  return {type: 'APP/SET-ERROR', error} as const
}

const setIsInitializedAC = (value: boolean) => {
  return {type: 'APP/SET-INITIALIZED', value} as const
}

export const initializeAppTC = () => async (dispatch: AppDispatchType) => {
  dispatch(setAppStatusAC('loading'))
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
      dispatch(setAppStatusAC('succeeded'))
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
    dispatch(setIsInitializedAC(true))
    dispatch(setAppStatusAC('succeeded'))
  }
}


export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type SetInitializedType = ReturnType<typeof setIsInitializedAC>

export type AppActionsType = SetAppStatusType | SetAppErrorType | SetInitializedType | SetIsLoggedInType
