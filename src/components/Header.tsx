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
          : <NavLink to={'/login'} style={{color: 'white', textDecoration: 'none'}}>LOGIN</NavLink>}
      </Toolbar>
    </AppBar>
  );
};
