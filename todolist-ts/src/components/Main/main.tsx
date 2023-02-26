import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {AppRootStateType} from "../../app/store";
import {Login} from "../../features/Login/Login";
import AppWithRedux from "../../app/AppWithRedux";
import {useSelector} from "react-redux";


export const Main = () => {
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
  return (
    <div>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path={'/Todolist'} element={<AppWithRedux />} />
            {/*<Route path="/login" element={<Navigate to="/Todolist" replace />} />*/}
            {/*<Route path="*" element={<Navigate to="/Todolist" replace />} />*/}
          </>
        ) : (
          <>
            <Route path={'/login'} element={<Login />} />
            {/*<Route path="*" element={<Navigate to="/login" replace />} />*/}
          </>
        )}
      </Routes>
    </div>
  )
}
