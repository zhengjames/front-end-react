/**
 * Created by jzheng on 6/18/17.
 */

export default function reducer(state = {
    isEnabled: true,
    isValid: false,
    screenerSubtypeSelected: '',
    triggerTypeSelected: '',
    triggerDirectionSelected: ''
}, action) {

    switch (action.type) {
        case 'STOCHASTIC_UPDATE_ALL':
            var newState = {...state,
                screenerSubtypeSelected: action.payload.screenerSubtypeSelected,
                triggerTypeSelected: action.payload.triggerTypeSelected,
                triggerDirectionSelected: action.payload.triggerDirectionSelected};
            return newState;

        case 'STOCHASTIC_TOGGLE_ON_OFF':
            return {...state, isEnabled: action.payload};

    }

    return state;
}