import { combineReducers } from "redux";

import authReducer from "./authReducer";

const rootReducer = combineReducers({
    authStatus: authReducer
});

export default rootReducer;