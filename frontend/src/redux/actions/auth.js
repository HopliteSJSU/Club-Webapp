/**
 * Modudle for authentication related actions
 */

import { LOGIN, REGISTER } from "redux/actions/types";

export const login = ({ email, password }) => {
    return dispatch => {
        axios.post(
            "/api/auth/login", {
                email, password
            })
            .then(res => {
                if (res.data.success) {
                    let { user, token } = res.data;

                    dispatch({
                        type: LOGIN,
                        payload: {
                            user, token
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
};

export const register = ({ email, password, name }) => {
    return dispatch => {
        axios.post(
            "/api/auth/register", {
                email, password, name
            })
            .then(res => {
                if (res.data.success) {
                    dispatch({
                        type: REGISTER,
                        payload: {
                            user, token
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
};