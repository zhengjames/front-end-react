/**
 * Created by jzheng on 6/17/17.
 */

import {ruleRunner, required} from '../validation/ruleRunner.js'
import update from 'immutability-helper'

export default function reducer(state = {
        isEnabled: true,
        isValid: false,
        triggerTypeSelected: '',
        triggerDirectionSelected: '',
        triggerWithinDaysInput: '',
        showErrors: false,
        validationErrors: {},
        fieldValidations: [
            ruleRunner("triggerTypeSelected", "triggerType", required),
            ruleRunner("triggerDirectionSelected", "triggerDirection", required),
            ruleRunner("triggerWithinDaysInput", "triggerWithinDays", required)
        ]
}, action) {
    var payload = action.payload;
    switch(action.type) {
        case "MACD_UPDATE_ALL":
            var newState = update(state, {$merge: payload});
            return newState;

        case 'MACD_TOGGLE_ON_OFF':
            console.log("new state is ", {...state, isEnabled:action.payload});
            return {...state, isEnabled:action.payload};

        case 'MACD_VALIDATION_ERROR':
            console.log("new state for VALIDATION_ERROR is", {...state, validationErrors:action.payload,
            showErrors: true});
            return {...state, validationErrors: action.payload.validationErrors,
                showErrors: action.payload.showErrors};
        case 'DEFAULT_MACD_SETTING':
            var defaultPayload = createDefaultMacdPayload();
            var updatedState = update(state, {$merge: defaultPayload});
            return updatedState;
    }

    return state;

}

export function createDefaultMacdPayload() {
    var payload = {
        isEnabled: true,
        triggerTypeSelected: 'FAST_SLOW_MA_CROSS',
        triggerDirectionSelected: 'ABOVE',
        triggerWithinDaysInput: '10',
    };

    return payload;
}