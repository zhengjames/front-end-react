/**
 *
 * Created by jzheng on 6/15/17.
 */

export function updateTickers(payload) {
    console.log("updateTickers received" + payload);
    return {
        type : 'UPDATE_TICKER_FORM',
        payload: payload
    }
}

export function updateMacd(payload) {
    console.log("calling updateMacd");
    return {
        type : 'MACD_UPDATE_ALL',
        payload: payload
    }
}

export function updateStochastic(payload) {
    console.log("calling updateStochastic");
    return {
        type: 'STOCHASTIC_UPDATE_ALL',
        payload: payload
    }
}

export function updateMacdToggleOnOff(payload) {
    console.log("calling macdToggleOnOff ", payload);
    return {
        type : 'MACD_TOGGLE_ON_OFF',
        payload: payload
    }
}

export function updateStochasticToggleOnOff(payload) {
    console.log("calling stochasticToggleOnOff", payload);
    return {
        type : 'STOCHASTIC_TOGGLE_ON_OFF',
        payload: payload
    }
}