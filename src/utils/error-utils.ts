import { setAppErrorAC, setAppStatusAC } from "../app/appReducer";
import { Dispatch } from "redux";
import { ResponseType } from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(setAppErrorAC({ value: error }));
  dispatch(setAppStatusAC({ value: "failed" }));
};

export const handleServerAppError = <T>(
  dispatch: Dispatch,
  data: ResponseType<T>
) => {
  dispatch(setAppErrorAC({value: data.messages.length ? data.messages[0] : 'Some error'}))
};
