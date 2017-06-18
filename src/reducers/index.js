/**
 * Created by jzheng on 6/15/17.
 */
import {combineReducers} from "redux"

import ticker from "./GlobalTabReducer"
import macd from "./MacdReducer"

export default combineReducers({
    ticker,
    macd
})