import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import {blue, deepPurple, indigo, lightBlue, purple, teal, yellow} from "@material-ui/core/colors";
import AppWithReducer from "./AppWithReducer";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {store} from "./store/store";
import AppWithRedux from "./AppWithRedux";

const theme = createTheme({
    palette: {
        primary: indigo,
        secondary: yellow,
    }
})
ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <AppWithRedux />
        </Provider>
    </ThemeProvider>
   , document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
