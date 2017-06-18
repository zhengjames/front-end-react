/**
 * Created by jzheng on 6/17/17.
 */
export default function reducer(state = {
        isEnabled: true,
        isValid: false,
        triggerTypeSelected: '',
        triggerDirectionSelected: '',
        triggerWithinDaysSelected: 10
}, action) {
    switch(action.type) {
        case "MACD_UPDATE_ALL":
            var newState = {...state, isEnabed:action.payload.isEnabled,
                isValid:action.payload.isValid,
                triggerTypeSelected: action.payload.triggerTypeSelected,
                triggerDirectionSelected: action.payload.triggerDirectionSelected,
                triggerWithinDaysSelected: action.payload.triggerWithinDaysSelected
            };
            console.log("new state is ", newState);
            return newState;
        case 'MACD_TOGGLE_ON_OFF':
            console.log("new state is ", {...state, isEnabled:action.payload});
            return {...state, isEnabled:action.payload};


    }

    return state;

}