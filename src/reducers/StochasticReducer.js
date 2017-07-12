/**
 * Created by jzheng on 6/18/17.
 */
import {ruleRunner, required, between0and100} from '../validation/ruleRunner.js'
import update from 'immutability-helper'

export default function reducer(state = {
    isEnabled: true,
    isValid: false,
    screenerSubtypeSelected: '',
    triggerTypeSelected: '',
    triggerDirectionSelected: '',
    triggerUpperBound: '',
    triggerLowerBound: '',
    triggerTarget: '',
    showErrors: false,
    fieldValidations: [
        ruleRunner('screenerSubtypeSelected', 'Screener subtype', required),
        ruleRunner("triggerDirectionSelected", "Trigger direction", required),
        ruleRunner("triggerTypeSelected", "Trigger type selected", required),
        ruleRunner("triggerLowerBound", "Lower Bound", required, between0and100),
        ruleRunner("triggerUpperBound", "Upper Bound", required, between0and100),
        ruleRunner("triggerTarget", "Trigger Bound", required, between0and100)],
    validationErrors: '',
}, action) {

    var payload = action.payload;
    switch (action.type) {
        case 'STOCHASTIC_UPDATE_ALL':
            var newState = update(state, {$merge: payload});
            newState.fieldValidations = [
                ruleRunner('screenerSubtypeSelected', 'Screener subtype', required),
                ruleRunner("triggerDirectionSelected", "Trigger direction", required),
                ruleRunner("triggerTypeSelected", "Trigger type selected", required),
            ];
            if (newState.triggerDirectionSelected == 'ABOVE' || newState.triggerDirectionSelected == 'BELOW') {
                newState.fieldValidations.push(ruleRunner("triggerTarget", "Trigger Bound", required, between0and100));
            } else if (newState.triggerDirectionSelected == 'BETWEEN') {
                newState.fieldValidations.push(ruleRunner("triggerLowerBound", "Lower Bound", required, between0and100));
                newState.fieldValidations.push(ruleRunner("triggerUpperBound", "Upper Bound", required, between0and100));
            }
            return newState;

        case 'STOCHASTIC_TOGGLE_ON_OFF':
            return {...state, isEnabled: action.payload};

        case 'STOCHASTIC_VALIDATION_ERROR':
            console.log("new state for STOCHASTIC_VALIDATION_ERROR is", {...state, validationErrors:action.payload,
                showErrors: true});
            return {...state, validationErrors: action.payload.validationErrors,
                showErrors: action.payload.showErrors};
        case 'DEFAULT_STOCHASTIC_SETTING':
            var defaultPayload = createDefaultStochPayload();
            var updatedState = update(state, {$merge: defaultPayload});
            return updatedState;
    }

    return state;
}

export function createDefaultStochPayload() {
    var payload = {
        isEnabled: true,
        screenerSubtypeSelected: 'RSI',
        triggerTypeSelected: 'SLOW_AND_FAST_MA',
        triggerDirectionSelected: 'BETWEEN',
        triggerUpperBound: '20',
        triggerLowerBound: '0'
    };

    return payload;
}