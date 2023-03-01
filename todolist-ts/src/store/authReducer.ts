import { Dispatch } from 'redux'
import {AppActionsType, setAppStatusAC} from "../app/appReducer";
import {authAPI, LoginParamsType, TaskType} from "../api/todolist-api";
import {AppDispatchType} from "../app/store";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";

const initialState = {
  isLoggedIn: false,

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

// export const setIsLoggedInAC = (email: string, isAuth: boolean) => ({
//     type: 'login/SET-IS-LOGGED-IN',
//     payload: { email, isAuth}
//   } as const
// )
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

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error)
    })
}


// types
export type SetIsLoggedInType = ReturnType<typeof setIsLoggedInAC>

type ActionsType = SetIsLoggedInType | AppActionsType
