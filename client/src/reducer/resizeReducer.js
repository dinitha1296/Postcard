import { ResizeActionTypesEnum } from "../actions/resizeActions";

export const ResizeStatusEnum = {
    MOBILE: true,
    NON_MOBILE: false
}

const initialState = window.innerWidth <= 500;

export default function resizeReducer(state = initialState, action) {
    switch(action.type) {
        case ResizeActionTypesEnum.RESIZE:
            return action.payload <= 500 ? ResizeStatusEnum.MOBILE :  ResizeStatusEnum.NON_MOBILE;
        default:
            return state;
    }
}
