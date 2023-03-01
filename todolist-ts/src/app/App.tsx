import React, {useEffect} from 'react';
import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import {AppDispatch, AppRootStateType, UseAppSelector} from "./store";
import TodolistList from "../features/TodolistList/TodolistList";
import {Login} from "../features/Login/Login";
import {ErrorSnackbar} from "../components/ErrorSnackbar";
import {Header} from "../components/Header";
import {CircularProgress, LinearProgress} from "@mui/material";
import {Container} from "@material-ui/core";
import {useSelector} from "react-redux";
import {initializeAppTC} from "./appReducer";
import {logoutTC} from "../store/authReducer";


export const App = () => {

  const status = UseAppSelector(state => state.app.status)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
  const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
  console.log(isInitialized)
  console.log(isLoggedIn)
  const dispatch = AppDispatch();

  useEffect(() => {

    dispatch(initializeAppTC())
  }, [])

  if (!isInitialized) {
    return <div
      style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }

  const logout = () => {
    dispatch(logoutTC())
  }

  return (
    <div className="App">
      <ErrorSnackbar/>
      <Header isAuth={isLoggedIn} name={''} logout={logout}/>
      {status === 'loading' && <LinearProgress color="secondary"/>}
      <Container fixed>
        <Routes>
          <Route path='/' element={<TodolistList/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/404' element={<h1 style={{textAlign: 'center'}}>404: PAGE NOT FOUND</h1>}/>
          <Route path='*' element={<Navigate to={'/404'}/>}/>
        </Routes>
      </Container>
    </div>
  );
}

