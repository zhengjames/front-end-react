/**
 *
 * Created by jzheng on 6/15/17.
 */

export function updateTickers(payload) {
    console.log("updateTickers received" + payload.tickerString);
    return {
        type : 'UPDATE_TICKER',
        payload: payload,
    }
}