/**
 * Created by jzheng on 6/15/17.
 */

import {ruleRunner, mustBeCsv} from '../validation/ruleRunner.js'

export default function reducer(state = {
    tickerString: '',
    isValid: false,
    errorText: 'invalid format',
    showErrors: false,
    validationErrors: '',
    fieldValidations: [
        ruleRunner('tickerString', 'tickers', mustBeCsv)
    ]
    }, action) {

    switch (action.type) {
        case 'UPDATE_TICKER_FORM':
            console.log('calling reducer UPDATE_TICKER and received ' + action.payload.tickerString);
            console.log({...state, tickerString:action.payload.tickerString, isValid:action.payload.isValid});

            return {...state, tickerString:action.payload.tickerString, isValid:action.payload.isValid};

        case 'TICKER_VALIDATION_ERROR':
           console.log('calling TICKER_VALIDATION_ERROR' + action.payload.errorText);
           return {...state, showErrors: action.payload.showErrors};
    }
    return state
}
