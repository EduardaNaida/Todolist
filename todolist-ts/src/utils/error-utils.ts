import {AppActionsType, setAppErrorAC, SetAppErrorType, setAppStatusAC} from "../app/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: Dispatch<AppActionsType>, error: string) => {
    dispatch(setAppErrorAC(error))
    dispatch(setAppStatusAC('failed'))
}

export const handleServerAppError = <T>(dispatch: Dispatch<SetAppErrorType>, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error'))
    }
}