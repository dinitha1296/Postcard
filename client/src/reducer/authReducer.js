import { AuthActionTypesEnum } from "../actions/authActions";

export const AuthStatusEnum = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT"
}

const initialState = AuthStatusEnum.LOGOUT;

export default function authReducer(state = initialState, action) {
    switch(action.type) {
        case AuthActionTypesEnum.LOGIN:
            return AuthStatusEnum.LOGIN
        case AuthActionTypesEnum.LOGOUT:
            return AuthStatusEnum.LOGOUT;
        case AuthActionTypesEnum.REGISTER:
            return AuthStatusEnum.LOGIN;
        default:
            return state;
    } 
}