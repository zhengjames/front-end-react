/**
 * Created by jzheng on 6/17/17.
 */

import {ruleRunner, required} from '../validation/ruleRunner.js'

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
    switch(action.type) {
        case "MACD_UPDATE_ALL":
            var newState = {...state,
                isValid:action.payload.isValid,
                triggerTypeSelected: action.payload.triggerTypeSelected,
                triggerDirectionSelected: action.payload.triggerDirectionSelected,
                triggerWithinDaysInput: action.payload.triggerWithinDaysInput,
                showErrors: action.payload.showErrors,
                validationErrors: action.payload.validationErrors
            };
            return newState;
        case 'MACD_TOGGLE_ON_OFF':
            console.log("new state is ", {...state, isEnabled:action.payload});
            return {...state, isEnabled:action.payload};

        case 'MACD_VALIDATION_ERROR':
            console.log("new state for VALIDATION_ERROR is", {...state, validationErrors:action.payload,
            showErrors: true});
            return {...state, validationErrors: action.payload.validationErrors,
                showErrors: action.payload.showErrors};
    }

    return state;

}