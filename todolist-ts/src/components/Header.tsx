import React from 'react';
import {NavLink} from "react-router-dom";
import {Button} from "@mui/material";
import {AppBar, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

type HeaderPropsType = {
  isAuth: boolean,
  name: string
  logout: () => void
}
export const Header = (props: HeaderPropsType) => {

  return (
    <AppBar position="static">
      <Toolbar style={{justifyContent: "space-between"}}>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu/>
        </IconButton>
        <Typography variant="h6">
          Todolists
        </Typography>
        {props.isAuth
                 ? <div> {props.name} <Button style={{color: 'white'}} onClick={props.logout}>Log out</Button></div>
                : <NavLink to={'/login'}>Login</NavLink>}
        {/*<Button color="inherit" variant={"outlined"}>Login</Button>*/}
      </Toolbar>
    </AppBar>
    // <header className={s.header}>
    //   <div className={s.loginBlock}>
    //     {props.isAuth
    //       ? <div className={s.itemBlock}> {props.login} <Button onClick={props.logout}>Log out</Button></div>
    //       : <NavLink to={'/login'}>Login</NavLink>}
    //   </div>
    // </header>
  );
};
