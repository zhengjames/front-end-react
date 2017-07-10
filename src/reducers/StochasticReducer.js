/**
 * Created by jzheng on 6/18/17.
 */
import {ruleRunner, required, between0and100} from '../validation/ruleRunner.js'

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

    switch (action.type) {
        case 'STOCHASTIC_UPDATE_ALL':
            var newState = {...state,
                screenerSubtypeSelected: action.payload.screenerSubtypeSelected,
                triggerTypeSelected: action.payload.triggerTypeSelected,
                triggerDirectionSelected: action.payload.triggerDirectionSelected,
                triggerUpperBound : action.payload.triggerUpperBound,
                triggerLowerBound : action.payload.triggerLowerBound,
                triggerTarget : action.payload.triggerTarget,
                showErrors: action.payload.showErrors,
                validationErrors: action.payload.validationErrors
            };
            return newState;

        case 'STOCHASTIC_TOGGLE_ON_OFF':
            return {...state, isEnabled: action.payload};

        case 'STOCHASTIC_VALIDATION_ERROR':
            console.log("new state for STOCHASTIC_VALIDATION_ERROR is", {...state, validationErrors:action.payload,
                showErrors: true});
            return {...state, validationErrors: action.payload.validationErrors,
                showErrors: action.payload.showErrors};

    }

    return state;
}