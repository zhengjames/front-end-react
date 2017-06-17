/**
 * Created by jzheng on 6/15/17.
 */
export default function reducer(state={
    tickerString: '',
    isValid: false
    }, action) {

    switch (action.type) {
        case "UPDATE_TICKER":
            console.log("calling reducer UPDATE_TICKER and received " + action.payload.tickerString);
            console.log({...state, tickerString:action.payload.tickerString, isValid:action.payload.isValid});

            return {...state, tickerString:action.payload.tickerString, isValid:action.payload.isValid}
    }
    return state
}
