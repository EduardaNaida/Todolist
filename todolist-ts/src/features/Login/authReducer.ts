import { Dispatch } from 'redux'
import {AppActionsType, setAppStatusAC} from "../../app/appReducer";
import {authAPI, LoginParamsType, TaskType} from "../../api/todolist-api";
import {AppDispatchType} from "../../app/store";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";

const initialState = {
  isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return {...state, isLoggedIn: action.value}
    default:
      return state
  }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => async (dispatch: AppDispatchType) => {
  dispatch(setAppStatusAC('loading'))

  try {
    const response = await authAPI.login(data);
     if (response.data.resultCode === 0 ) {
       dispatch(setIsLoggedInAC(true))
       dispatch(setAppStatusAC('succeeded'))
     } else {
       handleServerAppError<{ userId: number }>(dispatch, response.data)
       dispatch(setAppStatusAC('failed'))
     }
  }
  catch (error){
    if (axios.isAxiosError<AxiosError<{ message: string }>>(error)) {
      const err = error.response ? error.response.data.message : error.message
      handleServerNetworkError(dispatch, err);
    }
  }

}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppActionsType
