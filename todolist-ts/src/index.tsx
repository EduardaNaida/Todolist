import React from 'react';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import {indigo, yellow} from "@material-ui/core/colors";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {App} from "./app/App";

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: yellow,
  }
})

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Provider store={store}>
        <App/>
      </Provider>
    </BrowserRouter>
  </ThemeProvider>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
