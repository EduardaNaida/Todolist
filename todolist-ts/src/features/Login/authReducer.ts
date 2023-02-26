import { Dispatch } from 'redux'
import {AppActionsType, setAppStatusAC} from "../../app/appReducer";
import {authAPI, LoginParamsType} from "../../api/todolist-api";
import {AppDispatchType} from "../../app/store";

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
  //dispatch(setAppStatusAC('loading'))

  try {
    console.log(data)
    const response = await authAPI.login(data);
    console.log(response)
     if (response.data.resultCode === 0 ) {
       dispatch(setAppStatusAC('succeeded'))
     }
  }
  catch (e){

  }
  //dispatch(setAppStatusAC('loading'))
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppActionsType
