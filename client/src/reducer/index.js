import { combineReducers } from "redux";

import authReducer from "./authReducer";
import resizeReducer from './resizeReducer'

const rootReducer = combineReducers({
    authStatus: authReducer,
    isMobile: resizeReducer
});

export default rootReducer;