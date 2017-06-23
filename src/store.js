/**
 * Created by jzheng on 6/15/17.
 */
import {applyMiddleware, createStore} from "redux"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducer from "./reducers"
// const middleware = applyMiddleware(promise(), thunk, logger())
const logger = (store) => (next) => (action) => {
    console.log("action fired", action);
    next(action);
};
const middleware = applyMiddleware(logger);
const store = createStore(reducer, middleware);
store.subscribe(() => {
    console.log("store changed", store.getState());
});
export default store