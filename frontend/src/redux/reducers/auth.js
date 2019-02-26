import { LOGIN, REGISTER } from "../actions";

const initialState = {
    user: null,
    token: null
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.payload.user, 
                token: action.payload.token
            };

        case REGISTER:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token
            };

        default:
            return state;
    }
};