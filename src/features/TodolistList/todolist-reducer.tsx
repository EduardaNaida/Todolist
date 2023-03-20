import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TodoListType} from "../../api/todolist-api";
import {RequestStatusType} from "../../app/appReducer";
import {FilterValuesType} from "./TodolistList";
import {changeTodolistTitle, createTodolist, getTodolist, removeTodolist} from "./todolist-actions";

export type TodolistDomainType = TodoListType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []


export const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    changeTodolistAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodolist.fulfilled, (state, action) => {
        return action.payload.todolists.map((el: TodoListType) => ({
          ...el, filter: 'all', entityStatus: 'idle'
        }))
      })
      .addCase(createTodolist.fulfilled, (state, action) => {
        state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.todolistId);
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        state[index].title = action.payload.title
      })

  }
})

export const {
  changeTodolistAC,
  changeTodolistEntityStatusAC
} = slice.actions;

export const todolistReducer = slice.reducer;



