import React, {useEffect} from 'react';
import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import {AppDispatch} from "./store";
import {TodolistList} from "../features/TodolistList";
import {Login} from "../features/Login";
import {ErrorSnackbar} from "../components/ErrorSnackbar";
import {Header} from "../components/Header";
import {CircularProgress, LinearProgress} from "@mui/material";
import {Container} from "@material-ui/core";
import {useSelector} from "react-redux";
import {initializeApp} from "./appReducer";
import {logoutTC} from "../features/Login/authReducer";
import {authSelector} from "../features/Login";
import {selectIsInitialized, selectStatus} from "./selectors";


export const App = () => {

  const status = useSelector(selectStatus)
  const isLoggedIn = useSelector(authSelector.selectIsLoggedIn)
  const isInitialized = useSelector(selectIsInitialized)

  const dispatch = AppDispatch();

  useEffect(() => {
    dispatch(initializeApp())
  }, [])

  if (!isInitialized) {
    return <div
      style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }

  const logoutHandler = () => {
    dispatch(logoutTC())
  }

  return (
    <div className="App">
      <ErrorSnackbar/>
      <Header isAuth={isLoggedIn} name={''} logout={logoutHandler}/>
      {status === 'loading' && <LinearProgress color="secondary"/>}
      <Container fixed>
        <Routes>
          <Route path='/Todolist/' element={<TodolistList/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/404' element={<h1 style={{textAlign: 'center'}}>404: PAGE NOT FOUND</h1>}/>
          <Route path='*' element={<Navigate to={'/404'}/>}/>
        </Routes>
      </Container>
    </div>
  );
}

