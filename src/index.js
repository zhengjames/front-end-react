import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux"
import store from "./store"
import {Router, Route, IndexRoute, hashHistory } from "react-router"
import TextArea from "./components/TextArea"

ReactDOM.render(
    <div>
  <Provider store={store}>
      <App/>
  </Provider>
    </div>,
  document.getElementById('root')
);
