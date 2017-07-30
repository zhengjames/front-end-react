/**
 * Created by jzheng on 7/29/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux"
import store from "./store"

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('screener_app')
);
