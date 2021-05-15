// import { useReducer } from "react";
import userServices from "../services/user.services";

export const AuthActionTypesEnum = {
    LOGIN: "authStatus/login",
    LOGOUT: "authStatus/logout",
    REGISTER: "authStatus/register"
}

export const loginAction = (user) => {
    return {
        type: AuthActionTypesEnum.LOGIN,
        payload: user
    }
}

export const registerAction = (userCredentials) => {
    return {
        type: AuthActionTypesEnum.REGISTER,
        payload: userCredentials
    }
}

export const logoutAction = () => {
    return {
        type: AuthActionTypesEnum.LOGOUT
    }
}

export const login = (dispatch) => async (username, password,  err) => {
    await userServices.login(
        username, 
        password, 
        (user) => {
            dispatch(loginAction(user));
        }, 
        (error) => {
            err(error)
        });
}

export const logout = (dispatch) => async (err) => {
    await userServices.logout(
        () => {
            dispatch(logoutAction());
        }, 
        (error) => {
            err(error)
        });
}

export const register = (dispatch) => async (userData, err) => {
    await userServices.register(
        userData, 
        (user) => {
            dispatch(registerAction(user));
        }, 
        (error) => {
            err(error)
        });
}