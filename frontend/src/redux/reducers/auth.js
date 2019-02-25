import { LOGIN, REGISTER } from "../actions";

const initialState = {
    user: null,
    token: null
}

export default AuthReducer = (state, action) => {
    switch(action.type) {
        case LOGIN:
            let { user, token } = action.payload;

            return {
                ...state,
                user, token
            };

        case REGISTER:
            let { user, token } = action.payload;

            return {
                ...state,
                user, token
            };

        default:
            return state;
    }
};