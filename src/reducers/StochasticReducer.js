/**
 * Created by jzheng on 6/18/17.
 */

export default function reducer(state = {
    isEnabled: true,
    isValid: false,
    screenerSubtypeSelected: '',
    triggerTypeSelected: '',
    triggerDirectionSelected: '',
    triggerUpperBound: '',
    triggerLowerBound: '',
    triggerTarget: ''
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

    }

    return state;
}