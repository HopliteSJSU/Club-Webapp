import { combineReducers } from "redux";

import AuthReducer from "redux/reducers/auth";

export default combineReducers({
    auth: AuthReducer
});